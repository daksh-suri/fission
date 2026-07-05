import * as reservationService from '../services/reservation.service.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import withTransaction from '../utils/withTransaction.js';

const validateReservationInput = ({ startTime, endTime, numberOfGuests }) => {
  if (!startTime || !endTime || !numberOfGuests) {
    throw new AppError('startTime, endTime, and numberOfGuests are required', 400);
  }

  if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
    throw new AppError('Invalid date format', 400);
  }

  if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1) {
    throw new AppError('numberOfGuests must be a positive integer', 400);
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start < new Date()) {
    throw new AppError('Reservation cannot be in the past', 400);
  }

  if (end.getTime() - start.getTime() > 24 * 60 * 60 * 1000) {
    throw new AppError('Reservation duration cannot exceed 24 hours', 400);
  }
};

export const create = asyncHandler(async (req, res) => {
  const { startTime, endTime, numberOfGuests } = req.body;

  validateReservationInput({ startTime, endTime, numberOfGuests });

  const reservation = await withTransaction((session) =>
    reservationService.createReservation({
      userId: req.user.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      numberOfGuests,
      session,
    }),
  );

  res.status(201).json({ success: true, data: reservation });
});

export const getMy = asyncHandler(async (req, res) => {
  const reservations = await reservationService.getMyReservations(req.user.id);

  res.status(200).json({ success: true, data: reservations });
});

export const cancel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reservation = await withTransaction((session) =>
    reservationService.cancelMyReservation(id, req.user.id, session),
  );

  res.status(200).json({ success: true, data: reservation });
});

export const getAll = asyncHandler(async (req, res) => {
  const { date, page, limit } = req.query;

  const result = await reservationService.getAllReservations({
    date,
    page: page ? parseInt(page, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
  });

  res.status(200).json({ success: true, data: result });
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, numberOfGuests } = req.body;

  validateReservationInput({ startTime, endTime, numberOfGuests });

  const reservation = await withTransaction((session) =>
    reservationService.updateReservation(
      id,
      { startTime: new Date(startTime), endTime: new Date(endTime), numberOfGuests },
      session,
    ),
  );

  res.status(200).json({ success: true, data: reservation });
});

export const adminCancel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reservation = await withTransaction((session) =>
    reservationService.adminCancelReservation(id, session),
  );

  res.status(200).json({ success: true, data: reservation });
});
