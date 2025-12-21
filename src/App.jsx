import React, { useState, useEffect } from 'react';
import AuthView from './components/auth/AuthView';
import Header from './components/shared/Header';
import DailyCheckIn from './components/dashboard/DailyCheckIn';
import QuickActions from './components/dashboard/QuickActions';
import GuidedPaths from './components/paths/GuidedPaths';
import PathDetail from './components/paths/PathDetail';
import AnonymousCommunity from './components/community/AnonymousChat';
import ProfileView from './components/profile/ProfileView';
import InspirationFeed from './components/feed/InspirationFeed';
import MoodCalendar from './components/mood/MoodCalendar';
import DailyJournal from './components/journal/DailyJournal';
import HabitTracker from './components/habits/HabitTracker';
import BreathingExercise from './components/wellness/BreathingExercise';
import { storage, getAnonymousName, generateAnonymousId } from './utils/storage';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    const currentUser = storage.get('imara_current_user');
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    storage.remove('imara_current_user');
    setUser(null);
    setView('home');
  };

  const hasCheckedInToday = () => {
    if (!user) return false;
    const today = new Date().toISOString().split('T')[0];
    const checkins = storage.get('imara_checkins') || {};
    return checkins[user.email]?.[today] !== undefined;
  };

  const handleShareToCommunity = (content) => {
    const post = {
      id: 'post_' + Date.now(),
      content: content,
      author: getAnonymousName(),
      authorId: generateAnonymousId(),
      timestamp: new Date().toISOString(),
      replies: [],
      type: 'journey'
    };

    const communityPosts = storage.get('imara_community_posts') || [];
    const updatedPosts = [post, ...communityPosts];
    storage.set('imara_community_posts', updatedPosts);
    
    // Switch to community view
    setView('community');
  };

  if (!user) {
    return <AuthView onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <Header 
        user={user} 
        currentView={view} 
        onNavigate={setView} 
        onLogout={handleLogout} 
      />

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
          {view === 'home' && !hasCheckedInToday() && (
            <DailyCheckIn onComplete={() => setView('home')} />
          )}

          {view === 'home' && hasCheckedInToday() && (
            <QuickActions onNavigate={setView} />
          )}

          {view === 'feed' && (
            <InspirationFeed onShareToCommunity={handleShareToCommunity} />
          )}

          {view === 'paths' && !selectedPath && (
            <GuidedPaths onSelectPath={(path) => setSelectedPath(path)} />
          )}

          {view === 'paths' && selectedPath && (
            <PathDetail
              path={selectedPath}
              onBack={() => setSelectedPath(null)}
              onComplete={() => {
                setSelectedPath(null);
                setView('home');
              }}
            />
          )}

          {view === 'community' && <AnonymousCommunity />}

          {view === 'profile' && <ProfileView />}

          {/* New Features */}
          {view === 'mood' && <MoodCalendar />}
          {view === 'journal' && <DailyJournal />}
          {view === 'habits' && <HabitTracker />}
          {view === 'wellness' && <BreathingExercise />}
        </div>

        <div className="text-center text-xs text-stone-400 space-y-1 mt-6">
          <p>You are not behind. You are here.</p>
          <p>That is what matters.</p>
        </div>
      </div>
    </div>
  );
}