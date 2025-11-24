// In-memory storage for favourites (in production, use a database)
const favourites = {};

/**
 * Get user's favourites
 */
exports.getUserFavourites = (req, res) => {
  try {
    const userId = req.userId;
    const userFavourites = favourites[userId] || [];

    res.json({
      success: true,
      count: userFavourites.length,
      data: userFavourites
    });
  } catch (error) {
    console.error('Get favourites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favourites',
      error: error.message
    });
  }
};

/**
 * Add exercise to favourites
 */
exports.addFavourite = (req, res) => {
  try {
    const userId = req.userId;
    const exercise = req.body;

    if (!exercise || !exercise.name) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exercise data'
      });
    }

    // Initialize user's favourites if not exists
    if (!favourites[userId]) {
      favourites[userId] = [];
    }

    // Check if already in favourites
    const exists = favourites[userId].some(fav => fav.name === exercise.name);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Exercise already in favourites'
      });
    }

    // Add to favourites
    favourites[userId].push({
      ...exercise,
      addedAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Exercise added to favourites',
      data: favourites[userId]
    });
  } catch (error) {
    console.error('Add favourite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favourites',
      error: error.message
    });
  }
};

/**
 * Remove exercise from favourites
 */
exports.removeFavourite = (req, res) => {
  try {
    const userId = req.userId;
    const { exerciseName } = req.params;

    if (!favourites[userId]) {
      return res.status(404).json({
        success: false,
        message: 'No favourites found'
      });
    }

    const initialLength = favourites[userId].length;
    favourites[userId] = favourites[userId].filter(
      fav => fav.name !== exerciseName
    );

    if (favourites[userId].length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found in favourites'
      });
    }

    res.json({
      success: true,
      message: 'Exercise removed from favourites',
      data: favourites[userId]
    });
  } catch (error) {
    console.error('Remove favourite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favourites',
      error: error.message
    });
  }
};

/**
 * Clear all favourites
 */
exports.clearFavourites = (req, res) => {
  try {
    const userId = req.userId;
    favourites[userId] = [];

    res.json({
      success: true,
      message: 'All favourites cleared',
      data: []
    });
  } catch (error) {
    console.error('Clear favourites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing favourites',
      error: error.message
    });
  }
};
