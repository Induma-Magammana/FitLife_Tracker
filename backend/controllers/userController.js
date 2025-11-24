const users = require('../data/users.json');

// In-memory storage
let usersData = [...users];

/**
 * Get user profile
 */
exports.getUserProfile = (req, res) => {
  try {
    const user = usersData.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

/**
 * Update user profile
 */
exports.updateUserProfile = (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userIndex = usersData.findIndex(u => u.id === req.userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user data
    if (firstName) usersData[userIndex].firstName = firstName;
    if (lastName) usersData[userIndex].lastName = lastName;
    if (email) usersData[userIndex].email = email.toLowerCase();

    const { password: _, ...userWithoutPassword } = usersData[userIndex];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};
