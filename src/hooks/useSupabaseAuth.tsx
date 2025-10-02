import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface ExerciseSet {
  id: string;
  set_number: number;
  reps: number;
  target_weight?: number;
  notes?: string;
  machine?: string;
}

export interface Exercise {
  id: string;
  name: string;
  rest_time: number;
  notes: string;
  workout_id?: string;
  order_index?: number;
  day?: string;
  machine?: string;
  sets?: ExerciseSet[];
}

export interface ExerciseNote {
  id: string;
  exercise_name: string;
  note: string;
  date: string;
  user_id: string;
  created_at: string;
}

export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  created_at: string;
  days?: WorkoutDay[];
  exercises?: Exercise[];
}

export interface WorkoutSession {
  id: string;
  workout_id?: string;
  workout_title: string;
  start_time: string;
  end_time?: string;
  total_duration?: number;
  completed: boolean;
  user_id: string;
}

interface AuthContextType {
  user: User | null;
  workouts: Workout[];
  workoutSessions: WorkoutSession[];
  exerciseNotes: ExerciseNote[];
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  saveWorkout: (workout: Omit<Workout, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  saveWorkoutSession: (session: Omit<WorkoutSession, 'id' | 'user_id'>) => Promise<void>;
  saveExerciseNote: (note: Omit<ExerciseNote, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  getExerciseNotes: (exerciseName: string, date?: string) => ExerciseNote[];
  resetUserData: () => Promise<void>;
  resetAllUserData: () => Promise<void>;
  loadWorkouts: () => Promise<void>;
  loadWorkoutSessions: () => Promise<void>;
  loadExerciseNotes: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [exerciseNotes, setExerciseNotes] = useState<ExerciseNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadWorkouts();
      loadWorkoutSessions();
      loadExerciseNotes();
    } else {
      setWorkouts([]);
      setWorkoutSessions([]);
      setExerciseNotes([]);
    }
  }, [user]);

  const signUp = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force local sign out even if server fails
      setUser(null);
      setWorkouts([]);
      setWorkoutSessions([]);
      setExerciseNotes([]);
    }
  };

  const resetUserData = async (): Promise<void> => {
    if (!user) return;

    try {
      // Elimina tutte le sessioni di allenamento dell'utente
      const { error: sessionsError } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('user_id', user.id);

      if (sessionsError) {
        console.error('Errore nell\'eliminazione delle sessioni:', sessionsError);
        throw sessionsError;
      }

      // Elimina tutte le note degli esercizi dell'utente
      const { error: notesError } = await supabase
        .from('exercise_notes')
        .delete()
        .eq('user_id', user.id);

      if (notesError) {
        console.error('Errore nell\'eliminazione delle note:', notesError);
        throw notesError;
      }

      // Ricarica i dati per riflettere i cambiamenti
      await loadWorkoutSessions();
      await loadExerciseNotes();
      
      // Le schede di allenamento rimangono intatte
      console.log('Dati utente resettati con successo');
    } catch (error) {
      console.error('Errore nel reset dei dati utente:', error);
      throw error;
    }
  };

  const resetAllUserData = async (): Promise<void> => {
    if (!user) return;

    try {
      // Get workout session IDs first
      const { data: workoutSessionsData } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('user_id', user.id);

      const sessionIds = workoutSessionsData?.map(session => session.id) || [];

      // Prima elimina le sessioni degli esercizi (dipendono dalle sessioni di allenamento)
      if (sessionIds.length > 0) {
        const { error: sessionExercisesError } = await supabase
          .from('session_exercises')
          .delete()
          .in('session_id', sessionIds);

        if (sessionExercisesError) {
          console.error('Errore nell\'eliminazione degli esercizi delle sessioni:', sessionExercisesError);
          throw sessionExercisesError;
        }
      }

      // Elimina tutte le sessioni di allenamento dell'utente
      const { error: sessionsError } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('user_id', user.id);

      if (sessionsError) {
        console.error('Errore nell\'eliminazione delle sessioni:', sessionsError);
        throw sessionsError;
      }

      // Elimina tutte le note degli esercizi dell'utente
      const { error: notesError } = await supabase
        .from('exercise_notes')
        .delete()
        .eq('user_id', user.id);

      if (notesError) {
        console.error('Errore nell\'eliminazione delle note:', notesError);
        throw notesError;
      }

      // Get workout IDs first
      const { data: workoutsData } = await supabase
        .from('workouts')
        .select('id')
        .eq('user_id', user.id);

      const workoutIds = workoutsData?.map(workout => workout.id) || [];

      // Elimina tutti gli esercizi delle schede dell'utente
      if (workoutIds.length > 0) {
        const { error: exercisesError } = await supabase
          .from('exercises')
          .delete()
          .in('workout_id', workoutIds);

        if (exercisesError) {
          console.error('Errore nell\'eliminazione degli esercizi:', exercisesError);
          throw exercisesError;
        }
      }

      // Elimina tutte le schede di allenamento dell'utente
      const { error: workoutsError } = await supabase
        .from('workouts')
        .delete()
        .eq('user_id', user.id);

      if (workoutsError) {
        console.error('Errore nell\'eliminazione delle schede:', workoutsError);
        throw workoutsError;
      }

      // Ricarica tutti i dati per riflettere i cambiamenti
      await loadWorkouts();
      await loadWorkoutSessions();
      await loadExerciseNotes();
      
      console.log('Tutti i dati utente sono stati resettati con successo - l\'utente è come appena registrato');
    } catch (error) {
      console.error('Errore nel reset completo dei dati utente:', error);
      throw error;
    }
  };

  const loadWorkouts = async () => {
    if (!user) return;

    try {
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises (
            *,
            exercise_sets (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (workoutsError) {
        console.error('Error loading workouts:', workoutsError);
        return;
      }

      const transformedWorkouts: Workout[] = (workoutsData || []).map(workout => {
        const exercises = (workout.exercises || []).map((exercise: any) => ({
          ...exercise,
          sets: (exercise.exercise_sets || []).sort((a: any, b: any) => a.set_number - b.set_number)
        }));

        const hasDays = exercises.some(ex => ex.day);
        let days: WorkoutDay[] | undefined = undefined;
        if (hasDays) {
          const dayMap: { [day: string]: Exercise[] } = {};
          exercises.forEach(ex => {
            const dayLabel = ex.day || 'Giorno 1';
            if (!dayMap[dayLabel]) dayMap[dayLabel] = [];
            dayMap[dayLabel].push(ex);
          });
          days = Object.entries(dayMap).map(([day, exs]) => ({ day, exercises: exs }));
        }

        return {
          ...workout,
          exercises,
          days
        };
      });

      setWorkouts(transformedWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const loadWorkoutSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error loading workout sessions:', error);
        return;
      }

      setWorkoutSessions(data || []);
    } catch (error) {
      console.error('Error loading workout sessions:', error);
    }
  };

  const loadExerciseNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('exercise_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading exercise notes:', error);
        return;
      }

      // Safely cast the data to ExerciseNote[] since we know the structure
      const exerciseNotesData = (data || []) as ExerciseNote[];
      setExerciseNotes(exerciseNotesData);
    } catch (error) {
      console.error('Error loading exercise notes:', error);
    }
  };

  const saveWorkout = async (workoutData: Omit<Workout, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data: workoutResult, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          title: workoutData.title,
          description: workoutData.description,
          user_id: user.id
        })
        .select()
        .single();

      if (workoutError) {
        console.error('Error saving workout:', workoutError);
        return;
      }

      let allExercises: Exercise[] = [];
      if (workoutData.days && workoutData.days.length > 0) {
        workoutData.days.forEach((dayObj) => {
          dayObj.exercises.forEach((ex) => {
            allExercises.push({ ...ex, day: dayObj.day });
          });
        });
      } else if (workoutData.exercises && workoutData.exercises.length > 0) {
        allExercises = workoutData.exercises;
      }

      if (allExercises.length > 0) {
        const exercisesToInsert = allExercises.map((exercise, index) => ({
          name: exercise.name,
          rest_time: exercise.rest_time,
          notes: exercise.notes || '',
          machine: exercise.machine || null,
          workout_id: workoutResult.id,
          order_index: index,
          day: exercise.day || null
        }));

        const { data: insertedExercises, error: exercisesError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert)
          .select();

        if (exercisesError) {
          console.error('Error saving exercises:', exercisesError);
          return;
        }

        // Now save the exercise sets
        for (const [exerciseIndex, exercise] of allExercises.entries()) {
          if (exercise.sets && exercise.sets.length > 0) {
            const setsToInsert = exercise.sets.map((set) => ({
              exercise_id: insertedExercises[exerciseIndex].id,
              set_number: set.set_number,
              reps: set.reps,
              target_weight: set.target_weight,
              notes: set.notes,
              machine: exercise.machine || null
            }));

            const { error: setsError } = await supabase
              .from('exercise_sets')
              .insert(setsToInsert);

            if (setsError) {
              console.error('Error saving exercise sets:', setsError);
            }
          }
        }
      }

      await loadWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };  const updateWorkout = async (workout: Workout) => {
    if (!user) return;

    try {
      const { error: workoutError } = await supabase
        .from('workouts')
        .update({
          title: workout.title,
          description: workout.description
        })
        .eq('id', workout.id);

      if (workoutError) {
        console.error('Error updating workout:', workoutError);
        return;
      }

      // Delete existing exercises and their sets
      await supabase
        .from('exercises')
        .delete()
        .eq('workout_id', workout.id);

      let allExercises: Exercise[] = [];
      if (workout.days && workout.days.length > 0) {
        workout.days.forEach((dayObj) => {
          dayObj.exercises.forEach((ex) => {
            allExercises.push({ ...ex, day: dayObj.day });
          });
        });
      } else if (workout.exercises && workout.exercises.length > 0) {
        allExercises = workout.exercises;
      }

      if (allExercises.length > 0) {
        const exercisesToInsert = allExercises.map((exercise, index) => ({
          name: exercise.name,
          rest_time: exercise.rest_time,
          notes: exercise.notes || '',
          machine: exercise.machine || null,
          workout_id: workout.id,
          order_index: index,
          // day: exercise.day || null // Temporarily commented out for debugging
        }));

        const { data: insertedExercises, error: exercisesError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert)
          .select();

        if (exercisesError) {
          console.error('Error updating exercises:', exercisesError);
          return;
        }

        // Save the exercise sets
        for (const [exerciseIndex, exercise] of allExercises.entries()) {
          if (exercise.sets && exercise.sets.length > 0) {
            const setsToInsert = exercise.sets.map((set) => ({
              exercise_id: insertedExercises[exerciseIndex].id,
              set_number: set.set_number,
              reps: set.reps,
              target_weight: set.target_weight,
              notes: set.notes,
              machine: exercise.machine || null
            }));

            const { error: setsError } = await supabase
              .from('exercise_sets')
              .insert(setsToInsert);

            if (setsError) {
              console.error('Error updating exercise sets:', setsError);
            }
          }
        }
      }

      await loadWorkouts();
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);

      if (error) {
        console.error('Error deleting workout:', error);
        return;
      }

      await loadWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const saveWorkoutSession = async (sessionData: Omit<WorkoutSession, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .insert({
          workout_id: sessionData.workout_id,
          workout_title: sessionData.workout_title,
          start_time: sessionData.start_time,
          end_time: sessionData.end_time,
          total_duration: sessionData.total_duration,
          completed: sessionData.completed,
          user_id: user.id
        });

      if (error) {
        console.error('Error saving workout session:', error);
        return;
      }

      await loadWorkoutSessions();
    } catch (error) {
      console.error('Error saving workout session:', error);
    }
  };

  const saveExerciseNote = async (noteData: Omit<ExerciseNote, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('exercise_notes')
        .insert({
          exercise_name: noteData.exercise_name,
          note: noteData.note,
          date: noteData.date,
          user_id: user.id
        });

      if (error) {
        console.error('Error saving exercise note:', error);
        return;
      }

      await loadExerciseNotes();
    } catch (error) {
      console.error('Error saving exercise note:', error);
    }
  };

  const getExerciseNotes = (exerciseName: string, date?: string): ExerciseNote[] => {
    return exerciseNotes.filter(note => {
      const nameMatch = note.exercise_name.toLowerCase() === exerciseName.toLowerCase();
      const dateMatch = date ? note.date === date : true;
      return nameMatch && dateMatch;
    });
  };

  const refreshAuth = async () => {
    await Promise.all([
      loadWorkouts(),
      loadWorkoutSessions(),
      loadExerciseNotes()
    ]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      workouts,
      workoutSessions,
      exerciseNotes,
      loading,
      signUp,
      signIn,
      signOut,
      saveWorkout,
      updateWorkout,
      deleteWorkout,
      saveWorkoutSession,
      saveExerciseNote,
      getExerciseNotes,
      resetUserData,
      resetAllUserData,
      loadWorkouts,
      loadWorkoutSessions,
      loadExerciseNotes,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
