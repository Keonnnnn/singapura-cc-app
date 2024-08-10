const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Simple route
app.get("/", (req, res) => {
  res.send("Welcome to Singapura CC!");
});

// Routes
const userNotesRoute = require('./routes/userNotes');
app.use('/notes', userNotesRoute);

const userRoute = require('./routes/user');
app.use('/user', userRoute);

const fileRoute = require('./routes/file');
app.use('/file', fileRoute);

// Amelia's routes
const eventRoute = require('./routes/events');
app.use('/events', eventRoute);

// Keon's routes
const postRoute = require('./routes/post');
app.use('/post', postRoute);

const likeRoute = require('./routes/likes');
app.use('/like', likeRoute);

const commentRoute = require('./routes/comment');
app.use('/comment', commentRoute);

const notificationRoute = require('./routes/notification');
app.use('/notifications', notificationRoute);

const footerSubscribeRoute = require('./routes/footersubscribe');
app.use('/api', footerSubscribeRoute);

// Ahmed's routes
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/feedback', feedbackRoutes);

// Notification events route
const notificationEventsRoute = require('./routes/NotificationRoutes');
app.use('/notificationEvents', notificationEventsRoute);

const announcementRoutes = require('./routes/announcement');
app.use('/announcements', announcementRoutes);

// Ayura's routes
const rewardRoute = require('./routes/reward');
app.use('/reward', rewardRoute);

// Database and server setup
const db = require('./models');
const createAdminUser = require('./scripts/createAdmin');

db.sequelize.sync({ alter: true })
  .then(async () => {
    await createAdminUser();
    const port = process.env.APP_PORT || 3000; // Default to 3000 if APP_PORT isn't set
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
