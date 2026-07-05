import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';
import AppError from '../utils/AppError.js';

export const allocateTable = async ({ startTime, endTime, guests, excludeReservationId, session }) => {
  const busyTableIds = await findOccupiedTableIds(startTime, endTime, excludeReservationId, session);

  const availableTable = await findSmallestAvailableTable(busyTableIds, guests, session);

  if (!availableTable) {
    const hasCapacity = await Table.exists({ capacity: { $gte: guests } }).session(session);
    if (!hasCapacity) {
      throw new AppError(`No table can accommodate ${guests} guests`, 400);
    }
    throw new AppError('No tables available for the requested time slot', 409);
  }

  return availableTable;
};

export const createReservation = async ({ userId, startTime, endTime, numberOfGuests, session }) => {
  if (new Date(endTime) <= new Date(startTime)) {
    throw new AppError('End time must be after start time', 400);
  }

  const table = await allocateTable({ startTime, endTime, guests: numberOfGuests, session });

  const [reservation] = await Reservation.create(
    [{ user: userId, table: table._id, startTime, endTime, numberOfGuests }],
    { session },
  );

  const populated = await reservation.populate('table', 'tableNumber capacity');

  return populated;
};

export const getMyReservations = async (userId) => {
  return await Reservation.find({ user: userId })
    .sort({ startTime: -1 })
    .populate('table', 'tableNumber capacity');
};

export const cancelMyReservation = async (reservationId, userId, session) => {
  const reservation = await Reservation.findById(reservationId).session(session);

  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }

  if (reservation.user.toString() !== userId) {
    throw new AppError('You can only cancel your own reservations', 403);
  }

  if (['seated', 'completed', 'cancelled'].includes(reservation.status)) {
    throw new AppError('Reservation cannot be cancelled in its current state', 400);
  }

  reservation.status = 'cancelled';
  await reservation.save({ session });

  return reservation;
};

export const getAllReservations = async ({ date, page = 1, limit = 20 }) => {
  const filter = {};

  if (date) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    filter.startTime = { $gte: startOfDay, $lte: endOfDay };
  }

  const skip = (page - 1) * limit;

  const [reservations, total] = await Promise.all([
    Reservation.find(filter)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity'),
    Reservation.countDocuments(filter),
  ]);

  return {
    reservations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const updateReservation = async (id, { startTime, endTime, numberOfGuests }, session) => {
  const reservation = await Reservation.findById(id).populate('table', 'tableNumber capacity').session(session);

  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }

  if (new Date(endTime) <= new Date(startTime)) {
    throw new AppError('End time must be after start time', 400);
  }

  const currentTable = reservation.table;

  const canKeepTable =
    currentTable.capacity >= numberOfGuests &&
    !(await isTableOccupied(currentTable._id, startTime, endTime, id, session));

  if (!canKeepTable) {
    const newTable = await allocateTable({
      startTime,
      endTime,
      guests: numberOfGuests,
      excludeReservationId: id,
      session,
    });
    reservation.table = newTable._id;
  }

  reservation.startTime = startTime;
  reservation.endTime = endTime;
  reservation.numberOfGuests = numberOfGuests;

  await reservation.save({ session });

  if (!canKeepTable) {
    await reservation.populate('table', 'tableNumber capacity');
  }

  return reservation;
};

export const adminCancelReservation = async (id, session) => {
  const reservation = await Reservation.findById(id).session(session);

  if (!reservation) {
    throw new AppError('Reservation not found', 404);
  }

  if (['seated', 'completed', 'cancelled'].includes(reservation.status)) {
    throw new AppError('Reservation cannot be cancelled in its current state', 400);
  }

  reservation.status = 'cancelled';
  await reservation.save({ session });

  return reservation;
};

const findOccupiedTableIds = async (startTime, endTime, excludeReservationId, session) => {
  const conflictQuery = {
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    status: { $in: ['confirmed', 'seated'] },
  };

  if (excludeReservationId) {
    conflictQuery._id = { $ne: excludeReservationId };
  }

  return await Reservation.distinct('table', conflictQuery).session(session);
};

const findSmallestAvailableTable = async (busyTableIds, guests, session) => {
  return await Table.findOne({
    _id: { $nin: busyTableIds },
    capacity: { $gte: guests },
  }).sort({ capacity: 1 }).session(session);
};

const isTableOccupied = async (tableId, startTime, endTime, excludeReservationId, session) => {
  const conflict = await Reservation.findOne({
    table: tableId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    status: { $in: ['confirmed', 'seated'] },
    _id: { $ne: excludeReservationId },
  }).session(session);

  return !!conflict;
};
