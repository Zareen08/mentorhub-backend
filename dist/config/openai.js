"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenAIClient = exports.initializeOpenAI = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let openaiClient = null;
const initializeOpenAI = () => {
    if (!env_1.env.OPENAI_API_KEY) {
        logger_1.logger.warn('⚠️  OpenAI API key not configured — AI features disabled');
        return null;
    }
    openaiClient = new openai_1.default({ apiKey: env_1.env.OPENAI_API_KEY });
    logger_1.logger.info('✅ OpenAI client initialized');
    return openaiClient;
};
exports.initializeOpenAI = initializeOpenAI;
const getOpenAIClient = () => {
    if (!openaiClient) {
        // Lazy init on first call
        const client = (0, exports.initializeOpenAI)();
        if (!client) {
            throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY env var to use AI features.');
        }
    }
    return openaiClient;
};
exports.getOpenAIClient = getOpenAIClient;
//# sourceMappingURL=openai.js.map