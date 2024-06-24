const express = require('express');
require('dotenv').config();

const cors = require('cors');

const app = express();

app.use(express.json());

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


const db = require('./models');
db.sequelize.sync({alter: true})
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });