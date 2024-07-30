// server/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../routes/feedbackController');
const { uploadEvent, upload } = require('../middlewares/upload');

router.post('/file/upload', uploadEvent.single('file'), feedbackController.uploadFile);
router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getAllFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.put('/:id', uploadEvent.single('file'), feedbackController.updateFeedbackResponse);
router.delete('/:id', feedbackController.deleteFeedback);
router.put('/like/:id', feedbackController.likeFeedback);
router.put('/unlike/:id', feedbackController.unlikeFeedback);

module.exports = router;

