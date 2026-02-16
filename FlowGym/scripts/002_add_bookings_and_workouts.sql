-- Tabla de Ejercicios
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  gif_url TEXT,
  muscle_groups TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Rutinas (Workouts)
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'hybrid', -- cardio, resistance, hybrid
  work_time INTEGER NOT NULL DEFAULT 45,
  rest_time INTEGER NOT NULL DEFAULT 15,
  sets INTEGER NOT NULL DEFAULT 3,
  hydration_interval INTEGER DEFAULT 4,
  hydration_duration INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabla Intermedia Workout_Exercise (para orden y personalización)
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sequence_order INTEGER NOT NULL,
  duration_override INTEGER, -- Por si un ejercicio específico dura diferente
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Sesiones (Clases programadas)
CREATE TABLE IF NOT EXISTS class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity INTEGER DEFAULT 20,
  instructor_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES class_sessions(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed', -- confirmed, cancelled, attended
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, client_id)
);

-- Habilitar RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad Pestaña Pública (para demo, en producción ajustar)
CREATE POLICY "Allow public read on exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Allow public read on workouts" ON workouts FOR SELECT USING (true);
CREATE POLICY "Allow public read on workout_exercises" ON workout_exercises FOR SELECT USING (true);
CREATE POLICY "Allow public read on class_sessions" ON class_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public read on bookings" ON bookings FOR SELECT USING (true);

-- Insertar algunos ejercicios base
INSERT INTO exercises (name, description, gif_url, muscle_groups) VALUES
  ('Jumping Jacks', 'Salto coordinado de brazos y piernas', 'https://media.giphy.com/media/h4aKSl7N8YAUV81L94/giphy.gif', ARRAY['Cardio', 'Full Body']),
  ('Burpees', 'Flexión con salto explosivo', 'https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.gif', ARRAY['Cardio', 'Full Body']),
  ('Mountain Climbers', 'Escaladores en posición de plancha', 'https://media.giphy.com/media/bqLdwkcMUMGGucLcn1/giphy.gif', ARRAY['Core', 'Cardio']),
  ('Squats', 'Sentadillas profundas', 'https://media.giphy.com/media/1qfKN8Dt0CRdCRxz9q/giphy.gif', ARRAY['Piernas', 'Glúteos'])
ON CONFLICT DO NOTHING;
