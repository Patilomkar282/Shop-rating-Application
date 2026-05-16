import { useState, useEffect } from 'react';
import { Star, X, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface StarRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
  existingRating: number;
  ratingId: number | null;
  onSuccess: () => void;
}

export default function StarRatingModal({ isOpen, onClose, storeId, existingRating, ratingId, onSuccess }: StarRatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRating(existingRating || 0);
      setHoverRating(0);
      setErrorMsg('');
    }
  }, [isOpen, existingRating]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setErrorMsg('Please select a rating from 1 to 5 stars.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      if (ratingId) {
        await api.put(`/user/ratings/${ratingId}`, { rating });
      } else {
        await api.post('/user/ratings', { store_id: storeId, rating });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/10 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{ratingId ? 'Modify Rating' : 'Submit Rating'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8">
          <p className="text-center text-slate-500 mb-6">How would you rate your experience with this store?</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={42}
                  className={`transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-100 text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
              <AlertCircle size={16} />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
