// const STORAGE_KEY = "tier";

// function safeWindow() {
//     return typeof window !== "undefined" ? window : undefined;
// }

// export function getSavedTier() {
//     try {
//         const w = safeWindow();
//         if (!w) return null;
//         const tier = w.localStorage.getItem(STORAGE_KEY);
//         if (tier === "tier_1" || tier === "tier_2") return tier;
//         return null;
//     } catch {
//         return null;
//     }
// }

// export function saveCalibration(tier) {
//     try {
//         const w = safeWindow();
//         if (w) w.localStorage.setItem(STORAGE_KEY, tier);
//     } catch {
//         // Ignore storage failures (e.g., incognito mode limits)
//     }
// }

// function createProbeCanvas() {
//     const w = safeWindow();
//     if (!w || !w.document) return null;
//     const canvas = w.document.createElement("canvas");
//     canvas.width = 1;
//     canvas.height = 1;
//     Object.assign(canvas.style, {
//         position: "fixed",
//         left: "-9999px",
//         opacity: "0",
//         pointerEvents: "none"
//     });
//     return canvas;
// }

// export function probeGPUInfo() {
//     const canvas = createProbeCanvas();
//     const fallback = {
//         vendor: "unknown",
//         renderer: "unknown",
//         maxTextureSize: 0,
//         hardwareConcurrency: typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 2 : 2,
//         isWebGL2Available: false,
//         caveatBlocked: true,
//     };
//     if (!canvas) return fallback;

//     let gl = null;
//     let caveatBlocked = false;
//     try {
//         gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
//             canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
//         if (!gl) return fallback;
//     } catch {
//         return fallback;
//     }

//     let vendor = "unknown";
//     let renderer = "unknown";
//     try {
//         const ext = gl.getExtension("WEBGL_debug_renderer_info");
//         if (ext) {
//             vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || "unknown";
//             renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "unknown";
//         }
//     } catch {
//         // Privacy settings blocked access
//     }

//     return {
//         vendor,
//         renderer,
//         maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0,
//         hardwareConcurrency: fallback.hardwareConcurrency,
//         isWebGL2Available: typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext,
//         caveatBlocked,
//     };
// }

// function classifyTier(gpu, fps) {
//     if (gpu.caveatBlocked) return "tier_2";
//     let score = 0;
//     const gpuText = `${gpu.vendor} ${gpu.renderer}`;

//     // High-End Match
//     if (/RTX|RX\s?(6|7)\d{3}|Radeon\s?Pro|M1\s?(Pro|Max|Ultra)|M2\s?(Pro|Max|Ultra)|M3|Apple\s?M\d\s?(Pro|Max|Ultra)/i.test(gpuText)) score += 35;
//     // Mid-Range Match
//     else if (/GTX|Radeon\s?Vega|Intel\s?Iris|Apple\s?M1|Apple\s?M2/i.test(gpuText)) score += 20;

//     if (gpu.maxTextureSize >= 8192) score += 10;
//     if (gpu.hardwareConcurrency >= 8) score += 5;
//     if (fps >= 55) score += 30;
//     else if (fps >= 45) score += 20;

//     return score >= 60 ? "tier_1" : "tier_2";
// }

// export async function benchmarkFps(drawFrame, durationMs = 5000) {
//     return new Promise((resolve) => {
//         let frames = 0;
//         let startedAt = 0;
//         const tick = (t) => {
//             if (!startedAt) startedAt = t;
//             drawFrame();
//             frames++;
//             const elapsed = t - startedAt;
//             if (elapsed >= durationMs) {
//                 resolve((frames * 1000) / Math.max(elapsed, 1));
//                 return;
//             }
//             requestAnimationFrame(tick);
//         };
//         requestAnimationFrame(tick);
//     });
// }

// export async function calibratePerformance(drawFrame, durationMs = 5000) {
//     const gpu = probeGPUInfo();
//     if (gpu.caveatBlocked) return "tier_2";
//     const fps = await benchmarkFps(drawFrame, durationMs);
//     return classifyTier(gpu, fps);
// }