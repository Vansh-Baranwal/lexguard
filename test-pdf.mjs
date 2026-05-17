import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

// NO workerSrc set at all

const minimalPdf = [
  "%PDF-1.0",
  "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
  "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
  "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
  "4 0 obj << /Length 44 >>",
  "stream",
  "BT /F1 12 Tf 100 700 Td (Hello World) Tj ET",
  "endstream",
  "endobj",
  "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  "xref",
  "0 6",
  "0000000000 65535 f ",
  "0000000009 00000 n ",
  "0000000058 00000 n ",
  "0000000115 00000 n ",
  "0000000266 00000 n ",
  "0000000360 00000 n ",
  "trailer << /Size 6 /Root 1 0 R >>",
  "startxref",
  "441",
  "%%EOF"
].join("\n");

const buf = new TextEncoder().encode(minimalPdf);

try {
  const doc = await getDocument({ data: buf, useSystemFonts: true, disableFontFace: true }).promise;
  const page = await doc.getPage(1);
  const tc = await page.getTextContent();
  const text = tc.items.map(i => i.str).join(' ');
  console.log("Pages:", doc.numPages);
  console.log("Text:", JSON.stringify(text));
  console.log("SUCCESS - no workerSrc needed");
} catch (err) {
  console.error("FAILED:", err.message);
}
