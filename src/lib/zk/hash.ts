// Lightweight cryptography utilities for hackathon-friendly proof generation

/**
 * Generates a SHA-256 hash natively using the Web Crypto API
 * Safe for both Edge/Node environments in Next.js
 */
export async function generateSHA256Hash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  
  // Use native crypto API (no heavy dependencies)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Generates a human-readable, unique proof identifier (e.g. LXG-9A28XZ)
 * optimized for cinematic display and NFC payload constraints.
 */
export function generateProofId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LXG-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
