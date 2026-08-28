const DEFAULT_TIMEOUT_MS = 4000;
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const allowedHostnames = () =>
  (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);

export const verifyRecaptchaToken = async ({ token, remoteIp, expectedAction, route }) => {
  if (!token || typeof token !== "string" || token.length > 4096) {
    return { ok: false, reason: "missing_or_malformed" };
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.error("reCAPTCHA configuration missing", { route });
    return { ok: false, reason: "configuration" };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const body = new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: token });

    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    if (!response.ok) return { ok: false, reason: "verification_unavailable" };

    const result = await response.json();
    const hosts = allowedHostnames();
    const hostname = String(result.hostname || "").toLowerCase();
    const minScore = Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE || "0.5");
    const hostnameValid = hosts.length === 0 ? process.env.NODE_ENV !== "production" : hosts.includes(hostname);
    const ok =
      result.success === true && result.action === expectedAction && Number(result.score) >= minScore && hostnameValid;

    console.info("reCAPTCHA verification", {
      route,
      ok,
      score: result.score,
      action: result.action,
      hostname,
      reason: ok ? undefined : result["error-codes"]?.[0] || "policy",
    });

    return { ok, reason: ok ? undefined : "rejected" };
  } catch (error) {
    console.error("reCAPTCHA verification failed", {
      route,
      reason: error.name === "AbortError" ? "timeout" : "network",
    });
    return { ok: false, reason: "verification_unavailable" };
  } finally {
    clearTimeout(timeoutId);
  }
};

export const recaptchaErrorResponse = (res, reason) =>
  res.status(reason === "verification_unavailable" || reason === "configuration" ? 503 : 400).json({
    success: false,
    message: "Unable to verify this submission. Please try again.",
  });

export default verifyRecaptchaToken;
