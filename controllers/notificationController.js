import * as notificationService from '../services/notificationService.js';

//  UNIFIED: Single auth check helper pattern
const checkUserAuth = (req, res) => {
  if (!req.user?.userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return false;
  }
  return true;
};

export const getUserNotifications = async (req, res) => {
  try {
    if (!checkUserAuth(req, res)) return;

    const notifications = await notificationService.getNotificationsByUserId(req.user.userId);
    res.json({
      success: true,
      data: notifications,
      message: 'Notifications fetched successfully'
    });
  } catch (error) {
    console.error('❌ Get notifications error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    if (!checkUserAuth(req, res)) return;

    const notification = await notificationService.markNotificationAsRead(req.params.id);
    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('❌ Mark as read error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    if (!checkUserAuth(req, res)) return;

    const result = await notificationService.markAllNotificationsAsRead(req.user.userId);
    res.json({
      success: true,
      data: result,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('❌ Mark all as read error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    if (!checkUserAuth(req, res)) return;

    await notificationService.deleteNotification(req.params.id);
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete notification error:', error.message);
    res.status(400).json({ error: error.message });
  }
};