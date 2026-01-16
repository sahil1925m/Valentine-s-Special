"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoseStore } from "@/lib/RoseContext";

export function HiddenRose() {
    const [collected, setCollected] = useState(false);
    const { collectRose } = useRoseStore();

    const handleCollect = () => {
        if (collected) return;
        setCollected(true);
        collectRose();

        // Optional: Play sound effect logic here if added later
    };

    return (
        <div className="relative w-12 h-12 flex items-center justify-center pointer-events-auto">
            <AnimatePresence>
                {!collected ? (
                    <motion.button
                        key="bud"
                        onClick={handleCollect}
                        whileHover={{ scale: 1.3, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative group cursor-pointer flex flex-col items-center"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-red-500/40 blur-lg rounded-full animate-pulse" />

                        {/* Rosebud SVG */}
                        <svg
                            viewBox="0 0 24 24"
                            className="w-12 h-12 text-rose-500 drop-shadow-lg relative z-10"
                            fill="currentColor"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>

                        {/* Hint Text */}
                        <span className="text-xs text-rose-300 mt-1 opacity-70">Tap me!</span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="bloomed"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1.5, 0],
                            opacity: [0, 1, 0],
                            y: [0, -50],
                            x: [0, 50]
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="pointer-events-none"
                    >
                        {/* Bloomed Rose SVG flying away */}
                        <span className="text-2xl">🌹</span>
                        {/* Particles */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            className="absolute inset-0 bg-rose-400 rounded-full blur-sm"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
