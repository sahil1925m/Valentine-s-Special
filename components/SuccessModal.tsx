"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, X, ExternalLink, MessageCircle } from "lucide-react";
import { useState } from "react";

interface SuccessModalProps {
    proposalId: string;
    onClose: () => void;
}

export function SuccessModal({ proposalId, onClose }: SuccessModalProps) {
    const [copied, setCopied] = useState(false);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const proposalLink = `${baseUrl}/p/${proposalId}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(proposalLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleWhatsAppShare = () => {
        const message = encodeURIComponent(
            `I made something special for you... 💕\n\nOpen this on your phone: ${proposalLink}`
        );
        window.open(`https://wa.me/?text=${message}`, "_blank");
    };

    const handlePreview = () => {
        window.open(proposalLink, "_blank");
    };

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
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="text-green-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Proposal Created!</h2>
                        <p className="text-gray-500 mt-1">Your love story is ready to be shared.</p>
                    </div>

                    {/* Link Display */}
                    <div className="bg-gray-100 rounded-lg p-3 mb-6 flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={proposalLink}
                            className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
                        />
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleCopyLink}
                            className="w-full py-3 px-4 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition flex items-center justify-center gap-2"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? "Copied!" : "Copy Link"}
                        </button>

                        <button
                            onClick={handleWhatsAppShare}
                            className="w-full py-3 px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={18} />
                            Share on WhatsApp
                        </button>

                        <button
                            onClick={handlePreview}
                            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={18} />
                            Preview
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
