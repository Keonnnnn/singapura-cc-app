const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require('yup');
const { sign } = require('jsonwebtoken');
require('dotenv').config();
const { validateToken } = require('../middlewares/auth');


// REGISTER
router.post("/register", async (req, res) => {
    let data = req.body;

    // Validation
    let validationSchema = yup.object({
        firstName: yup.string().trim().min(2).max(50).required()
        .matches(/^[a-zA-Z '-,.]+$/, "First name only allow letters, spaces and characters: ' - , ."),
        lastName: yup.string().trim().min(2).max(50).required()
        .matches(/^[a-zA-Z '-,.]+$/, "Last name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.")
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Check if email already exists
        let existingUser = await User.findOne({ where: { email: data.email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email already exists.' });
            return;
        }

        // Hash password
        data.password = await bcrypt.hash(data.password, 10);

        // Create user
        let result = await User.create(data);
        res.json({message: `Email ${result.email} was registered successfully.`});
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    let data = req.body;

    // Validation
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.")
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Check if email exists
        let errorMsg = "Email or password is incorrect.";
        let user = await User.findOne({ where: { email: data.email } });
        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Check password
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // res.json({message: `Welcome back, ${user.firstName}!`});


        // Return user info
        let userInfo = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
        let accessToken = sign(userInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });

        }

    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


// AUTHENICATE
router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
    };
    res.json({ user: userInfo });
});

module.exports = router;