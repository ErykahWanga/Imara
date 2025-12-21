import React from 'react';
import { 
  Sparkles, 
  Users, 
  Target, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Wind,
  Heart,
  Home
} from 'lucide-react';

const QuickActions = ({ onNavigate }) => {
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
      id: 'profile',
      title: 'My Profile',
      description: 'Progress & personal stats',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'from-pink-600 to-pink-700'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-light text-stone-800">Welcome back</h2>
            <p className="text-sm text-stone-600 mt-1">
              What would support you today? Choose what feels right.
            </p>
          </div>
        </div>
      </div>

      {/* Daily Check-in Status */}
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
                className={`bg-gradient-to-r ${feature.color} text-white p-4 rounded-2xl hover:shadow-md transition-all duration-200 text-left group hover:scale-[1.02] hover:${feature.hoverColor}`}
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

      {/* Quick Tips */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
        <h4 className="text-sm font-medium text-stone-700 mb-3">Quick Tips</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-amber-600 text-xs mt-0.5">•</span>
            <p className="text-sm text-stone-600">Start with just 5 minutes on any feature</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 text-xs mt-0.5">•</span>
            <p className="text-sm text-stone-600">Check your mood calendar weekly for patterns</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 text-xs mt-0.5">•</span>
            <p className="text-sm text-stone-600">Use breathing exercises when feeling overwhelmed</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 text-xs mt-0.5">•</span>
            <p className="text-sm text-stone-600">Share small wins in the community - they inspire others</p>
          </div>
        </div>
      </div>

      {/* Weekly Focus */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-blue-800">This Week's Focus</h4>
            <p className="text-xs text-blue-600 mt-1">Consistency over intensity</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-600">Progress</p>
            <p className="text-lg font-medium text-blue-800">3/7 days</p>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={day} className="flex-1 text-center">
              <div className={`text-xs ${index < 3 ? 'text-blue-600 font-medium' : 'text-blue-400'}`}>
                {day}
              </div>
              <div className={`h-1 rounded-full mt-1 ${index < 3 ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;