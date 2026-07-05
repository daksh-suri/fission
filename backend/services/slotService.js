import Slot from '../models/Slot.js';
import Reservation from '../models/Reservation.js';
import AppError from '../utils/AppError.js';

export const getAllSlots = async () => {
  return await Slot.find().sort({ startTime: 1 });
};

export const createSlot = async ({ name, startTime, endTime }) => {
  if (endTime <= startTime) {
    throw new AppError('End time must be after start time', 400);
  }
  return await Slot.create({ name, startTime, endTime });
};

export const updateSlot = async (id, { name, startTime, endTime }) => {
  const slot = await Slot.findById(id);
  if (!slot) throw new AppError('Slot not found', 404);

  const finalStart = startTime ?? slot.startTime;
  const finalEnd = endTime ?? slot.endTime;
  if (finalEnd <= finalStart) {
    throw new AppError('End time must be after start time', 400);
  }

  if (name !== undefined) slot.name = name;
  if (startTime !== undefined) slot.startTime = startTime;
  if (endTime !== undefined) slot.endTime = endTime;

  await slot.save();
  return slot;
};

export const deleteSlot = async (id) => {
  const slot = await Slot.findById(id);
  if (!slot) throw new AppError('Slot not found', 404);

  const [sH, sM] = slot.startTime.split(':').map(Number);
  const [eH, eM] = slot.endTime.split(':').map(Number);
  const slotStart = sH * 60 + sM;
  const slotEnd = eH * 60 + eM;

  const activeReservations = await Reservation.find({
    status: { $in: ['confirmed', 'seated'] },
  }).lean();

  const hasConflict = activeReservations.some((r) => {
    const start = new Date(r.startTime);
    const end = new Date(r.endTime);
    const resStart = start.getHours() * 60 + start.getMinutes();
    const resEnd = end.getHours() * 60 + end.getMinutes();

    if (slotEnd <= slotStart) {
      return resStart < slotEnd + 1440 || resEnd > slotStart;
    }
    return resStart < slotEnd && resEnd > slotStart;
  });

  if (hasConflict) {
    throw new AppError('Cannot delete slot with active reservations', 409);
  }

  await slot.deleteOne();
  return slot;
};
