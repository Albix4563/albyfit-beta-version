import { useMemo, useState, useEffect } from 'react';
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
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { Workout } from '@/hooks/useSupabaseAuth';
import { useMotionPresets } from '@/contexts/MotionContext';

const generateBackgroundParticles = (count: number) =>
  Array.from({ length: count }).map((_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 4 + Math.random() * 2,
    delay: Math.random() * 2
  }));

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const { user, signOut, loading } = useSupabaseAuth();
  const { isRunning, start, stop } = useTimer();
  const { floatTransition, shouldReduceMotion } = useMotionPresets();
  
  const {
    hasNewChangelog,
    showNotificationPrompt,
    markChangelogAsSeen,
    handleNotificationRequest,
    dismissNotificationPrompt,
    dismissNotification,
    latestVersion
  } = useChangelogNotifications();

  const backgroundParticles = useMemo(() => (
    shouldReduceMotion ? [] : generateBackgroundParticles(8)
  ), [shouldReduceMotion]);

  const floatingOrbs = useMemo(() => ([
    {
      className: "absolute top-1/4 left-1/4 w-48 h-48 rounded-full blur-3xl",
      background: "linear-gradient(120deg, rgba(59,130,246,0.12), rgba(147,51,234,0.10))",
      animate: { x: [0, 40, 0], y: [0, -18, 0], scale: [1, 1.05, 1] },
      transition: { ...floatTransition, duration: 9 }
    },
    {
      className: "absolute bottom-1/4 right-1/4 w-36 h-36 rounded-full blur-4xl",
      background: "linear-gradient(140deg, rgba(236,72,153,0.10), rgba(251,191,36,0.08))",
      animate: { x: [0, -32, 0], y: [0, 20, 0], scale: [1.05, 1, 1.05] },
      transition: { ...floatTransition, duration: 7, delay: 1.2 }
    }
  ]), [floatTransition]);
  
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
    start();
    handleTabChange('timer');
  };

  const handleCompleteWorkout = () => {
    setActiveWorkout(null);
    stop();
    handleTabChange('dashboard');
  };

  const workoutForTimer = activeWorkout ? {
    id: activeWorkout.id,
    name: activeWorkout.title,
    exercises: (activeWorkout.exercises || []).map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      sets: exercise.sets || [],
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
        <LiquidGlass size="lg" intensity="heavy" accentTone="cool">
          <motion.div
            className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: shouldReduceMotion ? 0.4 : 1, repeat: Infinity, ease: "linear" }}
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              background: "rgba(255, 255, 255, 0.18)",
              mixBlendMode: "screen"
            }}
            animate={{
              y: [0, -42, 0],
              opacity: [0, 0.45, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingOrbs.map((orb, index) => (
          <motion.div
            key={index}
            className={orb.className}
            style={{ background: orb.background, mixBlendMode: "screen" }}
            animate={orb.animate}
            transition={orb.transition}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 pb-40 relative z-10">
        <header className="py-6">
          <LiquidGlass intensity="heavy" size="lg" variant="card" accentTone="cool">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.img
                  src="/lovable-uploads/8281de93-96f3-4e5c-938a-020cbe3e553d.png"
                  alt="Albyfit Logo"
                  className="w-16 h-16 object-contain"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.03, rotate: 1.5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <div>
                  <motion.h1
                    className="text-3xl font-poppins font-bold text-white"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 24 }}
                  >
                    Albyfit
                  </motion.h1>
                  <motion.p
                    className="text-sm text-slate-200"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 24 }}
                  >
                    Ciao, {user.user_metadata?.full_name || user.email}!
                  </motion.p>
                  <motion.div
                    className="flex items-center gap-2 mt-1"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 24 }}
                  >
                    <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full font-bold shadow-lg">
                      v0.9.5 [FINAL CANDIDATE RELEASE]
                    </span>
                    <span className="text-xs text-slate-400">
                      - Created by Albix4563
                    </span>
                  </motion.div>
                </div>
              </div>
              <motion.button
                onClick={signOut}
                className="text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 border border-transparent hover:border-white/20"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              >
                Esci
              </motion.button>
            </div>
          </LiquidGlass>
        </header>

        <main className="relative">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 1.01 }}
            transition={{
              type: shouldReduceMotion ? "tween" : "spring",
              stiffness: 280,
              damping: 24,
              duration: shouldReduceMotion ? 0.25 : 0.4
            }}
            className="min-h-[60vh]"
          >
            <div className="text-white">
              {renderContent()}
            </div>
          </motion.div>
        </main>
      </div>

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