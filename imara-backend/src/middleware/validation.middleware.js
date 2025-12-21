const { validationResult } = require('express-validator');
const validator = require('validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const validateObjectId = (value) => {
  return validator.isMongoId(value);
};

const validateEmail = (value) => {
  return validator.isEmail(value);
};

const validatePassword = (value) => {
  return value.length >= 6;
};

const validateDate = (value) => {
  return !isNaN(Date.parse(value));
};

const validateTime = (value) => {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
};

const validateHexColor = (value) => {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
};

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return validator.escape(input.trim());
  }
  return input;
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

module.exports = {
  validate,
  validateObjectId,
  validateEmail,
  validatePassword,
  validateDate,
  validateTime,
  validateHexColor,
  sanitizeInput,
  sanitizeObject,
  sanitizeRequestBody
};