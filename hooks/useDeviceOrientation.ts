import { useState, useEffect } from "react";

interface DeviceOrientation {
    alpha: number; // Z-axis (0-360)
    beta: number;  // X-axis (-180 to 180, front-back tilt)
    gamma: number; // Y-axis (-90 to 90, left-right tilt)
}

/**
 * Hook to track device orientation on mobile devices.
 * Returns normalized tilt values for use in 3D transformations.
 */
export function useDeviceOrientation() {
    const [orientation, setOrientation] = useState<DeviceOrientation | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if DeviceOrientationEvent is available
        if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
            setIsSupported(true);

            const handleOrientation = (event: DeviceOrientationEvent) => {
                setOrientation({
                    alpha: event.alpha || 0,
                    beta: event.beta || 0,
                    gamma: event.gamma || 0,
                });
            };

            // Request permission on iOS 13+
            const requestPermission = async () => {
                if (
                    typeof (DeviceOrientationEvent as any).requestPermission === "function"
                ) {
                    try {
                        const permission = await (DeviceOrientationEvent as any).requestPermission();
                        if (permission === "granted") {
                            window.addEventListener("deviceorientation", handleOrientation);
                        }
                    } catch (err) {
                        console.warn("DeviceOrientation permission denied:", err);
                    }
                } else {
                    // Non-iOS or older iOS - just add listener
                    window.addEventListener("deviceorientation", handleOrientation);
                }
            };

            requestPermission();

            return () => {
                window.removeEventListener("deviceorientation", handleOrientation);
            };
        }
    }, []);

    // Normalize tilt values to a small range for subtle effect
    const tiltX = orientation ? Math.max(-15, Math.min(15, orientation.gamma * 0.3)) : 0;
    const tiltY = orientation ? Math.max(-15, Math.min(15, (orientation.beta - 45) * 0.3)) : 0;

    return {
        tiltX,
        tiltY,
        isSupported,
        raw: orientation,
    };
}
