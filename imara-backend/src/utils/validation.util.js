const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Common validation rules
const validateEmail = body('email')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail();

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

const validateName = body('name')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Name must be between 2 and 50 characters');

const validateCheckIn = [
  body('sleep')
    .isIn(['poor', 'okay', 'good'])
    .withMessage('Sleep must be poor, okay, or good'),
  body('food')
    .isIn(['skipped', 'partial', 'enough'])
    .withMessage('Food must be skipped, partial, or enough'),
  body('focus')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Focus must be low, medium, or high'),
  body('mood')
    .isIn(['tired', 'neutral', 'calm', 'overwhelmed', 'happy', 'energetic'])
    .withMessage('Invalid mood value'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot be more than 1000 characters')
];

const validateJournal = [
  body('content')
    .notEmpty()
    .withMessage('Journal content is required')
    .isLength({ max: 5000 })
    .withMessage('Content cannot be more than 5000 characters'),
  body('mood')
    .optional()
    .isIn(['tired', 'neutral', 'calm', 'overwhelmed', 'happy', 'energetic'])
    .withMessage('Invalid mood value'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const validateHabit = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Habit name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot be more than 100 characters'),
  body('category')
    .isIn(['health', 'mindfulness', 'productivity', 'fitness', 'social', 'creative', 'other'])
    .withMessage('Invalid category'),
  body('frequency')
    .isIn(['daily', 'weekly', 'weekdays', 'weekends'])
    .withMessage('Invalid frequency')
];

const validateCommunityPost = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ max: 2000 })
    .withMessage('Content cannot be more than 2000 characters'),
  body('type')
    .isIn(['journey', 'question', 'support', 'celebration', 'tip'])
    .withMessage('Invalid post type'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
];

module.exports = {
  handleValidationErrors,
  validateEmail,
  validatePassword,
  validateName,
  validateCheckIn,
  validateJournal,
  validateHabit,
  validateCommunityPost
};