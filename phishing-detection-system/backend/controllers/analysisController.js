const groqService = require('../services/groqService');
const supabase = require('../config/supabase');

/**
 * @desc    Analyze content for phishing indicators (URL, email, SMS, message)
 * @route   POST /api/analyze
 * @access  Private
 */
const analyzeContent = async (req, res) => {
    const { text, type } = req.body;

    if (!text || !type) {
        return res.status(400).json({ message: 'Text and type are required' });
    }

    const allowedTypes = ['url', 'email', 'sms', 'message'];
    if (!allowedTypes.includes(type.toLowerCase())) {
        return res.status(400).json({ message: `Invalid input type. Allowed types: ${allowedTypes.join(', ')}` });
    }

    try {
        // Run AI scanning via Groq Service
        const analysis = await groqService.analyzePayload(text, type.toLowerCase());

        // Construct standard result schema for backward compatibility with frontend
        const result = {
            isPhishing: analysis.isPhishing,
            confidence: typeof analysis.confidence === 'number' ? analysis.confidence / 100 : 0.0,
            features: {
                suspicious_keywords: analysis.indicators || [],
                risk: analysis.risk || 'Low',
                category: analysis.category || 'Legitimate',
                summary: analysis.summary || '',
                recommendation: analysis.recommendation || '',
                length: text.length,
                has_https: type.toLowerCase() === 'url' ? text.startsWith('https') : false
            }
        };

        // Save scan log to Supabase 'scans' table
        const { data: scan, error: dbError } = await supabase
            .from('scans')
            .insert([{
                user_id: req.user.id,
                input_type: type.toLowerCase(),
                content: text,
                result: result
            }])
            .select()
            .single();

        if (dbError) {
            console.error('[analysisController] Database log failure:', dbError.message);
            // We do not crash the request, just log it and return the prediction results
        }

        // Return the exact JSON structure the frontend expects
        res.json({ result });
    } catch (error) {
        console.error('[analysisController] Scanning exception:', error.message);
        res.status(500).json({
            message: 'Error processing threat analysis request',
            error: error.message
        });
    }
};

module.exports = { analyzeContent };
