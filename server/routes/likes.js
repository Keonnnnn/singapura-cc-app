const express = require('express');
const router = express.Router();
const { Like, Post, Notification, User } = require('../models');
const { validateToken } = require('../middlewares/auth');

// Like a post
router.post('/:postId/like', validateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const like = await Like.create({ postId, userId: req.user.id });
        
        // Find the post owner
        const post = await Post.findByPk(postId);
        if (post.userId !== req.user.id) {
            // Create a notification for the post owner
            await Notification.create({
                type: 'like',
                message: `${req.user.username} liked your post.`,
                userId: post.userId,
                fromUserId: req.user.id
            });
        }

        res.json(like);
    } catch (err) {
        res.status(500).json({ error: 'Failed to like post' });
    }
});

// Unlike a post
router.post('/:postId/unlike', validateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        await Like.destroy({ where: { postId, userId: req.user.id } });
        res.json({ message: 'Unliked successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to unlike post' });
    }
});

module.exports = router;
