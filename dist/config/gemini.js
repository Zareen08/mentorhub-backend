"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChatResponse = exports.generateStructuredResponse = exports.generateAIResponse = exports.getGeminiModel = exports.initializeGemini = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let genAI = null;
let model = null;
const initializeGemini = () => {
    if (!env_1.env.GEMINI_API_KEY) {
        logger_1.logger.warn('Gemini API key not configured');
        return null;
    }
    genAI = new generative_ai_1.GoogleGenerativeAI(env_1.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Free tier model
    logger_1.logger.info('✅ Google Gemini AI initialized (Free)');
    return model;
};
exports.initializeGemini = initializeGemini;
const getGeminiModel = () => {
    if (!model) {
        throw new Error('Gemini model not initialized');
    }
    return model;
};
exports.getGeminiModel = getGeminiModel;
const generateAIResponse = async (prompt) => {
    const geminiModel = (0, exports.getGeminiModel)();
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
};
exports.generateAIResponse = generateAIResponse;
const generateStructuredResponse = async (prompt) => {
    const geminiModel = (0, exports.getGeminiModel)();
    const result = await geminiModel.generateContent(`${prompt}\n\nIMPORTANT: Return ONLY valid JSON, no markdown formatting, no backticks.`);
    const response = await result.response;
    const text = response.text();
    // Clean up the response - remove markdown code blocks if present
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try {
        return JSON.parse(cleanText);
    }
    catch (error) {
        // Try to extract JSON from text
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return {};
    }
};
exports.generateStructuredResponse = generateStructuredResponse;
const generateChatResponse = async (message, systemPrompt) => {
    const geminiModel = (0, exports.getGeminiModel)();
    let fullPrompt = message;
    if (systemPrompt) {
        fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
    }
    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
};
exports.generateChatResponse = generateChatResponse;
//# sourceMappingURL=gemini.js.map