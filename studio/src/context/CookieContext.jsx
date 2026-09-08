"use client";

import { COOKIE_CONSENT } from "@/utils/storage";
import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";

const CookieContext = createContext(null);

const subscribe = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getConsentSnapshot = () => localStorage.getItem(COOKIE_CONSENT);
const getServerConsentSnapshot = () => null;

const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;
const emptySubscribe = () => () => {};

export function CookieProvider({ children }) {
  // Synchronize directly with localStorage without triggering setState in effects
  const storedConsent = useSyncExternalStore(subscribe, getConsentSnapshot, getServerConsentSnapshot);

  const isMounted = useSyncExternalStore(emptySubscribe, getMountedSnapshot, getServerMountedSnapshot);

  const [isCookieBannerReady, setIsCookieBannerReady] = useState(false);

  // Derived state from external store snapshot
  const hasConsent = storedConsent === "granted" || storedConsent === "denied";

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

  // Effect only interacts with the external system (GTag) - no React setState inside
  useEffect(() => {
    if (storedConsent === "granted" || storedConsent === "denied") {
      updateConsentState(storedConsent);
    }
  }, [storedConsent, updateConsentState]);

  const showCookieBanner = useCallback(() => {
    const currentConsent = localStorage.getItem(COOKIE_CONSENT);

    if (currentConsent === "granted" || currentConsent === "denied") {
      setIsCookieBannerReady(false);
      return;
    }

    setIsCookieBannerReady(true);
  }, []);

  const hideCookieBanner = useCallback(() => {
    setIsCookieBannerReady(false);
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT, "granted");
    window.dispatchEvent(new Event("storage"));
    updateConsentState("granted");
    setIsCookieBannerReady(false);
  }, [updateConsentState]);

  const handleDecline = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT, "denied");
    window.dispatchEvent(new Event("storage"));
    updateConsentState("denied");
    setIsCookieBannerReady(false);
  }, [updateConsentState]);

  return (
    <CookieContext.Provider
      value={{
        isCookieBannerReady: isMounted && isCookieBannerReady,
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
