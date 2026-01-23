"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check, Heart, Sparkles, Send, Link as LinkIcon, Copy, Phone } from "lucide-react";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabase";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import { useSearchParams } from "next/navigation";

interface OpenJournalProps {
    partnerName: string;
    partnerGender?: "female" | "male" | "neutral";
    images: string[];
    proposalId?: string;
}

export function OpenJournal({ partnerName, partnerGender = "female", images, proposalId }: OpenJournalProps) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [today, setToday] = useState("");

    // RSVP Form State
    const [rsvpDate, setRsvpDate] = useState("");
    const [rsvpTime, setRsvpTime] = useState("");
    const [rsvpMessage, setRsvpMessage] = useState("");
    const [isSealed, setIsSealed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // WhatsApp / Link Generator State
    const searchParams = useSearchParams();
    const phoneParam = searchParams.get("phone");
    const [showLinkGen, setShowLinkGen] = useState(false);
    const [whatsappNum, setWhatsappNum] = useState("");
    const [copied, setCopied] = useState(false);

    const [playPaperSound] = useSound("https://assets.mixkit.co/active_storage/sfx/2402/2402-preview.mp3", { volume: 0.5 });

    const heroImage = images[0] || "/placeholder.jpg";

    useEffect(() => {
        setToday(new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }));
    }, []);

    const getSuccessText = () => {
        if (partnerGender === 'male') return "He Said";
        if (partnerGender === 'neutral') return `${partnerName} Said`;
        return "She Said";
    };

    const handleSeal = async () => {
        setIsSubmitting(true);
        playPaperSound();

        // 1. WhatsApp Redirection (Priority if phone param exists)
        if (phoneParam) {
            const msg = `💖 *IT'S A YES!* 💖
-----------------------
🗓️ Date: *${rsvpDate || "TBD"}*
⏰ Time: *${rsvpTime || "TBD"}*
✨ ✨ ✨
💌 *Note from her:*
_${rsvpMessage || "No note"}_

See you soon! 🚀`;
            const whatsappUrl = `https://wa.me/${phoneParam}?text=${encodeURIComponent(msg)}`;

            triggerConfetti();
            setTimeout(() => {
                window.location.href = whatsappUrl;
                setIsSealed(true); // Visually seal it too
                setIsSubmitting(false);
            }, 1000);
            return;
        }

        // 2. Database Fallback (If proposalId exists)
        if (proposalId) {
            try {
                const response = await fetch('/api/respond', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        proposalId,
                        partnerName,
                        date: rsvpDate,
                        time: rsvpTime,
                        message: rsvpMessage
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to respond");
                }

                triggerConfetti();
                setTimeout(() => setIsSealed(true), 500);

            } catch (err: any) {
                console.error("Failed to seal RSVP:", err);
                alert(`Failed to seal message: ${err.message || "Unknown error"}`);
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // 3. Demo Mode (No Phone, No Proposal ID)
        alert("This is a demo! Create your own link below to test it with WhatsApp.");
        setIsSubmitting(false);
    };

    const handleCopyLink = () => {
        let cleanNum = whatsappNum.replace(/\D/g, "");
        if (cleanNum.length === 10) {
            cleanNum = "91" + cleanNum;
        }

        const baseUrl = window.location.origin + window.location.pathname;
        const fullUrl = `${baseUrl}?phone=${cleanNum}`;
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: ReturnType<typeof setInterval> = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const handleDownload = async () => {
        if (!sceneRef.current) return;
        setDownloading(true);

        const tryCapture = async (scale: number): Promise<string> => {
            if (!sceneRef.current) throw new Error("No Ref");
            await new Promise(resolve => setTimeout(resolve, 300));
            return await toPng(sceneRef.current, { quality: 0.95, pixelRatio: scale, cacheBust: true });
        };

        try {
            const isMobile = window.innerWidth < 768;
            let dataUrl = "";
            if (isMobile) {
                dataUrl = await tryCapture(1.5);
            } else {
                try {
                    dataUrl = await tryCapture(2);
                } catch (firstErr) {
                    dataUrl = await tryCapture(1);
                }
            }

            const fileName = `our-story-${partnerName.toLowerCase().replace(/\s+/g, "-")}.png`;
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = fileName;
            link.click();

            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 2000);
        } catch (err) {
            console.error("Failed to download:", err);
            alert("Oops! Your device is protecting its memory. Try taking a screenshot manually!");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 py-10 w-full max-w-4xl mx-auto">
            <div
                ref={sceneRef}
                className="relative w-full flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden rounded-xl gap-8"
                style={{
                    backgroundColor: "#f5f5f0",
                    backgroundImage: `radial-gradient(#e0e0d8 1px, transparent 1px), repeating-linear-gradient(45deg, #f0f0eb 0, #f0f0eb 1px, transparent 1px, transparent 10px)`,
                    backgroundSize: "20px 20px, 40px 40px",
                }}
            >
                <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none mix-blend-multiply opacity-30" />

                {/* 1. THE OPEN BOOK */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative w-full max-w-[800px] aspect-[3/2] bg-[#fdfbf7] rounded-sm flex shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] z-10"
                >
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-transparent via-black/10 to-transparent z-20 pointer-events-none mix-blend-multiply" />

                    <div className="flex-1 relative p-6 md:p-10 flex items-center justify-center overflow-hidden">
                        <motion.div
                            initial={{ rotate: -5, scale: 0.9 }}
                            animate={{ rotate: -5, scale: 1 }}
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            className="relative bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-lg transform rotate-[-3deg]"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-rose-200/80 backdrop-blur-sm shadow-sm z-10 transform rotate-[-2deg]" style={{ clipPath: "polygon(2% 0, 100% 2%, 98% 100%, 0% 98%)" }} />
                            <div className="relative aspect-[4/5] w-40 md:w-56 overflow-hidden bg-gray-100">
                                <img src={heroImage} alt="Us" className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.05]" />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 mix-blend-multiply" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative p-6 md:p-10 flex flex-col items-center justify-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                            className="relative w-full"
                        >
                            <Sparkles className="absolute -top-8 -right-8 text-yellow-400 w-8 h-8 animate-pulse" />
                            <Heart className="absolute -bottom-6 -left-6 text-rose-300 w-8 h-8 fill-rose-200 transform -rotate-12" />
                            <h2 className="text-rose-600 leading-tight transform -rotate-2 flex flex-col items-center justify-center w-full" style={{ fontFamily: 'var(--font-permanent-marker), cursive', textShadow: "2px 2px 0px rgba(225, 29, 72, 0.1)" }}>
                                <span className="text-3xl md:text-5xl whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-2">{getSuccessText()}</span>
                                <span className="text-5xl md:text-7xl block mt-2">YES!</span>
                            </h2>
                        </motion.div>
                        <div className="absolute bottom-8 md:bottom-12 w-full text-center">
                            <p className="text-gray-500 text-xs md:text-sm tracking-widest uppercase opacity-70" style={{ fontFamily: "'Courier Prime', monospace" }}>{today}</p>
                        </div>
                    </div>
                </motion.div>

                {/* 2. RSVP FORM / SUCCESS MESSAGE */}
                <AnimatePresence mode="wait">
                    {!isSealed ? (
                        <motion.div
                            key="rsvp-form"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ x: 1000, y: -600, opacity: 0, rotate: -20, scale: 0.8, transition: { duration: 0.8, ease: "backIn" } }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full max-w-[600px] bg-[#fffdf5] rounded-lg shadow-xl p-8 border border-gray-200 z-50"
                            style={{ backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "100% 2em", lineHeight: "2em" }}
                        >
                            <div className="absolute top-0 left-6 bottom-0 w-8 flex flex-col justify-evenly">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 rounded-full bg-gray-300 border border-gray-400 shadow-inner" />
                                ))}
                            </div>

                            <div className="pl-12">
                                <h3 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    When are we celebrating?
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-wider text-gray-500">Date</label>
                                        <input type="date" value={rsvpDate} onChange={(e) => setRsvpDate(e.target.value)} className="bg-transparent border-b-2 border-rose-200 focus:border-rose-500 focus:outline-none py-1 text-gray-700 font-mono" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs uppercase tracking-wider text-gray-500">Time</label>
                                        <input type="time" value={rsvpTime} onChange={(e) => setRsvpTime(e.target.value)} className="bg-transparent border-b-2 border-rose-200 focus:border-rose-500 focus:outline-none py-1 text-gray-700 font-mono" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-8">
                                    <label className="text-xs uppercase tracking-wider text-gray-500">A note for me...</label>
                                    <textarea
                                        rows={3}
                                        value={rsvpMessage}
                                        onChange={(e) => setRsvpMessage(e.target.value)}
                                        placeholder="Write something sweet..."
                                        className="w-full bg-transparent border-none focus:ring-0 text-xl text-blue-900 resize-none placeholder:text-gray-300"
                                        style={{ fontFamily: "'Dancing Script', cursive", lineHeight: "2em", backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "100% 2em", backgroundAttachment: "local" }}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05, rotate: 1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSeal}
                                        disabled={isSubmitting}
                                        className="relative group px-6 py-2 bg-rose-600 text-white font-serif text-lg shadow-md hover:bg-rose-700 transition-all flex items-center gap-3 overflow-hidden border-2 border-rose-800/20"
                                        style={{ fontFamily: "'Courier Prime', monospace" }}
                                    >
                                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">Sending... <Sparkles size={16} className="animate-spin" /></span>
                                        ) : (
                                            <>Send Reply <Send size={18} className="transform -rotate-45 mb-1" /></>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-message"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-rose-200 text-center max-w-md"
                        >
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                                    <Send size={32} className="text-rose-500 transform -rotate-45 mr-1 mt-1" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>Letter Sent! 💌</h3>
                            <p className="text-gray-600">Your reply is on its way to {partnerName}.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Download Button */}
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
                    <><Check size={20} /> Saved to Gallery!</>
                ) : downloading ? (
                    <><Download size={20} className="animate-bounce" /> Saving Memory...</>
                ) : (
                    <><Download size={20} /> Save Page to Gallery 📸</>
                )}
            </motion.button>

            {/* Link Generator Section */}
            <div className="w-full max-w-md mt-8 border-t border-gray-200 pt-8 text-center">
                <button
                    onClick={() => setShowLinkGen(!showLinkGen)}
                    className="text-gray-400 hover:text-rose-500 text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                    <LinkIcon size={14} />
                    {showLinkGen ? "Hide Link Creator" : "Create Your Own WhatsApp Link"}
                </button>

                <AnimatePresence>
                    {showLinkGen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-4 mx-2">
                                <h4 className="text-gray-800 font-bold mb-2">Generate Your Link 🔗</h4>
                                <p className="text-xs text-gray-500 mb-4">
                                    Enter your WhatsApp number (with country code). Responses will be sent directly to you!
                                </p>

                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        placeholder="e.g. 919999999999"
                                        value={whatsappNum}
                                        onChange={(e) => setWhatsappNum(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                                <div className="mt-2 text-[10px] text-gray-400 text-left">
                                    *Format: CountryCode + Number (No + or spaces)
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
