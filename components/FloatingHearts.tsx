"use client";

import React, { useEffect, useState } from "react";

// Lightweight CSS-only floating hearts for Creator page
export function FloatingHearts() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Reduced to 10 hearts for performance
    const hearts = [
        { left: "5%", size: 40, duration: "20s", delay: "0s" },
        { left: "15%", size: 60, duration: "25s", delay: "2s" },
        { left: "25%", size: 30, duration: "22s", delay: "5s" },
        { left: "40%", size: 50, duration: "28s", delay: "1s" },
        { left: "55%", size: 35, duration: "24s", delay: "4s" },
        { left: "65%", size: 70, duration: "26s", delay: "3s" },
        { left: "75%", size: 45, duration: "21s", delay: "6s" },
        { left: "85%", size: 55, duration: "27s", delay: "2s" },
        { left: "92%", size: 25, duration: "23s", delay: "7s" },
        { left: "35%", size: 65, duration: "29s", delay: "4s" },
    ];

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <style jsx>{`
        @keyframes float-heart {
          0% { transform: translateY(100vh) rotate(0deg) translateZ(0); }
          100% { transform: translateY(-100px) rotate(360deg) translateZ(0); }
        }
        .heart-container {
          position: absolute;
          will-change: transform;
        }
      `}</style>

            {hearts.map((heart, i) => (
                <div
                    key={i}
                    className="heart-container"
                    style={{
                        left: heart.left,
                        width: heart.size,
                        height: heart.size,
                        animation: `float-heart ${heart.duration} linear ${heart.delay} infinite`,
                    }}
                >
                    <svg viewBox="0 0 24 24" className="w-full h-full" style={{ opacity: 0.25 }}>
                        <defs>
                            <linearGradient id={`hg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ff69b4" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill={`url(#hg${i})`}
                        />
                    </svg>
                </div>
            ))}
        </div>
    );
}
