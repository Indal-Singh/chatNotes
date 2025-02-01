const express = require('express');
const { register, login, logout, verifyUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { createTopic } = require('../controllers/webController');
const router = express.Router();

// auth routes
router.post('/user/register', register);
router.post('/user/login', login);
router.post('/user/logout', logout);
router.post('/user/verify', authenticate, verifyUser);

// topic routes
router.post('/topic/create', authenticate ,createTopic);

module.exports = router;