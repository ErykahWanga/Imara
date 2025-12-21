import React, { useState } from 'react';
import { Moon, Sun, Coffee, Heart } from 'lucide-react';
import { storage } from '../../utils/storage';

const DailyCheckIn = ({ onComplete }) => {
  const [sleep, setSleep] = useState('');
  const [food, setFood] = useState('');
  const [focus, setFocus] = useState('');
  const [mood, setMood] = useState('');

  const handleSubmit = () => {
    if (!sleep || !food || !focus || !mood) return;

    const today = new Date().toISOString().split('T')[0];
    const checkins = storage.get('imara_checkins') || {};
    const userEmail = storage.get('imara_current_user').email;
    
    if (!checkins[userEmail]) checkins[userEmail] = {};
    
    checkins[userEmail][today] = {
      sleep,
      food,
      focus,
      mood,
      timestamp: new Date().toISOString()
    };
    
    storage.set('imara_checkins', checkins);
    onComplete();
  };

  const OptionButton = ({ selected, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm transition-all ${
        selected
          ? 'bg-amber-100 text-amber-900 border-2 border-amber-300'
          : 'bg-stone-50 text-stone-600 border-2 border-transparent hover:border-stone-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-stone-800">How are things today?</h2>
        <p className="text-stone-500 text-sm">There is no right answer. Just what is true.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-stone-700">
            <Moon className="w-4 h-4" />
            <span>Sleep</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={sleep === 'poor'} onClick={() => setSleep('poor')}>Poor</OptionButton>
            <OptionButton selected={sleep === 'okay'} onClick={() => setSleep('okay')}>Okay</OptionButton>
            <OptionButton selected={sleep === 'good'} onClick={() => setSleep('good')}>Good</OptionButton>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-stone-700">
            <Coffee className="w-4 h-4" />
            <span>Food</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={food === 'skipped'} onClick={() => setFood('skipped')}>Skipped</OptionButton>
            <OptionButton selected={food === 'partial'} onClick={() => setFood('partial')}>Partial</OptionButton>
            <OptionButton selected={food === 'enough'} onClick={() => setFood('enough')}>Enough</OptionButton>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-stone-700">
            <Sun className="w-4 h-4" />
            <span>Focus</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={focus === 'low'} onClick={() => setFocus('low')}>Low</OptionButton>
            <OptionButton selected={focus === 'medium'} onClick={() => setFocus('medium')}>Medium</OptionButton>
            <OptionButton selected={focus === 'high'} onClick={() => setFocus('high')}>High</OptionButton>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-stone-700">
            <Heart className="w-4 h-4" />
            <span>Mood</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <OptionButton selected={mood === 'tired'} onClick={() => setMood('tired')}>Tired</OptionButton>
            <OptionButton selected={mood === 'neutral'} onClick={() => setMood('neutral')}>Neutral</OptionButton>
            <OptionButton selected={mood === 'calm'} onClick={() => setMood('calm')}>Calm</OptionButton>
            <OptionButton selected={mood === 'overwhelmed'} onClick={() => setMood('overwhelmed')}>Overwhelmed</OptionButton>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!sleep || !food || !focus || !mood}
        className="w-full bg-stone-800 text-white py-3 rounded-xl hover:bg-stone-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
      >
        That is all for today
      </button>
    </div>
  );
};

export default DailyCheckIn;