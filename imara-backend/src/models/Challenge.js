const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add challenge title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add challenge description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  icon: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: [true, 'Please add challenge duration'],
    min: 1
  },
  points: {
    type: Number,
    required: [true, 'Please add challenge points'],
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['wellness', 'mindfulness', 'fitness', 'community', 'creativity', 'learning']
  },
  color: {
    type: String,
    required: true
  },
  textColor: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  requirements: [{
    type: {
      type: String,
      enum: ['checkin', 'habit', 'journal', 'community', 'custom']
    },
    target: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  participantCount: {
    type: Number,
    default: 0
  },
  completionCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);