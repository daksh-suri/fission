import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Table from '../models/Table.js';

const tables = [
  { tableNumber: 1, capacity: 2 },
  { tableNumber: 2, capacity: 2 },
  { tableNumber: 3, capacity: 4 },
  { tableNumber: 4, capacity: 4 },
  { tableNumber: 5, capacity: 4 },
  { tableNumber: 6, capacity: 4 },
  { tableNumber: 7, capacity: 6 },
  { tableNumber: 8, capacity: 6 },
  { tableNumber: 9, capacity: 8 },
];

const seedTables = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Table.insertMany(tables, { ordered: false });
    console.log(`Seeded ${tables.length} tables`);
  } catch (err) {
    if (err.code === 11000) {
      console.log('Tables already exist — skipping duplicates');
    } else {
      console.error('Seed failed:', err.message);
      process.exit(1);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
};

seedTables();
