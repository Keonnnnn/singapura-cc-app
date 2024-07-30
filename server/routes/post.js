const express = require('express');
const router = express.Router();
const { User, Post, Like, Comment, Follower } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken, isAdmin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Create a new post
router.post("/", validateToken, upload.single('imageFile'), async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;

    // If a file was uploaded, add its filename to the data
    if (req.file) {
        data.imageFile = req.file.filename;
    }

    // Validation schema
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });

    try {
        // Validate data
        data = await validationSchema.validate(data, { abortEarly: false });

        // Create post
        let result = await Post.create(data);
        res.json(result);
    } catch (err) {
        console.log(err)
        res.status(400).json({ errors: err.errors });
    }
});

// Get all posts
router.get("/", validateToken, async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let userId = req.query.userId;
    let filter = req.query.filter;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    if (userId) {
        condition.userId = userId;
    }

    if (filter === "following") {
        const followingUsers = await Follower.findAll({ 
            where: { followerId: req.user.id }, 
            attributes: ['followedId'] 
        });
        const followingIds = followingUsers.map(f => f.followedId);
        condition.userId = { [Op.in]: followingIds };
    }

    let list = await Post.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: [
            { model: User, as: "user", attributes: ['firstName', 'lastName', 'username'] },
            { model: Like, attributes: ['userId'] },
            { model: Comment, attributes: ['id'] }  // Include comments
        ]
    });

    res.json(list);
});

// Get a single post by id
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let post = await Post.findByPk(id, {
        include: { model: User, as: "user", attributes: ['firstName', 'lastName', 'username'] }
    });
    // Check if post is not found
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.json(post);
});

// Update a post
router.put("/:id", validateToken, upload.single('imageFile'), async (req, res) => {
    let id = req.params.id;
    // Check if post is not found
    let post = await Post.findByPk(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (post.userId !== userId && req.user.role !== 'Admin') {
        res.sendStatus(403);
        return;
    }

    let data = req.body;

    // If a file was uploaded, add its filename to the data
    if (req.file) {
        data.imageFile = req.file.filename;
    }

    // Validation schema
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500)
    });

    try {
        // Validate data
        data = await validationSchema.validate(data, { abortEarly: false });

        // Update post
        let num = await Post.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Post was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update post with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Delete a post
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check if post is not found
    let post = await Post.findByPk(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (post.userId !== userId && req.user.role !== 'Admin') {
        res.sendStatus(403);
        return;
    }

    let num = await Post.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Post was deleted successfully."
        });
    } else {
        res.status(400).json({
            message: `Cannot delete post with id ${id}.`
        });
    }
});

module.exports = router;
