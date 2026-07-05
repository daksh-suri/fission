import { formatDate, formatTime } from '../../utils/format';
import { STATUS_COLORS } from '../../constants';

const ReservationCard = ({ reservation, onCancel, cancelling }) => {
  const canCancel = reservation.status === 'confirmed' && onCancel;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm text-gray-500">{formatDate(reservation.startTime)}</p>
        <p className="font-medium">
          {formatTime(reservation.startTime)} – {formatTime(reservation.endTime)}
        </p>
        <p className="text-sm text-gray-600">
          {reservation.numberOfGuests} guest{reservation.numberOfGuests > 1 ? 's' : ''}
          {reservation.table && (
            <> · Table {reservation.table.tableNumber} (seats {reservation.table.capacity})</>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[reservation.status] || 'bg-gray-100'}`}>
          {reservation.status}
        </span>
        {canCancel && (
          <button
            onClick={() => onCancel(reservation._id)}
            disabled={cancelling}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
