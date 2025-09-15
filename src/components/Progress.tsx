import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import ExerciseProgress from './ExerciseProgress';
import { Trophy } from 'lucide-react';

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');
  const [activeChart, setActiveChart] = useState('volume');
  const { workoutSessions } = useSupabaseAuth();

  // Calcola dati dalle sessioni di allenamento
  const calculateVolumeData = () => {
    if (workoutSessions.length === 0) return [];
    
    // Prende le ultime 5 sessioni e calcola un volume approssimativo
    const volumeData = workoutSessions
      .slice(-5)
      .map(session => ({
        date: new Date(session.start_time).toLocaleDateString('it-IT', { 
          day: 'numeric', 
          month: 'short' 
        }),
        volume: session.total_duration || 0 // Usiamo la durata come proxy per il volume
      }));
    
    return volumeData;
  };

  const calculateFrequencyData = () => {
    if (workoutSessions.length === 0) return [];
    
    // Raggruppa per settimana
    const last4Weeks = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const workoutsInWeek = workoutSessions.filter(session => {
        const sessionDate = new Date(session.start_time);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      }).length;
      
      last4Weeks.push({
        week: `Sett ${4 - i}`,
        workouts: workoutsInWeek
      });
    }
    
    return last4Weeks;
  };

  const volumeData = calculateVolumeData();
  const frequencyData = calculateFrequencyData();

  // Calcola statistiche
  const totalWorkouts = workoutSessions.length;
  const thisWeekWorkouts = workoutSessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return sessionDate >= weekStart;
  }).length;

  const avgDuration = workoutSessions.length > 0 
    ? Math.round(workoutSessions.reduce((sum, session) => sum + (session.total_duration || 0), 0) / workoutSessions.length)
    : 0;

  // Calcola streak
  const calculateStreak = () => {
    if (workoutSessions.length === 0) return 0;
    
    const sortedSessions = [...workoutSessions]
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
    
    let streak = 0;
    let lastDate = new Date();
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.start_time);
      const daysDiff = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        streak++;
        lastDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  const stats = [
    { label: 'Allenamenti Totali', value: totalWorkouts.toString(), change: totalWorkouts > 0 ? 'Ottimo!' : 'Inizia ora' },
    { label: 'Questa Settimana', value: thisWeekWorkouts.toString(), change: thisWeekWorkouts > 0 ? '+' + thisWeekWorkouts : 'Nessuno' },
    { label: 'Durata Media', value: avgDuration > 0 ? `${avgDuration} min` : '0 min', change: avgDuration > 0 ? 'Costante' : 'N/A' },
    { label: 'Streak Attuale', value: currentStreak > 0 ? `${currentStreak} giorni` : '0 giorni', change: currentStreak > 0 ? 'Bravo!' : 'Ricomincia' }
  ];

  // Trova gli allenamenti completati recenti
  const getRecentAchievements = () => {
    if (workoutSessions.length === 0) return [];
    
    return workoutSessions
      .filter(session => session.completed)
      .slice(-3)
      .reverse()
      .map(session => ({
        title: 'Allenamento Completato',
        desc: `${session.workout_title}: ${session.total_duration || 0} min`,
        date: new Date(session.start_time).toLocaleDateString('it-IT')
      }));
  };

  const achievements = getRecentAchievements();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-bold text-white">Monitoraggio Progressi</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'accent-gradient text-white' 
                : 'text-slate-400 hover:text-white border border-slate-600'
            }`}
          >
            Panoramica
          </button>
          <button 
            onClick={() => setActiveTab('detailed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'detailed' 
                ? 'accent-gradient text-white' 
                : 'text-slate-400 hover:text-white border border-slate-600'
            }`}
          >
            Dettagliati
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-sky-blue mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
                <div className="text-xs text-green-400">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Mostra grafici solo se ci sono dati */}
          {workoutSessions.length > 0 ? (
            <>
              {/* Chart Selection */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveChart('volume')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    activeChart === 'volume' 
                      ? 'accent-gradient text-white' 
                      : 'text-slate-400 hover:text-white border border-slate-600'
                  }`}
                >
                  Volume
                </button>
                <button 
                  onClick={() => setActiveChart('frequency')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    activeChart === 'frequency' 
                      ? 'accent-gradient text-white' 
                      : 'text-slate-400 hover:text-white border border-slate-600'
                  }`}
                >
                  Frequenza
                </button>
              </div>

              {/* Charts */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="font-medium text-white mb-4">
                  {activeChart === 'volume' ? 'Volume di Allenamento nel Tempo' : 'Frequenza Settimanale degli Allenamenti'}
                </h3>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeChart === 'volume' ? (
                      <LineChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Line 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="#1E90FF" 
                          strokeWidth={3}
                          dot={{ fill: '#1E90FF', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={frequencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="week" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Bar dataKey="workouts" fill="#1E90FF" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-effect rounded-2xl p-6 text-center">
              <h3 className="font-medium text-white mb-2">Nessun Dato Disponibile</h3>
              <p className="text-slate-400 mb-4">
                Completa il tuo primo allenamento per vedere i grafici dei progressi!
              </p>
            </div>
          )}

          {/* Recent Achievements */}
          {achievements.length > 0 ? (
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="font-medium text-white mb-4">Traguardi Recenti</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium text-white">{achievement.title}</div>
                      <div className="text-sm text-slate-400">{achievement.desc}</div>
                      <div className="text-xs text-slate-500">{achievement.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-effect rounded-2xl p-6 text-center">
              <h3 className="font-medium text-white mb-2">Nessun Traguardo</h3>
              <p className="text-slate-400">
                I tuoi record personali appariranno qui dopo aver completato degli allenamenti!
              </p>
            </div>
          )}
        </>
      ) : (
        <ExerciseProgress />
      )}
    </div>
  );
};

export default Progress;
