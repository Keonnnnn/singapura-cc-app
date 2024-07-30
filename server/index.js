const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

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

// Keon
const postRoute = require('./routes/post');
app.use('/post', postRoute);

const likeRoute = require('./routes/likes'); 
app.use("/like", likeRoute);

const commentRoute = require('./routes/comment');
app.use('/comment', commentRoute);

const notificationRoute = require('./routes/notification');
app.use('/notifications', notificationRoute); ///

// Ahmed's Feedback API route
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/feedback', feedbackRoutes);
const notificationEventsRoute = require('./routes/NotificationRoutes'); // Added this line
app.use('/notificationEvents', notificationEventsRoute); // Added this line (ERROR)


const db = require('./models');
const createAdminUser = require('./scripts/createAdmin'); 

//ayura routes 
const rewardRoute = require('./routes/reward');
app.use("/reward", rewardRoute);

db.sequelize.sync({ alter: true })
    .then(async () => {
        await createAdminUser(); 
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
