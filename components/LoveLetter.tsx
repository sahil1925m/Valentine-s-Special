"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";

interface LoveLetterProps {
    poem: string;
    partnerName: string;
}

export function LoveLetter({ poem, partnerName }: LoveLetterProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        if (isOpen) return;
        setIsOpen(true);

        // Trigger confetti burst
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff1493', '#ffd700'],
            shapes: ['heart'] as any
        });
    };

    return (
        <div className="relative w-full min-h-[500px] flex items-center justify-center py-20">
            <div className="relative w-[320px] md:w-[400px] h-[250px] perspective-1000">
                {/* Envelope Body */}
                <motion.div
                    className="absolute inset-0 z-20 flex items-end justify-center"
                    animate={isOpen ? { y: 60 } : { y: 0, rotate: [0, -1, 1, 0] }}
                    transition={isOpen ? { duration: 0.8, delay: 0.2 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    onClick={!isOpen ? handleOpen : undefined}
                >
                    {/* Main Pocket */}
                    <div
                        className="absolute inset-0 bg-[#ffd1dc] shadow-2xl rounded-b-lg overflow-hidden cursor-pointer"
                        style={{
                            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                        }}
                    >
                        {/* CSS Triangles for Pocket Look */}
                        <div className="absolute bottom-0 left-0 w-full h-[90%] bg-[#ffc5d3] clip-path-pocket"
                            style={{ clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)" }}
                        />
                        <div className="absolute left-0 bottom-0 w-1/2 h-full bg-[#ffb7c5] clip-path-left"
                            style={{ clipPath: "polygon(0% 0%, 0% 100%, 100% 100%)" }}
                        />
                        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-[#ffb7c5] clip-path-right"
                            style={{ clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)" }}
                        />
                    </div>
                </motion.div>

                {/* The Letter (Paper) */}
                <motion.div
                    className="absolute left-4 right-4 top-2 bottom-2 bg-[#fffcf5] p-6 shadow-md z-10 flex flex-col items-center text-center rounded-sm"
                    initial={{ y: 0 }}
                    animate={isOpen ? { y: -180, zIndex: 30, height: "auto" } : { y: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="space-y-4"
                    >
                        <p className="text-gray-400 text-xs font-serif tracking-widest uppercase">A Letter For</p>
                        <h3 className="text-2xl font-bold text-rose-600 font-serif">{partnerName}</h3>
                        <div className="w-full h-[1px] bg-rose-200 my-2" />
                        <p
                            className="text-gray-800 text-lg md:text-xl leading-relaxed whitespace-pre-line"
                            style={{ fontFamily: 'var(--font-caveat), cursive' }}
                        >
                            {poem}
                        </p>
                        <div className="pt-4 flex justify-center">
                            <Heart className="w-4 h-4 text-rose-400 fill-rose-100" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Top Flap */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-1/2 bg-[#ffaebd] z-30 origin-top rounded-t-lg"
                    style={{
                        clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)",
                        backfaceVisibility: "hidden"
                    }}
                    animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                </motion.div>

                {/* Wax Seal */}
                <motion.button
                    className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-rose-600 rounded-full z-40 shadow-lg flex items-center justify-center border-4 border-rose-700/50 cursor-pointer"
                    initial={{ scale: 1 }}
                    animate={isOpen ? { scale: 0, opacity: 0 } : { scale: [1, 1.1, 1] }}
                    transition={isOpen ? { duration: 0.3 } : { repeat: Infinity, duration: 2 }}
                    onClick={handleOpen}
                >
                    <Heart className="w-6 h-6 text-rose-100 fill-rose-100" />
                </motion.button>

                {/* Tap Hint */}
                {!isOpen && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute -bottom-12 left-0 right-0 text-center text-white/50 text-sm font-medium tracking-widest uppercase"
                    >
                        Tap to Open
                    </motion.p>
                )}
            </div>
        </div>
    );
}
