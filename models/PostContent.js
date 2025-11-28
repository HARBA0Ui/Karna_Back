// models/PostContent.js
import { Schema, model } from 'mongoose';

const postContentSchema = new Schema({
  post: { 
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  stop: { 
    type: Schema.Types.ObjectId, 
    ref: 'Stop', 
    required: true 
  },
  time: { 
    type: String, 
    required: true, 
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ 
  },
  order: { 
    type: Number, 
    required: true, 
    min: 1 
  }
});

postContentSchema.index({ post: 1, order: 1 }, { unique: true });
postContentSchema.index({ post: 1 });

export default model('PostContent', postContentSchema);
