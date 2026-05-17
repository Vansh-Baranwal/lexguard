"use client";

import React, { useEffect, useRef, useState } from "react";
import { preloadFrames, calculateFrameIndex, renderFrame } from "@/lib/utils/animation";

const FRAME_COUNT = 144;

export default function ScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    preloadFrames(
      {
        frameCount: FRAME_COUNT,
        framePrefix: "frame_",
        frameExtension: "webp",
        framesPath: "/ezgif/",
      },
      (progress) => setLoadingProgress(progress)
    ).then((loadedFrames) => {
      setFrames(loadedFrames);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!canvasRef.current || !containerRef.current || frames.length === 0) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) return;

      const endScroll = rect.height - window.innerHeight;
      let progress = -rect.top / endScroll;
      
      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));
      
      const frameIndex = calculateFrameIndex(progress, frames.length);
      const frame = frames[frameIndex];
      
      if (frame) {
        renderFrame(ctx, frame, canvas.width, canvas.height);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial render
    handleScroll();
    
    // Resize handler
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        handleScroll(); // re-render current frame
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // set initial size
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [frames]);

  return (
    <section id="scroll-animation" ref={containerRef} className="relative min-h-[400vh] w-full border-t border-zinc-800">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {loadingProgress < 1 && (
          <div className="absolute z-10 flex flex-col items-center">
            <p className="text-xl text-zinc-400 mb-2">Loading Animation...</p>
            <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress * 100}%` }}
              />
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
