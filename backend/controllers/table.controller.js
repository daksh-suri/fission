import * as tableService from '../services/tableService.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createTable = asyncHandler(async (req, res) => {
  const { tableNumber, capacity } = req.body;

  if (!tableNumber || !capacity) {
    throw new AppError('Table number and capacity are required', 400);
  }

  const table = await tableService.createTable({ tableNumber, capacity });
  res.status(201).json({ success: true, data: table });
});

export const getAllTables = asyncHandler(async (req, res) => {
  const tables = await tableService.getAllTables();
  res.status(200).json({ success: true, data: tables });
});

export const updateTable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { tableNumber, capacity } = req.body;

  if (tableNumber === undefined && capacity === undefined) {
    throw new AppError('Provide at least table number or capacity to update', 400);
  }

  const table = await tableService.updateTable(id, { tableNumber, capacity });
  res.status(200).json({ success: true, data: table });
});

export const deleteTable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const table = await tableService.deleteTable(id);
  res.status(200).json({ success: true, data: table });
});
