const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add reminder title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  time: {
    type: String,
    required: [true, 'Please add reminder time'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time']
  },
  repeat: {
    type: String,
    required: true,
    enum: ['daily', 'weekdays', 'weekly', 'once', 'custom']
  },
  daysOfWeek: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  category: {
    type: String,
    enum: ['checkin', 'habit', 'meditation', 'exercise', 'water', 'custom'],
    default: 'custom'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastTriggered: {
    type: Date
  },
  nextTrigger: {
    type: Date
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reminder', reminderSchema);