const express = require('express');
const router = express.Router();
const { User, Notes } = require('../models');
const { Op } = require('sequelize');
const yup = require('yup');
const { validateToken } = require('../middlewares/auth');

// CREATE NOTE
router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;

    // Validation
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Process valid data
        let result = await Notes.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// RETRIEVE ALL NOTES
router.get("/", validateToken, async (req, res) => {
    let condition = { userId: req.user.id };  // Add this condition to filter by userId
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await Notes.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: 'user', attributes: ['firstName', 'lastName'] } // PRAC 5B
    });
    res.json(list);
});

// RETRIEVE SINGLE NOTE BY ID
router.get("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let note = await Notes.findByPk(id);

    // check ID not found
    if (!note || note.userId !== req.user.id) {
        res.sendStatus(404);
        return;
    }
    res.json(note);
});

// UPDATE NOTE
router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // check ID not found
    let note = await Notes.findByPk(id);
    if (!note) {
        res.sendStatus(404);
        return;
    }

    // Check request user ID (PRAC 5B)
    let userId = req.user.id;
    if (note.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;

    // Validation
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Process valid data
        let num = await Notes.update(data, { where: { id: id } });

        if (num == 1) {
            res.json({ message: "Note was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update note with ID ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// DELETE NOTE
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    // check ID not found
    let note = await Notes.findByPk(id);
    if (!note) {
        res.sendStatus(404);
        return;
    }

    // Check request user ID (PRAC 5B)
    let userId = req.user.id;
    if (note.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Notes.destroy({ where: { id: id } });

    if (num == 1) {
        res.json({ message: "Note was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete note with ID ${id}.` });
    }
});

module.exports = router;
