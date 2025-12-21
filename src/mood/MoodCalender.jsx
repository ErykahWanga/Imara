import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { storage } from '../../utils/storage';

const MoodCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState({});

  const moods = {
    'tired': { emoji: '😴', color: 'bg-blue-100', textColor: 'text-blue-800' },
    'neutral': { emoji: '😐', color: 'bg-gray-100', textColor: 'text-gray-800' },
    'calm': { emoji: '😌', color: 'bg-green-100', textColor: 'text-green-800' },
    'overwhelmed': { emoji: '😰', color: 'bg-red-100', textColor: 'text-red-800' },
    'happy': { emoji: '😊', color: 'bg-yellow-100', textColor: 'text-yellow-800' },
    'energetic': { emoji: '⚡', color: 'bg-purple-100', textColor: 'text-purple-800' }
  };

  useEffect(() => {
    const user = storage.get('imara_current_user');
    const checkins = storage.get('imara_checkins') || {};
    setMoodData(checkins[user?.email] || {});
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay();
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMoodForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return moodData[dateString]?.mood;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const moodStats = Object.values(moodData).reduce((stats, day) => {
    stats[day.mood] = (stats[day.mood] || 0) + 1;
    return stats;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600" />
          Mood Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 text-stone-400 hover:text-stone-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-stone-700">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 text-stone-400 hover:text-stone-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mood Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(moods).map(([mood, data]) => (
          <div key={mood} className="flex items-center gap-1 text-xs">
            <div className={`w-3 h-3 rounded ${data.color}`}></div>
            <span className="text-stone-600 capitalize">{mood}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs text-stone-500 py-1">
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-10"></div>;
          }
          
          const mood = getMoodForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const moodConfig = mood ? moods[mood] : null;
          
          return (
            <div
              key={date.toISOString()}
              className={`h-10 flex items-center justify-center rounded-lg relative ${
                moodConfig ? moodConfig.color : 'bg-stone-50'
              } ${isToday ? 'ring-2 ring-amber-400' : ''}`}
            >
              <div className="text-center">
                <div className="text-sm font-medium text-stone-700">
                  {date.getDate()}
                </div>
                {mood && (
                  <div className="text-xs">{moods[mood]?.emoji}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mood Statistics */}
      {Object.keys(moodStats).length > 0 && (
        <div className="pt-4 border-t border-stone-200">
          <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Monthly Mood Summary
          </h4>
          <div className="space-y-2">
            {Object.entries(moodStats).map(([mood, count]) => {
              const totalDays = Object.keys(moodData).length;
              const percentage = Math.round((count / totalDays) * 100);
              
              return (
                <div key={mood} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{moods[mood]?.emoji}</span>
                    <span className="text-sm text-stone-600 capitalize">{mood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-stone-200 rounded-full h-2">
                      <div 
                        className={`h-full rounded-full ${moods[mood]?.color.replace('bg-', 'bg-').replace('100', '400')}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-stone-600 w-8">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;