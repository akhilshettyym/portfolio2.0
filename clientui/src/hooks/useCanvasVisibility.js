import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect canvas visibility in viewport and provide optimal frame rate
 * Returns visibility state and frame skip interval based on visibility percentage
 */
export function useCanvasVisibility(ref, tier = 'tier_1') {
    const [isVisible, setIsVisible] = useState(false);
    const [visibilityPercent, setVisibilityPercent] = useState(0);
    const observerRef = useRef(null);

    useEffect(() => {
        if (!ref?.current) return;

        const handleIntersection = (entries) => {
            const entry = entries[0];
            const percent = entry.intersectionRatio * 100;

            setVisibilityPercent(percent);
            setIsVisible(entry.isIntersecting && percent > 0);
        };

        observerRef.current = new IntersectionObserver(handleIntersection, {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '50px',
        });

        observerRef.current.observe(ref.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [ref]);

    // Determine frame skip interval based on visibility and tier
    const getFrameSkipInterval = () => {
        if (!isVisible) return Infinity; // Don't render at all

        if (visibilityPercent > 75) {
            // Fully visible - use full frame rate
            return tier === 'tier_1' ? 1 : (tier === 'tier_2' ? Infinity : 1);
        } else if (visibilityPercent > 50) {
            // Mostly visible - every other frame
            return tier === 'tier_1' ? 2 : Infinity;
        } else if (visibilityPercent > 25) {
            // Partially visible - render every 4 frames
            return tier === 'tier_1' ? 4 : Infinity;
        } else {
            // Barely visible - render every 8 frames
            return tier === 'tier_1' ? 8 : Infinity;
        }
    };

    return {
        isVisible,
        visibilityPercent,
        frameSkipInterval: getFrameSkipInterval(),
    };
}