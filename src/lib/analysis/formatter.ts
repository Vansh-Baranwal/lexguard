import { RiskCategory } from './categories';

export interface ClauseAnalysisResult {
  riskScore: number;
  severity: 'Safe' | 'Moderate' | 'Dangerous';
  riskType: RiskCategory;
  summary: string;
  simpleExplanation: string;
  flaggedText: string;
  confidence: number;
}

export function parseGeminiResponse(responseText: string): ClauseAnalysisResult {
  try {
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);
    
    return {
      riskScore: typeof data.riskScore === 'number' ? data.riskScore : 0,
      severity: data.severity || 'Safe',
      riskType: data.riskType || 'Safe',
      summary: data.summary || 'No risks identified.',
      simpleExplanation: data.simpleExplanation || 'This clause appears to be safe and standard.',
      flaggedText: data.flaggedText || '',
      confidence: typeof data.confidence === 'number' ? data.confidence : 100,
    };
  } catch (error) {
    console.error("Failed to parse Gemini JSON output:", error);
    return {
      riskScore: 0,
      severity: 'Safe',
      riskType: 'Safe',
      summary: 'Analysis failed.',
      simpleExplanation: 'Could not analyze this clause due to an internal error.',
      flaggedText: '',
      confidence: 0,
    };
  }
}
