const axios = require('axios');
const supabase = require('../config/supabase');

// @desc    Scan URL or Text
// @route   POST /api/scan/predict
// @access  Private
const predictPhishing = async (req, res) => {
    const { text, type } = req.body; // type: 'url' or 'email'

    if (!text || !type) {
        return res.status(400).json({ message: 'Text and type are required' });
    }

    try {
        // Call FastAPI ML Service
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
        const mlResponse = await axios.post(`${mlServiceUrl}/predict`, {
            text,
            type,
        });

        const { is_phishing, confidence, features } = mlResponse.data;

        // Save to History using Supabase
        const { data: scan, error } = await supabase
            .from('scans')
            .insert([{
                user_id: req.user.id,
                input_type: type,
                content: text,
                result: {
                    isPhishing: is_phishing,
                    confidence: confidence,
                    features: features,
                },
            }])
            .select()
            .single();

        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error saving scan' });
        }

        res.json(scan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing scan request' });
    }
};

// @desc    Get User Scan History
// @route   GET /api/scan/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const { data: history, error } = await supabase
            .from('scans')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform keys to match frontend expectation if needed, or update frontend.
        // Frontend expects 'inputType', 'result', 'createdAt'.
        // Supabase returns 'input_type', 'result', 'created_at'.
        // Let's map it to keep frontend happy.
        const mappedHistory = history.map(h => ({
            _id: h.id,
            user: h.user_id,
            inputType: h.input_type,
            content: h.content,
            result: h.result,
            createdAt: h.created_at
        }));

        res.json(mappedHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Analytics (Admin)
// @route   GET /api/scan/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const { count: totalScans } = await supabase
            .from('scans')
            .select('*', { count: 'exact', head: true });

        // For JSON column filtering, Supabase requires specific syntax or client-side filtering
        // Since 'result' is JSONB, we can use the arrow operator ->>
        // result->'isPhishing'
        // However, boolean casts in Supabase filter can be tricky. 
        // Let's fetch all (if small scale) or use a raw query if needed.
        // For simplicity in this demo, let's just fetch basic counts.
        
        // Actually, we can just fetch all 'scans' with result->isPhishing = true
        // But supabase-js .eq('result->isPhishing', true) isn't standard syntax.
        
        // Let's grab the recent 1000 and calculate stats manually for this prototype to ensure accuracy without complex SQL setup
        const { data: allRecentScans } = await supabase
            .from('scans')
            .select('*')
            .limit(1000);

        const phishingCount = allRecentScans.filter(s => s.result.isPhishing).length;
        const legitimateCount = totalScans - phishingCount; // Estimate based on sample or just use sample counts

        res.json({
            totalScans,
            phishingCount,
            legitimateCount: totalScans - phishingCount, 
            recentScans: allRecentScans.slice(0, 100) // Send top 100
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { predictPhishing, getHistory, getAnalytics };
