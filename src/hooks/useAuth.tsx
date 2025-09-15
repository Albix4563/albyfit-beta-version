import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserData {
  workouts: Workout[];
  workoutHistory: WorkoutSession[];
  progress: ProgressData[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
  userId: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  notes: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  duration: number;
  exercises: CompletedExercise[];
  userId: string;
}

export interface CompletedExercise {
  exerciseId: string;
  name: string;
  sets: CompletedSet[];
}

export interface CompletedSet {
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface ProgressData {
  id: string;
  exerciseName: string;
  date: string;
  maxWeight: number;
  totalVolume: number;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  saveWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'userId'> | Workout) => void;
  deleteWorkout: (workoutId: string) => void;
  saveWorkoutSession: (session: Omit<WorkoutSession, 'id' | 'userId'>) => void;
  updateProgress: (exerciseName: string, weight: number, volume: number) => void;
  importWorkoutFromUrl: (url: string) => Promise<{ success: boolean; workout?: Workout; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>({
    workouts: [],
    workoutHistory: [],
    progress: []
  });

  // Carica dati all'avvio
  useEffect(() => {
    const savedUser = localStorage.getItem('albyfit_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id);
    }
  }, []);

  const loadUserData = (userId: string) => {
    const userDataKey = `albyfit_data_${userId}`;
    const savedData = localStorage.getItem(userDataKey);
    if (savedData) {
      setUserData(JSON.parse(savedData));
    } else {
      // Inizializza dati vuoti per nuovo utente
      setUserData({
        workouts: [],
        workoutHistory: [],
        progress: []
      });
    }
  };

  const saveUserData = (userId: string, data: UserData) => {
    const userDataKey = `albyfit_data_${userId}`;
    localStorage.setItem(userDataKey, JSON.stringify(data));
    setUserData(data);
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Controlla se l'utente esiste già
      const users = JSON.parse(localStorage.getItem('albyfit_users') || '[]');
      if (users.find((u: User) => u.email === email)) {
        return false; // Utente già esistente
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString()
      };

      // Salva utente e password
      users.push(newUser);
      localStorage.setItem('albyfit_users', JSON.stringify(users));
      
      const passwords = JSON.parse(localStorage.getItem('albyfit_passwords') || '{}');
      passwords[email] = password;
      localStorage.setItem('albyfit_passwords', JSON.stringify(passwords));

      // Imposta utente corrente
      setUser(newUser);
      localStorage.setItem('albyfit_user', JSON.stringify(newUser));
      
      // Inizializza dati vuoti
      loadUserData(newUser.id);
      
      return true;
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('albyfit_users') || '[]');
      const passwords = JSON.parse(localStorage.getItem('albyfit_passwords') || '{}');
      
      const user = users.find((u: User) => u.email === email);
      if (!user || passwords[email] !== password) {
        return false;
      }

      setUser(user);
      localStorage.setItem('albyfit_user', JSON.stringify(user));
      loadUserData(user.id);
      
      return true;
    } catch (error) {
      console.error('Errore durante il login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserData({ workouts: [], workoutHistory: [], progress: [] });
    localStorage.removeItem('albyfit_user');
  };

  const saveWorkout = (workoutData: Omit<Workout, 'id' | 'createdAt' | 'userId'> | Workout) => {
    if (!user) return;

    let workout: Workout;
    
    // Se è un workout esistente (ha id), aggiornalo
    if ('id' in workoutData) {
      workout = workoutData as Workout;
      const newUserData = {
        ...userData,
        workouts: userData.workouts.map(w => w.id === workout.id ? workout : w)
      };
      saveUserData(user.id, newUserData);
    } else {
      // Se è un nuovo workout, creane uno nuovo
      workout = {
        ...workoutData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userId: user.id
      };
      
      const newUserData = {
        ...userData,
        workouts: [...userData.workouts, workout]
      };
      saveUserData(user.id, newUserData);
    }
  };

  const deleteWorkout = (workoutId: string) => {
    if (!user) return;

    const newUserData = {
      ...userData,
      workouts: userData.workouts.filter(w => w.id !== workoutId)
    };

    saveUserData(user.id, newUserData);
  };

  const saveWorkoutSession = (sessionData: Omit<WorkoutSession, 'id' | 'userId'>) => {
    if (!user) return;

    const newSession: WorkoutSession = {
      ...sessionData,
      id: Date.now().toString(),
      userId: user.id
    };

    const newUserData = {
      ...userData,
      workoutHistory: [...userData.workoutHistory, newSession]
    };

    saveUserData(user.id, newUserData);
  };

  const updateProgress = (exerciseName: string, weight: number, volume: number) => {
    if (!user) return;

    const newProgress: ProgressData = {
      id: Date.now().toString(),
      exerciseName,
      date: new Date().toISOString(),
      maxWeight: weight,
      totalVolume: volume,
      userId: user.id
    };

    const newUserData = {
      ...userData,
      progress: [...userData.progress, newProgress]
    };

    saveUserData(user.id, newUserData);
  };

  const importWorkoutFromUrl = async (url: string): Promise<{ success: boolean; workout?: Workout; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Devi essere loggato per importare allenamenti' };
      }

      // Estrae il parametro workout dall'URL
      const urlObj = new URL(url);
      const workoutParam = urlObj.searchParams.get('workout');
      
      if (!workoutParam) {
        return { success: false, error: 'Link non valido: parametro workout mancante' };
      }

      // Decodifica e parsa il workout
      const decodedWorkout = decodeURIComponent(workoutParam);
      const importedWorkout = JSON.parse(decodedWorkout) as Workout;

      // Validazione basic del workout
      if (!importedWorkout.name || !importedWorkout.exercises || !Array.isArray(importedWorkout.exercises)) {
        return { success: false, error: 'Formato workout non valido' };
      }

      // Controlla se esiste già un workout con lo stesso nome
      const existingWorkout = userData.workouts.find(w => w.name === importedWorkout.name);
      if (existingWorkout) {
        return { success: false, error: `Esiste già un allenamento chiamato "${importedWorkout.name}"` };
      }

      // Salva il workout importato
      const workoutToSave = {
        name: importedWorkout.name,
        exercises: importedWorkout.exercises
      };

      saveWorkout(workoutToSave);

      return { success: true, workout: importedWorkout };

    } catch (error) {
      console.error('Errore durante importazione workout:', error);
      return { success: false, error: 'Errore durante l\'importazione: formato non valido' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      login,
      register,
      logout,
      saveWorkout,
      deleteWorkout,
      saveWorkoutSession,
      updateProgress,
      importWorkoutFromUrl
    }}>
      {children}
    </AuthContext.Provider>
  );
};
