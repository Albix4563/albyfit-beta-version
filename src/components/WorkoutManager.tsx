import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { Workout, Exercise, ExerciseSet } from '@/hooks/useSupabaseAuth';
import { Download, Trash2, Youtube, Image, Edit, Lightbulb, ArrowUp, ArrowDown, Plus, Minus, Dumbbell } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface WorkoutManagerProps {
  onStartWorkout?: (workout: Workout) => void;
}

interface ExtendedExercise extends Exercise {
  isCardio?: boolean;
  duration?: number;
}

const WorkoutManager: React.FC<WorkoutManagerProps> = ({ onStartWorkout }) => {  const { workouts, saveWorkout, updateWorkout, deleteWorkout } = useSupabaseAuth();
  const { toast } = useToast();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [restTimeType, setRestTimeType] = useState<'preset' | 'custom'>('preset');
  const [customRestTime, setCustomRestTime] = useState('');
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  
  const [exerciseForm, setExerciseForm] = useState<ExtendedExercise>({
    id: '',
    name: '',
    machine: '',
    sets: [{ id: '1', set_number: 1, reps: 10, target_weight: undefined, notes: '' }],
    rest_time: 60,
    notes: '',
    isCardio: false,
    duration: 8
  });
  const [days, setDays] = useState<string[]>(["Giorno 1"]);
  const [selectedDay, setSelectedDay] = useState<string>("Giorno 1");

  const presetRestTimes = [30, 60, 90, 120, 150, 300];  // Effetto per resettare stati quando si cambia vista
  useEffect(() => {
    // Reset degli stati quando si cambia vista per evitare dialog/form fuori contesto
    setWorkoutToDelete(null);
    setIsAddingExercise(false);
    setEditingExerciseId(null);
    // Reset del form esercizio quando si cambia vista
    setExerciseForm({
      id: '',
      name: '',
      machine: '',
      sets: [{ id: '1', set_number: 1, reps: 10, target_weight: undefined, notes: '' }],
      rest_time: 60,
      notes: '',
      isCardio: false,
      duration: 8
    });
  }, [isCreating]);

  // Categorizzazione automatica degli esercizi con miglior rilevazione cardio
  const categorizeExercise = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase(); // Keep toLowerCase for categorization logic, as original name is now uppercase
      // RILEVAZIONE CARDIO RIMOSSA - tutti gli esercizi di default sono forza
    if (name.includes('panca') || name.includes('chest') || name.includes('petto') || 
        name.includes('push up') || name.includes('flessioni') || name.includes('dips')) {
      return 'petto';
    }
    
    if (name.includes('trazioni') || name.includes('pull') || name.includes('row') || 
        name.includes('lat') || name.includes('dorsali') || name.includes('schiena') ||
        name.includes('stacco')) {
      return 'schiena';
    }
    
    if (name.includes('spalle') || name.includes('shoulder') || name.includes('military') ||
        name.includes('alzate') || name.includes('press') && !name.includes('panca')) {
      return 'spalle';
    }
    
    if (name.includes('curl') || name.includes('bicipiti') || name.includes('tricipiti') ||
        name.includes('braccia') || name.includes('french') || name.includes('bicep')) {
      return 'braccia';
    }
      if (name.includes('squat') || name.includes('gambe') || name.includes('leg') ||
        name.includes('affondi') || name.includes('lunge') || name.includes('coscia') ||
        name.includes('polpacci') || name.includes('quadricipiti') || name.includes('corsa') ||
        name.includes('camminata') || name.includes('jogging') || name.includes('running') ||
        name.includes('cyclette') || name.includes('bici') || name.includes('tapis')) {
      return 'gambe';
    }
      if (name.includes('plank') || name.includes('addominali') || name.includes('abs') ||
        name.includes('core') || name.includes('crunch')) {
      return 'core';
    }
    
    return 'generale';
  };  const validateExerciseName = (name: string): string => {
    // Permette lettere, spazi, virgole, apostrofi, trattini e parentesi
    // Rimuove solo i caratteri non validi, mantiene spazi interni e la cassa originale
    return name.replace(/[^a-zA-ZàáâäèéêëìíîïòóôöùúûüñçÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜÑÇ\s,''()\-0-9]/g, '');
  };  // Funzione per valutare operazioni matematiche semplici nei campi peso
  const evaluateMathExpression = (expression: string): number | 'division_by_zero' | null => {
    try {
      // Rimuove spazi e converte in minuscolo
      const cleanExpression = expression.replace(/\s/g, '').toLowerCase();
      
      // Se è vuoto, ritorna null
      if (!cleanExpression) return null;
      
      // Pattern per operazioni matematiche base: numero operatore numero
      const mathPattern = /^(\d+(?:\.\d+)?)([\+\-\*x×\/])(\d+(?:\.\d+)?)$/;
      const match = cleanExpression.match(mathPattern);
      
      if (match) {
        const num1 = parseFloat(match[1]);
        const operator = match[2];
        const num2 = parseFloat(match[3]);
        
        switch (operator) {
          case '+':
            return Math.round((num1 + num2) * 100) / 100; // Arrotonda a 2 decimali
          case '-':
            return Math.round((num1 - num2) * 100) / 100;
          case '*':
          case 'x':
          case '×':
            return Math.round((num1 * num2) * 100) / 100;
          case '/':
            if (num2 === 0) return 'division_by_zero';
            return Math.round((num1 / num2) * 100) / 100;
          default:
            return null;
        }
      }
      
      // Se non è un'operazione matematica, prova a parsare come numero normale
      const simpleNumber = parseFloat(cleanExpression);
      return isNaN(simpleNumber) ? null : simpleNumber;
    } catch (error) {
      return null;
    }
  };

  const exerciseExists = (name: string): boolean => {
    if (!selectedWorkout || !selectedWorkout.exercises) return false;
    const cleanName = validateExerciseName(name);
    return selectedWorkout.exercises.some(exercise => 
      validateExerciseName(exercise.name) === cleanName
    );
  };

  const openYouTubeSearch = (exerciseName: string) => {
    const query = encodeURIComponent(`${exerciseName} esercizio forma tutorial`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const openGoogleImageSearch = (exerciseName: string) => {
    const query = encodeURIComponent(`${exerciseName} esercizio fitness muscoli`);
    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
  };

  const handleRestTimeChange = (value: string) => {
    if (value === 'altro') {
      setRestTimeType('custom');
      setCustomRestTime('');
      setExerciseForm({
        ...exerciseForm,
        rest_time: 0
      });
    } else {
      setRestTimeType('preset');
      const restTime = parseInt(value);
      setExerciseForm({
        ...exerciseForm,
        rest_time: restTime
      });
    }
  };

  const handleCustomRestTimeChange = (value: string) => {
    setCustomRestTime(value);
    const numValue = parseInt(value) || 0;
    setExerciseForm({
      ...exerciseForm,
      rest_time: numValue
    });
  };

  const createWorkout = async () => {
    if (!newWorkoutName.trim()) {
      toast({
        title: "Nome richiesto",
        description: "Inserisci il nome dell'allenamento",
        variant: "destructive",
      });
      return;
    }

    await saveWorkout({
      title: newWorkoutName,
      description: '',
      exercises: []
    });
    
    setIsCreating(false);
    setNewWorkoutName('');
  };

  const addSet = () => {
    const newSetNumber = (exerciseForm.sets?.length || 0) + 1;
    const newSet: ExerciseSet = {
      id: Date.now().toString(),
      set_number: newSetNumber,
      reps: 10,
      target_weight: undefined,
      notes: ''
    };
    
    setExerciseForm({
      ...exerciseForm,
      sets: [...(exerciseForm.sets || []), newSet]
    });
  };

  const removeSet = (setId: string) => {
    if ((exerciseForm.sets?.length || 0) <= 1) return;
    
    const updatedSets = (exerciseForm.sets || [])
      .filter(set => set.id !== setId)
      .map((set, index) => ({ ...set, set_number: index + 1 }));
    
    setExerciseForm({
      ...exerciseForm,
      sets: updatedSets
    });
  };  const updateSet = (setId: string, field: keyof ExerciseSet, value: any) => {
    const updatedSets = (exerciseForm.sets || []).map(set => {
      if (set.id === setId) {
        // Per il peso, conserva il valore come stringa per permettere la digitazione di operazioni
        return { ...set, [field]: value };
      }
      return set;
    });
    
    setExerciseForm({
      ...exerciseForm,
      sets: updatedSets
    });
  };
  // Funzione per gestire quando l'utente finisce di modificare il peso
  const handleWeightBlur = (setId: string, value: string) => {
    if (!value.trim()) return;
    
    const evaluatedValue = evaluateMathExpression(value);
      if (evaluatedValue === 'division_by_zero') {
      toast({
        title: "Errore matematico",
        description: "Divisione per zero non permessa! Correggi l'espressione matematica.",
        variant: "destructive",
      });
      // Mantieni il valore originale nel campo per permettere la correzione
      return;
    }
    
    if (evaluatedValue !== null) {
      updateSet(setId, 'target_weight', evaluatedValue);
    }
  };
  const saveExercise = () => {
    const cleanName = validateExerciseName(exerciseForm.name);
      if (!cleanName.trim()) {
      toast({
        title: "Nome non valido",
        description: "Inserisci un nome valido per l'esercizio (lettere, spazi, virgole e trattini permessi)",
        variant: "destructive",
      });
      return;
    }    if (exerciseExists(cleanName) && isAddingExercise) {
      toast({
        title: "Esercizio duplicato",
        description: "Questo esercizio esiste già nell'allenamento",
        variant: "destructive",
      });
      return;
    }    // Validazione tempo di recupero per input personalizzato
    if (restTimeType === 'custom' && (!customRestTime || parseInt(customRestTime) <= 0)) {
      toast({
        title: "Tempo di recupero non valido",
        description: "Inserisci un tempo di recupero valido",
        variant: "destructive",
      });
      return;
    }

    // Validazione per divisioni per zero nei pesi
    const hasDivisionByZero = exerciseForm.sets?.some(set => {
      if (typeof set.target_weight === 'string') {
        const result = evaluateMathExpression(set.target_weight);
        return result === 'division_by_zero';
      }
      return false;
    });    if (hasDivisionByZero) {
      toast({
        title: "Errore nei pesi",
        description: "Sono presenti divisioni per zero nei pesi. Correggi le espressioni matematiche prima di salvare.",
        variant: "destructive",
      });
      return;
    }

    if (selectedWorkout) {
      const category = categorizeExercise(cleanName);
      const isCardio = exerciseForm.isCardio;
      
      const exerciseToSave: Exercise = {
        id: exerciseForm.id || Date.now().toString(),
        name: cleanName,
        machine: exerciseForm.machine || '',
        sets: isCardio ? 
          [{ id: '1', set_number: 1, reps: Math.max(exerciseForm.duration || 8, 8), target_weight: undefined, notes: 'min' }] :
          exerciseForm.sets || [{ id: '1', set_number: 1, reps: 10, target_weight: undefined, notes: '' }],
        rest_time: exerciseForm.rest_time,
        notes: isCardio ? `Cardio - ${category} - ${exerciseForm.notes}`.replace('cardio - cardio', 'cardio').trim() : `${category} - ${exerciseForm.notes}`.trim(),
        day: selectedDay
      };

      let updatedExercises;
      if (editingExerciseId && !isAddingExercise) {
        updatedExercises = (selectedWorkout.exercises || []).map(e => 
          e.id === editingExerciseId ? exerciseToSave : e
        );
      } else {
        updatedExercises = [...(selectedWorkout.exercises || []), exerciseToSave];
      }

      const updatedWorkout = {
        ...selectedWorkout,
        exercises: updatedExercises
      };

      updateWorkout(updatedWorkout);
      setSelectedWorkout(updatedWorkout);
    }

    closeExerciseForm();
  };

  const openAddExerciseForm = () => {
    setExerciseForm({
      id: Date.now().toString(),
      name: '',
      machine: '',
      sets: [{ id: '1', set_number: 1, reps: 10, target_weight: undefined, notes: '' }],
      rest_time: 60,
      notes: '',
      isCardio: false,
      duration: 8
    });
    setRestTimeType('preset');
    setCustomRestTime('');
    setIsAddingExercise(true);
    setEditingExerciseId(null);
  };

  const openEditExerciseForm = (exercise: Exercise) => {
    const isCardio = exercise.notes.startsWith('Cardio -');
    const extendedExercise: ExtendedExercise = {
      ...exercise,
      isCardio,
      duration: isCardio && exercise.sets?.[0] ? exercise.sets[0].reps : 8,
      notes: isCardio ? exercise.notes.replace(/Cardio - \w+ - /, '') : exercise.notes.replace(/\w+ - /, '')
    };
    
    setExerciseForm(extendedExercise);
    
    // Controlla se il tempo di recupero è uno dei preset
    if (presetRestTimes.includes(exercise.rest_time)) {
      setRestTimeType('preset');
      setCustomRestTime('');
    } else {
      setRestTimeType('custom');
      setCustomRestTime(exercise.rest_time.toString());
    }
    
    setEditingExerciseId(exercise.id);
    setIsAddingExercise(false);
  };

  const closeExerciseForm = () => {
    setIsAddingExercise(false);
    setEditingExerciseId(null);
    setRestTimeType('preset');
    setCustomRestTime('');
    setExerciseForm({
      id: '',
      name: '',
      machine: '',
      sets: [{ id: '1', set_number: 1, reps: 10, target_weight: undefined, notes: '' }],
      rest_time: 60,
      notes: '',
      isCardio: false,
      duration: 8
    });
  };
  const removeExercise = (exerciseId: string) => {
    if (selectedWorkout) {
      const updatedWorkout = {
        ...selectedWorkout,
        exercises: (selectedWorkout.exercises || []).filter(e => e.id !== exerciseId)
      };
      updateWorkout(updatedWorkout);
      setSelectedWorkout(updatedWorkout);
    }
  };

  const duplicateExercise = (exerciseId: string) => {
    if (!selectedWorkout || !selectedWorkout.exercises) return;

    const exerciseToDuplicate = selectedWorkout.exercises.find(e => e.id === exerciseId);
    if (!exerciseToDuplicate) return;

    const duplicatedExercise: Exercise = {
      ...exerciseToDuplicate,
      id: Date.now().toString(),
      name: `${exerciseToDuplicate.name} (COPIA)`,
      sets: exerciseToDuplicate.sets?.map((set, index) => ({
        ...set,
        id: `${Date.now()}-${index}`,
      })) || []
    };

    const updatedWorkout = {
      ...selectedWorkout,
      exercises: [...selectedWorkout.exercises, duplicatedExercise]
    };

    updateWorkout(updatedWorkout);
    setSelectedWorkout(updatedWorkout);
  };

  const startWorkout = () => {
    if (selectedWorkout && onStartWorkout) {
      onStartWorkout(selectedWorkout);
    }
  };
  const handleDeleteWorkout = async (workoutId: string) => {
    setWorkoutToDelete(workoutId);
  };

  const confirmDeleteWorkout = async () => {
    if (workoutToDelete) {
      await deleteWorkout(workoutToDelete);
      setSelectedWorkout(null);
      setWorkoutToDelete(null);
      toast({
        title: "Allenamento eliminato",
        description: "L'allenamento è stato eliminato con successo",
      });
    }
  };

  const handleExerciseNameChange = (value: string) => {
    const cleanName = validateExerciseName(value);
    
    setExerciseForm({
      ...exerciseForm, 
      name: cleanName
    });
  };

  const moveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    if (!selectedWorkout || !selectedWorkout.exercises) return;

    const exercises = [...selectedWorkout.exercises];
    const index = exercises.findIndex(e => e.id === exerciseId);

    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      [exercises[index - 1], exercises[index]] = [exercises[index], exercises[index - 1]];
    } else if (direction === 'down' && index < exercises.length - 1) {
      [exercises[index + 1], exercises[index]] = [exercises[index], exercises[index + 1]];
    } else {
      return; // No change if trying to move beyond boundaries
    }

    const updatedWorkout = {
      ...selectedWorkout,
      exercises,
    };

    updateWorkout(updatedWorkout);
    setSelectedWorkout(updatedWorkout);
  };

  const addDay = () => {
    const nextNum = days.length + 1;
    setDays([...days, `Giorno ${nextNum}`]);
  };
  
  const removeDay = (day: string) => {
    if (days.length === 1) return;
    setDays(days.filter(d => d !== day));
    if (selectedDay === day) setSelectedDay(days[0]);
  };

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-poppins font-bold text-white">Crea Allenamento</h2>
          <button 
            onClick={() => setIsCreating(false)}
            className="text-slate-400 hover:text-white"
          >
            Annulla
          </button>
        </div>
        
        <LiquidGlass intensity="medium" size="md">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Nome allenamento"
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400"
            />
            
            <div className="flex space-x-3 pt-4">
              <button 
                onClick={createWorkout}
                className="flex-1 accent-gradient text-white py-3 rounded-lg font-medium"
              >
                Salva Allenamento
              </button>
            </div>
          </div>
        </LiquidGlass>
      </div>
    );
  }

  if (selectedWorkout) {
    // Group exercises by day
    const exercisesByDay: { [day: string]: Exercise[] } = {};
    (selectedWorkout.exercises || []).forEach(ex => {
      const d = ex.day || days[0];
      if (!exercisesByDay[d]) exercisesByDay[d] = [];
      exercisesByDay[d].push(ex);
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setSelectedWorkout(null)}
            className="text-slate-400 hover:text-white"
          >
            ← Indietro
          </button>
          <h2 className="text-xl font-poppins font-bold text-white">{selectedWorkout.title}</h2>
          <div className="flex space-x-2">            
            <button 
              onClick={() => handleDeleteWorkout(selectedWorkout.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-2">
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

        <div className="space-y-4">
          {/* Form di aggiunta/modifica esercizio */}
          {(isAddingExercise || editingExerciseId) && (
            <div className="workout-card bg-slate-800 border-2 border-sky-blue/30">
              <h3 className="text-white font-medium mb-4">
                {isAddingExercise ? 'Aggiungi Nuovo Esercizio' : 'Modifica Esercizio'}
              </h3>
              <div className="space-y-4">                <input
                  type="text"
                  placeholder="Nome esercizio (lettere, spazi, virgole e trattini)"
                  value={exerciseForm.name}
                  onChange={(e) => handleExerciseNameChange(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                />
                
                <input
                  type="text"
                  placeholder="Macchina (es. Chest Press, Lat Machine...)"
                  value={exerciseForm.machine}
                  onChange={(e) => setExerciseForm({...exerciseForm, machine: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                />
                
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={exerciseForm.isCardio}
                      onChange={(e) => setExerciseForm({
                        ...exerciseForm, 
                        isCardio: e.target.checked,
                        sets: e.target.checked ? 
                          [{ id: '1', set_number: 1, reps: Math.max(exerciseForm.duration || 8, 8), target_weight: undefined, notes: 'min' }] :
                          [{ id: '1', set_number: 1, reps: 10, target_weight: undefined, notes: '' }],
                        duration: e.target.checked ? Math.max(exerciseForm.duration || 8, 8) : exerciseForm.duration
                      })}
                      className="rounded"
                    />
                    <span>Esercizio Cardio</span>
                  </label>
                </div>

                {exerciseForm.isCardio ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Durata (min - minimo 8)</label>
                      <input
                        type="number"
                        value={exerciseForm.duration}
                        onChange={(e) => setExerciseForm({
                          ...exerciseForm, 
                          duration: Math.max(parseInt(e.target.value) || 8, 8)
                        })}
                        min="8"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Recupero (s)</label>
                      <Select 
                        value={restTimeType === 'preset' ? exerciseForm.rest_time.toString() : 'altro'} 
                        onValueChange={handleRestTimeChange}
                      >
                        <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {presetRestTimes.map(time => (
                            <SelectItem key={time} value={time.toString()} className="text-white hover:bg-slate-600">
                              {time}s
                            </SelectItem>
                          ))}
                          <SelectItem value="altro" className="text-white hover:bg-slate-600">
                            Altro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {restTimeType === 'custom' && (
                        <input
                          type="number"
                          value={customRestTime}
                          onChange={(e) => handleCustomRestTimeChange(e.target.value)}
                          placeholder="Inserisci secondi"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white mt-2"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-slate-400">Serie</label>
                      <button 
                        onClick={addSet}
                        className="text-green-400 hover:text-green-300 p-1"
                        title="Aggiungi Serie"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {(exerciseForm.sets || []).map((set, index) => (
                      <div key={set.id} className="grid grid-cols-4 gap-2 items-center bg-slate-700/30 p-3 rounded-lg">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Serie {set.set_number}</label>
                          <span className="text-white text-sm">#{set.set_number}</span>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Rip</label>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(set.id, 'reps', parseInt(e.target.value) || 1)}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                          />
                        </div>                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Peso (kg) - es: 10x2=20</label>
                          <input
                            type="text"
                            value={set.target_weight || ''}
                            onChange={(e) => updateSet(set.id, 'target_weight', e.target.value)}
                            onBlur={(e) => handleWeightBlur(set.id, e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                            placeholder="10x2, 5+5, 15"
                          />
                        </div>
                        <div className="flex justify-center">
                          {(exerciseForm.sets?.length || 0) > 1 && (
                            <button 
                              onClick={() => removeSet(set.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Rimuovi Serie"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Recupero (s)</label>
                      <Select 
                        value={restTimeType === 'preset' ? exerciseForm.rest_time.toString() : 'altro'} 
                        onValueChange={handleRestTimeChange}
                      >
                        <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {presetRestTimes.map(time => (
                            <SelectItem key={time} value={time.toString()} className="text-white hover:bg-slate-600">
                              {time}s
                            </SelectItem>
                          ))}
                          <SelectItem value="altro" className="text-white hover:bg-slate-600">
                            Altro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {restTimeType === 'custom' && (
                        <input
                          type="number"
                          value={customRestTime}
                          onChange={(e) => handleCustomRestTimeChange(e.target.value)}
                          placeholder="Inserisci secondi"
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white mt-2"
                        />
                      )}
                    </div>
                  </div>
                )}
                
                <textarea
                  placeholder="Note (opzionale)"
                  value={exerciseForm.notes}
                  onChange={(e) => setExerciseForm({...exerciseForm, notes: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                  rows={2}
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">Giorno</label>
                    <select
                      value={selectedDay}
                      onChange={e => setSelectedDay(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <div className="flex gap-2 mt-2">
                      <button type="button" onClick={addDay} className="text-green-400 text-xs">+ Aggiungi Giorno</button>
                      {days.length > 1 && (
                        <button type="button" onClick={() => removeDay(selectedDay)} className="text-red-400 text-xs">Rimuovi Giorno</button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={saveExercise}
                    className="flex-1 accent-gradient text-white py-2 rounded-lg font-medium"
                  >
                    Salva Esercizio
                  </button>
                  <button 
                    onClick={closeExerciseForm}
                    className="flex-1 border border-slate-600 text-slate-300 py-2 rounded-lg font-medium"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista esercizi esistenti */}
          {(exercisesByDay[selectedDay] || []).map((exercise, index) => (
            <div key={exercise.id} className="workout-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-white">{exercise.name}</h3>
                  {exercise.machine && (
                    <div className="flex items-center gap-1 mt-1">
                      <Dumbbell className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400">{exercise.machine}</span>
                    </div>
                  )}
                  {exercise.notes.startsWith('Cardio -') && (
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md mt-1 inline-block">CARDIO</span>
                  )}
                </div>
                <div className="flex space-x-1 items-center">
                  <button 
                    onClick={() => openYouTubeSearch(exercise.name)}
                    className="text-red-400 text-sm hover:text-red-300 p-1"
                    title="Cerca su YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openGoogleImageSearch(exercise.name)}
                    className="text-blue-400 text-sm hover:text-blue-300 p-1"
                    title="Cerca Immagini"
                  >
                    <Image className="w-4 h-4" />
                  </button>                  <button 
                    onClick={() => openEditExerciseForm(exercise)}
                    className="text-blue-400 text-sm hover:text-blue-300 p-1"
                    title="Modifica Esercizio"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => duplicateExercise(exercise.id)}
                    className="text-green-400 text-sm hover:text-green-300 p-1"
                    title="Duplica Esercizio"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeExercise(exercise.id)}
                    className="text-red-400 text-sm hover:text-red-300 p-1"
                    title="Rimuovi Esercizio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col ml-1">
                    <button 
                      onClick={() => moveExercise(exercise.id, 'up')}
                      disabled={index === 0}
                      className="text-slate-400 hover:text-white disabled:opacity-50 p-0.5"
                      title="Sposta su"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => moveExercise(exercise.id, 'down')}
                      disabled={index === (selectedWorkout.exercises || []).length - 1}
                      className="text-slate-400 hover:text-white disabled:opacity-50 p-0.5"
                      title="Sposta giù"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                {exercise.notes.startsWith('Cardio -') ? (
                  <div className="text-center">
                    <div className="text-lg font-bold text-sky-blue">{exercise.sets?.[0]?.reps} min</div>
                    <div className="text-xs text-slate-400">Durata</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400 mb-2">Serie:</div>
                    {(exercise.sets || []).map((set, setIndex) => (
                      <div key={set.id} className="flex justify-between items-center bg-slate-700/30 rounded p-2">
                        <span className="text-white text-sm">Serie {set.set_number}</span>
                        <div className="flex space-x-4 text-center">
                          <div>
                            <div className="text-sky-blue font-bold">{set.reps}</div>
                            <div className="text-xs text-slate-400">rip</div>
                          </div>
                          {set.target_weight && (
                            <div>
                              <div className="text-sky-blue font-bold">{set.target_weight}kg</div>
                              <div className="text-xs text-slate-400">peso</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-center mt-2">
                  <div className="text-lg font-bold text-sky-blue">{exercise.rest_time}s</div>
                  <div className="text-xs text-slate-400">Recupero</div>
                </div>
              </div>
              
              {exercise.notes && (
                <div className="text-sm text-slate-300 bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>{exercise.notes.replace(/^(Cardio - \w+ - |[^-]+ - )/, '')}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {!isAddingExercise && !editingExerciseId && (
            <button 
              onClick={openAddExerciseForm}
              className="w-full border-2 border-dashed border-slate-600 rounded-lg py-4 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors"
            >
              + Aggiungi Esercizio
            </button>
          )}
        </div>

        {(selectedWorkout.exercises?.length || 0) > 0 && (
          <button 
            onClick={startWorkout}
            className="w-full accent-gradient text-white py-4 rounded-xl font-medium text-lg"
          >
            Inizia Questo Allenamento
          </button>        )}

        {/* Dialog di conferma eliminazione allenamento */}
        <AlertDialog open={!!workoutToDelete} onOpenChange={() => setWorkoutToDelete(null)}>
          <AlertDialogContent className="border-none p-0 overflow-hidden">
            <LiquidGlass intensity="heavy" size="lg" className="!p-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Elimina Allenamento</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Sei sicuro di voler eliminare questo allenamento? Questa azione non può essere annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel 
                  onClick={() => setWorkoutToDelete(null)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Annulla
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDeleteWorkout}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </LiquidGlass>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-poppins font-bold text-white">I Miei Allenamenti</h2>
          <button 
            onClick={() => setIsCreating(true)}
            className="accent-gradient text-white px-4 py-2 rounded-lg font-medium"
          >
            + Crea
          </button>
        </div>

      {workouts.length === 0 ? (
        <LiquidGlass intensity="medium" size="md" className="text-center">
          <h3 className="text-lg font-poppins font-semibold text-white mb-2">
            Nessun Allenamento
          </h3>
          <p className="text-slate-400 mb-4">
            Crea il tuo primo allenamento personalizzato!
          </p>
          <button 
            onClick={() => setIsCreating(true)}
            className="accent-gradient text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
          >
            Crea Allenamento
          </button>
        </LiquidGlass>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div 
              key={workout.id} 
              className="workout-card cursor-pointer"
              onClick={() => setSelectedWorkout(workout)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white">{workout.title}</h3>
                  <p className="text-sm text-slate-400">{workout.exercises?.length || 0} esercizi</p>
                </div>
                <div className="text-slate-400">→</div>
              </div>
            </div>
          ))}        </div>
      )}
      </div>    </>
  );
};

export default WorkoutManager;
