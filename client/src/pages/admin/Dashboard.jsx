import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome, {user?.name}. Manage tables and reservations here.</p>
    </div>
  );
};

export default Dashboard;
