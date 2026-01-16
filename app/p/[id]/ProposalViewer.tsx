"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Preloader } from "@/components/Preloader";
import { PoetryHero } from "@/components/PoetryHero";
import { ScrollyCanvas } from "@/components/ScrollyCanvas";
import { Overlay } from "@/components/Overlay";
import { FloatingParticles } from "@/components/FloatingParticles";
import { ProposalSection } from "@/components/ProposalSection";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Slide, ThemeType } from "@/lib/types";
import { Heart } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ProposalViewerProps {
    partnerName: string;
    introMessage?: string;
    slides: Slide[];
    theme?: ThemeType;
    proposalId?: string;
}

export function ProposalViewer({
    partnerName,
    introMessage,
    slides,
    theme,
    proposalId,
}: ProposalViewerProps) {
    const [unlocked, setUnlocked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isMobile = useMediaQuery("(max-width: 768px)");

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

    // Responsive scroll height: 100vh per slide on desktop, 60vh on mobile
    // This makes scrolling "faster" on mobile
    const scrollHeightPerSlide = isMobile ? 60 : 100;
    const totalHeight = (slides.length + 2) * scrollHeightPerSlide;

    return (
        <div className="relative">
            {/* GLOBAL Romantic Background - Fixed, spans entire experience */}
            <AnimatedBackground />

            {/* Background Audio */}
            <audio ref={audioRef} loop>
                <source src="/music/background.mp3" type="audio/mpeg" />
            </audio>

            {/* Section 1: The Memory Tunnel (Scrollytelling with Images) */}
            <div className="relative" style={{ height: `${totalHeight}vh` }}>
                {/* Fixed Image Layer */}
                <ScrollyCanvas slides={slides} theme={theme} />

                {/* Floating Particles */}
                <FloatingParticles />

                {/* Scroll Height Provider */}
                <Overlay slides={slides} />
            </div>

            {/* Section 2: The Prologue (Poetry) - Comes AFTER all images */}
            <div className="relative z-[60]">
                <PoetryHero poem={poem} partnerName={partnerName} />
            </div>

            {/* Section 3: The Proposal Question */}
            <div className="relative z-[60]">
                <ProposalSection
                    partnerName={partnerName}
                    proposalId={proposalId}
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
