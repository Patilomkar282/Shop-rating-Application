import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .regex(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/, 'Must contain 1 uppercase letter and 1 special character'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function UpdatePassword() {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.put('/auth/update-password', { newPassword: data.newPassword });
      setSuccessMsg('Your password has been updated successfully.');
      reset();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Security Settings</h1>
        <p className="text-slate-500 mt-2">Update your account password to stay secure.</p>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10"></div>
        
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200 shadow-inner">
          <Lock size={28} />
        </div>

        {errorMsg && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
            <AlertCircle size={18} />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-600 p-4 rounded-xl text-sm">
            <CheckCircle2 size={18} />
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                {...register('newPassword')} 
                type="password" 
                placeholder="Enter new strong password"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400" 
              />
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.newPassword.message}</p>}
            <p className="text-xs text-slate-500 mt-2 ml-1">Must be 8-16 chars, contain 1 uppercase letter and 1 special character.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                {...register('confirmPassword')} 
                type="password" 
                placeholder="Retype new password"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400" 
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex justify-center items-center gap-2 disabled:opacity-70 active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
