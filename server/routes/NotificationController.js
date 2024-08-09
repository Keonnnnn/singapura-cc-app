const { notificationEvents, Notification, User } = require('../models');

exports.createNotification = async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        console.log('Received request to create notification:', { title, description, userId });

        if (!title || !description || !userId) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (userId !== 1) {
            console.error('Authorization failed: Unauthorized user');
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const notification = await notificationEvents.create({ title, description, userId });

        console.log('Notification created:', notification.toJSON());

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ 
            error: error.message, 
            details: error.errors ? error.errors.map(e => e.message) : null 
        });
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationEvents.findOne({
            where: { id },
            include: [
                { model: User, as: 'user', attributes: ['id', 'username'] }
            ]
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        console.log('Fetched notification:', notification.toJSON());

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error fetching notification:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ error: 'Failed to fetch notification' });
    }
};

exports.getAllNotifications = async (req, res) => {
    console.log('Received request to fetch all notifications');
    try {
        const notifications = await notificationEvents.findAll({
            include: [{ model: User, as: 'user', attributes: ['id'] }]
        });

        console.log('Fetched notifications:', notifications);

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, isRead } = req.body;

        if (!title || !description) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const notification = await notificationEvents.findOne({ where: { id } });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.update({ title, description, isRead });

        console.log('Notification updated:', notification.toJSON());

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error updating notification:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ error: 'Failed to update notification' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await notificationEvents.findOne({ where: { id } });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.update({ isRead: true });

        console.log('Notification marked as read:', notification.toJSON());

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await notificationEvents.findOne({ where: { id } });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.destroy();

        console.log('Notification deleted:', notification.toJSON());

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ error: 'Failed to delete notification' });
    }
};
