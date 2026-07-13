"use client"; // Critical: Required because this file uses React hooks

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

/**
 * Frame management utilities for optimized canvas rendering
 * Handles frame rate limiting, skipping, and visibility-based rendering
 */
class FrameManager {
    constructor(targetFps = 60, tier = 'tier_1') {
        this.targetFps = tier === 'tier_1' ? targetFps : tier === 'tier_2' ? 0 : 30;
        this.frameInterval = this.targetFps > 0 ? 1000 / this.targetFps : 0;
        this.tier = tier;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.shouldSkipFrameFlag = false;
    }

    /**
     * Check if frame should be rendered based on time elapsed
     */
    shouldRender() {
        if (this.tier === 'tier_2') return false; // Tier 2 only renders once

        const now = performance.now();
        if (now - this.lastFrameTime >= this.frameInterval) {
            this.lastFrameTime = now;
            this.frameCount++;
            return true;
        }
        return false;
    }

    /**
     * Skip rendering every Nth frame
     */
    shouldSkipFrame(skipInterval) {
        if (skipInterval === Infinity) return true;
        return this.frameCount % skipInterval !== 0;
    }

    /**
     * Reset frame counter
     */
    reset() {
        this.lastFrameTime = 0;
        this.frameCount = 0;
    }

    /**
     * Get current performance metrics
     */
    getMetrics() {
        return {
            frameCount: this.frameCount,
            targetFps: this.targetFps,
            actualInterval: this.frameInterval,
            tier: this.tier,
        };
    }
}

/**
 * Create a frame-limited animation loop
 */
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

/**
 * Throttle collision detection and physics calculations
 */
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

/**
 * Throttle raycaster updates
 */
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