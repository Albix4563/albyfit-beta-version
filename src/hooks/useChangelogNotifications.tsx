
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { usePushNotifications } from './usePushNotifications';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
}

// Updated changelog entries with v0.9.3 [RELEASE CANDIDATE] as latest
const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "0.9.3 [RELEASE CANDIDATE]",
    date: "6 Ottobre 2025",
    type: "major"
  },
  {
    version: "0.9.2 [BETA]",
    date: "30 Settembre 2025",
    type: "major"
  },
];

export const useChangelogNotifications = () => {
  const { user } = useSupabaseAuth();
  const { 
    permission, 
    requestPermission, 
    sendChangelogNotification, 
    isSupported 
  } = usePushNotifications();
  
  const [hasNewChangelog, setHasNewChangelog] = useState(false);
  const [lastSeenVersion, setLastSeenVersion] = useState<string | null>(null);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Recupera l'ultima versione vista dall'utente da localStorage
    const userKey = `changelog_last_seen_${user.id}`;
    const lastSeen = localStorage.getItem(userKey);
    setLastSeenVersion(lastSeen);

    // Verifica se ci sono nuovi changelog
    const latestVersion = CHANGELOG_ENTRIES[0]?.version;
    const hasNew = !lastSeen || lastSeen !== latestVersion;
    setHasNewChangelog(hasNew);

    // SOLO se ci sono VERE novità E questa è la prima volta che vediamo questo utente con questa versione
    if (hasNew && latestVersion && lastSeen !== latestVersion) {
      // Controlla se abbiamo già mostrato notifica per questa combinazione user+version
      const notificationShownKey = `notification_shown_${user.id}_${latestVersion}`;
      const notificationAlreadyShown = localStorage.getItem(notificationShownKey);
      
      // Se non abbiamo mai mostrato la notifica per questa versione a questo utente
      if (!notificationAlreadyShown) {
        // Segna subito come mostrata per evitare loop
        localStorage.setItem(notificationShownKey, 'true');
        
        // Se le notifiche non sono state richieste, mostra il prompt
        if (isSupported && permission === 'default') {
          setShowNotificationPrompt(true);
        }
        
        // Se le notifiche sono autorizzate, invia notifica push
        if (permission === 'granted') {
          sendChangelogNotification(latestVersion);
        }
      }
    }
  }, [user, permission, isSupported, sendChangelogNotification]);

  const markChangelogAsSeen = () => {
    if (!user) return;

    const latestVersion = CHANGELOG_ENTRIES[0]?.version;
    if (latestVersion) {
      const userKey = `changelog_last_seen_${user.id}`;
      localStorage.setItem(userKey, latestVersion);
      setLastSeenVersion(latestVersion);
      setHasNewChangelog(false);
    }
  };

  const dismissNotification = () => {
    // Chiude la notifica e la marca come vista senza aprire il changelog
    markChangelogAsSeen();
    setShowNotificationPrompt(false);
  };

  const handleNotificationRequest = async () => {
    const granted = await requestPermission();
    setShowNotificationPrompt(false);
    
    if (granted === 'granted' && hasNewChangelog) {
      const latestVersion = CHANGELOG_ENTRIES[0]?.version;
      if (latestVersion && user) {
        sendChangelogNotification(latestVersion);
        // Segna la notifica come inviata per questa versione+utente
        const notificationSentKey = `notification_sent_${user.id}_${latestVersion}`;
        localStorage.setItem(notificationSentKey, 'true');
      }
    }
  };

  const dismissNotificationPrompt = () => {
    setShowNotificationPrompt(false);
  };

  return {
    hasNewChangelog,
    lastSeenVersion,
    showNotificationPrompt,
    markChangelogAsSeen,
    handleNotificationRequest,
    dismissNotificationPrompt,
    dismissNotification, // Nuova funzione per chiudere completamente la notifica
    latestVersion: CHANGELOG_ENTRIES[0]?.version || null,
    notificationPermission: permission,
    notificationSupported: isSupported
  };
};