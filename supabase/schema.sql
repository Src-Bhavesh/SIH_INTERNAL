-- ═══════════════════════════════════════════════════════════════
-- SurakshaOS — Complete Supabase PostgreSQL Schema
-- ═══════════════════════════════════════════════════════════════

-- 1. Users Table (Students, Teachers, Admins, District)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  school_id TEXT NOT NULL DEFAULT 'school-001',
  class_id TEXT,
  assigned_classes TEXT[],
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Student Progress Table (Real-time IDRI metrics & modules)
CREATE TABLE IF NOT EXISTS public.student_progress (
  user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  overall INTEGER DEFAULT 0 NOT NULL,
  knowledge INTEGER DEFAULT 0 NOT NULL,
  decision_making INTEGER DEFAULT 0 NOT NULL,
  response_time INTEGER DEFAULT 0 NOT NULL,
  drill_performance INTEGER DEFAULT 0 NOT NULL,
  training_completion INTEGER DEFAULT 0 NOT NULL,
  level TEXT DEFAULT 'needs_improvement' NOT NULL,
  completed_modules JSONB DEFAULT '[]'::jsonb NOT NULL,
  completed_simulations JSONB DEFAULT '[]'::jsonb NOT NULL,
  weak_areas JSONB DEFAULT '[]'::jsonb NOT NULL,
  mistakes JSONB DEFAULT '[]'::jsonb NOT NULL,
  badges JSONB DEFAULT '[]'::jsonb NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  disaster_type TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Simulation Attempts Table
CREATE TABLE IF NOT EXISTS public.simulation_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  score JSONB NOT NULL,
  timeline JSONB DEFAULT '[]'::jsonb,
  evacuation_time_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Drill Participants & Check-In Table
CREATE TABLE IF NOT EXISTS public.drill_participants (
  id TEXT PRIMARY KEY,
  drill_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  class_id TEXT,
  status TEXT DEFAULT 'safe' NOT NULL,
  arrived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drill_participants ENABLE ROW LEVEL SECURITY;

-- 7. Add Open RLS Policies for Anon & Authenticated Clients
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Public read write users') THEN
    CREATE POLICY "Public read write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'student_progress' AND policyname = 'Public read write student_progress') THEN
    CREATE POLICY "Public read write student_progress" ON public.student_progress FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Public read write quiz_attempts') THEN
    CREATE POLICY "Public read write quiz_attempts" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'simulation_attempts' AND policyname = 'Public read write simulation_attempts') THEN
    CREATE POLICY "Public read write simulation_attempts" ON public.simulation_attempts FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'drill_participants' AND policyname = 'Public read write drill_participants') THEN
    CREATE POLICY "Public read write drill_participants" ON public.drill_participants FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
