import { ContractClause } from '../firebase/firestore';

export function chunkLegalText(cleanedText: string): ContractClause[] {
  // Split by double newlines for clear paragraph separation
  // Also split by single newlines IF followed by a legal bullet/number format (e.g. "1.", "(a)", "- ")
  const splitRegex = /\n\n|\n(?=(?:[0-9]{1,3}\.|[a-zA-Z]\.|\([a-zA-Z0-9]{1,3}\)|[•\-])\s)/;
  const blocks = cleanedText.split(splitRegex);
  
  const clauses: ContractClause[] = [];
  let position = 0;

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    
    clauses.push({
      id: crypto.randomUUID(),
      position: position++,
      text: trimmed
    });
  }

  return clauses;
}
