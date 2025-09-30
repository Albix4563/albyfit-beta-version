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

  const handleTabClick = (tabId: string) => {
    console.log('Tab clicked:', tabId); // Debug log
    onTabChange(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="mx-auto max-w-md">
        <LiquidGlass 
          intensity="heavy" 
          variant="surface"
          className="p-2"
        >
          <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
          >
            <AnimatePresence mode="popLayout">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    delay: index * 0.03
                  }}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    relative overflow-hidden rounded-xl p-3 transition-all duration-200 group
                    ${activeTab === tab.id 
                      ? 'bg-blue-800 border-2 border-blue-100 shadow-2xl shadow-blue-400/90 ring-1 ring-white/80' 
                      : 'hover:bg-slate-700/60 border border-transparent hover:border-slate-600/50'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="relative">
                      <tab.icon className={`h-5 w-5 transition-colors duration-200 ${
                        activeTab === tab.id 
                          ? 'text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                          : 'text-slate-300 group-hover:text-white'
                      }`} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                      
                      {/* Changelog notification */}
                      {tab.id === 'changelog' && hasNewChangelog && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      {/* Timer pulse effect */}
                      {tab.id === 'timer' && activeTab === tab.id && (
                        <motion.div
                          className="absolute inset-0 bg-white/40 rounded-full"
                          animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    <span className={`text-xs transition-colors duration-200 ${
                      activeTab === tab.id 
                        ? 'text-white font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                        : 'text-slate-300 group-hover:text-white font-medium'
                    }`}>
                      {tab.label}
                    </span>
                  </motion.div>
                  
                  {/* Enhanced active state background */}
                  {activeTab === tab.id && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-900/60 to-blue-700/60"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-white/20 blur-sm"
                        layoutId="activeTabGlow"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    </>
                  )}
                  
                  {/* Enhanced shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
};

export default Navigation;