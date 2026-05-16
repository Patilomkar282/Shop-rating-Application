import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, KeyRound, LogOut, User as UserIcon } from 'lucide-react';

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('name') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/user', icon: <LayoutDashboard size={20} /> },
    { name: 'Rate Stores', path: '/user/stores', icon: <Store size={20} /> },
    { name: 'Update Password', path: '/user/security', icon: <KeyRound size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <UserIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight truncate w-36">{userName}</h2>
              <p className="text-xs text-slate-500 font-medium">Normal User</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} className="text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
