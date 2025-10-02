import React, { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Check, Rocket, Trash2, RotateCcw, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface DashboardProps {
  onStartWorkout: (workout?: any) => void;
  onTabChange: (tab: string) => void;
}

// Modal personalizzato per le conferme
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: 'red' | 'orange';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  confirmText, 
  confirmColor, 
  onConfirm, 
  onCancel 
}) => {
  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    orange: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 400, 
              mass: 0.8 
            }}
            className="w-full max-w-md"
          >
            <LiquidGlass 
              intensity="heavy" 
              variant="card"
              className="p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white font-poppins">
                  {title}
                </h3>
                <button
                  onClick={onCancel}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                {message}
              </p>
              
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl bg-slate-600/50 hover:bg-slate-600/70 
                           text-white font-medium transition-all duration-200 
                           border border-slate-500/50 hover:border-slate-400/50"
                >
                  Annulla
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className={`px-5 py-2.5 rounded-xl text-white font-semibold 
                            transition-all duration-200 focus:ring-2 focus:ring-offset-2 
                            focus:ring-offset-slate-800 shadow-lg 
                            ${colorClasses[confirmColor]}`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </LiquidGlass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onStartWorkout, onTabChange }) => {
  const { workouts, workoutSessions, user, refreshAuth } = useSupabaseAuth();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // Calcola statistiche dall'ultimo mese
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const recentWorkouts = workoutSessions
    .filter(session => new Date(session.start_time) >= lastMonth && session.completed)
    .slice(-3)
    .reverse();

  const monthlyWorkouts = workoutSessions
    .filter(session => new Date(session.start_time) >= lastMonth && session.completed).length;

  const avgWorkoutsPerWeek = monthlyWorkouts > 0 ? Math.round((monthlyWorkouts / 4) * 10) / 10 : 0;

  const quickWorkouts = workouts.slice(0, 3);

  // Calcola streak attuale
  const calculateStreak = () => {
    if (workoutSessions.length === 0) return 0;
    
    const completedSessions = workoutSessions
      .filter(session => session.completed)
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
    
    if (completedSessions.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const session of completedSessions) {
      const sessionDate = new Date(session.start_time);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  const handleStartSpecificWorkout = (workout: any) => {
    onStartWorkout(workout);
  };

  const handleClearWorkouts = async () => {
    setShowClearModal(false);

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshAuth();
      toast.success('Cronologia allenamenti eliminata con successo!');
    } catch (error) {
      console.error('Errore nell\'eliminazione della cronologia:', error);
      toast.error('Errore nell\'eliminazione della cronologia');
    }
  };

  const handleResetStats = async () => {
    setShowResetModal(false);

    try {
      // Elimina tutte le sessioni completate per resettare le statistiche
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      await refreshAuth();
      toast.success('Statistiche resettate con successo!');
    } catch (error) {
      console.error('Errore nel reset delle statistiche:', error);
      toast.error('Errore nel reset delle statistiche');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/lovable-uploads/8281de93-96f3-4e5c-938a-020cbe3e553d.png" 
            alt="Albyfit Logo" 
            className="w-32 h-32 object-contain"
          />
        </div>
        <h2 className="text-2xl font-poppins font-bold text-white mb-2 text-center">
          Bentornato su Albyfit{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}!
        </h2>
        <p className="text-slate-400 mb-4 text-center">
          {workouts.length > 0 
            ? 'Pronto per il tuo prossimo allenamento?' 
            : 'Inizia creando il tuo primo allenamento!'
          }
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{monthlyWorkouts}</div>
            <div className="text-sm text-slate-400">Questo mese</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{currentStreak}</div>
            <div className="text-sm text-slate-400">Giorni di streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{avgWorkoutsPerWeek}</div>
            <div className="text-sm text-slate-400">Media/settimana</div>
          </div>
        </div>
        {/* Pulsante Reset Statistiche con Modal Personalizzato */}
        <div className="flex justify-center mt-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowResetModal(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-lg px-4 py-2 text-xs shadow transition-all duration-200 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Resetta Statistiche
          </motion.button>
        </div>
      </div>

      {/* Quick Start */}
      {quickWorkouts.length > 0 ? (
        <div>
          <h3 className="text-lg font-poppins font-semibold text-white mb-4">I Tuoi Allenamenti</h3>
          <div className="grid gap-4">
            {quickWorkouts.map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{workout.title}</h4>
                    <p className="text-sm text-slate-400">
                      {workout.exercises?.length || 0} esercizi
                    </p>
                  </div>
                  <button 
                    onClick={() => handleStartSpecificWorkout(workout)}
                    className="accent-gradient text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Inizia
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-effect rounded-2xl p-6 text-center">
          <h3 className="text-lg font-poppins font-semibold text-white mb-2">
            Nessun Allenamento
          </h3>
          <p className="text-slate-400 mb-4">
            Crea il tuo primo allenamento per iniziare!
          </p>
          <button 
            onClick={() => onTabChange('workouts')}
            className="accent-gradient text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
          >
            Crea Allenamento
          </button>
        </div>
      )}

      {/* Recent Workouts */}
      {recentWorkouts.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-poppins font-semibold text-white">Allenamenti Recenti</h3>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowClearModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-xs shadow transition-all duration-200 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Elimina Cronologia
            </motion.button>
          </div>
          <div className="space-y-3">
            {recentWorkouts.map((session) => (
              <div key={session.id} className="workout-card">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{session.workout_title}</h4>
                    <p className="text-sm text-slate-400">
                      {new Date(session.start_time).toLocaleDateString('it-IT')} • {Math.round((session.total_duration || 0) / 60)} min
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-400 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Completato
                    </div>
                    <div className="text-xs text-slate-500">
                      {session.end_time ? new Date(session.end_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {workoutSessions.length === 0 && (
        <div className="glass-effect rounded-2xl p-6 text-center">
          <h3 className="text-lg font-poppins font-semibold text-white mb-2 flex items-center justify-center gap-2">
            <Rocket className="w-5 h-5" />
            Inizia il Tuo Viaggio Fitness
          </h3>
          <p className="text-slate-400">
            Crea il tuo primo allenamento e inizia a tracciare i tuoi progressi!
          </p>
        </div>
      )}

      {/* Modal Reset Statistiche */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Statistiche"
        message="Sei sicuro di voler resettare tutte le statistiche? Questa azione eliminerà tutti i dati degli allenamenti completati."
        confirmText="Resetta"
        confirmColor="orange"
        onConfirm={handleResetStats}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Modal Elimina Cronologia */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Elimina Cronologia"
        message="Sei sicuro di voler eliminare tutta la cronologia degli allenamenti? Questa azione non può essere annullata."
        confirmText="Elimina"
        confirmColor="red"
        onConfirm={handleClearWorkouts}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
};

export default Dashboard;