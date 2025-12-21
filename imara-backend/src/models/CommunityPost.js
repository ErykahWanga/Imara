const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    minlength: [1, 'Post content cannot be empty'],
    maxlength: [2000, 'Post content cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['journey', 'question', 'achievement', 'support', 'discussion', 'resource'],
    default: 'journey'
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  anonymousName: {
    type: String,
    default: function() {
      const adjectives = ['Calm', 'Quiet', 'Gentle', 'Steady', 'Brave', 'Kind', 'Wise', 'Patient'];
      const nouns = ['Oak', 'River', 'Mountain', 'Star', 'Cloud', 'Stone', 'Wind', 'Light'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      return `${adj} ${noun}`;
    }
  },
  tags: [{
    type: String,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  category: {
    type: String,
    enum: ['mental-health', 'self-care', 'habits', 'growth', 'challenges', 'celebrations', 'general'],
    default: 'general'
  },
  mood: {
    type: String,
    enum: ['tired', 'neutral', 'calm', 'overwhelmed', 'happy', 'energetic', 'sad', 'anxious', 'peaceful']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  replyCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  attachments: [{
    type: String,
    match: [/^https?:\/\/.+/, 'Attachment must be a valid URL']
  }],
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  visibility: {
    type: String,
    enum: ['public', 'community', 'followers'],
    default: 'community'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for replies
communityPostSchema.virtual('replies', {
  ref: 'PostReply',
  localField: '_id',
  foreignField: 'post',
  options: { sort: { createdAt: 1 } }
});

// Update like count before save
communityPostSchema.pre('save', function(next) {
  this.likeCount = this.likes.length;
  next();
});

// Indexes
communityPostSchema.index({ user: 1, createdAt: -1 });
communityPostSchema.index({ type: 1, createdAt: -1 });
communityPostSchema.index({ category: 1, createdAt: -1 });
communityPostSchema.index({ isFeatured: 1, createdAt: -1 });
communityPostSchema.index({ likeCount: -1, createdAt: -1 });
communityPostSchema.index({ tags: 1, createdAt: -1 });

// Full-text search index
communityPostSchema.index({ content: 'text', tags: 'text' });

module.exports = mongoose.model('CommunityPost', communityPostSchema);