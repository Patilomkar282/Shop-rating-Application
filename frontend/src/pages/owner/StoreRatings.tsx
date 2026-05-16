import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Star } from 'lucide-react';

interface RatingData {
  id: number;
  rating: number;
  created_at: string;
  userName: string;
  userEmail: string;
  storeName: string;
}

export default function StoreRatings() {
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await api.get('/owner/ratings');
        setRatings(response.data);
      } catch (error) {
        console.error('Failed to fetch store ratings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  if (loading) return <div className="animate-pulse h-96 w-full bg-white rounded-3xl border border-slate-200"></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Customer Ratings</h1>
        <p className="text-slate-500 mt-2">View all ratings and reviews submitted for your stores.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer Name</th>
                <th className="px-6 py-4 font-semibold">Customer Email</th>
                <th className="px-6 py-4 font-semibold">Store</th>
                <th className="px-6 py-4 font-semibold">Rating Given</th>
                <th className="px-6 py-4 font-semibold">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ratings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.userName}</td>
                  <td className="px-6 py-4">{item.userEmail}</td>
                  <td className="px-6 py-4">{item.storeName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-md w-fit border border-amber-100">
                      <Star size={16} className="fill-amber-500 text-amber-500" /> {item.rating} / 5
                    </div>
                  </td>
                  <td className="px-6 py-4">{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {ratings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No ratings have been submitted for your stores yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
