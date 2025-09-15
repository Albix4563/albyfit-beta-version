
-- Add machine column to exercises table
ALTER TABLE public.exercises 
ADD COLUMN machine TEXT;

-- Add machine column to exercise_sets table for consistency
ALTER TABLE public.exercise_sets 
ADD COLUMN machine TEXT;
