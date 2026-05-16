import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, Loader2, AlertCircle, Star, Store, Users, TrendingUp } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', data);
      const { token, role, name } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'STORE_OWNER') navigate('/owner');
      else navigate('/user');

    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Invalid credentials or server error.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Graphic & Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-800 relative flex-col justify-center items-center overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/20 blur-[100px] rounded-full"></div>

        <div className="relative z-10 p-12 max-w-xl text-white">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
            <Star className="fill-amber-400 text-amber-400" size={20} />
            <span className="font-semibold tracking-wide">Community Rating Platform</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Discover and Rate the Best Local Stores
          </h1>
          <p className="text-emerald-50/80 text-lg mb-12 leading-relaxed">
            Join our platform to explore top-rated businesses, read authentic community reviews, and share your own experiences to help others make informed decisions.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <Store className="text-emerald-200 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-1">Explore</h3>
              <p className="text-emerald-100/70 text-sm">Discover hundreds of registered stores.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
              <TrendingUp className="text-emerald-200 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-1">Rate</h3>
              <p className="text-emerald-100/70 text-sm">Help businesses improve through feedback.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 px-4 sm:px-12 relative">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-emerald-900/5 border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 mb-6 shadow-inner">
              <Lock className="text-emerald-600" size={28} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm">Please enter your credentials to continue</p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-200 text-red-600 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  placeholder="Password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-emerald-600/20"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors underline decoration-emerald-200 underline-offset-4 hover:decoration-emerald-600">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
