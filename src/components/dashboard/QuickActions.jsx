import React from 'react';
import { Sparkles } from 'lucide-react';

const QuickActions = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-2xl">
        <p className="text-stone-700">
          You have checked in today. That is enough for now.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('feed')}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <p className="font-medium">Inspiration Feed</p>
              <p className="text-sm opacity-90">Daily motivation & stories</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('paths')}
          className="bg-stone-800 text-white p-4 rounded-2xl hover:bg-stone-700 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded-lg"></div>
            <div>
              <p className="font-medium">Guided Paths</p>
              <p className="text-sm opacity-90">Step-by-step support</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('community')}
          className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-sm">👥</span>
            </div>
            <div>
              <p className="font-medium">Community</p>
              <p className="text-sm opacity-90">Anonymous support</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="bg-purple-600 text-white p-4 rounded-2xl hover:bg-purple-700 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
            <div>
              <p className="font-medium">My Profile</p>
              <p className="text-sm opacity-90">Progress & goals</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;