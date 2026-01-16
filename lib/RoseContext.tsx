"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface RoseContextType {
    rosesCollected: number;
    collectRose: () => void;
}

const RoseContext = createContext<RoseContextType | undefined>(undefined);

export function RoseProvider({ children }: { children: ReactNode }) {
    const [rosesCollected, setRosesCollected] = useState(0);

    const collectRose = () => {
        setRosesCollected(prev => prev + 1);
    };

    return (
        <RoseContext.Provider value={{ rosesCollected, collectRose }}>
            {children}

            {/* Fixed Counter */}
            {rosesCollected > 0 && (
                <div className="fixed top-4 right-4 z-[50] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-pink-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <span className="text-xl">🌹</span>
                    <span className="font-bold text-rose-600 font-mono text-lg">{rosesCollected}</span>
                </div>
            )}
        </RoseContext.Provider>
    );
}

export function useRoseStore() {
    const context = useContext(RoseContext);
    // Return safe defaults if used outside of RoseProvider
    // This allows components like FinalBouquet to work on pages without gamification
    if (context === undefined) {
        return { rosesCollected: 0, collectRose: () => { } };
    }
    return context;
}
