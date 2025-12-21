import React, { useState, useEffect } from 'react';
import { Target, Users, Trophy, TrendingUp, Calendar, CheckCircle, Heart, Zap, Award, Share2 } from 'lucide-react';
import { storage } from '../../utils/storage';

const CommunityChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  const allChallenges = [
    {
      id: 'hydration',
      title: '7-Day Hydration Challenge',
      description: 'Drink 8 glasses of water daily for a week',
      icon: TrendingUp,
      duration: 7,
      participants: 342,
      points: 50,
      category: 'wellness',
      color: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: 'gratitude',
      title: 'Gratitude Week',
      description: 'Share one thing you\'re grateful for each day',
      icon: Heart,
      duration: 7,
      participants: 215,
      points: 40,
      category: 'mindfulness',
      color: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      id: 'movement',
      title: 'Daily Movement',
      description: '10 minutes of movement every day for 14 days',
      icon: Zap,
      duration: 14,
      participants: 189,
      points: 75,
      category: 'fitness',
      color: 'bg-red-100',
      textColor: 'text-red-700'
    },
    {
      id: 'digital_detox',
      title: 'Digital Detox Weekend',
      description: 'Reduce screen time for 48 hours',
      icon: Calendar,
      duration: 2,
      participants: 127,
      points: 35,
      category: 'mindfulness',
      color: 'bg-purple-100',
      textColor: 'text-purple-700'
    },
    {
      id: 'kindness',
      title: 'Acts of Kindness',
      description: 'Perform one act of kindness daily',
      icon: Heart,
      duration: 7,
      participants: 278,
      points: 45,
      category: 'community',
      color: 'bg-pink-100',
      textColor: 'text-pink-700'
    },
    {
      id: 'sleep',
      title: 'Sleep Hygiene Challenge',
      description: 'Consistent bedtime for 21 days',
      icon: Award,
      duration: 21,
      participants: 156,
      points: 100,
      category: 'wellness',
      color: 'bg-indigo-100',
      textColor: 'text-indigo-700'
    }
  ];

  useEffect(() => {
    const user = storage.get('imara_current_user');
    const joined = storage.get('imara_challenges') || {};
    setUserChallenges(joined[user?.email] || []);
  }, []);

  const joinChallenge = (challengeId) => {
    const user = storage.get('imara_current_user');
    const joined = storage.get('imara_challenges') || {};
    
    if (!joined[user.email]) joined[user.email] = [];
    
    if (!joined[user.email].includes(challengeId)) {
      joined[user.email].push(challengeId);
      storage.set('imara_challenges', joined);
      setUserChallenges(joined[user.email]);
    }
  };

  const leaveChallenge = (challengeId) => {
    const user = storage.get('imara_current_user');
    const joined = storage.get('imara_challenges') || {};
    
    joined[user.email] = joined[user.email].filter(id => id !== challengeId);
    storage.set('imara_challenges', joined);
    setUserChallenges(joined[user.email]);
  };

  const getChallengeProgress = (challengeId) => {
    // Simplified progress calculation
    // In a real app, you'd track daily check-ins for each challenge
    return Math.floor(Math.random() * 100);
  };

  const shareChallenge = (challenge) => {
    if (navigator.share) {
      navigator.share({
        title: `Join me in the "${challenge.title}" challenge on IMARA!`,
        text: challenge.description,
        url: window.location.href
      });
    }
  };

  const activeChallenges = allChallenges.filter(c => 
    userChallenges.includes(c.id)
  );

  const availableChallenges = allChallenges.filter(c => 
    !userChallenges.includes(c.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-600" />
          Community Challenges
        </h3>
        <span className="text-xs text-stone-500">
          {activeChallenges.length} joined • {allChallenges.length} total
        </span>
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">Community Power</p>
            <p className="text-xs text-blue-700 mt-1">
              {allChallenges.reduce((sum, c) => sum + c.participants, 0)} members participating
            </p>
          </div>
          <Users className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl border-2 border-stone-100">
        <div className="flex">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-4 text-sm rounded-lg transition-colors ${activeTab === 'active' ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
          >
            My Challenges ({activeChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-4 text-sm rounded-lg transition-colors ${activeTab === 'available' ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Available ({availableChallenges.length})
          </button>
        </div>
      </div>

      {/* Active Challenges */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeChallenges.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active challenges</p>
              <p className="text-sm mt-1">Join a challenge to start earning points!</p>
            </div>
          ) : (
            activeChallenges.map((challenge) => {
              const Icon = challenge.icon;
              const progress = getChallengeProgress(challenge.id);
              
              return (
                <div
                  key={challenge.id}
                  className="bg-white p-4 rounded-xl border-2 border-stone-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${challenge.color}`}>
                        <Icon className={`w-5 h-5 ${challenge.textColor}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-stone-800">{challenge.title}</h4>
                        <p className="text-xs text-stone-600 mt-0.5">{challenge.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => leaveChallenge(challenge.id)}
                      className="text-xs text-stone-400 hover:text-red-500"
                    >
                      Leave
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-stone-500 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-stone-400" />
                          <span className="text-stone-600">{challenge.participants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span className="text-stone-600">{challenge.duration} days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          <span className="text-amber-600">{challenge.points} pts</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => shareChallenge(challenge)}
                        className="flex items-center gap-1 text-amber-600 hover:text-amber-700"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Available Challenges */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableChallenges.map((challenge) => {
            const Icon = challenge.icon;
            
            return (
              <div
                key={challenge.id}
                className="bg-white p-4 rounded-xl border-2 border-stone-100 hover:border-amber-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${challenge.color}`}>
                      <Icon className={`w-5 h-5 ${challenge.textColor}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-800">{challenge.title}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">{challenge.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-stone-400" />
                      <span className="text-stone-600">{challenge.participants} joined</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span className="text-stone-600">{challenge.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span className="text-amber-600">{challenge.points} points</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => joinChallenge(challenge.id)}
                    className="bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-amber-700 transition-colors"
                  >
                    Join Challenge
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Challenge Categories */}
      <div className="bg-stone-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-stone-700 mb-3">Challenge Categories</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Wellness', count: allChallenges.filter(c => c.category === 'wellness').length },
            { name: 'Mindfulness', count: allChallenges.filter(c => c.category === 'mindfulness').length },
            { name: 'Fitness', count: allChallenges.filter(c => c.category === 'fitness').length },
            { name: 'Community', count: allChallenges.filter(c => c.category === 'community').length },
          ].map((category) => {
            const joinedInCategory = allChallenges
              .filter(c => c.category === category.name.toLowerCase())
              .filter(c => userChallenges.includes(c.id)).length;
            
            return (
              <div key={category.name} className="bg-white p-3 rounded-lg border border-stone-200">
                <p className="text-sm font-medium text-stone-700">{category.name}</p>
                <p className="text-xs text-stone-600 mt-1">
                  {joinedInCategory} of {category.count} joined
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Benefits */}
      <div className="bg-amber-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-amber-800 mb-2">Why Join Challenges?</h4>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Build healthy habits with community support</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Earn achievement points and badges</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Stay motivated with shared progress</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Learn from others' experiences</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityChallenges;