import * as slotService from '../services/slotService.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAll = asyncHandler(async (req, res) => {
  const slots = await slotService.getAllSlots();
  res.status(200).json({ success: true, data: slots });
});

export const create = asyncHandler(async (req, res) => {
  const { name, startTime, endTime } = req.body;

  if (!name || !startTime || !endTime) {
    throw new AppError('name, startTime, and endTime are required', 400);
  }

  const slot = await slotService.createSlot({ name, startTime, endTime });
  res.status(201).json({ success: true, data: slot });
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, startTime, endTime } = req.body;

  const slot = await slotService.updateSlot(id, { name, startTime, endTime });
  res.status(200).json({ success: true, data: slot });
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slot = await slotService.deleteSlot(id);
  res.status(200).json({ success: true, data: slot });
});
