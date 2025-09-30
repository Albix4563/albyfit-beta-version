import React from 'react';
import { Home, Dumbbell, Timer, FileText, User } from 'lucide-react';
import { useTimer } from '@/contexts/TimerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasNewChangelog?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, hasNewChangelog }) => {
  const { isRunning } = useTimer();

  // Base tabs without Timer
  const baseTabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'workouts', label: 'Allenamenti', icon: Dumbbell },
    { id: 'changelog', label: 'Changelog', icon: FileText },
    { id: 'profile', label: 'Profilo', icon: User },
  ];

  // Add Timer tab only when running
  const tabs = isRunning
    ? [
        ...baseTabs.slice(0, 2), // Home, Allenamenti
        { id: 'timer', label: 'Timer', icon: Timer },
        ...baseTabs.slice(2) // Changelog, Profilo
      ]
    : baseTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="mx-auto max-w-md">
        <LiquidGlass 
          intensity="heavy" 
          variant="surface"
          className="p-3"
        >
          <div 
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
          >
            <AnimatePresence mode="popLayout">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    delay: index * 0.05
                  }}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    relative overflow-hidden rounded-xl p-3 transition-all duration-300 group
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-xl border border-white/40 shadow-lg shadow-blue-500/20' 
                      : 'hover:bg-white/10 border border-transparent'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="relative">
                      <tab.icon className={`h-5 w-5 transition-colors duration-300 ${
                        activeTab === tab.id 
                          ? 'text-white drop-shadow-sm' 
                          : 'text-slate-400 group-hover:text-blue-300'
                      }`} />
                      
                      {/* Changelog notification */}
                      {tab.id === 'changelog' && hasNewChangelog && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-900"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      {/* Timer pulse effect */}
                      {tab.id === 'timer' && activeTab === tab.id && (
                        <motion.div
                          className="absolute inset-0 bg-blue-400/30 rounded-full"
                          animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    <span className={`text-xs font-medium transition-colors duration-300 ${
                      activeTab === tab.id 
                        ? 'text-white drop-shadow-sm' 
                        : 'text-slate-400 group-hover:text-blue-300'
                    }`}>
                      {tab.label}
                    </span>
                  </motion.div>
                  
                  {/* Liquid selection indicator */}
                  <AnimatePresence>
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Navigation background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl opacity-50 animate-liquid-pulse" />
        </LiquidGlass>
      </div>
    </div>
  );
};

export default Navigation;