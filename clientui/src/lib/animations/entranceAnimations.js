export const ENTRANCE_VARIANTS = {
    fadeScale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
    },

    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    },

    slideLeft: {
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
    },

    slideRight: {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 40 },
    },

    blurFade: {
        initial: { opacity: 0, filter: "blur(12px)" },
        animate: { opacity: 1, filter: "blur(0px)" },
        exit: { opacity: 0, filter: "blur(12px)" },
    },

    rotateScale: {
        initial: { opacity: 0, scale: 0.8, rotate: -10 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
        exit: { opacity: 0, scale: 0.8, rotate: -10 },
    },
};

export function getTransitionForTier(tier, baseConfig = {}) {
    const isTier2 = tier === "tier_2";

    return {
        duration: isTier2 ? 0.3 : 0.6,
        ease: [0.22, 1, 0.36, 1],
        ...baseConfig,
    };
}

export function getStaggerConfig(tier) {
    const isTier2 = tier === "tier_2";

    return {
        staggerChildren: isTier2 ? 0.04 : 0.08,
        delayChildren: isTier2 ? 0 : 0.1,
    };
}

export function getViewportConfig(tier) {
    const isTier2 = tier === "tier_2";

    return {
        once: true,
        amount: isTier2 ? 0.3 : 0.2,
    };
}

export function getHoverConfig(tier, customConfig = {}) {
    const isTier2 = tier === "tier_2";

    if (isTier2) {
        return undefined;
    }

    return {
        scale: 1.05,
        transition: { duration: 0.2 },
        ...customConfig,
    };
}