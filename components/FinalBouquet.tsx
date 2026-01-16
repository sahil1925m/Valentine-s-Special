"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRoseStore } from "@/lib/RoseContext";

export function FinalBouquet() {
    const { rosesCollected } = useRoseStore();

    if (rosesCollected === 0) return null;

    // Create an array based on count
    const roses = Array.from({ length: rosesCollected });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-8 relative z-20"
        >
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Glow Background */}
                <div className="absolute inset-0 bg-red-500/20 blur-[50px] rounded-full animate-pulse" />

                {roses.map((_, i) => {
                    // Calculated positioning for cluster effect
                    const angle = (i / roses.length) * Math.PI * 2;
                    const radius = Math.min(i * 4, 80); // Spiral out
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const rotation = Math.random() * 360;

                    return (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{ scale: 1, x, y, rotate: rotation }}
                            transition={{
                                delay: i * 0.1,
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                            className="absolute"
                        >
                            <span className="text-4xl drop-shadow-lg filter">🌹</span>
                        </motion.div>
                    );
                })}
            </div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + (roses.length * 0.1) }}
                className="text-rose-200 mt-4 font-serif italic text-lg"
            >
                You collected {rosesCollected} rose{rosesCollected !== 1 ? 's' : ''} along the way...
            </motion.p>
        </motion.div>
    );
}
