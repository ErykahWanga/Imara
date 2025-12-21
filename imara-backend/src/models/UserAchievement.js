const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  shared: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Ensure unique user-achievement combination
userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

// Index for user queries
userAchievementSchema.index({ user: 1, earnedAt: -1 });
userAchievementSchema.index({ user: 1, isCompleted: 1 });

module.exports = mongoose.model('UserAchievement', userAchievementSchema);