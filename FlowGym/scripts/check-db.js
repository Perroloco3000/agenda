
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ympbzkquwhylijdqaktl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcGJ6a3F1d2h5bGlqZHFha3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODY3MDMsImV4cCI6MjA4Njc2MjcwM30.RJyY47D085UILn4YpRaS0fAd8r0K6jDuUSovQVvhGlI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("--- Supabase Debug ---");
    const { data, error } = await supabase.from('system_settings').select('*');
    if (error) {
        console.error("Error fetching system_settings:", error);
    } else {
        console.log("Data in system_settings:", data);
        if (data.length === 0) {
            console.warn("Table exists but is EMPTY. Upsert might need initial rows if not handled by Supabase.");
        }
    }
}

check();
