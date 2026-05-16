import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { User, Mail, MapPin, Calendar, Shield, Star, ArrowLeft } from 'lucide-react';

interface UserDetailsData {
  id: number;
  name: string;
  email: string;
  address: string;
  role: string;
  created_at: string;
  storeRating?: number;
}

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="animate-pulse h-96 w-full bg-white rounded-3xl border border-slate-200 max-w-3xl mx-auto"></div>;
  if (!user) return <div className="text-center py-12 text-slate-500">User not found.</div>;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6">
        <Link to="/admin/users" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium text-sm">
          <ArrowLeft size={16} /> Back to Users
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-bl-full -z-10"></div>
        
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-md shrink-0">
            <User size={40} />
          </div>
          <div className="pt-2">
            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                user.role === 'ADMIN' ? 'bg-teal-100 text-teal-700 border-violet-200' :
                user.role === 'STORE_OWNER' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                'bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}>
                <Shield size={14} />
                {user.role}
              </span>
              <span className="text-slate-400 text-sm">ID: #{user.id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Email Address</p>
              <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Mail size={18} className="text-slate-400" />
                {user.email}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Physical Address</p>
              <div className="flex items-start gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[60px]">
                <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                {user.address || <span className="text-slate-400 italic">No address provided</span>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Joined Date</p>
              <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Calendar size={18} className="text-slate-400" />
                {new Date(user.created_at).toLocaleString()}
              </div>
            </div>

            {user.role === 'STORE_OWNER' && (
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Store Average Rating</p>
                <div className="flex items-center gap-2 text-amber-700 font-bold bg-amber-50 p-3 rounded-xl border border-amber-200 text-xl">
                  <Star size={24} className="fill-amber-500 text-amber-500" />
                  {user.storeRating ? Number(user.storeRating).toFixed(1) : 'No ratings yet'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
