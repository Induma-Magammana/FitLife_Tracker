const tips = require('../data/tips.json');

/**
 * Get all tips
 */
exports.getAllTips = (req, res) => {
  try {
    const { category, random } = req.query;

    let filteredTips = [...tips];

    // Filter by category
    if (category) {
      filteredTips = filteredTips.filter(
        tip => tip.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Get random tips
    if (random) {
      const count = parseInt(random) || 5;
      filteredTips = filteredTips
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    }

    res.json({
      success: true,
      count: filteredTips.length,
      data: filteredTips
    });
  } catch (error) {
    console.error('Get tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tips',
      error: error.message
    });
  }
};

/**
 * Get tip by ID
 */
exports.getTipById = (req, res) => {
  try {
    const { id } = req.params;
    const tip = tips.find(t => t.id === id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Tip not found'
      });
    }

    res.json({
      success: true,
      data: tip
    });
  } catch (error) {
    console.error('Get tip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tip',
      error: error.message
    });
  }
};

/**
 * Get tip categories
 */
exports.getCategories = (req, res) => {
  try {
    const categories = [...new Set(tips.map(tip => tip.category))];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};
