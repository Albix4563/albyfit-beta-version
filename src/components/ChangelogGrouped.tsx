import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Gift, Star, Bug, Bell, Rocket, Wrench, Zap, BarChart3, Dumbbell, Palette, Link } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: Change[];
}

type ChangeType = 'feature' | 'improvement' | 'fix';

interface Change {
  type: ChangeType;
  description: string;
}

const CHANGELOG_ENTRIES = [  {
    version: "0.8.0 [BETA]",
    date: "16 Giugno 2025", 
    type: "major" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Validazione nomi esercizi: supporto per spazi, virgole, trattini, numeri e caratteri speciali"
      },
      {
        type: "feature" as const,
        description: "Calcoli matematici nei campi peso: inserisci espressioni come '10+5', '20*2', '50/2' per calcolo automatico"
      },
      {
        type: "feature" as const,
        description: "Modifica pesi durante allenamento: clicca sui pesi per modificarli in tempo reale con calcoli matematici"
      },
      {
        type: "feature" as const,
        description: "Duplicazione rapida: pulsante per duplicare esercizi simili con un click"
      },
      {
        type: "feature" as const,
        description: "Sistema notifiche nativo: eliminazione completa di alert() e confirm() nativi del browser"
      },
      {
        type: "feature" as const,
        description: "Toast system integrato: notifiche eleganti e consistenti con il design dell'app"
      },
      {
        type: "feature" as const,
        description: "Dialog di conferma React: sostituzione di confirm() con componenti interni stilizzati"
      },
      {
        type: "improvement" as const,
        description: "Gestione errori robusta: divisione per zero e input non validi gestiti con messaggi chiari"
      },
      {
        type: "improvement" as const,
        description: "Reset automatico stati: prevenzione di dialog fuori contesto durante navigazione"
      },
      {
        type: "improvement" as const,
        description: "UX moderna: feedback visivo immediato per tutte le azioni utente"
      },
      {
        type: "fix" as const,
        description: "Risolto bug esercizi cancellati: gli esercizi non vengono più eliminati dopo aver completato un allenamento"
      },
      {
        type: "fix" as const,
        description: "Dialog conferma eliminazione: risolto problema di visualizzazione fuori contesto"
      },
      {
        type: "fix" as const,
        description: "Stato applicazione: reset automatico stati su cambio pagina/vista"
      },
      {
        type: "fix" as const,
        description: "Form esercizi: pulizia automatica form quando si cambia vista"
      },
      {
        type: "fix" as const,
        description: "Gestione errori: messaggi di errore consistenti in tutta l'applicazione"
      },
      {
        type: "fix" as const,
        description: "Persistenza stati: eliminati stati che persistevano tra viste diverse"
      },
      {
        type: "fix" as const,
        description: "Ottimizzazione reattività: migliorata gestione stati per evitare effetti collaterali"
      }
    ]
  },
  {
    version: "0.7.5 [BETA]",
    date: "14 Giugno 2025",
    type: "minor" as const,
    changes: [
      {
        type: "improvement" as const,
        description: "Aggiunte animazioni 'vetrose' (ispirate a iOS 26) per le transizioni tra le sezioni dell'app, creando un effetto 'bolla d'acqua'."
      },
      {
        type: "improvement" as const,
        description: "Estese le nuove animazioni a vari componenti dell'interfaccia per un'esperienza utente più fluida e coerente."
      },
      {
        type: "feature" as const,
        description: "Introdotta una palette di colori dinamica che si estende a tutti i componenti per un'esperienza più immersiva."
      },
      {
        type: "improvement" as const,
        description: "Reso l'intero tema dell'interfaccia utente (UI) dinamico. Ora tutti gli elementi visivi si adattano al colore del tema selezionato."
      },
      {
        type: "fix" as const,
        description: "Risolto un bug per cui alcuni elementi dell'UI mantenevano il colore blu predefinito, ignorando il tema selezionato."
      }
    ]
  },
  {
    version: "0.7.2 [BETA]",
    date: "14 Giugno 2025",
    type: "major" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Implementato sistema multi-set per gli esercizi: ora puoi creare serie multiple con ripetizioni e pesi diversi (es. 1x10, 2x8) per lo stesso esercizio"
      },
      {
        type: "feature" as const,
        description: "Aggiunto supporto per peso target individualizzato per ogni serie"
      },
      {
        type: "feature" as const,
        description: "Nuova interfaccia per gestire serie multiple negli allenamenti"
      },
      {
        type: "improvement" as const,
        description: "Migliorata l'intelligenza artificiale per il riconoscimento automatico di serie multiple nel formato '1x10, 1x8, 1x6' dall'importazione testo"
      },
      {
        type: "improvement" as const,
        description: "Potenziato il sistema di parsing degli esercizi per riconoscere diversi formati di serie multiple"
      },
      {
        type: "improvement" as const,
        description: "Timer allenamento aggiornato per supportare il tracciamento delle serie multiple"
      },
      {
        type: "improvement" as const,
        description: "Migliorata la gestione delle note per ogni singola serie"
      },
      {
        type: "fix" as const,
        description: "Corretta la funzionalità del tasto 'X' per chiudere le notifiche di changelog"
      },
      {
        type: "fix" as const,
        description: "Risolti errori TypeScript nella gestione degli esercizi multi-set"
      }
    ]
  },
  {
    version: "0.7.0 [BETA]",
    date: "31 Maggio 2025",
    type: "major" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Aggiunto sistema di notifiche push per i changelog"
      },
      {
        type: "feature" as const,
        description: "Sistema di invio email automatico per gli aggiornamenti"
      },
      {
        type: "feature" as const,
        description: "Notifiche in-app per nuovi aggiornamenti disponibili"
      },
      {
        type: "improvement" as const,
        description: "Migliorata l'esperienza utente del changelog"
      }
    ]
  },
  {
    version: "0.6.8 [BETA]",
    date: "30 Maggio 2025",
    type: "minor" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Aggiunta la possibilità di resettare i dati utente"
      },
      {
        type: "improvement" as const,
        description: "Migliorata la gestione degli errori durante il reset dei dati"
      }
    ]
  },
  {
    version: "0.6.7 [BETA]",
    date: "30 Maggio 2025",
    type: "minor" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Aggiunta la possibilità di scrivere note sugli esercizi"
      },
      {
        type: "improvement" as const,
        description: "Salvataggio delle note degli esercizi nel database"
      }
    ]
  },
  {
    version: "0.6.5 [BETA]",
    date: "30 Maggio 2025",
    type: "patch" as const,
    changes: [
      {
        type: "fix" as const,
        description: "Corretto un bug nella visualizzazione delle note degli esercizi"
      }
    ]
  },
  {
    version: "0.6.1 [BETA]",
    date: "30 Maggio 2025",
    type: "minor" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Aggiunto il timer per gli allenamenti"
      },
      {
        type: "improvement" as const,
        description: "Migliorata la visualizzazione dei tempi di riposo"
      }
    ]
  },
  {
    version: "0.6.0 [BETA]",
    date: "30 Maggio 2025",
    type: "major" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Aggiunta la gestione delle schede di allenamento"
      },
      {
        type: "improvement" as const,
        description: "Migliorata l'interfaccia utente per la creazione delle schede"
      }
    ]
  },
  {
    version: "0.5.1 [BETA]",
    date: "29 Maggio 2025",
    type: "minor" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Aggiunto il supporto per il tema dark"
      },
      {
        type: "improvement" as const,
        description: "Migliorati i colori e lo stile del tema dark"
      }
    ]
  },
  {
    version: "0.5 [BETA]",
    date: "28 Maggio 2025",
    type: "major" as const,
    changes: [
      {
        type: "feature" as const,
        description: "Lancio della prima versione beta di Albyfit"
      },
      {
        type: "improvement" as const,
        description: "Festeggiamo insieme questo traguardo!"
      }
    ]
  }
];

