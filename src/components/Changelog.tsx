import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Star, 
  Zap, 
  Wrench, 
  Bug, 
  Shield,
  Calendar,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface ChangelogProps {
  onClose?: () => void;
}

interface Release {
  version: string;
  date: string;
  changes: {
    type: 'feature' | 'ui' | 'technical' | 'fix' | 'security' | 'deprecated' | 'removed';
    title: string;
    items: string[];
  }[];
  isLatest?: boolean;
}

const Changelog: React.FC<ChangelogProps> = ({ onClose }) => {
  const [hasSeenLatest, setHasSeenLatest] = useState(false);
  const [expandedReleases, setExpandedReleases] = useState(new Set(['0.9.3']));
  const [showNewFeatureModal, setShowNewFeatureModal] = useState(false);

  const currentVersion = "0.9.3";

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    if (lastSeenVersion !== currentVersion) {
      setShowNewFeatureModal(true);
    } else {
      setHasSeenLatest(true);
    }
  }, []);

  const markAsRead = () => {
    localStorage.setItem('lastSeenVersion', currentVersion);
    setHasSeenLatest(true);
    setShowNewFeatureModal(false);
  };

  const toggleRelease = (version: string) => {
    const newExpanded = new Set(expandedReleases);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedReleases(newExpanded);
  };

  const releases: Release[] = [
    {
      version: "0.9.3",
      date: "2 Ottobre 2025",
      isLatest: true,
      changes: [
        {
          type: 'feature',
          title: '✨ Nuove Funzionalità',
          items: [
            'Modal personalizzati per sostituire i dialog nativi del browser',
            'Sistema di conferma unificato con design coerente',
            'Sistema di notifiche per aggiornamenti app con badge animato',
            'Modal changelog integrato per informare sulle novità'
          ]
        },
        {
          type: 'ui',
          title: '🎨 Miglioramenti UI/UX',
          items: [
            'Barra di navigazione mobile con leggibilità ottimizzata',
            'Animazioni ultra-fluide a 60fps con spring physics',
            'Micro-interazioni premium su tutti gli elementi interattivi',
            'Design glassmorphism raffinato per migliore leggibilità',
            'Ridotto blur della navigazione per contenuto sottostante'
          ]
        },
        {
          type: 'technical',
          title: '🛠️ Miglioramenti Tecnici',
          items: [
            'Accelerazione GPU per tutte le animazioni (transform: translateZ(0))',
            'Ottimizzazioni specifiche per dispositivi mobile e touch',
            'Supporto completo per prefers-reduced-motion e accessibilità',
            'Sistema di animazioni basato su fisica naturale (spring physics)',
            'Nuove utility CSS per smooth transitions e performance'
          ]
        },
        {
          type: 'fix',
          title: '🐛 Correzioni',
          items: [
            'Eliminati completamente i popup browser non coerenti',
            'Risolti lag e frame drops durante transizioni tra pagine',
            'Migliorato contrasto e visibilità barra navigazione mobile',
            'Corretti problemi di leggibilità con glassmorphism eccessivo'
          ]
        }
      ]
    },
    {
      version: "0.9.2.1",
      date: "1 Ottobre 2025",
      changes: [
        {
          type: 'fix',
          title: '🐛 Correzioni',
          items: [
            'Correzioni minori di stabilità',
            'Miglioramenti performance generali',
            'Ottimizzazioni sistema di autenticazione'
          ]
        }
      ]
    },
    {
      version: "0.9.2",
      date: "30 Settembre 2025",
      changes: [
        {
          type: 'feature',
          title: '✨ Nuove Funzionalità',
          items: [
            'Sistema di allenamenti completamente rinnovato',
            'Dashboard con statistiche avanzate e grafici',
            'Timer integrato per sessioni di allenamento'
          ]
        },
        {
          type: 'ui',
          title: '🎨 Miglioramenti UI/UX',
          items: [
            'Design glassmorphism implementato su tutti i componenti',
            'Sistema tema dark/light ottimizzato',
            'Navigazione mobile migliorata'
          ]
        }
      ]
    }
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Sparkles className="w-4 h-4" />;
      case 'ui': return <Star className="w-4 h-4" />;
      case 'technical': return <Wrench className="w-4 h-4" />;
      case 'fix': return <Bug className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'text-orange-400';
      case 'ui': return 'text-blue-400';
      case 'technical': return 'text-green-400';
      case 'fix': return 'text-red-400';
      case 'security': return 'text-purple-400';
      default: return 'text-yellow-400';
    }
  };

  const NewFeatureModal = () => (
    <AnimatePresence>
      {showNewFeatureModal && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="w-full max-w-lg"
          >
            <LiquidGlass intensity="heavy" variant="card" className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white font-poppins mb-2">
                  🎉 Benvenuto in Albyfit v{currentVersion}!
                </h2>
                <p className="text-slate-400">
                  Scopri tutte le incredibili novità di questa versione
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <h3 className="font-semibold text-orange-400 mb-2">✨ Modal Personalizzati</h3>
                  <p className="text-sm text-slate-300">
                    Addio ai brutti popup del browser! Ora tutti i dialog hanno il design elegante dell'app.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <h3 className="font-semibold text-blue-400 mb-2">🎨 Animazioni Ultra-Fluide</h3>
                  <p className="text-sm text-slate-300">
                    Transizioni a 60fps con physics naturali per un'esperienza di navigazione premium.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <h3 className="font-semibold text-green-400 mb-2">🛠️ Performance GPU</h3>
                  <p className="text-sm text-slate-300">
                    Accelerazione hardware su tutti i dispositivi per animazioni perfette.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewFeatureModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-600/50 text-slate-300 hover:bg-slate-600/70 transition-all duration-200"
                >
                  Chiudi
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={markAsRead}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg"
                >
                  Fantastico! 🚀
                </motion.button>
              </div>
            </LiquidGlass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white font-poppins">Changelog</h1>
              <p className="text-slate-400 text-sm">Storia degli aggiornamenti di Albyfit</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Releases */}
        <div className="space-y-4">
          {releases.map((release, index) => (
            <LiquidGlass key={release.version} intensity="medium" variant="card" className="overflow-hidden">
              <motion.button
                onClick={() => toggleRelease(release.version)}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200"
                whileHover={{ scale: 1.001 }}
                whileTap={{ scale: 0.999 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-400 text-sm">{release.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-white font-poppins">
                        v{release.version}
                      </span>
                      {release.isLatest && (
                        <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium">
                          ✨ Ultimo
                        </span>
                      )}
                      {!hasSeenLatest && release.isLatest && (
                        <motion.div 
                          className="w-2 h-2 bg-orange-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedReleases.has(release.version) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </div>
              </motion.button>
              
              <AnimatePresence>
                {expandedReleases.has(release.version) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-white/10"
                  >
                    <div className="p-6 space-y-6">
                      {release.changes.map((changeGroup, groupIndex) => (
                        <div key={groupIndex}>
                          <h3 className={`font-semibold mb-3 flex items-center gap-2 ${getChangeColor(changeGroup.type)}`}>
                            {getChangeIcon(changeGroup.type)}
                            {changeGroup.title}
                          </h3>
                          <ul className="space-y-2 ml-6">
                            {changeGroup.items.map((item, itemIndex) => (
                              <motion.li
                                key={itemIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: itemIndex * 0.05 }}
                                className="text-sm text-slate-300 flex items-start gap-2"
                              >
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-2 flex-shrink-0" />
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </LiquidGlass>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">
            Sviluppato con ❤️ da{' '}
            <span className="text-white font-medium">Albix4563</span>
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Segui il{' '}
            <a 
              href="https://semver.org/lang/it/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Semantic Versioning
            </a>
          </p>
        </div>
      </div>
      
      <NewFeatureModal />
    </div>
  );
};

export default Changelog;