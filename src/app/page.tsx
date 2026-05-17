"use client";

import React from "react";
import { UploadZone } from "@/components/upload/UploadZone";
import { CinematicScroll } from "@/components/cinematic/CinematicScroll";
import { ClauseExplorerUI } from "@/components/cinematic/ClauseExplorerUI";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full bg-black text-white selection:bg-white/30 selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. HERO & UPLOAD SECTION */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center z-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black -z-10" />
        
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl px-6 w-full">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            LEXGUARD
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mb-12">
            Cinematic legal intelligence. Upload a contract to instantly detect exploitative clauses, financial traps, and severe liabilities before you sign.
          </p>
          
          <div className="w-full relative group max-w-2xl mx-auto">
            {/* Ambient cinematic glow for the upload zone */}
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-500/20 to-zinc-700/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
            <div className="relative bg-black/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
              <UploadZone />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CINEMATIC GENERATIVE SCROLL SEQUENCE */}
      <CinematicScroll />

      {/* 3. AI RISK VISUALIZATION / CLAUSE EXPLORER */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black z-20 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white">
            Intelligence Engine
          </h2>
          <p className="text-zinc-500 font-mono tracking-[0.2em] mt-4 uppercase text-sm">
            Evaluating Neural Liabilities
          </p>
        </div>
        <ClauseExplorerUI />
      </section>

      {/* 4. PROOF VERIFICATION & NFC CTA */}
      <section className="relative min-h-[80vh] w-full flex flex-col items-center justify-center bg-zinc-950 border-t border-white/5 z-20">
        <div className="max-w-3xl text-center px-6 space-y-8">
          {/* Glowing NFC Target */}
          <div className="w-32 h-32 rounded-full border border-green-500/30 flex items-center justify-center mx-auto mb-12 relative group cursor-pointer">
            <div className="absolute inset-0 bg-green-500/5 rounded-full group-hover:bg-green-500/20 transition-colors duration-700" />
            <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping opacity-50" />
            <span className="text-green-500 font-mono text-sm tracking-[0.3em] font-bold">NFC</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Cryptographic Proof</h2>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light">
            Tap your NFC-enabled device to permanently verify this contract review. Generates a privacy-first ZK-inspired proof receipt bound directly to your identity.
          </p>
          
          <div className="pt-12">
            <button className="px-10 py-5 bg-white text-black text-xs font-black tracking-[0.2em] uppercase rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]">
              Initialize Secure Tap
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
