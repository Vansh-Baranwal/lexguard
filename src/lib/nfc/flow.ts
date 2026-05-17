import { VerificationReceipt, VerificationState } from '../zk/proof';

export interface NFCVerificationSession {
  sessionId: string;
  receipt: VerificationReceipt;
  status: VerificationState;
  scanTimestamp?: number;
}

export interface CinematicProofDisplay {
  displayId: string;
  glowColor: string;
  message: string;
  hashPreview: string;
  isVerified: boolean;
}

/**
 * Prepares the NFC verification flow state before the physical scan
 */
export function initializeNFCFlow(receipt: VerificationReceipt): NFCVerificationSession {
  return {
    sessionId: crypto.randomUUID(),
    receipt,
    status: 'unverified'
  };
}

/**
 * Simulates a successful Web NFC NDEFReader scan event payload update
 */
export function confirmNFCScan(session: NFCVerificationSession): NFCVerificationSession {
  // Future Web NFC implementation goes here:
  // const ndef = new NDEFReader(); await ndef.scan(); ...
  return {
    ...session,
    status: 'verified',
    scanTimestamp: Date.now(),
  };
}

/**
 * Transforms backend verification state into frontend-ready cinematic properties
 * to power glowing UI elements and animations.
 */
export function prepareCinematicProofDisplay(session: NFCVerificationSession): CinematicProofDisplay {
  const isVerified = session.status === 'verified';
  
  return {
    displayId: session.receipt.proofId,
    // Emits stark red for unverified/waiting, solid green for cryptographic success
    glowColor: isVerified ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.6)',
    message: isVerified ? 'Proof Verified Successfully' : 'Awaiting NFC Tap to Verify...',
    hashPreview: `${session.receipt.contractHash.substring(0, 12)}...${session.receipt.contractHash.substring(52)}`,
    isVerified
  };
}
