"use client";

import React from "react";
import { UploadZone } from "@/components/upload/UploadZone";
import { ThreeBackground } from "@/components/cinematic/ThreeBackground";
import { ClauseExplorerUI } from "@/components/cinematic/ClauseExplorerUI";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      {/* Three.js Interactive Background */}
      <ThreeBackground />

      <main className="flex flex-col min-h-screen w-full text-white selection:bg-white/30 selection:text-white font-sans overflow-x-hidden relative">
        
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-500 focus:text-white focus:rounded"
        >
          Skip to main content
        </a>

        {/* 1. HERO & UPLOAD SECTION */}
        <section id="main-content" className="relative min-h-screen w-full flex flex-col items-center justify-center z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-black/80 -z-10" aria-hidden="true" />
          
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl px-6 w-full">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-200 to-purple-400">
              LEXGUARD
            </h1>
            <p className="text-purple-200 text-lg md:text-xl font-light tracking-wide max-w-2xl mb-12">
              Cinematic legal intelligence. Upload a contract to instantly detect exploitative clauses, financial traps, and severe liabilities before you sign.
            </p>
            
            <div className="w-full relative group max-w-2xl mx-auto">
              {/* Ambient cinematic glow for the upload zone */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" aria-hidden="true" />
              <div className="relative bg-black/60 backdrop-blur-md rounded-3xl border border-purple-500/20 shadow-2xl overflow-hidden">
                <UploadZone />
              </div>
            </div>
          </div>
        </section>

        {/* 2. FEATURES SECTION */}
        <FeaturesSection />

        {/* 3. HOW IT WORKS SECTION */}
        <HowItWorksSection />

        {/* 4. AI RISK VISUALIZATION / CLAUSE EXPLORER */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center z-20 py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-950/30 to-black/80 -z-10" aria-hidden="true" />
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white">
              Intelligence Engine
            </h2>
            <p className="text-purple-400 font-mono tracking-[0.2em] mt-4 uppercase text-sm">
              Evaluating Neural Liabilities
            </p>
          </div>
          <ClauseExplorerUI />
        </section>

        {/* 5. SECURITY SECTION */}
        <SecuritySection />

        {/* 6. PROOF VERIFICATION & NFC CTA */}
        <section className="relative min-h-[80vh] w-full flex flex-col items-center justify-center border-t border-purple-500/20 z-20">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black -z-10" aria-hidden="true" />
          <div className="max-w-3xl text-center px-6 space-y-8">
            {/* Glowing NFC Target */}
            <div 
              className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center mx-auto mb-12 relative group cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Initialize NFC verification"
            >
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/30 group-focus:bg-cyan-500/30 transition-colors duration-700" aria-hidden="true" />
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping opacity-50" aria-hidden="true" />
              <span className="text-cyan-400 font-mono text-sm tracking-[0.3em] font-bold">NFC</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              Cryptographic Proof
            </h2>
            <p className="text-purple-200 text-lg md:text-xl leading-relaxed font-light">
              Tap your NFC-enabled device to permanently verify this contract review. Generates a privacy-first ZK-inspired proof receipt bound directly to your identity.
            </p>
            
            <div className="pt-12">
              <button 
                className="px-10 py-5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-black tracking-[0.2em] uppercase rounded-full hover:from-purple-400 hover:to-cyan-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]"
                aria-label="Initialize secure NFC tap verification"
              >
                Initialize Secure Tap
              </button>
            </div>
          </div>
        </section>

        {/* 7. FOOTER */}
        <footer className="relative w-full py-12 px-6 border-t border-purple-500/10 z-20" role="contentinfo">
          <div className="absolute inset-0 bg-black/90 -z-10" aria-hidden="true" />
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-3">
                  LEXGUARD
                </h3>
                <p className="text-purple-200/60 text-sm">
                  AI-powered legal document analysis to protect you from unfair contracts.
                </p>
              </div>
              <nav aria-label="Legal information">
                <h4 className="text-white font-bold mb-3">Legal</h4>
                <ul className="space-y-2 text-purple-200/60 text-sm">
                  <li><a href="#" className="hover:text-purple-200 focus:text-purple-200 focus:outline-none focus:underline">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-purple-200 focus:text-purple-200 focus:outline-none focus:underline">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-purple-200 focus:text-purple-200 focus:outline-none focus:underline">Cookie Policy</a></li>
                </ul>
              </nav>
              <div>
                <h4 className="text-white font-bold mb-3">Disclaimer</h4>
                <p className="text-purple-200/60 text-sm">
                  LexGuard provides informational analysis only and does not constitute legal advice. Consult a qualified attorney for legal guidance.
                </p>
              </div>
            </div>
            <div className="text-center text-purple-400/50 text-sm pt-8 border-t border-purple-500/10">
              © 2026 LexGuard. Built with security and privacy in mind.
            </div>
          </div>
        </footer>

      </main>
    </ErrorBoundary>
  );
}
