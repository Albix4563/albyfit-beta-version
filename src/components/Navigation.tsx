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
    <div className="fixed bottom-0 left-0 right-0 p-3 z-50">
      <div className="mx-auto max-w-md">
        <LiquidGlass 
          intensity="mobile-nav" 
          variant="surface"
          className="p-2 rounded-3xl"
          animated={false}
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
                      ? 'bg-white/25 border border-white/30 shadow-lg shadow-black/15' 
                      : 'hover:bg-white/15 border border-transparent hover:border-white/20'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center gap-1 relative z-10"
                  >
                    <div className="relative">
                      <tab.icon className={`h-5 w-5 transition-colors duration-200 ${
                        activeTab === tab.id 
                          ? 'text-white stroke-[2px] drop-shadow-sm' 
                          : 'text-white/85 group-hover:text-white stroke-[1.5px]'
                      }`} />
                      
                      {/* Changelog notification - più definita */}
                      {tab.id === 'changelog' && hasNewChangelog && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border border-white/60"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      {/* Timer pulse effect - più visibile */}
                      {tab.id === 'timer' && activeTab === tab.id && (
                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-full"
                          animate={{ scale: [1, 1.2], opacity: [0.4, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    <span className={`text-xs font-medium transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'text-white drop-shadow-sm font-semibold' 
                        : 'text-white/85 group-hover:text-white'
                    }`}>
                      {tab.label}
                    </span>
                  </motion.div>
                  
                  {/* Active state background - più definito */}
                  {activeTab === tab.id && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-white/15"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/8 to-transparent"
                        layoutId="activeTabHighlight"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    </>
                  )}
                  
                  {/* Shimmer effect più visibile */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
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