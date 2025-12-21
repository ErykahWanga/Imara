import React, { useState, useEffect } from 'react';
import { Bell, Plus, Clock, CheckCircle, X, Trash2 } from 'lucide-react';
import { storage } from '../../utils/storage';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [time, setTime] = useState('09:00');
  const [repeat, setRepeat] = useState('daily');

  const repeatOptions = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekdays', label: 'Weekdays' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'once', label: 'Once' }
  ];

  useEffect(() => {
    const user = storage.get('imara_current_user');
    const userReminders = storage.get('imara_reminders') || {};
    setReminders(userReminders[user?.email] || []);
    
    // Check for due reminders
    checkDueReminders();
  }, []);

  const handleAddReminder = () => {
    if (!newReminder.trim()) return;

    const user = storage.get('imara_current_user');
    const userReminders = storage.get('imara_reminders') || {};
    
    const reminder = {
      id: 'reminder_' + Date.now(),
      text: newReminder,
      time: time,
      repeat: repeat,
      enabled: true,
      createdAt: new Date().toISOString(),
      lastTriggered: null
    };
    
    if (!userReminders[user.email]) userReminders[user.email] = [];
    userReminders[user.email].push(reminder);
    
    storage.set('imara_reminders', userReminders);
    setReminders(userReminders[user.email]);
    setNewReminder('');
    setShowAddForm(false);
  };

  const toggleReminder = (reminderId) => {
    const user = storage.get('imara_current_user');
    const userReminders = storage.get('imara_reminders') || {};
    
    userReminders[user.email] = userReminders[user.email].map(r => 
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    );
    
    storage.set('imara_reminders', userReminders);
    setReminders(userReminders[user.email]);
  };

  const deleteReminder = (reminderId) => {
    const user = storage.get('imara_current_user');
    const userReminders = storage.get('imara_reminders') || {};
    
    userReminders[user.email] = userReminders[user.email].filter(r => r.id !== reminderId);
    storage.set('imara_reminders', userReminders);
    setReminders(userReminders[user.email]);
  };

  const checkDueReminders = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    reminders.forEach(reminder => {
      if (!reminder.enabled) return;
      
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderTime = hours * 60 + minutes;
      
      // If within 5 minutes of reminder time
      if (Math.abs(currentTime - reminderTime) <= 5) {
        const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : null;
        const shouldTrigger = !lastTriggered || 
          (reminder.repeat === 'daily' && lastTriggered.toDateString() !== now.toDateString()) ||
          (reminder.repeat === 'weekdays' && [1,2,3,4,5].includes(now.getDay()) && lastTriggered.toDateString() !== now.toDateString());
        
        if (shouldTrigger) {
          showNotification(reminder.text);
        }
      }
    });
  };

  const showNotification = (text) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('IMARA Reminder', {
        body: text,
        icon: '/vite.svg'
      });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
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
          <Bell className="w-5 h-5 text-amber-600" />
          Reminders
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      {/* Notification Permission */}
      {typeof Notification !== 'undefined' && Notification.permission === 'default' && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Enable Notifications</p>
              <p className="text-xs text-blue-700 mb-2">Get gentle reminders for your self-care routines</p>
              <button
                onClick={requestNotificationPermission}
                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-stone-50 p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-stone-700">New Reminder</p>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              placeholder="What would you like to be reminded about?"
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300"
              onKeyPress={(e) => e.key === 'Enter' && handleAddReminder()}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-stone-600 mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Repeat</label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-amber-300"
                >
                  {repeatOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={handleAddReminder}
              disabled={!newReminder.trim()}
              className="w-full bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              Add Reminder
            </button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reminders yet</p>
            <p className="text-sm mt-1">Add your first reminder to stay on track</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-stone-100"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    reminder.enabled
                      ? 'bg-green-100 border-green-300'
                      : 'bg-stone-100 border-stone-300'
                  }`}
                >
                  {reminder.enabled && <CheckCircle className="w-4 h-4 text-green-600" />}
                </button>
                <div>
                  <p className="text-stone-800">{reminder.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span className="text-xs text-stone-500">
                      {formatTime(reminder.time)} • {repeatOptions.find(r => r.id === reminder.repeat)?.label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteReminder(reminder.id)}
                className="p-2 text-stone-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Reminder Suggestions */}
      <div className="bg-amber-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-amber-800 mb-2">Reminder Ideas</h4>
        <div className="space-y-2">
          {[
            'Drink a glass of water',
            'Take 5 deep breaths',
            'Stretch for 2 minutes',
            'Write 3 things you\'re grateful for',
            'Check in with how you\'re feeling'
          ].map((idea, index) => (
            <button
              key={index}
              onClick={() => {
                setNewReminder(idea);
                setShowAddForm(true);
              }}
              className="block w-full text-left text-sm text-amber-700 hover:text-amber-800 p-2 hover:bg-amber-100 rounded-lg transition-colors"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reminders;