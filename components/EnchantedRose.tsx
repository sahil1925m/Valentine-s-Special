"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";

interface EnchantedRoseProps {
    partnerName: string;
}

export function EnchantedRose({ partnerName }: EnchantedRoseProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleTap = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Sparkle explosion
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 60 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 40 * (timeLeft / duration);
            // Sparkles from the center
            confetti({
                ...defaults,
                particleCount,
                colors: ['#FFD700', '#FFA500', '#FF4500'], // Gold/Orange/Red sparkles
                shapes: ['star'],
                origin: { x: 0.5, y: 0.5 },
                disableForReducedMotion: true,
            });
        }, 200);
    };

    return (
        <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute inset-0 bg-radial-gradient-dome pointer-events-none opacity-40"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(20, 0, 10, 0.4) 0%, rgba(0,0,0,0.8) 100%)" }} />

            {/* The Scene Container */}
            <div className="relative z-10 flex flex-col items-center justify-center">

                {/* 1. THE GLASS DOME */}
                <motion.div
                    className="relative z-20 cursor-pointer group"
                    onClick={handleTap}
                    animate={isOpen ? { y: -300, opacity: 0 } : { y: [0, -15, 0] }}
                    transition={isOpen ? { duration: 1.5, ease: "easeInOut" } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Glass Jar */}
                    <div
                        className="w-64 h-80 md:w-80 md:h-96 rounded-t-full relative border border-white/20"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.05) 100%)",
                            backdropFilter: "blur(2px)",
                            boxShadow: "inset 0 10px 30px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,0.05)",
                        }}
                    >
                        {/* Highlights/Reflections */}
                        <div className="absolute top-10 left-8 w-16 h-40 bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-60 transform -rotate-12 blur-md" />
                        <div className="absolute top-10 right-10 w-4 h-12 bg-white/30 rounded-full blur-sm" />
                    </div>

                    {/* Handle/Knob on top */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/20 border border-white/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.3)]" />

                    {/* Tap Hint */}
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -bottom-16 left-0 right-0 text-center"
                        >
                            <p className="text-white/60 text-sm tracking-[0.2em] font-light animate-pulse">
                                TAP TO REVEAL
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                {/* 2. THE ROSE (Sitting on the base, but visually inside the dome) */}
                <div className="absolute bottom-4 z-10 pointer-events-none">
                    <motion.div
                        animate={isOpen ? { scale: 1.1, filter: "drop-shadow(0 0 40px rgba(255,0,0,0.8))" } : { scale: 1, filter: "drop-shadow(0 0 15px rgba(255,0,0,0.5)) blur(2px)" }}
                        transition={{ duration: 1.5 }}
                        className="relative"
                    >
                        {/* Neon Rose SVG */}
                        <svg width="200" height="300" viewBox="0 0 100 150" className="overflow-visible">
                            {/* Stem */}
                            <path d="M50 140 Q 45 100, 50 60" stroke="#00ff00" strokeWidth="2" fill="none"
                                style={{ filter: "drop-shadow(0 0 5px #00ff00)" }} />

                            {/* Leaves */}
                            <path d="M50 100 Q 30 90, 20 110 Q 50 110, 50 100" fill="#006400" stroke="#00ff00" strokeWidth="0.5" opacity="0.8" />
                            <path d="M50 80 Q 70 70, 80 90 Q 50 90, 50 80" fill="#006400" stroke="#00ff00" strokeWidth="0.5" opacity="0.8" />

                            {/* Rose Head */}
                            <g transform="translate(50, 40)">
                                <path d="M0 0 C -20 -20, -20 20, 0 30 C 20 20, 20 -20, 0 0" fill="#ff0000" />
                                <path d="M-5 5 C -15 -10, -10 25, 0 25" fill="#8b0000" />
                                <path d="M5 5 C 15 -10, 10 25, 0 25" fill="#8b0000" />
                                <circle cx="0" cy="5" r="5" fill="#ff4444" style={{ filter: "blur(2px)" }} />
                            </g>
                        </svg>

                        {/* Sparkles floating around rose */}
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0"
                            >
                                <Sparkles className="absolute top-0 right-0 text-yellow-200 animate-pulse w-4 h-4" />
                                <Sparkles className="absolute bottom-1/3 left-0 text-yellow-200 animate-pulse w-3 h-3 delay-75" />
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* 3. WOODEN BASE */}
                <div className="absolute -bottom-4 z-10 w-72 h-8 rounded-[50%] bg-[#3d271e] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-t border-[#5c3a2e] flex items-center justify-center">
                    <div className="w-[90%] h-full rounded-[50%] bg-[#2a1b15] mt-1" />
                </div>
            </div>

            {/* 4. THE REVEAL TEXT & BUTTONS */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1.5 }}
                        className="absolute bottom-[5%] z-20 text-center flex flex-col items-center gap-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-rose-100 font-serif drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                            Will you be my Valentine?
                        </h2>

                        {/* Children (Buttons) fade in slightly after text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8, duration: 1 }}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
