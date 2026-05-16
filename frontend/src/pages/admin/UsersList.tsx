import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { UserPlus, Shield, MapPin, Mail, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserData {
  id: number;
  name: string;
  email: string;
  address: string;
  role: string;
}

type SortKey = 'name' | 'email' | 'address' | 'role';

export default function UsersList() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // 1. Filter
    if (filters.name) result = result.filter(u => u.name.toLowerCase().includes(filters.name.toLowerCase()));
    if (filters.email) result = result.filter(u => u.email.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.address) result = result.filter(u => (u.address || '').toLowerCase().includes(filters.address.toLowerCase()));
    if (filters.role) result = result.filter(u => u.role === filters.role);

    // 2. Sort
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aVal = (a[sortConfig.key] || '').toLowerCase();
        const bVal = (b[sortConfig.key] || '').toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [users, filters, sortConfig]);

  if (loading) return <div className="animate-pulse h-96 w-full bg-white rounded-3xl border border-slate-200"></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-2">View and filter all registered users in the system.</p>
        </div>
        <Link to="/admin/users/new" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
          <UserPlus size={18} /> Add User
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-6 shadow-sm flex flex-wrap gap-4">
        <input 
          type="text" 
          placeholder="Filter by Name..." 
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
        <select 
          className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Name <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-2">Email Address <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('address')}>
                  <div className="flex items-center gap-2">Address <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('role')}>
                  <div className="flex items-center gap-2">Role <ArrowUpDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail size={14} /> {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 max-w-[200px]">
                      <MapPin size={14} className="shrink-0" /> <span className="truncate">{user.address || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${
                      user.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                      user.role === 'STORE_OWNER' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      <Shield size={12} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link to={`/admin/users/${user.id}`} className="text-emerald-600 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100 px-4 py-1.5 rounded-lg transition-colors border border-emerald-200">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredAndSortedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No users match the given filters.
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
