const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Challenge description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['wellness', 'mindfulness', 'fitness', 'community', 'learning', 'productivity']
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration must be at least 1 day'],
    default: 7
  },
  points: {
    type: Number,
    required: true,
    min: [1, 'Points must be at least 1'],
    default: 50
  },
  icon: {
    type: String,
    default: '🎯'
  },
  color: {
    type: String,
    default: '#F59E0B'
  },
  requirements: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.every(item => item.length <= 200);
      },
      message: 'Requirements cannot exceed 200 characters each'
    }
  },
  rules: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.every(item => item.length <= 200);
      },
      message: 'Rules cannot exceed 200 characters each'
    }
  },
  participantCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  maxParticipants: {
    type: Number,
    default: null
  },
  tags: [{
    type: String,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }]
}, {
  timestamps: true
});

// Predefined challenges
challengeSchema.statics.initializeChallenges = async function() {
  const challenges = [
    {
      title: '7-Day Hydration Challenge',
      description: 'Drink 8 glasses of water daily for a week',
      category: 'wellness',
      duration: 7,
      points: 50,
      requirements: ['Drink at least 8 glasses of water daily', 'Track your water intake'],
      rules: ['No sugary drinks count toward goal', 'Carry a water bottle with you'],
      difficulty: 'easy'
    },
    {
      title: 'Gratitude Week',
      description: 'Share one thing you\'re grateful for each day',
      category: 'mindfulness',
      duration: 7,
      points: 40,
      requirements: ['Write down one thing you\'re grateful for daily', 'Share at least 3 entries with community'],
      rules: ['Be specific about what you\'re grateful for', 'Try to find new things each day'],
      difficulty: 'easy'
    },
    {
      title: 'Daily Movement',
      description: '10 minutes of movement every day for 14 days',
      category: 'fitness',
      duration: 14,
      points: 75,
      requirements: ['At least 10 minutes of movement daily', 'Track your activity'],
      rules: ['Any movement counts - walking, stretching, dancing', 'Consistency is key'],
      difficulty: 'medium'
    },
    {
      title: 'Digital Detox Weekend',
      description: 'Reduce screen time for 48 hours',
      category: 'mindfulness',
      duration: 2,
      points: 35,
      requirements: ['Limit non-essential screen time', 'Find alternative activities'],
      rules: ['Work/school screens are allowed', 'Be mindful of your screen usage'],
      difficulty: 'hard'
    }
  ];

  for (const challenge of challenges) {
    const exists = await this.findOne({ title: challenge.title });
    if (!exists) {
      await this.create(challenge);
    }
  }
};

module.exports = mongoose.model('Challenge', challengeSchema);