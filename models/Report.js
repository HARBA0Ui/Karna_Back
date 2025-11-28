// models/Report.js
import { Schema, model } from 'mongoose';

const reportSchema = new Schema({
  reporter: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reportedPost: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  reason: { type: String, required: true },
  message: String,
  status: { 
    type: String, 
    enum: ['en attente', 'validé', 'rejeté'], 
    default: 'en attente' 
  },
  reportType: { 
    type: String, 
    enum: ['post', 'location'], 
    required: true 
  },
  date: { type: Date, default: Date.now }
});

reportSchema.index({ status: 1, date: -1 });
reportSchema.index({ reportedPost: 1 });

export default model('Report', reportSchema);
