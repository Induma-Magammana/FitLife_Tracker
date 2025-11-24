const express = require('express');
const router = express.Router();
const tipsController = require('../controllers/tipsController');

// Get all tips
router.get('/', tipsController.getAllTips);

// Get tip categories
router.get('/categories', tipsController.getCategories);

// Get tip by ID
router.get('/:id', tipsController.getTipById);

module.exports = router;
