import { useState, useEffect, useCallback } from 'react';
import * as slotService from '../../services/slot';

const emptyForm = { name: '', startTime: '', endTime: '' };

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    try {
      const data = await slotService.getSlots();
      setSlots(data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const created = await slotService.createSlot(form);
      setSlots((prev) => [...prev, created].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    setError('');
    setSubmitting(true);
    try {
      const updated = await slotService.updateSlot(id, form);
      setSlots((prev) =>
        prev.map((s) => (s._id === id ? updated : s)).sort((a, b) => a.startTime.localeCompare(b.startTime))
      );
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this time slot?')) return;
    try {
      await slotService.deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete slot');
    }
  };

  const startEdit = (slot) => {
    setEditingId(slot._id);
    setForm({ name: slot.name, startTime: slot.startTime, endTime: slot.endTime });
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  if (loading) return <p className="text-gray-500">Loading slots...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Time Slots</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <form
            onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate}
            className="bg-white p-4 rounded-lg shadow"
          >
            <h2 className="font-semibold mb-3">{editingId ? 'Edit Slot' : 'Add Slot'}</h2>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text" placeholder="e.g. Lunch"
              className="w-full border rounded px-3 py-2 mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <label className="block text-xs text-gray-500 mb-1">Start Time</label>
            <input
              type="time"
              className="w-full border rounded px-3 py-2 mb-3"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
            />

            <label className="block text-xs text-gray-500 mb-1">End Time</label>
            <input
              type="time"
              className="w-full border rounded px-3 py-2 mb-3"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
            />

            <div className="flex gap-2">
              <button
                type="submit" disabled={submitting}
                className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button" onClick={cancelEdit}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="md:col-span-2">
          {slots.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No slots yet. Add one to get started.</p>
          ) : (
            <div className="space-y-2">
              {slots.map((slot) => (
                <div key={slot._id} className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{slot.name}</p>
                    <p className="text-sm text-gray-500">{slot.startTime} – {slot.endTime}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(slot)}
                      className="text-sm text-indigo-600 hover:text-indigo-800">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(slot._id)}
                      className="text-sm text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSlots;
