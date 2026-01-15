"use client";

import React, { useEffect, useState } from "react";

// Lightweight CSS-only particles for better performance
// Reduced count and using CSS animations
export function WarpSpeedParticles() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Reduced to 12 particles for performance
    const particles = [
        { left: "10%", delay: "0s", duration: "15s", size: 2 },
        { left: "20%", delay: "2s", duration: "18s", size: 1.5 },
        { left: "30%", delay: "4s", duration: "16s", size: 2.5 },
        { left: "40%", delay: "1s", duration: "20s", size: 1 },
        { left: "50%", delay: "3s", duration: "17s", size: 2 },
        { left: "60%", delay: "5s", duration: "19s", size: 1.5 },
        { left: "70%", delay: "0s", duration: "16s", size: 2 },
        { left: "80%", delay: "2s", duration: "18s", size: 1 },
        { left: "90%", delay: "4s", duration: "15s", size: 2.5 },
        { left: "15%", delay: "6s", duration: "20s", size: 1.5 },
        { left: "45%", delay: "7s", duration: "17s", size: 2 },
        { left: "75%", delay: "8s", duration: "19s", size: 1 },
    ];

    return (
        <div className="fixed inset-0 z-[-5] overflow-hidden pointer-events-none">
            <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(100vh) translateZ(0); opacity: 0.4; }
          100% { transform: translateY(-20px) translateZ(0); opacity: 0; }
        }
        .particle {
          position: absolute;
          background: white;
          border-radius: 50%;
          will-change: transform, opacity;
        }
      `}</style>

            {particles.map((p, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        opacity: 0.4,
                        animation: `float-up ${p.duration} linear ${p.delay} infinite`,
                    }}
                />
            ))}
        </div>
    );
}
