import api from './api';

export const getSlots = () =>
  api.get('/slots').then((r) => r.data.data || []);

export const createSlot = (data) =>
  api.post('/slots', data).then((r) => r.data.data);

export const updateSlot = (id, data) =>
  api.patch(`/slots/${id}`, data).then((r) => r.data.data);

export const deleteSlot = (id) =>
  api.delete(`/slots/${id}`).then((r) => r.data.data);
