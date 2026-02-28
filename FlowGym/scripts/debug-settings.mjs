
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSettings() {
    console.log("Checking system_settings table...");
    const { data: selectData, error: selectError } = await supabase.from('system_settings').select('*');

    if (selectError) {
        if (selectError.code === '42P01') {
            console.error("Table 'system_settings' does not exist!");
            console.log("Attempting to create table logic...");
        } else {
            console.error("Error selecting from system_settings:", selectError);
        }
    } else {
        console.log("Current settings in DB:", selectData);
    }

    console.log("\nAttempting a test upsert...");
    const { data: upsertData, error: upsertError } = await supabase
        .from('system_settings')
        .upsert({ key: 'debug_test', value: 'connection_ok' }, { onConflict: 'key' });

    if (upsertError) {
        console.error("Upsert failed:", upsertError);
    } else {
        console.log("Upsert successful!");
    }
}

debugSettings();
