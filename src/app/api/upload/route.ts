import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/parsing/pdf';
import { extractTextFromDOCX } from '@/lib/parsing/docx';
import { cleanLegalText } from '@/lib/parsing/cleaner';
import { chunkLegalText } from '@/lib/parsing/chunker';

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  console.log('[Upload API] Request received');
  try {
    const formData = await request.formData();
    console.log('[Upload API] FormData parsed');
    
    const file = formData.get('file') as File | null;

    if (!file) {
      console.log('[Upload API] No file in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('[Upload API] File received:', file.name, file.type, file.size);

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10MB limit' }, { status: 400 });
    }

    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Only PDF and DOCX are allowed.' }, { status: 400 });
    }

    console.log('[Upload API] Starting file processing');
    const arrayBuffer = await file.arrayBuffer();
    console.log('[Upload API] ArrayBuffer created, size:', arrayBuffer.byteLength);
    
    let rawText = '';
    
    // Temporary In-Memory Processing (No file persistence)
    if (file.type === 'application/pdf') {
      console.log('[Upload API] Processing PDF');
      rawText = await extractTextFromPDF(arrayBuffer);
      console.log('[Upload API] PDF text extracted, length:', rawText.length);
    } else {
      console.log('[Upload API] Processing DOCX');
      const buffer = Buffer.from(arrayBuffer);
      rawText = await extractTextFromDOCX(buffer);
      console.log('[Upload API] DOCX text extracted, length:', rawText.length);
    }

    console.log('[Upload API] Cleaning text');
    const cleanedText = cleanLegalText(rawText);
    console.log('[Upload API] Chunking text');
    const clauses = chunkLegalText(cleanedText);
    console.log('[Upload API] Chunking complete, clauses:', clauses.length);

    // Prepare structured parsed output
    const parsedData = {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      clauseCount: clauses.length,
      clauses: clauses,
      status: 'chunked' // Ready for AI Analysis
    };

    console.log('[Upload API] Success, returning response');
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Upload API] ERROR:', err);
    console.error('[Upload API] Stack:', err.stack);
    return NextResponse.json({ 
      error: 'Failed to process document', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}
