
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const ExerciseProgress: React.FC = () => {
  const { workoutSessions } = useSupabaseAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  // Estrai tutti gli esercizi unici dalle sessioni
  const allExercises = useMemo(() => {
    const exerciseNames = new Set<string>();
    workoutSessions.forEach(session => {
      if (session.workout_title) {
        exerciseNames.add(session.workout_title);
      }
    });
    return Array.from(exerciseNames).sort();
  }, [workoutSessions]);

  // Calcola i dati per i grafici basati sul periodo selezionato
  const getProgressData = useMemo(() => {
    if (workoutSessions.length === 0) return [];

    const now = new Date();
    let periodData: any[] = [];

    switch (selectedPeriod) {
      case 'daily':
        // Ultimi 7 giorni
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(date);
          nextDate.setDate(date.getDate() + 1);
          
          const dayWorkouts = workoutSessions.filter(session => {
            const sessionDate = new Date(session.start_time);
            return sessionDate >= date && sessionDate < nextDate && 
                   (selectedExercise === '' || session.workout_title === selectedExercise);
          });
          
          periodData.push({
            period: date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
            workouts: dayWorkouts.length,
            totalDuration: dayWorkouts.reduce((sum, session) => sum + (session.total_duration || 0), 0),
            completed: dayWorkouts.filter(session => session.completed).length
          });
        }
        break;

      case 'weekly':
        // Ultime 4 settimane
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 7);
          
          const weekWorkouts = workoutSessions.filter(session => {
            const sessionDate = new Date(session.start_time);
            return sessionDate >= weekStart && sessionDate < weekEnd &&
                   (selectedExercise === '' || session.workout_title === selectedExercise);
          });
          
          periodData.push({
            period: `Sett ${4 - i}`,
            workouts: weekWorkouts.length,
            totalDuration: weekWorkouts.reduce((sum, session) => sum + (session.total_duration || 0), 0),
            completed: weekWorkouts.filter(session => session.completed).length
          });
        }
        break;

      case 'monthly':
        // Ultimi 3 mesi
        for (let i = 2; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
          
          const monthWorkouts = workoutSessions.filter(session => {
            const sessionDate = new Date(session.start_time);
            return sessionDate >= monthStart && sessionDate < monthEnd &&
                   (selectedExercise === '' || session.workout_title === selectedExercise);
          });
          
          periodData.push({
            period: monthStart.toLocaleDateString('it-IT', { month: 'short' }),
            workouts: monthWorkouts.length,
            totalDuration: monthWorkouts.reduce((sum, session) => sum + (session.total_duration || 0), 0),
            completed: monthWorkouts.filter(session => session.completed).length
          });
        }
        break;
    }

    return periodData;
  }, [workoutSessions, selectedPeriod, selectedExercise]);

  // Calcola statistiche del periodo
  const periodStats = useMemo(() => {
    const totalWorkouts = getProgressData.reduce((sum, period) => sum + period.workouts, 0);
    const totalDuration = getProgressData.reduce((sum, period) => sum + period.totalDuration, 0);
    const totalCompleted = getProgressData.reduce((sum, period) => sum + period.completed, 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    const completionRate = totalWorkouts > 0 ? Math.round((totalCompleted / totalWorkouts) * 100) : 0;

    return {
      totalWorkouts,
      totalDuration,
      avgDuration,
      completionRate
    };
  }, [getProgressData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-bold text-white">Progressi Dettagliati</h2>
      </div>

      {/* Filtri */}
      <div className="glass-effect rounded-xl p-4 space-y-4">
        {/* Periodo */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Periodo</label>
          <div className="flex space-x-2">
            {[
              { key: 'daily', label: 'Giornaliero' },
              { key: 'weekly', label: 'Settimanale' },
              { key: 'monthly', label: 'Mensile' }
            ].map(period => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period.key
                    ? 'accent-gradient text-white'
                    : 'text-slate-400 hover:text-white border border-slate-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Esercizio */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Esercizio (Opzionale)</label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="">Tutti gli esercizi</option>
            {allExercises.map(exercise => (
              <option key={exercise} value={exercise}>{exercise}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiche del periodo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-sky-blue mb-1">{periodStats.totalWorkouts}</div>
          <div className="text-sm text-slate-400">Allenamenti</div>
        </div>
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{periodStats.completionRate}%</div>
          <div className="text-sm text-slate-400">Completati</div>
        </div>
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{Math.round(periodStats.totalDuration / 60)}h</div>
          <div className="text-sm text-slate-400">Tempo Totale</div>
        </div>
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">{periodStats.avgDuration}min</div>
          <div className="text-sm text-slate-400">Durata Media</div>
        </div>
      </div>

      {/* Grafico */}
      {getProgressData.length > 0 ? (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="font-medium text-white mb-4">
            Andamento {selectedPeriod === 'daily' ? 'Giornaliero' : selectedPeriod === 'weekly' ? 'Settimanale' : 'Mensile'}
            {selectedExercise && ` - ${selectedExercise}`}
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="period" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Bar dataKey="workouts" fill="#1E90FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="glass-effect rounded-xl p-6 text-center">
          <h3 className="font-medium text-white mb-2">Nessun Dato Disponibile</h3>
          <p className="text-slate-400">
            {selectedExercise 
              ? `Nessun allenamento trovato per "${selectedExercise}" nel periodo selezionato.`
              : 'Completa alcuni allenamenti per vedere i progressi!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseProgress;
