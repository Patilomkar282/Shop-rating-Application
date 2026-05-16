import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Store, Star, Award, Shield, User, MapPin, Mail, ArrowRight, Lock, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardData {
  profile: { name: string; email: string; address: string; role: string; };
  stats: { totalStores: number; myRatings: number; pendingRatings: number; };
  recentRatings: { storeName: string; rating: number; date: string; }[];
  topStores: { storeName: string; overallRating: number; }[];
}

export default function UserDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/user/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="animate-pulse flex gap-6"><div className="h-96 w-full bg-slate-200 rounded-2xl"></div></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      {/* 1. Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {data?.profile?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your store ratings and explore registered stores.</p>
      </div>

      {/* 2. Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-slate-500 font-medium mb-1">Total Stores</p>
              <h3 className="text-4xl font-bold text-slate-900">{data?.stats?.totalStores || 0}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-500">
              <Store size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-slate-500 font-medium mb-1">Your Ratings</p>
              <h3 className="text-4xl font-bold text-slate-900">{data?.stats?.myRatings || 0}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-500">
              <Star size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-slate-500 font-medium mb-1">Pending Ratings</p>
              <h3 className="text-4xl font-bold text-slate-900">{data?.stats?.pendingRatings || 0}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-500">
              <Award size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-10">
        <Link to="/user/stores" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
          <Store size={18} /> View Stores
        </Link>
        <Link to="/user/stores" className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
          <Star size={18} className="text-amber-500" /> My Ratings
        </Link>
        <Link to="/user/security" className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
          <Lock size={18} className="text-emerald-500" /> Update Password
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* 4. Recent Ratings Section */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock size={20} className="text-emerald-500" /> Recent Ratings
              </h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-white border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Store Name</th>
                    <th className="px-6 py-4 font-semibold">Your Rating</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data?.recentRatings?.map((rating, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{rating.storeName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md w-fit border border-amber-100">
                          <Star size={14} className="fill-amber-500 text-amber-500" /> {rating.rating}/5
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{new Date(rating.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {!data?.recentRatings?.length && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">You haven't rated any stores yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Highest Rated Stores Preview */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award size={20} className="text-emerald-500" /> Highest Rated Stores
              </h3>
              <Link to="/user/stores" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {data?.topStores?.map((store, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <span className="font-bold text-slate-900">{store.storeName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Star size={16} className="fill-emerald-500 text-emerald-500" /> {Number(store.overallRating).toFixed(1)}
                    </div>
                  </div>
                ))}
                {!data?.topStores?.length && (
                  <p className="text-center text-slate-500 py-4">No ratings submitted platform-wide yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Profile Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{data?.profile?.name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border bg-emerald-100 text-emerald-700 border-emerald-200 mt-1">
                  <Shield size={12} /> Normal User
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{data?.profile?.email}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Address</p>
                <div className="flex items-start gap-2 text-slate-700 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100 min-h-[60px]">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 text-sm">{data?.profile?.address || <span className="text-slate-400 italic">No address provided</span>}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
