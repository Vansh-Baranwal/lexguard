"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload');
      }

      setResult(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setIsUploading(false);
    }
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
    <div className="w-full max-w-2xl mx-auto p-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-white bg-white/10' : 'border-zinc-700 hover:border-zinc-500 bg-black/50'}
        `}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-zinc-300">Processing document securely in-memory...</p>
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
        <div className="mt-4 p-4 bg-zinc-900/80 text-zinc-200 rounded-lg text-sm text-left overflow-auto max-h-64">
          <p className="font-bold text-green-400 mb-2">Success! Document parsed and chunked.</p>
          <pre>{JSON.stringify({ 
            fileName: result.fileName, 
            clauseCount: result.clauseCount,
            status: result.status 
          }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
