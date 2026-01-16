"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Slide } from "@/lib/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface MemoryStringProps {
    slides: Slide[];
}

// Polaroid Card Component
const ChalkDoodle = ({ type, isReversed }: { type: 'arrow' | 'heart' | 'spiral', isReversed: boolean }) => {
    const strokeWidth = 2;
    const opacity = 0.6;

    // Chalk texture filter ID
    const filterId = "chalk-noise";

    return (
        <div className={`w-24 h-16 md:w-32 md:h-24 opacity-80 ${isReversed ? 'scale-x-[-1]' : ''} flex items-center justify-center`}>
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                <defs>
                    <filter id={filterId}>
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                    </filter>
                </defs>

                {type === 'arrow' && (
                    <path
                        d="M10,25 Q30,5 50,25 T90,25 M75,15 L90,25 L75,35"
                        fill="none"
                        stroke="white"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        filter={`url(#${filterId})`}
                        style={{ opacity }}
                    />
                )}

                {type === 'heart' && (
                    <path
                        d="M50,15 C40,5 30,15 30,25 C30,35 50,45 50,45 C50,45 70,35 70,25 C70,15 60,5 50,15 Z"
                        fill="none"
                        stroke="white"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        filter={`url(#${filterId})`}
                        style={{ opacity }}
                    />
                )}

                {type === 'spiral' && (
                    <path
                        d="M20,25 C20,10 40,10 40,25 C40,40 60,40 60,25 C60,10 80,10 80,25"
                        fill="none"
                        stroke="white"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        filter={`url(#${filterId})`}
                        strokeDasharray="4 4"
                        style={{ opacity }}
                    />
                )}
            </svg>
        </div>
    );
};

const PolaroidCard = ({
    slide,
    index,
    isMobile
}: {
    slide: Slide;
    index: number;
    isMobile: boolean;
}) => {
    // Random slight rotation for "hand-placed" feel
    const baseRotation = (index % 2 === 0 ? 1 : -1) * (1 + (index * 3) % 4);
    const paperRotation = (index % 2 !== 0 ? 1 : -1) * (1 + (index * 2) % 3);

    // Layout Logic: Even = Image Left, Odd = Image Right
    const isEven = index % 2 === 0;

    // Doodle Type Logic
    const doodleType = index % 3 === 0 ? 'arrow' : (index % 3 === 1 ? 'heart' : 'spiral');

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{
                opacity: 1,
                y: 0,
                transition: { duration: 1.2, ease: "easeOut" }
            }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex w-full max-w-6xl mx-auto items-center justify-center gap-4 md:gap-8 py-12 ${isMobile ? 'flex-col' : (isEven ? 'flex-row' : 'flex-row-reverse')}`}
        >
            {/* The Photo Side */}
            <div className={`relative ${isMobile ? 'w-[85%]' : 'w-5/12'} flex justify-center`}>
                {/* String Connector */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 w-[2px] h-16 bg-white/40 shadow-sm" />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-3 h-3 rounded-full bg-rose-200 border border-rose-300 shadow-sm" />

                <motion.div
                    whileHover={{ scale: 1.02, rotate: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.4)] relative"
                    style={{ rotate: baseRotation }}
                >
                    <div className="absolute -top-4 -left-4 w-16 h-8 bg-rose-200/50 backdrop-blur-sm border border-rose-100/30 rotate-[-15deg] shadow-sm z-10" />
                    <div className="absolute -bottom-4 -right-4 w-16 h-8 bg-rose-200/50 backdrop-blur-sm border border-rose-100/30 rotate-[-15deg] shadow-sm z-10" />

                    <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50">
                        <img
                            src={slide.image}
                            alt="Memory"
                            className="w-full h-full object-cover select-none pointer-events-none"
                            loading="lazy"
                        />
                    </div>
                </motion.div>
            </div>

            {/* The Decorative Doodle Connection */}
            <div className={`hidden md:flex flex-col items-center justify-center w-[10%] ${isMobile ? 'rotate-90 my-4' : ''}`}>
                <ChalkDoodle type={doodleType} isReversed={!isEven} />
            </div>

            {/* The Taped Paper Note Side */}
            <div className={`relative ${isMobile ? 'w-[90%]' : 'w-5/12'} flex justify-center`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative bg-[#fdfbf7] p-8 md:p-10 shadow-[2px_4px_16px_rgba(0,0,0,0.4)] max-w-sm"
                    style={{
                        rotate: paperRotation,
                        // Rough edge effect using complex polygon
                        clipPath: "polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%)"
                    }}
                >
                    {/* Washi Tape Anchor */}
                    <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-rose-300/80 shadow-sm backdrop-blur-[1px]"
                        style={{
                            clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)", // Slight tear
                            transform: "translateX(-50%) rotate(-1deg)"
                        }}
                    />

                    {/* Paper Texture Overlay (Subtle noise) */}
                    <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: "url('/noise.png')" }} />

                    {/* Handwriting Text */}
                    <p
                        className="relative z-10 text-xl md:text-2xl text-[#2c2c2c] leading-relaxed font-medium text-center"
                        style={{
                            fontFamily: 'var(--font-caveat), cursive, sans-serif',
                            textShadow: "0 1px 1px rgba(0,0,0,0.05)"
                        }}
                    >
                        {slide.text}
                    </p>
                </motion.div>

                {/* Mobile Chalk Doodle (Shown below on mobile) */}
                {isMobile && (
                    <div className="absolute -top-12 right-0 rotate-45 transform scale-75">
                        <ChalkDoodle type="heart" isReversed={false} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Fairy Lights Component
const FairyLights = ({ height }: { height: number }) => {
    // Generate lights positions
    const spacing = 120; // px
    const count = Math.ceil(height / spacing);

    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full z-0 w-2">
            {/* The Main String */}
            <div className="w-[1px] h-full bg-white/30 mx-auto shadow-[0_0_10px_rgba(255,255,255,0.2)]" />

            {/* The Lights */}
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                        duration: 1.5 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                    className="absolute w-3 h-3 rounded-full bg-[#fffec4] shadow-[0_0_15px_#ffeb3b,0_0_5px_rgba(255,255,255,0.8)]"
                    style={{
                        top: `${i * spacing + 60}px`,
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}
                />
            ))}
        </div>
    );
};

export function MemoryString({ slides }: MemoryStringProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const containerRef = useRef<HTMLDivElement>(null);

    // Estimate height for lights (approx 600px per slide)
    const estimatedHeight = slides.length * 600 + 400;

    return (
        <div ref={containerRef} className="relative w-full min-h-screen py-24 pb-48 overflow-hidden">
            {/* Central String & Fairy Lights */}
            <FairyLights height={estimatedHeight} />

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col gap-24 md:gap-32">
                {slides.map((slide, index) => (
                    <PolaroidCard
                        key={slide.id}
                        slide={slide}
                        index={index}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </div>
    );
}
