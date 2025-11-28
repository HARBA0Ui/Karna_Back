import Post from '../models/Post.js';
import CommunityPost from '../models/CommunityPost.js';
import LiveLocation from '../models/LiveLocation.js';
import PostContent from '../models/PostContent.js';

// Used by getAllPosts
export const findAllPosts = async () => {
  return await Post.find({})
    .populate('author', 'nickname email') // Adjust fields based on your User model
    .populate('bus', 'number')
    .sort({ createdAt: -1 });
};

// Used by getPostDetails
export const findPostById = async (id) => {
  return await Post.findById(id)
    .populate('author', 'nickname')
    .populate('bus', 'number');
};

// Used by getPostDetails (for CommunityPost)
export const findContentsByPostId = async (postId) => {
  return await PostContent.find({ post: postId })
    .populate('stop', 'name')
    .sort({ order: 1 });
};

export const createCommunityPost = async (data) => {
  return await CommunityPost.create(data);
};

export const createLiveLocation = async (data) => {
  return await LiveLocation.create(data);
};

export const createPostContent = async (data) => {
  return await PostContent.create(data);
};

// Used by updateStatus
export const updatePostStatus = async (id, status) => {
  return await Post.findByIdAndUpdate(id, { status }, { new: true }).populate('author');
};

// Used by removePost
export const deletePostById = async (id) => {
  await PostContent.deleteMany({ post: id });
  return await Post.findByIdAndDelete(id);
};


export const upvotePost = async (postId) => {
  return await CommunityPost.findByIdAndUpdate(
    postId,
    { $inc: { upvotes: 1 } },
    { new: true }
  ).populate('author', 'nickname').populate('bus', 'number');
};

export const downvotePost = async (postId) => {
  return await CommunityPost.findByIdAndUpdate(
    postId,
    { $inc: { downvotes: 1 } },
    { new: true }
  ).populate('author', 'nickname').populate('bus', 'number');
};
