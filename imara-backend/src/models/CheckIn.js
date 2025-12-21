const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
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
  sleep: {
    type: String,
    enum: ['poor', 'okay', 'good'],
    required: true
  },
  food: {
    type: String,
    enum: ['skipped', 'partial', 'enough'],
    required: true
  },
  focus: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  mood: {
    type: String,
    enum: ['tired', 'neutral', 'calm', 'overwhelmed', 'happy', 'energetic'],
    required: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'windy']
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  gratitude: [{
    type: String,
    maxlength: [100, 'Gratitude item cannot exceed 100 characters']
  }]
}, {
  timestamps: true
});

// Ensure one check-in per user per day
checkInSchema.index({ user: 1, date: 1 }, { unique: true });

// Virtual for formatted date
checkInSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

module.exports = mongoose.model('CheckIn', checkInSchema);