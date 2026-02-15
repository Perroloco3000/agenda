-- 1. Members Table
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'Activo',
  plan TEXT DEFAULT 'Premium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reservations Table (Turnos)
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  member_email TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workouts Table (Rutinas)
CREATE TABLE IF NOT EXISTS workouts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  stations INTEGER,
  work TEXT,
  rest TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Scheduled Bookings Table (Clases Programadas)
CREATE TABLE IF NOT EXISTS scheduled_bookings (
  id TEXT PRIMARY KEY,
  time TEXT NOT NULL,
  workout TEXT NOT NULL,
  instructor TEXT NOT NULL,
  booked INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 20,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_bookings ENABLE ROW LEVEL SECURITY;

-- Public Policies (for demo/development)
-- Members
CREATE POLICY "Public Read Access" ON members FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON members FOR UPDATE USING (true);

-- Reservations
CREATE POLICY "Public Read Access" ON reservations FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON reservations FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON reservations FOR DELETE USING (true);

-- Workouts
CREATE POLICY "Public Read Access" ON workouts FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON workouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON workouts FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON workouts FOR DELETE USING (true);

-- Scheduled Bookings
CREATE POLICY "Public Read Access" ON scheduled_bookings FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON scheduled_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON scheduled_bookings FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON scheduled_bookings FOR DELETE USING (true);
