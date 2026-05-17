import React from "react";
import ScrollAnimation from "@/components/ScrollAnimation";
import { UploadZone } from "@/components/upload/UploadZone";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full bg-black text-white selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center pt-20 pb-12 z-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
          LEXGUARD
        </h1>
        <UploadZone />
      </section>

      {/* Cinematic Scroll Animation Section */}
      <ScrollAnimation />

      {/* AI Analysis Section */}
      <section id="ai-analysis" className="relative min-h-screen w-full flex items-center justify-center bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">AI Analysis</h2>
          <p className="text-zinc-400">Gemini AI & MediaPipe integration placeholder.</p>
        </div>
      </section>

      {/* NFC Verification Section */}
      <section id="nfc-verification" className="relative min-h-screen w-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">NFC Verification</h2>
          <p className="text-zinc-400">ZK-proof & NFC scanning infrastructure placeholder.</p>
        </div>
      </section>
    </main>
  );
}
