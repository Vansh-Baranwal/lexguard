"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// Type definitions for better type safety
interface ClauseData {
  id: number;
  text: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  concerns: string[];
}

interface AnalysisResult {
  fileName: string;
  fileSize: number;
  mimeType: string;
  clauseCount: number;
  status: string;
  clauses: ClauseData[];
  summary: {
    totalClauses: number;
    highRisk: number;
    criticalRisk: number;
    mediumRisk: number;
    lowRisk: number;
    overallRating: string;
  };
}

// Constants for configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
} as const;

const PROCESSING_DELAY = 1500; // Simulated processing time in ms

// Mock demo data - In production, this would come from backend API
const MOCK_ANALYSIS: Omit<AnalysisResult, 'fileName' | 'fileSize' | 'mimeType'> = {
  clauseCount: 12,
  status: "analyzed",
  clauses: [
    {
      id: 1,
      text: "The Company reserves the right to terminate this agreement at any time without prior notice or compensation.",
      riskLevel: "HIGH",
      category: "Termination Rights",
      concerns: ["Unilateral termination", "No compensation clause", "No notice period"]
    },
    {
      id: 2,
      text: "Employee agrees to a non-compete clause extending 5 years post-employment across all related industries.",
      riskLevel: "CRITICAL",
      category: "Non-Compete",
      concerns: ["Excessive duration", "Overly broad scope", "May be unenforceable"]
    },
    {
      id: 3,
      text: "All intellectual property created during employment, including personal projects, becomes company property.",
      riskLevel: "HIGH",
      category: "IP Rights",
      concerns: ["Overreaching IP claims", "Includes personal work", "No time limitations"]
    },
    {
      id: 4,
      text: "Contractor is responsible for all legal fees and damages in case of any dispute, regardless of outcome.",
      riskLevel: "CRITICAL",
      category: "Liability",
      concerns: ["One-sided liability", "Unlimited financial exposure", "Unfair dispute terms"]
    },
    {
      id: 5,
      text: "Payment terms: Net 90 days after invoice submission and approval.",
      riskLevel: "MEDIUM",
      category: "Payment Terms",
      concerns: ["Extended payment period", "Approval requirement unclear"]
    },
    {
      id: 6,
      text: "This agreement is governed by the laws of [Jurisdiction], and parties waive right to jury trial.",
      riskLevel: "MEDIUM",
      category: "Jurisdiction",
      concerns: ["Jury trial waiver", "Jurisdiction may be inconvenient"]
    }
  ],
  summary: {
    totalClauses: 12,
    highRisk: 2,
    criticalRisk: 2,
    mediumRisk: 3,
    lowRisk: 5,
    overallRating: "HIGH RISK - Review Recommended"
  }
};

// Helper function to sanitize filename for display
const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[<>:"/\\|?*]/g, '_').substring(0, 255);
};

// Helper function to get risk level styling
const getRiskLevelStyles = (riskLevel: ClauseData['riskLevel']) => {
  const styles = {
    CRITICAL: {
      bg: 'bg-red-950/30 border-red-900/50',
      badge: 'bg-red-500 text-white'
    },
    HIGH: {
      bg: 'bg-orange-950/30 border-orange-900/50',
      badge: 'bg-orange-500 text-white'
    },
    MEDIUM: {
      bg: 'bg-yellow-950/30 border-yellow-900/50',
      badge: 'bg-yellow-500 text-black'
    },
    LOW: {
      bg: 'bg-green-950/30 border-green-900/50',
      badge: 'bg-green-500 text-white'
    }
  };
  return styles[riskLevel];
};

export function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: File[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      setError('File rejected. Please ensure it is a PDF or DOCX under 10MB.');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Additional security validation
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate processing delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, PROCESSING_DELAY));

      // Create mock result with sanitized filename
      const mockResult: AnalysisResult = {
        ...MOCK_ANALYSIS,
        fileName: sanitizeFileName(file.name),
        fileSize: file.size,
        mimeType: file.type
      };

      setResult(mockResult);
    } catch (err) {
      setError('An error occurred while processing your document. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragActive ? 'border-purple-400 bg-purple-500/10' : 'border-purple-700/50 hover:border-purple-500 bg-black/50'}
        `}
        aria-label="File upload zone"
      >
        <input {...getInputProps()} aria-label="File input" />
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-800 border-t-purple-400 rounded-full animate-spin" />
            <p className="text-purple-300">Analyzing document with AI...</p>
          </div>
        ) : isDragActive ? (
          <p className="text-white">Drop the legal document here...</p>
        ) : (
          <div>
            <p className="text-purple-200 mb-2">Drag & drop a PDF or DOCX here, or click to select</p>
            <p className="text-purple-400/60 text-sm">Maximum file size: 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700/50 text-red-200 rounded-lg text-sm" role="alert">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          {/* Summary Card */}
          <div className="p-6 bg-zinc-900/80 border border-purple-800/30 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white break-words">{result.fileName}</h3>
                <p className="text-sm text-purple-300/70">
                  {(result.fileSize / 1024).toFixed(1)} KB • {result.clauseCount} clauses analyzed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-red-400">{result.summary.overallRating}</div>
                <div className="text-xs text-purple-400/70 mt-1">Risk Assessment</div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="bg-red-950/50 border border-red-900/50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{result.summary.criticalRisk}</div>
                <div className="text-xs text-red-300/70 uppercase tracking-wider">Critical</div>
              </div>
              <div className="bg-orange-950/50 border border-orange-900/50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-orange-400">{result.summary.highRisk}</div>
                <div className="text-xs text-orange-300/70 uppercase tracking-wider">High</div>
              </div>
              <div className="bg-yellow-950/50 border border-yellow-900/50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{result.summary.mediumRisk}</div>
                <div className="text-xs text-yellow-300/70 uppercase tracking-wider">Medium</div>
              </div>
              <div className="bg-green-950/50 border border-green-900/50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{result.summary.lowRisk}</div>
                <div className="text-xs text-green-300/70 uppercase tracking-wider">Low</div>
              </div>
            </div>
          </div>

          {/* Risky Clauses */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white px-2">⚠️ Flagged Clauses</h4>
            {result.clauses.map((clause) => {
              const styles = getRiskLevelStyles(clause.riskLevel);
              return (
                <div 
                  key={clause.id}
                  className={`p-4 rounded-lg border ${styles.bg}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-black px-2 py-1 rounded ${styles.badge}`}>
                      {clause.riskLevel}
                    </span>
                    <span className="text-xs text-purple-400/70 uppercase tracking-wider">{clause.category}</span>
                  </div>
                  <p className="text-sm text-purple-100 mb-3 italic">"{clause.text}"</p>
                  <div className="flex flex-wrap gap-2">
                    {clause.concerns.map((concern, idx) => (
                      <span key={idx} className="text-xs bg-black/40 text-purple-300/80 px-2 py-1 rounded">
                        • {concern}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}