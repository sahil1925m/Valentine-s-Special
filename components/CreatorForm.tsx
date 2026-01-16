"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, Heart, AlertTriangle, Palette, Eye, Sparkles, Shuffle, User, Image } from "lucide-react";
import { Slide, ThemeType, themeLabels } from "@/lib/types";
import { cn } from "@/lib/utils";
import { checkSupabaseConfigured } from "@/lib/supabase";
import { FloatingHearts } from "@/components/FloatingHearts";

// Preset poems for inspiration
const PRESET_POEMS = [
    "In a universe of billions, my soul simply chose you. No calculations, no logic—just the undeniable truth that you are my gravity.",
    "They say we are made of stardust. I think my dust was always meant to find yours, across time and space, to create this galaxy of 'us'.",
    "If I could give you one thing in life, I would give you the ability to see yourself through my eyes. Only then would you realize how special you are to me.",
    "I didn't fall in love with you. I walked into love with you, with my eyes wide open, choosing to take every step along the way.",
    "You are the poem I never knew how to write, and this life is the story I never knew I wanted to tell, until you became my co-author.",
    "I look at you and I see the rest of my life in front of my eyes. And trust me, it looks beautiful.",
    "My favorite place in the entire world is next to you.",
    "You are my today and all of my tomorrows.",
    "Some hearts understand each other, even in silence. Mine beats the loudest when you are near.",
    "In a world full of variables, you are my only constant.",
    "Life was just a loop of ordinary days until you broke the cycle and became my favorite feature.",
    "You are the notification I wait for, the connection I never want to lose, and the home screen I always want to wake up to."
];

interface SlideWithFile extends Slide {
    file?: File;
}

interface PreviewData {
    partnerName: string;
    introMessage: string;
    slides: Slide[];
    theme: ThemeType;
    files: File[];
}

interface CreatorFormProps {
    onPreview: (data: PreviewData) => void;
}

// Floating Label Input Component
const FloatingInput = ({
    label,
    value,
    onChange,
    icon: Icon,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    icon: React.ElementType;
    placeholder?: string;
}) => {
    const [focused, setFocused] = useState(false);
    const isFloating = focused || value.length > 0;

    return (
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400/50">
                <Icon size={18} />
            </div>
            <motion.label
                className={cn(
                    "absolute left-12 transition-all pointer-events-none",
                    isFloating
                        ? "top-1 text-xs text-pink-400"
                        : "top-1/2 -translate-y-1/2 text-white/40"
                )}
                animate={{
                    top: isFloating ? "4px" : "50%",
                    fontSize: isFloating ? "10px" : "14px",
                }}
            >
                {label}
            </motion.label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={focused ? placeholder : ""}
                className={cn(
                    "w-full bg-transparent pl-12 pr-4 pt-5 pb-2 text-white",
                    "border-b-2 transition-all duration-300 outline-none",
                    focused
                        ? "border-pink-500 shadow-[0_2px_10px_rgba(236,72,153,0.3)]"
                        : "border-white/20 hover:border-white/40"
                )}
            />
        </div>
    );
};

