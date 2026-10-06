import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cityCoordinates from "../data/city-coordinates.json";
import { cities, type City } from "../types/Event";

export type CityResolutionStatus = "loading" | "location-detected" | "geolocation-denied" | "city-selected" | "city-not-found";

type PreferredCityContextValue = {
  selectedCity: City;
  preferredCity: City | null;
  detectedCity: City | null;
  status: CityResolutionStatus;
  onboardingOpen: boolean;
  selectCity: (city: City, destinationPath?: string) => void;
  dismissOnboarding: () => void;
};

type CityCoordinates = { latitude: number; longitude: number; radiusKm: number };

const PreferredCityContext = createContext<PreferredCityContextValue | null>(null);
const PREFERRED_CITY_KEY = "plan-cerca.preferred-city";
const GEOLOCATION_ATTEMPTED_KEY = "plan-cerca.geolocation-attempted";
const GEOLOCATION_STATUS_KEY = "plan-cerca.geolocation-status";
const DETECTED_CITY_KEY = "plan-cerca.detected-city";
const ONBOARDING_DISMISSED_KEY = "plan-cerca.city-onboarding-dismissed";
const DEFAULT_CITY: City = cities[0] ?? "Madrid";

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The current session continues to work if browser storage is unavailable.
  }
}

function readCity(key: string): City | null {
  const value = readStorage(key);
  return value && (cities as string[]).includes(value) ? value as City : null;
}

function readStoredStatus(): CityResolutionStatus | null {
  const status = readStorage(GEOLOCATION_STATUS_KEY);
  return status === "geolocation-denied" || status === "city-not-found" || status === "location-detected" ? status : null;
}

function readInitialCity(): City {
  const savedCity = readCity(PREFERRED_CITY_KEY);
  if (savedCity) return savedCity;
  if (typeof window !== "undefined") {
    const routeCity = new URLSearchParams(window.location.search).get("city");
    if (routeCity && (cities as string[]).includes(routeCity)) return routeCity as City;
  }
  return DEFAULT_CITY;
}

