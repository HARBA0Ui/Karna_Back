import * as notificationRepository from '../repositories/notificationRepository.js';
import { io } from '../server.js'; //  Import io instance

export const createNotification = async (targetUser, message, type) => {
  try {
    const notification = await notificationRepository.createNotification(
      targetUser,
      message,
      type
    );

    console.log(' Notification created:', notification._id);

    //  EMIT TO ALL CONNECTED CLIENTS VIA SOCKET.IO
    io.emit('notification:new', {
      id: notification._id.toString(),
      targetUser: notification.targetUser,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      date: notification.date.toISOString(),
    });

    console.log('📡 Notification broadcasted via Socket.IO');

    return notification;
  } catch (error) {
    console.error('❌ Create notification error:', error);
    throw error;
  }
};

export const getNotificationsByUserId = async (userId) => {
  return await notificationRepository.getNotificationsByUserId(userId);
};

export const markNotificationAsRead = async (notificationId) => {
  const notification = await notificationRepository.markNotificationAsRead(notificationId);
  
  //  Emit read event
  io.emit('notification:read', notificationId);
  
  return notification;
};

export const markAllNotificationsAsRead = async (userId) => {
  const result = await notificationRepository.markAllNotificationsAsRead(userId);
  
  //  Emit all read event
  io.emit('notification:allRead');
  
  return result;
};

export const deleteNotification = async (notificationId) => {
  const notification = await notificationRepository.deleteNotification(notificationId);
  
  //  Emit deleted event
  io.emit('notification:deleted', notificationId);
  
  return notification;
};
