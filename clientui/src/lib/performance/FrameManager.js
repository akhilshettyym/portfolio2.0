"use client";

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

class FrameManager {
    constructor(targetFps = 60, tier = 'tier_1') {
        this.targetFps = tier === 'tier_1' ? targetFps : tier === 'tier_2' ? 0 : 30;
        this.frameInterval = this.targetFps > 0 ? 1000 / this.targetFps : 0;
        this.tier = tier;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.shouldSkipFrameFlag = false;
    }

    shouldRender() {
        if (this.tier === 'tier_2') return false;

        const now = performance.now();
        if (now - this.lastFrameTime >= this.frameInterval) {
            this.lastFrameTime = now;
            this.frameCount++;
            return true;
        }
        return false;
    }

    shouldSkipFrame(skipInterval) {
        if (skipInterval === Infinity) return true;
        return this.frameCount % skipInterval !== 0;
    }

    reset() {
        this.lastFrameTime = 0;
        this.frameCount = 0;
    }

    getMetrics() {
        return {
            frameCount: this.frameCount,
            targetFps: this.targetFps,
            actualInterval: this.frameInterval,
            tier: this.tier,
        };
    }
}

export function createFrameLimitedLoop(callback, targetFps = 60, tier = 'tier_1') {
    const manager = new FrameManager(targetFps, tier);
    let animationFrameId = null;

    const loop = () => {
        if (manager.shouldRender()) {
            callback(manager);
        }
        animationFrameId = requestAnimationFrame(loop);
    };

    return {
        start: () => {
            animationFrameId = requestAnimationFrame(loop);
        },
        stop: () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        },
        manager,
    };
}

export function createPhysicsThrottler(interval = 4) {
    let frameCount = 0;

    return {
        shouldUpdate: () => {
            return frameCount++ % interval === 0;
        },
        reset: () => {
            frameCount = 0;
        },
    };
}

export function createRaycasterThrottler(maxFps = 30) {
    const frameInterval = 1000 / maxFps;
    let lastUpdateTime = 0;

    return {
        shouldUpdate: () => {
            const now = performance.now();
            if (now - lastUpdateTime >= frameInterval) {
                lastUpdateTime = now;
                return true;
            }
            return false;
        },
    };
}

export default FrameManager;