import React from 'react';
import { 
  Bell, 
  Palette, 
  Trophy, 
  Heart, 
  Target,
  Home, 
  Users, 
  User, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Wind 
  
} from 'lucide-react';
import Logo from './Logo';

const Header = ({ user, currentView, onNavigate, onLogout }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'feed', icon: Sparkles, label: 'Feed' },
    { id: 'reminders', icon: Bell, label: 'Reminders' },
    { id: 'selfcare', icon: Heart, label: 'Self-Care' },
    { id: 'habits', icon: TrendingUp, label: 'Habits' },
    { id: 'mood', icon: Calendar, label: 'Mood' },
    { id: 'journal', icon: BookOpen, label: 'Journal' },
    { id: 'wellness', icon: Wind, label: 'Breathing' },
    { id: 'challenges', icon: Target, label: 'Challenges' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'achievements', icon: Trophy, label: 'Achievements' },
    { id: 'theme', icon: Palette, label: 'Theme' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
          >
            <Logo size="sm" showText={true} />
            <p className="text-xs text-stone-500 hidden sm:block">Hello, {user.name}</p>
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`p-2 rounded-lg transition-colors relative ${
                    currentView === item.id 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                  {currentView === item.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
            
            {/* Logout */}
            <div className="ml-2 pl-2 border-l border-stone-200">
              <button
                onClick={onLogout}
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors px-3 py-1.5"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;