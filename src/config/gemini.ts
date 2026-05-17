import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { env } from './env';
import { logger } from '../utils/logger';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

export const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
  
  if (!apiKey) {
    logger.error('❌ GEMINI_API_KEY is not set in environment variables');
    logger.info('Get your free API key at: https://aistudio.google.com');
    return null;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash (faster and free)
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    logger.info('✅ Google Gemini AI initialized successfully');
    return model;
  } catch (error) {
    logger.error('❌ Failed to initialize Gemini:', error);
    return null;
  }
};

export const getGeminiModel = () => {
  if (!model) {
    throw new Error('Gemini model not initialized. Please check your GEMINI_API_KEY');
  }
  return model;
};

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const geminiModel = getGeminiModel();
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    logger.error('Gemini API error:', error);
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your configuration.');
    }
    throw new Error('Failed to generate AI response: ' + error.message);
  }
};

export const generateGeminiStructuredResponse = async (prompt: string): Promise<any> => {
  try {
    const geminiModel = getGeminiModel();
    
    const enhancedPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown formatting, no backticks, no extra text.`;
    
    const result = await geminiModel.generateContent(enhancedPrompt);
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
    } catch (parseError) {
      logger.error('Failed to parse Gemini response as JSON:', cleanText.substring(0, 200));
      return {};
    }
  } catch (error: any) {
    logger.error('Gemini API error:', error);
    throw new Error('Failed to generate structured response: ' + error.message);
  }
};