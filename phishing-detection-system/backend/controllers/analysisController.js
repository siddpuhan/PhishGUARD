const groqService = require('../services/groqService');
const supabase = require('../config/supabase');
const crypto = require('crypto');

// Reusable URL / domain validation check
const isValidUrlOrDomain = (input) => {
    try {
        new URL(input);
        return true;
    } catch (_) {
        // Check for domain name patterns (e.g. google.com, test-site.org/login)
        const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
        return domainPattern.test(input);
    }
};

/**
 * @desc    Analyze content for phishing indicators (URL, email, SMS, message)
 * @route   POST /api/analyze
 * @access  Private
 */
const analyzeContent = async (req, res) => {
    const { text, type } = req.body;
    const requestId = crypto.randomUUID();

    // 1. Validation Checks
    if (text === undefined || type === undefined) {
        return res.status(400).json({
            error: 'MalformedPayload',
            message: 'Both "text" and "type" keys must be present in the request payload.'
        });
    }

    if (typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({
            error: 'EmptyInput',
            message: 'Input text content cannot be empty and must be a string.'
        });
    }

    const allowedTypes = ['url', 'email', 'sms', 'message'];
    if (typeof type !== 'string' || !allowedTypes.includes(type.toLowerCase())) {
        return res.status(400).json({
            error: 'UnsupportedType',
            message: `Unsupported input type. Allowed values are: ${allowedTypes.join(', ')}`
        });
    }

    if (type.toLowerCase() === 'url' && !isValidUrlOrDomain(text)) {
        return res.status(400).json({
            error: 'InvalidURL',
            message: 'Provided input does not match a valid URL or domain pattern.'
        });
    }

    // 2. Structured Logs start
    console.log('\n===== AI ANALYSIS START =====');
    console.log(`Request ID: ${requestId}`);
    console.log(`Input received: "${text.substring(0, 120)}${text.length > 120 ? '...' : ''}"`);
    console.log(`Input type: ${type.toLowerCase()}`);

    try {
        // Run AI scanning via Groq Service (will print "Calling Groq..." & "Groq response received")
        const analysis = await groqService.analyzePayload(text, type.toLowerCase(), requestId);

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

        // Save scan log to Supabase
        console.log('Saving to Supabase...');
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
            console.error(`[analysisController] Database log failure for Request ID ${requestId}:`, dbError.message);
        } else {
            console.log('Saved successfully');
        }

        console.log('===== AI ANALYSIS COMPLETE =====\n');

        // Return clean JSON structure
        res.json({ result });
    } catch (error) {
        console.error('===== AI ANALYSIS COMPLETE (WITH ERROR) =====\n');
        
        // Return clean structured error JSON (without exposing stack traces)
        res.status(error.statusCode || 500).json({
            error: error.type || 'ServerError',
            message: error.message || 'An error occurred during threat analysis.'
        });
    }
};

module.exports = { analyzeContent };
