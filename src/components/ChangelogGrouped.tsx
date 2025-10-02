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

const CHANGELOG_ENTRIES = [
  {
    version: "0.9.3 [RELEASE CANDIDATE]",
    date: "2 Ottobre 2025",
    type: "major" as const,
    changes: [
      {
        type: "feature" as const,
        description: "🚀 Dashboard Statistics Refresh: Risolto problema di refresh delle statistiche dopo reset - ora si aggiornano automaticamente senza ricaricare la pagina"
      },
      {
        type: "feature" as const,
        description: "⚡ Smart Statistics Reset: Funzione di reset delle statistiche che aggiorna immediatamente l'UI"
      },
      {
        type: "feature" as const,
        description: "🔄 Real-time Data Updates: Tutti i reset (statistiche, cronologia, dati utente) ora aggiornano l'interfaccia in tempo reale"
      },
      {
        type: "improvement" as const,
        description: "🛠️ State Management Optimization: Migliorato il sistema di gestione dello stato con funzione refreshAuth centralizzata"
      },
      {
        type: "improvement" as const,
        description: "⚡ Performance Enhancements: Ottimizzazioni delle performance per caricamento più rapido dei dati"
      },
      {
        type: "improvement" as const,
        description: "💾 Database Operations: Migliorate le operazioni di reset dei dati con refresh automatico"
      },
      {
        type: "improvement" as const,
        description: "✨ Enhanced User Experience: Feedback immediato per tutte le operazioni di modifica dati"
      },
      {
        type: "improvement" as const,
        description: "🛡️ Improved Error Handling: Gestione errori migliorata per operazioni di reset"
      },
      {
        type: "improvement" as const,
        description: "📱 Mobile Optimization: Mantenute tutte le ottimizzazioni mobile esistenti"
      },
      {
        type: "improvement" as const,
        description: "🔧 Code Architecture: Rifattorizzato il codice per una migliore manutenibilità"
      },
      {
        type: "fix" as const,
        description: "✅ Selected Tab Visibility: Tab selezionata ora perfettamente visibile con testo bold e background solido"
      },
      {
        type: "fix" as const,
        description: "✅ Timer Tab Logic: Fix logica condizionale per apparizione/scomparsa tab Timer durante allenamento"
      },
      {
        type: "fix" as const,
        description: "✅ Performance Optimization: Ottimizzate animazioni per prestazioni fluide su tutti i dispositivi"
      }
    ]
  },
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
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set(['0.9.3 [RELEASE CANDIDATE]']));
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