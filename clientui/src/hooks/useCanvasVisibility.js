import { useEffect, useRef, useState } from 'react';

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

    const getFrameSkipInterval = () => {
        if (!isVisible) return Infinity;

        if (visibilityPercent > 75) {
            return tier === 'tier_1' ? 1 : (tier === 'tier_2' ? Infinity : 1);

        } else if (visibilityPercent > 50) {
            return tier === 'tier_1' ? 2 : Infinity;

        } else if (visibilityPercent > 25) {
            return tier === 'tier_1' ? 4 : Infinity;

        } else {
            return tier === 'tier_1' ? 8 : Infinity;
        }
    };

    return {
        isVisible,
        visibilityPercent,
        frameSkipInterval: getFrameSkipInterval(),
    };
}