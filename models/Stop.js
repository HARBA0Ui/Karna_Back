// models/Stop.js
import { Schema, model } from 'mongoose';

const stopSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  long: { type: Number },
  lat: { type: Number }
});

// Optional: 2dsphere index if you want spatial queries on stops later
stopSchema.index({ long: 1, lat: 1 });

export default model('Stop', stopSchema);
