const isCapacitor = (): boolean => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    ua.includes("Capacitor") ||
    window.location.protocol === "capacitor:" ||
    window.location.protocol === "ionic:" ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor !== undefined
  );
};

const isNative = (): boolean => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return (
    ua.includes("Capacitor") ||
    ua.includes("Android") ||
    window.location.protocol === "capacitor:" ||
    window.location.protocol === "ionic:"
  );
};

export { isCapacitor, isNative };
