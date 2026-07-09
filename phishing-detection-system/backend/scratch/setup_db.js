const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('Error: DATABASE_URL is not set in environment variables');
    process.exit(1);
}

async function runSetup() {
    console.log('Connecting to PostgreSQL database...');
    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Successfully connected to database!');

        const sqlFilePath = path.join(__dirname, '../db_setup.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        // Split statements by semicolon, filtering out empty ones
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Executing ${statements.length} SQL statements...`);

        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            try {
                await client.query(statement);
            } catch (err) {
                // If it already exists, just log it as info rather than failing
                if (err.message.includes('already exists') || err.message.includes('already a policy')) {
                    console.log(`Info: ${err.message}`);
                } else {
                    throw err;
                }
            }
        }

        console.log('Database setup executed successfully!');
    } catch (err) {
        console.error('Database setup failed:', err.message);
    } finally {
        await client.end();
    }
}

runSetup();
