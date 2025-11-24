const exercises = require('../data/exercises.json');

/**
 * Get all exercises
 */
exports.getAllExercises = (req, res) => {
  try {
    const { muscle, difficulty, type, search } = req.query;
    
    let filteredExercises = [...exercises];

    // Filter by muscle
    if (muscle) {
      filteredExercises = filteredExercises.filter(
        ex => ex.muscle.toLowerCase() === muscle.toLowerCase()
      );
    }

    // Filter by difficulty
    if (difficulty) {
      filteredExercises = filteredExercises.filter(
        ex => ex.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Filter by type
    if (type) {
      filteredExercises = filteredExercises.filter(
        ex => ex.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Search by name or instructions
    if (search) {
      const searchLower = search.toLowerCase();
      filteredExercises = filteredExercises.filter(
        ex => ex.name.toLowerCase().includes(searchLower) ||
             ex.instructions.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      count: filteredExercises.length,
      data: filteredExercises
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exercises',
      error: error.message
    });
  }
};

/**
 * Get exercise by ID
 */
exports.getExerciseById = (req, res) => {
  try {
    const { id } = req.params;
    const exercise = exercises.find(ex => ex.id === id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching exercise',
      error: error.message
    });
  }
};

/**
 * Get available filters
 */
exports.getFilters = (req, res) => {
  try {
    const muscles = [...new Set(exercises.map(ex => ex.muscle))];
    const difficulties = [...new Set(exercises.map(ex => ex.difficulty))];
    const types = [...new Set(exercises.map(ex => ex.type))];
    const equipment = [...new Set(exercises.map(ex => ex.equipment))];

    res.json({
      success: true,
      data: {
        muscles,
        difficulties,
        types,
        equipment
      }
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filters',
      error: error.message
    });
  }
};
