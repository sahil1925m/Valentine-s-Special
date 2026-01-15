"use client";

import React from "react";
import { Slide } from "@/lib/types";

interface OverlayProps {
    slides: Slide[];
}

// Simplified Overlay - Just provides scroll height for the tunnel
// Text is now rendered directly on images in ScrollyCanvas
export function Overlay({ slides }: OverlayProps) {
    return (
        <div className="relative z-10 w-full pointer-events-none">
            {/* Create scroll height based on number of slides */}
            {slides.map((slide) => (
                <div key={slide.id} className="h-screen" />
            ))}
            {/* Extra spacer for smooth ending */}
            <div className="h-screen" />
        </div>
    );
}
