import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { env } from './env';
import { logger } from '../utils/logger';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

export const initializeGemini = () => {
  if (!env.GEMINI_API_KEY) {
    logger.warn('Gemini API key not configured');
    return null;
  }

  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Free tier model

  logger.info('✅ Google Gemini AI initialized (Free)');
  return model;
};

export const getGeminiModel = () => {
  if (!model) {
    throw new Error('Gemini model not initialized');
  }
  return model;
};

export const generateAIResponse = async (prompt: string): Promise<string> => {
  const geminiModel = getGeminiModel();
  
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const generateStructuredResponse = async (prompt: string): Promise<any> => {
  const geminiModel = getGeminiModel();
  
  const result = await geminiModel.generateContent(`${prompt}\n\nIMPORTANT: Return ONLY valid JSON, no markdown formatting, no backticks.`);
  const response = await result.response;
  const text = response.text();
  
  // Clean up the response - remove markdown code blocks if present
  let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    // Try to extract JSON from text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {};
  }
};

export const generateChatResponse = async (
  message: string, 
  systemPrompt?: string
): Promise<string> => {
  const geminiModel = getGeminiModel();
  
  let fullPrompt = message;
  if (systemPrompt) {
    fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
  }
  
  const result = await geminiModel.generateContent(fullPrompt);
  const response = await result.response;
  return response.text();
};