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
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { Workout } from '@/hooks/useSupabaseAuth';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
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
    setActiveTab(newTab);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20">
        <LiquidGlass className="p-8 text-center">
          <motion.div
            className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white font-medium">Caricamento...</p>
        </LiquidGlass>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20">
        <SupabaseAuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 pb-20 relative z-10">
        <header className="py-6">
          <LiquidGlass className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.img 
                  src="/lovable-uploads/8281de93-96f3-4e5c-938a-020cbe3e553d.png" 
                  alt="Albyfit Logo" 
                  className="w-16 h-16 object-contain"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <div>
                  <motion.h1 
                    className="text-3xl font-poppins font-bold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Albyfit
                  </motion.h1>
                  <motion.p 
                    className="text-sm text-slate-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Ciao, {user.user_metadata?.full_name || user.email}!
                  </motion.p>
                  <motion.p 
                    className="text-xs text-slate-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    v0.8.0 [BETA] - Created by Albix4563
                  </motion.p>
                </div>
              </div>
              <motion.button 
                onClick={signOut}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Esci
              </motion.button>
            </div>
          </LiquidGlass>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, scale: 1.05, filter: "blur(10px)" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.5 
              }}
              className="min-h-[60vh]"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
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

      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        hasNewChangelog={hasNewChangelog} 
      />
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