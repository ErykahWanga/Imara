import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, Heart, Calendar, Zap, TrendingUp, Users, Award, Share2 } from 'lucide-react';
import { storage } from '../../utils/storage';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const allAchievements = [
    {
      id: 'first_checkin',
      title: 'Getting Started',
      description: 'Complete your first daily check-in',
      icon: Target,
      points: 10,
      category: 'consistency',
      color: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: 'streak_3',
      title: 'Three Day Streak',
      description: 'Check in for 3 consecutive days',
      icon: Zap,
      points: 25,
      category: 'consistency',
      color: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      id: 'streak_7',
      title: 'Weekly Warrior',
      description: 'Check in for 7 consecutive days',
      icon: Calendar,
      points: 50,
      category: 'consistency',
      color: 'bg-purple-100',
      textColor: 'text-purple-700'
    },
    {
      id: 'first_path',
      title: 'Pathfinder',
      description: 'Complete your first guided path',
      icon: TrendingUp,
      points: 30,
      category: 'growth',
      color: 'bg-amber-100',
      textColor: 'text-amber-700'
    },
    {
      id: 'first_journey',
      title: 'Storyteller',
      description: 'Share your first journey post',
      icon: Heart,
      points: 15,
      category: 'community',
      color: 'bg-pink-100',
      textColor: 'text-pink-700'
    },
    {
      id: 'helping_hand',
      title: 'Helping Hand',
      description: 'Reply to 5 community posts',
      icon: Users,
      points: 40,
      category: 'community',
      color: 'bg-indigo-100',
      textColor: 'text-indigo-700'
    },
    {
      id: 'habit_master',
      title: 'Habit Master',
      description: 'Maintain a 7-day habit streak',
      icon: Star,
      points: 35,
      category: 'growth',
      color: 'bg-emerald-100',
      textColor: 'text-emerald-700'
    },
    {
      id: 'mood_tracker',
      title: 'Self-Aware',
      description: 'Track your mood for 14 days',
      icon: Heart,
      points: 45,
      category: 'awareness',
      color: 'bg-rose-100',
      textColor: 'text-rose-700'
    },
    {
      id: 'journal_keeper',
      title: 'Reflective Soul',
      description: 'Write 10 journal entries',
      icon: Award,
      points: 30,
      category: 'awareness',
      color: 'bg-cyan-100',
      textColor: 'text-cyan-700'
    }
  ];

  useEffect(() => {
    const user = storage.get('imara_current_user');
    const earned = storage.get('imara_achievements') || {};
    setUserAchievements(earned[user?.email] || []);
    
    // Calculate points
    const points = (earned[user?.email] || [])
      .map(id => allAchievements.find(a => a.id === id)?.points || 0)
      .reduce((sum, points) => sum + points, 0);
    setTotalPoints(points);
    
    // Check for new achievements
    checkForNewAchievements(user);
  }, []);

  const checkForNewAchievements = (user) => {
    if (!user) return;
    
    const earned = storage.get('imara_achievements') || {};
    const userEarned = earned[user.email] || [];
    const newAchievements = [];
    
    // Check consistency achievements
    const checkins = storage.get('imara_checkins') || {};
    const userCheckins = checkins[user.email] || {};
    const checkinDays = Object.keys(userCheckins).length;
    
    if (checkinDays >= 1 && !userEarned.includes('first_checkin')) {
      newAchievements.push('first_checkin');
    }
    if (checkinDays >= 3 && !userEarned.includes('streak_3')) {
      newAchievements.push('streak_3');
    }
    if (checkinDays >= 7 && !userEarned.includes('streak_7')) {
      newAchievements.push('streak_7');
    }
    
    // Check path completions
    const completions = storage.get('imara_path_completions') || {};
    const userCompletions = completions[user.email] || [];
    if (userCompletions.length >= 1 && !userEarned.includes('first_path')) {
      newAchievements.push('first_path');
    }
    
    // Check journey posts
    const journeys = storage.get('imara_journey_posts') || {};
    const userJourneys = journeys[user.email] || [];
    if (userJourneys.length >= 1 && !userEarned.includes('first_journey')) {
      newAchievements.push('first_journey');
    }
    
    // Save new achievements
    if (newAchievements.length > 0) {
      earned[user.email] = [...userEarned, ...newAchievements];
      storage.set('imara_achievements', earned);
      setUserAchievements(earned[user.email]);
    }
  };

  const getAchievementProgress = (achievementId) => {
    const user = storage.get('imara_current_user');
    
    switch(achievementId) {
      case 'first_checkin':
        const checkins = storage.get('imara_checkins') || {};
        const userCheckins = checkins[user?.email] || {};
        return Object.keys(userCheckins).length >= 1 ? 100 : 0;
      
      case 'streak_3':
        // Simplified - you'd implement actual streak calculation
        return Math.min(100, (Object.keys(storage.get('imara_checkins')?.[user?.email] || {}).length / 3) * 100);
      
      default:
        return userAchievements.includes(achievementId) ? 100 : 0;
    }
  };

  const shareAchievement = (achievement) => {
    if (navigator.share) {
      navigator.share({
        title: `I earned the "${achievement.title}" achievement on IMARA!`,
        text: achievement.description,
        url: window.location.href
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          Achievements
        </h3>
        <div className="text-right">
          <div className="text-xs text-stone-500">Total Points</div>
          <div className="text-lg font-medium text-amber-700">{totalPoints}</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">Your Progress</p>
            <p className="text-xs text-amber-700">
              {userAchievements.length} of {allAchievements.length} achievements unlocked
            </p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#fef3c7"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(userAchievements.length / allAchievements.length) * 251} 251`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-amber-700">
                {Math.round((userAchievements.length / allAchievements.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Earned Achievements */}
      {userAchievements.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-stone-700">Your Badges</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allAchievements
              .filter(a => userAchievements.includes(a.id))
              .map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`${achievement.color} p-4 rounded-xl border-2 border-white shadow-sm`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className={`p-2 rounded-lg ${achievement.color} border-2 border-white`}>
                        <Icon className={`w-6 h-6 ${achievement.textColor}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${achievement.textColor}`}>
                          {achievement.title}
                        </p>
                        <p className="text-xs text-stone-600 mt-1">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between w-full mt-2">
                        <span className={`text-xs font-medium ${achievement.textColor}`}>
                          {achievement.points} pts
                        </span>
                        <button
                          onClick={() => shareAchievement(achievement)}
                          className="text-stone-400 hover:text-stone-600"
                        >
                          <Share2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* All Achievements */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-stone-700">Available Achievements</h4>
        <div className="space-y-3">
          {allAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const earned = userAchievements.includes(achievement.id);
            const progress = getAchievementProgress(achievement.id);
            
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 ${earned ? 'border-amber-200 bg-amber-50' : 'border-stone-200 bg-white'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${achievement.color} ${earned ? '' : 'opacity-60'}`}>
                    <Icon className={`w-5 h-5 ${achievement.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${earned ? 'text-amber-700' : 'text-stone-700'}`}>
                          {achievement.title}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {achievement.description}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ${earned ? 'text-amber-600' : 'text-stone-400'}`}>
                        {achievement.points} pts
                      </span>
                    </div>
                    
                    {!earned && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-stone-500 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {earned && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                        <Trophy className="w-3 h-3" />
                        <span>Earned!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="bg-stone-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-stone-700 mb-3">Achievement Categories</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Consistency', color: 'bg-blue-100', count: allAchievements.filter(a => a.category === 'consistency').length },
            { name: 'Growth', color: 'bg-green-100', count: allAchievements.filter(a => a.category === 'growth').length },
            { name: 'Community', color: 'bg-purple-100', count: allAchievements.filter(a => a.category === 'community').length },
            { name: 'Awareness', color: 'bg-pink-100', count: allAchievements.filter(a => a.category === 'awareness').length },
          ].map((category) => {
            const earnedInCategory = allAchievements
              .filter(a => a.category === category.name.toLowerCase())
              .filter(a => userAchievements.includes(a.id)).length;
            
            return (
              <div key={category.name} className={`${category.color} p-3 rounded-lg`}>
                <p className="text-sm font-medium text-stone-700">{category.name}</p>
                <p className="text-xs text-stone-600 mt-1">
                  {earnedInCategory} of {category.count} earned
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;