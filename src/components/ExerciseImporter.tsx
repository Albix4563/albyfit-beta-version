
import React, { useState } from 'react';
import { FileText, X, Sparkles, Dumbbell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { Exercise, ExerciseSet } from '@/hooks/useSupabaseAuth';

// Define an internal type for exercises within this component
type InternalExercise = Exercise & { 
  isCardioForUI?: boolean;
  tempReps?: string; // Temporary field for UI during import
};

interface ExerciseImporterProps {
  onExercisesExtracted: (exercises: Exercise[]) => void;
  onClose: () => void;
}

const ExerciseImporter: React.FC<ExerciseImporterProps> = ({ 
  onExercisesExtracted, 
  onClose 
}) => {  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [exercises, setExercises] = useState<InternalExercise[]>([]);
  const [manualText, setManualText] = useState('');

  // --- MULTI-DAY SUPPORT ---
  const [days, setDays] = useState<string[]>(["Giorno 1"]);
  const [selectedDay, setSelectedDay] = useState<string>("Giorno 1");

  // TODO: Future AI implementations
  // Placeholder for future AI-powered exercise analysis and extraction
  // This component is prepared for advanced AI features including:
  // - Image recognition and exercise extraction
  // - Voice-to-text exercise input
  // - Smart exercise suggestions based on workout patterns
  // - Automatic workout plan generation

  const analyzeTextWithAI = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-exercises', {
        body: { text }
      });

      if (error) {
        console.error('Errore funzione:', error);
        toast({
          title: "Errore AI",
          description: "Errore durante l'analisi del testo con AI.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }

      if (data?.exercises && Array.isArray(data.exercises)) {
        const processedExercises = data.exercises.map((ex: any): InternalExercise => {
          const exercise: InternalExercise = { 
            ...ex, 
            rest_time: typeof ex.rest_time === 'number' ? ex.rest_time : 60,
            isCardioForUI: false,
            sets: [], // Initialize as empty array
            tempReps: ex.reps || "10" // Store original reps in temp field
          };

          let isCardio = false;
          let durationString: string | null = null;

          const cardioKeywords = ['cardio', 'corsa', 'camminata', 'cyclette', 'tapis roulant', 'ellittica', 'bike', 'run', 'walk', 'step', 'nuoto', 'jogging', 'rowing'];
          const durationRegex = /(\d+)\s*(minuti|min\b|m\b)/i;

          // Check exercise name for cardio keywords or explicit duration
          if (exercise.name && typeof exercise.name === 'string') {
            if (cardioKeywords.some(keyword => exercise.name.toLowerCase().includes(keyword))) {
              isCardio = true;
            }
            const nameMatch = exercise.name.match(durationRegex);
            if (nameMatch) {
              isCardio = true;
              durationString = `${nameMatch[1]} min`;
            }
          }

          // Check tempReps field for duration string
          if (exercise.tempReps && typeof exercise.tempReps === 'string') {
            const repMatch = exercise.tempReps.match(durationRegex);
            if (repMatch) {
              isCardio = true;
              durationString = `${repMatch[1]} min`;
            } else if (isCardio && /^\d+$/.test(exercise.tempReps.trim()) && !durationString) {
              durationString = `${exercise.tempReps.trim()} min`;
            }
          }
          
          if (isCardio) {
            exercise.isCardioForUI = true;
            exercise.sets = []; // Cardio exercises don't have sets
            exercise.tempReps = durationString || '20 min';
          } else {
            exercise.isCardioForUI = false;
            // For non-cardio, create default sets based on AI data
            const numSets = typeof ex.sets === 'number' && ex.sets > 0 ? ex.sets : 1;
            const repsValue = parseInt(exercise.tempReps || '10', 10);
            
            exercise.sets = [];
            for (let i = 1; i <= numSets; i++) {
              exercise.sets.push({
                id: crypto.randomUUID(),
                set_number: i,
                reps: repsValue,
                target_weight: undefined,
                notes: undefined
              });
            }
          }
          return exercise;
        });
        console.log('Esercizi processati (con info cardio):', processedExercises);
        setExercises(processedExercises);
      } else {
        toast({
          title: "Nessun esercizio trovato",
          description: "Nessun esercizio trovato nel testo.",
          variant: "destructive"
        });
      }
    } catch (aiError) {
      console.error('Errore analisi AI:', aiError);
      toast({
        title: "Errore AI",
        description: "Errore durante l'analisi con AI.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleManualAnalyze = () => {
    if (manualText.trim()) {
      analyzeTextWithAI(manualText);
    }
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof InternalExercise, value: any) => {
    const newExercises = exercises.map((ex, i) => {
      if (i === index) {
        const updatedEx = { ...ex };
        if (field === 'isCardioForUI') {
          updatedEx[field] = !!value;
        } else if (field === 'tempReps') {
          updatedEx.tempReps = value;
        } else if (field === 'rest_time') {
          const numValue = parseInt(value, 10);
          updatedEx.rest_time = isNaN(numValue) || numValue < 0 ? 0 : numValue;
        } else {
          (updatedEx as any)[field] = value;
        }
        return updatedEx;
      }
      return ex;
    });
    setExercises(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    const exercise = newExercises[exerciseIndex];
    if (!exercise.isCardioForUI && exercise.sets) {
      const newSetNumber = exercise.sets.length + 1;
      exercise.sets.push({
        id: crypto.randomUUID(),
        set_number: newSetNumber,
        reps: 10,
        target_weight: undefined,
        notes: undefined
      });
      setExercises(newExercises);
    }
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    const exercise = newExercises[exerciseIndex];
    if (exercise.sets && exercise.sets.length > 1) {
      exercise.sets.splice(setIndex, 1);
      // Renumber the sets
      exercise.sets.forEach((set, idx) => {
        set.set_number = idx + 1;
      });
      setExercises(newExercises);
    }
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof ExerciseSet, value: any) => {
    const newExercises = [...exercises];
    const exercise = newExercises[exerciseIndex];
    if (exercise.sets && exercise.sets[setIndex]) {
      if (field === 'reps') {
        const numValue = parseInt(value, 10);
        exercise.sets[setIndex].reps = isNaN(numValue) || numValue <= 0 ? 1 : numValue;
      } else if (field === 'target_weight') {
        const numValue = parseFloat(value);
        exercise.sets[setIndex].target_weight = isNaN(numValue) ? undefined : numValue;
      } else {
        (exercise.sets[setIndex] as any)[field] = value;
      }
    }
    setExercises(newExercises);
  };
  
  const handleImport = () => {
    const finalExercises: Exercise[] = exercises.map((ex) => {
      const { isCardioForUI, tempReps, ...rest } = ex;
      return {
        ...rest,
        id: rest.id || crypto.randomUUID(),
        name: rest.name || "Esercizio",
        machine: rest.machine || "",
        sets: rest.sets || [],
        rest_time: typeof rest.rest_time === 'number' ? rest.rest_time : 60,
        notes: rest.notes || "",
        workout_id: rest.workout_id || undefined,
        order_index: typeof rest.order_index === 'number' ? rest.order_index : undefined,
        day: rest.day || selectedDay,
      };
    });
    console.log('Importazione finale (tutti gli esercizi):', finalExercises);
    onExercisesExtracted(finalExercises);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-bold text-white">Analisi Intelligente Esercizi</h2>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>      {/* Inserimento Manuale */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          <FileText className="mr-2" size={20} />
          Inserimento Testo per Analisi AI
        </h3>        
        <div className="space-y-4">
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Inserisci il testo degli esercizi:\nPanca piana 4x8 recupero 90s\nSquat 3x12 recupero 60s\nCorsa 20 min recupero 2min"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 h-32"
          />
          <button
            onClick={handleManualAnalyze}
            disabled={isAnalyzing || !manualText.trim()}
            className="w-full accent-gradient text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center"
          >
            <Sparkles className="mr-2" size={20} />
            Analizza con AI
          </button>

          {isAnalyzing && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="animate-pulse text-yellow-400 mr-2" size={24} />
                <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-yellow-400">Analisi AI in corso...</p>
            </div>
          )}
        </div>
      </div>

      {/* Esercizi Estratti */}
      {exercises.length > 0 && (
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Esercizi Rilevati dall'AI</h3>
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={exercise.id || index} className="workout-card bg-slate-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <input 
                    type="text" 
                    value={exercise.name || ''} 
                    onChange={(e) => updateExercise(index, 'name', e.target.value)} 
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white col-span-1 md:col-span-2"
                    placeholder="Nome Esercizio"
                  />
                  <input 
                    type="number" 
                    value={exercise.rest_time === null || exercise.rest_time === undefined ? '' : exercise.rest_time}
                    onChange={(e) => updateExercise(index, 'rest_time', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                    placeholder="Recupero (s)"
                  />
                </div>

                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Dumbbell className="w-4 h-4 text-slate-400" />
                    <label className="text-xs text-slate-400">Macchina</label>
                  </div>
                  <input 
                    type="text" 
                    value={exercise.machine || ''} 
                    onChange={(e) => updateExercise(index, 'machine', e.target.value)} 
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                    placeholder="es. Chest Press, Leg Press, Lat Machine..."
                  />
                </div>

                {exercise.isCardioForUI ? (
                  <div className="mb-2">
                    <input 
                      type="text" 
                      value={exercise.tempReps || ''} 
                      onChange={(e) => updateExercise(index, 'tempReps', e.target.value)} 
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                      placeholder="Durata (es. 20 min)"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 mb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Serie:</span>
                      <button 
                        onClick={() => addSet(index)}
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        + Aggiungi Serie
                      </button>
                    </div>
                    {exercise.sets?.map((set, setIndex) => (
                      <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
                        <input 
                          type="number" 
                          value={set.reps}
                          onChange={(e) => updateSet(index, setIndex, 'reps', e.target.value)}
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                          placeholder="Rip"
                        />
                        <input 
                          type="number" 
                          value={set.target_weight || ''}
                          onChange={(e) => updateSet(index, setIndex, 'target_weight', e.target.value)}
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                          placeholder="Peso (kg)"
                        />
                        <input 
                          type="text" 
                          value={set.notes || ''}
                          onChange={(e) => updateSet(index, setIndex, 'notes', e.target.value)}
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                          placeholder="Note"
                        />
                        {exercise.sets && exercise.sets.length > 1 && (
                          <button 
                            onClick={() => removeSet(index, setIndex)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-2">
                  <label className="block text-xs text-slate-400 mb-1">Giorno</label>
                  <select
                    value={exercise.day || selectedDay}
                    onChange={e => updateExercise(index, 'day', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setDays([...days, `Giorno ${days.length + 1}`])} className="text-green-400 text-xs">+ Aggiungi Giorno</button>
                    {days.length > 1 && (
                      <button type="button" onClick={() => setDays(days.filter(d => d !== (exercise.day || selectedDay)))} className="text-red-400 text-xs">Rimuovi Giorno</button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <textarea 
                    value={exercise.notes || ''} 
                    onChange={(e) => updateExercise(index, 'notes', e.target.value)} 
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white mr-2"
                    placeholder="Note (es. Cardio - Gambe - Riscaldamento)"
                    rows={1}
                  />
                  <button 
                    onClick={() => removeExercise(index)} 
                    className="text-red-400 hover:text-red-300 p-2 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Azioni Finali */}
      {manualText && exercises.length > 0 && (
        <div className="flex space-x-3 pt-4">
          <button 
            onClick={handleImport} 
            className="flex-1 accent-gradient text-white py-3 rounded-lg font-medium"
          >
            Importa {exercises.length} Esercizi
          </button>
          <button 
            onClick={onClose} 
            className="flex-1 border border-slate-600 text-slate-300 py-3 rounded-lg font-medium"
          >
            Annulla
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseImporter;
