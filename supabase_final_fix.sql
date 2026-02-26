-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Settings Table for Branding Sync
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Settings
INSERT INTO system_settings (key, value) VALUES 
('gymName', 'KAICENTER SC'),
('slogan', 'Osteomuscular & Ecological'),
('logoUrl', '')
ON CONFLICT (key) DO NOTHING;

-- 3. Enable Realtime for Tables
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE reservations REPLICA IDENTITY FULL;
ALTER TABLE system_settings REPLICA IDENTITY FULL;

-- 4. Trigger Function to create notification on new reservation
CREATE OR REPLACE FUNCTION notify_new_reservation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (title, description, type)
  VALUES (
    'Nueva Reserva',
    NEW.member_name || ' ha reservado para el ' || NEW.date || ' a las ' || NEW.time_slot,
    'info'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_reservation_created ON reservations;
CREATE TRIGGER on_reservation_created
AFTER INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION notify_new_reservation();

-- 5. Trigger Function to create notification on new member
CREATE OR REPLACE FUNCTION notify_new_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (title, description, type)
  VALUES (
    'Nuevo Miembro',
    NEW.name || ' se ha unido a Kai Center.',
    'success'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_member_created ON members;
CREATE TRIGGER on_member_created
AFTER INSERT ON members
FOR EACH ROW
EXECUTE FUNCTION notify_new_member();

-- 6. Add RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON notifications FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON notifications FOR DELETE USING (true);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access Settings" ON system_settings FOR SELECT USING (true);
CREATE POLICY "Public Update Access Settings" ON system_settings FOR UPDATE USING (true);
CREATE POLICY "Public Insert Access Settings" ON system_settings FOR INSERT WITH CHECK (true);
