const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add journal content'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  prompt: {
    type: String,
    maxlength: [500, 'Prompt cannot be more than 500 characters']
  },
  mood: {
    type: String,
    enum: ['tired', 'neutral', 'calm', 'overwhelmed', 'happy', 'energetic']
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  wordCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate word count before saving
journalSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
  }
  next();
});

module.exports = mongoose.model('Journal', journalSchema);