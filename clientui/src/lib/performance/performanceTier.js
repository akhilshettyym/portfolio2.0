export const PERFORMANCE_TIER_STORAGE_KEY = "performance_tier";
export const LEGACY_PERFORMANCE_TIER_STORAGE_KEY = "tier";
export const PERFORMANCE_TIER_EVENT = "performance-tier-change";
export const PERFORMANCE_TIERS = { HIGH: "tier_1", LOW: "tier_2" };

function safeWindow() {
    return typeof window !== "undefined" ? window : undefined;
}

export function isValidTier(tier) {
    return tier === PERFORMANCE_TIERS.HIGH || tier === PERFORMANCE_TIERS.LOW;
}

export function getSavedTier() {
    try {
        const w = safeWindow();
        if (!w) return null;

        const stored =
            w.localStorage.getItem(PERFORMANCE_TIER_STORAGE_KEY) ||
            w.localStorage.getItem(LEGACY_PERFORMANCE_TIER_STORAGE_KEY);

        return isValidTier(stored) ? stored : null;
    } catch {
        return null;
    }
}

export function savePerformanceTier(tier) {
    if (!isValidTier(tier)) return;

    try {
        const w = safeWindow();
        if (!w) return;

        w.localStorage.setItem(PERFORMANCE_TIER_STORAGE_KEY, tier);
        w.localStorage.setItem(LEGACY_PERFORMANCE_TIER_STORAGE_KEY, tier);
        w.dispatchEvent(new CustomEvent(PERFORMANCE_TIER_EVENT, { detail: tier }));
    } catch {
        // Storage can fail in private windows. The app can still run with memory state.
    }
}

function getConnectionScore() {
    const connection =
        typeof navigator !== "undefined"
            ? navigator.connection || navigator.mozConnection || navigator.webkitConnection
            : null;

    if (!connection) return 8;
    if (connection.saveData) return -15;
    if (/(^|-)2g$/.test(connection.effectiveType || "")) return -10;
    if (connection.downlink && connection.downlink < 2) return -5;
    return 8;
}

export function probeGPUInfo() {
    const fallback = {
        vendor: "unknown",
        renderer: "unknown",
        maxTextureSize: 0,
        hardwareConcurrency:
            typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 2 : 2,
        deviceMemory:
            typeof navigator !== "undefined" && navigator.deviceMemory
                ? navigator.deviceMemory
                : 4,
        isWebGL2Available: false,
        caveatBlocked: true,
    };

    const w = safeWindow();
    if (!w?.document) return fallback;

    const canvas = w.document.createElement("canvas");
    let gl = null;

    try {
        gl =
            canvas.getContext("webgl2", {
                failIfMajorPerformanceCaveat: true,
                powerPreference: "high-performance",
            }) ||
            canvas.getContext("webgl", {
                failIfMajorPerformanceCaveat: true,
                powerPreference: "high-performance",
            });
    } catch {
        return fallback;
    }

    if (!gl) return fallback;

    let vendor = "unknown";
    let renderer = "unknown";

    try {
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        if (ext) {
            vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || vendor;
            renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || renderer;
        }
    } catch {
        // Browser privacy settings can block unmasked GPU details.
    }

    const info = {
        ...fallback,
        vendor,
        renderer,
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0,
        isWebGL2Available:
            typeof WebGL2RenderingContext !== "undefined" &&
            gl instanceof WebGL2RenderingContext,
        caveatBlocked: false,
    };

    const loseContext = gl.getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
    canvas.remove();

    return info;
}

function runCpuSample(durationMs = 90) {
    const startedAt = performance.now();
    let iterations = 0;
    let value = 0;

    while (performance.now() - startedAt < durationMs) {
        value += Math.sqrt(iterations % 997);
        iterations += 1;
    }

    return iterations / Math.max(performance.now() - startedAt, 1);
}

export function benchmarkAnimationFrame(durationMs = 850) {
    return new Promise((resolve) => {
        const samples = [];
        let frames = 0;
        let last = 0;
        let startedAt = 0;

        const tick = (time) => {
            if (!startedAt) {
                startedAt = time;
                last = time;
            }

            frames += 1;
            samples.push(time - last);
            last = time;

            if (time - startedAt >= durationMs) {
                const elapsed = Math.max(time - startedAt, 1);
                const sorted = [...samples].sort((a, b) => a - b);
                const p95 = sorted[Math.floor(sorted.length * 0.95)] || 16.7;

                resolve({
                    fps: (frames * 1000) / elapsed,
                    p95FrameMs: p95,
                });
                return;
            }

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    });
}

export function classifyPerformanceTier({ gpu, fps, p95FrameMs, cpuOps }) {
    if (gpu.caveatBlocked) return PERFORMANCE_TIERS.LOW;

    let score = 0;
    const gpuText = `${gpu.vendor} ${gpu.renderer}`;

    if (
        /RTX\s?(40|50)|RX\s?(7[56]|8\d{2})|Radeon\s?Pro|Arc\s?(A|B)[12]\d|M[3-4]\s?(Pro|Max|Ultra)|Apple\s?M[3-4]|Apple\s?M\d\s?(Pro|Max|Ultra)|A17|A18/i.test(
            gpuText,
        )
    ) {
        score += 36;
    } else if (
        /RTX\s?30|RX\s?(6[67]\d{2}|5700)|GTX\s?1080|Vega|Iris\s?Xe|Apple\s?M1|Apple\s?M2|Adreno\s?8[78]|Mali.*G7[78]/i.test(gpuText)
    ) {
        score += 24;
    } else if (/GTX|Radeon\s?RX\s?5\d{3}|Iris|Apple\s?M1|Adreno\s?[67]\d/i.test(gpuText)) {
        score += 14;
    } else if (/Intel|UHD|HD Graphics|Mali|Adreno/i.test(gpuText)) {
        score += 6;
    }

    if (gpu.isWebGL2Available) score += 10;
    if (gpu.maxTextureSize >= 8192) score += 12;
    else if (gpu.maxTextureSize >= 4096) score += 6;

    if (gpu.hardwareConcurrency >= 8) score += 12;
    else if (gpu.hardwareConcurrency >= 4) score += 6;

    if (gpu.deviceMemory >= 8) score += 10;
    else if (gpu.deviceMemory >= 4) score += 5;
    else score -= 8;

    if (fps >= 56 && p95FrameMs <= 24) score += 22;
    else if (fps >= 48 && p95FrameMs <= 32) score += 12;
    else score -= 12;

    if (cpuOps >= 36000) score += 10;
    else if (cpuOps >= 22000) score += 5;
    else score -= 8;

    score += getConnectionScore();

    return score >= 50 ? PERFORMANCE_TIERS.HIGH : PERFORMANCE_TIERS.LOW;
}

export async function calibratePerformance() {
    if (typeof window === "undefined" || typeof performance === "undefined") {
        return PERFORMANCE_TIERS.LOW;
    }

    const gpu = probeGPUInfo();
    const [frameStats, cpuOps] = await Promise.all([
        benchmarkAnimationFrame(),
        new Promise((resolve) => {
            window.setTimeout(() => resolve(runCpuSample()), 80);
        }),
    ]);

    return classifyPerformanceTier({
        gpu,
        cpuOps,
        fps: frameStats.fps,
        p95FrameMs: frameStats.p95FrameMs,
    });
}