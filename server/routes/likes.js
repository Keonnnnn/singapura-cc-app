const express = require('express');
const router = express.Router();
const { Like, Post, Notification, User } = require('../models');
const { validateToken } = require('../middlewares/auth');

// Like a post
router.post('/:postId/like', validateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        // Check if the user has already liked the post
        const existingLike = await Like.findOne({ where: { postId, userId: req.user.id } });
        if (existingLike) {
            return res.status(400).json({ error: 'You have already liked this post' });
        }


        const like = await Like.create({ postId, userId: req.user.id });

        try {
            // send notification to the post owner
            const post = await Post.findByPk(postId);
            if (post.userId !== req.user.id) {
                try {
                    const user = await User.findByPk(req.user.id);
                    const notification = await Notification.create({
                        type: 'like',
                        message: `${user.firstName} ${user.lastName} liked your post`,
                        userId: post.userId,
                        postId: post.id,
                        fromUserId: req.user.id
                    });
                } catch (e)
                {
                    console.log(e);
                }
            }
        } catch (e)
        {
            console.log(e);
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
        // Check if the user has already liked the post
        const existingLike = await Like.findOne({ where: { postId, userId: req.user.id } });
        if (!existingLike) {
            return res.status(400).json({ error: 'You have not liked this post' });
        }

        await Like.destroy({ where: { postId, userId: req.user.id } });
        res.json({ message: 'Unliked successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to unlike post' });
    }
});

module.exports = router;
