"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Props {
  frameCount: number;
  pathTemplate: (index: number) => string;
  onComplete: () => void;
}

export function IntroAnimation({ frameCount, pathTemplate, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // Auto-play animation when loaded
  useEffect(() => {
    if (!loaded) return;

    let frame = 0;
    const fps = 12; // 12 frames per second for smooth playback
    const interval = 1000 / fps;

    const animate = () => {
      if (frame < frameCount) {
        drawFrame(frame);
        setCurrentFrame(frame);
        frame++;
        setTimeout(animate, interval);
      } else {
        // Animation complete
        setTimeout(() => {
          onComplete();
        }, 500); // Small delay before allowing scroll
      }
    };

    animate();
  }, [loaded, frameCount, onComplete]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (loaded && currentFrame < frameCount) {
        drawFrame(currentFrame);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loaded, currentFrame, frameCount]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover"
      />
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-zinc-400 rounded-full animate-spin" />
          <div className="text-zinc-500 text-sm tracking-[0.3em] font-mono uppercase">
            Loading Experience
          </div>
        </div>
      )}
      {/* Progress indicator */}
      {loaded && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${(currentFrame / frameCount) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
