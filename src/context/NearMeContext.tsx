import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { roundCoordinates, type Coordinates } from "../lib/geo";

export type NearMeStatus = "off" | "locating" | "ready" | "denied" | "unavailable";
export const RADIUS_OPTIONS = [null, 1, 5, 10, 25] as const;
export type Radius = (typeof RADIUS_OPTIONS)[number];

type NearMeValue = {
  status: NearMeStatus;
  /** Rounded position, kept in memory only for this visit (never stored or sent). */
  position: Coordinates | null;
  radiusKm: Radius;
  setRadiusKm: (radius: Radius) => void;
  /** Asks the browser for the location. Only called after the person presses the button. */
  request: () => void;
  stop: () => void;
};

const NearMeContext = createContext<NearMeValue | null>(null);
const TIMEOUT_MS = 10_000;

export function NearMeProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<NearMeStatus>("off");
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [radiusKm, setRadiusKm] = useState<Radius>(null);
  const attempt = useRef(0);

  const request = useCallback(() => {
    if (!window.navigator.geolocation) { setStatus("unavailable"); return; }
    const current = ++attempt.current;
    setStatus("locating");
    // The browser may never answer the permission prompt: give up after a while instead of spinning forever.
    const timer = window.setTimeout(() => { if (attempt.current === current) setStatus("unavailable"); }, TIMEOUT_MS);
    window.navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        window.clearTimeout(timer);
        if (attempt.current !== current) return;
        setPosition(roundCoordinates({ lat: coords.latitude, lng: coords.longitude }));
        setStatus("ready");
      },
      (error) => {
        window.clearTimeout(timer);
        if (attempt.current !== current) return;
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 8_000 },
    );
  }, []);

  const stop = useCallback(() => {
    attempt.current += 1;
    setPosition(null);
    setRadiusKm(null);
    setStatus("off");
  }, []);

  const value = useMemo(() => ({ status, position, radiusKm, setRadiusKm, request, stop }), [status, position, radiusKm, request, stop]);
  return <NearMeContext.Provider value={value}>{children}</NearMeContext.Provider>;
}

export function useNearMe(): NearMeValue {
  const context = useContext(NearMeContext);
  if (!context) throw new Error("useNearMe must be used within NearMeProvider");
  return context;
}
