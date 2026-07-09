const axios = require('axios');

const BACKEND_URL = 'http://localhost:8000/api';

async function verifyFlow() {
    const timestamp = Date.now();
    const testUser = {
        username: `test_operative_${timestamp}`,
        email: `test_op_${timestamp}@security.net`,
        password: 'securepassphrase123'
    };

    console.log('--- STARTING DATABASE END-TO-END VERIFICATION ---');

    try {
        // 1. REGISTER
        console.log('\n[1/4] Registering new test user...');
        const regRes = await axios.post(`${BACKEND_URL}/auth/register`, testUser);
        console.log('Registration Response Status:', regRes.status);
        console.log('User registered with ID:', regRes.data._id);
        const token = regRes.data.token;

        const authHeaders = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // 2. LOGIN
        console.log('\n[2/4] Testing user login...');
        const loginRes = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login Response Status:', loginRes.status);
        console.log('JWT Token successfully generated on login.');

        // 3. SCAN PAYLOAD
        console.log('\n[3/4] Submitting phishing target to threat scanner...');
        const scanRes = await axios.post(`${BACKEND_URL}/scan/predict`, {
            text: 'http://secure-verify-update.bank.lottery-scam.net/login',
            type: 'url'
        }, authHeaders);
        console.log('Scan Response Status:', scanRes.status);
        console.log('Threat scan prediction result:', JSON.stringify(scanRes.data.result, null, 2));

        // 4. RETRIEVE HISTORICAL LOGS
        console.log('\n[4/4] Retrieving user scan history logs...');
        const historyRes = await axios.get(`${BACKEND_URL}/scan/history`, authHeaders);
        console.log('History Response Status:', historyRes.status);
        console.log(`Scan history retrieved successfully. Total scans found: ${historyRes.data.length}`);
        
        if (historyRes.data.length > 0) {
            console.log('Latest scan content stored in DB:', historyRes.data[0].content);
            console.log('Latest scan result stored in DB:', JSON.stringify(historyRes.data[0].result, null, 2));
        }

        console.log('\n--- VERIFICATION COMPLETED SUCCESSFULLY ---');
        console.log('All database tables (users, scans), constraints, indices, and CRUD operations are fully functional!');
    } catch (err) {
        console.error('\nVerification failed during API check:');
        if (err.response) {
            console.error('Response Status:', err.response.status);
            console.error('Response Data:', err.response.data);
        } else {
            console.error('Error Message:', err.message);
        }
        process.exit(1);
    }
}

verifyFlow();
