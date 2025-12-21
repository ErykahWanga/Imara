import React, { useState, useEffect } from 'react';
import { CheckCircle, Plus, TrendingUp, Target, X } from 'lucide-react';
import { storage } from '../../utils/storage';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const defaultHabits = [
    { id: 'habit_1', name: 'Drink water', emoji: '💧', streak: 0 },
    { id: 'habit_2', name: 'Morning stretch', emoji: '🧘', streak: 0 },
    { id: 'habit_3', name: '5-min walk', emoji: '🚶', streak: 0 },
    { id: 'habit_4', name: 'Evening reflection', emoji: '📝', streak: 0 }
  ];

  useEffect(() => {
    const user = storage.get('imara_current_user');
    const userHabits = storage.get('imara_habits') || {};
    
    if (!userHabits[user?.email]) {
      // Initialize with default habits
      userHabits[user.email] = defaultHabits;
      storage.set('imara_habits', userHabits);
    }
    
    setHabits(userHabits[user.email] || []);
  }, []);

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;

    const user = storage.get('imara_current_user');
    const userHabits = storage.get('imara_habits') || {};
    
    const habit = {
      id: 'habit_' + Date.now(),
      name: newHabit,
      emoji: '✨',
      streak: 0,
      createdAt: new Date().toISOString()
    };
    
    userHabits[user.email] = [habit, ...userHabits[user.email]];
    storage.set('imara_habits', userHabits);
    setHabits(userHabits[user.email]);
    setNewHabit('');
    setShowAddForm(false);
  };

  const handleToggleHabit = (habitId) => {
    const user = storage.get('imara_current_user');
    const userHabits = storage.get('imara_habits') || {};
    const today = new Date().toISOString().split('T')[0];
    
    const habitCompletions = storage.get('imara_habit_completions') || {};
    if (!habitCompletions[user.email]) habitCompletions[user.email] = {};
    if (!habitCompletions[user.email][habitId]) habitCompletions[user.email][habitId] = {};
    
    if (habitCompletions[user.email][habitId][today]) {
      delete habitCompletions[user.email][habitId][today];
    } else {
      habitCompletions[user.email][habitId][today] = true;
    }
    
    storage.set('imara_habit_completions', habitCompletions);
    
    // Update streak
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const streak = calculateStreak(habitId, habitCompletions[user.email][habitId]);
        return { ...habit, streak };
      }
      return habit;
    });
    
    userHabits[user.email] = updatedHabits;
    storage.set('imara_habits', userHabits);
    setHabits(updatedHabits);
  };

  const calculateStreak = (habitId, completions) => {
    if (!completions) return 0;
    
    const dates = Object.keys(completions).sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const handleRemoveHabit = (habitId) => {
    const user = storage.get('imara_current_user');
    const userHabits = storage.get('imara_habits') || {};
    
    userHabits[user.email] = userHabits[user.email].filter(h => h.id !== habitId);
    storage.set('imara_habits', userHabits);
    setHabits(userHabits[user.email]);
  };

  const isHabitCompletedToday = (habitId) => {
    const user = storage.get('imara_current_user');
    const today = new Date().toISOString().split('T')[0];
    const completions = storage.get('imara_habit_completions') || {};
    return completions[user?.email]?.[habitId]?.[today] || false;
  };

  const getCompletionRate = () => {
    if (habits.length === 0) return 0;
    const completedToday = habits.filter(h => isHabitCompletedToday(h.id)).length;
    return Math.round((completedToday / habits.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-600" />
          Daily Habits
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-600">
            {getCompletionRate()}% today
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 text-amber-600 hover:text-amber-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <div className="bg-stone-50 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-stone-700">Add New Habit</p>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="e.g., Read for 10 minutes"
            className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300"
            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <button
            onClick={handleAddHabit}
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Add Habit
          </button>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No habits yet. Add your first habit!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const completed = isHabitCompletedToday(habit.id);
            
            return (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-stone-100 hover:border-amber-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                      completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {completed && <CheckCircle className="w-5 h-5 text-white" />}
                  </button>
                  <div>
                    <p className="text-stone-800">{habit.emoji} {habit.name}</p>
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-amber-600" />
                        <span className="text-xs text-amber-700">{habit.streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveHabit(habit.id)}
                  className="p-1 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Weekly Overview */}
      <div className="bg-stone-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-stone-700 mb-3">This Week</h4>
        <div className="grid grid-cols-7 gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-stone-500 mb-1">{day}</div>
              <div className="w-6 h-6 mx-auto bg-stone-200 rounded-full flex items-center justify-center">
                <span className="text-xs text-stone-700">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-stone-500 space-y-1">
        <p>💡 Start with 1-2 small habits</p>
        <p>💡 Focus on consistency, not perfection</p>
        <p>💡 Celebrate every day you complete a habit</p>
      </div>
    </div>
  );
};

export default HabitTracker;