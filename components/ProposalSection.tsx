"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SuccessCard } from "@/components/SuccessCard";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { cn } from "@/lib/utils";

// EASY TO CHANGE CONSTANTS
const SUBTEXT_DEFAULT = "Bet you can't click No 😉";
const SUBTEXT_ON_HOVER = "Too slow! 🏃‍♂️💨";

interface ProposalSectionProps {
    partnerName: string;
    onRestart: () => void;
    proposalId?: string;
}

export function ProposalSection({ partnerName, onRestart, proposalId }: ProposalSectionProps) {
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const [accepted, setAccepted] = useState(false);
    const [subtext, setSubtext] = useState(SUBTEXT_DEFAULT);

    // Enable heartbeat only when not yet accepted
    const beat = useHeartbeat(!accepted);

    const handleNoHover = () => {
        // Change subtext to taunt
        setSubtext(SUBTEXT_ON_HOVER);

        // Generate random position within a reasonable range
        const x = Math.random() * 300 - 150;
        const y = Math.random() * 300 - 150;
        setNoBtnPosition({ x, y });

        // Reset subtext after a moment
        setTimeout(() => setSubtext(SUBTEXT_DEFAULT), 1500);
    };

    const handleYesClick = () => {
        setAccepted(true);
        triggerConfetti();
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;

        const interval: ReturnType<typeof setInterval> = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    if (accepted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <SuccessCard partnerName={partnerName} proposalId={proposalId} />

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    onClick={onRestart}
                    className="mt-8 text-white/50 hover:text-white text-sm underline transition-colors z-50 text-center"
                >
                    Create Another
                </motion.button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center p-8 overflow-hidden">
            <div className="space-y-8 relative z-30">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-white font-serif drop-shadow-lg"
                >
                    So, {partnerName}...
                </motion.h2>

                <p className="text-2xl text-rose-200 font-medium">
                    Will you be my Valentine?
                </p>

                {/* Cheeky Subtext */}
                <motion.p
                    key={subtext} // Re-animate when text changes
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-sm md:text-base text-gray-400 italic font-sans"
                >
                    {subtext}
                </motion.p>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center mt-8">
                    <button
                        onClick={handleYesClick}
                        className={cn(
                            "px-12 py-4 bg-rose-600 text-white text-xl font-bold rounded-full hover:bg-rose-700 transform transition-all duration-200 shadow-xl",
                            beat && "scale-110 shadow-rose-500/80 shadow-2xl"
                        )}
                    >
                        YES! 💘
                    </button>

                    <motion.button
                        animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onHoverStart={handleNoHover}
                        onClick={handleNoHover}
                        className="px-12 py-4 bg-gray-200 text-gray-500 text-xl font-bold rounded-full cursor-not-allowed relative"
                    >
                        No 😢
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
