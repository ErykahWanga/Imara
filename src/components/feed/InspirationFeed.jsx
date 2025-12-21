import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, BookOpen, Quote, Calendar, TrendingUp, Zap, Sunrise } from 'lucide-react';
import { storage } from '../../utils/storage';

const InspirationFeed = ({ onShareToCommunity }) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [userJourneyPosts, setUserJourneyPosts] = useState([]);
  const [newJourneyPost, setNewJourneyPost] = useState('');

  // Sample inspirational content
  const inspirationContent = [
    {
      id: 1,
      type: 'quote',
      content: 'Progress is not about how much you do, but that you do something.',
      author: 'Unknown',
      icon: Quote,
      category: 'Mindset',
      likes: 245
    },
    {
      id: 2,
      type: 'tip',
      content: 'Start your day with 5 minutes of quiet. No phone, no planning. Just breathe.',
      icon: Sunrise,
      category: 'Daily Practice',
      likes: 189
    },
    {
      id: 3,
      type: 'story',
      content: "I started with just 10 minutes a day. Now I run my own small business. Small steps compound.",
      author: 'Alex, 6 months in',
      icon: TrendingUp,
      category: 'Success Story',
      likes: 312
    },
    {
      id: 4,
      type: 'quote',
      content: 'The way to get started is to quit talking and begin doing.',
      author: 'Walt Disney',
      icon: Quote,
      category: 'Action',
      likes: 156
    },
    {
      id: 5,
      type: 'tip',
      content: 'Instead of "I have to", try "I get to". It changes everything.',
      icon: Zap,
      category: 'Mindset Shift',
      likes: 278
    },
    {
      id: 6,
      type: 'blog',
      title: 'The Power of Micro-Habits',
      content: 'Micro-habits are tiny behaviors that take less than 2 minutes to complete. Their power lies in consistency, not intensity.',
      icon: BookOpen,
      category: 'Productivity',
      likes: 421,
      readTime: '3 min read'
    }
  ];

  // User journey posts
  const journeyPosts = [
    {
      id: 'journey_1',
      user: 'River Stone',
      content: 'Today I completed my first guided path. I feel a small sense of accomplishment.',
      timestamp: '2 days ago',
      likes: 12,
      comments: 3
    },
    {
      id: 'journey_2',
      user: 'Calm Wind',
      content: 'After 30 days of daily check-ins, I can see patterns in my energy levels. Self-awareness grows slowly.',
      timestamp: '5 days ago',
      likes: 24,
      comments: 8
    }
  ];

  useEffect(() => {
    const user = storage.get('imara_current_user');
    const liked = storage.get('imara_liked_posts') || {};
    setLikedPosts(liked[user?.email] || []);

    const journeys = storage.get('imara_journey_posts') || {};
    setUserJourneyPosts(journeys[user?.email] || []);
  }, []);

  const handleLike = (postId) => {
    const user = storage.get('imara_current_user');
    const liked = storage.get('imara_liked_posts') || {};
    
    if (!liked[user.email]) liked[user.email] = [];
    
    if (liked[user.email].includes(postId)) {
      liked[user.email] = liked[user.email].filter(id => id !== postId);
    } else {
      liked[user.email].push(postId);
    }
    
    storage.set('imara_liked_posts', liked);
    setLikedPosts(liked[user.email] || []);
  };

  const handleShareJourney = () => {
    if (!newJourneyPost.trim()) return;
    
    const user = storage.get('imara_current_user');
    const journeys = storage.get('imara_journey_posts') || {};
    
    if (!journeys[user.email]) journeys[user.email] = [];
    
    const journeyPost = {
      id: 'user_journey_' + Date.now(),
      content: newJourneyPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      type: 'journey'
    };
    
    journeys[user.email].unshift(journeyPost);
    storage.set('imara_journey_posts', journeys);
    setUserJourneyPosts(journeys[user.email]);
    setNewJourneyPost('');
  };

  const formatTime = (timestamp) => {
    if (typeof timestamp === 'string' && timestamp.includes('ago')) return timestamp;
    
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-stone-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-600" />
            Inspiration Feed
          </h2>
          <p className="text-stone-500 text-sm">Daily motivation and community wisdom</p>
        </div>
      </div>

      {/* Share Your Journey Section */}
      <div className="bg-white p-6 rounded-2xl border-2 border-stone-100 space-y-4">
        <h3 className="text-lg font-light text-stone-800">Share Your Journey</h3>
        <p className="text-sm text-stone-600">What small step did you take today? Share your progress with the community.</p>
        
        <div className="space-y-3">
          <textarea
            value={newJourneyPost}
            onChange={(e) => setNewJourneyPost(e.target.value)}
            placeholder="Today I... (Share your small win or learning)"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors min-h-24 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleShareJourney}
              disabled={!newJourneyPost.trim()}
              className="flex-1 bg-amber-600 text-white py-2.5 rounded-xl hover:bg-amber-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              Share to My Journey
            </button>
            <button
              onClick={() => {
                if (newJourneyPost.trim()) {
                  onShareToCommunity(newJourneyPost);
                  setNewJourneyPost('');
                }
              }}
              disabled={!newJourneyPost.trim()}
              className="flex-1 bg-stone-800 text-white py-2.5 rounded-xl hover:bg-stone-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              Share to Community
            </button>
          </div>
        </div>
      </div>

      {/* Your Journey Posts */}
      {userJourneyPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-light text-stone-800">Your Journey Posts</h3>
          {userJourneyPosts.slice(0, 5).map((post) => (
            <div key={post.id} className="bg-white p-5 rounded-2xl border-2 border-amber-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">Your Journey</p>
                    <p className="text-xs text-stone-400">{formatTime(post.timestamp)}</p>
                  </div>
                </div>
              </div>
              <p className="text-stone-700 mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-stone-500">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 ${likedPosts.includes(post.id) ? 'text-red-500' : 'hover:text-stone-700'}`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                  {post.likes || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspiration Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-light text-stone-800">Today's Inspiration</h3>
        
        <div className="grid gap-4">
          {inspirationContent.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="bg-white p-5 rounded-2xl border-2 border-stone-100 hover:border-amber-200 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${item.type === 'quote' ? 'bg-blue-50' : item.type === 'tip' ? 'bg-green-50' : 'bg-purple-50'}`}>
                      <Icon className={`w-4 h-4 ${item.type === 'quote' ? 'text-blue-600' : item.type === 'tip' ? 'text-green-600' : 'text-purple-600'}`} />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-stone-100 text-stone-700 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`p-1 ${likedPosts.includes(item.id) ? 'text-red-500' : 'text-stone-400 hover:text-stone-600'}`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts.includes(item.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                {item.type === 'blog' ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-stone-800">{item.title}</h4>
                    <p className="text-sm text-stone-600">{item.content}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-stone-400">{item.readTime}</span>
                      <span className="text-xs text-stone-500">{item.likes} likes</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-stone-700">{item.content}</p>
                    {item.author && (
                      <p className="text-sm text-stone-500">— {item.author}</p>
                    )}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-stone-400 capitalize">{item.type}</span>
                      <span className="text-xs text-stone-500">{item.likes} likes</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Journeys */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-light text-stone-800">Community Journeys</h3>
          <span className="text-xs text-stone-500">{journeyPosts.length} posts</span>
        </div>
        
        {journeyPosts.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-2xl border-2 border-stone-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-stone-700">{post.user.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">{post.user}</p>
                  <p className="text-xs text-stone-400">{post.timestamp}</p>
                </div>
              </div>
            </div>
            <p className="text-stone-700 mb-3">{post.content}</p>
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <button className="flex items-center gap-1 hover:text-stone-700">
                <Heart className="w-4 h-4" />
                {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-stone-700">
                <Sparkles className="w-4 h-4" />
                Inspired
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspirationFeed;