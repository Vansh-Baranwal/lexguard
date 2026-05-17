declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export function getDocument(src: {
    data: Uint8Array;
    useSystemFonts?: boolean;
    disableFontFace?: boolean;
  }): {
    promise: Promise<{
      numPages: number;
      getPage(pageNum: number): Promise<{
        getTextContent(): Promise<{
          items: Array<{ str?: string } | Record<string, unknown>>;
        }>;
      }>;
    }>;
  };
}
