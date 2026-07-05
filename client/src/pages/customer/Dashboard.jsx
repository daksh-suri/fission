import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>
      <p className="text-gray-600">Use the navigation to manage your reservations.</p>
    </div>
  );
};

export default Dashboard;
