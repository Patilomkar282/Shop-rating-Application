import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Store, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse flex gap-6"><div className="h-32 w-full bg-slate-200 rounded-2xl"></div></div>;

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={32} className="text-emerald-500" />, color: 'bg-emerald-50', link: '/admin/users' },
    { title: 'Total Stores', value: stats?.totalStores || 0, icon: <Store size={32} className="text-emerald-500" />, color: 'bg-emerald-50', link: '/admin/stores' },
    { title: 'Total Ratings', value: stats?.totalRatings || 0, icon: <Star size={32} className="text-amber-500" />, color: 'bg-amber-50', link: '#' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome to the system administration panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${card.color} rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-medium mb-1">{card.title}</p>
                <h3 className="text-4xl font-bold text-slate-900">{card.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${card.color}`}>
                {card.icon}
              </div>
            </div>

            {card.link !== '#' && (
              <Link to={card.link} className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                View Details <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
