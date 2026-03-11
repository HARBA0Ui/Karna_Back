import * as postService from '../services/postService.js';

//  UNIFIED: Single auth check helper pattern
const checkUserAuth = (req, res) => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'User not authenticated. Please login.' });
    return false;
  }
  return true;
};

export const listPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json({
      data: posts,
      message: 'Posts fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostDetail = async (req, res, next) => {
  try {
    const post = await postService.getPostDetails(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

//  REMOVED: updatePostStatus - DUPLICATE of updateStatus below

export const createPost = async (req, res) => {
  try {
    if (!req.user?.userId) {
      console.log('❌ User not authenticated');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { type } = req.body;
    console.log('📝 Post Type:', type);
    let result;

    if (type === 'liveLocation') {
      console.log('🚌 Creating Live Location...');
      console.log('📍 Location Data:', {
        bus: req.body.bus,
        lat: req.body.lat,
        long: req.body.long
      });
      result = await postService.createLiveLocation(req.user.userId, req.body);
      console.log(' Live Location Created:', result);
    } else {
      console.log('📝 Creating Community Post...');
      const { stops, ...postData } = req.body;
      result = await postService.createRoutePost(req.user.userId, postData, stops);
      console.log(' Community Post Created:', result);
    }

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ CREATE POST ERROR:', error.message);
    console.error('❌ Error Stack:', error.stack);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const post = await postService.updateStatus(req.params.id, req.body.status);
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    await postService.removePost(req.params.id);
    res.json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const upvote = async (req, res) => {
  try {
    if (!checkUserAuth(req, res)) return;

    console.log('👍 Upvoting post:', req.params.id, 'by user:', req.user.userId);
    const post = await postService.upvotePost(req.params.id, req.user.userId);
    res.json(post);
  } catch (error) {
    console.error('❌ Upvote error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const downvote = async (req, res) => {
  try {
    if (!checkUserAuth(req, res)) return;

    console.log('👎 Downvoting post:', req.params.id, 'by user:', req.user.userId);
    const post = await postService.downvotePost(req.params.id, req.user.userId);
    res.json(post);
  } catch (error) {
    console.error('❌ Downvote error:', error.message);
    res.status(400).json({ error: error.message });
  }
};