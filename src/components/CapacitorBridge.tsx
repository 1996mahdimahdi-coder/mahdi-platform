"use client";

import { useEffect } from "react";
import { isCapacitor } from "@/lib/capacitor";

const NABDA_HOST = "nabda-dz.vercel.app";

function isInternalLink(href: string): boolean {
  try {
    if (href.startsWith("/") || href.startsWith("#")) return true;
    const url = new URL(href, window.location.origin);
    return url.hostname === NABDA_HOST || url.hostname === window.location.hostname;
  } catch {
    return false;
  }
}

export default function CapacitorBridge() {
  useEffect(() => {
    if (!isCapacitor()) return;

    import("@capgo/capacitor-social-login").then(({ SocialLogin }) => {
      fetch("/api/auth/config", { cache: "no-store" })
        .then((r) => r.json())
        .then((config) => {
          if (config.googleClientId) {
            SocialLogin.initialize({
              google: { webClientId: config.googleClientId },
            });
          }
        })
        .catch(() => {});
    });

    import("@capacitor/app").then(({ App }) => {
      App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
    });

    const originalOpen = window.open;
    window.open = function (
      url: string | URL,
      target?: string,
      features?: string
    ) {
      const href = typeof url === "string" ? url : url.href;

      if (isInternalLink(href)) {
        if (target === "_blank" || target === "_self" || !target) {
          window.location.href = href;
        }
        return null;
      }

      import("@capacitor/browser").then(({ Browser }) => {
        Browser.open({ url: href });
      });
      return null;
    } as typeof window.open;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const target = anchor.getAttribute("target");
      if (target !== "_blank") return;

      if (isInternalLink(href)) {
        e.preventDefault();
        window.location.href = href;
        return;
      }

      e.preventDefault();
      import("@capacitor/browser").then(({ Browser }) => {
        Browser.open({ url: href });
      });
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      window.open = originalOpen;
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}
