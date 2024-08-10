const express = require('express');
const router = express.Router();
const NotificationController = require('./NotificationController');
const { validateToken } = require('../middlewares/auth');

router.post('/', validateToken, NotificationController.createNotification);
router.get('/', NotificationController.getAllNotifications);
router.get('/:id', NotificationController.getNotificationById);
router.put('/:id', validateToken, NotificationController.updateNotification);
router.put('/:id/read', validateToken, NotificationController.markAsRead);
router.put('/:id/pin', validateToken, NotificationController.pinNotification); // Route to pin/unpin notifications
router.delete('/:id', validateToken, NotificationController.deleteNotification);

module.exports = router;
