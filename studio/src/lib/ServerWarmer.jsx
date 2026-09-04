"use client";

import { useEffect } from "react";
import { WARM_SERVER } from "@/utils/storage";

const WARMUP_TIMEOUT = 15000;
const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const WARMUP_ENDPOINT = SERVER_URL ? `${SERVER_URL.replace(/\/$/, "")}/ping` : null;

export default function ServerWarmer() {
  useEffect(() => {
    const hasPinged = localStorage.getItem(WARM_SERVER);
    if (hasPinged === "true") {
      return;
    }

    if (!WARMUP_ENDPOINT) {
      if (process.env.NODE_ENV === "development") {
        console.warn("ServerWarmer: NEXT_PUBLIC_API_BASE_URL is not configured.");
      }
      return;
    }

    localStorage.setItem(WARM_SERVER, "true");

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, WARMUP_TIMEOUT);

    const warmServer = async () => {
      try {
        await fetch(WARMUP_ENDPOINT, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development" && error?.name !== "AbortError") {
          console.debug("Server warm-up request failed:", error);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    warmServer();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return null;
}
