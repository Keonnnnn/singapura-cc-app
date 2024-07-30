const { Notification, User } = require('../models');

// Create Notification
exports.createNotification = async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        if (!userId || userId !== 1) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const notification = await Notification.create({ title, description, userId });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            include: [{ model: User, as: 'user', attributes: ['id'] }]
        });
        console.log(notifications)
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Get Notification by ID
exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByPk(id, {
            include: [{ model: User, as: 'user', attributes: ['id'] }]
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Notification
exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user.id;

        if (userId !== 1) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const notification = await Notification.findByPk(id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.title = title;
        notification.description = description;
        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (userId !== 1) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const notification = await Notification.findByPk(id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.destroy();
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
