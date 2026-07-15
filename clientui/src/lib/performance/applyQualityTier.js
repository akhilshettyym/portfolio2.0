import * as THREE from "three";

export const QUALITY_PRESETS = {
    tier_1: {
        pixelRatio: 1.35,
        antialias: true,
        enableShadows: true,
        shadowType: THREE.PCFSoftShadowMap,
        shadowMapSize: 1024,
        postprocessing: true,
        postprocessingQuality: "high",
        particleMultiplier: 1,
        particleQuality: "high",
        cloudPlanes: 3600,
        bubbleCollisionLimit: 34,
        socialTrailDistance: 110,
        socialTrailLifeMs: 780,
        animationFrameInterval: 1,
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
        cloudPlanes: 900,
        bubbleCollisionLimit: 12,
        socialTrailDistance: 150,
        socialTrailLifeMs: 520,
        animationFrameInterval: 4,
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

    renderer.sortObjects = tier === "tier_1";
    renderer.outputColorSpace = THREE.SRGBColorSpace;
}

export function getAnimationFrameInterval(tier) {
    const preset = getQualityPreset(tier);
    return preset.animationFrameInterval || 1;
}

export function getLODDistance(tier) {
    const preset = getQualityPreset(tier);
    return preset.lodDistance || 500;
}

export function shouldEnableAdvancedFeatures(tier) {
    return tier === "tier_1";
}

export function getParticleQuality(tier) {
    const preset = getQualityPreset(tier);
    return preset.particleQuality || "medium";
}

export function getPostprocessingQuality(tier) {
    const preset = getQualityPreset(tier);
    return preset.postprocessingQuality || "medium";
}