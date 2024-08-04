const { notificationEvents, User } = require('../models');

exports.createNotification = async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        // Debugging: Log the incoming request data
        console.log('Received request to create notification:', { title, description, userId });

        // Validate required fields
        if (!title || !description || !userId) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate user authorization
        if (userId !== 1) {
            console.error('Authorization failed: Unauthorized user');
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Create the notification
        const notification = await notificationEvents.create({ title, description, userId });

        // Debugging: Log the created notification
        console.log('Notification created:', notification.toJSON());

        res.status(201).json(notification);
    } catch (error) {
        // Debugging: Log the error details
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

        // Debugging: Log the fetched notification
        console.log('Fetched notification:', notification.toJSON());

        res.status(200).json(notification);
    } catch (error) {
        // Debugging: Log the error details
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
    console.log('Received request to fetch all notifications'); // Initial log
    try {
        const notifications = await notificationEvents.findAll({
            include: [{ model: User, as: 'user', attributes: ['id'] }]
        });

        // Debugging: Log the fetched notifications
        console.log('Fetched notifications:', notifications);

        // Respond with the fetched notifications
        res.status(200).json(notifications);
    } catch (error) {
        // Debugging: Log the error details
        console.error('Error fetching notifications:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        // Respond with an error message
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Validate required fields
        if (!title || !description) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const notification = await notificationEvents.findOne({ where: { id } });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Update the notification
        await notification.update({ title, description });

        // Debugging: Log the updated notification
        console.log('Notification updated:', notification.toJSON());

        res.status(200).json(notification);
    } catch (error) {
        // Debugging: Log the error details
        console.error('Error updating notification:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ error: 'Failed to update notification' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await notificationEvents.findOne({ where: { id } });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Delete the notification
        await notification.destroy();

        // Debugging: Log the deletion
        console.log('Notification deleted:', notification.toJSON());

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        // Debugging: Log the error details
        console.error('Error deleting notification:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            details: error.errors ? error.errors.map(e => e.message) : null
        });

        res.status(500).json({ error: 'Failed to delete notification' });
    }
};
