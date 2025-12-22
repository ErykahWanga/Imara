const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { 
  validateEmail, 
  validatePassword, 
  validateName,
  handleValidationErrors 
} = require('../utils/validation.util');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/auth.controller');

const router = express.Router();

// Register user
router.post('/register', [
  validateName,
  validateEmail,
  validatePassword,
  handleValidationErrors
], register);

// Login user
router.post('/login', [
  validateEmail,
  validatePassword,
  handleValidationErrors
], login);

// Get current logged in user
router.get('/me', protect, getMe);

// Update user details
router.put('/updatedetails', protect, updateDetails);

// Update password
router.put('/updatepassword', protect, updatePassword);

module.exports = router;