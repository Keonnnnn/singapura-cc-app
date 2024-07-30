const express = require('express');
const router = express.Router();
const { Comment, User, Post, Notification } = require('../models');
const { validateToken } = require('../middlewares/auth');

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.findAll({
            where: { postId },
            include: [{ model: User, as: 'user', attributes: ['username', 'firstName', 'lastName'] }]
        });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Create a new comment
router.post('/', validateToken, async (req, res) => {
    try {
        const { content, postId } = req.body;
        const userId = req.user.id;

        const comment = await Comment.create({
            content,
            postId,
            userId
        });

        // Fetch the post to get the post owner
        const post = await Post.findByPk(postId);

        // Create a notification if the comment is not made by the post owner
        if (post && post.userId !== userId) {
            await Notification.create({
                type: 'comment',
                message: `${req.user.username} commented on your post`,
                userId: post.userId,
                fromUserId: userId,
                postId: postId
            });
        }

        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

// Update a comment
router.put('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        let comment = await Comment.findByPk(id);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        if (comment.userId !== req.user.id) {
            res.status(403).json({ error: 'You can only edit your own comments' });
            return;
        }

        comment.content = content;
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update comment' });
    }
});

// Delete a comment
router.delete('/:id', validateToken, async (req, res) => {
    try {
        const { id } = req.params;

        let comment = await Comment.findByPk(id);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        if (comment.userId !== req.user.id) {
            res.status(403).json({ error: 'You can only delete your own comments' });
            return;
        }

        await comment.destroy();
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

module.exports = router;
