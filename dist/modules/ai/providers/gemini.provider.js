"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGeminiStructuredResponse = exports.generateGeminiResponse = exports.getGeminiModel = exports.initializeGemini = void 0;
const generative_ai_1 = require("@google/generative-ai");
const logger_1 = require("../../../utils/logger");
let genAI = null;
let model = null;
const initializeGemini = () => {
    if (!process.env.GEMINI_API_KEY) {
        logger_1.logger.error('Gemini API key not configured - AI features will not work');
        return null;
    }
    genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
const generateGeminiResponse = async (prompt) => {
    const geminiModel = (0, exports.getGeminiModel)();
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
};
exports.generateGeminiResponse = generateGeminiResponse;
const generateGeminiStructuredResponse = async (prompt) => {
    const geminiModel = (0, exports.getGeminiModel)();
    const result = await geminiModel.generateContent(`${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no backticks, no extra text.`);
    const response = await result.response;
    const text = response.text();
    // Clean the response
    let cleanText = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    // Try to extract JSON if there's extra text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
        cleanText = jsonMatch[0];
    }
    try {
        return JSON.parse(cleanText);
    }
    catch (error) {
        logger_1.logger.error('Failed to parse Gemini response as JSON:', cleanText);
        return {};
    }
};
exports.generateGeminiStructuredResponse = generateGeminiStructuredResponse;
//# sourceMappingURL=gemini.provider.js.map