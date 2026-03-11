// models/CommunityPost.js

import { Schema } from 'mongoose';
import Post from './Post.js';

const communityPostSchema = new Schema({
  upvotes: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  downvotes: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  upvoters: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  downvoters: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

communityPostSchema.index({ upvotes: -1 });

const CommunityPost = Post.discriminator('CommunityPost', communityPostSchema);

export default CommunityPost;
