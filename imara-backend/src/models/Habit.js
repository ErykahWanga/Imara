const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add habit name'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  emoji: {
    type: String,
    default: '✨'
  },
  category: {
    type: String,
    required: true,
    enum: ['health', 'mindfulness', 'productivity', 'fitness', 'social', 'creative', 'other']
  },
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'weekdays', 'weekends']
  },
  targetDays: {
    type: Number,
    default: 1
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);