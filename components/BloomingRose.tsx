"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface BloomingRoseProps {
    partnerName: string;
}

// Premium Petal Component with beautiful gradients
const Petal = ({
    index,
    layer,
    progress,
    totalInLayer,
}: {
    index: number;
    layer: number;
    progress: MotionValue<number>;
    totalInLayer: number;
}) => {
    const baseAngle = (index / totalInLayer) * 360;

    // FIXED TIMING: Bloom completes earlier (by 0.6 of scroll)
    // Layer 0: 0.0 - 0.20
    // Layer 1: 0.15 - 0.35
    // Layer 2: 0.30 - 0.50
    // Layer 3: 0.45 - 0.65
    const layerStart = layer * 0.15;
    const layerEnd = layerStart + 0.20;

    const openProgress = useTransform(progress, [layerStart, layerEnd], [0, 1]);
    const rotateX = useTransform(openProgress, [0, 1], [85, -15 + (layer * 3)]);
    const scale = useTransform(openProgress, [0, 0.3, 1], [0.2, 0.7, 1]);
    const opacity = useTransform(openProgress, [0, 0.15, 1], [0, 1, 1]);

    // Beautiful color palette - deep ruby to bright scarlet
    const baseColors = [
        { main: "#7c0a02", highlight: "#9b111e" }, // Deep burgundy
        { main: "#9b111e", highlight: "#c41e3a" }, // Ruby
        { main: "#c41e3a", highlight: "#dc143c" }, // Cardinal
        { main: "#dc143c", highlight: "#ff2d55" }, // Crimson/Scarlet
    ];

    const color = baseColors[layer];
    const gradientId = `petal-grad-${layer}-${index}`;
    const glowId = `petal-glow-${layer}-${index}`;

    return (
        <motion.div
            className="absolute origin-bottom"
            style={{
                rotate: baseAngle,
                rotateX,
                scale,
                opacity,
                transformStyle: "preserve-3d",
            }}
        >
            <svg
                viewBox="0 0 60 100"
                className="w-14 md:w-20 lg:w-24"
                style={{
                    filter: `drop-shadow(0 4px 12px ${color.main}60) drop-shadow(0 0 ${8 + layer * 4}px ${color.highlight}50)`,
                }}
            >
                <defs>
                    {/* Multi-stop gradient for realistic petal */}
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color.main} />
                        <stop offset="30%" stopColor={color.highlight} />
                        <stop offset="70%" stopColor={color.main} />
                        <stop offset="100%" stopColor="#ffd70030" />
                    </linearGradient>
                    {/* Inner golden glow */}
                    <radialGradient id={glowId} cx="50%" cy="80%" r="60%">
                        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>

                {/* Petal shadow for depth */}
                <path
                    d="M30 100 C5 75, -5 35, 30 0 C65 35, 55 75, 30 100"
                    fill="rgba(0,0,0,0.3)"
                    transform="translate(2, 3)"
                />

                {/* Main petal shape */}
                <path
                    d="M30 100 C5 75, -5 35, 30 0 C65 35, 55 75, 30 100"
                    fill={`url(#${gradientId})`}
                />

                {/* Inner glow overlay */}
                <path
                    d="M30 100 C5 75, -5 35, 30 0 C65 35, 55 75, 30 100"
                    fill={`url(#${glowId})`}
                />

                {/* Subtle vein lines for realism */}
                <path
                    d="M30 95 Q25 60, 30 10"
                    stroke={color.highlight}
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.3"
                />
                <path
                    d="M30 95 Q20 65, 15 30"
                    stroke={color.highlight}
                    strokeWidth="0.3"
                    fill="none"
                    opacity="0.2"
                />
                <path
                    d="M30 95 Q40 65, 45 30"
                    stroke={color.highlight}
                    strokeWidth="0.3"
                    fill="none"
                    opacity="0.2"
                />
            </svg>
        </motion.div>
    );
};

