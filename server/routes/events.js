const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const yup = require("yup");
const { Event, Registration, EventRequest, User } = require('../models');
const nodemailer = require('nodemailer');
const { validateToken } = require('../middlewares/auth');

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
router.post('/:eventId/register', validateToken, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    console.log('Event ID:', eventId);
    console.log('User ID:', userId);
    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            console.log('Event not found');
            return res.status(404).json({ error: 'Event not found' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const existingRegistration = await Registration.findOne({
            where: { eventId, userId }
        });

        if (existingRegistration) {
            console.log('User already registered for this event');
            return res.status(400).json({ error: 'User already registered for this event' });
        }

        const registration = await Registration.create({
            eventId,
            userId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: user.mobileNumber,
            present: false
        });


        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff5e1;
                    border: 1px solid #e2c497;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px;
                    background-color: #e2c497;
                    color: #3d3d3d;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                }
                .header p {
                    margin: 0;
                    font-size: 18px;
                    color: #5a5a5a;
                }
                .content {
                    padding: 20px;
                }
                .content h2 {
                    font-size: 24px;
                    color: #3d3d3d;
                    border-bottom: 2px solid #e2c497;
                    padding-bottom: 10px;
                }
                .content p {
                    font-size: 16px;
                    color: #5a5a5a;
                    line-height: 1.6;
                }
                .content .details {
                    margin-top: 20px;
                    padding: 10px;
                    background-color: #fffaf2;
                    border: 1px solid #e2c497;
                }
                .content .details p {
                    margin: 5px 0;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    background-color: #e2c497;
                    color: #3d3d3d;
                }
                .footer p {
                    margin: 0;
                    font-size: 14px;
                    color: #5a5a5a;
                }
            </style>
            <title>Event Invitation</title>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>You’re Invited!</h1>
                    <p>Welcome to our Newsletter</p>
                </div>
                <div class="content">
                    <h2>${event.name}</h2>
                    <p>${event.description}</p>
                    <div class="details">
                        <p><strong>Date:</strong> ${event.date}</p>
                        <p><strong>Time:</strong> ${event.startTime} - ${event.endTime}</p>
                        <p><strong>Venue:</strong> ${event.venue}</p>
                        <p><strong>Points upon attending:</strong> ${event.points}</p>
                    </div>
                </div>
                <div class="footer">
                    <p>We’re so glad you’re here!</p>
                </div>
            </div>
        </body>
        </html>

`;
        // Send confirmation email
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: 'Event Registration Confirmation',
            html: htmlContent,
        };
        await sendMailWithPromise(mailOptions);


        res.status(201).json(registration);
    } catch (error) {
        console.error('An error occurred while registering for the event:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:eventId/mark-present', validateToken, async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const registration = await Registration.findOne({
            where: { eventId, userId }
        });

        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        if (registration.present) {
            return res.status(400).json({ error: 'User already marked as present' });
        }

        registration.present = true;
        await registration.save();

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.totalPoints += event.points; // Assuming you have a points field in the User model
        await user.save();

        res.status(200).json({ message: 'User marked as present and points credited' });
    } catch (error) {
        console.error('An error occurred while marking user as present:', error);
        res.status(500).json({ error: 'An error occurred while marking user as present' });
    }
});

// Get registrations for an event
router.get('/:eventId/registrations', async (req, res) => {
    const { eventId } = req.params;
    const registrations = await Registration.findAll({ where: { eventId } });
    res.json(registrations);
});


router.get('/user/me', validateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching user information' });
    }
});

// Event request routes
router.post("/eventrequests", async (req, res) => {
    let data = req.body;
    try {
        data = await eventRequestValidationSchema.validate(data, { abortEarly: false });
        let result = await EventRequest.create(data);

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: data.email,
            subject: 'Event Request Confirmation',
            html: `
                <p>Dear ${data.firstName} ${data.lastName},</p>
                <p>Thank you for submitting your event request. We will review it and get back to you shortly.</p>
            `,
        };

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
