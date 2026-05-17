export const RISK_CATEGORIES = [
  'Financial Risk',
  'Privacy Risk',
  'Subscription Trap',
  'Liability Shift',
  'Forced Arbitration',
  'Termination Abuse',
  'Hidden Charges',
  'Auto Renewal',
  'Data Sharing',
  'Safe'
] as const;

export type RiskCategory = typeof RISK_CATEGORIES[number];
