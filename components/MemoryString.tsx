"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Slide } from "@/lib/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HiddenRose } from "@/components/HiddenRose";

interface MemoryStringProps {
    slides: Slide[];
}

// Polaroid Card Component
const PolaroidCard = ({
    slide,
    index,
    isMobile
}: {
    slide: Slide;
    index: number;
    isMobile: boolean;
}) => {
    // Random slight rotation for "hand-placed" feel (stable based on index)
    const baseRotation = (index % 2 === 0 ? 1 : -1) * (2 + (index * 7) % 4);

    // Layout Logic: Even = Image Left, Odd = Image Right
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            whileInView={{
                opacity: 1,
                y: 0,
                rotate: [0, 3, -2, 0], // Sway animation
                transition: {
                    duration: 1.5,
                    ease: "easeInOut",
                    delay: 0.1
                }
            }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex w-full max-w-5xl mx-auto items-center justify-between gap-4 md:gap-12 py-12 ${isMobile ? 'flex-col' : (isEven ? 'flex-row' : 'flex-row-reverse')}`}
            style={{
                perspective: 1000
            }}
        >
            {/* The Photo Side */}
            <div className={`relative ${isMobile ? 'w-[90%]' : 'w-5/12'}`}>
                {/* Visual String Connector (Clip) */}
                <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-8 h-12"
                    style={{
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)",
                        clipPath: "polygon(40% 0, 60% 0, 60% 100%, 40% 100%)"
                    }}
                />
                <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full bg-gray-300 shadow-md border border-gray-400"
                />

                {/* The Polaroid */}
                <motion.div
                    className="bg-white p-3 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transform transition-transform duration-500 hover:scale-105 hover:z-10 relative"
                    style={{
                        rotate: baseRotation,
                        border: "1px solid rgba(0,0,0,0.05)"
                    }}
                >
                    {/* Tape effect on corners */}
                    <div className="absolute -top-3 -left-3 w-12 h-6 bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm rotate-[-45deg]" />
                    <div className="absolute -bottom-3 -right-3 w-12 h-6 bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm rotate-[-45deg]" />

                    <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-10 pointer-events-none mix-blend-overlay" />
                        <img
                            src={slide.image}
                            alt="Memory"
                            className="w-full h-full object-cover select-none"
                            loading="eager"
                        />
                    </div>
                </motion.div>
            </div>

            {/* The Note Side */}
            <div className={`relative ${isMobile ? 'w-[90%] text-center' : 'w-5/12 text-left'} flex flex-col items-center justify-center`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative inline-block"
                >
                    {/* Handwritten Note Style */}
                    <p
                        className="text-2xl md:text-4xl text-white/90 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        style={{
                            fontFamily: 'var(--font-caveat), cursive',
                            transform: `rotate(${baseRotation * -0.5}deg)`
                        }}
                    >
                        {slide.text}
                    </p>

                    {/* Decorative doodle or underline could go here */}
                </motion.div>

                {/* Hidden Rose - Below the text, clearly visible */}
                {index % 3 !== 0 && (
                    <div className="mt-8">
                        <HiddenRose />
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
