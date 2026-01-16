"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Check, Heart, Sparkles, MoveRight } from "lucide-react";
import { toPng } from "html-to-image";

interface OpenJournalProps {
    partnerName: string;
    images: string[];
    proposalId?: string;
}

export function OpenJournal({ partnerName, images, proposalId }: OpenJournalProps) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [today, setToday] = useState("");

    // Use the first image or a placeholder
    const heroImage = images[0] || "/placeholder.jpg";

    useEffect(() => {
        setToday(new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric", // e.g., February 14, 2026
        }));
    }, []);

    const handleDownload = async () => {
        if (!sceneRef.current) return;

        setDownloading(true);
        try {
            const scene = sceneRef.current;

            // Capture the whole scene container
            const dataUrl = await toPng(scene, {
                quality: 1.0,
                pixelRatio: 3,
                cacheBust: true,
            });

            const fileName = `our-story-${partnerName.toLowerCase().replace(/\s+/g, "-")}.png`;
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = fileName;
            link.click();

            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 2000);
        } catch (err) {
            console.error("Failed to download:", err);
            alert("Download failed. Please try again or take a screenshot!");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 py-10 w-full max-w-4xl mx-auto">

            {/* THE SCENE CONTAINER (Captured for download) */}
            <div
                ref={sceneRef}
                className="relative w-full aspect-[4/3] md:aspect-[16/10] flex items-center justify-center p-4 md:p-12 overflow-hidden rounded-xl"
                style={{
                    // Background: Soft White Bedlinen Texture
                    backgroundColor: "#f5f5f0",
                    backgroundImage: `
                        radial-gradient(#e0e0d8 1px, transparent 1px),
                        repeating-linear-gradient(45deg, #f0f0eb 0, #f0f0eb 1px, transparent 1px, transparent 10px)
                    `,
                    backgroundSize: "20px 20px, 40px 40px",
                }}
            >
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none mix-blend-multiply opacity-30" />

                {/* THE OPEN BOOK */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative w-full max-w-[800px] aspect-[3/2] bg-[#fdfbf7] rounded-sm flex shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]"
                >
                    {/* Spine Shadow */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-black/10 to-transparent z-20 pointer-events-none mix-blend-multiply" />

                    {/* LEFT PAGE - The Memory */}
                    <div className="flex-1 relative p-6 md:p-10 flex items-center justify-center overflow-hidden">
                        {/* Paper Grain Texture */}
                        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
                            style={{ filter: "contrast(1.2) brightness(0.95) url(/paper-grain.png)" }} />

                        {/* Taped Polaroid */}
                        <motion.div
                            initial={{ rotate: -5, scale: 0.9 }}
                            animate={{ rotate: -5, scale: 1 }}
                            whileHover={{ scale: 1.05, rotate: -2, transition: { duration: 0.3 } }}
                            className="relative bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-lg transform rotate-[-3deg]"
                        >
                            {/* Washi Tape */}
                            <div
                                className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-rose-200/80 backdrop-blur-sm shadow-sm z-10 transform rotate-[-2deg]"
                                style={{ clipPath: "polygon(2% 0, 100% 2%, 98% 100%, 0% 98%)" }}
                            />

                            {/* The Photo */}
                            <div className="relative aspect-[4/5] w-40 md:w-56 overflow-hidden bg-gray-100">
                                <img
                                    src={heroImage}
                                    alt="Us"
                                    className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.05]"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 mix-blend-multiply" />
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT PAGE - The Message */}
                    <div className="flex-1 relative p-6 md:p-10 flex flex-col items-center justify-center text-center">
                        {/* Paper Grain */}
                        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" />

                        {/* Hand-Drawn Elements */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                            className="relative"
                        >
                            {/* Doodles */}
                            <Sparkles className="absolute -top-8 -right-8 text-yellow-400 w-8 h-8 animate-pulse" />
                            <Heart className="absolute -bottom-6 -left-6 text-rose-300 w-8 h-8 fill-rose-200 transform -rotate-12" />

                            {/* Main Text */}
                            <h2
                                className="text-4xl md:text-6xl text-rose-600 leading-tight transform -rotate-2"
                                style={{
                                    fontFamily: 'var(--font-permanent-marker), cursive',
                                    textShadow: "2px 2px 0px rgba(225, 29, 72, 0.1)"
                                }}
                            >
                                She Said <br />
                                <span className="text-5xl md:text-7xl block mt-2">YES!</span>
                            </h2>

                            {/* Doodle Arrow */}
                            <div className="absolute -bottom-12 right-0 transform rotate-[20deg] opacity-60">
                                <svg width="60" height="40" viewBox="0 0 100 60" fill="none" stroke="currentColor" className="text-gray-400">
                                    <path d="M10 10 Q 50 50 90 20" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M80 15 L 90 20 L 85 30" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Date Footer */}
                        <div className="absolute bottom-8 md:bottom-12 w-full text-center">
                            <p
                                className="text-gray-500 text-xs md:text-sm tracking-widest uppercase opacity-70"
                                style={{ fontFamily: "'Courier Prime', monospace" }}
                            >
                                {today}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ACTION BUTTON */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                onClick={handleDownload}
                disabled={downloading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-3 bg-white text-rose-600 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-rose-50 transition-all border border-rose-100"
            >
                {downloaded ? (
                    <>
                        <Check size={20} />
                        Saved to Gallery!
                    </>
                ) : downloading ? (
                    <>
                        <Download size={20} className="animate-bounce" />
                        Saving Memory...
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        Save Page to Gallery 📸
                    </>
                )}
            </motion.button>
        </div>
    );
}
