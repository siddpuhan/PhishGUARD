const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scan', require('./routes/scanRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Keep-alive ping endpoint (prevents Render free tier from sleeping)
app.get('/api/ping', (req, res) => {
    res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
});

// ML Service Keep-Alive: Ping ML service every 10 minutes to prevent sleep
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

function pingMLService() {
    if (ML_SERVICE_URL && ML_SERVICE_URL !== 'http://localhost:8000') {
        axios.get(ML_SERVICE_URL)
            .then(() => {
                console.log('[Keep-Alive] ML service pinged successfully');
            })
            .catch((error) => {
                console.error('[Keep-Alive] ML service ping failed:', error.message);
            });
    }
}

// Start ML service keep-alive
setInterval(pingMLService, PING_INTERVAL);
// Ping immediately on startup
setTimeout(pingMLService, 5000); // Wait 5 seconds after server starts

console.log('[Keep-Alive] ML service keep-alive initialized');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
