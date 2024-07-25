// const express = require('express');
// //const sequelize = require('./config/database');
// const feedbackRoutes = require('./routes/feedbackRoutes');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware to parse JSON
// app.use(express.json());

// // Enable CORS
// app.use(cors());

// // Routes
// app.use('/api/feedback', feedbackRoutes);

// // Root Route
// app.get('/', (req, res) => {
//     res.send('Welcome to the Feedback API');
// });

// // Verify Database Connection
// sequelize.authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

// // Connect to the database and start the server
// sequelize.sync({ alter: true }).then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
// }).catch(err => {
//     console.error('Unable to connect to the database:', err);
// });
