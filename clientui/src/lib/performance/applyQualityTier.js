import * as THREE from "three";

export const QUALITY_PRESETS = {
    tier_1: {
        pixelRatio: 1.75,
        antialias: true,
        enableShadows: true,
        shadowType: THREE.PCFSoftShadowMap,
        shadowMapSize: 2048,
        postprocessing: true,
        postprocessingQuality: "high", // high, medium, low
        particleMultiplier: 1,
        particleQuality: "ultra", // ultra, high, medium, low
        cloudPlanes: 8000,
        bubbleCollisionLimit: 42,
        socialTrailDistance: 86,
        socialTrailLifeMs: 950,
        animationFrameInterval: 1, // every frame
        lodDistance: 500,
        lodBias: 0,
    },
    tier_2: {
        pixelRatio: 1,
        antialias: false,
        enableShadows: false,
        shadowType: THREE.BasicShadowMap,
        shadowMapSize: 512,
        postprocessing: false,
        postprocessingQuality: "low",
        particleMultiplier: 0.45,
        particleQuality: "low",
        cloudPlanes: 2400,
        bubbleCollisionLimit: 22,
        socialTrailDistance: 150,
        socialTrailLifeMs: 520,
        animationFrameInterval: 2, // every other frame
        lodDistance: 250,
        lodBias: 1,
    },
};

export function getQualityPreset(tier) {
    return QUALITY_PRESETS[tier] || QUALITY_PRESETS.tier_2;
}

export function getRendererPixelRatio(tier, capOverride) {
    const preset = getQualityPreset(tier);
    const cap = capOverride ?? preset.pixelRatio;

    if (typeof window === "undefined") return 1;
    return Math.min(window.devicePixelRatio || 1, cap);
}

export function configureRendererForTier(renderer, tier, capOverride) {
    if (!renderer) return;

    const preset = getQualityPreset(tier);
    renderer.setPixelRatio(getRendererPixelRatio(tier, capOverride));
    renderer.shadowMap.enabled = preset.enableShadows;
    renderer.shadowMap.type = preset.shadowType;

    if (preset.shadowMapSize && renderer.shadowMap.enabled) {
        renderer.shadowMap.mapSize.width = preset.shadowMapSize;
        renderer.shadowMap.mapSize.height = preset.shadowMapSize;
    }

    renderer.sortObjects = tier === "tier_1"; // Optimize state changes on tier_2
    renderer.outputColorSpace = THREE.SRGBColorSpace;
}

/**
 * Get animation frame interval for tier-aware throttling
 * Returns the number of frames to skip
 */
export function getAnimationFrameInterval(tier) {
    const preset = getQualityPreset(tier);
    return preset.animationFrameInterval || 1;
}

/**
 * Get LOD (Level of Detail) distance for model simplification
 */
export function getLODDistance(tier) {
    const preset = getQualityPreset(tier);
    return preset.lodDistance || 500;
}

/**
 * Check if advanced features should be enabled
 */
export function shouldEnableAdvancedFeatures(tier) {
    return tier === "tier_1";
}

/**
 * Get particle system quality preset
 */
export function getParticleQuality(tier) {
    const preset = getQualityPreset(tier);
    return preset.particleQuality || "medium";
}

/**
 * Get post-processing quality level
 */
export function getPostprocessingQuality(tier) {
    const preset = getQualityPreset(tier);
    return preset.postprocessingQuality || "medium";
}