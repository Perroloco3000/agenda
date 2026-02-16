const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
    console.log("Checking Supabase connection and data...");
    console.log("URL:", supabaseUrl);

    const { data: members, error: mError } = await supabase.from('members').select('*');
    if (mError) {
        console.error("Error fetching members:", mError);
    } else {
        console.log(`Found ${members.length} members:`);
        members.forEach(m => console.log(`- ${m.name} (${m.email}) [${m.role}]`));
    }

    const { data: res, error: rError } = await supabase.from('reservations').select('*');
    if (rError) {
        console.error("Error fetching reservations:", rError);
    } else {
        console.log(`Found ${res.length} reservations.`);
    }
}

checkData();
