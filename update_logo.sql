
-- Update Logo URL in system_settings
UPDATE system_settings 
SET value = 'https://ympbzkquwhylijdqaktl.supabase.co/storage/v1/object/public/exercise-videos/Gemini_Generated_Image_g5gqdtg5gqdtg5gq%20(1).png'
WHERE key = 'logoUrl';

-- If it doesn't exist, insert it (upsert)
INSERT INTO system_settings (key, value)
SELECT 'logoUrl', 'https://ympbzkquwhylijdqaktl.supabase.co/storage/v1/object/public/exercise-videos/Gemini_Generated_Image_g5gqdtg5gqdtg5gq%20(1).png'
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE key = 'logoUrl');
