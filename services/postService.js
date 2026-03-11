import * as postRepository from '../repositories/postRepository.js';
import Bus from '../models/Bus.js';
import * as notificationService from '../services/notificationService.js';
import { createPostStateMachine } from './workflows/statusWorkflow.js';

export const getAllPosts = async () => {
  const posts = await postRepository.findAllPosts();
  const communityIds = posts
    .filter((p) => p.type === 'CommunityPost')
    .map((p) => p._id);

  if (communityIds.length === 0) return posts;

  const contents = await postRepository.findContentsByPostIds(communityIds);
  const grouped = new Map();
  contents.forEach((content) => {
    const key = content.post.toString();
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(content);
  });

  return posts.map((post) => {
    const key = post._id.toString();
    const extra = grouped.get(key) ?? [];
    return { ...post.toObject(), contents: extra };
  });
};

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
  let title = postData.title;
  if (!title || title.trim() === '') {
    const bus = await Bus.findById(postData.bus);
    title = bus ? bus.number : 'Bus';
  }

  const post = await postRepository.createCommunityPost({
    ...postData,
    title,
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

//  FIXED: Auto-generate title = bus number for LiveLocation
export const createLiveLocation = async (userId, locationData) => {
  console.log('🔵 SERVICE: Creating live location');
  console.log('👤 User ID:', userId);
  console.log('📦 Location Data:', locationData);

  if (!locationData.bus) {
    throw new Error('Bus ID is required');
  }
  if (!locationData.lat || !locationData.long) {
    throw new Error('Latitude and longitude are required');
  }

  //  Fetch bus to get its number for title
  const bus = await Bus.findById(locationData.bus);
  if (!bus) {
    throw new Error('Bus not found');
  }

  const liveLocationPayload = {
    author: userId,
    bus: locationData.bus,
    lat: locationData.lat,
    long: locationData.long,
    title: bus.number, //  Auto-generate title from bus number
    name: locationData.name || `Live: ${bus.number}`,
    description: locationData.description || '',
    type: 'liveLocation'
  };

  console.log('📤 Creating with payload:', liveLocationPayload);

  const result = await postRepository.createLiveLocation(liveLocationPayload);
  console.log(' Live Location saved:', result);

  return result;
};

export const updateStatus = async (postId, newStatus) => {
  const post = await postRepository.findPostById(postId);
  if (!post) throw new Error('Post non trouvé');

  const currentState = post.status || 'proposé';
  const stateMachine = createPostStateMachine(post, postRepository);

  if (currentState === 'proposé') {
    if (newStatus === 'validé') {
      stateMachine.handle('APPROVE');
    } else if (newStatus === 'rejeté') {
      stateMachine.handle('REJECT');
    } else {
      throw new Error(`Invalid status: ${newStatus}. Must be 'validé' or 'rejeté'`);
    }
  } else {
    throw new Error(`Cannot transition from ${currentState} to ${newStatus}. Post already processed.`);
  }

  return await postRepository.findPostById(postId);
};

export const removePost = async (postId) => {
  const post = await postRepository.findPostById(postId);
  if (!post) throw new Error('Post non trouvé');

  await postRepository.deletePostById(postId);
  await notificationService.createNotification(
    post.author._id,
    'Votre proposition a été supprimée par un administrateur.',
    'post'
  );

  return { message: 'Post supprimé' };
};

export const upvotePost = async (postId, userId) => {
  const post = await postRepository.upvotePost(postId, userId);
  if (!post) throw new Error('Post non trouvé');
  return post;
};

export const downvotePost = async (postId, userId) => {
  const post = await postRepository.downvotePost(postId, userId);
  if (!post) throw new Error('Post non trouvé');
  return post;
};
