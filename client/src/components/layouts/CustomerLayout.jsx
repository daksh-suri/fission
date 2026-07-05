import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomerLayout = () => {
  const { signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    signout();
    navigate('/signin');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-500'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <span className="text-white font-bold text-lg">Restaurant</span>
              <NavLink to="/customer/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/customer/reservations" end className={linkClass}>
                Reservations
              </NavLink>
              <NavLink to="/customer/reservations/new" className={linkClass}>
                Book a Table
              </NavLink>
            </div>
            <button
              onClick={handleSignout}
              className="px-3 py-2 rounded-md text-sm font-medium text-indigo-200 hover:bg-indigo-500"
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

export default CustomerLayout;
