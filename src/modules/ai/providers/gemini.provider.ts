import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { logger } from '../../../utils/logger';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

export const initializeGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    logger.error('Gemini API key not configured - AI features will not work');
    return null;
  }

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  logger.info('✅ Google Gemini AI initialized (Free)');
  return model;
};

export const getGeminiModel = () => {
  if (!model) {
    throw new Error('Gemini model not initialized');
  }
  return model;
};

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  const geminiModel = getGeminiModel();
  
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const generateGeminiStructuredResponse = async (prompt: string): Promise<any> => {
  const geminiModel = getGeminiModel();
  
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
  } catch (error) {
    logger.error('Failed to parse Gemini response as JSON:', cleanText);
    return {};
  }
};