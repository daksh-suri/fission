import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Slot from '../models/Slot.js';

const slots = [
  { name: 'Breakfast', startTime: '08:00', endTime: '10:00' },
  { name: 'Lunch', startTime: '12:00', endTime: '14:00' },
  { name: 'Early Dinner', startTime: '18:00', endTime: '20:00' },
  { name: 'Late Dinner', startTime: '20:00', endTime: '22:00' },
];

const seedSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Slot.insertMany(slots, { ordered: false });
    console.log(`Seeded ${slots.length} slots`);
  } catch (err) {
    if (err.code === 11000) {
      console.log('Slots already exist — skipping duplicates');
    } else {
      console.error('Seed failed:', err.message);
      process.exit(1);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
};

seedSlots();
