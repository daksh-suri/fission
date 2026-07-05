import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationForm from '../../components/reservations/ReservationForm';
import * as reservationService from '../../services/reservation';

const NewReservation = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await reservationService.createReservation(data);
      navigate('/customer/reservations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <ReservationForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default NewReservation;
