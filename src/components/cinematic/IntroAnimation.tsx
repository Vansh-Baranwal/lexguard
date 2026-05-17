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
  const [animationComplete, setAnimationComplete] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrollAccumulatorRef = useRef(0);

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

  // Lock scroll and control animation with wheel events
  useEffect(() => {
    if (!loaded) return;

    drawFrame(0);

    const handleWheel = (e: WheelEvent) => {
      if (animationComplete) return; // Allow normal scrolling after animation

      e.preventDefault();

      // Accumulate scroll delta
      scrollAccumulatorRef.current += e.deltaY;

      // Calculate frame based on accumulated scroll (adjust sensitivity)
      const scrollPerFrame = 30; // Lower = more sensitive
      const targetFrame = Math.floor(scrollAccumulatorRef.current / scrollPerFrame);
      const clampedFrame = Math.max(0, Math.min(frameCount - 1, targetFrame));

      setCurrentFrame(clampedFrame);
      drawFrame(clampedFrame);

      // Check if animation is complete
      if (clampedFrame >= frameCount - 1) {
        setAnimationComplete(true);
        onComplete();
      }
    };

    // Prevent default scroll behavior during animation
    const preventScroll = (e: Event) => {
      if (!animationComplete) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [loaded, frameCount, onComplete, animationComplete]);

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

  // Hide container after animation completes
  if (animationComplete) {
    return null;
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50">
      <div className="w-full h-screen bg-transparent flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover"
        />
        {/* Bottom blur gradient to blend with background - reduced blur area */}
        <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" 
             style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} 
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
              Scroll to explore • {currentFrame + 1}/{frameCount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
