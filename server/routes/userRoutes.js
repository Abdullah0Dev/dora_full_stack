const express = require('express');
const {
    signUp,
    logUserIn,
    logout,
    getUser,
} = require('../controllers/userController');
const {authMiddleware, requireAuth} = require('../middleware/authMiddleware')
const router = express.Router();

// Sign up
router.post('/signup', signUp);

// Login
router.post('/login', logUserIn);

// Logout
router.get('/logout', logout);

// Get user
router.get('/user' , getUser);

module.exports = router;
 