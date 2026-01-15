"use client";

import React, { useEffect, useState } from "react";

// Unified Romantic Background - Clean & Unique
// Deep, saturated mesh gradient with subtle floating particles
export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden">
      <style jsx>{`
        @keyframes aurora-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          33% {
            background-position: 100% 0%;
          }
          66% {
            background-position: 50% 100%;
          }
        }
        @keyframes dust-float {
          0% { 
            transform: translateY(100vh) translateX(0) translateZ(0); 
            opacity: 0; 
          }
          10% { opacity: 0.25; }
          90% { opacity: 0.25; }
          100% { 
            transform: translateY(-20px) translateX(30px) translateZ(0); 
            opacity: 0; 
          }
        }
        .aurora-bg {
          background: linear-gradient(
            -45deg,
            #0a0612 0%,
            #1a0b2e 20%,
            #2d1b3d 35%,
            #4a1220 50%,
            #2d1b3d 65%,
            #090919 80%,
            #0a0612 100%
          );
          background-size: 400% 400%;
          animation: aurora-shift 30s ease-in-out infinite;
        }
        .dust-particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Main Aurora Gradient - Romantic Deep Colors */}
      <div className="aurora-bg absolute inset-0" />

      {/* Subtle Dust Particles for depth */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="dust-particle"
          style={{
            left: `${(i * 8.5) % 100}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            animation: `dust-float ${20 + (i % 4) * 4}s linear ${i * 2}s infinite`,
          }}
        />
      ))}

      {/* Soft Radial Glow in center */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(255, 105, 180, 0.08) 0%, transparent 60%)"
        }}
      />

      {/* Vignette for focus */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)"
        }}
      />
    </div>
  );
}
