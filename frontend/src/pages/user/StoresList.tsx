import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { Store, Star, ArrowUpDown, Search, MapPin } from 'lucide-react';
import StarRatingModal from '../../components/StarRatingModal';

interface StoreData {
  id: number;
  name: string;
  address: string;
  averageRating: string | number | null;
  myRating: number | null;
  ratingId: number | null;
}

type SortKey = 'name' | 'address' | 'averageRating' | 'myRating';

export default function StoresList() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  // Modal State
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; storeId: number; existingRating: number; ratingId: number | null }>({
    isOpen: false,
    storeId: 0,
    existingRating: 0,
    ratingId: null,
  });

  const fetchStores = async () => {
    try {
      const response = await api.get('/user/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

    // 1. Search (Filter)
    if (searchName) result = result.filter(s => s.name.toLowerCase().includes(searchName.toLowerCase()));
    if (searchAddress) result = result.filter(s => (s.address || '').toLowerCase().includes(searchAddress.toLowerCase()));

    // 2. Sort
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (sortConfig.key === 'averageRating' || sortConfig.key === 'myRating') {
          const aVal = Number(a[sortConfig.key] || 0);
          const bVal = Number(b[sortConfig.key] || 0);
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
  }, [stores, searchName, searchAddress, sortConfig]);

  if (loading) return <div className="animate-pulse h-96 w-full bg-white rounded-3xl border border-slate-200"></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Explore Stores</h1>
        <p className="text-slate-500 mt-2">Find and rate your favorite stores registered on our platform.</p>
      </div>

      {/* Search Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 shadow-sm flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Store Name..." 
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="relative flex-1 min-w-[250px]">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Address..." 
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2"><Store size={14} className="text-slate-400" /> Store Name <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('address')}>
                  <div className="flex items-center gap-2">Address <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('averageRating')}>
                  <div className="flex items-center gap-2">Overall Rating <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('myRating')}>
                  <div className="flex items-center gap-2 text-emerald-700">Your Rating <ArrowUpDown size={14} className="text-emerald-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{store.name}</td>
                  <td className="px-6 py-4">
                    <span className="truncate max-w-[250px] inline-block">{store.address || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 w-fit">
                      <Star size={14} className={store.averageRating ? "fill-amber-500 text-amber-500" : "text-slate-400"} /> 
                      {store.averageRating ? Number(store.averageRating).toFixed(1) : 'No Ratings'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {store.myRating ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
                        <Star size={14} className="fill-emerald-500 text-emerald-500" /> {store.myRating}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider bg-slate-50 px-2 py-1 rounded border border-slate-100">Not Rated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setRatingModal({ isOpen: true, storeId: store.id, existingRating: store.myRating || 0, ratingId: store.ratingId })}
                      className={`font-semibold px-4 py-1.5 rounded-lg transition-colors border ${
                        store.myRating 
                          ? 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border-blue-200' 
                          : 'text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                      }`}
                    >
                      {store.myRating ? 'Modify Rating' : 'Submit Rating'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAndSortedStores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No stores found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StarRatingModal 
        isOpen={ratingModal.isOpen} 
        onClose={() => setRatingModal({ ...ratingModal, isOpen: false })}
        storeId={ratingModal.storeId}
        existingRating={ratingModal.existingRating}
        ratingId={ratingModal.ratingId}
        onSuccess={fetchStores}
      />
    </div>
  );
}
