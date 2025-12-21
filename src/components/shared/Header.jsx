import React from 'react';
import { Home, Users, User, Sparkles } from 'lucide-react';
import Logo from './Logo';

const Header = ({ user, currentView, onNavigate, onLogout }) => {
  return (
    <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
          >
            <Logo size="sm" showText={true} />
            <p className="text-xs text-stone-500 hidden sm:block">Hello, {user.name}</p>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'home' ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:text-stone-600'
              }`}
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('feed')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'feed' ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:text-stone-600'
              }`}
              title="Inspiration Feed"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'community' ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:text-stone-600'
              }`}
              title="Community"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'profile' ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:text-stone-600'
              }`}
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="ml-2 text-sm text-stone-500 hover:text-stone-700 transition-colors px-3 py-1.5"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;