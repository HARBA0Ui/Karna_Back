// models/Post.js
import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['CommunityPost', 'liveLocation'] 
  },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['proposé', 'validé', 'rejeté'], 
    default: 'proposé' 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bus: { 
    type: Schema.Types.ObjectId, 
    ref: 'Bus',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
}, { discriminatorKey: 'type' });

postSchema.index({ bus: 1, status: 1 });
postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });

export default model('Post', postSchema);
