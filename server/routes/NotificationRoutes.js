const express = require('express');
const router = express.Router();
const NotificationController = require('./NotificationController'); // Ensure this path is correct
const { validateToken } = require('../middlewares/auth');

router.post('/', validateToken, NotificationController.createNotification);
router.get('/', NotificationController.getAllNotifications);
router.get('/:id', NotificationController.getNotificationById);
router.put('/:id', validateToken, NotificationController.updateNotification);
router.delete('/:id', validateToken, NotificationController.deleteNotification);

module.exports = router;



