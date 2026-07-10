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
     * @param {number} retries - Remaining retries.
     * @returns {Promise<Object>} The parsed threat analysis object.
     */
    async analyzePayload(text, type, retries = 3) {
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
            console.log(`[GroqService] Sending payload to Groq API (Type: ${type}, Retries left: ${retries})...`);
            
            const response = await axios.post(
                this.apiUrl,
                {
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Please scan this payload and return the JSON analysis report: "${text}"` }
                    ],
                    temperature: 0.1, // Lower temperature for more deterministic/factual output
                    response_format: { type: 'json_object' } // Enforce JSON response mode
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 25000 // 25 seconds request timeout
                }
            );

            const content = response.data.choices[0].message.content;
            console.log('[GroqService] Received response from Groq:', content);
            
            const parsedData = JSON.parse(content.trim());

            // Simple validation check
            if (typeof parsedData.isPhishing !== 'boolean' || typeof parsedData.confidence !== 'number') {
                throw new Error('Parsed response does not match expected schema format');
            }

            return parsedData;
        } catch (err) {
            console.error(`[GroqService] Error occurred: ${err.message}`);

            // Rate limit handling (HTTP 429) or timeouts/server errors
            const isRateLimit = err.response && err.response.status === 429;
            const isTimeout = err.code === 'ECONNABORTED';
            const isServerErr = err.response && err.response.status >= 500;

            if (retries > 0 && (isRateLimit || isTimeout || isServerErr || err instanceof SyntaxError)) {
                const backoffDelay = isRateLimit ? 5000 : 1500; // Wait longer for rate limits
                console.log(`[GroqService] Retrying in ${backoffDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoffDelay));
                return this.analyzePayload(text, type, retries - 1);
            }

            throw err;
        }
    }
}

module.exports = new GroqService();
