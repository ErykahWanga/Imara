const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { validateCheckIn, handleValidationErrors } = require('../utils/validation.util');
const {
  createCheckIn,
  getCheckIns,
  getCheckIn,
  updateCheckIn,
  deleteCheckIn,
  getCheckInStats
} = require('../controllers/checkin.controller');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Create check-in
router.post('/', [
  validateCheckIn,
  handleValidationErrors
], createCheckIn);

// Get all check-ins
router.get('/', getCheckIns);

// Get check-in statistics
router.get('/stats', getCheckInStats);

// Get single check-in
router.get('/:id', getCheckIn);

// Update check-in
router.put('/:id', updateCheckIn);

// Delete check-in
router.delete('/:id', deleteCheckIn);

module.exports = router;