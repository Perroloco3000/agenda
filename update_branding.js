
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ympbzkquwhylijdqaktl.supabase.co'
const supabaseAnonKey = '%09eyJhHB...RJyY47D085UILn4YpRaS0fAd8r0K6jDuUSovQVvhGlI' // I'll get this from lib/supabase.ts if possible or use the one I saw in the logs

async function updateBranding() {
    const supabase = createClient(supabaseUrl, 'eyJhcmciOiJQUk9NREUiLCJleHAiOjIwODY3NjI3MDMsImlhdCI6MTcyMjI1ODMwM30.RJyY47D085UILn4YpRaS0fAd8r0K6jDuUSovQVvhGlI') // Using the key from the console logs provided by user

    console.log("Updating logoUrl in system_settings...")
    const { data, error } = await supabase
        .from('system_settings')
        .upsert({ key: 'logoUrl', value: 'https://ympbzkquwhylijdqaktl.supabase.co/storage/v1/object/public/exercise-videos/Gemini_Generated_Image_g5gqdtg5gqdtg5gq%20(1).png' }, { onConflict: 'key' })

    if (error) {
        console.error("Error updating branding:", error)
    } else {
        console.log("Branding updated successfully!")
    }
}

updateBranding()
