const express = require('express');
const router = express.Router();
const yup = require('yup');
const { Announcement, User } = require('../models');
const { validateToken } = require('../middlewares/auth');


// Announcement validation schema
const validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100).required(),
    date: yup.date().required(),
    time: yup.string().trim().required(),
    location: yup.string().trim().min(3).max(100).required(),
});

// CRUD routes for announcements

// Create a new announcement
router.post("/", validateToken, async (req, res) => {
    const data = req.body;

    try {
        // Validate the data
        const validatedData = await validationSchema.validate(data, { abortEarly: false });

        // Create the announcement
        const announcement = await Announcement.create({
            userId: req.user.id,
            ...validatedData
        });

        res.status(201).json(announcement);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.findAll();
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// Get a specific announcement
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findByPk(id);
        
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json(announcement);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch announcement' });
    }
});

// Update an announcement
router.put("/:id", validateToken, async (req, res) => {
    const data = req.body;

    try {
        // Validate the data
        const validatedData = await validationSchema.validate(data, { abortEarly: false });

        // Find the announcement
        const announcement = await Announcement.findByPk(req.params.id);
        if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

        // Update the announcement
        await announcement.update(validatedData);
        res.json(announcement);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Delete an announcement
router.delete("/:id", validateToken, async (req, res) => {
    try {
        const announcement = await Announcement.findByPk(req.params.id);
        if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

        await announcement.destroy();
        res.json({ message: 'Announcement deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
