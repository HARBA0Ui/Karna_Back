// models/LiveLocation.js
import { Schema } from 'mongoose';
import Post from './Post.js';

const liveLocationSchema = new Schema({
  long: { type: Number, required: true },
  lat: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

liveLocationSchema.index({ long: 1, lat: 1 });
liveLocationSchema.index({ updatedAt: -1 });

const LiveLocation = Post.discriminator('liveLocation', liveLocationSchema);

export default LiveLocation;
