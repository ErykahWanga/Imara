const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add post content'],
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['journey', 'question', 'support', 'celebration', 'tip']
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  anonymousName: {
    type: String,
    maxlength: [50, 'Anonymous name cannot be more than 50 characters']
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Reply cannot be more than 1000 characters']
    },
    isAnonymous: {
      type: Boolean,
      default: true
    },
    anonymousName: {
      type: String,
      maxlength: [50, 'Anonymous name cannot be more than 50 characters']
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  reportCount: {
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

// Index for sorting and filtering
communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ type: 1 });
communityPostSchema.index({ isHidden: 1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);