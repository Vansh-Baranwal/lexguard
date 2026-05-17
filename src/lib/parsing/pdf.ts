// Server-side PDF text extraction using the pdfjs-dist legacy build.
// The legacy build is specifically designed for Node.js environments and
// does NOT require browser workers or workerSrc configuration.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error -- legacy build has no dedicated type declarations
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdfDocument = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: { str?: string }) => item.str || '')
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText;
  } catch (error) {
    console.error('Failed to extract PDF text:', error);
    throw new Error('Failed to parse PDF document.');
  }
}
