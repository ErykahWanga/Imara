import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Heart, Coffee, Book, Music, Users, Moon, X, CheckCircle } from 'lucide-react';
import { storage } from '../../utils/storage';

const SelfCarePlanner = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('mind');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [time, setTime] = useState('09:00');

  const days = [
    { id: 'monday', name: 'Monday' },
    { id: 'tuesday', name: 'Tuesday' },
    { id: 'wednesday', name: 'Wednesday' },
    { id: 'thursday', name: 'Thursday' },
    { id: 'friday', name: 'Friday' },
    { id: 'saturday', name: 'Saturday' },
    { id: 'sunday', name: 'Sunday' }
  ];

  const categories = [
    { id: 'mind', name: 'Mind', icon: Book, color: 'bg-blue-100', textColor: 'text-blue-700' },
    { id: 'body', name: 'Body', icon: Heart, color: 'bg-red-100', textColor: 'text-red-700' },
    { id: 'soul', name: 'Soul', icon: Music, color: 'bg-purple-100', textColor: 'text-purple-700' },
    { id: 'social', name: 'Social', icon: Users, color: 'bg-green-100', textColor: 'text-green-700' },
    { id: 'rest', name: 'Rest', icon: Moon, color: 'bg-indigo-100', textColor: 'text-indigo-700' },
    { id: 'nourish', name: 'Nourish', icon: Coffee, color: 'bg-amber-100', textColor: 'text-amber-700' }
  ];

  const activitySuggestions = {
    mind: [
      'Read for 15 minutes',
      'Listen to a podcast',
      'Learn something new',
      'Write in journal',
      'Solve a puzzle'
    ],
    body: [
      '10-minute stretch',
      'Go for a walk',
      'Drink 8 glasses of water',
      'Healthy meal prep',
      'Yoga session'
    ],
    soul: [
      'Meditate for 5 minutes',
      'Listen to calming music',
      'Watch sunrise/sunset',
      'Practice gratitude',
      'Creative activity'
    ],
    social: [
      'Call a friend',
      'Send a thoughtful message',
      'Join a community event',
      'Share appreciation',
      'Connect with loved ones'
    ],
    rest: [
      'Take a nap',
      'Digital detox for 1 hour',
      'Early bedtime',
      'Relaxing bath',
      'Quiet time alone'
    ],
    nourish: [
      'Cook a healthy meal',
      'Try a new recipe',
      'Mindful eating',
      'Herbal tea break',
      'Hydration check-in'
    ]
  };

  useEffect(() => {
    const user = storage.get('imara_current_user');
    const userActivities = storage.get('imara_selfcare_activities') || {};
    setActivities(userActivities[user?.email] || []);
  }, []);

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;

    const user = storage.get('imara_current_user');
    const userActivities = storage.get('imara_selfcare_activities') || {};
    
    const activity = {
      id: 'activity_' + Date.now(),
      text: newActivity,
      category: selectedCategory,
      day: selectedDay,
      time: time,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    if (!userActivities[user.email]) userActivities[user.email] = [];
    userActivities[user.email].push(activity);
    
    storage.set('imara_selfcare_activities', userActivities);
    setActivities(userActivities[user.email]);
    setNewActivity('');
  };

  const toggleActivity = (activityId) => {
    const user = storage.get('imara_current_user');
    const userActivities = storage.get('imara_selfcare_activities') || {};
    
    userActivities[user.email] = userActivities[user.email].map(a => 
      a.id === activityId ? { ...a, completed: !a.completed } : a
    );
    
    storage.set('imara_selfcare_activities', userActivities);
    setActivities(userActivities[user.email]);
  };

  const deleteActivity = (activityId) => {
    const user = storage.get('imara_current_user');
    const userActivities = storage.get('imara_selfcare_activities') || {};
    
    userActivities[user.email] = userActivities[user.email].filter(a => a.id !== activityId);
    storage.set('imara_selfcare_activities', userActivities);
    setActivities(userActivities[user.email]);
  };

  const getDayActivities = (dayId) => {
    return activities.filter(a => a.day === dayId);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Heart;
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
          <Heart className="w-5 h-5 text-amber-600" />
          Self-Care Planner
        </h3>
        <span className="text-xs text-stone-500">
          {activities.filter(a => a.completed).length} of {activities.length} completed
        </span>
      </div>

      {/* Weekly Overview */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-pink-800">Weekly Self-Care Plan</p>
            <p className="text-xs text-pink-700 mt-1">
              Schedule small acts of care throughout your week
            </p>
          </div>
        </div>
      </div>

      {/* Add Activity Form */}
      <div className="bg-white p-4 rounded-xl border-2 border-stone-100 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-stone-700">Add Self-Care Activity</p>
        </div>
        
        <div className="space-y-3">
          <input
            type="text"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="What self-care activity would you like to schedule?"
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300"
            onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-stone-600 mb-1">Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300"
              >
                {days.map(day => (
                  <option key={day.id} value={day.id}>{day.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-stone-600 mb-1">Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? `${category.color} ${category.textColor}`
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Activity Suggestions */}
          <div>
            <p className="text-sm text-stone-600 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {activitySuggestions[selectedCategory].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setNewActivity(suggestion)}
                  className="text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full hover:bg-stone-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleAddActivity}
            disabled={!newActivity.trim()}
            className="w-full bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            Add to Plan
          </button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-stone-700">Weekly Schedule</h4>
        
        <div className="space-y-3">
          {days.map((day) => {
            const dayActivities = getDayActivities(day.id);
            
            return (
              <div key={day.id} className="bg-white p-4 rounded-xl border-2 border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-stone-700">{day.name}</h5>
                  <span className="text-xs text-stone-500">
                    {dayActivities.filter(a => a.completed).length} of {dayActivities.length} done
                  </span>
                </div>
                
                {dayActivities.length === 0 ? (
                  <p className="text-sm text-stone-400 text-center py-2">
                    No activities scheduled
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dayActivities.map((activity) => {
                      const CategoryIcon = getCategoryIcon(activity.category);
                      const category = categories.find(c => c.id === activity.category);
                      
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleActivity(activity.id)}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                activity.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-stone-300 hover:border-stone-400'
                              }`}
                            >
                              {activity.completed && <CheckCircle className="w-4 h-4 text-white" />}
                            </button>
                            <div>
                              <p className={`text-sm ${activity.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                                {activity.text}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <CategoryIcon className="w-3 h-3 text-stone-400" />
                                <span className="text-xs text-stone-500">
                                  {formatTime(activity.time)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteActivity(activity.id)}
                            className="p-1 text-stone-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Self-Care Tips */}
      <div className="bg-stone-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-stone-700 mb-3">Self-Care Tips</h4>
        <ul className="space-y-2 text-sm text-stone-600">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Start with just 5-10 minutes per activity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Schedule activities when you have natural energy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Mix different types of self-care throughout the week</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Be flexible - it's okay to reschedule if needed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">•</span>
            <span>Celebrate completing activities, no matter how small</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SelfCarePlanner;