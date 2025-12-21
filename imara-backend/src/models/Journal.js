const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
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
  prompt: {
    type: String,
    maxlength: [200, 'Prompt cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Journal content is required'],
    minlength: [1, 'Journal content cannot be empty'],
    maxlength: [5000, 'Journal content cannot exceed 5000 characters']
  },
  mood: {
    type: String,
    enum: ['tired', 'neutral', 'calm', 'overwhelmed', 'happy', 'energetic', 'sad', 'anxious', 'peaceful']
  },
  tags: [{
    type: String,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  wordCount: {
    type: Number,
    default: 0
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1
  },
  highlights: [{
    type: String,
    maxlength: [200, 'Highlight cannot exceed 200 characters']
  }]
}, {
  timestamps: true
});

// Calculate word count before saving
journalSchema.pre('save', function(next) {
  this.wordCount = this.content.trim().split(/\s+/).length;
  next();
});

// Index for user and date queries
journalSchema.index({ user: 1, date: -1 });
journalSchema.index({ user: 1, mood: 1 });

module.exports = mongoose.model('Journal', journalSchema);