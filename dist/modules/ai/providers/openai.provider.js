"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStructuredResponse = exports.generateAIResponse = exports.getOpenAIClient = exports.initializeOpenAI = void 0;
const openai_1 = __importDefault(require("openai"));
const logger_1 = require("../../../utils/logger");
let openaiClient = null;
const initializeOpenAI = () => {
    if (!process.env.OPENAI_API_KEY) {
        logger_1.logger.warn('OpenAI API key not configured');
        return null;
    }
    openaiClient = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    logger_1.logger.info('✅ OpenAI client initialized');
    return openaiClient;
};
exports.initializeOpenAI = initializeOpenAI;
const getOpenAIClient = () => {
    if (!openaiClient) {
        throw new Error('OpenAI client not initialized');
    }
    return openaiClient;
};
exports.getOpenAIClient = getOpenAIClient;
const generateAIResponse = async (prompt, systemPrompt) => {
    const openai = (0, exports.getOpenAIClient)();
    const messages = [];
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
    });
    return completion.choices[0].message.content;
};
exports.generateAIResponse = generateAIResponse;
const generateStructuredResponse = async (prompt, schema) => {
    const openai = (0, exports.getOpenAIClient)();
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
};
exports.generateStructuredResponse = generateStructuredResponse;
//# sourceMappingURL=openai.provider.js.map