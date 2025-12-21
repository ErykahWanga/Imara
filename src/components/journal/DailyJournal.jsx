import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Save, Clock } from 'lucide-react';
import { storage } from '../../utils/storage';

const DailyJournal = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [todayEntry, setTodayEntry] = useState(null);
  const [showPrompts, setShowPrompts] = useState(true);

  const prompts = [
    "What's one small thing you're grateful for today?",
    "What challenged you today, and how did you handle it?",
    "What's something you learned about yourself today?",
    "How did you show yourself kindness today?",
    "What moment brought you peace today?",
    "What's a boundary you honored today?",
    "What's one step you took toward your goals today?",
    "How did you recharge your energy today?"
  ];

  useEffect(() => {
    const user = storage.get('imara_current_user');
    const journals = storage.get('imara_journals') || {};
    const today = new Date().toISOString().split('T')[0];
    setTodayEntry(journals[user?.email]?.[today]);
  }, []);

  const getRandomPrompt = () => {
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) return;

    const user = storage.get('imara_current_user');
    const today = new Date().toISOString().split('T')[0];
    
    const journals = storage.get('imara_journals') || {};
    if (!journals[user.email]) journals[user.email] = {};
    
    journals[user.email][today] = {
      content: journalEntry,
      timestamp: new Date().toISOString(),
      prompt: getRandomPrompt()
    };
    
    storage.set('imara_journals', journals);
    setTodayEntry(journals[user.email][today]);
    setJournalEntry('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Daily Reflection
        </h3>
        {todayEntry && (
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Saved {formatTime(todayEntry.timestamp)}
          </span>
        )}
      </div>

      {/* Today's Entry Preview */}
      {todayEntry && (
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 font-medium">Today's Reflection</p>
              <p className="text-xs text-green-700 mb-2">{todayEntry.prompt}</p>
              <p className="text-stone-700 text-sm leading-relaxed">{todayEntry.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* New Journal Entry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-600">Write today's reflection</p>
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="text-xs text-amber-600 hover:text-amber-700"
          >
            {showPrompts ? 'Hide prompts' : 'Show prompts'}
          </button>
        </div>

        {showPrompts && (
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-800 font-medium mb-1">Prompt Suggestion</p>
                <p className="text-sm text-amber-900">{getRandomPrompt()}</p>
              </div>
            </div>
          </div>
        )}

        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors min-h-40 resize-none"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500">
            {journalEntry.length} characters
          </span>
          <button
            onClick={handleSaveJournal}
            disabled={!journalEntry.trim()}
            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Reflection
          </button>
        </div>
      </div>

      {/* Journal Tips */}
      <div className="bg-stone-50 p-4 rounded-xl text-sm text-stone-600 space-y-2">
        <p className="font-medium text-stone-700">Journaling Tips:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Write freely without judgment</li>
          <li>Focus on feelings, not just events</li>
          <li>Keep it brief - 5 minutes is enough</li>
          <li>Be honest with yourself</li>
          <li>Celebrate small wins</li>
        </ul>
      </div>
    </div>
  );
};

export default DailyJournal;