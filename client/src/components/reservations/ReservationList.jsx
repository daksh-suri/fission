import ReservationCard from './ReservationCard';

const ReservationList = ({ reservations, loading, onCancel, cancellingId }) => {
  if (loading) {
    return <p className="text-gray-500">Loading reservations...</p>;
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No reservations yet</p>
        <p className="text-sm">Create your first reservation to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reservations.map((r) => (
        <ReservationCard
          key={r._id}
          reservation={r}
          onCancel={onCancel}
          cancelling={cancellingId === r._id}
        />
      ))}
    </div>
  );
};

export default ReservationList;
