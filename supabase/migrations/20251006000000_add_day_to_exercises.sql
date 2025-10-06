-- Migration: Add day field to exercises table
-- This field is used to organize exercises by workout days in multi-day workout programs

ALTER TABLE public.exercises 
ADD COLUMN IF NOT EXISTS day TEXT;

-- Add index for better query performance when filtering by day
CREATE INDEX IF NOT EXISTS idx_exercises_day ON public.exercises(day);

-- Add index for workout_id and day combined (for multi-day workout queries)
CREATE INDEX IF NOT EXISTS idx_exercises_workout_day ON public.exercises(workout_id, day);

