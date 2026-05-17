import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/parsing/pdf';
import { extractTextFromDOCX } from '@/lib/parsing/docx';
import { cleanLegalText } from '@/lib/parsing/cleaner';
import { chunkLegalText } from '@/lib/parsing/chunker';

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

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

    const arrayBuffer = await file.arrayBuffer();
    
    let rawText = '';
    
    // Temporary In-Memory Processing (No file persistence)
    if (file.type === 'application/pdf') {
      rawText = await extractTextFromPDF(arrayBuffer);
    } else {
      const buffer = Buffer.from(arrayBuffer);
      rawText = await extractTextFromDOCX(buffer);
    }

    const cleanedText = cleanLegalText(rawText);
    const clauses = chunkLegalText(cleanedText);

    // Prepare structured parsed output
    const parsedData = {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      clauseCount: clauses.length,
      clauses: clauses,
      status: 'chunked' // Ready for AI Analysis
    };

    return NextResponse.json(parsedData, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Upload processing error:', err);
    return NextResponse.json({ error: 'Failed to process document', details: err.message }, { status: 500 });
  }
}
