const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const yup = require("yup");
const { Event, Registration, EventRequest } = require('../models');
const nodemailer = require('nodemailer');

// Send email function
const sendMailWithPromise = (mailOptions) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error);
        resolve(info);
      });
    });
  };
  

// Event validation schema
const validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().min(3).max(500).required(),
    date: yup.date().required(),
    startTime: yup.string().trim().required(),
    endTime: yup.string().trim().required(),
    venue: yup.string().trim().min(3).max(100).required(),
    points: yup.number().min(100).max(1000).required()
});

// Registration validation schema
const registrationSchema = yup.object().shape({
    name: yup.string().trim().required("Name is required"),
    email: yup.string().trim().email("Invalid email format").required("Email is required"),
    contact: yup.string().trim().required("Contact is required"),
});

// Event request validation schema
const eventRequestValidationSchema = yup.object({
    firstName: yup.string().trim().required(),
    lastName: yup.string().trim().required(),
    email: yup.string().trim().email().required(),
    organisation: yup.string().trim().required(),
    eventTitle: yup.string().trim().required(),
    eventType: yup.string().trim().required(),
    eventDescription: yup.string().trim().required(),
});

// CRUD routes for events
router.post("/", async (req, res) => {
    let data = req.body;
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Event.create(data);
        res.json(result);
    } catch (err) {
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
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }
    res.json(event);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let num = await Event.update(data, { where: { id: id } });
        if (num == 1) {
            res.json({ message: "Event was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update event with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await Event.destroy({ where: { id: id } });
    if (!num) {
        res.sendStatus(404);
        return;
    }
    if (num == 1) {
        res.json({ message: "Event was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete event with id ${id}.` });
    }
});

// Registration route
router.post('/:eventId/register', async (req, res) => {
    const { eventId } = req.params;
    const { name, email, contact } = req.body;
    try {
        await registrationSchema.validate({ name, email, contact });

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const registration = await Registration.create({ eventId, name, email, contact });

        // Send confirmation email
        
        res.status(201).json(registration);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Event request routes
router.post("/eventrequests", async (req, res) => {
    let data = req.body;
    console.log("Received data: ", data);  // Log the data received
    try {
        data = await eventRequestValidationSchema.validate(data, { abortEarly: false });
        let result = await EventRequest.create(data);

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: data.email,
            subject: 'Event Request Confirmation',
            text: `
                <p>Dear ${data.firstName} ${data.lastName},</p>
                <p>Thank you for submitting your event request. We will review it and get back to you shortly.</p>
            `,
        };

        // Log the mailOptions object for debugging
        console.log('Mail Options:', mailOptions);
        await sendMailWithPromise(mailOptions);

        res.json(result);
    } catch (err) {
        console.log("Validation error: ", err.errors);  // Log the validation errors
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/eventrequests", async (req, res) => {
    let list = await EventRequest.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

module.exports = router;
