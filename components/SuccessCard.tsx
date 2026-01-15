"use client";

import React, { useRef, useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Heart, Plane, Calendar, Download, Check } from "lucide-react";
import html2canvas from "html2canvas";

interface SuccessCardProps {
    partnerName: string;
    proposalId?: string;
}

export function SuccessCard({ partnerName, proposalId }: SuccessCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [today, setToday] = useState("");
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        // Set date on client only to avoid hydration mismatch
        setToday(new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }));

        // Set share URL on client
        const baseUrl = window.location.origin;
        setShareUrl(proposalId ? `${baseUrl}/p/${proposalId}` : baseUrl);
    }, [proposalId]);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            // Get the card element
            const card = cardRef.current;

            // Store original styles
            const originalTransform = card.style.transform;
            const originalTransition = card.style.transition;

            // Reset transforms for clean capture
            card.style.transform = "none";
            card.style.transition = "none";

            // Wait a frame for styles to apply
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(card, {
                scale: 3, // Higher quality
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false,
                allowTaint: true,
                width: card.offsetWidth,
                height: card.offsetHeight,
            });

            // Restore original styles
            card.style.transform = originalTransform;
            card.style.transition = originalTransition;

            // Create and trigger download
            const dataUrl = canvas.toDataURL("image/png", 1.0);
            const fileName = `valentine-pass-${partnerName.toLowerCase().replace(/\s+/g, "-")}.png`;

            // Use blob for more reliable download
            const blob = await (await fetch(dataUrl)).blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 100);

            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 2000);
        } catch (err) {
            console.error("Failed to download:", err);
            alert("Download failed. Please try taking a screenshot manually.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="z-50 p-4 flex flex-col items-center gap-4"
        >
            <Tilt
                glareEnable={true}
                glareMaxOpacity={0.4}
                glareColor="#ffffff"
                glarePosition="all"
                glareBorderRadius="20px"
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                className="relative group"
            >
                <div
                    ref={cardRef}
                    className="w-[340px] bg-white rounded-3xl overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="bg-rose-600 p-6 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <Plane className="transform rotate-45" size={24} />
                            <span className="font-bold tracking-wider uppercase text-sm">Valentine Airways</span>
                        </div>
                        <Heart className="fill-white animate-pulse" size={24} />
                    </div>

                    {/* Ticket Body */}
                    <div className="p-6 space-y-6 bg-gradient-to-b from-white to-rose-50">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Passenger</p>
                                <p className="text-2xl font-bold text-gray-800 font-serif">{partnerName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Date</p>
                                <div className="flex items-center gap-1 text-rose-600 font-medium">
                                    <Calendar size={14} />
                                    <span>{today}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-dashed border-gray-300 pt-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Destination</p>
                                <p className="text-xl font-bold text-rose-600">Forever</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1 text-right">Seat</p>
                                <p className="text-xl font-bold text-rose-600 text-right">1A (VIP)</p>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="flex flex-col items-center justify-center pt-2 gap-2">
                            <div className="p-2 bg-white rounded-lg shadow-inner border border-gray-100">
                                <QRCodeSVG
                                    value={shareUrl}
                                    size={120}
                                    fgColor="#e11d48"
                                    level="H" // High error correction for scanning from photos
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 tracking-[0.2em]">SCAN TO BOARD</p>
                        </div>
                    </div>

                    {/* Holographic Edge Overlay */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none border-[1px] border-white/50 bg-gradient-to-tr from-transparent via-white/10 to-transparent mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </Tilt>

            {/* Download Button */}
            <motion.button
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
                        Download Ticket
                    </>
                )}
            </motion.button>
        </motion.div>
    );
}
