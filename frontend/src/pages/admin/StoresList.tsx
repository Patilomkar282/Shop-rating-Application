import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { Store, UserPlus, MapPin, Mail, ArrowUpDown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoreData {
  id: number;
  name: string;
  email: string;
  address: string;
  ownerName: string;
  averageRating: string | number | null;
}

type SortKey = 'name' | 'email' | 'address' | 'ownerName' | 'averageRating';

export default function StoresList() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: ''
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/admin/stores');
        setStores(response.data);
      } catch (error) {
        console.error('Failed to fetch stores');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedStores = useMemo(() => {
    let result = [...stores];

    // 1. Filter
    if (filters.name) result = result.filter(s => s.name.toLowerCase().includes(filters.name.toLowerCase()));
    if (filters.email) result = result.filter(s => s.email.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.address) result = result.filter(s => (s.address || '').toLowerCase().includes(filters.address.toLowerCase()));

    // 2. Sort
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (sortConfig.key === 'averageRating') {
          const aVal = Number(a.averageRating || 0);
          const bVal = Number(b.averageRating || 0);
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aVal = (a[sortConfig.key] || '').toString().toLowerCase();
        const bVal = (b[sortConfig.key] || '').toString().toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [stores, filters, sortConfig]);

  if (loading) return <div className="animate-pulse h-96 w-full bg-white rounded-3xl border border-slate-200"></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Stores Management</h1>
          <p className="text-slate-500 mt-2">View and filter all registered stores.</p>
        </div>
        <Link to="/admin/stores/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
          <UserPlus size={18} /> Register Store
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 shadow-sm flex flex-wrap gap-4">
        <input 
          type="text" 
          placeholder="Filter by Store Name..." 
          className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Filter by Email..." 
          className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Filter by Address..." 
          className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2"><Store size={14} className="text-slate-400" /> Store Name <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('ownerName')}>
                  <div className="flex items-center gap-2">Owner <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-2">Email <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('address')}>
                  <div className="flex items-center gap-2">Address <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('averageRating')}>
                  <div className="flex items-center gap-2">Rating <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{store.name}</td>
                  <td className="px-6 py-4 font-medium text-emerald-700">{store.ownerName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail size={14} /> {store.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 max-w-[200px]">
                      <MapPin size={14} className="shrink-0" /> <span className="truncate">{store.address || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-100 w-fit">
                      <Star size={14} className="fill-amber-500 text-amber-500" /> {store.averageRating ? Number(store.averageRating).toFixed(1) : 'New'}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAndSortedStores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No stores match the given filters.
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
