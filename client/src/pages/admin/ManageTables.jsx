import { useState, useEffect, useCallback } from 'react';
import * as tableService from '../../services/table';

const emptyForm = { tableNumber: '', capacity: '' };

const ManageTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    try {
      const data = await tableService.getTables();
      setTables(data);
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
      const created = await tableService.createTable({
        tableNumber: Number(form.tableNumber),
        capacity: Number(form.capacity),
      });
      setTables((prev) => [...prev, created].sort((a, b) => a.tableNumber - b.tableNumber));
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create table');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    setError('');
    setSubmitting(true);
    try {
      const updated = await tableService.updateTable(id, {
        tableNumber: Number(form.tableNumber),
        capacity: Number(form.capacity),
      });
      setTables((prev) =>
        prev.map((t) => (t._id === id ? updated : t)).sort((a, b) => a.tableNumber - b.tableNumber)
      );
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update table');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await tableService.deleteTable(id);
      setTables((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete table');
    }
  };

  const startEdit = (table) => {
    setEditingId(table._id);
    setForm({ tableNumber: table.tableNumber, capacity: table.capacity });
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  if (loading) return <p className="text-gray-500">Loading tables...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Tables</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <form
            onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate}
            className="bg-white p-4 rounded-lg shadow"
          >
            <h2 className="font-semibold mb-3">{editingId ? 'Edit Table' : 'Add Table'}</h2>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <input
              type="number" min="1" placeholder="Table number"
              className="w-full border rounded px-3 py-2 mb-3"
              value={form.tableNumber}
              onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
              required
            />
            <input
              type="number" min="1" placeholder="Capacity"
              className="w-full border rounded px-3 py-2 mb-3"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
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
          {tables.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tables yet. Add one to get started.</p>
          ) : (
            <div className="space-y-2">
              {tables.map((table) => (
                <div key={table._id} className="bg-white rounded-lg shadow px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Table {table.tableNumber}</p>
                    <p className="text-sm text-gray-500">Capacity: {table.capacity} guests</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(table)}
                      className="text-sm text-indigo-600 hover:text-indigo-800">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(table._id)}
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

export default ManageTables;
