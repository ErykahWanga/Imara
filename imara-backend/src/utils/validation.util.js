const validator = require('validator');

// Validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  hexColor: /^#[0-9A-Fa-f]{6}$/,
  time: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  url: /^https?:\/\/.+\..+$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/
};

// Validation functions
const validate = {
  // User validation
  email: (value) => validator.isEmail(value),
  password: (value) => patterns.password.test(value),
  name: (value) => value && value.length >= 2 && value.length <= 50,
  
  // Date and time validation
  date: (value) => !isNaN(Date.parse(value)),
  time: (value) => patterns.time.test(value),
  dateTime: (value) => validator.isISO8601(value),
  
  // Text validation
  text: (value, min = 1, max = 1000) => 
    value && value.length >= min && value.length <= max,
  
  // Number validation
  number: (value, min = null, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  },
  
  // Array validation
  array: (value, maxLength = 100) => 
    Array.isArray(value) && value.length <= maxLength,
  
  // Object validation
  object: (value) => 
    value && typeof value === 'object' && !Array.isArray(value),
  
  // Hex color validation
  hexColor: (value) => patterns.hexColor.test(value),
  
  // URL validation
  url: (value) => patterns.url.test(value),
  
  // Mood validation
  mood: (value) => [
    'tired', 'neutral', 'calm', 'overwhelmed', 
    'happy', 'energetic', 'sad', 'anxious', 'peaceful'
  ].includes(value),
  
  // Sleep quality validation
  sleep: (value) => ['poor', 'okay', 'good'].includes(value),
  
  // Food validation
  food: (value) => ['skipped', 'partial', 'enough'].includes(value),
  
  // Focus validation
  focus: (value) => ['low', 'medium', 'high'].includes(value)
};

// Sanitization functions
const sanitize = {
  // Trim and escape strings
  string: (value) => validator.escape(validator.trim(value)),
  
  // Convert to number
  number: (value) => Number(value),
  
  // Convert to boolean
  boolean: (value) => value === 'true' || value === true || value === 1,
  
  // Convert to date
  date: (value) => new Date(value),
  
  // Sanitize array of strings
  stringArray: (array) => array.map(item => sanitize.string(item)),
  
  // Remove HTML tags
  html: (value) => validator.stripLow(validator.escape(value))
};

// Validation middleware generator
const createValidator = (rules) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];
      const { type, required = true, min, max, enum: enumValues, custom } = rule;
      
      // Check if required field is present
      if (required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }
      
      // Skip validation if field is not required and empty
      if (!required && (value === undefined || value === null || value === '')) {
        continue;
      }
      
      // Type-specific validation
      switch (type) {
        case 'email':
          if (!validate.email(value)) {
            errors.push({ field, message: 'Invalid email format' });
          }
          break;
          
        case 'password':
          if (!validate.password(value)) {
            errors.push({ field, message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character' });
          }
          break;
          
        case 'string':
          if (!validate.text(value, min, max)) {
            errors.push({ field, message: `Must be between ${min || 1} and ${max || 1000} characters` });
          }
          break;
          
        case 'number':
          if (!validate.number(value, min, max)) {
            errors.push({ field, message: `Must be a number${min !== null ? ` >= ${min}` : ''}${max !== null ? ` <= ${max}` : ''}` });
          }
          break;
          
        case 'array':
          if (!validate.array(value, max)) {
            errors.push({ field, message: `Must be an array with max ${max || 100} items` });
          }
          break;
          
        case 'enum':
          if (!enumValues.includes(value)) {
            errors.push({ field, message: `Must be one of: ${enumValues.join(', ')}` });
          }
          break;
          
        case 'date':
          if (!validate.date(value)) {
            errors.push({ field, message: 'Invalid date format' });
          }
          break;
          
        case 'time':
          if (!validate.time(value)) {
            errors.push({ field, message: 'Invalid time format (HH:MM)' });
          }
          break;
          
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push({ field, message: 'Must be a boolean' });
          }
          break;
          
        case 'object':
          if (!validate.object(value)) {
            errors.push({ field, message: 'Must be an object' });
          }
          break;
          
        case 'hexColor':
          if (!validate.hexColor(value)) {
            errors.push({ field, message: 'Invalid hex color format (#RRGGBB)' });
          }
          break;
          
        case 'url':
          if (!validate.url(value)) {
            errors.push({ field, message: 'Invalid URL format' });
          }
          break;
          
        case 'custom':
          if (custom && !custom(value)) {
            errors.push({ field, message: 'Invalid value' });
          }
          break;
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  validate,
  sanitize,
  createValidator
};