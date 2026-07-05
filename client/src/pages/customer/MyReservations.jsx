import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ReservationList from '../../components/reservations/ReservationList';
import * as reservationService from '../../services/reservation';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch {
      // error handled by api interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await reservationService.cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch {
      // error handled by api interceptor
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Reservations</h1>
        <Link
          to="/customer/reservations/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          + New Reservation
        </Link>
      </div>
      <ReservationList
        reservations={reservations}
        loading={loading}
        onCancel={handleCancel}
        cancellingId={cancellingId}
      />
    </div>
  );
};

export default MyReservations;
