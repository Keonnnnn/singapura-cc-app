const express = require('express');
const router = express.Router();

const { Op } = require("sequelize");
const yup = require("yup");

const { Event } = require('../models');


router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        date: yup.date().required(),
        time: yup.string().trim().required(),
        venue: yup.string().trim().min(3).max(100).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Event.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await Event.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let events = await Event.findByPk(id);
    if (!events) {
        res.sendStatus(404);
        return;
    }
    res.json(events);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let events = await Event.findByPk(id);
    if (!events) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        date: yup.date().required(),
        time: yup.string().trim().required(),
        venue: yup.string().trim().min(3).max(100).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let num = await Event.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Event was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update event with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }

});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await Event.destroy({
        where: { id: id }
    })
    if (!num) {
        res.sendStatus(404);
        return;
    }
    if (num == 1) {
        res.json({
            message: "Event was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete event with id ${id}.`
        });
    }

});


module.exports = router;