function cityNearCoordinates(latitude: number, longitude: number): City | null {
  let nearest: { city: City; distance: number; radiusKm: number } | null = null;
  for (const city of cities) {
    const coordinates = cityCoordinates[city] as CityCoordinates | undefined;
    if (!coordinates) continue;
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    const latitudeDelta = toRadians(coordinates.latitude - latitude);
    const longitudeDelta = toRadians(coordinates.longitude - longitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(toRadians(latitude)) * Math.cos(toRadians(coordinates.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
    const distance = 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    if (!nearest || distance < nearest.distance) nearest = { city, distance, radiusKm: coordinates.radiusKm };
  }
  return nearest && nearest.distance <= nearest.radiusKm ? nearest.city : null;
}

export function PreferredCityProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [preferredCity, setPreferredCity] = useState<City | null>(() => readCity(PREFERRED_CITY_KEY));
  const [selectedCity, setSelectedCity] = useState<City>(readInitialCity);
  const [detectedCity, setDetectedCity] = useState<City | null>(() => readCity(DETECTED_CITY_KEY));
  const [status, setStatus] = useState<CityResolutionStatus>(() => {
    if (readCity(PREFERRED_CITY_KEY)) return "city-selected";
    const routeCity = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("city");
    return routeCity && (cities as string[]).includes(routeCity) ? "city-selected" : "loading";
  });
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const initialized = useRef(false);
  const pendingDestinationPath = useRef<string | null>(null);

  const syncCityInUrl = useCallback((city: City, replace = false, destinationPath = location.pathname) => {
    const params = new URLSearchParams(location.search);
    if (params.get("city") === city && destinationPath === location.pathname) return;
    params.set("city", city);
    navigate({ pathname: destinationPath, search: `?${params.toString()}` }, { replace });
  }, [location.pathname, location.search, navigate]);

  const removeCityFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    if (!params.has("city")) return;
    params.delete("city");
    navigate({ pathname: location.pathname, search: params.size ? `?${params.toString()}` : "" }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const selectCity = useCallback((city: City, destinationPath?: string) => {
    setPreferredCity(city);
    setSelectedCity(city);
    setDetectedCity(null);
    setStatus("city-selected");
    setOnboardingOpen(false);
    writeStorage(PREFERRED_CITY_KEY, city);
    writeStorage(GEOLOCATION_STATUS_KEY, "city-selected");
    try { window.localStorage.removeItem(DETECTED_CITY_KEY); } catch { /* Optional cached suggestion. */ }
    if (destinationPath) pendingDestinationPath.current = destinationPath;
    syncCityInUrl(city, false, destinationPath);
  }, [syncCityInUrl]);

  const dismissOnboarding = useCallback(() => {
    setOnboardingOpen(false);
    writeStorage(ONBOARDING_DISMISSED_KEY, "true");
  }, []);

  useEffect(() => {
    const routeCityValue = new URLSearchParams(location.search).get("city");
    const routeCity = routeCityValue && (cities as string[]).includes(routeCityValue) ? routeCityValue as City : null;
    const isEntityRoute = location.pathname.startsWith("/entity/") || location.pathname.startsWith("/artist/");

    if (isEntityRoute && routeCityValue) removeCityFromUrl();

    if (initialized.current) {
      if (pendingDestinationPath.current) {
        if (location.pathname === pendingDestinationPath.current && routeCity === preferredCity) {
          pendingDestinationPath.current = null;
        } else {
          return;
        }
      }
      if (isEntityRoute) return;
      if (preferredCity && routeCity !== preferredCity) syncCityInUrl(preferredCity, true);
      return;
    }
    initialized.current = true;

    const savedCity = readCity(PREFERRED_CITY_KEY);
    if (savedCity) {
      setPreferredCity(savedCity);
      setSelectedCity(savedCity);
      setStatus("city-selected");
      if (!isEntityRoute && routeCity !== savedCity) syncCityInUrl(savedCity, true);
      return;
    }

    if (routeCity) {
      selectCity(routeCity);
      return;
    }

    const dismissed = readStorage(ONBOARDING_DISMISSED_KEY) === "true";
    const attempted = readStorage(GEOLOCATION_ATTEMPTED_KEY) === "true";
    if (attempted) {
      const previousStatus = readStoredStatus() ?? "geolocation-denied";
      setStatus(previousStatus);
      setDetectedCity(readCity(DETECTED_CITY_KEY));
      setOnboardingOpen(!dismissed);
      return;
    }

    if (typeof window === "undefined" || !window.navigator.geolocation) {
      writeStorage(GEOLOCATION_ATTEMPTED_KEY, "true");
      writeStorage(GEOLOCATION_STATUS_KEY, "city-not-found");
      setStatus("city-not-found");
      setOnboardingOpen(!dismissed);
      return;
    }

    writeStorage(GEOLOCATION_ATTEMPTED_KEY, "true");
    setStatus("loading");
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        if (readCity(PREFERRED_CITY_KEY)) return;
        const city = cityNearCoordinates(position.coords.latitude, position.coords.longitude);
        setDetectedCity(city);
        const nextStatus = city ? "location-detected" : "city-not-found";
        setStatus(nextStatus);
        writeStorage(GEOLOCATION_STATUS_KEY, nextStatus);
        if (city) writeStorage(DETECTED_CITY_KEY, city);
        setOnboardingOpen(!dismissed);
      },
      (error) => {
        if (readCity(PREFERRED_CITY_KEY)) return;
        const nextStatus = error.code === error.PERMISSION_DENIED ? "geolocation-denied" : "city-not-found";
        setStatus(nextStatus);
        writeStorage(GEOLOCATION_STATUS_KEY, nextStatus);
        setOnboardingOpen(!dismissed);
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 8_000 },
    );
  }, [location.pathname, location.search, preferredCity, removeCityFromUrl, selectCity, syncCityInUrl]);

  const value = useMemo(() => ({ selectedCity, preferredCity, detectedCity, status, onboardingOpen, selectCity, dismissOnboarding }), [selectedCity, preferredCity, detectedCity, status, onboardingOpen, selectCity, dismissOnboarding]);
  return <PreferredCityContext.Provider value={value}>{children}</PreferredCityContext.Provider>;
}

export function usePreferredCity(): PreferredCityContextValue {
  const context = useContext(PreferredCityContext);
  if (!context) throw new Error("usePreferredCity must be used within PreferredCityProvider");
  return context;
}
