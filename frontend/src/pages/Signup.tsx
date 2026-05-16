import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, User, MapPin, Loader2, AlertCircle, Shield, Star, Store, TrendingUp } from 'lucide-react';

const signupSchema = z.object({
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

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/auth/signup', data);
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Graphic & Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-800 relative flex-col justify-center items-center overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 blur-[100px] rounded-full"></div>

        <div className="relative z-10 p-12 max-w-xl text-white">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
            <Star className="fill-amber-400 text-amber-400" size={20} />
            <span className="font-semibold tracking-wide">Community Rating Platform</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Join the Community Today
          </h1>
          <p className="text-emerald-50/80 text-lg mb-12 leading-relaxed">
            Create an account to start exploring stores, sharing your valuable experiences, and helping others make better decisions through honest ratings.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <Store className="text-emerald-200 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-1">Store Owners</h3>
              <p className="text-emerald-100/70 text-sm">Register your business and gather feedback.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <TrendingUp className="text-emerald-200 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-1">Reviewers</h3>
              <p className="text-emerald-100/70 text-sm">Rate businesses and build a strong community.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-4 sm:px-12 py-12 relative overflow-y-auto max-h-screen">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-emerald-900/5 border border-slate-100 my-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Create an Account
            </h2>
            <p className="text-slate-500 text-sm">Join us to start rating your favorite stores</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-200 text-red-600 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <p>{errorMsg}</p>
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-200 text-emerald-600 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Secure Password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            {/* Address Field */}
            <div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <textarea
                  {...register('address')}
                  placeholder="Physical Address (Optional)"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 min-h-[90px] resize-none"
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.address.message}</p>}
            </div>

            {/* Role Field */}
            <div>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <select
                  {...register('role')}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none"
                >
                  <option value="USER">Normal User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.role.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:pointer-events-none mt-6"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors underline decoration-emerald-200 underline-offset-4 hover:decoration-emerald-600">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
