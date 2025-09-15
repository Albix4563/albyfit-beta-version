import React, { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Trophy, 
  User, 
  Settings, 
  Dumbbell, 
  BookOpen, 
  LogOut,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

interface ProfileProps {
  onTabChange?: (tab: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onTabChange }) => {
  const { user, workoutSessions, workouts, signOut, resetUserData, resetAllUserData } = useSupabaseAuth();
  const { toast } = useToast();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showCompleteResetDialog, setShowCompleteResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Calcola statistiche reali
  const totalWorkouts = workoutSessions.filter(session => session.completed).length;
  
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
  
  // Calcola durata media degli allenamenti
  const completedSessions = workoutSessions.filter(session => session.completed && session.total_duration);
  const avgDuration = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((sum, session) => sum + (session.total_duration || 0), 0) / completedSessions.length / 60)
    : 0;

  // Data di iscrizione (prima sessione o data utente)
  const joinDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
    : 'N/A';

  // Nome utente e iniziali
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utente';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  // Allenamenti più frequenti (top 3)
  const workoutFrequency = workoutSessions.reduce((acc, session) => {
    if (session.completed && session.workout_title) {
      acc[session.workout_title] = (acc[session.workout_title] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topWorkouts = Object.entries(workoutFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Statistiche mensili
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const thisMonthWorkouts = workoutSessions.filter(session => 
    session.completed && new Date(session.start_time) >= thisMonth
  ).length;

  const handleSignOut = async () => {
    await signOut();
  };
  const handleQuickAction = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await resetUserData();
      setShowResetDialog(false);
      // Mostro un feedback di successo
      toast({
        title: "Dati resettati",
        description: "Dati resettati con successo! Le tue schede di allenamento sono state conservate.",
      });
    } catch (error) {
      console.error('Errore nel reset dei dati:', error);
      toast({
        title: "Errore",
        description: "Errore durante il reset dei dati. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleCompleteReset = async () => {
    setIsResetting(true);
    try {
      await resetAllUserData();
      setShowCompleteResetDialog(false);
      // Mostro un feedback di successo
      toast({
        title: "Reset completo",
        description: "Reset completo eseguito con successo! Il tuo account è stato riportato allo stato iniziale.",
      });
    } catch (error) {
      console.error('Errore nel reset completo:', error);
      toast({
        title: "Errore",
        description: "Errore durante il reset completo. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-poppins font-bold text-white">Profilo</h2>
        <p className="text-xs text-slate-500">Created by Albix4563</p>
      </div>

      {/* User Info */}
      <div className="glass-effect rounded-2xl p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{initials}</span>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">{fullName}</h3>
        <p className="text-slate-400 mb-4">Membro da {joinDate}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-blue">{totalWorkouts}</div>
            <div className="text-sm text-slate-400">Allenamenti Totali</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-blue">{currentStreak}</div>
            <div className="text-sm text-slate-400">Giorni di Streak</div>
          </div>
        </div>
      </div>      {/* Statistics */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          <span>Statistiche</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-green-400">{thisMonthWorkouts}</div>
            <div className="text-xs text-slate-400">Questo Mese</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-purple-400">{avgDuration}min</div>
            <div className="text-xs text-slate-400">Durata Media</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-yellow-400">{workouts.length}</div>
            <div className="text-xs text-slate-400">Schede Create</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-blue-400">{Math.round(totalWorkouts / Math.max(1, Math.ceil((Date.now() - new Date(user?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 7))))}</div>
            <div className="text-xs text-slate-400">Media/Settimana</div>
          </div>
        </div>
      </div>

      {/* Top Workouts */}
      {topWorkouts.length > 0 && (        <div className="glass-effect rounded-2xl p-6">
          <h3 className="font-medium text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>Allenamenti Preferiti</span>
          </h3>
          <div className="space-y-3">
            {topWorkouts.map(([workoutName, count], index) => (
              <div key={workoutName} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sky-blue font-bold">#{index + 1}</span>
                  <span className="text-white">{workoutName}</span>
                </div>
                <span className="text-sky-blue font-medium">{count} volte</span>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Account Info */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          <span>Informazioni Account</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
            <span className="text-slate-300">Email</span>
            <span className="text-white text-sm">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
            <span className="text-slate-300">Account creato</span>
            <span className="text-white text-sm">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('it-IT') : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
            <span className="text-slate-300">Ultimo accesso</span>
            <span className="text-white text-sm">
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('it-IT') : 'N/A'}
            </span>
          </div>
        </div>
      </div>      {/* Quick Actions */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span>Azioni Rapide</span>
        </h3>
        <div className="space-y-3">          <button 
            onClick={() => handleQuickAction('workouts')}
            className="w-full text-left p-3 text-slate-300 hover:bg-slate-700/30 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              <span>Gestisci Allenamenti</span>
            </div>
          </button>
          <button 
            onClick={() => handleQuickAction('progress')}
            className="w-full text-left p-3 text-slate-300 hover:bg-slate-700/30 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Visualizza Progressi</span>
            </div>
          </button>
          <button 
            onClick={() => handleQuickAction('wiki')}
            className="w-full text-left p-3 text-slate-300 hover:bg-slate-700/30 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Enciclopedia Esercizi</span>
            </div>
          </button>
        </div>
      </div>

      <ThemeSwitcher />

      {/* Data Management */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="font-medium text-white mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          <span>Gestione Dati</span>
        </h3>
        <div className="space-y-3">
          <button 
            onClick={() => setShowResetDialog(true)}
            className="w-full text-left p-3 text-orange-300 hover:bg-orange-500/10 rounded-lg transition-colors border border-orange-500/30"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium">Reset Statistiche</div>
                <div className="text-xs text-orange-400">Elimina sessioni e note, mantiene le schede</div>
              </div>
            </div>
          </button>
          <button 
            onClick={() => setShowCompleteResetDialog(true)}
            className="w-full text-left p-3 text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium">Reset Completo</div>
                <div className="text-xs text-red-400">Elimina tutto - come utente appena registrato</div>
              </div>
            </div>
          </button>        </div>
      </div>

      <button 
        onClick={handleSignOut}
        className="w-full border border-red-500/50 text-red-400 py-3 rounded-xl font-medium hover:bg-red-500/10 transition-colors"
      >
        <div className="flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          <span>Esci</span>
        </div>
      </button>

      {/* Dialog Reset Statistiche */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Reset Statistiche</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Questa azione eliminerà:
            </p>
            <ul className="text-sm text-slate-400 mb-6 space-y-1">
              <li>• Tutte le sessioni di allenamento completate</li>
              <li>• Tutte le note degli esercizi</li>
              <li>• Tutto lo storico delle performance</li>
            </ul>
            <p className="text-sm text-orange-300 mb-6">
              ✅ Le tue schede di allenamento saranno conservate
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetDialog(false)}
                disabled={isResetting}
                className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/30 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleResetData}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isResetting ? 'Resettando...' : 'Conferma Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Reset Completo */}
      {showCompleteResetDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Reset Completo</h3>
            </div>
            <p className="text-slate-300 mb-4">
              ⚠️ <strong>ATTENZIONE:</strong> Questa azione eliminerà tutto:
            </p>
            <ul className="text-sm text-slate-400 mb-6 space-y-1">
              <li>• Tutte le schede di allenamento create</li>
              <li>• Tutti gli esercizi delle schede</li>
              <li>• Tutte le sessioni di allenamento</li>
              <li>• Tutte le note degli esercizi</li>
              <li>• Tutto lo storico delle performance</li>
            </ul>
            <p className="text-sm text-red-300 mb-6">
              Il tuo account tornerà allo stato iniziale, come se fossi appena registrato.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteResetDialog(false)}
                disabled={isResetting}
                className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/30 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleCompleteReset}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isResetting ? 'Resettando...' : 'Elimina Tutto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
