const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require('yup');
const { sign } = require('jsonwebtoken'); 
require('dotenv').config();
const { validateToken, isAdmin } = require('../middlewares/auth');

// REGISTER CUSTOMER
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
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."),
        confirmPassword: yup.string().trim()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')
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
        res.json({ message: `Email ${result.email} was registered successfully.` });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// CREATE STAFF WITH ADMIN ROLE
router.post("/register-staff", validateToken, isAdmin, async (req, res) => {
    const data = req.body;

    // Validation
    let validationSchema = yup.object({
        firstName: yup.string().trim().min(2).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/, "First name only allow letters, spaces and characters: ' - , ."),
        lastName: yup.string().trim().min(2).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/, "Last name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."),
        confirmPassword: yup.string().trim()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')
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

        // Set role to 'Staff'
        data.role = 'Staff';

        // Create user (staff)
        let result = await User.create(data);
        res.json({ message: `Staff account for ${result.email} was created successfully.` });
    } catch (err) {
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

        // Return user info
        let userInfo = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            role: user.role
        };
        let accessToken = sign(userInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });

    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// AUTHENTICATE
router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role
    };
    res.json({ user: userInfo });
});

// UPDATE USER
router.put("/:id", validateToken, async (req, res) => {
    const { id } = req.params;
    let userData = req.body;

    // Validation
    let validationSchema = yup.object({
        firstName: yup.string().trim().min(2).max(50)
            .matches(/^[a-zA-Z '-,.]+$/, "First name only allow letters, spaces and characters: ' - , ."),
        lastName: yup.string().trim().min(2).max(50)
            .matches(/^[a-zA-Z '-,.]+$/, "Last name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50),
        username: yup.string().trim().min(1).max(50)
            .matches(/^[a-zA-Z0-9_.-]+$/, "Username only allows letters, numbers, underscores, periods, and hyphens."),
    });

    try {
        userData = await validationSchema.validate(userData, { abortEarly: false });

        // Check if user exists
        let user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Exclude role from update data
        delete userData.role;

        // Update user data
        await User.update(userData, { where: { id } });

        // Return updated user data
        user = await User.findByPk(id);
        res.json(user);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// DELETE USER
router.delete("/:id", validateToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Check if user exists
        let user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Delete user
        await User.destroy({ where: { id } });

        res.json({ message: `User with ID ${id} deleted successfully.` });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// RETRIEVE ALL USERS
router.get("/", validateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// RETRIEVE SINGLE USER BY ID
router.get("/:id", validateToken, async (req, res) => {
    const { id } = req.params;

    try {
        let user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
