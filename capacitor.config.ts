import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dz.nabda.app",
  appName: "NABDA",
  webDir: "public",
  server: {
    url: "https://nabda-dz.vercel.app",
    androidScheme: "https",
    cleartext: false,
    allowNavigation: ["*.vercel.app", "*.nabda-dz.vercel.app"],
  },
  android: {
    backgroundColor: "#f8fafc",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: "NABDA/1.0",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0f172a",
    },
    SocialLogin: {
      providers: {
        google: true,
        facebook: false,
        apple: false,
        twitter: false,
      },
      logLevel: 1,
    },
  },
};

export default config;
