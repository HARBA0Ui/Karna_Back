import * as postRepository from '../repositories/postRepository.js';
import notificationService from './notificationService.js';

export const getAllPosts = async () => {
  return await postRepository.findAllPosts();
};

// Matches controller: getPostDetail
export const getPostDetails = async (id) => {
  const post = await postRepository.findPostById(id);
  if (!post) throw new Error('Post non trouvé');

  let contents = [];
  if (post.type === 'CommunityPost') {
    contents = await postRepository.findContentsByPostId(id);
  }

  return { ...post.toObject(), contents };
};

export const createRoutePost = async (userId, postData, stopsData) => {
  const post = await postRepository.createCommunityPost({
    ...postData,
    author: userId,
    type: 'CommunityPost'
  });

  if (stopsData && stopsData.length > 0) {
    const contentPromises = stopsData.map((stop, index) => {
      return postRepository.createPostContent({
        post: post._id,
        stop: stop.stopId,
        time: stop.time,
        order: index + 1
      });
    });
    await Promise.all(contentPromises);
  }
  return post;
};

export const createLiveLocation = async (userId, locationData) => {
  return await postRepository.createLiveLocation({
    ...locationData,
    author: userId,
    type: 'liveLocation'
  });
};

// Matches controller: updatePostStatus
export const updateStatus = async (postId, newStatus) => {
  const post = await postRepository.updatePostStatus(postId, newStatus);
  if (!post) throw new Error('Post non trouvé');

  const statusText = newStatus === 'validé' ? 'validée' : 'rejetée';
  await notificationService.send(
    post.author._id,
    `Votre proposition a été ${statusText}.`,
    'post'
  );
  return post;
};

// Matches controller: deletePost
export const removePost = async (postId) => {
  const post = await postRepository.findPostById(postId);
  if (!post) throw new Error('Post non trouvé');

  await postRepository.deletePostById(postId);

  await notificationService.send(
    post.author._id,
    `Votre proposition a été supprimée par un administrateur.`,
    'post'
  );
  return { message: 'Post supprimé' };
};


export const upvotePost = async (postId) => {
  const post = await postRepository.upvotePost(postId);
  if (!post) throw new Error('Post non trouvé');
  return post;
};

export const downvotePost = async (postId) => {
  const post = await postRepository.downvotePost(postId);
  if (!post) throw new Error('Post non trouvé');
  return post;
};
