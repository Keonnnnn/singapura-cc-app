const express = require('express');
const router = express.Router();
const feedbackController = require('./feedbackController');

// Define routes for feedback operations
router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getAllFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.put('/:id', feedbackController.updateFeedbackResponse);
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
