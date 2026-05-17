import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildClausePrompt } from './prompts';
import { ClauseAnalysisResult, parseGeminiResponse } from './formatter';

// Support both NEXT_PUBLIC (client-side capable) and standard server-side keys
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

// Safely initialize the SDK
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function analyzeClauseWithGemini(clauseText: string): Promise<ClauseAnalysisResult> {
  if (!genAI) {
    throw new Error('Gemini API key is not configured.');
  }

  // Use gemini-1.5-flash for speed and lightweight execution during the hackathon
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.1, // Very low temperature for highly consistent analytical output
      responseMimeType: "application/json",
    }
  });

  try {
    const prompt = buildClausePrompt(clauseText);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Gemini SDK Analysis Error:", error);
    throw error;
  }
}
