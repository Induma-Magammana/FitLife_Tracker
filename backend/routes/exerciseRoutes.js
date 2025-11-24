const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// Get all exercises with optional filters
router.get('/', exerciseController.getAllExercises);

// Get available filters
router.get('/filters', exerciseController.getFilters);

// Get exercise by ID
router.get('/:id', exerciseController.getExerciseById);

module.exports = router;
