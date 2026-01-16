"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Preloader } from "@/components/Preloader";
import { PoetryHero } from "@/components/PoetryHero";
import { MemoryString } from "@/components/MemoryString";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ProposalSection } from "@/components/ProposalSection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Slide, ThemeType } from "@/lib/types";
import { Heart } from "lucide-react";
import { LoveLetter } from "@/components/LoveLetter";
import { EnchantedRose } from "@/components/EnchantedRose";

interface ProposalViewerProps {
    partnerName: string;
    introMessage?: string;
    slides: Slide[];
    theme?: ThemeType;
    proposalId?: string;
}

export function ProposalViewer(props: ProposalViewerProps) {
    return (
        <ProposalViewerContent {...props} />
    );
}

function ProposalViewerContent({
    partnerName,
    introMessage,
    slides,
    theme,
    proposalId,
}: ProposalViewerProps) {
    const [unlocked, setUnlocked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleUnlock = () => {
        setUnlocked(true);
        if (audioRef.current) {
            audioRef.current.play().catch(() => { });
        }
    };

    if (!unlocked) {
        return <Preloader onUnlock={handleUnlock} />;
    }

    const poem = introMessage || `Every moment with you is a memory I treasure forever...`;

    return (
        <div className="relative">
            {/* GLOBAL Romantic Background - Fixed, spans entire experience */}
            <AnimatedBackground />

            {/* Background Audio */}
            <audio ref={audioRef} loop>
                <source src="/music/background.mp3" type="audio/mpeg" />
            </audio>

            {/* Section 1: The Memory String (Scrapbook Theme) */}
            <div className="relative min-h-[100vh]">
                <MemoryString slides={slides} />

                {/* Floating Particles - Kept for atmosphere */}
                <FloatingParticles />
            </div>

            {/* Section 2: The Love Letter (Interactive Envelope) */}
            <div className="relative z-[60]">
                <LoveLetter poem={poem} partnerName={partnerName} />
            </div>

            {/* Section 3: The Proposal (Enchanted Rose + Question) */}
            <div className="relative z-[60]">
                <ProposalSection
                    partnerName={partnerName}
                    proposalId={proposalId}
                    images={slides.slice(0, 3).map(s => s.image)}
                    onRestart={() => setUnlocked(false)}
                />
            </div>

            {/* Viral Badge */}
            <Link
                href="/"
                className="fixed bottom-4 right-4 z-[100] flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white/70 hover:text-white text-xs font-medium transition-colors border border-white/10 hover:border-white/30"
            >
                <Heart size={12} className="fill-rose-500 text-rose-500" />
                Made with Valentine Special
            </Link>
        </div>
    );
}
