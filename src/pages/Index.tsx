import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import WorkoutManager from '@/components/WorkoutManager';
import WorkoutTimer from '@/components/WorkoutTimer';
import ExerciseWiki from '@/components/ExerciseWiki';
import Profile from '@/components/Profile';
import ChangelogGrouped from '@/components/ChangelogGrouped';
import ChangelogNotification from '@/components/ChangelogNotification';
import SupabaseAuthForm from '@/components/SupabaseAuthForm';
import { AuthProvider, useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useChangelogNotifications } from '@/hooks/useChangelogNotifications';
import { TimerProvider, useTimer } from '@/contexts/TimerContext';
import type { Workout } from '@/hooks/useSupabaseAuth';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [animationClass, setAnimationClass] = useState('animate-watery-in');
  const { user, signOut, loading } = useSupabaseAuth();
  const { isRunning, start, stop } = useTimer();
  
  const {
    hasNewChangelog,
    showNotificationPrompt,
    markChangelogAsSeen,
    handleNotificationRequest,
    dismissNotificationPrompt,
    dismissNotification,
    latestVersion
  } = useChangelogNotifications();

  // Redirect from timer tab if timer is not running
  useEffect(() => {
    if (activeTab === 'timer' && !isRunning) {
      setActiveTab('dashboard');
    }
  }, [activeTab, isRunning]);

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;

    setAnimationClass('animate-watery-out');

    setTimeout(() => {
      setActiveTab(newTab);
      setAnimationClass('animate-watery-in');
    }, 300); // Match out animation duration
  };

  const handleStartWorkout = (workout?: Workout) => {
    if (workout) {
      setActiveWorkout(workout);
    }
    start(); // Show Timer tab
    handleTabChange('timer');
  };

  const handleCompleteWorkout = () => {
    setActiveWorkout(null);
    stop(); // Hide Timer tab
    handleTabChange('dashboard');
  };

  // Create a workout object compatible with WorkoutTimer
  const workoutForTimer = activeWorkout ? {
    id: activeWorkout.id,
    name: activeWorkout.title, // Map title to name for WorkoutTimer compatibility
    exercises: (activeWorkout.exercises || []).map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      sets: exercise.sets || [], // Use sets array
      rest_time: exercise.rest_time,
      notes: exercise.notes
    }))
  } : undefined;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onStartWorkout={handleStartWorkout} onTabChange={handleTabChange} />;
      case 'workouts':
        return <WorkoutManager onStartWorkout={handleStartWorkout} />;
      case 'timer':
        return isRunning ? <WorkoutTimer onComplete={handleCompleteWorkout} workout={workoutForTimer} /> : null;
      case 'wiki':
        return <ExerciseWiki />;
      case 'changelog':
        return <ChangelogGrouped />;
      case 'profile':
        return <Profile onTabChange={handleTabChange} />;
      default:
        return <Dashboard onStartWorkout={handleStartWorkout} onTabChange={handleTabChange} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <SupabaseAuthForm />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pb-20">
        <header className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/8281de93-96f3-4e5c-938a-020cbe3e553d.png" 
                alt="Albyfit Logo" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-3xl font-poppins font-bold text-white">Albyfit</h1>
                <p className="text-sm text-slate-400">Ciao, {user.user_metadata?.full_name || user.email}!</p>
                <p className="text-xs text-slate-500">v0.8.0 [BETA] - Created by Albix4563</p>
              </div>
            </div>
            <button 
              onClick={signOut}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Esci
            </button>
          </div>
        </header>

        <main className={animationClass}>
          {renderContent()}
        </main>
      </div>

      {/* Changelog Notification */}
      <ChangelogNotification
        isVisible={hasNewChangelog}
        onViewChangelog={() => {
          handleTabChange('changelog');
          markChangelogAsSeen();
        }}
        onEnableNotifications={handleNotificationRequest}
        onDismiss={dismissNotification}
        latestVersion={latestVersion}
        showNotificationPrompt={showNotificationPrompt}
      />

      <Navigation activeTab={activeTab} onTabChange={handleTabChange} hasNewChangelog={hasNewChangelog} />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <TimerProvider>
        <AppContent />
      </TimerProvider>
    </AuthProvider>
  );
};

export default Index;