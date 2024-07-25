const express = require('express');
const router = express.Router();
const { Like } = require('../models');
const { validateToken } = require('../middlewares/auth');

router.post("/:postId/like", validateToken, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    try {
        const like = await Like.create({ postId, userId });
        res.json(like);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post("/:postId/unlike", validateToken, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    try {
        const like = await Like.findOne({ where: { postId, userId } });
        if (like) {
            await like.destroy();
            res.json({ message: "Post unliked successfully" });
        } else {
            res.status(404).json({ message: "Like not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
