// models/Bus.js
import { Schema, model } from 'mongoose';

const busSchema = new Schema({
  number: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true
  }
});

export default model('Bus', busSchema);
