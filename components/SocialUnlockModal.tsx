"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Lock, Unlock, Loader2, ExternalLink, CheckCircle2, Circle } from "lucide-react";

interface SocialUnlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlock: () => void;
    isUploading: boolean;
}

const INSTAGRAM_URL = "https://instagram.com/syntaax.ai";

export function SocialUnlockModal({ isOpen, onClose, onUnlock, isUploading }: SocialUnlockModalProps) {
    const [hasVisitedIG, setHasVisitedIG] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setHasVisitedIG(false);
            setIsVerified(false);
        }
    }, [isOpen]);

    const handleFollowClick = () => {
        window.open(INSTAGRAM_URL, "_blank");
        setTimeout(() => setHasVisitedIG(true), 1000); // Small delay to feel natural
    };

    const canUnlock = isVerified;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                style={{ zIndex: 9999 }}
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
                            className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-3 shadow-lg group"
                        >
                            <Instagram size={22} className="group-hover:scale-110 transition-transform" />
                            Follow @syntaax.ai
                            <ExternalLink size={16} className="opacity-70" />
                        </button>

                        {/* Step 2: Verify Checkbox (Only appears after visiting) */}
                        <AnimatePresence>
                            {hasVisitedIG && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="overflow-hidden"
                                >
                                    <button
                                        onClick={() => setIsVerified(!isVerified)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-rose-500 hover:bg-rose-50 transition-colors text-left group"
                                    >
                                        {isVerified ? (
                                            <CheckCircle2 className="text-rose-500 shrink-0" size={24} />
                                        ) : (
                                            <Circle className="text-gray-300 group-hover:text-rose-500 shrink-0" size={24} />
                                        )}
                                        <div className="space-y-0.5">
                                            <p className={`text-sm font-medium ${isVerified ? "text-rose-700" : "text-gray-600"}`}>
                                                I confirm I have followed
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Honesty check! This keeps the app free ❤️
                                            </p>
                                        </div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Step 3: Unlock */}
                        <button
                            onClick={onUnlock}
                            disabled={!canUnlock || isUploading}
                            className={`w-full py-4 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2 ${canUnlock && !isUploading
                                ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg hover:shadow-rose-500/30"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
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
                                    Create My Link
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Locked
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
