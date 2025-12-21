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
    enum: ['light', 'dark', 'warm', 'cool'],
    default: 'light'
  },
  accentColor: {
    type: String,
    enum: ['amber', 'blue', 'green', 'purple', 'pink', 'indigo'],
    default: 'amber'
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  reducedMotion: {
    type: Boolean,
    default: false
  },
  highContrast: {
    type: Boolean,
    default: false
  },
  customColors: {
    primary: {
      type: String,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color']
    },
    secondary: {
      type: String,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Secondary color must be a valid hex color']
    },
    background: {
      type: String,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Background color must be a valid hex color']
    },
    text: {
      type: String,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Text color must be a valid hex color']
    }
  },
  layout: {
    type: String,
    enum: ['compact', 'comfortable', 'spacious'],
    default: 'comfortable'
  },
  roundedCorners: {
    type: String,
    enum: ['none', 'small', 'medium', 'large'],
    default: 'medium'
  },
  shadowIntensity: {
    type: String,
    enum: ['none', 'subtle', 'medium', 'pronounced'],
    default: 'medium'
  },
  animations: {
    enabled: {
      type: Boolean,
      default: true
    },
    speed: {
      type: String,
      enum: ['slow', 'normal', 'fast'],
      default: 'normal'
    }
  }
}, {
  timestamps: true
});

// Create default theme for user
userThemeSchema.statics.createDefault = function(userId) {
  return this.create({
    user: userId,
    theme: 'light',
    accentColor: 'amber',
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
    layout: 'comfortable',
    roundedCorners: 'medium',
    shadowIntensity: 'medium',
    animations: {
      enabled: true,
      speed: 'normal'
    }
  });
};

module.exports = mongoose.model('UserTheme', userThemeSchema);