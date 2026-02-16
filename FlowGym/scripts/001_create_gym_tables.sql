-- Tabla de clientes del gimnasio
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  membership_type TEXT DEFAULT 'basic', -- basic, premium, vip
  start_date DATE DEFAULT CURRENT_DATE,
  photo_url TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de asistencias/registros
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workout_day TEXT NOT NULL, -- monday, tuesday, etc.
  workout_name TEXT NOT NULL,
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT false,
  calories_burned INTEGER,
  duration_minutes INTEGER,
  notes TEXT
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_attendance_client ON attendance(client_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(check_in_time);

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para lectura (el gimnasio puede ver todos los clientes)
CREATE POLICY "Allow public read on clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert on clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on clients" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on clients" ON clients FOR DELETE USING (true);

CREATE POLICY "Allow public read on attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert on attendance" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on attendance" ON attendance FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on attendance" ON attendance FOR DELETE USING (true);

-- Insertar algunos clientes de ejemplo
INSERT INTO clients (name, email, phone, membership_type) VALUES
  ('Carlos García', 'carlos@email.com', '555-0101', 'premium'),
  ('María López', 'maria@email.com', '555-0102', 'vip'),
  ('Juan Rodríguez', 'juan@email.com', '555-0103', 'basic'),
  ('Ana Martínez', 'ana@email.com', '555-0104', 'premium'),
  ('Pedro Sánchez', 'pedro@email.com', '555-0105', 'basic')
ON CONFLICT (email) DO NOTHING;
