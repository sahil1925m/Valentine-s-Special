"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreloaderProps {
    onUnlock: () => void;
}

export function Preloader({ onUnlock }: PreloaderProps) {
    const [holding, setHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [unlocked, setUnlocked] = useState(false);
    const [message, setMessage] = useState("Touch & Hold to Scan");

    // Audio ref for seamless playback on unlock
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (holding && !unlocked) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        handleSuccess();
                        return 100;
                    }
                    // Randomize speed for "glitchy/realistic" feel
                    return prev + Math.random() * 2 + 1;
                });

                // Glitch text effect logic
                if (Math.random() > 0.7) {
                    setMessage(
                        ["Scanning...", "Verifying...", "Reading Bio-Data...", "Matching Soul..."][Math.floor(Math.random() * 4)]
                    );
                }

            }, 50); // Updates every 50ms
        } else {
            // Decrease progress if released early
            if (!unlocked) {
                interval = setInterval(() => {
                    setProgress(prev => {
                        if (prev <= 0) {
                            clearInterval(interval);
                            setMessage("Touch & Hold to Scan"); // Reset message
                            return 0;
                        }
                        return prev - 5; // Decay
                    })
                }, 30);
            }
        }

        return () => clearInterval(interval);
    }, [holding, unlocked]);

    const handleSuccess = () => {
        setUnlocked(true);
        setMessage("Access Granted: Soulmate Detected");

        // Play music
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed (user interaction policy?):", e));
        }

        // Wait a moment before actually calling parent unlock to show the success state
        setTimeout(onUnlock, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none touch-none">
            <audio ref={audioRef} src="/music/background.mp3" loop />

            <AnimatePresence>
                {!unlocked && (
                    <motion.div
                        className="flex flex-col items-center gap-8 relative"
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Fingerprint Wrapper */}
                        <div
                            className="relative"
                            onMouseDown={() => setHolding(true)}
                            onMouseUp={() => setHolding(false)}
                            onMouseLeave={() => setHolding(false)}
                            onTouchStart={() => setHolding(true)}
                            onTouchEnd={() => setHolding(false)}
                        >
                            {/* Ring for Progress */}
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-gray-900"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={377} // 2 * pi * 60
                                    strokeDashoffset={377 - (377 * progress) / 100}
                                    className={cn(
                                        "text-rose-600 transition-all duration-75",
                                        holding ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </svg>

                            {/* Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Fingerprint
                                    size={64}
                                    className={cn(
                                        "transition-colors duration-300",
                                        holding ? "text-rose-500 animate-pulse" : "text-gray-500",
                                        progress > 90 && "text-rose-400 blur-[1px]" // Glitchy finish
                                    )}
                                />
                            </div>
                        </div>

                        {/* Status Text */}
                        <div className="h-8 flex flex-col items-center">
                            <p className={cn(
                                "text-lg font-mono tracking-widest uppercase transition-colors",
                                unlocked ? "text-green-500 animate-bounce" : (holding ? "text-rose-400" : "text-gray-600")
                            )}>
                                {message}
                            </p>
                            {/* Progress Bar (Visual flair) */}
                            <div className="w-full h-1 bg-gray-900 mt-2 rounded-full overflow-hidden w-48">
                                <motion.div
                                    className="h-full bg-rose-600"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
