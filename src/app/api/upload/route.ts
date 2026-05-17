import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/parsing/pdf';
import { extractTextFromDOCX } from '@/lib/parsing/docx';
import { cleanLegalText } from '@/lib/parsing/cleaner';
import { chunkLegalText } from '@/lib/parsing/chunker';

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Sanitize filename to prevent path traversal and XSS
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') // Remove dangerous characters
    .replace(/\.{2,}/g, '_') // Prevent directory traversal
    .substring(0, 255); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' }, 
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` 
      }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
      return NextResponse.json({ 
        error: 'Unsupported file type. Only PDF and DOCX are allowed.' 
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    let rawText = '';
    
    // In-Memory Processing (No file persistence)
    try {
      if (file.type === 'application/pdf') {
        rawText = await extractTextFromPDF(arrayBuffer);
      } else {
        const buffer = Buffer.from(arrayBuffer);
        rawText = await extractTextFromDOCX(buffer);
      }
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Failed to parse document', 
        details: 'The document format may be corrupted or unsupported'
      }, { status: 500 });
    }

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ 
        error: 'No text could be extracted from the document',
        details: 'The document may be empty, image-based, or corrupted'
      }, { status: 400 });
    }

    const cleanedText = cleanLegalText(rawText);
    const clauses = chunkLegalText(cleanedText);

    // Sanitize output data
    const parsedData = {
      fileName: sanitizeFileName(file.name),
      fileSize: file.size,
      mimeType: file.type,
      clauseCount: clauses.length,
      clauses: clauses.map(clause => ({
        ...clause,
        // Ensure clause text is safe for rendering
        text: clause.text.substring(0, 1000) // Limit clause length
      })),
      status: 'chunked'
    };

    return NextResponse.json(parsedData, { 
      status: 200,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    });
  } catch (error: unknown) {
    // Log error securely (use proper logging service in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('[Upload API] ERROR:', error);
    }
    
    return NextResponse.json({ 
      error: 'Failed to process document', 
      details: 'An unexpected error occurred. Please try again.'
    }, { status: 500 });
  }
}