export function CreatorForm({ onPreview }: CreatorFormProps) {
    const [partnerName, setPartnerName] = useState("");
    const [introMessage, setIntroMessage] = useState("");
    const [slideIdCounter, setSlideIdCounter] = useState(1);
    const [slides, setSlides] = useState<SlideWithFile[]>([
        { id: "slide-0", image: "", text: "" },
    ]);
    const [theme, setTheme] = useState<ThemeType>("rose-gold");
    const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

    // Check Supabase configuration on mount
    useEffect(() => {
        checkSupabaseConfigured().then(configured => {
            setIsConfigured(configured);
        });
    }, []);

    const handleImageUpload = (id: string, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSlides((prev) =>
                prev.map((slide) =>
                    slide.id === id ? { ...slide, image: url, file } : slide
                )
            );
        }
    };

    const updateSlideText = (id: string, text: string) => {
        setSlides((prev) =>
            prev.map((slide) => (slide.id === id ? { ...slide, text } : slide))
        );
    };

    const addSlide = () => {
        const newId = `slide-${slideIdCounter}`;
        setSlideIdCounter((prev) => prev + 1);
        setSlides((prev) => [
            ...prev,
            { id: newId, image: "", text: "" },
        ]);
    };

    const removeSlide = (id: string) => {
        if (slides.length > 1) {
            setSlides((prev) => prev.filter((slide) => slide.id !== id));
        }
    };

    const handlePreview = () => {
        if (!partnerName.trim()) {
            alert("Please enter your partner's name!");
            return;
        }
        if (!introMessage.trim()) {
            alert("Please write an intro message!");
            return;
        }
        const invalidSlides = slides.some((s) => !s.image || !s.text);
        if (invalidSlides) {
            alert("Please fill out all slides with an image and text!");
            return;
        }
        if (!isConfigured) {
            console.warn("Supabase not configured. Running in demo mode.");
            // We allow proceeding to preview, but saving will be blocked later
        }

        const files = slides.map((s) => s.file!).filter(Boolean);
        onPreview({
            partnerName,
            introMessage,
            slides: slides.map(({ id, image, text }) => ({ id, image, text })),
            theme,
            files,
        });
    };

    const handleBulkUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newSlides = files.map((file, index) => ({
            id: `slide-${Date.now()}-${index}`,
            image: URL.createObjectURL(file),
            text: "",
            file: file
        }));

        setSlides(prev => {
            // If the first slide is empty (default state), replace it
            if (prev.length === 1 && !prev[0].image && !prev[0].text) {
                return newSlides;
            }
            return [...prev, ...newSlides];
        });
    };

    return (
        <div
            className="fixed inset-0 overflow-auto"
            style={{
                background: "radial-gradient(ellipse at top center, #4a0018 0%, #1a0008 50%, #050505 100%)"
            }}
        >
            {/* Floating Hearts Background */}
            <FloatingHearts />

            {/* Main Form Card */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-xl"
                >
                    {/* Crystal Tablet Card */}
                    <div
                        className="rounded-3xl p-8 space-y-8"
                        style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 20, 147, 0.2)",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 0 50px rgba(220, 20, 60, 0.2)",
                        }}
                    >
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block"
                            >
                                <Heart className="w-12 h-12 mx-auto text-pink-500 fill-pink-500" />
                            </motion.div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                                Proposal Creator
                            </h1>
                            <p className="text-white/50 text-sm">Craft your perfect moment</p>
                        </div>

                        {/* Supabase Warning */}
                        {isConfigured === false && (
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                                <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                                <div className="space-y-1">
                                    <p className="text-amber-200/80 text-sm font-medium">Demo Mode Active</p>
                                    <p className="text-amber-200/60 text-xs">
                                        Supabase is not configured. You can <b>preview</b> your proposal, but <b>saving/sharing</b> will be disabled.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Partner Name Input */}
                        <FloatingInput
                            label="Partner's Name"
                            value={partnerName}
                            onChange={setPartnerName}
                            icon={User}
                            placeholder="Enter their name..."
                        />

                        {/* Intro Message */}
                        <div className="space-y-3">
                            <label className="text-sm text-pink-300 flex items-center gap-2">
                                <Sparkles size={14} />
                                The Prologue
                            </label>
                            <div className="relative">
                                <textarea
                                    value={introMessage}
                                    onChange={(e) => setIntroMessage(e.target.value)}
                                    placeholder="Write something poetic..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-24 text-white placeholder:text-white/30 focus:border-pink-500/50 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)] outline-none transition-all h-28 resize-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const randomPoem = PRESET_POEMS[Math.floor(Math.random() * PRESET_POEMS.length)];
                                        setIntroMessage(randomPoem);
                                    }}
                                    className="absolute top-3 right-3 text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded-lg border border-purple-500/20"
                                >
                                    <Shuffle size={10} />
                                    Inspire Me
                                </button>
                            </div>
                        </div>

                        {/* Theme Selector */}
                        <div className="space-y-3">
                            <label className="text-sm text-pink-300 flex items-center gap-2">
                                <Palette size={14} />
                                Visual Theme
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(Object.keys(themeLabels) as ThemeType[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTheme(t)}
                                        className={cn(
                                            "p-3 rounded-xl text-xs font-medium transition-all border",
                                            theme === t
                                                ? "bg-pink-500/20 border-pink-500 text-pink-300"
                                                : "bg-white/5 border-white/10 text-white/50 hover:border-pink-500/50"
                                        )}
                                    >
                                        {themeLabels[t]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Memory Slides */}
                        <div className="space-y-4">
                            <label className="text-sm text-pink-300 flex items-center gap-2">
                                <Image size={14} />
                                Memory Slides
                            </label>

                            {slides.map((slide, index) => (
                                <motion.div
                                    key={slide.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all"
                                >
                                    {slides.length > 1 && (
                                        <button
                                            onClick={() => removeSlide(slide.id)}
                                            className="absolute -top-2 -right-2 p-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}

                                    <div className="flex gap-4 items-start">
                                        <label className="shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-all overflow-hidden">
                                            {slide.image ? (
                                                <img src={slide.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <Upload size={16} className="text-white/30 mb-1" />
                                                    <span className="text-[9px] text-white/30">Add</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(slide.id, e)}
                                            />
                                        </label>
                                        <div className="grow">
                                            <label className="text-[10px] text-white/40 mb-1 block">
                                                Slide {index + 1} Message
                                            </label>
                                            <textarea
                                                value={slide.text}
                                                onChange={(e) => updateSlideText(slide.id, e.target.value)}
                                                placeholder="Your memory..."
                                                className="w-full bg-transparent border-b border-white/10 focus:border-pink-500/50 outline-none text-white text-sm p-1 h-16 resize-none placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="grid grid-cols-2 gap-3">
                                <label className="py-3 rounded-xl border-2 border-dashed border-white/20 text-white/40 text-sm font-medium hover:border-pink-500/50 hover:text-pink-400 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                    <Upload size={16} /> Bulk Upload
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleBulkUpload}
                                    />
                                </label>
                                <button
                                    onClick={addSlide}
                                    className="py-3 rounded-xl border-2 border-dashed border-white/20 text-white/40 text-sm font-medium hover:border-pink-500/50 hover:text-pink-400 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Add 1 Slide
                                </button>
                            </div>
                        </div>

                        {/* Preview Button with Heartbeat */}
                        <motion.button
                            onClick={handlePreview}
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-shadow flex items-center justify-center gap-2"
                        >
                            <Eye size={20} />
                            Preview Proposal
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
