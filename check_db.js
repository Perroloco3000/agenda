const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ympbzkquwhylijdqaktl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcGJ6a3F1d2h5bGlqZHFha3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODY3MDMsImV4cCI6MjA4Njc2MjcwM30.RJyY47D085UILn4YpRaS0fAd8r0K6jDuUSovQVvhGlI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log("--- Supabase Data Check ---");
    const { data: members, error } = await supabase.from('members').select('*');
    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(`Found ${members.length} members in total.`);
        members.forEach(m => {
            console.log(` - [${m.role}] ${m.name} (${m.email}) - Status: ${m.status}`);
        });
    }
}

check();
