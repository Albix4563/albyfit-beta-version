import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type TimerContextValue = {
  isRunning: boolean;
  start: () => void;
  stop: () => void;
};

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);

  // Persist timer state across page refreshes
  useEffect(() => {
    const saved = sessionStorage.getItem('albyfit.timerRunning');
    if (saved === 'true') {
      setIsRunning(true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('albyfit.timerRunning', isRunning ? 'true' : 'false');
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const value = useMemo(() => ({ isRunning, start, stop }), [isRunning]);

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return ctx;
};