const {Feedback} = require('../models');

// Helper function for validation
const validateFeedback = (data) => {
    const { userId, eventId, content } = data;
    if (!userId || !Number.isInteger(parseInt(userId))) {
        return 'Invalid or missing userId';
    }
    if (!eventId || !Number.isInteger(parseInt(eventId))) {
        return 'Invalid or missing eventId';
    }
    if (!content || typeof content !== 'string') {
        return 'Invalid or missing content';
    }
    return null;
};

// Create Feedback
exports.createFeedback = async (req, res) => {
    const validationError = validateFeedback(req.body);
    if (validationError) {
        console.log('Validation Error:', validationError);
        return res.status(400).json({ error: validationError });
    }
    try {
        const { userId, eventId, content } = req.body;
        const feedback = await Feedback.create({ userId, eventId, content });
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get feedback by ID
exports.getFeedbackById = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Feedback
exports.updateFeedbackResponse = async (req, res) => {
    const { id } = req.params;
    const { userId, eventId, content, response } = req.body;
    const validationError = validateFeedback({ userId, eventId, content });
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }
    try {
        const feedback = await Feedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        feedback.userId = userId;
        feedback.eventId = eventId;
        feedback.content = content;
        feedback.response = response;
        await feedback.save();
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// delete feedback
exports.deleteFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        await feedback.destroy();
        res.status(200).json({ message: 'Feedback deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
