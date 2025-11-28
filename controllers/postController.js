import * as postService from '../services/postService.js';

export const listPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
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

export const updatePostStatus = async (req, res, next) => {
  try {
    const post = await postService.updateStatus(req.params.id, req.body.status);
    res.json(post);
  } catch (error) {
    next(error);
  }
};


export const createPost = async (req, res) => {
  try {
    const { type } = req.body;
    let result;

    if (type === 'liveLocation') {
      result = await postService.createLiveLocation(req.user.userId, req.body);
    } else {
      // Assume CommunityPost
      const { stops, ...postData } = req.body;
      result = await postService.createRoutePost(req.user.userId, postData, stops);
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
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


export const upvote = async (req, res, next) => {
  try {
    const post = await postService.upvotePost(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const downvote = async (req, res, next) => {
  try {
    const post = await postService.downvotePost(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};
