import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to load a sequence of WebP frames and map them to a canvas.
 * Optimized for cinematic scrolling without the overhead of HTML5 video playback.
 */
export function useScrollFrames(frameCount: number, pathTemplate: (idx: number) => string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const currentFrameRef = useRef(-1);

  // Pre-load images into browser memory
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];
    let isCancelled = false;
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = pathTemplate(i);
      
      img.onload = () => {
        if (isCancelled) return;
        loadedCount++;
        if (loadedCount === frameCount) {
          imagesRef.current = imgs;
          setLoaded(true);
        }
      };
      
      // Fallback for missing frames so the hackathon build doesn't hard crash
      img.onerror = () => {
         if (isCancelled) return;
         loadedCount++;
         if (loadedCount === frameCount) {
           imagesRef.current = imgs;
           setLoaded(true);
         }
      };
      
      imgs.push(img);
    }
    
    return () => { isCancelled = true; };
  }, [frameCount, pathTemplate]);

  // Efficient frame drawing using requestAnimationFrame bounds
  const drawFrame = (frameIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(frameCount - 1, frameIndex));
    
    if (currentFrameRef.current === boundedIndex) return; // Skip redundant paints
    
    const canvas = canvasRef.current;
    const img = imagesRef.current[boundedIndex];
    
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    
    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for max composite performance
    if (!ctx) return;

    currentFrameRef.current = boundedIndex;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.width;
    const ih = img.height;
    
    // Scale image to cover the canvas (cinematic cover crop)
    const scale = Math.max(cw / iw, ch / ih);
    const x = (cw / scale - iw) / 2;
    const y = (ch / scale - ih) / 2;
    
    ctx.drawImage(img, x * scale, y * scale, iw * scale, ih * scale);
  };

  return { canvasRef, loaded, drawFrame };
}
