import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Truck, Users, Building2, BarChart3, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive ? 'bg-brand-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-brand-600">A8I Dispatch</h1>
          <p className="text-xs text-gray-500 mt-1">TMS v1.0</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/" end className={linkClass}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/loads" className={linkClass}>
            <Truck size={20} /> Loads
          </NavLink>
          <NavLink to="/drivers" className={linkClass}>
            <Users size={20} /> Drivers
          </NavLink>
          <NavLink to="/brokers" className={linkClass}>
            <Building2 size={20} /> Brokers
          </NavLink>
          <NavLink to="/reports" className={linkClass}>
            <BarChart3 size={20} /> Reports
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-2">
            <p className="text-sm font-semibold text-gray-900">{user?.fullName || user?.username}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
