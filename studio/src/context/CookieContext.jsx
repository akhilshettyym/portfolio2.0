"use client";

import { COOKIE_CONSENT } from "@/utils/storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const CookieContext = createContext(null);

export function CookieProvider({ children }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCookieBannerReady, setIsCookieBannerReady] = useState(false);

  const updateConsentState = useCallback((status) => {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];

    function gtag() {
      window.dataLayer.push(arguments);
    }

    const consentStatus = status === "granted" ? "granted" : "denied";

    gtag("consent", "update", {
      analytics_storage: consentStatus,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    window.dataLayer.push({
      event: "consent_status_updated",
      consent_status: consentStatus,
    });
  }, []);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT);

    if (storedConsent === "granted" || storedConsent === "denied") {
      setHasConsent(true);
      updateConsentState(storedConsent);
    }

    setIsInitialized(true);
  }, [updateConsentState]);

  const showCookieBanner = useCallback(() => {
    if (!isInitialized) return;

    const storedConsent = localStorage.getItem(COOKIE_CONSENT);

    if (storedConsent === "granted" || storedConsent === "denied") {
      setHasConsent(true);
      setIsCookieBannerReady(false);
      return;
    }

    setHasConsent(false);
    setIsCookieBannerReady(true);
  }, [isInitialized]);

  const hideCookieBanner = useCallback(() => {
    setIsCookieBannerReady(false);
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT, "granted");

    updateConsentState("granted");

    setHasConsent(true);
    setIsCookieBannerReady(false);
  }, [updateConsentState]);

  const handleDecline = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT, "denied");

    updateConsentState("denied");

    setHasConsent(true);
    setIsCookieBannerReady(false);
  }, [updateConsentState]);

  return (
    <CookieContext.Provider
      value={{
        isCookieBannerReady: isInitialized && isCookieBannerReady,
        hasConsent,
        showCookieBanner,
        hideCookieBanner,
        handleAccept,
        handleDecline,
        updateConsentState,
      }}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieContext);

  if (!context) {
    throw new Error("useCookieConsent must be used inside CookieProvider");
  }

  return context;
}
