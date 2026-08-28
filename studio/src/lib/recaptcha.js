const SCRIPT_ID = "google-recaptcha-v3";

const loadRecaptcha = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) throw new Error("Security verification is not configured.");

  if (window.grecaptcha) return window.grecaptcha;

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    const script = existing || document.createElement("script");
    const timeout = window.setTimeout(() => reject(new Error("Security verification timed out.")), 8000);

    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;

    script.onload = () =>
      window.grecaptcha.ready(() => {
        window.clearTimeout(timeout);
        resolve(window.grecaptcha);
      });
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("Security verification failed."));
    };

    if (!existing) document.head.appendChild(script);
  });
};

export const getRecaptchaToken = async (action) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const recaptcha = await loadRecaptcha();
  return recaptcha.execute(siteKey, { action });
};
