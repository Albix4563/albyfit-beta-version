
-- Modifica la tabella exercises per supportare serie multiple
-- Prima rimuoviamo le colonne sets e reps esistenti
ALTER TABLE public.exercises 
DROP COLUMN IF EXISTS sets,
DROP COLUMN IF EXISTS reps;

-- Creiamo una nuova tabella per le serie individuali
CREATE TABLE public.exercise_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  target_weight NUMERIC NULL,
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Aggiungiamo RLS alla nuova tabella
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

-- Policy per visualizzare le serie degli esercizi dei propri allenamenti
CREATE POLICY "Users can view sets of their own workout exercises" 
  ON public.exercise_sets 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises e
      JOIN public.workouts w ON e.workout_id = w.id
      WHERE e.id = exercise_sets.exercise_id AND w.user_id = auth.uid()
    )
  );

-- Policy per inserire serie negli esercizi dei propri allenamenti
CREATE POLICY "Users can create sets for their own workout exercises" 
  ON public.exercise_sets 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exercises e
      JOIN public.workouts w ON e.workout_id = w.id
      WHERE e.id = exercise_sets.exercise_id AND w.user_id = auth.uid()
    )
  );

-- Policy per aggiornare serie degli esercizi dei propri allenamenti
CREATE POLICY "Users can update sets of their own workout exercises" 
  ON public.exercise_sets 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises e
      JOIN public.workouts w ON e.workout_id = w.id
      WHERE e.id = exercise_sets.exercise_id AND w.user_id = auth.uid()
    )
  );

-- Policy per eliminare serie degli esercizi dei propri allenamenti
CREATE POLICY "Users can delete sets of their own workout exercises" 
  ON public.exercise_sets 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises e
      JOIN public.workouts w ON e.workout_id = w.id
      WHERE e.id = exercise_sets.exercise_id AND w.user_id = auth.uid()
    )
  );
