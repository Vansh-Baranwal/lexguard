"use client";

import React, { useState } from "react";
import { UploadZone } from "@/components/upload/UploadZone";
import { IntroAnimation } from "@/components/cinematic/IntroAnimation";
import { ThreeBackground } from "@/components/cinematic/ThreeBackground";
import { ClauseExplorerUI } from "@/components/cinematic/ClauseExplorerUI";

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleIntroComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <>
      {/* Three.js Interactive Background */}
      <ThreeBackground />

      <main className="flex flex-col min-h-screen w-full text-white selection:bg-white/30 selection:text-white font-sans overflow-x-hidden relative">
        
        {/* INTRO ANIMATION - Scroll controlled */}
        <IntroAnimation
          frameCount={36}
          pathTemplate={(idx) => `/ezgif/frame_${String(idx - 1).padStart(2, '0')}_delay-0.083s.webp`}
          onComplete={handleIntroComplete}
        />

        {/* 1. HERO & UPLOAD SECTION */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-black/80 -z-10" />
          
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl px-6 w-full">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-200 to-purple-400">
              LEXGUARD
            </h1>
            <p className="text-purple-200 text-lg md:text-xl font-light tracking-wide max-w-2xl mb-12">
              Cinematic legal intelligence. Upload a contract to instantly detect exploitative clauses, financial traps, and severe liabilities before you sign.
            </p>
            
            <div className="w-full relative group max-w-2xl mx-auto">
              {/* Ambient cinematic glow for the upload zone */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
              <div className="relative bg-black/60 backdrop-blur-md rounded-3xl border border-purple-500/20 shadow-2xl overflow-hidden">
                <UploadZone />
              </div>
            </div>
          </div>
        </section>

        {/* 2. AI RISK VISUALIZATION / CLAUSE EXPLORER */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center z-20 py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-950/30 to-black/80 -z-10" />
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

        {/* 3. PROOF VERIFICATION & NFC CTA */}
        <section className="relative min-h-[80vh] w-full flex flex-col items-center justify-center border-t border-purple-500/20 z-20">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black -z-10" />
          <div className="max-w-3xl text-center px-6 space-y-8">
            {/* Glowing NFC Target */}
            <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center mx-auto mb-12 relative group cursor-pointer">
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/30 transition-colors duration-700" />
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping opacity-50" />
              <span className="text-cyan-400 font-mono text-sm tracking-[0.3em] font-bold">NFC</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              Cryptographic Proof
            </h2>
            <p className="text-purple-200 text-lg md:text-xl leading-relaxed font-light">
              Tap your NFC-enabled device to permanently verify this contract review. Generates a privacy-first ZK-inspired proof receipt bound directly to your identity.
            </p>
            
            <div className="pt-12">
              <button className="px-10 py-5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-black tracking-[0.2em] uppercase rounded-full hover:from-purple-400 hover:to-cyan-400 transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]">
                Initialize Secure Tap
              </button>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
