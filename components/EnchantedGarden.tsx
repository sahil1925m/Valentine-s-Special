"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import { Sparkles } from "lucide-react";

// Magical Chime Sound
const CHIME_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3";

interface EnchantedGardenProps {
    children?: React.ReactNode;
}

export function EnchantedGarden({ children }: EnchantedGardenProps) {
    const [isOpen, setIsOpen] = useState(false);

    // NOTE: Lottie is completely disabled/removed because the URL was returning 403 Forbidden.
    // We are now using a high-quality SVG fallback exclusively.

    const [playChime] = useSound(CHIME_SOUND_URL, { volume: 0.5 });

    const handleTap = () => {
        if (isOpen) return;
        setIsOpen(true);

        // 1. Magical Sound
        playChime();

        // 2. Confetti / Particles (Gold & Red)
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 60 };

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 40 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                colors: ['#FFD700', '#D4AF37', '#FF0000', '#8B0000', '#FFFFFF'],
                shapes: ['circle', 'star'],
                origin: { x: 0.5, y: 0.6 },
                disableForReducedMotion: true,
            });
        }, 200);
    };

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black/20 pt-24">
            {/* Ambient Lighting / God Rays */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Primary God Ray */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-gradient-to-b from-rose-500/20 via-transparent to-transparent blur-[100px] opacity-60" />
                {/* Secondary Warm Glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-orange-500/10 to-transparent blur-[80px]" />
            </div>

            {/* THE SCENE */}
            <div className="relative z-10 flex flex-col items-center justify-center translate-y-10 md:translate-y-0">

                {/* 1. THE GLASS DOME (Clickable Trigger) */}
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            className="relative z-30 cursor-pointer group"
                            onClick={handleTap}
                            initial={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* Glass Jar */}
                            <div
                                className="w-72 h-96 rounded-t-[1000px] relative border border-white/20 overflow-hidden"
                                style={{
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.02) 100%)",
                                    backdropFilter: "blur(6px)",
                                    boxShadow: "inset 0 0 40px rgba(255, 0, 0, 0.1), 0 0 30px rgba(255, 255, 255, 0.05)",
                                }}
                            >
                                {/* Reflections */}
                                <div className="absolute top-10 left-10 w-20 h-48 bg-gradient-to-b from-white/10 to-transparent rounded-full opacity-50 transform -rotate-12 blur-xl" />
                                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>

                            {/* Handle */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md" />

                            {/* Tap Hint */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <Sparkles className="text-white/40 w-8 h-8 animate-pulse mx-auto mb-2" />
                                <p className="text-white/40 text-xs tracking-[0.3em] font-light uppercase">Tap Me</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2. CENTRAL ROSE (SVG ONLY) */}
                {/* 2. CENTRAL ROSE (SVG ONLY) */}
                <div className="absolute bottom-0 translate-y-8 z-20 w-64 h-72 md:w-80 md:h-96 pointer-events-none flex items-end justify-center">
                    {/* Fallback: Elegant Neon Rose SVG (guaranteed to show) */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 1, filter: "blur(2px)" }}
                        animate={isOpen ? { scale: 1.0, opacity: 1, filter: "drop-shadow(0 0 20px rgba(255,0,0,0.6))" } : { scale: 0.8, opacity: 1, filter: "blur(2px)" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="relative w-full h-full flex items-end justify-center"
                    >
                        <svg width="300" height="450" viewBox="0 0 100 150" className="overflow-visible">
                            <path d="M50 150 Q 45 100, 50 60" stroke="#00ff00" strokeWidth="2" fill="none" style={{ filter: "drop-shadow(0 0 5px #00ff00)" }} />
                            <path d="M50 100 Q 30 90, 20 110 Q 50 110, 50 100" fill="#006400" stroke="#00ff00" strokeWidth="0.5" opacity="0.8" />
                            <path d="M50 80 Q 70 70, 80 90 Q 50 90, 50 80" fill="#006400" stroke="#00ff00" strokeWidth="0.5" opacity="0.8" />
                            <g transform="translate(50, 40)">
                                <path d="M0 0 C -20 -20, -20 20, 0 30 C 20 20, 20 -20, 0 0" fill="#ff0000" />
                                <path d="M-5 5 C -15 -10, -10 25, 0 25" fill="#8b0000" />
                                <path d="M5 5 C 15 -10, 10 25, 0 25" fill="#8b0000" />
                                <circle cx="0" cy="5" r="5" fill="#ff4444" style={{ filter: "blur(2px)" }} />
                            </g>
                        </svg>
                    </motion.div>
                </div>

                {/* 3. SIDE BOUQUETS (Slide In) */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Left Bouquet */}
                            <motion.div
                                initial={{ x: -100, opacity: 0, rotate: -10 }}
                                animate={{ x: -60, opacity: 1, rotate: 0 }} /* Adjusted for mobile */
                                transition={{ delay: 0.5, duration: 1.5, type: "spring" }}
                                className="absolute bottom-0 left-0 z-10 w-40 h-40 md:w-64 md:h-64 pointer-events-none"
                            >
                                {/* Side Rose Cluster */}
                                <div className="w-full h-full bg-gradient-to-tr from-rose-900/40 to-transparent rounded-full blur-xl" />
                                <div className="absolute bottom-0 right-0 text-5xl md:text-6xl opacity-80">🌹</div>
                                <div className="absolute bottom-6 right-8 text-4xl md:text-5xl opacity-70">🌹</div>
                                <div className="absolute bottom-2 right-16 text-4xl md:text-5xl opacity-60">🌿</div>
                            </motion.div>

                            {/* Right Bouquet */}
                            <motion.div
                                initial={{ x: 100, opacity: 0, rotate: 10 }}
                                animate={{ x: 60, opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.6, duration: 1.5, type: "spring" }}
                                className="absolute bottom-0 right-0 z-10 w-40 h-40 md:w-64 md:h-64 pointer-events-none"
                            >
                                <div className="w-full h-full bg-gradient-to-tl from-rose-900/40 to-transparent rounded-full blur-xl" />
                                <div className="absolute bottom-0 left-0 text-5xl md:text-6xl opacity-80">🌹</div>
                                <div className="absolute bottom-6 left-8 text-4xl md:text-5xl opacity-70">🌹</div>
                                <div className="absolute bottom-2 left-16 text-4xl md:text-5xl opacity-60">🌿</div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* 4. BASE (Shared) */}
                <div className="absolute -bottom-2 z-10 w-64 md:w-80 h-12 rounded-[50%] bg-[#2a1b15] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-t border-[#5c3a2e]/30 flex items-center justify-center">
                    <div className="w-[94%] h-[80%] rounded-[50%] bg-[#1a0f0a]" />
                </div>

            </div>

            {/* 5. TEXT REVEAL & CONTENT */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 1.5 }}
                        className="relative mt-16 z-40 text-center flex flex-col items-center gap-6"
                    >
                        <h2
                            className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Will you be my Valentine?
                        </h2>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2.5, duration: 0.8 }}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
