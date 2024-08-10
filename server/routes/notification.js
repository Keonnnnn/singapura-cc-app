const express = require('express');
const router = express.Router();
const { Notification, User, Post } = require('../models');
const { validateToken } = require('../middlewares/auth');

// Get notifications for the logged-in user
router.get('/', validateToken, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'fromUser', attributes: ['username', 'role'] },
        { model: Post, as: 'post', attributes: ['title'] }
      ]
    });

    // Format notifications consistently for likes, comments, and follows
    const formattedNotifications = notifications.map(notification => {
      let formattedMessage = notification.message;

      // Customize the message formatting for different types of notifications
      switch (notification.type) {
        case 'like':
          formattedMessage = `${notification.fromUser.username} liked your post`;
          break;
        case 'comment':
          formattedMessage = `${notification.fromUser.username} commented on your post`;
          break;
        case 'follow':
          formattedMessage = `${notification.fromUser.username} started following you`;
          break;
        // Add additional cases as necessary
        default:
          break;
      }

      return {
        ...notification.toJSON(),
        message: formattedMessage,
      };
    });

    res.json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Mark notifications as read
router.put('/:id/read', validateToken, async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to mark notification as read', details: err.message });
  }
});

// Pin/Unpin a notification
router.put('/:id/pin', validateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: User, as: 'fromUser', attributes: ['role'] }]
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Only allow pinning if the notification is created by an admin
    if (notification.fromUser.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admin notifications can be pinned' });
    }

    notification.pinned = req.body.pinned;
    notification.updatedAt = new Date();  // Update the timestamp to the current date and time
    await notification.save();

    res.json({ message: 'Notification pin status updated', notification });
  } catch (err) {
    console.error('Error updating notification pin status:', err);
    res.status(500).json({ error: 'Failed to update pin status', details: err.message });
  }
});

module.exports = router;