const getTypeIcon = (type: ChangelogEntry['type']) => {
  switch (type) {
    case 'major':
      return <Rocket className="w-4 h-4" />;
    case 'minor':
      return <Gift className="w-4 h-4" />;
    case 'patch':
      return <Bug className="w-4 h-4" />;
    default:
      return <Star className="w-4 h-4" />;
  }
};

const getTypeColor = (type: ChangelogEntry['type']) => {
  switch (type) {
    case 'major':
      return 'bg-primary text-primary-foreground';
    case 'minor':
      return 'bg-accent text-accent-foreground';
    case 'patch':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-slate-600 text-white';
  }
};

const getChangeIcon = (type: ChangeType) => {
  switch (type) {
    case 'feature':
      return <Wrench className="w-4 h-4 text-primary" />;
    case 'improvement':
      return <Zap className="w-4 h-4 text-emerald-400" />;
    case 'fix':
      return <Bug className="w-4 h-4 text-orange-400" />;
    default:
      return <Star className="w-4 h-4 text-slate-400" />;
  }
};

const ChangelogGrouped = () => {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['0.8.0 [BETA]']));
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const toggleVersion = (version: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const sendGlobalNotification = async () => {
    if (!user || user.email !== 'albertorossi2005@gmail.com') {
      toast({
        title: 'Accesso negato',
        description: 'Solo l\'admin può inviare notifiche globali.',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingNotification(true);
    
    try {
      const latestVersion = CHANGELOG_ENTRIES[0].version;
      
      // Invia notifica tramite Service Worker a tutti i client connessi
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SEND_GLOBAL_NOTIFICATION',
          title: `Nuovo aggiornamento Albyfit!`,
          body: `Scopri le novità della versione ${latestVersion}. Tocca per visualizzare il changelog.`,
          version: latestVersion,
          data: {
            url: '/?tab=changelog',
            action: 'changelog'
          }
        });
      }

      // Notifica diretta per i browser che supportano le notifiche
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Nuovo aggiornamento Albyfit!`, {
          body: `Scopri le novità della versione ${latestVersion}. Tocca per visualizzare il changelog.`,
          icon: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
          badge: '/lovable-uploads/5810f614-299f-4d1a-a0e8-97b3811225a1.png',
          tag: 'changelog-update',
          requireInteraction: true,
          data: {
            url: '/?tab=changelog'
          }
        });
      }

      toast({
        title: 'Notifica inviata!',
        description: `Notifica push globale inviata per la versione ${latestVersion}.`,
      });
    } catch (error: any) {
      console.error('Errore invio notifica:', error);
      toast({
        title: 'Errore invio notifica',
        description: 'Si è verificato un errore durante l\'invio della notifica.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Rocket className="w-7 h-7 text-primary" />
          <span>Changelog</span>
        </h2>
        <p className="text-slate-400">Tutte le novità e miglioramenti di Albyfit</p>
      </div>

      {/* Pannello Admin per notifiche push */}
      {user?.email === 'albertorossi2005@gmail.com' && (
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Pannello Admin - Notifiche Push
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Invia una notifica push globale a tutti gli utenti per il nuovo changelog v{CHANGELOG_ENTRIES[0].version}.
          </p>
          
          <Button 
            onClick={sendGlobalNotification}
            disabled={isSendingNotification}
            className="w-full"
          >
            {isSendingNotification ? (
              <>
                <Bell className="w-4 h-4 mr-2 animate-pulse" />
                Invio notifica...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Invia Notifica Push Globale
              </>
            )}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {CHANGELOG_ENTRIES.map((entry) => (
          <Card key={entry.version} className="glass-effect border-slate-700">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-800/50 transition-colors"
              onClick={() => toggleVersion(entry.version)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getTypeColor(entry.type)}`}>
                    {getTypeIcon(entry.type)}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {entry.version}
                    </CardTitle>
                    <p className="text-slate-400 text-sm">{entry.date}</p>
                  </div>
                  <Badge 
                    variant={entry.type === 'major' ? 'default' : 'secondary'}
                    className={`${getTypeColor(entry.type)} border-none`}
                  >
                    {entry.type.toUpperCase()}
                  </Badge>
                </div>
                {expandedVersions.has(entry.version) ? 
                  <ChevronUp className="w-5 h-5 text-slate-400" /> : 
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                }
              </div>
            </CardHeader>
            
            {expandedVersions.has(entry.version) && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {entry.changes.map((change, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                      <span>{getChangeIcon(change.type)}</span>
                      <p className="text-slate-300 flex-1">{change.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChangelogGrouped;
