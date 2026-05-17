/**
 * Animation Utilities
 * Architecture for scroll-driven WebP frame sequence rendering.
 */

export interface FrameSequenceConfig {
  frameCount: number;
  framePrefix: string;
  frameExtension: string;
  framesPath: string; // e.g. '/ezgif/'
}

/**
 * Preloads a sequence of image frames.
 * @param config Configuration for the frame sequence.
 * @param onProgress Callback for loading progress.
 * @returns Promise that resolves when all frames are loaded.
 */
export async function preloadFrames(
  config: FrameSequenceConfig,
  onProgress?: (progress: number) => void
): Promise<HTMLImageElement[]> {
  const { frameCount, framePrefix, frameExtension, framesPath } = config;
  const frames: HTMLImageElement[] = [];
  
  let loaded = 0;

  return new Promise((resolve) => {
    if (frameCount === 0) {
      resolve([]);
      return;
    }

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      // Pads index with leading zeros if necessary, adjust as needed.
      const indexStr = i.toString().padStart(3, '0');
      img.src = `${framesPath}${framePrefix}${indexStr}.${frameExtension}`;
      
      img.onload = () => {
        loaded++;
        if (onProgress) onProgress(loaded / frameCount);
        if (loaded === frameCount) resolve(frames);
      };
      
      img.onerror = () => {
        // Handle failed frame load silently to keep architecture resilient
        loaded++;
        if (onProgress) onProgress(loaded / frameCount);
        if (loaded === frameCount) resolve(frames);
      };
      
      frames.push(img);
    }
  });
}

/**
 * Calculates the current frame index based on scroll progress.
 * @param scrollProgress Value between 0 and 1.
 * @param frameCount Total number of frames.
 * @returns The index of the frame to display.
 */
export function calculateFrameIndex(scrollProgress: number, frameCount: number): number {
  if (frameCount <= 0) return 0;
  const index = Math.floor(scrollProgress * frameCount);
  return Math.min(index, frameCount - 1);
}

/**
 * Renders a specific frame onto a provided canvas.
 * @param ctx Canvas rendering context.
 * @param image The image element to render.
 * @param width Canvas width.
 * @param height Canvas height.
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number
) {
  if (!ctx || !image.complete || image.naturalWidth === 0) return;
  
  // Clear and draw (covering object-fit logic)
  ctx.clearRect(0, 0, width, height);
  
  const imgRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    drawWidth = height * imgRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawHeight = width / imgRatio;
    offsetY = (height - drawHeight) / 2;
  }
  
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}
