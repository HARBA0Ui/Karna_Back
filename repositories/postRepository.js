import Post from '../models/Post.js';
import CommunityPost from '../models/CommunityPost.js';
import LiveLocation from '../models/LiveLocation.js';
import PostContent from '../models/PostContent.js';

export const findAllPosts = async () => {
  return await Post.find({})
    .populate('author', 'nickname email')
    .populate('bus', 'number')
    .sort({ upvotes: -1, createdAt: -1 });
};

export const findPostById = async (id) => {
  return await Post.findById(id)
    .populate('author', 'nickname')
    .populate('bus', 'number');
};

export const findContentsByPostId = async (postId) => {
  return await PostContent.find({ post: postId })
    .populate('stop', 'name')
    .sort({ order: 1 });
};

export const findContentsByPostIds = async (postIds) => {
  return await PostContent.find({ post: { $in: postIds } })
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

export const updatePostStatus = async (id, status) => {
  return await Post.findByIdAndUpdate(id, { status }, { new: true }).populate('author');
};

export const deletePostById = async (id) => {
  await PostContent.deleteMany({ post: id });
  return await Post.findByIdAndDelete(id);
};

//  FIXED: Track user votes with proper ObjectId comparison
export const upvotePost = async (postId, userId) => {
  const userIdString = userId.toString();
  const post = await CommunityPost.findById(postId);

  if (!post) throw new Error('Post not found');

  // Check if user already upvoted using .some() for ObjectId comparison
  const alreadyUpvoted = post.upvoters?.some(id => id.toString() === userIdString);
  if (alreadyUpvoted) {
    throw new Error('You have already upvoted this post');
  }

  const alreadyDownvoted = post.downvoters?.some(id => id.toString() === userIdString);

  if (alreadyDownvoted) {
    // Remove downvote and add upvote
    return await CommunityPost.findByIdAndUpdate(
      postId,
      {
        $inc: { downvotes: -1, upvotes: 1 },
        $pull: { downvoters: userId },
        $push: { upvoters: userId }
      },
      { new: true }
    )
      .populate('author', 'nickname')
      .populate('bus', 'number');
  }

  // Add upvote
  return await CommunityPost.findByIdAndUpdate(
    postId,
    {
      $inc: { upvotes: 1 },
      $push: { upvoters: userId }
    },
    { new: true }
  )
    .populate('author', 'nickname')
    .populate('bus', 'number');
};

//  FIXED: Track user votes with proper ObjectId comparison
export const downvotePost = async (postId, userId) => {
  const userIdString = userId.toString();
  const post = await CommunityPost.findById(postId);

  if (!post) throw new Error('Post not found');

  // Check if user already downvoted using .some() for ObjectId comparison
  const alreadyDownvoted = post.downvoters?.some(id => id.toString() === userIdString);
  if (alreadyDownvoted) {
    throw new Error('You have already downvoted this post');
  }

  const alreadyUpvoted = post.upvoters?.some(id => id.toString() === userIdString);

  if (alreadyUpvoted) {
    // Remove upvote and add downvote
    return await CommunityPost.findByIdAndUpdate(
      postId,
      {
        $inc: { upvotes: -1, downvotes: 1 },
        $pull: { upvoters: userId },
        $push: { downvoters: userId }
      },
      { new: true }
    )
      .populate('author', 'nickname')
      .populate('bus', 'number');
  }

  // Add downvote
  return await CommunityPost.findByIdAndUpdate(
    postId,
    {
      $inc: { downvotes: 1 },
      $push: { downvoters: userId }
    },
    { new: true }
  )
    .populate('author', 'nickname')
    .populate('bus', 'number');
};
