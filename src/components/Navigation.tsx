import React from 'react';
import { Home, Dumbbell, Timer, FileText, User } from 'lucide-react';
import { useTimer } from '@/contexts/TimerContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasNewChangelog?: boolean;
}

// Varianti per animazioni ultra-fluide
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
      mass: 0.8,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 15
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 400,
      mass: 0.6
    }
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 500,
      mass: 0.5
    }
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
      ease: "easeInOut"
    }
  }
};

const iconVariants: Variants = {
  idle: {
    rotate: 0,
    scale: 1
  },
  hover: {
    rotate: [0, -3, 3, 0],
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  },
  active: {
    rotate: 0,
    scale: 1.15,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 400
    }
  }
};

const textVariants: Variants = {
  idle: {
    y: 0,
    opacity: 0.85
  },
  hover: {
    y: -1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 400
    }
  },
  active: {
    y: 0,
    opacity: 1,
    scale: 1.02,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
};

const activeBackgroundVariants: Variants = {
  inactive: {
    opacity: 0,
    scale: 0.8,
    rotate: -5
  },
  active: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 400,
      mass: 0.8
    }
  }
};

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, hasNewChangelog }) => {
  const { isRunning } = useTimer();
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    onTabChange(tabId);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 p-3 z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-md">
        <LiquidGlass 
          intensity="mobile-nav" 
          variant="surface"
          className="p-2 rounded-3xl"
          animated={!shouldReduceMotion}
        >
          <motion.div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
          >
            <AnimatePresence mode="popLayout">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  layout
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: -15,
                    transition: { duration: 0.2, ease: "easeInOut" }
                  }}
                  whileHover={!shouldReduceMotion ? "hover" : undefined}
                  whileTap={!shouldReduceMotion ? "tap" : undefined}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    relative overflow-hidden rounded-xl p-3 transition-all duration-300 group cursor-pointer
                    ${activeTab === tab.id 
                      ? 'bg-white/25 border border-white/30 shadow-lg shadow-black/15' 
                      : 'hover:bg-white/15 border border-transparent hover:border-white/20'
                    }
                  `}
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    willChange: "transform, opacity"
                  }}
                >
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <div className="relative">
                      <motion.div
                        variants={iconVariants}
                        initial="idle"
                        animate={activeTab === tab.id ? "active" : "idle"}
                        whileHover={!shouldReduceMotion ? "hover" : undefined}
                      >
                        <tab.icon className={`h-5 w-5 transition-colors duration-300 ${
                          activeTab === tab.id 
                            ? 'text-white stroke-[2px] drop-shadow-sm' 
                            : 'text-white/85 group-hover:text-white stroke-[1.5px]'
                        }`} />
                      </motion.div>
                      
                      {/* Changelog notification con animazione */}
                      {tab.id === 'changelog' && hasNewChangelog && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full border border-white/60"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                      
                      {/* Timer pulse effect migliorato */}
                      {tab.id === 'timer' && activeTab === tab.id && (
                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-full"
                          animate={{ 
                            scale: [1, 1.4, 1], 
                            opacity: [0.4, 0, 0.4] 
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>
                    
                    <motion.span 
                      variants={textVariants}
                      initial="idle"
                      animate={activeTab === tab.id ? "active" : "idle"}
                      whileHover={!shouldReduceMotion ? "hover" : undefined}
                      className={`text-xs font-medium transition-all duration-300 ${
                        activeTab === tab.id 
                          ? 'text-white drop-shadow-sm font-semibold' 
                          : 'text-white/85 group-hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </motion.span>
                  </div>
                  
                  {/* Active state background con animazione fluida */}
                  <AnimatePresence>
                    {activeTab === tab.id && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-white/15"
                          layoutId="activeTab"
                          variants={activeBackgroundVariants}
                          initial="inactive"
                          animate="active"
                          exit="inactive"
                        />
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/8 to-transparent"
                          layoutId="activeTabHighlight"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { 
                              type: "spring", 
                              damping: 25, 
                              stiffness: 400,
                              delay: 0.1
                            }
                          }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        />
                      </>
                    )}
                  </AnimatePresence>
                  
                  {/* Shimmer effect ultra-fluido */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={!shouldReduceMotion ? {
                      x: '100%',
                      opacity: [0, 1, 0],
                      transition: { 
                        duration: 0.8, 
                        ease: "easeInOut"
                      }
                    } : undefined}
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </LiquidGlass>
      </div>
    </motion.div>
  );
};

export default Navigation;