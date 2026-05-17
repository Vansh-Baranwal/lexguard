"use client";

import React, { useEffect, useState } from 'react';
import { gestureBus, GestureEvent } from '@/lib/gestures/events';
import { mapGestureToAction } from '@/lib/gestures/actions';

export function ClauseExplorerUI() {
  const [gestureModeActive, setGestureModeActive] = useState(false);
  const [currentClauseIndex, setCurrentClauseIndex] = useState(0);

  // Mock initial state for the UI build (would later consume actual risk-engine orchestration)
  const mockClauses = [
    { id: 1, text: "User agrees to forfeit all rights to class action lawsuits.", severity: "Dangerous", score: 85 },
    { id: 2, text: "Subscription auto-renews annually unless cancelled 90 days prior.", severity: "Moderate", score: 65 },
    { id: 3, text: "Company may share user data with third-party partners.", severity: "Moderate", score: 45 },
    { id: 4, text: "Standard liability limitations apply as permitted by law.", severity: "Safe", score: 10 }
  ];

  useEffect(() => {
    const handleGesture = (event: GestureEvent) => {
      const action = mapGestureToAction(event.type, gestureModeActive);
      
      if (action === 'ACTIVATE_GESTURE_MODE') {
        setGestureModeActive(true);
      } else if (action === 'NAVIGATE_NEXT_CLAUSE') {
        setCurrentClauseIndex(prev => Math.min(prev + 1, mockClauses.length - 1));
      } else if (action === 'NAVIGATE_PREV_CLAUSE') {
        setCurrentClauseIndex(prev => Math.max(prev - 1, 0));
      }
    };

    const unsubscribe = gestureBus.subscribe(handleGesture);
    return () => {
      unsubscribe();
    };
  }, [gestureModeActive, mockClauses.length]);

  const activeClause = mockClauses[currentClauseIndex];
  
  // Cinematic mapping for the clause card glow
  const getGlowColor = (severity: string) => {
    if (severity === 'Dangerous') return 'shadow-[0_0_40px_rgba(239,68,68,0.3)] border-red-500/30';
    if (severity === 'Moderate') return 'shadow-[0_0_40px_rgba(245,158,11,0.3)] border-amber-500/30';
    return 'shadow-[0_0_40px_rgba(34,197,94,0.15)] border-green-500/20';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto p-8 relative">
      
      {/* Gesture State HUD */}
      <div className="absolute -top-12 right-4 flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${gestureModeActive ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-zinc-700'}`} />
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono">
          {gestureModeActive ? 'Neural Link Active' : 'Awaiting Palm Activation'}
        </span>
      </div>

      <h3 className="text-sm text-zinc-500 font-mono mb-8 tracking-[0.3em] uppercase">
        Risk Assessment {currentClauseIndex + 1} / {mockClauses.length}
      </h3>

      {/* Main Intelligent Display */}
      <div className={`
        relative w-full p-12 rounded-3xl bg-zinc-950/90 backdrop-blur-2xl border 
        transition-all duration-700 ease-out transform
        ${getGlowColor(activeClause.severity)}
      `}>
        <p className="text-3xl text-zinc-200 font-light leading-relaxed mb-12 tracking-wide">
          &quot;{activeClause.text}&quot;
        </p>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-bold font-mono uppercase tracking-[0.2em]
              ${activeClause.severity === 'Dangerous' ? 'text-red-400' : 
                activeClause.severity === 'Moderate' ? 'text-amber-400' : 'text-green-400'}
            `}>
              {activeClause.severity} Risk
            </span>
            <span className="text-zinc-600 text-sm font-mono tracking-widest">
              CONFIDENCE {activeClause.score}%
            </span>
          </div>
          
          <div className="flex gap-4 text-zinc-600 font-mono text-xs tracking-widest">
            <button 
              onClick={() => setCurrentClauseIndex(prev => Math.max(prev - 1, 0))}
              className="hover:text-white transition-colors"
            >
              ← SWIPE L
            </button>
            <button 
              onClick={() => setCurrentClauseIndex(prev => Math.min(prev + 1, mockClauses.length - 1))}
              className="hover:text-white transition-colors"
            >
              SWIPE R →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
