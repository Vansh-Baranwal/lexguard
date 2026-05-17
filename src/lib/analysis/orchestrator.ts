import { ProcessedClause } from './risk-engine';
import { VisualRiskData, prepareVisualizationData } from './visualization';
import { RiskCategory } from './categories';

export interface TopRisk {
  clauseId: string;
  category: RiskCategory;
  summary: string;
  score: number;
  explanation: string;
}

export interface ContractIntelligenceReport {
  overallRiskScore: number;
  overallSeverity: 'Safe' | 'Moderate' | 'Dangerous';
  totalClauses: number;
  riskyClauseCount: number;
  topRisks: TopRisk[];
  severityDistribution: {
    safe: number;
    moderate: number;
    dangerous: number;
  };
  visualData: VisualRiskData[];
  executiveSummary: string; 
}

export function generateIntelligenceReport(clauses: ProcessedClause[]): ContractIntelligenceReport {
  const validAnalyses = clauses
    .filter(c => c.analysis)
    .map(c => ({ clause: c, analysis: c.analysis! }));

  if (validAnalyses.length === 0) {
    throw new Error('No valid clause analyses provided for orchestration.');
  }

  let totalScore = 0;
  let safeCount = 0;
  let moderateCount = 0;
  let dangerousCount = 0;
  const topRisks: TopRisk[] = [];

  for (const item of validAnalyses) {
    const { clause, analysis } = item;
    totalScore += analysis.riskScore;

    if (analysis.severity === 'Dangerous') {
      dangerousCount++;
    } else if (analysis.severity === 'Moderate') {
      moderateCount++;
    } else {
      safeCount++;
    }

    if (analysis.severity === 'Dangerous' || analysis.severity === 'Moderate') {
      topRisks.push({
        clauseId: clause.id,
        category: analysis.riskType,
        summary: analysis.summary,
        score: analysis.riskScore,
        explanation: analysis.simpleExplanation,
      });
    }
  }

  // Sort risks descending for immediate cinematic presentation of worst threats
  topRisks.sort((a, b) => b.score - a.score);

  const averageScore = Math.round(totalScore / validAnalyses.length);
  
  // Hard override: even one dangerous clause pushes the contract into dangerous territory
  let overallSeverity: 'Safe' | 'Moderate' | 'Dangerous' = 'Safe';
  if (dangerousCount > 0 || averageScore >= 71) {
    overallSeverity = 'Dangerous';
  } else if (moderateCount > 0 || averageScore >= 31) {
    overallSeverity = 'Moderate';
  }

  const riskyClauseCount = moderateCount + dangerousCount;
  
  // Programmatic summary generation optimized for speed vs calling Gemini again
  let executiveSummary = `This document contains ${validAnalyses.length} structural clauses. `;
  if (dangerousCount > 0) {
    executiveSummary += `Critical legal threats detected. We identified ${dangerousCount} dangerous clauses that severely disadvantage you, and ${moderateCount} moderate risks requiring immediate attention.`;
  } else if (moderateCount > 0) {
    executiveSummary += `Moderate risks detected. We found ${moderateCount} clauses containing unbalanced or potentially exploitative terms. Proceed with caution.`;
  } else {
    executiveSummary += `The agreement appears fundamentally balanced and standard. No exploitative traps or severe liabilities were detected.`;
  }

  return {
    overallRiskScore: averageScore,
    overallSeverity,
    totalClauses: validAnalyses.length,
    riskyClauseCount,
    topRisks: topRisks.slice(0, 5), // Keep top 5 for focused UI presentation
    severityDistribution: {
      safe: safeCount,
      moderate: moderateCount,
      dangerous: dangerousCount,
    },
    visualData: prepareVisualizationData(clauses),
    executiveSummary,
  };
}
