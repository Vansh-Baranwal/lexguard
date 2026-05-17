"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Props {
  frameCount: number;
  pathTemplate: (index: number) => string;
  onComplete: () => void;
}

export function IntroAnimation({ frameCount, pathTemplate, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = pathTemplate(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, [frameCount, pathTemplate]);

  // Draw frame on canvas
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  // Scroll-controlled animation
  useEffect(() => {
    if (!loaded) return;

    drawFrame(0);

    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrolled = window.scrollY;
      const maxScroll = window.innerHeight; // One full viewport height to complete animation
      
      const progress = Math.min(scrolled / maxScroll, 1);
      const frameIndex = Math.floor(progress * (frameCount - 1));
      
      setCurrentFrame(frameIndex);
      drawFrame(frameIndex);

      // Notify parent when animation completes
      if (progress >= 1) {
        onComplete();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loaded, frameCount, onComplete]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (loaded) {
        drawFrame(currentFrame);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded, currentFrame]);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      <div className="sticky top-0 w-full h-screen bg-transparent flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover"
        />
        {/* Bottom blur gradient to blend with background */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" 
             style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} 
        />
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/80 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-purple-800 border-t-purple-400 rounded-full animate-spin" />
            <div className="text-purple-400 text-sm tracking-[0.3em] font-mono uppercase">
              Loading Experience
            </div>
          </div>
        )}
        {/* Progress indicator */}
        {loaded && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <div className="w-64 h-1 bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-100"
                style={{ width: `${(currentFrame / (frameCount - 1)) * 100}%` }}
              />
            </div>
            <p className="text-purple-300 text-xs text-center mt-2 font-mono">
              Scroll to explore
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
