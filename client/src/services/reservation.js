import api from './api';

export const createReservation = (data) =>
  api.post('/reservations', data).then((r) => r.data.data);

export const getMyReservations = () =>
  api.get('/reservations/my').then((r) => r.data.data);

export const cancelReservation = (id) =>
  api.delete(`/reservations/${id}`).then((r) => r.data.data);

export const getAllReservations = (params) =>
  api.get('/admin/reservations', { params }).then((r) => r.data.data);

export const adminUpdateReservation = (id, data) =>
  api.patch(`/admin/reservations/${id}`, data).then((r) => r.data.data);

export const adminCancelReservation = (id) =>
  api.delete(`/admin/reservations/${id}`).then((r) => r.data.data);
