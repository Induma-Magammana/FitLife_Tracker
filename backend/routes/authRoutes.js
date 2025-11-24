const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/verify', authMiddleware, authController.verifyToken);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
