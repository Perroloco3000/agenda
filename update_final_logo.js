
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ympbzkquwhylijdqaktl.supabase.co'
const supabaseAnonKey = 'eyJhcmciOiJQUk9NREUiLCJleHAiOjIwODY3NjI3MDMsImlhdCI6MTcyMjI1ODMwM30.RJyY47D085UILn4YpRaS0fAd8r0K6jDuUSovQVvhGlI'

async function updateBranding() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log("Updating final logoUrl in system_settings...")
    const { data, error } = await supabase
        .from('system_settings')
        .upsert({ key: 'logoUrl', value: 'https://ympbzkquwhylijdqaktl.supabase.co/storage/v1/object/public/exercise-videos/Gemini_Generated_Image_lb7xcolb7xcolb7x.png' }, { onConflict: 'key' })

    if (error) {
        console.error("Error updating branding:", error)
    } else {
        console.log("Branding updated successfully!")
    }
}

updateBranding()
