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
            console.log(` - Member: [${m.role}] ${m.name} (${m.email}) - Status: ${m.status} - ID: ${m.id}`);
        });
    }

    const { data: workouts, error: wError } = await supabase.from('workouts').select('*');
    if (wError) {
        console.error("Workouts Error:", wError.message);
    } else {
        console.log(`\nFound ${workouts.length} workouts in total.`);
        workouts.forEach(w => {
            console.log(` - Workout: ${w.name} (${w.day}) - ID: ${w.id}`);
        });

        if (workouts.length > 0) {
            console.log(`\nAttempting to delete workout: ${workouts[0].name} (ID: ${workouts[0].id})`);
            const { error: dError } = await supabase.from('workouts').delete().eq('id', workouts[0].id);
            if (dError) {
                console.error("DELETE ERROR:", dError.message);
            } else {
                console.log("Delete successful (or silently ignored by RLS). Checking again...");
                const { data: finalWorkouts } = await supabase.from('workouts').select('*');
                console.log(`Remaining workouts: ${finalWorkouts.length}`);
                if (finalWorkouts.length === workouts.length) {
                    console.error("FAIL: Workout was NOT deleted. Likely due to RLS policies.");
                } else {
                    console.log("SUCCESS: Workout was deleted.");
                }
            }
        }

        const { data: membersAgain } = await supabase.from('members').select('*');
        if (membersAgain && membersAgain.length > 0) {
            const memberId = membersAgain[0].id;
            console.log(`\nChecking reservations for member: ${membersAgain[0].name} (ID: ${memberId})`);
            const { data: res } = await supabase.from('reservations').select('*').eq('member_id', memberId);
            console.log(`Found ${res?.length || 0} reservations.`);

            console.log(`Attempting to delete member: ${membersAgain[0].name} (ID: ${memberId})`);
            const { error: mDError } = await supabase.from('members').delete().eq('id', memberId);
            if (mDError) {
                console.error("MEMBER DELETE ERROR:", mDError.message || mDError);
            } else {
                console.log("Member delete call finished. Checking again...");
                const { data: finalMembers } = await supabase.from('members').select('*');
                console.log(`Remaining members: ${finalMembers.length}`);
                if (finalMembers.length === membersAgain.length) {
                    console.error("FAIL: Member was NOT deleted. This usually means a Foreign Key constraint is blocking it (e.g. they have reservations).");

                    if (res && res.length > 0) {
                        console.log("Suggestion: Delete reservations for this member first.");
                        const { error: resDelErr } = await supabase.from('reservations').delete().eq('member_id', memberId);
                        if (resDelErr) console.error("Error deleting reservations:", resDelErr);
                        else {
                            console.log("Deleted reservations. Retrying member delete...");
                            await supabase.from('members').delete().eq('id', memberId);
                            const { data: finalFinalMembers } = await supabase.from('members').select('*');
                            console.log(`Final members count: ${finalFinalMembers.length}`);
                        }
                    }
                } else {
                    console.log("SUCCESS: Member was deleted.");
                }
            }
        }
    }
    process.exit(0);
}

check();
