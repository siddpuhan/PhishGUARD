const axios = require('axios');

class GroqService {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY;
        this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        
        if (!this.apiKey) {
            console.warn('[GroqService] Warning: GROQ_API_KEY is not defined in environment variables.');
        }
    }

    /**
     * Analyzes target payload (URL, email, SMS, message) for phishing indicators.
     * @param {string} text - The input payload to scan.
     * @param {string} type - The payload type (url, email, sms, message).
     * @param {string} requestId - Request ID for log correlation.
     * @param {number} retries - Remaining retries for network/timeout errors.
     * @param {number} malformedRetries - Remaining retries for malformed JSON formats.
     * @returns {Promise<Object>} The parsed threat analysis object.
     */
    async analyzePayload(text, type, requestId, retries = 2, malformedRetries = 1) {
        if (!this.apiKey) {
            throw new Error('Groq API Key is missing. Configure GROQ_API_KEY in the backend .env.');
        }

        const systemPrompt = `You are an expert cybersecurity phishing analyst. 
Analyze the input payload (URL, email, SMS, or message) for phishing indicators, malicious intent, spoofing, impersonation, social engineering, credential theft, or scam patterns.

Respond ONLY with a valid JSON object matching the schema below. Do NOT wrap the JSON in markdown code blocks (\`\`\`json ... \`\`\`), do NOT output any introductory text, notes, or explanation outside of the JSON.

Expected JSON Output Schema:
{
  "isPhishing": true,
  "confidence": 95,
  "risk": "Critical",
  "category": "Credential Theft",
  "summary": "Detailed summary of threat analysis",
  "indicators": [
    "Indicator 1 description",
    "Indicator 2 description"
  ],
  "recommendation": "Safety action recommendations"
}

Rule:
- confidence must be an integer between 0 and 100.
- isPhishing must be boolean (true or false).
- risk must be one of: "None", "Low", "Moderate", "High", "Critical".
- category must describe the threat class (e.g., "Legitimate", "Credential Theft", "Brand Impersonation", "Malware Delivery", "Financial Scam", "Suspicious Domain").
- If the payload is completely safe, set isPhishing to false, confidence to 0 (or a low false-positive rate), risk to "None", and category to "Legitimate".

Input Type: ${type.toUpperCase()}
Input Payload to Scrutinize:
${text}`;

        try {
            console.log('Calling Groq...');
            
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Please scan this payload and return the JSON analysis report: "${text}"` }
                    ],
                    temperature: 0.1,
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 25000 // 25 seconds request timeout
                }
            );

            console.log('Groq response received');
            const content = response.data.choices[0].message.content;
            
            const parsedData = JSON.parse(content.trim());

            // Key Validation
            const requiredFields = [
                'isPhishing',
                'confidence',
                'risk',
                'category',
                'summary',
                'indicators',
                'recommendation'
            ];

            const missingFields = requiredFields.filter(field => !(field in parsedData));
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            if (typeof parsedData.isPhishing !== 'boolean') {
                throw new Error('Field "isPhishing" must be a boolean');
            }

            if (typeof parsedData.confidence !== 'number') {
                throw new Error('Field "confidence" must be a number');
            }

            console.log('Response validation passed');
            return parsedData;
        } catch (err) {
            const isSyntaxError = err instanceof SyntaxError;
            const isValidationError = err.message.includes('Missing required fields') || err.message.includes('must be a');

            // Handle malformed JSON with 1 automatic retry
            if (malformedRetries > 0 && (isSyntaxError || isValidationError)) {
                console.warn(`[GroqService] [Request ID: ${requestId}] Malformed JSON response received. Retrying automatically once...`);
                return this.analyzePayload(text, type, requestId, retries, malformedRetries - 1);
            }

            // Identify error context for structured error logging
            let errorType = 'APIError';
            let statusCode = err.response ? err.response.status : null;

            if (err.code === 'ECONNABORTED') {
                errorType = 'Timeout';
                statusCode = 408;
            } else if (isSyntaxError) {
                errorType = 'SyntaxError';
                statusCode = 422;
            } else if (isValidationError) {
                errorType = 'ValidationError';
                statusCode = 422;
            }

            // Structured logging of failures
            console.error(`===== AI ANALYSIS ERROR =====\nRequest ID: ${requestId}\nError Type: ${errorType}\nStatus Code: ${statusCode || 'N/A'}\nMessage: ${err.message}\n=============================`);

            // Network retry strategy (Rate limit 429, timeouts, or backend 5xx)
            const isRateLimit = err.response && err.response.status === 429;
            const isTimeout = err.code === 'ECONNABORTED';
            const isServerErr = err.response && err.response.status >= 500;

            if (retries > 0 && (isRateLimit || isTimeout || isServerErr)) {
                const backoffDelay = isRateLimit ? 5000 : 1500;
                console.log(`[GroqService] Network error. Retrying in ${backoffDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoffDelay));
                return this.analyzePayload(text, type, requestId, retries - 1, malformedRetries);
            }

            // Exclude stacks, return clean errors
            const friendlyErr = new Error(err.message);
            friendlyErr.type = errorType;
            friendlyErr.statusCode = statusCode || 500;
            throw friendlyErr;
        }
    }
}

module.exports = new GroqService();
