import React from 'react';
import { Home, Dumbbell, Timer, FileText, User } from 'lucide-react';
import { useTimer } from '@/contexts/TimerContext';

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
    <nav className="fixed bottom-0 left-0 right-0 nav-background backdrop-blur-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'text-primary bg-primary/10' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <tab.icon className="w-5 h-5 mb-1" />
                {tab.id === 'changelog' && hasNewChangelog && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-900 animate-pulse"></div>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;