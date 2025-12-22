const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { validateHabit, handleValidationErrors } = require('../utils/validation.util');
const {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
  getHabitCompletions,
  getHabitStats
} = require('../controllers/habit.controller');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Create habit
router.post('/', [
  validateHabit,
  handleValidationErrors
], createHabit);

// Get all habits
router.get('/', getHabits);

// Get habit statistics
router.get('/stats', getHabitStats);

// Get single habit
router.get('/:id', getHabit);

// Update habit
router.put('/:id', updateHabit);

// Delete habit
router.delete('/:id', deleteHabit);

// Toggle habit completion
router.post('/:id/complete', toggleHabitCompletion);

// Get habit completions
router.get('/:id/completions', getHabitCompletions);

module.exports = router;