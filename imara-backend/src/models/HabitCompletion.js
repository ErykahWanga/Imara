const mongoose = require('mongoose');

const habitCompletionSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  duration: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Ensure one completion per habit per day
habitCompletionSchema.index({ habit: 1, date: 1 }, { unique: true });

// Index for user queries
habitCompletionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('HabitCompletion', habitCompletionSchema);