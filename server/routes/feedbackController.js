const { Feedback, User } = require('../models');
const nodemailer = require('nodemailer');

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

exports.uploadFile = (req, res) => {
    if (req.file) {
        res.status(200).json({ filename: req.file.filename });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
};

// Send email function
const sendMailWithPromise = (mailOptions) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error);
        resolve(info);
      });
    });
  };

exports.createFeedback = async (req, res) => {
    const { userId, eventId, content, imageFile } = req.body;
    try {
        const feedback = await Feedback.create({ userId, eventId, content, imageFile });

        // Fetch the user to get their email
        const user = await User.findByPk(userId);
        if (user) {
            // Send a confirmation email to the user
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Feedback Submitted',
                text: `Dear ${user.firstName},\n\nThank you for your feedback!\nHope you have a Great day!\n\nBest regards,\nYour Team`
            };
            await sendMailWithPromise(mailOptions);
        }

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        if (req.file) {
            feedback.imageFile = req.file.filename;
        }
        await feedback.save();
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

// Like Feedback
exports.likeFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        feedback.likes += 1;
        await feedback.save();
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error liking feedback:', error);
        res.status(500).json({ error: error.message });
    }
};

// Unlike Feedback
exports.unlikeFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        feedback.likes = Math.max(feedback.likes - 1, 0); // Ensure likes don't go below zero
        await feedback.save();
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
