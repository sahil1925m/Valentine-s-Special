"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Check, Heart } from "lucide-react";
import { toPng } from "html-to-image";

interface PhotoStripProps {
    partnerName: string;
    images: string[]; // Array of 3 image URLs
    proposalId?: string;
}

export function PhotoStrip({ partnerName, images, proposalId }: PhotoStripProps) {
    const stripRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [today, setToday] = useState("");
    const [isPrinted, setIsPrinted] = useState(false);

    useEffect(() => {
        // Set date on client only
        setToday(new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }));

        // Trigger printing animation after a delay
        const timer = setTimeout(() => setIsPrinted(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleDownload = async () => {
        if (!stripRef.current) return;

        setDownloading(true);
        try {
            const strip = stripRef.current;

            const dataUrl = await toPng(strip, {
                quality: 1.0,
                pixelRatio: 3,
                backgroundColor: '#1a1a1a',
                cacheBust: true,
            });

            const fileName = `photobooth-${partnerName.toLowerCase().replace(/\s+/g, "-")}.png`;
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

    // Take first 3 images or repeat if less
    const displayImages = images.slice(0, 3);
    while (displayImages.length < 3) {
        displayImages.push(images[0] || "/placeholder.jpg");
    }

    return (
        <div className="flex flex-col items-center gap-6 py-8">
            {/* Printer Slot */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-[320px] h-4 bg-gradient-to-b from-gray-900 via-gray-700 to-gray-900 rounded-t-lg shadow-inner"
            />

            {/* The Photo Strip */}
            <motion.div
                initial={{ y: -800, opacity: 0 }}
                animate={isPrinted ? { y: 0, opacity: 1 } : { y: -800, opacity: 0 }}
                transition={{
                    duration: 3,
                    ease: [0.16, 1, 0.3, 1], // Custom easing for mechanical feel
                }}
                className="relative"
            >
                <div
                    ref={stripRef}
                    className="w-[300px] bg-[#fdfcf8] rounded-lg overflow-hidden relative"
                    style={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 10px 30px -10px rgba(0, 0, 0, 0.3)",
                        // Paper texture via background
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundBlendMode: "overlay",
                    }}
                >
                    {/* Photo Slots */}
                    <div className="p-4 space-y-3">
                        {displayImages.map((img, index) => (
                            <div
                                key={index}
                                className="w-full aspect-[4/3] overflow-hidden rounded-sm bg-gray-200 relative"
                            >
                                <img
                                    src={img}
                                    alt={`Memory ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: "sepia(0.15) contrast(1.1) brightness(1.05)",
                                    }}
                                />
                                {/* Vintage overlay */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-rose-100/20 mix-blend-overlay"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-6 text-center relative">
                        {/* Names & Date */}
                        <p
                            className="text-gray-800 text-lg font-medium mb-1"
                            style={{ fontFamily: "'Courier Prime', 'Courier New', monospace" }}
                        >
                            {partnerName} & You
                        </p>
                        <p
                            className="text-gray-500 text-sm"
                            style={{ fontFamily: "'Courier Prime', 'Courier New', monospace" }}
                        >
                            {today}
                        </p>

                        {/* Heart decoration */}
                        <div className="flex justify-center gap-1 mt-3 opacity-50">
                            <Heart size={12} className="fill-rose-400 text-rose-400" />
                            <Heart size={12} className="fill-rose-400 text-rose-400" />
                            <Heart size={12} className="fill-rose-400 text-rose-400" />
                        </div>

                        {/* "SAID YES!" Stamp */}
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={isPrinted ? { scale: 1, rotate: -15 } : { scale: 0 }}
                            transition={{ delay: 3.2, type: "spring", stiffness: 200 }}
                            className="absolute -bottom-2 right-4 bg-red-600 text-white px-4 py-2 rounded-sm shadow-lg"
                            style={{
                                fontFamily: "'Courier Prime', 'Courier New', monospace",
                                border: "3px solid #b91c1c",
                            }}
                        >
                            <span className="font-bold text-sm tracking-wider">SAID YES!</span>
                        </motion.div>
                    </div>

                    {/* Perforated edge at bottom */}
                    <div className="w-full h-4 bg-[#fdfcf8] relative overflow-hidden">
                        <div
                            className="absolute inset-0 flex justify-center gap-2"
                            style={{
                                backgroundImage: "radial-gradient(circle, #ddd 1px, transparent 1px)",
                                backgroundSize: "8px 8px",
                            }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Download Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={isPrinted ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 3.5 }}
                onClick={handleDownload}
                disabled={downloading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full font-medium border border-white/20 hover:bg-white/20 transition-colors"
            >
                {downloaded ? (
                    <>
                        <Check size={18} />
                        Saved to Gallery!
                    </>
                ) : downloading ? (
                    <>
                        <Download size={18} className="animate-bounce" />
                        Downloading...
                    </>
                ) : (
                    <>
                        <Download size={18} />
                        Save to Gallery 📥
                    </>
                )}
            </motion.button>
        </div>
    );
}
