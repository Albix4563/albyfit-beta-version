
import React from 'react';
import { Bell, X, BookOpen } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface ChangelogNotificationProps {
  isVisible: boolean;
  onViewChangelog: () => void;
  onEnableNotifications: () => void;
  onDismiss: () => void;
  latestVersion: string | null;
  showNotificationPrompt: boolean;
}

const ChangelogNotification: React.FC<ChangelogNotificationProps> = ({
  isVisible,
  onViewChangelog,
  onEnableNotifications,
  onDismiss,
  latestVersion,
  showNotificationPrompt
}) => {
  if (!isVisible) return null;

  const handleClose = () => {
    // Chiamiamo onViewChangelog senza aprire il changelog per marcare come visto
    onDismiss();
  };

  return (
    <div className="fixed top-4 right-4 left-4 z-50 max-w-sm mx-auto">
      <LiquidGlass
        intensity="heavy"
        variant="card"
        size="md"
        className="border border-primary/30 shadow-2xl animate-in slide-in-from-top-4"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 primary-gradient rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">🚀 Nuovi Aggiornamenti!</h3>
              <p className="text-sm text-slate-400">Versione {latestVersion}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 mb-4">
          Scopri le nuove funzionalità e miglioramenti introdotti nell'ultima versione di Albyfit.
          {showNotificationPrompt && ' Abilita le notifiche push per rimanere aggiornato sui futuri rilasci!'}
        </p>

        <div className="space-y-3">
          <button
            onClick={onViewChangelog}
            className="w-full primary-gradient text-white font-medium py-2.5 rounded-xl hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Visualizza Changelog</span>
          </button>

          {showNotificationPrompt && (
            <button
              onClick={onEnableNotifications}
              className="w-full border border-slate-600 text-slate-300 font-medium py-2.5 rounded-xl hover:bg-slate-700/30 transition-colors flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span>Abilita Notifiche Push</span>
            </button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Sistema di notifiche push per PWA e browser • Created by Albix4563
          </p>
        </div>
      </LiquidGlass>
    </div>
  );
};

export default ChangelogNotification;
