"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Slide, ThemeType } from "@/lib/types";
import { GradualSpacing } from "@/components/ui/gradual-spacing";

interface ScrollyCanvasProps {
    slides: Slide[];
    theme?: ThemeType;
}

// Liquid Mask Reveal Slide
const LiquidSlide = ({
    slide,
    index,
    scrollYProgress,
    totalSlides,
}: {
    slide: Slide;
    index: number;
    scrollYProgress: MotionValue<number>;
    totalSlides: number;
}) => {
    // Images use only 85% of scroll, leaving 15% buffer before next section
    const usableRange = 0.85;
    const segmentSize = usableRange / totalSlides;
    const start = index * segmentSize;
    const middle = start + segmentSize * 0.5;
    const end = start + segmentSize;

    // Fix Initial Gap: If it's the first slide (index 0), stick to opacity 1 at the start
    // Otherwise use standard fade-in logic
    const opacity = index === 0
        ? useTransform(scrollYProgress, [start, end - 0.05, end], [1, 1, 0])
        : useTransform(
            scrollYProgress,
            [start, start + 0.02, middle, end - 0.02, end],
            [0, 1, 1, 1, 0]
        );

    const scale = useTransform(
        scrollYProgress,
        [start, middle, end],
        [0.95, 1, 1.1]
    );
    const blur = useTransform(
        scrollYProgress,
        [start, middle, end],
        [0, 0, 8]
    );

    // Clip path for liquid reveal
    const clipProgress = useTransform(
        scrollYProgress,
        [Math.max(0, start - segmentSize * 0.2), start],
        [0, 150]
    );

    // Text Animation (Parallax/Reveal Effect)
    // Slide up and fade in slightly after the image appears
    const textStart = start + (index === 0 ? 0 : 0.02);
    const textY = useTransform(
        scrollYProgress,
        [textStart, textStart + 0.05, end],
        [20, 0, -20]
    );
    const textOpacity = useTransform(
        scrollYProgress,
        [textStart, textStart + 0.04, end - 0.05, end],
        [0, 1, 1, 0]
    );

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center z-10 px-4 md:px-20"
            style={{ opacity }}
        >
            <div className="relative w-full max-w-7xl flex flex-col items-center justify-center md:grid md:grid-cols-2 md:gap-12 md:items-center h-[85vh] md:h-auto pointer-events-none">

                {/* The Image (Top on Mobile, Left on Desktop) */}
                <motion.div
                    className="relative w-full h-[45vh] md:h-[70vh] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10 mx-auto md:mx-0 order-1 md:order-1"
                    style={{
                        scale,
                        filter: useTransform(blur, (v) => `blur(${v}px)`),
                        clipPath: index === 0
                            ? "circle(150% at center)"
                            : useTransform(clipProgress, (v) => `circle(${Math.max(v, 0)}% at center)`),
                    }}
                >
                    <img
                        src={slide.image}
                        alt="Memory"
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                </motion.div>

                {/* Text Caption (Bottom on Mobile, Right on Desktop) */}
                <motion.div
                    className="relative w-full flex flex-col justify-center items-center md:items-start text-center md:text-left mt-6 md:mt-0 order-2 md:order-2 rounded-xl backdrop-blur-sm md:bg-transparent pointer-events-auto"
                    style={{
                        y: textY,
                        opacity: textOpacity
                    }}
                >
                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full">
                        <GradualSpacing
                            className="text-xl md:text-4xl lg:text-5xl font-serif text-white/90 leading-relaxed font-light tracking-wide"
                            text={slide.text}
                            duration={1.5}
                            delayMultiple={0.1}
                        />

                        {/* Decorative Divider */}
                        <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent mx-auto md:mx-0 mt-4 md:mt-6" />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

// Master fade out for entire canvas when approaching end
const CanvasFadeOut = ({
    scrollYProgress,
    children,
}: {
    scrollYProgress: MotionValue<number>;
    children: React.ReactNode;
}) => {
    // Fade out everything after 85% scroll
    const canvasOpacity = useTransform(
        scrollYProgress,
        [0.80, 0.90, 1.0],
        [1, 0, 0]
    );

    return (
        <motion.div style={{ opacity: canvasOpacity }}>
            {children}
        </motion.div>
    );
};

export function ScrollyCanvas({ slides }: ScrollyCanvasProps) {
    const { scrollYProgress } = useScroll();

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <CanvasFadeOut scrollYProgress={smoothProgress}>
            <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none">
                {/* Images only - background is global */}
                {slides.map((slide, index) => (
                    <LiquidSlide
                        key={slide.id}
                        slide={slide}
                        index={index}
                        scrollYProgress={smoothProgress}
                        totalSlides={slides.length}
                    />
                ))}

                {/* Soft vignette */}
                <div
                    className="fixed inset-0 pointer-events-none z-20"
                    style={{
                        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
                    }}
                />
            </div>
        </CanvasFadeOut>
    );
}
