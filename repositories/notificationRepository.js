import Notification from '../models/Notification.js';

export const createNotification = async (targetUser, message, type) => {
  return await Notification.create({
    targetUser,
    message,
    type,
    read: false,
    date: new Date(),
  });
};

export const getNotificationsByUserId = async (userId) => {
  return await Notification.find({ targetUser: userId })
    .sort({ date: -1 });
};

export const markNotificationAsRead = async (notificationId) => {
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );

  if (!notification) {
    throw new Error('Notification not found');
  }

  return notification;
};

export const markAllNotificationsAsRead = async (userId) => {
  return await Notification.updateMany(
    { targetUser: userId, read: false },
    { read: true }
  );
};

export const deleteNotification = async (notificationId) => {
  const notification = await Notification.findByIdAndDelete(notificationId);

  if (!notification) {
    throw new Error('Notification not found');
  }

  return notification;
};