// Falling Petal with partner name watermark
const FallingPetal = ({
    index,
    progress,
    partnerName,
    showName,
}: {
    index: number;
    progress: MotionValue<number>;
    partnerName: string;
    showName: boolean;
}) => {
    // Start falling after bloom is mostly complete (0.7+)
    const startAt = 0.70 + (index * 0.04);
    const fallProgress = useTransform(progress, [startAt, startAt + 0.15], [0, 1]);

    const y = useTransform(fallProgress, [0, 1], [0, 350]);
    const x = useTransform(fallProgress, [0, 1], [0, (index % 2 === 0 ? 120 : -120)]);
    const scale = useTransform(fallProgress, [0, 0.5, 1], [0.3, 1.8, 3.5]);
    const rotate = useTransform(fallProgress, [0, 1], [0, 200 + (index * 50)]);
    const opacity = useTransform(fallProgress, [0, 0.2, 0.75, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            className="absolute pointer-events-none z-30"
            style={{
                y,
                x,
                scale,
                rotate,
                opacity,
                left: `${25 + (index * 18)}%`,
                top: "35%",
            }}
        >
            <svg viewBox="0 0 60 100" className="w-16 md:w-24">
                <defs>
                    <linearGradient id={`falling-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c41e3a" />
                        <stop offset="100%" stopColor="#dc143c" />
                    </linearGradient>
                </defs>
                <path
                    d="M30 100 C5 75, -5 35, 30 0 C65 35, 55 75, 30 100"
                    fill={`url(#falling-${index})`}
                    opacity="0.85"
                />
            </svg>
            {showName && (
                <div
                    className="absolute inset-0 flex items-center justify-center text-white/25 text-[10px] font-serif italic tracking-wider"
                    style={{ transform: "rotate(-25deg)" }}
                >
                    {partnerName}
                </div>
            )}
        </motion.div>
    );
};

// Center Reveal - shows AFTER full bloom
const CenterReveal = ({
    progress,
}: {
    progress: MotionValue<number>;
}) => {
    // FIXED: Text reveals at 0.70-0.85 (after petals are mostly open)
    const revealProgress = useTransform(progress, [0.70, 0.85], [0, 1]);
    const scale = useTransform(revealProgress, [0, 0.4, 1], [0, 0.6, 1]);
    const opacity = useTransform(revealProgress, [0, 0.2, 1], [0, 0.7, 1]);
    const textScale = useTransform(revealProgress, [0.3, 1], [0.5, 1]);

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ scale, opacity }}
        >
            {/* Glowing Golden Center */}
            <div
                className="relative w-36 h-36 md:w-52 md:h-52 rounded-full flex items-center justify-center"
                style={{
                    background: "radial-gradient(circle, #fff9e6 0%, #fff5d6 50%, #ffeeba 100%)",
                    boxShadow: "0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(255,180,0,0.3), inset 0 0 30px rgba(255,255,255,0.8)",
                }}
            >
                <motion.p
                    className="text-center text-rose-700 font-serif text-base md:text-xl lg:text-2xl font-bold px-4 leading-tight"
                    style={{
                        scale: textScale,
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                >
                    Will you be my Valentine?
                </motion.p>
            </div>
        </motion.div>
    );
};

// Stem & Leaves Component
const StemAndLeaves = ({
    progress,
}: {
    progress: MotionValue<number>;
}) => {
    const stemHeight = useTransform(progress, [0, 0.25], ["0%", "55%"]);
    const stemOpacity = useTransform(progress, [0, 0.08], [0, 1]);
    const leafScale = useTransform(progress, [0.1, 0.3], [0, 1]);

    return (
        <>
            {/* Main Stem */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 md:w-4 rounded-full origin-bottom"
                style={{
                    height: stemHeight,
                    opacity: stemOpacity,
                    background: "linear-gradient(to top, #1a4d1a, #228b22, #2e8b2e)",
                    boxShadow: "inset -1px 0 3px rgba(0,0,0,0.3), 2px 0 4px rgba(0,0,0,0.2)",
                }}
            />

            {/* Left Leaf */}
            <motion.div
                className="absolute bottom-[25%] left-1/2 -translate-x-[150%] origin-right"
                style={{
                    scale: leafScale,
                    rotate: -35,
                }}
            >
                <svg viewBox="0 0 40 60" className="w-8 md:w-12">
                    <defs>
                        <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1a4d1a" />
                            <stop offset="50%" stopColor="#228b22" />
                            <stop offset="100%" stopColor="#32cd32" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M35 30 C30 10, 15 0, 5 30 C15 50, 30 40, 35 30"
                        fill="url(#leaf-grad)"
                    />
                    <path
                        d="M35 30 Q20 30, 5 30"
                        stroke="#1a4d1a"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.5"
                    />
                </svg>
            </motion.div>

            {/* Right Leaf */}
            <motion.div
                className="absolute bottom-[20%] left-1/2 translate-x-[50%] origin-left"
                style={{
                    scale: leafScale,
                    rotate: 30,
                }}
            >
                <svg viewBox="0 0 40 60" className="w-7 md:w-10">
                    <path
                        d="M5 30 C10 10, 25 0, 35 30 C25 50, 10 40, 5 30"
                        fill="url(#leaf-grad)"
                    />
                    <path
                        d="M5 30 Q20 30, 35 30"
                        stroke="#1a4d1a"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.5"
                    />
                </svg>
            </motion.div>
        </>
    );
};

export function BloomingRose({ partnerName }: BloomingRoseProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Silky smooth scrolling
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 25,
        restDelta: 0.0005,
    });

    // Petal layers configuration
    const layers = [
        { count: 9, layer: 0 },  // Outer
        { count: 8, layer: 1 },
        { count: 7, layer: 2 },
        { count: 6, layer: 3 },  // Inner
    ];

    return (
        <div
            ref={containerRef}
            className="relative h-[250vh] flex items-center justify-center"
        >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Background Glow */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(220,20,60,0.15) 0%, transparent 70%)",
                        scale: useTransform(smoothProgress, [0, 0.5, 0.85], [0.3, 1.5, 2]),
                        opacity: useTransform(smoothProgress, [0, 0.3, 0.85, 1], [0, 0.4, 0.6, 0.4]),
                    }}
                />

                {/* Secondary ambient glow */}
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full blur-[60px]"
                    style={{
                        background: "radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 60%)",
                        scale: useTransform(smoothProgress, [0.5, 0.85], [0.5, 1.5]),
                        opacity: useTransform(smoothProgress, [0.5, 0.7, 0.85], [0, 0.5, 0.7]),
                    }}
                />

                {/* The Rose Container */}
                <div
                    className="relative w-72 h-72 md:w-[400px] md:h-[400px]"
                    style={{ transformStyle: "preserve-3d", perspective: 1200 }}
                >
                    {/* Stem & Leaves */}
                    <StemAndLeaves progress={smoothProgress} />

                    {/* Petal Layers */}
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {layers.map((layerConfig) =>
                            [...Array(layerConfig.count)].map((_, i) => (
                                <Petal
                                    key={`${layerConfig.layer}-${i}`}
                                    index={i}
                                    layer={layerConfig.layer}
                                    progress={smoothProgress}
                                    totalInLayer={layerConfig.count}
                                />
                            ))
                        )}
                    </div>

                    {/* Falling Petals */}
                    {[0, 1, 2, 3].map((i) => (
                        <FallingPetal
                            key={`falling-${i}`}
                            index={i}
                            progress={smoothProgress}
                            partnerName={partnerName}
                            showName={i === 1}
                        />
                    ))}

                    {/* Center Text Reveal */}
                    <CenterReveal progress={smoothProgress} />
                </div>
            </div>
        </div>
    );
}
