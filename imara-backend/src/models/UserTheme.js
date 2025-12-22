const mongoose = require('mongoose');

const userThemeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    required: true,
    enum: ['light', 'dark', 'warm', 'cool'],
    default: 'light'
  },
  accentColor: {
    type: String,
    required: true,
    enum: ['amber', 'blue', 'green', 'purple', 'pink', 'indigo'],
    default: 'amber'
  },
  customColors: {
    primary: String,
    secondary: String,
    background: String,
    text: String
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  animations: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserTheme', userThemeSchema)