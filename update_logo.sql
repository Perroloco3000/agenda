
-- Update Logo URL in system_settings
UPDATE system_settings 
SET value = ''
WHERE key = 'logoUrl';

-- If it doesn't exist, insert it (upsert)
INSERT INTO system_settings (key, value)
SELECT 'logoUrl', ''
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE key = 'logoUrl');
