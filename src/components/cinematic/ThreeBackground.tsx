"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Create vibrant gradient particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 20;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = (Math.random() - 0.5) * 20;

      // Vibrant colors: purple, blue, cyan, pink
      const colorChoice = Math.random();
      if (colorChoice < 0.25) {
        colorArray[i] = 0.6; colorArray[i + 1] = 0.2; colorArray[i + 2] = 1; // Purple
      } else if (colorChoice < 0.5) {
        colorArray[i] = 0.2; colorArray[i + 1] = 0.6; colorArray[i + 2] = 1; // Blue
      } else if (colorChoice < 0.75) {
        colorArray[i] = 0.2; colorArray[i + 1] = 1; colorArray[i + 2] = 0.9; // Cyan
      } else {
        colorArray[i] = 1; colorArray[i + 1] = 0.3; colorArray[i + 2] = 0.7; // Pink
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating geometric shapes
    const geometries = [
      new THREE.OctahedronGeometry(0.3),
      new THREE.TetrahedronGeometry(0.3),
      new THREE.IcosahedronGeometry(0.3),
    ];

    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      shapes.push(mesh);
      scene.add(mesh);
    }

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate particles
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.03;

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x = elapsedTime * 0.3 + index;
        shape.rotation.y = elapsedTime * 0.2 + index;
        shape.position.y = Math.sin(elapsedTime + index) * 2;
      });

      // Mouse parallax effect
      camera.position.x = mouseRef.current.x * 0.5;
      camera.position.y = mouseRef.current.y * 0.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10"
      style={{
        background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0f0520 50%, #000000 100%)'
      }}
    />
  );
}
