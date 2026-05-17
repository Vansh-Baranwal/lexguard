"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * A zero-dependency cinematic scroll section that uses
 * canvas-drawn generative visuals instead of pre-rendered WebP frames.
 * Renders a dark, abstract legal-intelligence aesthetic driven by scroll progress.
 */
export function CinematicScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  // Scroll → progress mapping
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = windowHeight - top;
      const maxScroll = height + windowHeight;
      const p = Math.max(0, Math.min(1, scrollY / maxScroll));
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const p = progress;

      // Deep black background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      // Draw scanning grid lines that fade in with scroll
      const gridAlpha = Math.min(p * 2, 0.15);
      ctx.strokeStyle = `rgba(120, 120, 140, ${gridAlpha})`;
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Central scanning beam
      const beamY = p * h;
      const beamGrad = ctx.createLinearGradient(0, beamY - 80, 0, beamY + 80);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      beamGrad.addColorStop(0.5, `rgba(200, 210, 255, ${0.08 + p * 0.12})`);
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, beamY - 80, w, 160);

      // Horizontal scan line
      ctx.strokeStyle = `rgba(180, 200, 255, ${0.2 + p * 0.4})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, beamY);
      ctx.lineTo(w, beamY);
      ctx.stroke();

      // Pulsing concentric circles at center
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.4;
      const rings = 5;
      for (let i = 0; i < rings; i++) {
        const rProgress = (p + i / rings) % 1;
        const r = rProgress * maxR;
        const alpha = (1 - rProgress) * 0.12;
        ctx.strokeStyle = `rgba(140, 160, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Central glow orb
      const orbRadius = 40 + p * 60;
      const orbGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbRadius);
      const orbAlpha = 0.05 + p * 0.15;
      orbGrad.addColorStop(0, `rgba(160, 180, 255, ${orbAlpha})`);
      orbGrad.addColorStop(0.5, `rgba(100, 120, 200, ${orbAlpha * 0.5})`);
      orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orbGrad;
      ctx.fillRect(cx - orbRadius, cy - orbRadius, orbRadius * 2, orbRadius * 2);

      // Status text that shifts with scroll
      ctx.fillStyle = `rgba(140, 160, 200, ${0.3 + p * 0.5})`;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '4px';

      const messages = [
        'INITIALIZING LEGAL INTELLIGENCE ENGINE',
        'SCANNING DOCUMENT STRUCTURE',
        'DETECTING EXPLOITATIVE PATTERNS',
        'EVALUATING FINANCIAL LIABILITIES',
        'ANALYSIS COMPLETE'
      ];
      const msgIndex = Math.min(Math.floor(p * messages.length), messages.length - 1);
      ctx.fillText(messages[msgIndex].toUpperCase(), cx, cy + orbRadius + 50);

      // Corner markers (HUD aesthetic)
      const markerSize = 30;
      const markerAlpha = 0.15 + p * 0.25;
      ctx.strokeStyle = `rgba(160, 180, 220, ${markerAlpha})`;
      ctx.lineWidth = 1;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(40, 40 + markerSize);
      ctx.lineTo(40, 40);
      ctx.lineTo(40 + markerSize, 40);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(w - 40 - markerSize, 40);
      ctx.lineTo(w - 40, 40);
      ctx.lineTo(w - 40, 40 + markerSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(40, h - 40 - markerSize);
      ctx.lineTo(40, h - 40);
      ctx.lineTo(40 + markerSize, h - 40);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(w - 40 - markerSize, h - 40);
      ctx.lineTo(w - 40, h - 40);
      ctx.lineTo(w - 40, h - 40 - markerSize);
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [progress]);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      </div>
    </div>
  );
}
