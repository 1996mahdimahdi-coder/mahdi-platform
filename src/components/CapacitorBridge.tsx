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

async function setupPushNotifications() {
  try {
    const { PushNotifications } = await import(
      "@capacitor/push-notifications"
    );

    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== "granted") {
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener("registration", async (token) => {
      console.info("[Push] Registration token obtained");
      try {
        const { getCsrfToken } = await import("@/lib/clientCsrf");
        const csrf = await getCsrfToken();
        await fetch("/api/push/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(csrf ? { "x-csrf-token": csrf } : {}),
          },
          body: JSON.stringify({ token: token.value, platform: "android" }),
          credentials: "same-origin",
        });
        console.info("[Push] Token sent to server");
      } catch (e) {
        console.error("[Push] Failed to send token:", e);
      }
    });

    PushNotifications.addListener("registrationError", (err) => {
      console.error("[Push] Registration failed:", err.error);
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.info("[Push] Notification received:", notification.title);
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action) => {
        const data = action.notification.data;
        console.info("[Push] Notification tapped:", data);
        // TODO: deep link based on data.type + data.targetId
        if (data?.url) {
          window.location.href = data.url;
        }
      }
    );
  } catch (e) {
    console.error("[Push] Setup failed:", e);
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

    setupPushNotifications();

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
