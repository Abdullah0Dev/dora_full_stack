require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const doraRoutes = require('./routes/doraRoutes')
const userRoutes = require('./routes/userRoutes')
const {checkUser} = require('./middleware/authMiddleware')
const app = express();

// middlewares 
app.use(express.json()); 
app.use(cors());
app.use(cookieParser());

 

// routes
// app.get('*', checkUser);
app.use('/api/dora', doraRoutes); // http://localhost:4000/api/dora/
app.use('/api/auth', userRoutes); // http://localhost:4000/api/auth/
// connect to mongodb
const DB_URL = process.env.DB_URI
const PORT = process.env.PORT || 4000

mongoose.connect(DB_URL)
    .then(() => app.listen(PORT, () => console.log(`Connected and running on:`, PORT)))
    .catch((error) => console.log(`Error:`, error.message))


    // Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});