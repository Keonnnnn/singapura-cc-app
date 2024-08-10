const { notificationEvents, Notification, User } = require('../models');

exports.createNotification = async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        console.log('Received request to create notification:', { title, description, userId });

        if (!title || !description || !userId) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
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
                { model: User, as: 'user', attributes: ['id', 'username', 'role'] }
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

    try {
        const notifications = await notificationEvents.findAll({
            include: [{ model: User, as: 'user', attributes: ['id', 'role'] }]
        });


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
        const { title, description, isRead, pinned } = req.body;

        if (!title || !description) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const notification = await notificationEvents.findOne({ where: { id } });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.update({ title, description, isRead, pinned });

        // If the notification is updated by an admin, reset the `isRead` flag for all users
        if (req.user && req.user.role === 'Admin') {
            await notification.update({ isRead: false });
        }

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

exports.pinNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { pinned } = req.body;

        const notification = await notificationEvents.findOne({
            where: { id },
            include: [{ model: User, as: 'user', attributes: ['role'] }]
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Only allow pinning if the notification is created by an admin
        if (notification.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Only admin notifications can be pinned' });
        }

        await notification.update({ pinned });

        console.log('Notification pin status updated:', notification.toJSON());

        res.status(200).json({ message: 'Notification pin status updated' });
    } catch (error) {
        console.error('Error updating notification pin status:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ error: 'Failed to update pin status' });
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
