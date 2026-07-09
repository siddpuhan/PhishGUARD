const supabase = require('../config/supabase');

async function testConnection() {
    console.log('Testing Supabase client connection...');
    console.log('URL:', process.env.SUPABASE_URL);
    
    try {
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(1);
            
        if (usersError) {
            console.error('Error fetching users:', usersError.message);
        } else {
            console.log('Successfully connected! Users table exists. Sample data:', users);
        }

        const { data: scans, error: scansError } = await supabase
            .from('scans')
            .select('*')
            .limit(1);
            
        if (scansError) {
            console.error('Error fetching scans:', scansError.message);
        } else {
            console.log('Scans table exists. Sample data:', scans);
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

testConnection();
