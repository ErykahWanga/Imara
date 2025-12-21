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
    min: 0,
    max: 100,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  streak: {
    type: Number,
    default: 0
  },
  lastCheckIn: {
    type: Date
  },
  checkIns: [{
    date: Date,
    notes: String,
    completed: Boolean
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  sharedProgress: [{
    type: String,
    maxlength: [500, 'Progress update cannot exceed 500 characters']
  }]
}, {
  timestamps: true
});

// Ensure unique user-challenge combination
userChallengeSchema.index({ user: 1, challenge: 1 }, { unique: true });

// Index for user queries
userChallengeSchema.index({ user: 1, joinedAt: -1 });
userChallengeSchema.index({ user: 1, isCompleted: 1 });
userChallengeSchema.index({ user: 1, progress: -1 });

// Update progress method
userChallengeSchema.methods.updateProgress = function() {
  if (!this.checkIns || this.checkIns.length === 0) {
    this.progress = 0;
    return this.progress;
  }
  
  const completedCheckIns = this.checkIns.filter(checkIn => checkIn.completed).length;
  this.progress = Math.round((completedCheckIns / this.challenge.duration) * 100);
  
  if (this.progress >= 100) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  return this.progress;
};

// Add check-in method
userChallengeSchema.methods.addCheckIn = function(notes = '', completed = true) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if already checked in today
  const alreadyCheckedIn = this.checkIns.some(checkIn => {
    const checkInDate = new Date(checkIn.date);
    checkInDate.setHours(0, 0, 0, 0);
    return checkInDate.getTime() === today.getTime();
  });
  
  if (!alreadyCheckedIn) {
    this.checkIns.push({
      date: today,
      notes,
      completed
    });
    
    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (this.lastCheckIn) {
      const lastCheckInDate = new Date(this.lastCheckIn);
      lastCheckInDate.setHours(0, 0, 0, 0);
      
      if (lastCheckInDate.getTime() === yesterday.getTime()) {
        this.streak += 1;
      } else if (lastCheckInDate.getTime() !== today.getTime()) {
        this.streak = 1;
      }
    } else {
      this.streak = 1;
    }
    
    this.lastCheckIn = today;
    this.updateProgress();
  }
  
  return this;
};

module.exports = mongoose.model('UserChallenge', userChallengeSchema);