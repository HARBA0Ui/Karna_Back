import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['report', 'post'], required: true },
  targetUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

notificationSchema.index({ targetUser: 1, date: -1 });
export default model('Notification', notificationSchema);