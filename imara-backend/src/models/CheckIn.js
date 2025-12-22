const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  sleep: {
    type: String,
    required: true,
    enum: ['poor', 'okay', 'good']
  },
  food: {
    type: String,
    required: true,
    enum: ['skipped', 'partial', 'enough']
  },
  focus: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  mood: {
    type: String,
    required: true,
    enum: ['tired', 'neutral', 'calm', 'overwhelmed', 'happy', 'energetic']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure one check-in per user per day
checkInSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('CheckIn', checkInSchema);