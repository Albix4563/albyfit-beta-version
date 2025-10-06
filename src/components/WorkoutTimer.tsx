import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import ExerciseNotes from './ExerciseNotes';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  StickyNote, 
  AlertTriangle, 
  Youtube, 
  Image, 
  Eye, 
  Edit, 
  RotateCcw, 
  FileText, 
  Clipboard, 
  Lightbulb, 
  Check,
  SkipForward,
  Dumbbell
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets?: Array<{
    id: string;
    set_number: number;
    reps: number;
    target_weight?: number;
    notes?: string;
  }>;
  rest_time: number;
  notes: string;
}

interface WorkoutDay {
  day: string;
  exercises: Exercise[];
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  days?: WorkoutDay[];
}

interface WorkoutTimerProps {
  onComplete: () => void;
  workout?: Workout;
}

type WorkoutPhase = 'main' | 'skipped';

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ onComplete, workout }) => {
  // Refs for cleanup and preventing memory leaks
  const isMountedRef = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteCalledRef = useRef(false);
  
  // Core workout state
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([]);
  const [currentDisplayExercise, setCurrentDisplayExercise] = useState<Exercise | null>(null);
  
  // Exercise navigation state
  const [currentExerciseGlobalIndex, setCurrentExerciseGlobalIndex] = useState(0);
  const [currentSkippedPhaseIndex, setCurrentSkippedPhaseIndex] = useState(0);
  
  // Set management state
  const [currentSet, setCurrentSet] = useState(1);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  
  // Timer state
  const [isResting, setIsResting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cardioTimeElapsed, setCardioTimeElapsed] = useState(0);
  const [isDoingCardio, setIsDoingCardio] = useState(false);
  
  // Workout session state
  const [workoutStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [skippedExerciseIds, setSkippedExerciseIds] = useState<Set<string>>(new Set());
  const [completedExerciseIds, setCompletedExerciseIds] = useState<Set<string>>(new Set());
  const [workoutPhase, setWorkoutPhase] = useState<WorkoutPhase>('main');
  
  // UI state
  const [showNotes, setShowNotes] = useState(false);
  const [showEndWorkoutDialog, setShowEndWorkoutDialog] = useState(false);
  const [modifiedWeights, setModifiedWeights] = useState<{[exerciseId: string]: {[setIndex: number]: number}}>({});
  const [showWeightEditor, setShowWeightEditor] = useState(false);
  const [tempWeight, setTempWeight] = useState<string>('');

  const { toast } = useToast();
  
  // CRITICAL SECURITY: Only import session and note functions - NEVER workout modification functions
  const { saveWorkoutSession, saveExerciseNote, getExerciseNotes } = useSupabaseAuth();

  // Day selection for multi-day workouts
  const days = workout?.days?.map(d => d.day) || ["Giorno 1"];
  const [selectedDay, setSelectedDay] = useState<string>(days[0]);
  const workoutName = workout?.name || 'Allenamento';

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  }, []);

  // Initialize workout exercises when workout or selectedDay changes
  useEffect(() => {
    if (!workout) return;
    
    let exercises: Exercise[] = [];
    if (workout?.days && workout.days.length > 0) {
      const dayObj = workout.days.find(d => d.day === selectedDay);
      exercises = dayObj ? dayObj.exercises : [];
    } else if (workout?.exercises) {
      exercises = workout.exercises;
    }
    
    // Make a deep copy to avoid any reference issues
    const exercisesCopy = JSON.parse(JSON.stringify(exercises));
    
    setWorkoutExercises(exercisesCopy);
    setCurrentDisplayExercise(exercisesCopy[0] || null);
    setCurrentSet(1);
    setCurrentSetIndex(0);
    setSkippedExerciseIds(new Set());
    setCompletedExerciseIds(new Set());
    setWorkoutPhase('main');
    setCurrentSkippedPhaseIndex(0);
    setModifiedWeights({});
    setShowWeightEditor(false);
    setTempWeight('');
    setIsResting(false);
    setIsActive(false);
    setCardioTimeElapsed(0);
    setIsDoingCardio(false);
    setTimeRemaining(0);
  }, [workout, selectedDay]);

  // Timer effect
  useEffect(() => {
    cleanup();
    
    if (isActive && timeRemaining > 0 && isMountedRef.current) {
      timerRef.current = setInterval(() => {
        if (!isMountedRef.current) return;
        
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsActive(false);
            setIsResting(false);
            setIsDoingCardio(false);
            playNotificationSound();
            return 0;
          }
          return newTime;
        });
        
        if (isDoingCardio) {
          setCardioTimeElapsed(prev => prev + 1);
        }
      }, 1000);
    }
    
    return cleanup;
  }, [isActive, timeRemaining > 0, isDoingCardio, cleanup]);

  // Current time update effect
  useEffect(() => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
    
    timeIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentTime(Date.now());
      }
    }, 1000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    };
  }, []);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Helper functions
  const getCurrentlySkippedExercises = useCallback(() => {
    return workoutExercises.filter(ex => skippedExerciseIds.has(ex.id) && !completedExerciseIds.has(ex.id));
  }, [workoutExercises, skippedExerciseIds, completedExerciseIds]);

  const getCurrentSet = useCallback(() => {
    if (!currentDisplayExercise?.sets || currentDisplayExercise.sets.length === 0) {
      return { set_number: 1, reps: 10, target_weight: undefined };
    }
    const originalSet = currentDisplayExercise.sets[currentSetIndex] || currentDisplayExercise.sets[0];
    
    const modifiedWeight = modifiedWeights[currentDisplayExercise.id]?.[currentSetIndex];
    if (modifiedWeight !== undefined) {
      return { ...originalSet, target_weight: modifiedWeight };
    }
    
    return originalSet;
  }, [currentDisplayExercise, currentSetIndex, modifiedWeights]);

  const getTotalSets = useCallback(() => {
    return currentDisplayExercise?.sets?.length || 1;
  }, [currentDisplayExercise]);

  const isCardioExercise = currentDisplayExercise?.notes?.startsWith('Cardio -') || false;

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }, []);

  // Search functions
  const openYouTubeSearch = useCallback((exerciseName: string) => {
    const query = encodeURIComponent(`${exerciseName} esercizio forma tutorial`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  }, []);

  const openGoogleImageSearch = useCallback((exerciseName: string) => {
    const query = encodeURIComponent(`${exerciseName} esercizio fitness muscoli`);
    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
  }, []);

  // Safe onComplete function - GUARANTEED to only call onComplete
  const safeOnComplete = useCallback(() => {
    if (onCompleteCalledRef.current || !isMountedRef.current) return;
    onCompleteCalledRef.current = true;
    
    cleanup();
    
    // SECURITY: ONLY call onComplete to return to previous screen - NO DATA MODIFICATIONS
    setTimeout(() => {
      onComplete();
    }, 0);
  }, [onComplete, cleanup]);

  // ULTIMATE SECURITY: This function is COMPLETELY ISOLATED from workout modification
  const endWorkoutSession = useCallback(async () => {
    if (!workout || !isMountedRef.current || onCompleteCalledRef.current) return; 
    
    try {
      // MAXIMUM SECURITY: ONLY save the workout session - ZERO workout data access
      await saveWorkoutSession({
        workout_id: workout.id,
        workout_title: workoutName,
        start_time: new Date(workoutStartTime).toISOString(),
        end_time: new Date().toISOString(),
        total_duration: Math.floor((Date.now() - workoutStartTime) / 1000),
        completed: true
      });
      
      toast({
        title: "Allenamento completato!",
        description: "Sessione salvata con successo",
      });
      
      safeOnComplete();
    } catch (error) {
      console.error('Error saving workout session:', error);
      
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio della sessione",
        variant: "destructive"
      });
      
      // Still go back even if there's an error
      safeOnComplete();
    }
  }, [workout, workoutName, workoutStartTime, saveWorkoutSession, toast, safeOnComplete]);

  const advanceToNextExercise = useCallback(() => {
    if (workoutPhase === 'main') {
      let nextMainIndex = -1;
      for (let i = currentExerciseGlobalIndex + 1; i < workoutExercises.length; i++) {
        if (!skippedExerciseIds.has(workoutExercises[i].id) && !completedExerciseIds.has(workoutExercises[i].id)) {
          nextMainIndex = i;
          break;
        }
      }

      if (nextMainIndex !== -1) {
        setCurrentExerciseGlobalIndex(nextMainIndex);
        setCurrentDisplayExercise(workoutExercises[nextMainIndex]);
        setCurrentSet(1);
        setCurrentSetIndex(0);
        const restTime = workoutExercises[nextMainIndex]?.rest_time || 60;
        setTimeRemaining(restTime);
        setIsResting(true);
        setIsActive(true);
        setIsDoingCardio(false);
      } else {
        const skippable = getCurrentlySkippedExercises();
        if (skippable.length > 0) {
          setWorkoutPhase('skipped');
          setCurrentSkippedPhaseIndex(0);
          setCurrentDisplayExercise(skippable[0]);
          setCurrentSet(1);
          setCurrentSetIndex(0);
          const restTime = skippable[0]?.rest_time || 60;
          setTimeRemaining(restTime);
          setIsResting(true);
          setIsActive(true);
          setIsDoingCardio(false);
        } else {
          endWorkoutSession();
        }
      }
    } else {
      const skippable = getCurrentlySkippedExercises(); 
      if (skippable.length > 0) {
        setCurrentSkippedPhaseIndex(0);
        setCurrentDisplayExercise(skippable[0]);
        setCurrentSet(1);
        setCurrentSetIndex(0);
        const restTime = skippable[0]?.rest_time || 60;
        setTimeRemaining(restTime);
        setIsResting(true);
        setIsActive(true);
        setIsDoingCardio(false);
      } else {
        endWorkoutSession();
      }
    }
  }, [workoutPhase, currentExerciseGlobalIndex, workoutExercises, skippedExerciseIds, completedExerciseIds, getCurrentlySkippedExercises, endWorkoutSession]);

  const startRestTimer = useCallback(() => {
    if (!currentDisplayExercise) return;
    setTimeRemaining(currentDisplayExercise.rest_time);
    setIsResting(true);
    setIsActive(true);
    setIsDoingCardio(false);
  }, [currentDisplayExercise]);

  const startCardioTimer = useCallback(() => {
    if (!currentDisplayExercise) return;
    setTimeRemaining(20 * 60);
    setIsDoingCardio(true);
    setIsActive(true);
    setCardioTimeElapsed(0);
  }, [currentDisplayExercise]);

  const completeSet = useCallback(() => {
    if (!currentDisplayExercise) return;

    const exerciseCompleted = () => {
      setCompletedExerciseIds(prev => new Set(prev).add(currentDisplayExercise.id));
      advanceToNextExercise();
    };

    if (isCardioExercise) {
      exerciseCompleted();
    } else {
      const totalSets = getTotalSets();
      if (currentSetIndex < totalSets - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentSet(currentSet + 1);
        startRestTimer();
      } else {
        exerciseCompleted();
      }
    }
  }, [currentDisplayExercise, isCardioExercise, currentSetIndex, currentSet, getTotalSets, startRestTimer, advanceToNextExercise]);

  const skipRest = useCallback(() => {
    setIsActive(false);
    setIsResting(false);
    setIsDoingCardio(false);
    setTimeRemaining(0);
  }, []);

  const skipExercise = useCallback(() => {
    if (!currentDisplayExercise || workoutPhase === 'skipped') return;

    setSkippedExerciseIds(prev => new Set(prev).add(currentDisplayExercise.id));
    advanceToNextExercise();
  }, [currentDisplayExercise, workoutPhase, advanceToNextExercise]);

  const updateSetWeight = useCallback((newWeight: number) => {
    if (!currentDisplayExercise) return;
    
    setModifiedWeights(prev => ({
      ...prev,
      [currentDisplayExercise.id]: {
        ...prev[currentDisplayExercise.id],
        [currentSetIndex]: newWeight
      }
    }));
    
    toast({
      title: "Peso aggiornato",
      description: `Peso serie ${currentSet} aggiornato a ${newWeight}kg`,
    });
  }, [currentDisplayExercise, currentSetIndex, currentSet, toast]);

  const openWeightEditor = useCallback(() => {
    if (!currentDisplayExercise) return;
    const currentSetData = getCurrentSet();
    setTempWeight(currentSetData.target_weight?.toString() || '');
    setShowWeightEditor(true);
  }, [currentDisplayExercise, getCurrentSet]);

  const evaluateExpression = useCallback((expression: string): number | null => {
    try {
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      if (sanitized !== expression) return null;
      
      const result = Function('"use strict"; return (' + sanitized + ')')();
      
      if (typeof result !== 'number' || !isFinite(result)) return null;
      if (result < 0) return null;
      
      return Math.round(result * 100) / 100;
    } catch {
      return null;
    }
  }, []);

  const saveWeightChange = useCallback(() => {
    const weight = parseFloat(tempWeight);
    if (isNaN(weight) || weight < 0) {
      toast({
        title: "Peso non valido",
        description: "Inserisci un peso valido maggiore di 0",
        variant: "destructive"
      });
      return;
    }
    
    updateSetWeight(weight);
    setShowWeightEditor(false);
    setTempWeight('');
  }, [tempWeight, updateSetWeight, toast]);

  const saveWeightWithMath = useCallback(() => {
    if (!tempWeight.trim()) {
      toast({
        title: "Campo vuoto",
        description: "Inserisci un peso o un'espressione matematica",
        variant: "destructive"
      });
      return;
    }

    const result = evaluateExpression(tempWeight);
    if (result === null) {
      toast({
        title: "Espressione non valida",
        description: "Usa solo numeri e operatori (+, -, *, /)",
        variant: "destructive"
      });
      return;
    }

    if (result === 0) {
      toast({
        title: "Risultato non valido",
        description: "Il peso deve essere maggiore di 0",
        variant: "destructive"
      });
      return;
    }

    updateSetWeight(result);
    setShowWeightEditor(false);
    setTempWeight('');
  }, [tempWeight, evaluateExpression, updateSetWeight, toast]);

  const showTodayNotes = useCallback(() => {
    if (currentDisplayExercise) {
      const today = new Date().toISOString().split('T')[0];
      const todayNotes = getExerciseNotes(currentDisplayExercise.name, today);
      
      if (todayNotes.length > 0) {
        const notesText = todayNotes.map(note => note.note).join('\n\n');
        toast({
          title: `Note di oggi per ${currentDisplayExercise.name}`,
          description: notesText,
        });
      } else {
        toast({
          title: "Nessuna nota",
          description: `Nessuna nota salvata oggi per ${currentDisplayExercise.name}`,
          variant: "destructive"
        });
      }
    }
  }, [currentDisplayExercise, getExerciseNotes, toast]);

  const quickSaveNote = useCallback(async () => {
    if (!currentDisplayExercise) return;
    
    let noteContent = '';
    if (isCardioExercise && cardioTimeElapsed > 0) {
      const minutes = Math.floor(cardioTimeElapsed / 60);
      const seconds = cardioTimeElapsed % 60;
      noteContent = `Tempo completato: ${minutes}:${seconds.toString().padStart(2, '0')} - `;
    }
    
    const userNote = prompt(`Aggiungi una nota rapida per ${currentDisplayExercise.name}:`, noteContent);
    if (userNote && userNote.trim()) {
      const today = new Date().toISOString().split('T')[0];
      await saveExerciseNote({
        exercise_name: currentDisplayExercise.name,
        note: userNote.trim(),
        date: today
      });
      toast({
        title: "Nota salvata",
        description: "Nota salvata con successo!",
      });
    }
  }, [currentDisplayExercise, isCardioExercise, cardioTimeElapsed, saveExerciseNote, toast]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getWorkoutDuration = useCallback(() => {
    const totalSeconds = Math.floor((currentTime - workoutStartTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [currentTime, workoutStartTime]);

  // Early returns for edge cases
  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <div className="space-y-6">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-poppins font-bold text-white mb-4">
            Nessun Allenamento Selezionato
          </h3>
          <p className="text-slate-400 mb-6">
            Seleziona un allenamento dalla sezione "Allenamenti" per iniziare.
          </p>
          <button
            onClick={safeOnComplete}
            className="accent-gradient text-white px-6 py-3 rounded-xl font-medium"
          >
            Torna agli Allenamenti
          </button>
        </div>
      </div>
    );
  }

  if (showNotes && currentDisplayExercise) {
    return (
      <ExerciseNotes
        exerciseName={currentDisplayExercise.name}
        onClose={() => setShowNotes(false)}
      />
    );
  }

  if (!currentDisplayExercise) {
    return (
      <div className="space-y-6">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <h3 className="text-xl font-poppins font-bold text-white mb-4">
            {workoutExercises.length > 0 ? 'Caricamento esercizio...' : 'Allenamento terminato o vuoto.'}
          </h3>
          <button
            onClick={safeOnComplete}
            className="accent-gradient text-white px-6 py-3 rounded-xl font-medium"
          >
            Torna Indietro
          </button>
        </div>
      </div>
    );
  }

  const currentSetData = getCurrentSet();
  const totalSets = getTotalSets();
  const totalEffectiveExercises = workoutPhase === 'main' 
    ? workoutExercises.filter(ex => !skippedExerciseIds.has(ex.id)).length
    : getCurrentlySkippedExercises().length;
  
  const completedInPhase = workoutPhase === 'main'
    ? workoutExercises.filter(ex => completedExerciseIds.has(ex.id) && !skippedExerciseIds.has(ex.id)).length
    : getCurrentlySkippedExercises().filter(ex => completedExerciseIds.has(ex.id)).length;

  const overallProgress = workoutExercises.length > 0 ? (completedExerciseIds.size / workoutExercises.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      {days.length > 1 && (
        <div className="flex gap-2 mb-4">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1 rounded ${selectedDay === day ? 'bg-sky-blue text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-poppins font-bold text-white">
            {workoutName} {workoutPhase === 'skipped' && '(Esercizi Saltati)'}
          </h2>
          <span className="text-sm text-slate-400">{getWorkoutDuration()}</span>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
          <div 
            className="accent-gradient h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-slate-400 text-center">
          Esercizio {completedExerciseIds.size + (currentDisplayExercise && !completedExerciseIds.has(currentDisplayExercise.id) && !skippedExerciseIds.has(currentDisplayExercise.id) ? 1 : 0)} di {workoutExercises.length}
          {workoutPhase === 'skipped' && getCurrentlySkippedExercises().length > 0 && ` (Recuperando ${getCurrentlySkippedExercises().length} saltati)`}
        </div>
      </div>

      {/* Current Exercise */}
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-poppins font-bold text-white">
            {currentDisplayExercise.name}
          </h3>
          <div className="flex space-x-1 items-center">
            {workoutPhase === 'main' && (
              <button
                onClick={skipExercise}
                className="text-orange-400 hover:text-orange-300 p-2"
                title="Salta Esercizio"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => openYouTubeSearch(currentDisplayExercise.name)}
              className="text-red-400 hover:text-red-300 p-2"
              title="Cerca tutorial su YouTube"
            >
              <Youtube className="w-5 h-5" />
            </button>
            <button
              onClick={() => openGoogleImageSearch(currentDisplayExercise.name)}
              className="text-blue-400 hover:text-blue-300 p-2"
              title="Cerca immagini dell'esercizio"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              onClick={showTodayNotes}
              className="text-blue-400 hover:text-blue-300 p-2"
              title="Visualizza note di oggi"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={quickSaveNote}
              className="text-green-400 hover:text-green-300 p-2"
              title="Nota rapida"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowNotes(true)}
              className="text-yellow-400 hover:text-yellow-300 p-2"
              title="Gestisci note"
            >
              <StickyNote size={20} />
            </button>
          </div>
        </div>
        
        {isCardioExercise ? (
          <div>
            <div className="text-4xl font-bold text-orange-400 mb-2">CARDIO</div>
            <div className="text-lg text-slate-300 mb-4">
              Obiettivo: 20 min
            </div>
            
            {isDoingCardio ? (
              <div className="space-y-4">
                <div className="text-4xl font-bold text-white mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-slate-400 mb-4">Tempo rimanente</div>
                <div className="text-sm text-green-400">
                  Tempo trascorso: {formatTime(cardioTimeElapsed)}
                </div>
                
                <button 
                  onClick={completeSet}
                  className="w-full accent-gradient text-white py-4 rounded-xl font-medium text-lg hover:scale-105 transition-transform"
                >
                  Completa Cardio
                </button>
              </div>
            ) : (
              <button 
                onClick={startCardioTimer}
                className="w-full accent-gradient text-white py-4 rounded-xl font-medium text-lg hover:scale-105 transition-transform"
              >
                Inizia Cardio
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="text-6xl font-bold text-sky-blue mb-4">
              {currentSet}/{totalSets}
            </div>
            
            <div className="text-lg text-slate-300 mb-2">
              Serie {currentSetData.set_number}: {currentSetData.reps} ripetizioni
            </div>

            {currentSetData.target_weight ? (
              <div 
                onClick={openWeightEditor}
                className="text-md text-yellow-400 mb-4 cursor-pointer hover:text-yellow-300 transition-colors group bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/20 hover:border-yellow-400/40"
                title="Clicca per modificare il peso"
              >
                <div className="flex items-center justify-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  <span>Peso: {currentSetData.target_weight}kg</span>
                  <Edit className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                </div>
              </div>
            ) : (
              <button
                onClick={openWeightEditor}
                className="text-sm text-slate-400 mb-4 cursor-pointer hover:text-yellow-300 transition-colors bg-slate-700/30 rounded-lg p-2 border border-slate-600/50 hover:border-yellow-400/40"
                title="Aggiungi peso per questa serie"
              >
                <div className="flex items-center justify-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  <span>+ Aggiungi peso</span>
                </div>
              </button>
            )}

            {!isResting ? (
              <button 
                onClick={completeSet}
                className="w-full accent-gradient text-white py-4 rounded-xl font-medium text-lg hover:scale-105 transition-transform"
              >
                Ho Completato la Serie
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl font-bold text-white mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-slate-400 mb-4">
                  {currentSet === 1 && currentExerciseGlobalIndex > 0 
                    ? "Recupero tra Esercizi" 
                    : "Tempo di Recupero"
                  }
                </div>
                
                {currentSet === 1 && currentExerciseGlobalIndex > 0 && (
                  <div className="text-sm text-sky-blue mb-4 bg-sky-blue/10 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Prossimo: {currentDisplayExercise.name}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3 mb-4">
                  <button 
                    onClick={skipRest}
                    className="flex-1 border border-slate-600 text-slate-300 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
                  >
                    Salta Recupero
                  </button>
                  <button 
                    onClick={() => setTimeRemaining(timeRemaining + 30)}
                    className="flex-1 accent-gradient text-white py-3 rounded-xl font-medium"
                  >
                    +30s
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={quickSaveNote}
                    className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 py-2 rounded-xl font-medium hover:bg-green-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Nota Rapida</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowNotes(true)}
                    className="flex-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 py-2 rounded-xl font-medium hover:bg-yellow-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Clipboard className="w-4 h-4" />
                      <span>Gestisci Note</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentDisplayExercise.notes && (
          <div className="text-sm text-slate-400 mt-4 bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>{currentDisplayExercise.notes.replace(/^(Cardio - \w+ - |[^-]+ - )/, '')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Overview */}
      <div className="glass-effect rounded-2xl p-6">
        <h4 className="font-medium text-white mb-4">Esercizi di Oggi</h4>
        <div className="space-y-3">
          {workoutExercises.map((exercise, index) => {
            const isCurrent = exercise.id === currentDisplayExercise?.id;
            const isCompleted = completedExerciseIds.has(exercise.id);
            const isSkippedAndPending = skippedExerciseIds.has(exercise.id) && !isCompleted;
            
            let statusClass = 'bg-slate-700/30';
            if (isCurrent) statusClass = 'bg-blue-500/20 border border-blue-500/30';
            else if (isCompleted) statusClass = 'bg-green-500/20 border border-green-500/30 opacity-70';
            else if (isSkippedAndPending) statusClass = 'bg-yellow-500/20 border border-yellow-500/30';

            const exerciseSets = exercise.sets || [];
            const setsDisplay = exercise.notes?.startsWith('Cardio -') ? 
              `20 min` : 
              `${exerciseSets.length} serie`;

            return (
              <div 
                key={exercise.id}
                className={`flex justify-between items-center p-3 rounded-lg ${statusClass}`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`text-white ${isCompleted ? 'line-through' : ''}`}>{exercise.name}</span>
                  {exercise.notes?.startsWith('Cardio -') && (
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md">CARDIO</span>
                  )}
                  {isSkippedAndPending && !isCurrent && (
                    <span className="text-xs bg-yellow-600/30 text-yellow-400 px-2 py-1 rounded-md">SALTATO</span>
                  )}
                </div>
                <span className="text-sm text-slate-400">
                  {setsDisplay}
                  {isCurrent && !exercise.notes?.startsWith('Cardio -') && ` (Serie ${currentSet})`}
                  {isCompleted && (
                    <Check className="w-4 h-4 inline ml-1 text-green-400" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={() => {
          if (workoutPhase === 'skipped' && getCurrentlySkippedExercises().length > 0) {
            setShowEndWorkoutDialog(true);
          } else {
            // Call the fixed function that only saves the session
            endWorkoutSession();
          }
        }}
        className="w-full border border-red-500/50 text-red-400 py-3 rounded-xl font-medium hover:bg-red-500/10 transition-colors"
      >
        Termina Allenamento
      </button>

      {/* Weight Editor Dialog */}
      <AlertDialog open={showWeightEditor} onOpenChange={setShowWeightEditor}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Modifica Peso - Serie {currentSet}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Inserisci il nuovo peso per questa serie. Puoi usare espressioni matematiche come "20+5", "15*2", "60/2".
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
            <input
              type="text"
              value={tempWeight}
              onChange={(e) => setTempWeight(e.target.value)}
              placeholder="es. 25 o 20+5 o 15*2"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-sky-blue focus:outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveWeightWithMath();
                }
                if (e.key === 'Escape') {
                  setShowWeightEditor(false);
                  setTempWeight('');
                }
              }}
            />
            <div className="text-xs text-slate-400 mt-2">
              Operatori supportati: + - * / ( )
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowWeightEditor(false);
                setTempWeight('');
              }}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={saveWeightWithMath}
              className="bg-sky-blue hover:bg-sky-blue/80 text-white"
            >
              Salva Peso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Workout Dialog */}
      <AlertDialog open={showEndWorkoutDialog} onOpenChange={setShowEndWorkoutDialog}>
        <AlertDialogContent className="glass-effect border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Termina Allenamento</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Hai esercizi saltati non completati. Sei sicuro di voler terminare l'allenamento?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowEndWorkoutDialog(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowEndWorkoutDialog(false);
                endWorkoutSession();
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Termina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkoutTimer;
