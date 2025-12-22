const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Achievement = require('../models/Achievement');
const Challenge = require('../models/Challenge');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAchievements = async () => {
  try {
    // Clear existing achievements
    await Achievement.deleteMany();

    const achievements = [
      {
        id: 'first_checkin',
        title: 'Getting Started',
        description: 'Complete your first daily check-in',
        icon: 'Target',
        points: 10,
        category: 'consistency',
        color: 'bg-blue-100',
        textColor: 'text-blue-700',
        difficulty: 'easy'
      },
      {
        id: 'streak_3',
        title: 'Three Day Streak',
        description: 'Check in for 3 consecutive days',
        icon: 'Zap',
        points: 25,
        category: 'consistency',
        color: 'bg-green-100',
        textColor: 'text-green-700',
        difficulty: 'easy'
      },
      {
        id: 'streak_7',
        title: 'Weekly Warrior',
        description: 'Check in for 7 consecutive days',
        icon: 'Calendar',
        points: 50,
        category: 'consistency',
        color: 'bg-purple-100',
        textColor: 'text-purple-700',
        difficulty: 'medium'
      },
      {
        id: 'streak_30',
        title: 'Monthly Champion',
        description: 'Check in for 30 consecutive days',
        icon: 'Trophy',
        points: 200,
        category: 'consistency',
        color: 'bg-amber-100',
        textColor: 'text-amber-700',
        difficulty: 'hard'
      },
      {
        id: 'first_journal',
        title: 'Storyteller',
        description: 'Write your first journal entry',
        icon: 'BookOpen',
        points: 15,
        category: 'awareness',
        color: 'bg-pink-100',
        textColor: 'text-pink-700',
        difficulty: 'easy'
      },
      {
        id: 'journal_10',
        title: 'Reflective Soul',
        description: 'Write 10 journal entries',
        icon: 'Award',
        points: 30,
        category: 'awareness',
        color: 'bg-cyan-100',
        textColor: 'text-cyan-700',
        difficulty: 'easy'
      },
      {
        id: 'journal_100',
        title: 'Wisdom Keeper',
        description: 'Write 100 journal entries',
        icon: 'Star',
        points: 150,
        category: 'awareness',
        color: 'bg-indigo-100',
        textColor: 'text-indigo-700',
        difficulty: 'hard'
      },
      {
        id: 'first_habit',
        title: 'Habit Builder',
        description: 'Create your first habit',
        icon: 'TrendingUp',
        points: 20,
        category: 'growth',
        color: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        difficulty: 'easy'
      },
      {
        id: 'habit_streak_7',
        title: 'Consistency Master',
        description: 'Maintain a 7-day habit streak',
        icon: 'CheckCircle',
        points: 35,
        category: 'growth',
        color: 'bg-lime-100',
        textColor: 'text-lime-700',
        difficulty: 'medium'
      },
      {
        id: 'habit_streak_30',
        title: 'Habit Legend',
        description: 'Maintain a 30-day habit streak',
        icon: 'Award',
        points: 100,
        category: 'growth',
        color: 'bg-teal-100',
        textColor: 'text-teal-700',
        difficulty: 'hard'
      },
      {
        id: 'first_community_post',
        title: 'Community Voice',
        description: 'Share your first community post',
        icon: 'Users',
        points: 25,
        category: 'community',
        color: 'bg-rose-100',
        textColor: 'text-rose-700',
        difficulty: 'easy'
      },
      {
        id: 'community_helper',
        title: 'Supportive Friend',
        description: 'Reply to 10 community posts',
        icon: 'Heart',
        points: 40,
        category: 'community',
        color: 'bg-fuchsia-100',
        textColor: 'text-fuchsia-700',
        difficulty: 'medium'
      },
      {
        id: 'challenge_winner',
        title: 'Challenge Champion',
        description: 'Complete your first community challenge',
        icon: 'Trophy',
        points: 75,
        category: 'community',
        color: 'bg-violet-100',
        textColor: 'text-violet-700',
        difficulty: 'medium'
      },
      {
        id: 'self_care_planner',
        title: 'Self-Care Advocate',
        description: 'Complete 10 self-care activities',
        icon: 'Heart',
        points: 45,
        category: 'wellness',
        color: 'bg-sky-100',
        textColor: 'text-sky-700',
        difficulty: 'medium'
      },
      {
        id: 'mood_tracker',
        title: 'Emotion Explorer',
        description: 'Track your mood for 30 days',
        icon: 'Smile',
        points: 60,
        category: 'awareness',
        color: 'bg-orange-100',
        textColor: 'text-orange-700',
        difficulty: 'medium'
      },
      {
        id: 'breathing_master',
        title: 'Breathing Expert',
        description: 'Complete 50 breathing exercises',
        icon: 'Wind',
        points: 80,
        category: 'wellness',
        color: 'bg-cyan-100',
        textColor: 'text-cyan-700',
        difficulty: 'hard'
      },
      {
        id: 'reminder_pro',
        title: 'Consistency Keeper',
        description: 'Set up 5 active reminders',
        icon: 'Bell',
        points: 30,
        category: 'growth',
        color: 'bg-amber-100',
        textColor: 'text-amber-700',
        difficulty: 'easy'
      },
      {
        id: 'year_warrior',
        title: 'Annual Warrior',
        description: 'Use IMARA for 365 consecutive days',
        icon: 'Crown',
        points: 500,
        category: 'consistency',
        color: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        difficulty: 'legendary'
      }
    ];

    await Achievement.insertMany(achievements);
    console.log('✅ Achievements seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
  }
};

const seedChallenges = async () => {
  try {
    // Clear existing challenges
    await Challenge.deleteMany();

    const challenges = [
      {
        title: '7-Day Hydration Challenge',
        description: 'Drink 8 glasses of water daily for a week',
        icon: 'TrendingUp',
        duration: 7,
        points: 50,
        category: 'wellness',
        color: 'bg-blue-100',
        textColor: 'text-blue-700',
        difficulty: 'easy',
        requirements: [
          {
            type: 'custom',
            target: 8,
            description: 'Drink 8 glasses of water daily'
          }
        ]
      },
      {
        title: 'Gratitude Week',
        description: 'Share one thing you\'re grateful for each day',
        icon: 'Heart',
        duration: 7,
        points: 40,
        category: 'mindfulness',
        color: 'bg-green-100',
        textColor: 'text-green-700',
        difficulty: 'easy',
        requirements: [
          {
            type: 'journal',
            target: 7,
            description: 'Write 7 gratitude journal entries'
          }
        ]
      },
      {
        title: 'Daily Movement',
        description: '10 minutes of movement every day for 14 days',
        icon: 'Zap',
        duration: 14,
        points: 75,
        category: 'fitness',
        color: 'bg-red-100',
        textColor: 'text-red-700',
        difficulty: 'medium',
        requirements: [
          {
            type: 'habit',
            target: 14,
            description: 'Complete movement for 14 days'
          }
        ]
      },
      {
        title: 'Digital Detox Weekend',
        description: 'Reduce screen time for 48 hours',
        icon: 'Calendar',
        duration: 2,
        points: 35,
        category: 'mindfulness',
        color: 'bg-purple-100',
        textColor: 'text-purple-700',
        difficulty: 'medium',
        requirements: [
          {
            type: 'custom',
            target: 1,
            description: 'Complete digital detox weekend'
          }
        ]
      },
      {
        title: 'Acts of Kindness',
        description: 'Perform one act of kindness daily',
        icon: 'Heart',
        duration: 7,
        points: 45,
        category: 'community',
        color: 'bg-pink-100',
        textColor: 'text-pink-700',
        difficulty: 'easy',
        requirements: [
          {
            type: 'community',
            target: 7,
            description: 'Share 7 acts of kindness'
          }
        ]
      },
      {
        title: 'Sleep Hygiene Challenge',
        description: 'Consistent bedtime for 21 days',
        icon: 'Award',
        duration: 21,
        points: 100,
        category: 'wellness',
        color: 'bg-indigo-100',
        textColor: 'text-indigo-700',
        difficulty: 'hard',
        requirements: [
          {
            type: 'checkin',
            target: 21,
            description: 'Check in with good sleep for 21 days'
          }
        ]
      },
      {
        title: 'Morning Mindfulness',
        description: '5 minutes of meditation every morning for 30 days',
        icon: 'Wind',
        duration: 30,
        points: 120,
        category: 'mindfulness',
        color: 'bg-cyan-100',
        textColor: 'text-cyan-700',
        difficulty: 'hard',
        requirements: [
          {
            type: 'custom',
            target: 30,
            description: 'Complete 30 morning meditation sessions'
          }
        ]
      }
    ];

    await Challenge.insertMany(challenges);
    console.log('✅ Challenges seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
  }
};

// Run seed functions
const seedData = async () => {
  console.log('🌱 Starting database seeding...');
  
  await seedAchievements();
  await seedChallenges();
  
  console.log('✅ Database seeding completed');
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Run the seeder
seedData();