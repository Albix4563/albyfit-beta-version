
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';

interface PushNotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  isRequesting: boolean;
  serviceWorkerReady: boolean;
}

export const usePushNotifications = () => {
  const { user } = useSupabaseAuth();
  const [state, setState] = useState<PushNotificationState>({
    permission: 'default',
    isSupported: false,
    isRequesting: false,
    serviceWorkerReady: false
  });

  useEffect(() => {
    // Verifica supporto notifiche e service worker
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    const permission = isSupported ? Notification.permission : 'denied';

    setState(prev => ({
      ...prev,
      isSupported,
      permission
    }));

    // Verifica se service worker è pronto
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setState(prev => ({ ...prev, serviceWorkerReady: true }));
      });
    }
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

  const sendLocalNotification = (title: string, options?: NotificationOptions) => {
    if (state.permission !== 'granted' || !state.isSupported) {
      console.log('Notifiche non autorizzate o non supportate');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
        badge: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
        requireInteraction: true,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Errore nell\'invio della notifica:', error);
    }
  };

  const sendChangelogNotification = (version: string) => {
    return sendLocalNotification('🚀 Nuovo aggiornamento Albyfit!', {
      body: `Scopri le novità della versione ${version}. Tocca per visualizzare il changelog.`,
      tag: 'changelog-update',
      data: {
        url: '/?tab=changelog',
        version
      }
    });
  };

  const sendGlobalPushNotification = async (title: string, body: string, data?: any) => {
    if (!state.serviceWorkerReady || !('serviceWorker' in navigator)) {
      console.error('Service Worker non pronto');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Invia messaggio al service worker per mostrare notifica
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SEND_GLOBAL_NOTIFICATION',
          title,
          body,
          data
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Errore invio notifica push:', error);
      return false;
    }
  };

  return {
    ...state,
    requestPermission,
    sendLocalNotification,
    sendChangelogNotification,
    sendGlobalPushNotification
  };
};
