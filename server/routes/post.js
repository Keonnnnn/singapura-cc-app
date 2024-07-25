const express = require('express');
const router = express.Router();
const { User, Post, Like } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');
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
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await Post.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: [
            { model: User, as: "user", attributes: ['firstName', 'lastName'] },
            { model: Like, attributes: ['userId'] }
        ]
    });

    res.json(list);
});

// Get a single post by id
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let post = await Post.findByPk(id, {
        include: { model: User, as: "user", attributes: ['firstName', 'lastName'] }
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

    // Check request user id
    let userId = req.user.id;
    if (post.userId != userId) {
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

    // Check request user id
    let userId = req.user.id;
    if (post.userId != userId) {
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
