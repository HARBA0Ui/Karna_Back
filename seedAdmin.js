import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const pwd = await bcrypt.hash('admin123', 10);
  await User.create({ nickname: 'Admin', email: 'admin@example.com', pwd, role: 'admin' });
  console.log(' Admin créé');
  process.exit();
}

seed();