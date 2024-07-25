const express = require('express');
const router = express.Router();
const { Reward } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        rewardName: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        Points: yup.number().min(1000).max(10000).integer().required(),
        Tier: yup.string().trim().min(3).max(100).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Reward.create(data);
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
            { rewardName: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { Points: { [Op.like]: `%${search}%` } },
            { Tier: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;
    let list = await Reward.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let reward = await Reward.findByPk(id);
    if (!reward) {
        res.sendStatus(404);
        return;
    }
    res.json(reward);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let reward = await Reward.findByPk(id);
    if (!reward) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    let validationSchema = yup.object({
        rewardName: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        Points: yup.number().min(1000).max(10000).integer().required(),
        Tier: yup.string().trim().min(3).max(100).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

            let num = await Reward.update(data, {
                where: { id: id }
            });
            if (num == 1) {
                res.json({
                    message: "Reward was updated successfully."
                });
            }
            else {
                res.status(400).json({
                    message: `Cannot update reward with id ${id}.`
                });
            }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }

});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await Reward.destroy({
        where: { id: id }
    })
    if (!num) {
        res.sendStatus(404);
        return;
    }
    if (num == 1) {
        res.json({
            message: "Reward was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete reward with id ${id}.`
        });
    }
});
module.exports = router;