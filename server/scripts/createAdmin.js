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

        // Temporarily reset the id sequence so the admin gets id 1
        await sequelize.query(`SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false)`);

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

        // Reset the sequence to continue from the next available ID
        await sequelize.query(`SELECT setval(pg_get_serial_sequence('users', 'id'), 2, false)`);
    } catch (err) {
        console.error("Error creating admin user:", err);
    }
}

module.exports = createAdminUser;
