import { analyzeClauseWithGemini } from './gemini';
import { ClauseAnalysisResult } from './formatter';
import { ContractClause } from '../firebase/firestore';

export interface ProcessedClause extends ContractClause {
  analysis?: ClauseAnalysisResult;
}

// Determines the final severity purely based on score for 100% consistency
export function calculateSeverity(score: number): 'Safe' | 'Moderate' | 'Dangerous' {
  if (score <= 30) return 'Safe';
  if (score <= 70) return 'Moderate';
  return 'Dangerous';
}

// Processes a single clause
export async function processClause(clause: ContractClause): Promise<ProcessedClause> {
  try {
    // We only analyze clauses that have actual substance
    if (clause.text.length < 15) {
      return {
        ...clause,
        analysis: {
          riskScore: 0,
          severity: 'Safe',
          riskType: 'Safe',
          summary: 'Clause too short for analysis.',
          simpleExplanation: 'Standard structural text.',
          flaggedText: '',
          confidence: 100,
        }
      };
    }

    const analysis = await analyzeClauseWithGemini(clause.text);
    
    // Override Gemini's potential hallucinations on severity mapping to enforce strict boundaries
    analysis.severity = calculateSeverity(analysis.riskScore);
    
    return {
      ...clause,
      analysis,
    };
  } catch (error) {
    console.error(`Failed to process clause ${clause.id}:`, error);
    return {
      ...clause,
      analysis: {
        riskScore: 0,
        severity: 'Safe',
        riskType: 'Safe',
        summary: 'Analysis failed due to API error.',
        simpleExplanation: 'Could not analyze this clause.',
        flaggedText: '',
        confidence: 0,
      }
    };
  }
}

// Process an array of clauses with limited concurrency to respect API limits
export async function analyzeContractClauses(
  clauses: ContractClause[], 
  concurrencyLimit = 5
): Promise<ProcessedClause[]> {
  const results: ProcessedClause[] = [];
  
  for (let i = 0; i < clauses.length; i += concurrencyLimit) {
    const chunk = clauses.slice(i, i + concurrencyLimit);
    const chunkResults = await Promise.all(chunk.map(c => processClause(c)));
    results.push(...chunkResults);
  }
  
  return results;
}
