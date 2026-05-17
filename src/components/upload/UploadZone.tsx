"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// Mock demo data
const MOCK_ANALYSIS = {
  fileName: "sample-contract.pdf",
  fileSize: 245678,
  mimeType: "application/pdf",
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

export function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<typeof MOCK_ANALYSIS | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResult(null);

    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show mock results with actual filename
    const mockResult = {
      ...MOCK_ANALYSIS,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    };

    setResult(mockResult);
    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-white bg-white/10' : 'border-zinc-700 hover:border-zinc-500 bg-black/50'}
        `}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-zinc-300">Analyzing document with AI...</p>
        ) : isDragActive ? (
          <p className="text-white">Drop the legal document here...</p>
        ) : (
          <p className="text-zinc-400">Drag & drop a PDF or DOCX here, or click to select</p>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          {/* Summary Card */}
          <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{result.fileName}</h3>
                <p className="text-sm text-zinc-500">{(result.fileSize / 1024).toFixed(1)} KB • {result.clauseCount} clauses analyzed</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-red-400">{result.summary.overallRating}</div>
                <div className="text-xs text-zinc-500 mt-1">Risk Assessment</div>
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
            {result.clauses.map((clause) => (
              <div 
                key={clause.id}
                className={`p-4 rounded-lg border ${
                  clause.riskLevel === 'CRITICAL' 
                    ? 'bg-red-950/30 border-red-900/50' 
                    : clause.riskLevel === 'HIGH'
                    ? 'bg-orange-950/30 border-orange-900/50'
                    : 'bg-yellow-950/30 border-yellow-900/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-black px-2 py-1 rounded ${
                    clause.riskLevel === 'CRITICAL' 
                      ? 'bg-red-500 text-white' 
                      : clause.riskLevel === 'HIGH'
                      ? 'bg-orange-500 text-white'
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {clause.riskLevel}
                  </span>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">{clause.category}</span>
                </div>
                <p className="text-sm text-zinc-300 mb-3 italic">"{clause.text}"</p>
                <div className="flex flex-wrap gap-2">
                  {clause.concerns.map((concern, idx) => (
                    <span key={idx} className="text-xs bg-black/40 text-zinc-400 px-2 py-1 rounded">
                      • {concern}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
