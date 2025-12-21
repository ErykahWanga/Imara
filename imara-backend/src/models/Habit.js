const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true,
    minlength: [2, 'Habit name must be at least 2 characters'],
    maxlength: [100, 'Habit name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  emoji: {
    type: String,
    default: '✨'
  },
  category: {
    type: String,
    enum: ['health', 'productivity', 'mindfulness', 'social', 'learning', 'other'],
    default: 'other'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  goal: {
    type: Number,
    min: [1, 'Goal must be at least 1'],
    default: 1
  },
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastCompleted: {
      type: Date,
      default: null
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  reminders: [{
    time: String,
    enabled: Boolean
  }],
  color: {
    type: String,
    default: '#F59E0B'
  }
}, {
  timestamps: true
});

// Update streak method
habitSchema.methods.updateStreak = function(completedToday) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (!this.streak.lastCompleted) {
    this.streak.current = completedToday ? 1 : 0;
  } else {
    const lastCompleted = new Date(this.streak.lastCompleted);
    const diffDays = Math.floor((now - lastCompleted) / (1000 * 60 * 60 * 24));
    
    if (completedToday) {
      if (diffDays === 1) {
        this.streak.current += 1;
      } else if (diffDays > 1) {
        this.streak.current = 1;
      }
    } else if (diffDays > 1) {
      this.streak.current = 0;
    }
  }
  
  if (completedToday) {
    this.streak.lastCompleted = now;
  }
  
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  
  return this.streak.current;
};

module.exports = mongoose.model('Habit', habitSchema);