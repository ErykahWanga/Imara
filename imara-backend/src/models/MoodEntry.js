const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true,
    default: Date.now
  },
  mood: {
    type: String,
    required: true,
    enum: ['tired', 'neutral', 'calm', 'overwhelmed', 'happy', 'energetic', 'sad', 'anxious', 'peaceful', 'excited', 'frustrated', 'hopeful']
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  triggers: [{
    type: String,
    maxlength: [100, 'Trigger cannot exceed 100 characters']
  }],
  activities: [{
    type: String,
    maxlength: [100, 'Activity cannot exceed 100 characters']
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'stormy']
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night']
  },
  tags: [{
    type: String,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }]
}, {
  timestamps: true
});

// Ensure one mood entry per user per day (if timeOfDay is not specified)
moodEntrySchema.index({ user: 1, date: 1, timeOfDay: 1 }, { unique: true, partialFilterExpression: { timeOfDay: { $exists: true } } });

// Index for analytics
moodEntrySchema.index({ user: 1, mood: 1, date: -1 });
moodEntrySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);