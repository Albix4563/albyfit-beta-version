
import React from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Check, Rocket } from 'lucide-react';

interface DashboardProps {
  onStartWorkout: (workout?: any) => void;
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartWorkout, onTabChange }) => {
  const { workouts, workoutSessions, user } = useSupabaseAuth();

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
          </p>          <button 
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
          <h3 className="text-lg font-poppins font-semibold text-white mb-4">Allenamenti Recenti</h3>
          <div className="space-y-3">
            {recentWorkouts.map((session) => (
              <div key={session.id} className="workout-card">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{session.workout_title}</h4>
                    <p className="text-sm text-slate-400">
                      {new Date(session.start_time).toLocaleDateString('it-IT')} • {Math.round((session.total_duration || 0) / 60)} min
                    </p>
                  </div>                  <div className="text-right">
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

      {/* Motivational Message */}      {workoutSessions.length === 0 && (
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
    </div>
  );
};

export default Dashboard;
