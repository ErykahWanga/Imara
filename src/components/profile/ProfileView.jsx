import React, { useState, useEffect } from 'react';
import { User, Target, TrendingUp, CheckCircle, Heart, MessageCircle } from 'lucide-react';
import { storage } from '../../utils/storage';

const ProfileView = () => {
  const user = storage.get('imara_current_user');
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [pathCompletions, setPathCompletions] = useState([]);
  const [journeyPosts, setJourneyPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const userData = storage.get('imara_current_user');
    if (!userData) return;

    const userGoals = storage.get('imara_user_goals') || {};
    setGoals(userGoals[userData.email] || []);

    const userCheckins = storage.get('imara_checkins') || {};
    const userCheckinData = userCheckins[userData.email] || {};
    setCheckins(Object.entries(userCheckinData).sort((a, b) => b[0].localeCompare(a[0])));

    const completions = storage.get('imara_path_completions') || {};
    setPathCompletions(completions[userData.email] || []);

    const journeys = storage.get('imara_journey_posts') || {};
    setJourneyPosts(journeys[userData.email] || []);
  }, [user?.email]);

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;

    const goal = {
      id: 'goal_' + Date.now(),
      text: newGoal,
      createdAt: new Date().toISOString(),
      completed: false
    };

    const userGoals = storage.get('imara_user_goals') || {};
    if (!userGoals[user.email]) userGoals[user.email] = [];
    userGoals[user.email] = [goal, ...userGoals[user.email]];
    
    storage.set('imara_user_goals', userGoals);
    setGoals(userGoals[user.email]);
    setNewGoal('');
    setShowAddGoal(false);
  };

  const toggleGoalComplete = (goalId) => {
    const userGoals = storage.get('imara_user_goals') || {};
    userGoals[user.email] = userGoals[user.email].map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    storage.set('imara_user_goals', userGoals);
    setGoals(userGoals[user.email]);
  };

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      tired: '😴',
      neutral: '😐',
      calm: '😌',
      overwhelmed: '😰'
    };
    return emojiMap[mood] || '•';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl border-2 border-stone-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
            <span className="text-2xl font-light text-white">{user.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-light text-stone-800">{user.name}</h2>
            <p className="text-sm text-stone-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
          <div className="text-center">
            <p className="text-2xl font-light text-stone-800">{checkins.length}</p>
            <p className="text-xs text-stone-500">Check-ins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-stone-800">{pathCompletions.length}</p>
            <p className="text-xs text-stone-500">Paths</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-stone-800">{goals.filter(g => g.completed).length}</p>
            <p className="text-xs text-stone-500">Goals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-stone-800">{journeyPosts.length}</p>
            <p className="text-xs text-stone-500">Journeys</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl border-2 border-stone-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 text-sm rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('journeys')}
            className={`flex-1 py-2 px-4 text-sm rounded-lg transition-colors ${activeTab === 'journeys' ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
          >
            My Journeys ({journeyPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-2 px-4 text-sm rounded-lg transition-colors ${activeTab === 'goals' ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Goals ({goals.length})
          </button>
        </div>
      </div>

      {/* Journeys Tab */}
      {activeTab === 'journeys' && (
        <div className="space-y-4">
          {journeyPosts.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border-2 border-stone-100 text-center">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-600">No journey posts yet</p>
              <p className="text-sm text-stone-500 mt-1">Share your first journey from the Inspiration Feed</p>
            </div>
          ) : (
            journeyPosts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-2xl border-2 border-stone-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-800">My Journey</p>
                      <p className="text-xs text-stone-400">{formatTime(post.timestamp)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-stone-700 mb-4">{post.content}</p>
                <div className="flex items-center gap-4 text-sm text-stone-500 pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes || 0}</span>
                  </div>
                  {post.comments && post.comments.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="bg-white p-6 rounded-2xl border-2 border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              Your Goals
            </h3>
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="text-sm text-amber-600 hover:text-amber-700 transition-colors"
            >
              {showAddGoal ? 'Cancel' : '+ Add goal'}
            </button>
          </div>

          {showAddGoal && (
            <div className="space-y-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="What do you want to work towards?"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              />
              <button
                onClick={handleAddGoal}
                className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Add goal
              </button>
            </div>
          )}

          <div className="space-y-2">
            {goals.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-4">No goals yet. Add one to get started.</p>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors"
                >
                  <button
                    onClick={() => toggleGoalComplete(goal.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      goal.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {goal.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                    {goal.text}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(goal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overview Tab (default) */}
      {activeTab === 'overview' && (
        <>
          {/* Recent Progress */}
          <div className="bg-white p-6 rounded-2xl border-2 border-stone-100 space-y-4">
            <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Recent Progress
            </h3>

            {journeyPosts.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-stone-600 font-medium">Recent Journeys</p>
                {journeyPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-stone-800 line-clamp-2">{post.content}</p>
                    <p className="text-xs text-stone-500 mt-1">{formatTime(post.timestamp)}</p>
                  </div>
                ))}
              </div>
            )}

            {pathCompletions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-stone-600 font-medium">Completed Paths</p>
                {pathCompletions.slice(0, 3).map((completion, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm text-stone-800">{completion.pathTitle}</p>
                      <p className="text-xs text-stone-500">
                        {new Date(completion.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {checkins.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-stone-600 font-medium">Recent Check-ins</p>
                {checkins.slice(0, 7).map(([date, data]) => (
                  <div key={date} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <span className="text-sm text-stone-700">{new Date(date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-white rounded border border-stone-200">
                        {getMoodEmoji(data.mood)} {data.mood}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileView;