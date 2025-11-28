// models/CommunityPost.js
import { Schema } from 'mongoose';
import Post from './Post.js';

const communityPostSchema = new Schema({
  upvotes: { type: Number, default: 0, min: 0 },
  downvotes: { type: Number, default: 0, min: 0 }
});

communityPostSchema.index({ upvotes: -1 });

const CommunityPost = Post.discriminator('CommunityPost', communityPostSchema);

export default CommunityPost;
