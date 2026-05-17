import { generateSHA256Hash, generateProofId } from './hash';

export type VerificationState = 'unverified' | 'reviewed' | 'verified' | 'proof_generated';

export interface VerificationReceipt {
  proofId: string;
  contractHash: string;
  timestamp: number;
  verificationState: VerificationState;
  riskSummary: string; // e.g. "Safe - 0 Critical Risks"
  contractId: string;
  userId: string;
}

export interface ProofGenerationParams {
  contractText: string;
  contractId: string;
  userId: string;
  riskSummary: string;
}

/**
 * Generates a lightweight, privacy-preserving proof of review.
 * Does not store the raw contract, only a combined hash signature.
 */
export async function generateVerificationProof(params: ProofGenerationParams): Promise<VerificationReceipt> {
  const timestamp = Date.now();
  
  // Create a unique salt/payload combination to ensure privacy and uniqueness
  const hashPayload = `lexguard:proof:${params.contractId}:${params.userId}:${timestamp}:${params.contractText}`;
  const contractHash = await generateSHA256Hash(hashPayload);

  return {
    proofId: generateProofId(),
    contractHash,
    timestamp,
    verificationState: 'proof_generated',
    riskSummary: params.riskSummary,
    contractId: params.contractId,
    userId: params.userId,
  };
}

/**
 * Basic integrity check for cinematic frontend validation
 */
export function verifyReceiptIntegrity(receipt: VerificationReceipt): boolean {
  if (!receipt || !receipt.proofId) return false;
  
  const isValidFormat = receipt.proofId.startsWith('LXG-') && receipt.proofId.length === 10;
  const hasValidHash = receipt.contractHash && receipt.contractHash.length === 64;
  
  return isValidFormat && hasValidHash;
}
