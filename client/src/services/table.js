import api from './api';

export const getTables = () =>
  api.get('/tables').then((r) => r.data.data);

export const createTable = (data) =>
  api.post('/tables', data).then((r) => r.data.data);

export const updateTable = (id, data) =>
  api.patch(`/tables/${id}`, data).then((r) => r.data.data);

export const deleteTable = (id) =>
  api.delete(`/tables/${id}`).then((r) => r.data.data);
