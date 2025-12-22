const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dailyProgress: [{
    date: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure unique user-challenge combination
userChallengeSchema.index({ user: 1, challenge: 1 }, { unique: true });

module.exports = mongoose.model('UserChallenge', userChallengeSchema);