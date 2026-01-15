"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Lock, Unlock, Loader2, ExternalLink } from "lucide-react";

interface SocialUnlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlock: () => void;
    isUploading: boolean;
}

const INSTAGRAM_URL = "https://instagram.com/vibecoder"; // Replace with actual handle
const UNLOCK_DELAY = 3; // seconds

export function SocialUnlockModal({ isOpen, onClose, onUnlock, isUploading }: SocialUnlockModalProps) {
    const [countdown, setCountdown] = useState(UNLOCK_DELAY);
    const [hasVisitedIG, setHasVisitedIG] = useState(false);

    useEffect(() => {
        if (isOpen && hasVisitedIG && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, hasVisitedIG, countdown]);

    useEffect(() => {
        if (isOpen) {
            setCountdown(UNLOCK_DELAY);
            setHasVisitedIG(false);
        }
    }, [isOpen]);

    const handleFollowClick = () => {
        window.open(INSTAGRAM_URL, "_blank");
        setHasVisitedIG(true);
    };

    const canUnlock = hasVisitedIG && countdown === 0;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-white" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Unlock Your Valentine Link 🔒</h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            I'm a student developer hosting this for free! Please follow my journey to unlock your unique link.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        {/* Step 1: Follow */}
                        <button
                            onClick={handleFollowClick}
                            className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-3 shadow-lg"
                        >
                            <Instagram size={22} />
                            Follow @vibecoder on IG
                            <ExternalLink size={16} />
                        </button>

                        {/* Step 2: Unlock */}
                        <button
                            onClick={onUnlock}
                            disabled={!canUnlock || isUploading}
                            className={`w-full py-4 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${canUnlock && !isUploading
                                    ? "bg-rose-600 text-white hover:bg-rose-700"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating your link...
                                </>
                            ) : canUnlock ? (
                                <>
                                    <Unlock size={18} />
                                    I Have Followed! (Generate Link)
                                </>
                            ) : hasVisitedIG ? (
                                <>
                                    <Lock size={18} />
                                    Unlocking in {countdown}s...
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Follow first to unlock
                                </>
                            )}
                        </button>
                    </div>

                    {/* Skip (for testing - can be removed in production) */}
                    <button
                        onClick={onClose}
                        className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm underline"
                    >
                        Maybe later
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
