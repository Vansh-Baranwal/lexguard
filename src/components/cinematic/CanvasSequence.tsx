"use client";

import React, { useEffect, useRef } from 'react';
import { useScrollFrames } from '@/hooks/useScrollFrames';

interface Props {
  frameCount: number;
  pathTemplate: (index: number) => string;
}

export function CanvasSequence({ frameCount, pathTemplate }: Props) {
  const { canvasRef, loaded, drawFrame } = useScrollFrames(frameCount, pathTemplate);
  const containerRef = useRef<HTMLDivElement>(null);

  // Bind scroll progress directly to frame progression
  useEffect(() => {
    if (!loaded) return;

    drawFrame(0);

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollY = windowHeight - top;
      const maxScroll = height + windowHeight;
      let progress = scrollY / maxScroll;
      
      progress = Math.max(0, Math.min(1, progress));
      
      const frameIndex = Math.floor(progress * (frameCount - 1));
      
      requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loaded, drawFrame, frameCount]);

  // Responsive canvas resizing
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawFrame(0);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawFrame, canvasRef]);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover opacity-80"
        />
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
             <div className="w-16 h-16 border-4 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
             <div className="text-zinc-500 text-sm tracking-[0.3em] font-mono uppercase">
               Initializing Cinematic Engine
             </div>
          </div>
        )}
        {/* Soft edge gradient to blend with the rest of the dark site */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />
      </div>
    </div>
  );
}
