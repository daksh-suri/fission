import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    signout();
    navigate('/signin');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <span className="text-white font-bold text-lg">Admin Panel</span>
              <NavLink to="/admin/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/tables" className={linkClass}>
                Tables
              </NavLink>
              <NavLink to="/admin/slots" className={linkClass}>
                Slots
              </NavLink>
              <NavLink to="/admin/reservations" className={linkClass}>
                Reservations
              </NavLink>
            </div>
            <button
              onClick={handleSignout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
