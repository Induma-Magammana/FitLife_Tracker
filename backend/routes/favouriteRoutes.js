const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get user's favourites
router.get('/', favouriteController.getUserFavourites);

// Add to favourites
router.post('/', favouriteController.addFavourite);

// Remove from favourites
router.delete('/:exerciseName', favouriteController.removeFavourite);

// Clear all favourites
router.delete('/', favouriteController.clearFavourites);

module.exports = router;
