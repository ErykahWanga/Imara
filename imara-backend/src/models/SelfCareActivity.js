const mongoose = require('mongoose');

const selfCareActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['mind', 'body', 'soul', 'social', 'rest', 'nourish']
  },
  dayOfWeek: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'daily'],
    required: true
  },
  time: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time in HH:MM format']
  },
  duration: {
    type: Number,
    min: [1, 'Duration must be at least 1 minute'],
    default: 15
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  icon: {
    type: String,
    default: '💖'
  },
  color: {
    type: String,
    default: '#F59E0B'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for user and day queries
selfCareActivitySchema.index({ user: 1, dayOfWeek: 1, isActive: 1 });
selfCareActivitySchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('SelfCareActivity', selfCareActivitySchema);