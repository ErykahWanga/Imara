const mongoose = require('mongoose');

const selfCareActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add activity title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['mind', 'body', 'soul', 'social', 'rest', 'nourish']
  },
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  time: {
    type: String,
    required: [true, 'Please add activity time'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time']
  },
  duration: {
    type: Number,
    min: 5,
    max: 480,
    default: 30
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  weekOfYear: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique activity per user per week per day
selfCareActivitySchema.index({ user: 1, weekOfYear: 1, day: 1 });

module.exports = mongoose.model('SelfCareActivity', selfCareActivitySchema);