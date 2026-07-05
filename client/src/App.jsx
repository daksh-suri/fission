import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerLayout from './components/layouts/CustomerLayout';
import AdminLayout from './components/layouts/AdminLayout';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import CustomerDashboard from './pages/customer/Dashboard';
import MyReservations from './pages/customer/MyReservations';
import NewReservation from './pages/customer/NewReservation';
import AdminDashboard from './pages/admin/Dashboard';
import ManageTables from './pages/admin/ManageTables';
import ManageSlots from './pages/admin/ManageSlots';
import ManageReservations from './pages/admin/ManageReservations';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute allowedRole="customer" />}>
            <Route element={<CustomerLayout />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/reservations" element={<MyReservations />} />
              <Route path="/customer/reservations/new" element={<NewReservation />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/tables" element={<ManageTables />} />
              <Route path="/admin/slots" element={<ManageSlots />} />
              <Route path="/admin/reservations" element={<ManageReservations />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
