// models/User.js
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  nickname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  pwd: { type: String, required: true },
  role: { type: String, enum: ['admin', 'passenger'], default: 'passenger' },
  createdAt: { type: Date, default: Date.now }
});

export default model('User', userSchema);