"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PhotoStrip } from "@/components/PhotoStrip";
import { OpenJournal } from "@/components/OpenJournal";
import { EnchantedGarden } from "@/components/EnchantedGarden";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { cn } from "@/lib/utils";


// EASY TO CHANGE CONSTANTS
const BUTTON_WIDTH = 150; // Approx
const BUTTON_HEIGHT = 60;

interface ProposalSectionProps {
    partnerName: string;
    onRestart: () => void;
    proposalId?: string;
    images?: string[]; // For PhotoStrip
    partnerGender?: "female" | "male" | "neutral";
}

export function ProposalSection({ partnerName, onRestart, proposalId, images = [], partnerGender }: ProposalSectionProps) {
    const noBtnRef = React.useRef<HTMLDivElement>(null);
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const [accepted, setAccepted] = useState(false);

    // Enable heartbeat only when not yet accepted
    const beat = useHeartbeat(!accepted);

    const handleNoHover = () => {
        if (!noBtnRef.current || typeof window === "undefined") return;

        const wrapper = noBtnRef.current;
        const button = wrapper.firstElementChild as HTMLElement;
        const wrapperRect = wrapper.getBoundingClientRect();
        const btnRect = button?.getBoundingClientRect();

        // Fallback dimensions if button not found yet
        const btnWidth = btnRect?.width || 150;
        const btnHeight = btnRect?.height || 60;
        const padding = 30; // Safer padding

        // Calculate where the button sits VISUALLY when x=0, y=0 (The "Origin")
        // Since it's centered in the flex wrapper:
        const originX = wrapperRect.left + (wrapperRect.width - btnWidth) / 2;
        const originY = wrapperRect.top + (wrapperRect.height - btnHeight) / 2;

        // Calculate allowed deltas to keep it on screen
        const minX = padding - originX;
        const maxX = (window.innerWidth - padding - btnWidth) - originX;

        const minY = padding - originY;
        const maxY = (window.innerHeight - padding - btnHeight) - originY;

        const randomX = Math.random() * (maxX - minX) + minX;
        const randomY = Math.random() * (maxY - minY) + minY;

        setNoBtnPosition({ x: randomX, y: randomY });
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
                <OpenJournal
                    partnerName={partnerName}
                    partnerGender={partnerGender}
                    images={images}
                    proposalId={proposalId}
                />

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 }}
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
            {/* Enchanted Garden Reveal Section (Acts as the Proposal Hero) */}
            <EnchantedGarden>

                {/* Buttons: Yes & No */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center pointer-events-auto mt-4 px-4 w-full">
                    <button
                        onClick={handleYesClick}
                        className={cn(
                            "px-12 py-4 bg-rose-600 text-white text-xl font-bold rounded-full hover:bg-rose-700 transform transition-all duration-200 shadow-xl w-64",
                            beat && "scale-110 shadow-rose-500/50 shadow-2xl"
                        )}
                    >
                        YES! 💖
                    </button>

                    <div ref={noBtnRef} className="relative h-[60px] w-64 flex items-center justify-center">
                        <motion.button
                            animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            onHoverStart={handleNoHover}
                            onClick={handleNoHover} // Just in case mobile user manages to tap
                            className="px-12 py-4 bg-gray-200 text-gray-500 text-xl font-bold rounded-full cursor-not-allowed whitespace-nowrap"
                        >
                            No 😢
                        </motion.button>
                    </div>
                </div>
            </EnchantedGarden>
        </div>
    );
}
