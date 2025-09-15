
import { useState, useEffect } from 'react';

interface NotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  isRequesting: boolean;
}

export const useNotifications = () => {
  const [state, setState] = useState<NotificationState>({
    permission: 'default',
    isSupported: false,
    isRequesting: false
  });

  useEffect(() => {
    // Verifica se le notifiche sono supportate
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    const permission = isSupported ? Notification.permission : 'denied';

    setState(prev => ({
      ...prev,
      isSupported,
      permission
    }));
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!state.isSupported) {
      return 'denied';
    }

    setState(prev => ({ ...prev, isRequesting: true }));

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({
        ...prev,
        permission,
        isRequesting: false
      }));
      return permission;
    } catch (error) {
      console.error('Errore nella richiesta di permessi notifiche:', error);
      setState(prev => ({ ...prev, isRequesting: false }));
      return 'denied';
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (state.permission !== 'granted' || !state.isSupported) {
      return;
    }

    try {
      new Notification(title, {
        icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
        badge: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
        ...options
      });
    } catch (error) {
      console.error('Errore nell\'invio della notifica:', error);
    }
  };

  const sendChangelogNotification = (version: string) => {
    sendNotification('Albyfit - Nuovi Aggiornamenti! 🎉', {
      body: `Scopri le novità della versione ${version}. Tocca per visualizzare i dettagli.`,
      tag: 'changelog-update',
      requireInteraction: true
      // Removed 'actions' property as it's not supported in standard NotificationOptions
    });
  };

  return {
    ...state,
    requestPermission,
    sendNotification,
    sendChangelogNotification
  };
};
