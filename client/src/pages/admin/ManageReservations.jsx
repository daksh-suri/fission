import { useState, useEffect, useCallback } from 'react';
import * as reservationService from '../../services/reservation';
import { getSlots } from '../../services/slot';
import { formatDateShort as formatDate, formatTime } from '../../utils/format';
import { STATUS_COLORS } from '../../constants';
import EditRow from '../../components/reservations/EditRow';

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    getSlots().then((data) => setSlots(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (date) params.date = date;
      const result = await reservationService.getAllReservations(params);
      setReservations(result.reservations);
      setPagination(result.pagination);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [date, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDateFilter = (e) => {
    setDate(e.target.value);
    setPage(1);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await reservationService.adminCancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch {
      // handled by interceptor
    }
  };

  const handleSave = async (id, data) => {
    setSaving(true);
    setUpdateError('');
    try {
      const updated = await reservationService.adminUpdateReservation(id, data);
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? updated : r))
      );
      setEditingId(null);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update reservation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading reservations...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Reservations</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by date:</label>
          <input type="date" value={date} onChange={handleDateFilter}
            className="border rounded px-3 py-1.5 text-sm" />
          {date && (
            <button onClick={() => { setDate(''); setPage(1); }}
              className="text-sm text-gray-500 hover:text-gray-700">
              Clear
            </button>
          )}
        </div>
      </div>

      {updateError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {updateError}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No reservations found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Table</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Guests</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) =>
                  editingId === r._id ? (
                    <EditRow
                      key={r._id}
                      reservation={r}
                      slots={slots}
                      onSave={(data) => handleSave(r._id, data)}
                      onCancel={() => setEditingId(null)}
                      saving={saving}
                    />
                  ) : (
                    <tr key={r._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium">{r.user?.name}</p>
                        <p className="text-xs text-gray-500">{r.user?.email}</p>
                      </td>
                      <td className="px-4 py-3">Table {r.table?.tableNumber}</td>
                      <td className="px-4 py-3">{formatDate(r.startTime)}</td>
                      <td className="px-4 py-3">{formatTime(r.startTime)} – {formatTime(r.endTime)}</td>
                      <td className="px-4 py-3">{r.numberOfGuests}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[r.status]}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setEditingId(r._id)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            Edit
                          </button>
                          {r.status !== 'cancelled' && r.status !== 'completed' && (
                            <button
                              onClick={() => handleCancel(r._id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageReservations;
