import React, { useState, useEffect } from 'react';
import { CheckCircle, Plus, TrendingUp, Target, X } from 'lucide-react';
import { storage } from '../../utils/storage';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultHabits = [
    { id: 'habit_1', name: 'Drink water', emoji: '💧', streak: 0 },
    { id: 'habit_2', name: 'Morning stretch', emoji: '🧘', streak: 0 },
    { id: 'habit_3', name: '5-min walk', emoji: '🚶', streak: 0 },
    { id: 'habit_4', name: 'Evening reflection', emoji: '📝', streak: 0 }
  ];

  useEffect(() => {
    try {
      const user = storage.get('imara_current_user');
      
      if (!user || !user.email) {
        console.log('No user found, showing empty state');
        setHabits([]);
        setLoading(false);
        return;
      }
      
      const userHabits = storage.get('imara_habits') || {};
      
      // Initialize user's habits if they don't exist
      if (!userHabits[user.email]) {
        userHabits[user.email] = defaultHabits;
        storage.set('imara_habits', userHabits);
      }
      
      // Ensure we have an array
      const userHabitsArray = Array.isArray(userHabits[user.email]) 
        ? userHabits[user.email] 
        : [];
      
      // Update streaks for each habit
      const habitCompletions = storage.get('imara_habit_completions') || {};
      const userCompletions = habitCompletions[user.email] || {};
      
      const habitsWithUpdatedStreaks = userHabitsArray.map(habit => {
        const streak = calculateStreak(habit.id, userCompletions[habit.id] || {});
        return { ...habit, streak };
      });
      
      setHabits(habitsWithUpdatedStreaks);
    } catch (error) {
      console.error('Error loading habits:', error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;

    try {
      const user = storage.get('imara_current_user');
      if (!user?.email) {
        console.error('Cannot add habit: No user found');
        return;
      }

      const userHabits = storage.get('imara_habits') || {};
      const existingHabits = Array.isArray(userHabits[user.email]) 
        ? userHabits[user.email] 
        : [];
      
      const habit = {
        id: 'habit_' + Date.now(),
        name: newHabit,
        emoji: '✨',
        streak: 0,
        createdAt: new Date().toISOString()
      };
      
      userHabits[user.email] = [habit, ...existingHabits];
      storage.set('imara_habits', userHabits);
      setHabits(userHabits[user.email]);
      setNewHabit('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleToggleHabit = (habitId) => {
    try {
      const user = storage.get('imara_current_user');
      if (!user?.email) {
        console.error('Cannot toggle habit: No user found');
        return;
      }
      
      const today = new Date().toISOString().split('T')[0];
      const habitCompletions = storage.get('imara_habit_completions') || {};
      
      // Initialize structure if it doesn't exist
      if (!habitCompletions[user.email]) {
        habitCompletions[user.email] = {};
      }
      if (!habitCompletions[user.email][habitId]) {
        habitCompletions[user.email][habitId] = {};
      }
      
      // Toggle completion for today
      if (habitCompletions[user.email][habitId][today]) {
        delete habitCompletions[user.email][habitId][today];
      } else {
        habitCompletions[user.email][habitId][today] = true;
      }
      
      // Save completions
      storage.set('imara_habit_completions', habitCompletions);
      
      // Update streak for this habit
      const updatedHabits = habits.map(habit => {
        if (habit.id === habitId) {
          const streak = calculateStreak(habitId, habitCompletions[user.email][habitId] || {});
          return { ...habit, streak };
        }
        return habit;
      });
      
      // Update habits storage
      const userHabits = storage.get('imara_habits') || {};
      if (userHabits[user.email]) {
        userHabits[user.email] = updatedHabits;
        storage.set('imara_habits', userHabits);
      }
      
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const calculateStreak = (habitId, completions) => {
    if (!completions || typeof completions !== 'object') return 0;
    
    try {
      const dates = Object.keys(completions)
        .filter(date => completions[date] === true)
        .sort()
        .reverse();
      
      if (dates.length === 0) return 0;
      
      let streak = 0;
      let expectedDate = new Date();
      
      // Check if today is completed
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // If today is completed, streak starts at 1
      if (dates.includes(today)) {
        streak = 1;
        expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - 1);
      } 
      // If yesterday is completed but not today
      else if (dates.includes(yesterdayStr)) {
        streak = 1;
        expectedDate = new Date(yesterdayStr);
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        return 0;
      }
      
      // Check consecutive days backwards
      for (let i = 0; i < dates.length; i++) {
        const dateStr = dates[i];
        const date = new Date(dateStr);
        const expectedDateStr = expectedDate.toISOString().split('T')[0];
        
        if (dateStr === expectedDateStr) {
          streak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (date < expectedDate) {
          // Skip older dates that aren't consecutive
          continue;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  const handleRemoveHabit = (habitId) => {
    try {
      const user = storage.get('imara_current_user');
      if (!user?.email) {
        console.error('Cannot remove habit: No user found');
        return;
      }

      const userHabits = storage.get('imara_habits') || {};
      if (userHabits[user.email]) {
        userHabits[user.email] = userHabits[user.email].filter(h => h.id !== habitId);
        storage.set('imara_habits', userHabits);
        setHabits(userHabits[user.email]);
      }
    } catch (error) {
      console.error('Error removing habit:', error);
    }
  };

  const isHabitCompletedToday = (habitId) => {
    try {
      const user = storage.get('imara_current_user');
      if (!user?.email) return false;
      
      const today = new Date().toISOString().split('T')[0];
      const completions = storage.get('imara_habit_completions') || {};
      return completions[user.email]?.[habitId]?.[today] === true;
    } catch (error) {
      console.error('Error checking habit completion:', error);
      return false;
    }
  };

  const getCompletionRate = () => {
    if (!habits || habits.length === 0) return 0;
    
    try {
      const completedToday = habits.filter(h => isHabitCompletedToday(h.id)).length;
      return Math.round((completedToday / habits.length) * 100);
    } catch (error) {
      console.error('Error calculating completion rate:', error);
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-stone-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-stone-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            className="p-2 text-amber-600 hover:text-amber-700 transition-colors"
            aria-label={showAddForm ? "Close add habit form" : "Add new habit"}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Habit Form */}
      {showAddForm && (
        <div className="bg-stone-50 p-4 rounded-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-stone-700">Add New Habit</p>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="e.g., Read for 10 minutes"
            className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300 transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
          />
          <button
            onClick={handleAddHabit}
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newHabit.trim()}
          >
            Add Habit
          </button>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {!habits || habits.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No habits yet. Add your first habit!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
            >
              + Create a habit
            </button>
          </div>
        ) : (
          habits.map((habit) => {
            const completed = isHabitCompletedToday(habit.id);
            
            return (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-stone-100 hover:border-amber-200 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      completed
                        ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600'
                        : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                    }`}
                    aria-label={completed ? `Mark ${habit.name} as incomplete` : `Mark ${habit.name} as complete`}
                  >
                    {completed && <CheckCircle className="w-5 h-5 text-white" />}
                  </button>
                  <div>
                    <p className="text-stone-800">{habit.emoji} {habit.name}</p>
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-amber-600" />
                        <span className="text-xs text-amber-700">{habit.streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveHabit(habit.id)}
                  className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={`Remove ${habit.name}`}
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
      <div className="text-xs text-stone-500 space-y-1 p-3 bg-amber-50 rounded-lg">
        <p className="flex items-center gap-2">
          <span className="text-amber-600">💡</span>
          <span>Start with 1-2 small habits</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-amber-600">💡</span>
          <span>Focus on consistency, not perfection</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-amber-600">💡</span>
          <span>Celebrate every day you complete a habit</span>
        </p>
      </div>
    </div>
  );
};

export default HabitTracker;