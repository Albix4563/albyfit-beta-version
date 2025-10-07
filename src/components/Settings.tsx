import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Info, 
  LogOut, 
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

interface SettingsProps {
  onClose?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { user } = useSupabaseAuth();
  const { theme, setTheme } = useTheme();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  const currentVersion = "0.9.5 [FINAL CANDIDATE RELEASE]";
  const releaseDate = "2 Ottobre 2025";

  const themes = [
    { id: 'blue', name: 'Blu', color: 'bg-blue-500' },
    { id: 'red', name: 'Rosso', color: 'bg-red-500' },
    { id: 'green', name: 'Verde', color: 'bg-green-500' },
    { id: 'purple', name: 'Viola', color: 'bg-purple-500' },
    { id: 'orange', name: 'Arancione', color: 'bg-orange-500' },
    { id: 'pink', name: 'Rosa', color: 'bg-pink-500' },
    { id: 'cyan', name: 'Ciano', color: 'bg-cyan-500' },
    { id: 'yellow', name: 'Giallo', color: 'bg-yellow-500' },
    { id: 'indigo', name: 'Indaco', color: 'bg-indigo-500' },
    { id: 'teal', name: 'Teal', color: 'bg-teal-500' },
    { id: 'emerald', name: 'Smeraldo', color: 'bg-emerald-500' },
    { id: 'rose', name: 'Rosa Scuro', color: 'bg-rose-500' }
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logout effettuato con successo!');
    } catch (error) {
      console.error('Errore durante il logout:', error);
      toast.error('Errore durante il logout');
    }
  };

  const UpdateModal = () => (
    <AnimatePresence>
      {showUpdateModal && (
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
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-poppins">Novità v{currentVersion}</h2>
                    <p className="text-sm text-slate-400">Scopri le nuove funzionalità</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
                    ✨ Nuove Funzionalità
                  </h3>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 ml-2">
                    <li>Modal personalizzati per tutte le conferme</li>
                    <li>Sistema di notifiche update unificato</li>
                    <li>Design glassmorphism raffinato</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    🎨 Miglioramenti UI/UX
                  </h3>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 ml-2">
                    <li>Animazioni ultra-fluide a 60fps</li>
                    <li>Barra navigazione mobile ottimizzata</li>
                    <li>Micro-interazioni premium</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-400 mb-2">
                    🛠️ Miglioramenti Tecnici
                  </h3>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 ml-2">
                    <li>Accelerazione GPU per performance</li>
                    <li>Spring physics per animazioni naturali</li>
                    <li>Supporto completo accessibilità</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUpdateModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Fantastico! 🎉
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white font-poppins">Impostazioni</h1>
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

        {/* Informazioni Account */}
        <LiquidGlass intensity="medium" variant="card" className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Informazioni Account</h2>
              <p className="text-slate-400 text-sm">Gestisci il tuo profilo</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-slate-300">Email</span>
              <span className="text-white font-medium">{user?.email || 'Non disponibile'}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-slate-300">Account creato</span>
              <span className="text-white font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('it-IT') : 'Non disponibile'}
              </span>
            </div>
          </div>
        </LiquidGlass>

        {/* Temi */}
        <LiquidGlass intensity="medium" variant="card" className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Tema Colore</h2>
              <p className="text-slate-400 text-sm">Personalizza l'aspetto dell'app</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {themes.map((themeOption) => (
              <motion.button
                key={themeOption.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(themeOption.id as any)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  theme === themeOption.id 
                    ? 'border-white shadow-lg' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <div className={`w-8 h-8 ${themeOption.color} rounded-lg mx-auto mb-2`} />
                <span className="text-xs text-white font-medium">{themeOption.name}</span>
              </motion.button>
            ))}
          </div>
        </LiquidGlass>

        {/* Informazioni App */}
        <LiquidGlass intensity="medium" variant="card" className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Informazioni App</h2>
              <p className="text-slate-400 text-sm">Dettagli versione e aggiornamenti</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-slate-300">Versione</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">v{currentVersion}</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUpdateModal(true)}
                  className="px-2 py-1 text-xs bg-orange-500 text-white rounded-md font-medium flex items-center gap-1 hover:bg-orange-600 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Novità
                </motion.button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-slate-300">Ultimo aggiornamento</span>
              <span className="text-white font-medium">{releaseDate}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-slate-300">Sviluppatore</span>
              <span className="text-white font-medium">Albix4563</span>
            </div>
          </div>
        </LiquidGlass>

        {/* Logout */}
        <LiquidGlass intensity="medium" variant="card" className="p-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Disconnetti</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </LiquidGlass>
      </div>
      
      <UpdateModal />
    </div>
  );
};

export default Settings;