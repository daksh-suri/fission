import { useState, useEffect } from 'react';
import { getSlots } from '../../services/slot';
import { computeSlotTimes } from '../../utils/format';

const ReservationForm = ({ onSubmit, loading }) => {
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [guests, setGuests] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getSlots()
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setSlotsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !selectedSlot || !guests) {
      setError('All fields are required');
      return;
    }

    const slot = slots.find((s) => s._id === selectedSlot);
    if (!slot) {
      setError('Invalid slot selected');
      return;
    }

    try {
      const { startTime, endTime } = computeSlotTimes(date, slot);
      await onSubmit({
        startTime,
        endTime,
        numberOfGuests: Number(guests),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">New Reservation</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        required
      />

      <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
      {slotsLoading ? (
        <p className="text-gray-400 text-sm mb-4">Loading slots...</p>
      ) : slots.length === 0 ? (
        <p className="text-gray-500 text-sm mb-4">No time slots available. Please contact the restaurant.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {slots.map((slot) => (
            <button
              key={slot._id}
              type="button"
              onClick={() => setSelectedSlot(slot._id)}
              className={`px-3 py-2 rounded text-sm border text-left ${
                selectedSlot === slot._id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
              }`}
            >
              <span className="font-medium">{slot.name}</span>
              <br />
              <span className="text-xs opacity-80">{slot.startTime} – {slot.endTime}</span>
            </button>
          ))}
        </div>
      )}

      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
      <input
        type="number"
        min="1"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        required
      />

      <button
        type="submit"
        disabled={loading || slotsLoading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Reservation'}
      </button>
    </form>
  );
};

export default ReservationForm;
