const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    required: true,
    default: '🏆'
  },
  points: {
    type: Number,
    required: true,
    min: [1, 'Points must be at least 1'],
    default: 10
  },
  category: {
    type: String,
    required: true,
    enum: ['consistency', 'growth', 'community', 'awareness', 'mastery', 'special']
  },
  color: {
    type: String,
    default: '#F59E0B'
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: ['checkin_streak', 'total_checkins', 'journal_entries', 'habit_streak', 'community_posts', 'path_completions', 'custom']
    },
    value: {
      type: Number,
      required: true,
      min: [1, 'Criteria value must be at least 1']
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Predefined achievements
achievementSchema.statics.initializeAchievements = async function() {
  const achievements = [
    {
      title: 'Getting Started',
      description: 'Complete your first daily check-in',
      icon: '🎯',
      points: 10,
      category: 'consistency',
      criteria: { type: 'total_checkins', value: 1 }
    },
    {
      title: 'Three Day Streak',
      description: 'Check in for 3 consecutive days',
      icon: '⚡',
      points: 25,
      category: 'consistency',
      criteria: { type: 'checkin_streak', value: 3 }
    },
    {
      title: 'Weekly Warrior',
      description: 'Check in for 7 consecutive days',
      icon: '📅',
      points: 50,
      category: 'consistency',
      criteria: { type: 'checkin_streak', value: 7 }
    },
    {
      title: 'Pathfinder',
      description: 'Complete your first guided path',
      icon: '🚀',
      points: 30,
      category: 'growth',
      criteria: { type: 'path_completions', value: 1 }
    },
    {
      title: 'Storyteller',
      description: 'Share your first journey post',
      icon: '💖',
      points: 15,
      category: 'community',
      criteria: { type: 'community_posts', value: 1 }
    },
    {
      title: 'Helping Hand',
      description: 'Reply to 5 community posts',
      icon: '🤝',
      points: 40,
      category: 'community',
      criteria: { type: 'community_posts', value: 5 }
    },
    {
      title: 'Habit Master',
      description: 'Maintain a 7-day habit streak',
      icon: '⭐',
      points: 35,
      category: 'mastery',
      criteria: { type: 'habit_streak', value: 7 }
    },
    {
      title: 'Self-Aware',
      description: 'Track your mood for 14 days',
      icon: '🎭',
      points: 45,
      category: 'awareness',
      criteria: { type: 'checkin_streak', value: 14 }
    },
    {
      title: 'Reflective Soul',
      description: 'Write 10 journal entries',
      icon: '📝',
      points: 30,
      category: 'awareness',
      criteria: { type: 'journal_entries', value: 10 }
    }
  ];

  for (const achievement of achievements) {
    const exists = await this.findOne({ title: achievement.title });
    if (!exists) {
      await this.create(achievement);
    }
  }
};

module.exports = mongoose.model('Achievement', achievementSchema);