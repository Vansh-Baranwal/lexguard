"use client";

import React from 'react';

export function SecuritySection() {
  return (
    <section className="relative min-h-screen w-full py-24 px-6 flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black to-black/80 -z-10" />
      
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Security Info */}
          <div>
            <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-mono mb-6">
              🔒 ENTERPRISE-GRADE SECURITY
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
              Your Privacy is Our Priority
            </h2>
            
            <p className="text-purple-200 text-lg leading-relaxed mb-8">
              We understand that legal documents contain sensitive information. That's why LexGuard is built with security at its core.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  ✓
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">In-Memory Processing</h4>
                  <p className="text-purple-200/70 text-sm">Documents are processed entirely in memory and never stored on our servers.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  ✓
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Zero Data Retention</h4>
                  <p className="text-purple-200/70 text-sm">Once analysis is complete, all document data is immediately discarded.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  ✓
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Encrypted Transmission</h4>
                  <p className="text-purple-200/70 text-sm">All data transfers use industry-standard TLS encryption.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  ✓
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">No Third-Party Sharing</h4>
                  <p className="text-purple-200/70 text-sm">Your documents are never shared, sold, or transmitted to any third parties.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Element */}
          <div className="relative">
            <div className="relative p-8 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-3xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-3xl animate-pulse" />
              
              <div className="relative space-y-4">
                <div className="p-4 bg-black/40 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 text-sm font-mono">SECURE CONNECTION</span>
                  </div>
                  <div className="text-purple-200/50 text-xs font-mono">TLS 1.3 Encrypted</div>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-cyan-400 text-sm font-mono">IN-MEMORY PROCESSING</span>
                  </div>
                  <div className="text-purple-200/50 text-xs font-mono">No Disk Storage</div>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-purple-400 text-sm font-mono">ZERO RETENTION</span>
                  </div>
                  <div className="text-purple-200/50 text-xs font-mono">Auto-Delete After Analysis</div>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-pink-400 text-sm font-mono">PRIVACY COMPLIANT</span>
                  </div>
                  <div className="text-purple-200/50 text-xs font-mono">GDPR & CCPA Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
