import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';
import AppError from '../utils/AppError.js';

export const createTable = async ({ tableNumber, capacity }) => {
  const existing = await Table.findOne({ tableNumber });
  if (existing) {
    throw new AppError('Table number already exists', 409);
  }

  return await Table.create({ tableNumber, capacity });
};

export const getAllTables = async () => {
  return await Table.find().sort({ tableNumber: 1 });
};

export const updateTable = async (id, { tableNumber, capacity }) => {
  const table = await Table.findById(id);
  if (!table) {
    throw new AppError('Table not found', 404);
  }

  if (tableNumber !== undefined && tableNumber !== table.tableNumber) {
    const existing = await Table.findOne({ tableNumber });
    if (existing) {
      throw new AppError('Table number already exists', 409);
    }
    table.tableNumber = tableNumber;
  }

  if (capacity !== undefined) {
    table.capacity = capacity;
  }

  await table.save();
  return table;
};

export const deleteTable = async (id) => {
  const table = await Table.findById(id);
  if (!table) {
    throw new AppError('Table not found', 404);
  }

  const activeReservation = await Reservation.findOne({
    table: id,
    status: { $in: ['confirmed', 'seated'] },
  });

  if (activeReservation) {
    throw new AppError('Cannot delete table with active reservations', 409);
  }

  await table.deleteOne();
  return table;
};
