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
          intensity="mobile-nav" 
          variant="surface"
          className="p-3 rounded-3xl"
          animated={false}
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
                    relative overflow-hidden rounded-2xl p-4 transition-all duration-200 group
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-br from-blue-600/90 via-blue-700/95 to-blue-800/90 border-2 border-white/70 shadow-[0_0_30px_rgba(59,130,246,0.9)] ring-2 ring-white/80 backdrop-blur-sm' 
                      : 'hover:bg-white/20 border-2 border-transparent hover:border-white/30 backdrop-blur-sm'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1.5 relative z-10"
                  >
                    <div className="relative">
                      <tab.icon className={`h-6 w-6 transition-colors duration-200 ${
                        activeTab === tab.id 
                          ? 'text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] filter brightness-125 stroke-[2.5px]' 
                          : 'text-white/90 group-hover:text-white stroke-[2px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]'
                      }`} />
                      
                      {/* Changelog notification */}
                      {tab.id === 'changelog' && hasNewChangelog && (
                        <motion.div
                          className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-lg"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      {/* Timer pulse effect */}
                      {tab.id === 'timer' && activeTab === tab.id && (
                        <motion.div
                          className="absolute inset-0 bg-white/40 rounded-full"
                          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    <span className={`text-xs font-semibold transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] filter brightness-125 font-bold tracking-wide' 
                        : 'text-white/90 group-hover:text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] font-medium'
                    }`}>
                      {tab.label}
                    </span>
                  </motion.div>
                  
                  {/* Enhanced active state background */}
                  {activeTab === tab.id && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/80 via-blue-700/90 to-blue-800/80"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/20 blur-sm"
                        layoutId="activeTabGlow"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-500/30 to-transparent"
                        layoutId="activeTabHighlight"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    </>
                  )}
                  
                  {/* Enhanced shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
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