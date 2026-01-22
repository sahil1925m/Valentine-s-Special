"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import useSound from "use-sound";

// Magical Chime Sound
const CHIME_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3";

interface EnchantedGardenProps {
    children?: React.ReactNode;
}

export function EnchantedGarden({ children }: EnchantedGardenProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [playChime] = useSound(CHIME_SOUND_URL, { volume: 0.5 });
    const [showText, setShowText] = useState(false);

    const handleTap = () => {
        if (isOpen) return;
        setIsOpen(true);
        playChime();

        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FF69B4', '#FF0000', '#FFFFFF']
        });

        // Delay text reveal
        setTimeout(() => setShowText(true), 1500);
    };

    // Typewriter text
    const text = "For the one who makes life beautiful... ❤️";
    const letters = Array.from(text);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-24">

            {/* Soft Ambient Hearts (Subtle for Light Theme) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-300 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-rose-300 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4">
                <AnimatePresence mode="wait">
                    {!isOpen ? (
                        <motion.button
                            key="trigger-btn"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            onClick={handleTap}
                            className="px-8 py-4 bg-white shadow-xl border border-rose-100 text-rose-600 rounded-full text-lg font-medium tracking-wide hover:scale-105 hover:bg-rose-50 transition-all"
                        >
                            Tap for a Surprise ✨
                        </motion.button>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center w-full"
                        >
                            {/* Rose Animation: Floating Up */}
                            <motion.div
                                initial={{ y: 300, opacity: 0, scale: 0.5 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 20,
                                    damping: 20,
                                    mass: 2,
                                    delay: 0.2
                                }}
                                className="mb-8 relative"
                            >
                                <img
                                    src="/image/rose.png"
                                    alt="Rose"
                                    className="w-full max-w-[280px] md:max-w-[380px] h-auto drop-shadow-[0_0_25px_rgba(255,100,100,0.6)]"
                                />
                            </motion.div>

                            {/* Typewriter Text Section */}
                            {showText && (
                                <div className="text-center space-y-6 w-full">
                                    <div className="min-h-[4rem]">
                                        <p className="text-lg md:text-xl text-rose-200/80 font-medium font-serif mb-2">
                                            For the one who makes life beautiful...
                                        </p>
                                        <motion.h2
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.5, duration: 1 }}
                                            className="text-3xl md:text-5xl font-bold text-white font-serif drop-shadow-lg"
                                        >
                                            Will you be my Valentine?
                                        </motion.h2>
                                    </div>

                                    {/* Reveal Children (Yes/No buttons) */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2.5, duration: 0.8 }}
                                        className="pt-4"
                                    >
                                        {children}
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
