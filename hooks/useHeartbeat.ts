import { useState, useEffect } from "react";

/**
 * useHeartbeat Control Hook
 * Triggers navigator.vibrate in a rhythmic heartbeat pattern
 * and returns a boolean state for UI synchronization.
 */
export function useHeartbeat(enabled: boolean = false) {
    const [beat, setBeat] = useState(false);

    useEffect(() => {
        if (!enabled || typeof navigator === "undefined") {
            setBeat(false);
            return;
        }

        // Heartbeat pattern: lub-dub
        // Vibrate 100ms, pause 30ms, vibrate 100ms, pause 1000ms (roughly)

        const interval = setInterval(() => {
            // Trigger vibration
            if (navigator.vibrate) {
                navigator.vibrate([100, 30, 100, 30]);
            }

            // Sync UI beat
            setBeat(true);
            setTimeout(() => setBeat(false), 200); // Visual Pulse duration

        }, 1200); // Loop every 1.2s

        return () => clearInterval(interval);
    }, [enabled]);

    return beat;
}
