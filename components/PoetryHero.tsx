"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PoetryHeroProps {
    poem: string;
    partnerName: string;
}

// Blur Text Reveal with luxurious serif styling
const BlurTextReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const words = text.split(" ");

    return (
        <motion.div
            className="flex flex-wrap justify-center gap-x-4 gap-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0, filter: "blur(12px)", y: 30 },
                        visible: {
                            opacity: 1,
                            filter: "blur(0px)",
                            y: 0,
                            transition: {
                                duration: 0.9,
                                delay: delay + index * 0.1,
                                ease: [0.25, 0.1, 0.25, 1],
                            },
                        },
                    }}
                    className="inline-block text-3xl md:text-5xl lg:text-6xl font-serif text-white"
                    style={{
                        fontFamily: "'Playfair Display', 'Merriweather', Georgia, serif",
                        textShadow: "0 0 30px rgba(255, 105, 180, 0.5), 0 0 60px rgba(255, 105, 180, 0.3)",
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

export function PoetryHero({ poem, partnerName }: PoetryHeroProps) {
    const [showIndicator, setShowIndicator] = useState(false);
    const [isInView, setIsInView] = useState(false);

    const wordCount = poem.split(" ").length;
    const animationDuration = 1 + wordCount * 0.1 + 1;

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => {
                setShowIndicator(true);
            }, animationDuration * 1000);
            return () => clearTimeout(timer);
        }
    }, [isInView, animationDuration]);

    return (
        <motion.section
            className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            onViewportEnter={() => setIsInView(true)}
        >
            {/* Transparent - uses global AnimatedBackground */}

            {/* Poetry Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                {/* Dedication */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="text-lg md:text-xl tracking-[0.3em] uppercase"
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "rgba(255, 182, 193, 0.9)",
                        textShadow: "0 0 20px rgba(255, 105, 180, 0.5)",
                    }}
                >
                    For {partnerName}
                </motion.p>

                {/* The Poem */}
                <BlurTextReveal text={poem} delay={0.5} />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showIndicator ? 0.6 : 0 }}
                transition={{ duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
                <span className="text-xs tracking-[0.4em] uppercase text-white/50">
                    Continue
                </span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 h-2 bg-white/50 rounded-full"
                    />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
