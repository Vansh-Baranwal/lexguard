"use client";

import React from 'react';

const steps = [
  {
    number: "01",
    title: "Upload Your Contract",
    description: "Drag and drop any PDF or DOCX legal document. We support employment contracts, NDAs, service agreements, and more.",
    color: "from-purple-500 to-pink-500"
  },
  {
    number: "02",
    title: "AI Analysis Begins",
    description: "Our advanced algorithms parse every clause, comparing against thousands of legal patterns and known exploitative terms.",
    color: "from-pink-500 to-red-500"
  },
  {
    number: "03",
    title: "Risk Detection",
    description: "Problematic clauses are flagged with severity levels: Critical, High, Medium, or Low risk ratings.",
    color: "from-red-500 to-orange-500"
  },
  {
    number: "04",
    title: "Review Results",
    description: "Get a comprehensive breakdown of risks, with plain-language explanations of what each clause means for you.",
    color: "from-orange-500 to-cyan-500"
  }
];

export function HowItWorksSection() {
  return (
    <section className="relative min-h-screen w-full py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-purple-950/30 -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
            How It Works
          </h2>
          <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto">
            Four simple steps to protect yourself from unfair legal agreements
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative flex flex-col md:flex-row items-start gap-6 p-8 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl hover:border-purple-500/50 transition-all duration-300"
            >
              <div className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                {step.number}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-purple-200/80 leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-10 top-full w-0.5 h-8 bg-gradient-to-b from-purple-500/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
