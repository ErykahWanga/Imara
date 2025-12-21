const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Reminder title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  time: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time in HH:MM format']
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekdays', 'weekends', 'weekly', 'monthly', 'once'],
    default: 'daily'
  },
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastTriggered: {
    type: Date
  },
  nextTrigger: {
    type: Date,
    index: true
  },
  notificationType: {
    type: String,
    enum: ['push', 'email', 'both'],
    default: 'push'
  },
  category: {
    type: String,
    enum: ['checkin', 'habit', 'selfcare', 'meditation', 'water', 'break', 'custom'],
    default: 'custom'
  },
  icon: {
    type: String,
    default: '⏰'
  },
  color: {
    type: String,
    default: '#F59E0B'
  },
  snoozeDuration: {
    type: Number,
    min: 1,
    max: 60,
    default: 5
  },
  maxSnoozes: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

// Calculate next trigger date
reminderSchema.pre('save', function(next) {
  if (this.isModified('time') || this.isModified('frequency') || this.isModified('days')) {
    this.calculateNextTrigger();
  }
  next();
});

// Method to calculate next trigger
reminderSchema.methods.calculateNextTrigger = function() {
  if (!this.isActive) {
    this.nextTrigger = null;
    return;
  }
  
  const now = new Date();
  const [hours, minutes] = this.time.split(':').map(Number);
  
  let nextDate = new Date();
  nextDate.setHours(hours, minutes, 0, 0);
  
  if (nextDate <= now) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  
  // Adjust for frequency
  if (this.frequency === 'weekdays') {
    while ([0, 6].includes(nextDate.getDay())) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
  } else if (this.frequency === 'weekends') {
    while (![0, 6].includes(nextDate.getDay())) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
  } else if (this.frequency === 'weekly' && this.days && this.days.length > 0) {
    const dayMap = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    
    const currentDay = nextDate.getDay();
    const targetDays = this.days.map(day => dayMap[day]).sort((a, b) => a - b);
    
    let nextDay = targetDays.find(day => day > currentDay);
    if (!nextDay) {
      nextDay = targetDays[0];
      nextDate.setDate(nextDate.getDate() + (7 - currentDay + nextDay));
    } else {
      nextDate.setDate(nextDate.getDate() + (nextDay - currentDay));
    }
  }
  
  this.nextTrigger = nextDate;
};

// Method to trigger reminder
reminderSchema.methods.trigger = function() {
  this.lastTriggered = new Date();
  this.calculateNextTrigger();
  return this;
};

// Index for finding due reminders
reminderSchema.index({ nextTrigger: 1, isActive: 1 });
reminderSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);