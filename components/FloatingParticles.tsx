"use client";

import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingParticlesProps {
    count?: number;
}

// Particle Component to handle individual motion logic
const Particle = ({
    initialX,
    initialY,
    scale,
    rotate,
    type,
    speed,
    scrollYProgress
}: {
    initialX: number;
    initialY: number;
    scale: number;
    rotate: number;
    type: "heart" | "star" | "orb";
    speed: number;
    scrollYProgress: MotionValue<number>;
}) => {
    // Parallax effect: The faster the speed, the more it moves against scroll
    // Range: Move UP as we scroll down.
    // 500vh is roughly 5 * window.innerHeight. 
    // Let's say max movement is -500px to 500px depending on speed.
    const y = useTransform(scrollYProgress, [0, 1], [0, -1000 * speed]);

    // Smooth magnetic repulsion
    // Since we don't have global mouse state easily without perf cost, 
    // we use `whileHover` for a simple "push away" effect.

    return (
        <motion.div
            className="absolute pointer-events-auto"
            style={{
                left: `${initialX}%`,
                top: `${initialY}%`,
                y,
                rotate: rotate,
            }}
            whileHover={{
                x: Math.random() < 0.5 ? 20 : -20,
                y: Math.random() < 0.5 ? 20 : -20,
                scale: scale * 1.2,
                opacity: 0,
                transition: { duration: 0.4 }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.random() * 0.5 + 0.2 }}
            transition={{ duration: 1, delay: Math.random() * 2 }}
        >
            {type === "heart" && (
                <Heart
                    className={cn("text-rose-400/30 dark:text-rose-500/30", Math.random() > 0.5 && "fill-rose-400/10")}
                    size={24 * scale}
                />
            )}
            {type === "star" && (
                <Star
                    className="text-yellow-200/40 fill-yellow-200/20"
                    size={20 * scale}
                />
            )}
            {type === "orb" && (
                <div
                    className="rounded-full bg-rose-500/20 blur-xl"
                    style={{
                        width: `${40 * scale}px`,
                        height: `${40 * scale}px`
                    }}
                />
            )}
        </motion.div>
    );
};

export function FloatingParticles({ count = 25 }: FloatingParticlesProps) {
    const { scrollYProgress } = useScroll();

    // Create randomized particles once
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // 0-100% width
            y: Math.random() * 100, // 0-100% of container height (which will be large)
            scale: Math.random() * 1.5 + 0.5,
            rotate: Math.random() * 360,
            type: Math.random() > 0.6 ? "heart" : Math.random() > 0.5 ? "star" : "orb",
            speed: Math.random() * 2 + 0.5, // Speed multiplier
        }));
    }, [count]);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden h-[300vh] w-full">
            {particles.map((p) => (
                <Particle
                    key={p.id}
                    initialX={p.x}
                    initialY={p.y}
                    scale={p.scale}
                    rotate={p.rotate}
                    type={p.type as any}
                    speed={p.speed}
                    scrollYProgress={scrollYProgress}
                />
            ))}
        </div>
    );
}
