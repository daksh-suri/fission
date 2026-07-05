import { useState, useEffect } from 'react';
import { computeSlotTimes } from '../../utils/format';
import { STATUS_COLORS } from '../../constants';

const EditRow = ({ reservation, onSave, onCancel, saving, slots }) => {
  const start = new Date(reservation.startTime);
  const [date, setDate] = useState(start.toISOString().slice(0, 10));
  const [slotId, setSlotId] = useState('');
  const [guests, setGuests] = useState(reservation.numberOfGuests);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slots.length > 0) {
      const startH = String(start.getHours()).padStart(2, '0');
      const startM = String(start.getMinutes()).padStart(2, '0');
      const timeStr = `${startH}:${startM}`;
      const matched = slots.find((s) => s.startTime === timeStr);
      setSlotId(matched?._id || '');
    }
  }, [slots]);

  const handleSave = () => {
    const slot = slots.find((s) => s._id === slotId);
    if (!slot) {
      setError('Please select a time slot');
      return;
    }

    const { startTime, endTime } = computeSlotTimes(date, slot);

    onSave({
      startTime,
      endTime,
      numberOfGuests: Number(guests),
    });
  };

  return (
    <tr className="bg-yellow-50">
      <td className="px-4 py-2 text-sm text-gray-500">
        {reservation.user?.name}<br /><span className="text-xs">{reservation.user?.email}</span>
      </td>
      <td className="px-4 py-2">Table {reservation.table?.tableNumber}</td>
      <td className="px-4 py-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full" />
      </td>
      <td className="px-4 py-2">
        <select value={slotId} onChange={(e) => { setSlotId(e.target.value); setError(''); }}
          className="border rounded px-2 py-1 text-sm w-full">
          <option value="">Select slot</option>
          {slots.map((s) => (
            <option key={s._id} value={s._id}>{s.name} ({s.startTime}–{s.endTime})</option>
          ))}
        </select>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </td>
      <td className="px-4 py-2">
        <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-20" />
      </td>
      <td className="px-4 py-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[reservation.status]}`}>
          {reservation.status}
        </span>
      </td>
      <td className="px-4 py-2 flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </td>
    </tr>
  );
};

export default EditRow;
