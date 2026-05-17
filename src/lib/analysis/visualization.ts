import { ProcessedClause } from './risk-engine';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface VisualRiskData {
  clauseId: string;
  position: number;
  riskScore: number;
  priority: PriorityLevel;
  heatmapColor: string; // RGBA values for cinematic glows
  glowIntensity: number; // 0.0 to 1.0 for animation opacity/intensity
  highlightedText: string;
}

export function mapSeverityToColor(severity: string): string {
  // Using stark, cinematic colors mapping to risk
  switch (severity) {
    case 'Dangerous': return 'rgba(239, 68, 68, 1)'; // Red
    case 'Moderate': return 'rgba(245, 158, 11, 1)'; // Amber
    default: return 'rgba(34, 197, 94, 1)'; // Green
  }
}

export function calculatePriority(score: number): PriorityLevel {
  if (score >= 85) return 'critical';
  if (score >= 71) return 'high';
  if (score >= 31) return 'medium';
  return 'low';
}

export function prepareVisualizationData(clauses: ProcessedClause[]): VisualRiskData[] {
  return clauses.map(clause => {
    const analysis = clause.analysis;
    if (!analysis) return null;
    
    return {
      clauseId: clause.id,
      position: clause.position,
      riskScore: analysis.riskScore,
      priority: calculatePriority(analysis.riskScore),
      heatmapColor: mapSeverityToColor(analysis.severity),
      glowIntensity: Math.max(0.2, analysis.riskScore / 100), // Min glow of 0.2
      highlightedText: analysis.flaggedText,
    };
  }).filter((v): v is VisualRiskData => v !== null);
}
