import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
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
import Reminders from './components/reminders/Reminders';
import ThemeSwitcher from './components/theme/ThemeSwitcher';
import Achievements from './components/achievements/Achievements';
import SelfCarePlanner from './components/selfcare/SelfCarePlanner';
import CommunityChallenges from './components/community/CommunityChallenges';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [view, setView] = useState('home');
  const [selectedPath, setSelectedPath] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <Header 
        user={user} 
        currentView={view} 
        onNavigate={setView} 
      />
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
          {view === 'home' && (
            <QuickActions onNavigate={setView} />
          )}
          {view === 'checkin' && (
            <DailyCheckIn onComplete={() => setView('home')} />
          )}
          {view === 'feed' && (
            <InspirationFeed />
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
          {view === 'mood' && <MoodCalendar />}
          {view === 'journal' && <DailyJournal />}
          {view === 'habits' && <HabitTracker />}
          {view === 'wellness' && <BreathingExercise />}
          {view === 'reminders' && <Reminders />}
          {view === 'theme' && <ThemeSwitcher />}
          {view === 'achievements' && <Achievements />}
          {view === 'selfcare' && <SelfCarePlanner />}
          {view === 'challenges' && <CommunityChallenges />}
        </div>
        <div className="text-center text-xs text-stone-400 space-y-1 mt-6">
          <p>You are not behind. You are here.</p>
          <p>That is what matters.</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}