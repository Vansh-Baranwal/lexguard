export function cleanLegalText(rawText: string): string {
  if (!rawText) return '';
  
  return rawText
    // Remove excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove excessive whitespace
    .replace(/[ \t]{2,}/g, ' ')
    // Normalize quotes
    .replace(/[\u201C\u201D"]/g, '"')
    .replace(/[\u2018\u2019']/g, "'")
    // Normalize bullets
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-')
    // Trim edges
    .trim();
}
