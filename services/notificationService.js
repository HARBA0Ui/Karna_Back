// services/notificationService.js
import Notification from '../models/Notification.js';

const send = async (targetUserId, message, type) => {
  await Notification.create({ targetUser: targetUserId, message, type });
};

export default { send };