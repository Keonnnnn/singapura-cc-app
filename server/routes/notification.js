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
      // include: [
      //   { model: User, as: 'fromUser', attributes: ['username'] },
      //   { model: Post, as: 'post', attributes: ['title'] }
      // ]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Mark notifications as read
router.put('/:id/read', validateToken, async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

module.exports = router;
