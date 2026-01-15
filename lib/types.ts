export interface Slide {
    id: string;
    image: string; // URL or base64
    text: string;
}

export type ThemeType = "midnight-noir" | "rose-gold" | "cyber-blue";

export interface ProposalData {
    partnerName: string;
    introMessage?: string; // The "Prologue" poem/intro text
    slides: Slide[];
    theme?: ThemeType;
}

// Theme filter CSS classes
export const themeFilters: Record<ThemeType, string> = {
    "midnight-noir": "grayscale brightness-90 contrast-125",
    "rose-gold": "sepia saturate-150 hue-rotate-[-30deg]",
    "cyber-blue": "contrast-110 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]",
};

export const themeOverlays: Record<ThemeType, string> = {
    "midnight-noir": "bg-gradient-to-t from-black/30 to-transparent mix-blend-hard-light",
    "rose-gold": "bg-gradient-to-t from-rose-500/30 to-transparent",
    "cyber-blue": "border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]",
};

export const themeLabels: Record<ThemeType, string> = {
    "midnight-noir": "Midnight Noir",
    "rose-gold": "Rose Gold",
    "cyber-blue": "Cyber Blue",
};
