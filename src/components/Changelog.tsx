import React from 'react';
import { 
  Wrench, 
  Plus, 
  Building, 
  BarChart3, 
  Zap, 
  Database, 
  Shield, 
  Rocket,
  Dumbbell,
  Download,
  User,
  Link,
  Palette,
  Bell,
  Smartphone,
  Settings
} from 'lucide-react';

const Changelog: React.FC = () => {
  const changelogEntries = [    {
      version: "0.8.0 [BETA]",
      date: "16 Giugno 2025",
      type: "major",
      title: "Gestione Esercizi Avanzata e Sistema Notifiche Nativo",
      description: "Questo aggiornamento rivoluziona l'esperienza di inserimento esercizi con validazione migliorata, calcoli matematici automatici, duplicazione rapida e un sistema di notifiche completamente nativo.",
      changes: [
        {
          category: "Gestione Esercizi Migliorata",
          icon: Dumbbell,          items: [
            "Validazione nomi esercizi: supporto per spazi, virgole, trattini, numeri e caratteri speciali",
            "Calcoli matematici nei campi peso: inserisci espressioni come '10+5', '20*2', '50/2' per calcolo automatico",
            "Modifica pesi durante allenamento: possibilità di aggiornare i pesi in tempo reale con calcoli matematici",
            "Gestione errori robusta: divisione per zero e input non validi gestiti con messaggi chiari",
            "Duplicazione rapida: pulsante per duplicare esercizi simili con un click",
            "Placeholder migliorati: indicazioni chiare su formati supportati"
          ]
        },
        {
          category: "Sistema Notifiche Nativo",
          icon: Bell,
          items: [
            "Eliminazione completa di alert() e confirm() nativi del browser",
            "Toast system integrato: notifiche eleganti e consistenti con il design dell'app",
            "Dialog di conferma React: sostituzione di confirm() con componenti interni stilizzati",
            "Reset automatico stati: prevenzione di dialog fuori contesto durante navigazione",
            "UX moderna: feedback visivo immediato per tutte le azioni utente"
          ]
        },
        {
          category: "Correzioni Bug",
          icon: Wrench,
          items: [
            "Dialog conferma eliminazione: risolto problema di visualizzazione fuori contesto",
            "Stato applicazione: reset automatico stati su cambio pagina/vista",
            "Form esercizi: pulizia automatica form quando si cambia vista",
            "Gestione errori: messaggi di errore consistenti in tutta l'applicazione",
            "Persistenza stati: eliminati stati che persistevano tra viste diverse"
          ]
        },
        {
          category: "Esperienza Utente",
          icon: User,
          items: [
            "Input flessibile: inserimento naturale di nomi esercizi con punteggiatura",
            "Calcolo automatico: risoluzione immediata di espressioni matematiche nei pesi",
            "Duplicazione veloce: workflow ottimizzato per esercizi simili",
            "Feedback visivo: toast colorati per successo/errore/info",
            "Design coerente: interfaccia uniforme per tutti i componenti"
          ]
        },
        {
          category: "Miglioramenti Tecnici",
          icon: Settings,
          items: [
            "Architettura notifiche: sistema toast centralizzato con useToast hook",
            "Componenti React: sostituzione di API browser con componenti nativi",
            "Gestione stati: useEffect ottimizzati per cleanup automatico",
            "Modularità: componenti riutilizzabili per dialog e notifiche",
            "Type safety: tipizzazione completa per tutte le nuove funzionalità"
          ]
        }
      ]
    },
    {
      version: "0.7.1 [BETA]",
      date: "11 Giugno 2025",
      type: "major",
      title: "Multi-day Workout: Allenamenti su più giorni e flusso AI/manuale",
      description: "Questo aggiornamento introduce la gestione avanzata delle schede di allenamento multi-day, sia per flusso manuale che AI-driven.",
      changes: [
        {
          category: "Schede multi-day",
          items: [
            "Ogni scheda può ora essere suddivisa in più giorni, ciascuno con i propri esercizi.",
            "Compatibilità AI/manuale: esercizi assegnabili ai giorni sia manualmente che tramite importazione AI/immagine.",
            "UI aggiornata: gestione giorni in WorkoutManager ed ExerciseImporter, timer con selezione giorno."
          ]
        },
        {
          category: "Schema Supabase",
          items: [
            "Tabella exercises aggiornata con colonna day.",
            "Migrazione dati legacy opzionale (UPDATE exercises SET day = 'Giorno 1' WHERE day IS NULL;)."
          ]
        },
        {
          category: "Compatibilità retroattiva",
          items: [
            "Le vecchie schede (singolo giorno) sono ancora supportate."
          ]
        }
      ],
      impact: [
        "Possibilità di organizzare le schede su più giorni.",
        "Esperienza utente migliorata nella gestione e visualizzazione degli allenamenti."
      ]
    },
    {
      version: "0.7.0 [BETA]",
      date: "31 Maggio 2025",
      type: "major",
      title: "Major Update: Pulizia Codice, Ottimizzazioni e Stabilità",
      description: "Questo aggiornamento segna un importante passo avanti per Albyfit, concentrandosi sulla pulizia del codice, l\\'ottimizzazione e il miglioramento della stabilità generale dell\\'applicazione.",
      changes: [
        {
          category: "Refactoring e Ottimizzazioni",
          items: [
            "Pulizia Generale: Identificato e rimosso codice obsoleto e inutilizzato.",
            "Gestione 'reps' negli Esercizi: Migliorata la gestione del campo 'reps' (ripetizioni) per maggiore coerenza e robustezza dei dati (parsing da stringa a numero, fallback a 10).",
            "Rimozione Import Inutilizzati: Eliminato l\\'import 'useAuth' non utilizzato da 'src/pages/Index.tsx'.",
          ],
        },
        {
          category: "Sistema di Autenticazione",
          items: [
            "Consolidamento Logica di Autenticazione: Rimossi 'src/hooks/useAuth.tsx' e 'src/components/AuthForm.tsx' (sistema di autenticazione locale) a favore dell\\'integrazione con Supabase.",
          ],
        },
        {
          category: "Gestione File",
          items: [
            "Rimozione File Vuoti: Eliminati 'src/hooks/useServiceWorker.tsx' e 'src/components/ChangelogNew.tsx'.",
          ],
        },
        {
          category: "Changelog e Notifiche",
          items: [
            "Aggiornamento Changelog: Aggiunta la nuova versione 0.7.0 [BETA].",
            "Notifiche di Aggiornamento: Gli utenti riceveranno una notifica per questo major update.",
          ],
        },
      ],
      impact: [
        "Gli utenti dovrebbero sperimentare un\\'applicazione più fluida e stabile.",
        "La gestione dei dati relativi agli esercizi, in particolare le ripetizioni, è ora più affidabile.",
        "Il processo di autenticazione è ora gestito interamente tramite Supabase.",
      ],
    },
    {
      version: "0.6.8 [BETA]",
      date: "30 Maggio 2025",
      type: "minor",
      changes: [
        {
          category: "Sistema Admin Notifiche",
          categoryIcon: Bell,
          items: [
            "Implementato pannello admin per l'invio di notifiche push globali",
            "Funzione esclusiva per utente albertorossi2005@gmail.com per gestire notifiche massive",
            "Interface di amministrazione per comunicazioni importanti a tutti gli utenti",
            "Sistema di broadcast personalizzato con azioni specifiche per l'admin",
            "Controllo accessi basato su email per funzionalità amministrative"
          ]
        },
        {
          category: "Miglioramenti Sistema PWA",
          categoryIcon: Rocket,
          items: [
            "Cache versioning aggiornato a v0.6.8 per prestazioni ottimali",
            "Ottimizzazioni Service Worker per gestione notifiche admin",
            "Compatibilità estesa per dispositivi enterprise",
            "Performance migliorate per installazioni PWA su larga scala"
          ]
        }
      ]
    },
    {
      version: "0.6.7 [BETA]",
      date: "30 Maggio 2025",
      type: "minor",
      changes: [
        {
          category: "Sistema Notifiche Push PWA",
          categoryIcon: Smartphone,
          items: [
            "Implementato sistema automatico di notifiche push per tutti gli utenti PWA",
            "Notifiche inviate automaticamente quando una nuova versione viene installata",
            "Service Worker potenziato con gestione eventi activate per notifiche immediate",
            "Notifiche native del sistema operativo per utenti con app installata come PWA",
            "Azioni personalizzate nelle notifiche: 'Vedi Novità' e 'Apri App'"
          ]
        },
        {
          category: "Sistema Reset Dati Utente",
          categoryIcon: Settings,
          items: [
            "Aggiunto 'Reset Statistiche' per eliminare solo sessioni e note mantenendo le schede",
            "Implementato 'Reset Completo' per riportare l'account allo stato iniziale",
            "Dialog di conferma con dettaglio delle azioni per ogni tipo di reset",
            "Sicurezza migliorata con conferme multiple per prevenire cancellazioni accidentali",
            "Feedback visivo durante le operazioni di reset con stato di caricamento"
          ]
        },
        {
          category: "Miglioramenti Sistema PWA",
          categoryIcon: Rocket,
          items: [
            "Cache versioning aggiornato a v0.6.7 per prestazioni ottimali",
            "Tracking automatico versioni per notifiche progressive",
            "Comunicazione bidirezionale service worker-client per aggiornamenti in tempo reale",
            "Gestione skip waiting per attivazione immediata nuove versioni"
          ]
        }
      ]
    },
    {
      version: "0.6.5 [BETA]",
      date: "30 Maggio 2025",
      type: "patch",
      changes: [
        {
          category: "Fix Sistema Notifiche",
          categoryIcon: Bell,
          items: [
            "Corretto sistema notifiche PWA per mostrare alert solo una volta per nuova versione",
            "Migliorata logica localStorage per tracciamento notifiche per utente+versione",
            "Eliminati loop di notifiche ripetute ad ogni login con stessa versione"
          ]
        },
        {
          category: "Fix Auto-Categorizzazione AI",
          categoryIcon: Zap,
          items: [
            "Impedito auto-inserimento esercizi cardio da parte dell'AI quando non richiesto",
            "Mantenuta categorizzazione cardio solo quando esplicitamente indicato nelle note",
            "Rimossa auto-detection cardio nel form di aggiunta esercizi manuale",
            "Preservata funzionalità cardio per esercizi importati con note 'cardio' esplicite"
          ]
        },
        {
          category: "Aggiornamenti Versione",
          categoryIcon: Settings,
          items: [
            "Aggiornata versione app a 0.6.5 [BETA]",
            "Aggiornato cache service worker a 'albyfit-v0.6.5'",
            "Sincronizzate tutte le versioni visualizzate nell'interfaccia"
          ]
        }
      ]
    },
    {
      version: "0.6.1 [BETA]",
      date: "30 Maggio 2025",
      type: "minor",
      changes: [
        {
          category: "Sistema di Notifiche PWA",
          categoryIcon: Bell,
          items: [
            "Implementato sistema completo di notifiche push per app PWA installate",
            "Aggiunta richiesta permessi notifiche al primo accesso con changelog non visualizzati",
            "Creato componente ChangelogNotification con design coerente all'app",
            "Badge di notifica rosso animato nella navigation per nuovi changelog",
            "Service Worker dedicato per gestione notifiche e cache offline"
          ]
        },
        {
          category: "Branding e Identità",
          categoryIcon: User,
          items: [
            "Aggiunto 'Created by Albix4563' in tutte le sezioni dell'app (Home, Profile, Login)",
            "Sostituiti tutti i riferimenti 'Lovable' con branding Albyfit indipendente",
            "Aggiornato README.md con documentazione professionale completa",
            "Rimosso lovable-tagger dalle dipendenze per maggiore indipendenza"
          ]
        },
        {
          category: "Miglioramenti UX",
          categoryIcon: Smartphone,
          items: [
            "Notifiche automatiche per utenti PWA quando disponibili nuovi aggiornamenti",
            "Integrazione seamless tra notifiche e navigazione al changelog",
            "Sistema di tracking ultima versione vista per utente tramite localStorage",
            "Animazioni fluide per popup di notifica con stile glass-effect"
          ]
        }
      ]
    },
    {
      version: "0.6.0 [BETA]",
      date: "30 Maggio 2025",
      type: "major",
      changes: [
        {
          category: "Design Professionale",
          categoryIcon: Palette,
          items: [
            "Sostituiti TUTTI gli emoji con icone professionali Lucide React in tutta l'applicazione",
            "Aggiornata la Navigazione con icone moderne (Home, Dumbbell, Timer, BarChart3, FileText, User)",
            "Rinnovato completamente il WorkoutTimer con icone professionali per tutte le funzioni",
            "Aggiornato WorkoutManager con icone per import/export, ricerca e gestione esercizi",
            "Modernizzata ExerciseWiki con icone per categorie e funzionalità di ricerca",
            "Rinnovati Progress, Profile e Dashboard con icone coerenti e professionali",
            "Aggiornato Changelog con sistema di icone per categorie strutturato"
          ]
        },
        {
          category: "Intelligenza Artificiale Avanzata",
          categoryIcon: Zap,
          items: [
            "Migliorato il riconoscimento automatico degli esercizi cardio nell'AI Gemini",
            "Aggiunta categorizzazione automatica: corsa, cyclette, tapis roulant, ellittica, HIIT",
            "Implementata distinzione intelligente tra esercizi di forza e cardio",
            "Configurazione automatica: cardio = 1 serie con durata, forza = 3 serie con ripetizioni",
            "Aggiornate le regole AI per garantire minimo 8 minuti per esercizi cardio",
            "Migliorata la categorizzazione degli esercizi per gruppi muscolari specifici"
          ]
        },
        {
          category: "Gestione Esercizi Cardio",
          categoryIcon: Dumbbell,
          items: [
            "Implementato riconoscimento automatico degli esercizi cardio durante l'inserimento",
            "Aggiunta validazione per durata minima di 8 minuti per esercizi cardio",
            "Creato sistema di timer specifico per esercizi cardio con conteggio progressivo",
            "Implementata gestione differenziata: cardio usa tempo, forza usa serie/ripetizioni",
            "Aggiunta visualizzazione distintiva degli esercizi cardio con etichette colorate",
            "Configurazione automatica dei parametri cardio (1 serie, durata in minuti)"
          ]
        },
        {
          category: "Miglioramenti UX/UI",
          categoryIcon: Rocket,
          items: [
            "Interfaccia più pulita e professionale senza elementi infantili",
            "Consistenza visiva migliorata con icone uniformi in tutta l'app",
            "Migliorata leggibilità con layout icon-text ottimizzati",
            "Aggiornati tutti i bottoni e controlli con icone intuitive",
            "Implementato design system coerente per tutte le sezioni",
            "Ottimizzata la user experience per workflow più fluidi"
          ]
        }      ]
    },
    {
      version: "0.5.1 [BETA]",
      date: "29 Maggio 2025",
      type: "minor",
      changes: [
        {
          category: "Correzioni e Miglioramenti",
          categoryIcon: Wrench,
          items: [
            "Corretta visualizzazione degli allenamenti completati nella Dashboard",
            "Risolto il problema dei progressi che non venivano salvati al completamento degli allenamenti",
            "Aggiornamento del Profilo utente per mostrare dati reali invece di dati fittizi",
            "Migliorata la visualizzazione delle statistiche mensili e settimanali",
            "Garantito tempo di recupero minimo di 60 secondi per tutti gli esercizi importati"
          ]
        },
        {
          category: "Nuove Funzionalità",
          categoryIcon: Plus,
          items: [
            "Aggiornato modello AI a Gemini 2.0 Flash per migliorare l'estrazione degli esercizi",
            "Aggiunta ricerca YouTube per tutorial di ogni esercizio",
            "Aggiunta ricerca Google Immagini per visualizzare ogni esercizio",
            "Implementata visualizzazione progressi dettagliata con filtri giornalieri, settimanali e mensili",
            "Migliorata l'interfaccia dei progressi con statistiche più accurate"
          ]        },
        {
          category: "Monitoraggio Avanzato",
          categoryIcon: BarChart3,
          items: [
            "Tracciamento accurato delle sessioni di allenamento completate",
            "Calcolo automatico delle statistiche personali (streak, durata media, frequenza)",
            "Visualizzazione grafica dei progressi nel tempo",
            "Sistema di achievement basato sui risultati reali"
          ]
        }
      ]    },
    {
      version: "0.5 [BETA]",
      date: "28 Maggio 2025",
      type: "major",
      changes: [
        {
          category: "Architettura",
          categoryIcon: Building,
          items: [
            "Migrazione completa da localStorage a Supabase per la persistenza dei dati",
            "Implementazione dell'autenticazione utente con Supabase Auth",
            "Configurazione delle Row Level Security (RLS) policies per la sicurezza dei dati"
          ]        },
        {
          category: "Gestione Allenamenti",
          categoryIcon: Dumbbell,
          items: [
            "Creazione e modifica allenamenti personalizzati",
            "Aggiunta esercizi con serie, ripetizioni e tempi di recupero",
            "Categorizzazione automatica degli esercizi (petto, schiena, gambe, ecc.)",
            "Importazione allenamenti tramite link di condivisione",
            "Eliminazione allenamenti con conferma di sicurezza"
          ]
        },
        {
          category: "Timer Allenamenti",
          categoryIcon: Zap,
          items: [
            "Timer integrato per l'esecuzione degli allenamenti",
            "Cronometro per i tempi di recupero tra le serie",
            "Tracciamento del progresso durante l'allenamento",
            "Notifiche sonore al termine dei periodi di recupero",
            "Possibilità di saltare o estendere i tempi di recupero"
          ]        },        {
          category: "Analisi AI Esercizi",
          categoryIcon: Download,
          items: [
            "Importazione esercizi da testo con riconoscimento automatico dei formati",
            "Analisi intelligente con AI per parsing automatico degli esercizi",
            "Supporto per multipli formati di input (es: '3x10', 'Nome: 4x12', ecc.)",
            "Validazione e pulizia automatica dei nomi degli esercizi",
            "Preparazione per future funzionalità AI avanzate"
          ]        },
        {
          category: "Monitoraggio Progresso",
          categoryIcon: BarChart3,
          items: [
            "Visualizzazione dello storico degli allenamenti completati",
            "Tracciamento delle performance nel tempo",
            "Statistiche su durata e frequenza degli allenamenti"
          ]
        },        {
          category: "Enciclopedia Esercizi",
          categoryIcon: Database,
          items: [
            "Database di esercizi con descrizioni dettagliate",
            "Ricerca per gruppi muscolari e difficoltà",
            "Link automatici a tutorial YouTube per ogni esercizio"
          ]
        },
        {
          category: "Gestione Profilo",
          categoryIcon: User,
          items: [
            "Profilo utente personalizzabile",
            "Gestione delle preferenze dell'app",
            "Sistema di autenticazione sicuro"
          ]
        },
        {
          category: "Condivisione",
          categoryIcon: Link,
          items: [
            "Condivisione allenamenti tramite link",
            "Importazione allenamenti condivisi da altri utenti",
            "Formato URL compatibile per la condivisione social"
          ]        },
        {
          category: "Interfaccia Utente",
          categoryIcon: Palette,
          items: [
            "Design moderno con effetti glassmorphism",
            "Navigazione intuitiva con tab bar inferiore",
            "Responsive design ottimizzato per mobile e desktop",
            "Animazioni fluide e feedback visivo"
          ]
        },
        {
          category: "Sicurezza",
          categoryIcon: Shield,
          items: [
            "Autenticazione utente sicura",
            "Isolamento dei dati per ogni utente",
            "Crittografia dei dati in transito e a riposo"
          ]
        }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'patch': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'major': return 'Versione Maggiore';
      case 'minor': return 'Versione Minore';
      case 'patch': return 'Correzioni';
      default: return 'Aggiornamento';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-poppins font-bold text-white mb-2">Changelog</h2>
        <p className="text-slate-400">Storico degli aggiornamenti di Albyfit</p>
      </div>

      <div className="space-y-6">
        {changelogEntries.map((entry, index) => (
          <div key={index} className="glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-poppins font-bold text-white">
                  Versione {entry.version}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(entry.type)}`}>
                  {getTypeLabel(entry.type)}
                </span>
              </div>
              <span className="text-sm text-slate-400">{entry.date}</span>
            </div>

            <div className="space-y-6">
              {entry.changes.map((category, categoryIndex) => (                <div key={categoryIndex} className="border-l-2 border-sky-blue/30 pl-4">
                  <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                    {category.categoryIcon && <category.categoryIcon className="w-5 h-5" />}
                    <span>{category.category}</span>
                  </h4>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="text-sky-blue mt-1.5 text-xs">•</span>
                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <div className="text-xs text-slate-500 text-center">
                Albyfit è un'applicazione fitness completa progettata per aiutarti a raggiungere i tuoi obiettivi di allenamento.
                <br />
                Creata con tecnologie moderne per garantire prestazioni ottimali e sicurezza dei dati.
              </div>
            </div>
          </div>
        ))}
      </div>      <div className="glass-effect rounded-2xl p-6 text-center">
        <h3 className="text-lg font-poppins font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Rocket className="w-5 h-5" />
          <span>Funzionalità Principali di Albyfit</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="font-medium text-sky-blue mb-2 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              <span>Allenamenti Personalizzati</span>
            </h4>
            <p className="text-sm text-slate-400">Crea, modifica e gestisci i tuoi allenamenti con esercizi personalizzati</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="font-medium text-sky-blue mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Timer Integrato</span>
            </h4>
            <p className="text-sm text-slate-400">Timer per serie e recuperi con notifiche sonore</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="font-medium text-sky-blue mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Tracciamento Progressi</span>
            </h4>
            <p className="text-sm text-slate-400">Monitora i tuoi miglioramenti nel tempo</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="font-medium text-sky-blue mb-2 flex items-center gap-2">
              <Link className="w-4 h-4" />
              <span>Condivisione</span>
            </h4>
            <p className="text-sm text-slate-400">Condividi e importa allenamenti con altri utenti</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelog;
