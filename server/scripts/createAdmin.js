const { User, sequelize } = require('../models');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdminUser() {
    try {
        // Check if an admin user already exists
        const adminUser = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } });
        if (adminUser) {
            console.log("Admin user already exists.");
            return;
        }

        // Temporarily disable auto-increment
        await sequelize.query(`ALTER TABLE users AUTO_INCREMENT = 1`);

        // Create admin user with ID 1
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await User.create({
            id: 1, 
            firstName: 'Admin',
            lastName: 'User',
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'Admin'
        });

        console.log("Admin user created successfully.");

        // Reset auto-increment to continue from the next available ID
        await sequelize.query(`ALTER TABLE users AUTO_INCREMENT = 2`);
    } catch (err) {
        console.error("Error creating admin user:", err);
    }
}

module.exports = createAdminUser;
