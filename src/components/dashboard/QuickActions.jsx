import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  Target, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Wind,
  Heart,
  Home,
  Bell,
  Palette,
  Trophy
} from 'lucide-react';
import { checkInAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const QuickActions = ({ onNavigate }) => {
  const { user } = useAuth();
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTodayStatus();
  }, []);

  const checkTodayStatus = async () => {
    try {
      const response = await checkInAPI.getToday();
      setHasCheckedInToday(response.hasCheckedInToday);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: 'feed',
      title: 'Inspiration Feed',
      description: 'Daily motivation & community wisdom',
      icon: Sparkles,
      color: 'from-amber-500 to-amber-600',
      hoverColor: 'from-amber-600 to-amber-700'
    },
    {
      id: 'paths',
      title: 'Guided Paths',
      description: 'Step-by-step support for challenges',
      icon: Target,
      color: 'from-stone-800 to-stone-900',
      hoverColor: 'from-stone-900 to-stone-950'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Anonymous support & sharing',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 'mood',
      title: 'Mood Tracker',
      description: 'Track & visualize your emotions',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    },
    {
      id: 'journal',
      title: 'Daily Journal',
      description: 'Reflect & process your day',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      id: 'habits',
      title: 'Habit Tracker',
      description: 'Build consistent routines',
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'from-indigo-600 to-indigo-700'
    },
    {
      id: 'wellness',
      title: 'Breathing Exercise',
      description: 'Calm your mind in minutes',
      icon: Wind,
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'from-cyan-600 to-cyan-700'
    },
    {
      id: 'reminders',
      title: 'Reminders',
      description: 'Gentle notifications for self-care',
      icon: Bell,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700'
    },
    {
      id: 'selfcare',
      title: 'Self-Care Planner',
      description: 'Schedule your wellness activities',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'from-pink-600 to-pink-700'
    },
    {
      id: 'challenges',
      title: 'Challenges',
      description: 'Community goals & accountability',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'Earn badges & track progress',
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    },
    {
      id: 'theme',
      title: 'Theme',
      description: 'Customize appearance',
      icon: Palette,
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'from-gray-600 to-gray-700'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-light text-stone-800">Welcome back, {user.name}</h2>
            <p className="text-sm text-stone-600 mt-1">
              What would support you today? Choose what feels right.
            </p>
          </div>
        </div>
      </div>
      
      {/* Daily Check-in Status */}
      {!hasCheckedInToday ? (
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 text-sm">!</span>
            </div>
            <div>
              <p className="text-stone-700 font-medium">Daily check-in pending</p>
              <p className="text-sm text-stone-600 mt-1">
                Take a moment to check in with yourself today.
              </p>
              <button
                onClick={() => onNavigate('checkin')}
                className="mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                Check In Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <div>
              <p className="text-stone-700 font-medium">Daily check-in completed</p>
              <p className="text-sm text-stone-600 mt-1">
                You've taken care of today's basics. That's enough for now.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div>
        <h3 className="text-lg font-light text-stone-800 mb-4">Explore Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => onNavigate(feature.id)}
                className={`bg-gradient-to-r ${feature.color} text-white p-4 rounded-2xl hover:shadow-md transition-all duration-200 text-left group hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{feature.title}</p>
                    <p className="text-xs opacity-90 mt-0.5">{feature.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Stats */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
        <h4 className="text-sm font-medium text-stone-700 mb-3">Your Progress</h4>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-amber-700">{user.streak?.current || 0}</div>
            <div className="text-xs text-stone-500">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-700">{user.stats?.totalCheckIns || 0}</div>
            <div className="text-xs text-stone-500">Check-ins</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-700">{user.stats?.totalJournalEntries || 0}</div>
            <div className="text-xs text-stone-500">Journal Entries</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-700">{user.stats?.totalHabitsCompleted || 0}</div>
            <div className="text-xs text-stone-500">Habits</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;