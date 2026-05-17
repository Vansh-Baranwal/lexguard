"use client";

import React from 'react';

const features = [
  {
    icon: "🔍",
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms scan every clause, identifying hidden risks and unfair terms in seconds."
  },
  {
    icon: "⚡",
    title: "Real-Time Detection",
    description: "Instant identification of exploitative clauses, financial traps, and liability issues before you sign."
  },
  {
    icon: "🛡️",
    title: "Risk Assessment",
    description: "Comprehensive risk scoring system categorizes threats from low to critical, giving you clear insights."
  },
  {
    icon: "📊",
    title: "Visual Intelligence",
    description: "Interactive visualizations make complex legal language easy to understand at a glance."
  },
  {
    icon: "🔐",
    title: "Privacy First",
    description: "All document processing happens securely in-memory. No data is stored or shared with third parties."
  },
  {
    icon: "⚖️",
    title: "Legal Compliance",
    description: "Built with legal standards in mind, helping you understand your rights and obligations clearly."
  }
];

export function FeaturesSection() {
  return (
    <section className="relative min-h-screen w-full py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-950/20 to-black/80 -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
            Powered by Intelligence
          </h2>
          <p className="text-purple-200 text-lg md:text-xl max-w-3xl mx-auto">
            LexGuard combines cutting-edge AI with legal expertise to protect you from unfair contracts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-6 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200/80 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
