import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { Star, Store, MapPin, Mail, Shield, User, ArrowUpDown } from 'lucide-react';

interface DashboardData {
  profile: { name: string; email: string; address: string; role: string; };
  stats: { averageRating: number; };
}

interface RatingData {
  id: number;
  rating: number;
  created_at: string;
  userName: string;
  userEmail: string;
  storeName: string;
}

export default function OwnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState(true);

  type SortKey = 'userName' | 'userEmail' | 'storeName' | 'rating' | 'created_at';
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, ratingsRes] = await Promise.all([
          api.get('/owner/dashboard'),
          api.get('/owner/ratings')
        ]);
        setData(dashboardRes.data);
        setRatings(ratingsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRatings = useMemo(() => {
    let sortableItems = [...ratings];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'rating') {
          return sortConfig.direction === 'asc' ? a.rating - b.rating : b.rating - a.rating;
        }
        if (sortConfig.key === 'created_at') {
          const aTime = new Date(a.created_at).getTime();
          const bTime = new Date(b.created_at).getTime();
          return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
        }
        const aVal = (a[sortConfig.key] || '').toString().toLowerCase();
        const bVal = (b[sortConfig.key] || '').toString().toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [ratings, sortConfig]);

  if (loading) return <div className="animate-pulse flex gap-6"><div className="h-96 w-full bg-slate-200 rounded-2xl"></div></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {(data?.profile?.name || localStorage.getItem('name') || 'Store Owner').split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your store and view customer ratings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Average Rating Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-center">
          <div className="absolute -right-6 -top-6 w-48 h-48 bg-amber-50 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10 flex items-center gap-8">
            <div className="p-6 rounded-3xl bg-amber-50 text-amber-500 shadow-inner">
              <Star size={64} className="fill-amber-500" />
            </div>
            <div>
              <p className="text-slate-500 font-bold uppercase tracking-wider mb-2">Your Store's Average Rating</p>
              <h3 className="text-6xl font-bold text-amber-600">
                {Number(data?.stats?.averageRating || (data as any)?.averageRating || 0).toFixed(1)} <span className="text-3xl text-slate-400">/ 5</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm">
              <Store size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{data?.profile?.name || localStorage.getItem('name')}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border bg-emerald-100 text-emerald-700 border-emerald-200 mt-1">
                <Shield size={12} /> Store Owner
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</p>
              <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{data?.profile?.email || localStorage.getItem('email')}</span>
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

      {/* List of Users Who Submitted Ratings */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User size={22} className="text-emerald-500" /> Users Who Rated Your Store
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('userName')}>
                  <div className="flex items-center gap-2">Customer Name <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('userEmail')}>
                  <div className="flex items-center gap-2">Email Address <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('storeName')}>
                  <div className="flex items-center gap-2">Store Name <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('rating')}>
                  <div className="flex items-center gap-2">Given Rating <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold text-slate-900 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('created_at')}>
                  <div className="flex items-center gap-2">Date <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedRatings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.userName}</td>
                  <td className="px-6 py-4">{item.userEmail}</td>
                  <td className="px-6 py-4 font-medium">{item.storeName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2.5 py-1.5 rounded-lg w-fit border border-amber-100 shadow-sm">
                      <Star size={16} className="fill-amber-500 text-amber-500" /> {item.rating} / 5
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {ratings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No customers have rated your store yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
