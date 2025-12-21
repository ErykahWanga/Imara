const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
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
    lastCheckIn: {
      type: Date,
      default: null
    }
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'warm', 'cool'],
      default: 'light'
    },
    accentColor: {
      type: String,
      enum: ['amber', 'blue', 'green', 'purple', 'pink', 'indigo'],
      default: 'amber'
    },
    notifications: {
      enabled: {
        type: Boolean,
        default: true
      },
      emailNotifications: {
        type: Boolean,
        default: false
      },
      pushNotifications: {
        type: Boolean,
        default: true
      }
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  stats: {
    totalCheckIns: {
      type: Number,
      default: 0
    },
    totalJournalEntries: {
      type: Number,
      default: 0
    },
    totalHabitsCompleted: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for achievements
userSchema.virtual('achievements', {
  ref: 'UserAchievement',
  localField: '_id',
  foreignField: 'user'
});

// Virtual for challenges
userSchema.virtual('challenges', {
  ref: 'UserChallenge',
  localField: '_id',
  foreignField: 'user'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak method
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (!this.streak.lastCheckIn) {
    this.streak.current = 1;
  } else {
    const lastCheckIn = new Date(this.streak.lastCheckIn);
    const diffDays = Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      this.streak.current += 1;
    } else if (diffDays > 1) {
      this.streak.current = 1;
    }
  }
  
  this.streak.lastCheckIn = now;
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  
  return this.streak.current;
};

// Update stats method
userSchema.methods.incrementStat = function(stat, amount = 1) {
  if (this.stats[stat] !== undefined) {
    this.stats[stat] += amount;
  }
};

module.exports = mongoose.model('User', userSchema);