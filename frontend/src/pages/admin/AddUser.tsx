import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Mail, Lock, User, MapPin, Loader2, AlertCircle, Shield } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name cannot exceed 60 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/, 'Must contain 1 uppercase letter and 1 special character'),
  address: z.string().max(400, 'Address cannot exceed 400 characters').optional(),
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']).default('USER'),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AddUser() {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormValues) => {
    setErrorMsg('');
    try {
      await api.post('/admin/users', data);
      navigate('/admin/users');
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to create user.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Add New User</h1>
        <p className="text-slate-500 mt-2">Manually register a new user in the system.</p>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
        {errorMsg && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            <AlertCircle size={18} />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Form fields identical to Signup but adapted for admin */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input {...register('name')} type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input {...register('email')} type="email" className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input {...register('password')} type="password" className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Assignment</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select {...register('role')} className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none">
                <option value="USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
            {errors.role && <p className="text-red-500 text-xs mt-1.5">{errors.role.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address (Optional)</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea {...register('address')} className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all min-h-[100px] resize-none" />
            </div>
            {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>}
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={() => navigate('/admin/users')} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex justify-center items-center gap-2 disabled:opacity-70">
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
