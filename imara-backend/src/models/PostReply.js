const mongoose = require('mongoose');

const postReplySchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Reply content is required'],
    minlength: [1, 'Reply content cannot be empty'],
    maxlength: [1000, 'Reply content cannot exceed 1000 characters']
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  anonymousName: {
    type: String,
    default: function() {
      const adjectives = ['Supportive', 'Understanding', 'Caring', 'Empathetic', 'Wise', 'Kind'];
      const nouns = ['Friend', 'Listener', 'Helper', 'Guide', 'Companion'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      return `${adj} ${noun}`;
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  isHelpful: {
    type: Boolean,
    default: false
  },
  reported: {
    type: Boolean,
    default: false
  },
  parentReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostReply',
    default: null
  },
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Update like count before save
postReplySchema.pre('save', function(next) {
  this.likeCount = this.likes.length;
  next();
});

// Update parent post's reply count
postReplySchema.pre('save', async function(next) {
  if (this.isNew) {
    const Post = mongoose.model('CommunityPost');
    await Post.findByIdAndUpdate(this.post, { $inc: { replyCount: 1 } });
  }
  next();
});

// Clean up on delete
postReplySchema.pre('remove', async function(next) {
  const Post = mongoose.model('CommunityPost');
  await Post.findByIdAndUpdate(this.post, { $inc: { replyCount: -1 } });
  next();
});

// Indexes
postReplySchema.index({ post: 1, createdAt: 1 });
postReplySchema.index({ user: 1, createdAt: -1 });
postReplySchema.index({ parentReply: 1 });
postReplySchema.index({ isHelpful: 1 });

module.exports = mongoose.model('PostReply', postReplySchema);