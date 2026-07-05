import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await User.findOne({ email: 'admin@restaurant.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);

    await User.create({
      name: 'Admin',
      email: 'admin@restaurant.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created — email: admin@restaurant.com, password: admin123');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
