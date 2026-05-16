import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Mail, Store, MapPin, Loader2, AlertCircle, User } from 'lucide-react';

const storeSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().max(400, 'Address cannot exceed 400 characters'),
  owner_id: z.string().min(1, 'Please select a store owner'),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export default function AddStore() {
  const [errorMsg, setErrorMsg] = useState('');
  const [owners, setOwners] = useState<{id: number, name: string, email: string, address: string}[]>([]);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
  });

  const selectedOwnerId = watch('owner_id');

  useEffect(() => {
    if (selectedOwnerId) {
      const selectedOwner = owners.find(o => o.id.toString() === selectedOwnerId.toString());
      if (selectedOwner) {
        setValue('email', selectedOwner.email, { shouldValidate: true });
        setValue('address', selectedOwner.address || '', { shouldValidate: true });
      }
    }
  }, [selectedOwnerId, owners, setValue]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get('/admin/users');
        const storeOwners = response.data.filter((u: any) => u.role === 'STORE_OWNER');
        setOwners(storeOwners);
      } catch (error) {
        console.error('Failed to fetch owners');
      }
    };
    fetchOwners();
  }, []);

  const onSubmit = async (data: StoreFormValues) => {
    setErrorMsg('');
    try {
      await api.post('/admin/stores', {
        ...data,
        owner_id: parseInt(data.owner_id)
      });
      navigate('/admin/stores');
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to create store.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Register New Store</h1>
        <p className="text-slate-500 mt-2">Add a new store and assign it to a Store Owner.</p>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
        {errorMsg && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            <AlertCircle size={18} />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Store Name</label>
            <div className="relative">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input {...register('name')} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Store Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input {...register('email')} type="email" className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign Store Owner</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select {...register('owner_id')} className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none">
                <option value="">Select an owner...</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.name}</option>
                ))}
              </select>
            </div>
            {errors.owner_id && <p className="text-red-500 text-xs mt-1.5">{errors.owner_id.message}</p>}
            {owners.length === 0 && <p className="text-amber-600 text-xs mt-1.5">No Store Owners found. Create a Store Owner user first.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Store Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea {...register('address')} className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all min-h-[100px] resize-none" />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>}
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={() => navigate('/admin/stores')} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex justify-center items-center gap-2 disabled:opacity-70">
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Register Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
