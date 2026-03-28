"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Route, Station } from "@/types";
import { useTranslation } from "@/i18n";

interface Props {
  route: Route;
  index: number;
  children: React.ReactNode;
}

// Haversine distance in meters
function distMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Project a point onto a line segment, return fraction [0, 1]
function projectOntoSegment(
  lat: number, lng: number,
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const dx = lat2 - lat1;
  const dy = lng2 - lng1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return 0;
  const t = ((lat - lat1) * dx + (lng - lng1) * dy) / lenSq;
  return Math.max(0, Math.min(1, t));
}

function computeCumulativeDistances(stations: Station[]): number[] {
  const cum: number[] = [0];
  for (let i = 1; i < stations.length; i++) {
    const prev = stations[i - 1].coordinates;
    const curr = stations[i].coordinates;
    cum.push(cum[i - 1] + distMeters(prev.lat, prev.lng, curr.lat, curr.lng));
  }
  return cum;
}

/**
 * Find the best matching progress along the route.
 * When `allowBackward` is true, the full route is scanned (used when GPS accuracy improves significantly).
 * Otherwise, enforces monotonic forward progress from `minProgress`.
 */
function computeRouteProgress(
  lat: number, lng: number,
  stations: Station[],
  minProgress: number,
  allowBackward: boolean,
): number {
  let bestProgress = allowBackward ? 0 : minProgress;
  let bestDist = Infinity;

  const startIdx = allowBackward ? 0 : Math.max(0, Math.floor(minProgress) - 1);

  for (let i = startIdx; i < stations.length - 1; i++) {
    const s1 = stations[i].coordinates;
    const s2 = stations[i + 1].coordinates;
    const frac = projectOntoSegment(lat, lng, s1.lat, s1.lng, s2.lat, s2.lng);
    const projLat = s1.lat + frac * (s2.lat - s1.lat);
    const projLng = s1.lng + frac * (s2.lng - s1.lng);
    const d = distMeters(lat, lng, projLat, projLng);
    const progress = i + frac;

    if (allowBackward) {
      if (d < bestDist) { bestDist = d; bestProgress = progress; }
    } else {
      if (progress >= minProgress - 0.5 && d < bestDist) {
        bestDist = d;
        bestProgress = Math.max(progress, minProgress);
      }
    }
  }

  // Check last station
  const last = stations[stations.length - 1].coordinates;
  const lastDist = distMeters(lat, lng, last.lat, last.lng);
  if (lastDist < bestDist) {
    const lastProg = stations.length - 1;
    if (allowBackward || lastProg >= minProgress) {
      bestProgress = lastProg;
    }
  }

  return bestProgress;
}

function computeCumulativeTimes(route: Route, stationCount: number): number[] {
  const times: number[] = [0];
  for (const seg of route.segments) {
    const segStations = seg.intermediateStations.length + 2;
    const timePerStation = seg.durationMinutes / (segStations - 1);
    for (let i = 1; i < segStations; i++) {
      times.push(times[times.length - 1] + timePerStation);
    }
  }
  while (times.length < stationCount) {
    times.push(times[times.length - 1]);
  }
  return times;
}

export default function RouteCardWithTracking({ route, children }: Props) {
  const { t } = useTranslation();
  const [tracking, setTracking] = useState(false);
  const [progress, setProgress] = useState(-1);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsWaiting, setGpsWaiting] = useState(false); // waiting for accurate signal
  const [error, setError] = useState<string | null>(null);
  const [notified, setNotified] = useState(false);
  const [gpsStale, setGpsStale] = useState(false);
  const watchRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const progressRef = useRef(-1);
  const progressAccuracyRef = useRef(Infinity); // accuracy of the reading that set current progress
  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackingRef = useRef(false); // to check in async callbacks

  // Build flat station list
  const allStations = useMemo(() => {
    const stations: Station[] = [];
    for (let i = 0; i < route.segments.length; i++) {
      const seg = route.segments[i];
      if (i === 0) stations.push(seg.fromStation);
      stations.push(...seg.intermediateStations);
      stations.push(seg.toStation);
    }
    return stations;
  }, [route]);

  const destName = allStations[allStations.length - 1]?.name.th ?? "";
  const cumDist = useMemo(() => computeCumulativeDistances(allStations), [allStations]);
  const cumTime = useMemo(() => computeCumulativeTimes(route, allStations.length), [route, allStations.length]);

  const nearestIdx = progress >= 0 ? Math.round(progress) : -1;

  const estimatedRemainingMin = progress >= 0
    ? Math.max(0, cumTime[cumTime.length - 1] - (
        cumTime[Math.floor(progress)] +
        (progress % 1) * ((cumTime[Math.ceil(progress)] ?? cumTime[Math.floor(progress)]) - cumTime[Math.floor(progress)])
      ))
    : null;

  // ---- Wake Lock ----
  const acquireWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => { wakeLockRef.current = null; });
      }
    } catch { /* non-critical */ }
  }, []);

  const releaseWakeLock = useCallback(() => {
    wakeLockRef.current?.release();
    wakeLockRef.current = null;
  }, []);

  // ---- Stale timer ----
  const resetStaleTimer = useCallback(() => {
    if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    setGpsStale(false);
    staleTimerRef.current = setTimeout(() => setGpsStale(true), 15_000); // 15s = stale
  }, []);

  // ---- Clear GPS watch ----
  const clearWatch = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
  }, []);

  // ---- Start GPS watch ----
  const startWatch = useCallback(() => {
    clearWatch();
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (!trackingRef.current) return;
        const { latitude, longitude, accuracy } = pos.coords;
        resetStaleTimer();
        setGpsAccuracy(Math.round(accuracy));

        // If accuracy is terrible (> 500m), show waiting but still try to update
        // Only fully skip if > 1000m — completely useless
        if (accuracy > 1000) {
          setGpsWaiting(true);
          return;
        }

        setGpsWaiting(false);

        // Determine whether to allow backward correction:
        // 1. First reading (progress == -1): always allow full scan
        // 2. New reading is significantly more accurate than the one that set progress: recalculate
        // 3. Otherwise: enforce monotonic forward
        const isFirstReading = progressRef.current < 0;
        const isMuchMoreAccurate = accuracy < progressAccuracyRef.current * 0.5; // 2x better accuracy
        const allowBackward = isFirstReading || isMuchMoreAccurate;

        const newProgress = computeRouteProgress(
          latitude, longitude,
          allStations,
          progressRef.current,
          allowBackward,
        );

        // Update progress and record the accuracy that produced it
        if (newProgress !== progressRef.current || allowBackward) {
          progressRef.current = newProgress;
          progressAccuracyRef.current = accuracy;
          setProgress(newProgress);
        }

        // Notify near destination
        if (newProgress >= allStations.length - 2) {
          setNotified((prev) => {
            if (!prev && "Notification" in window && Notification.permission === "granted") {
              new Notification("Thai Transit", {
                body: t("tracking.arriving", { station: destName }),
                icon: "/skytrain.png",
              });
            }
            return true;
          });
        }
      },
      (err) => {
        if (!trackingRef.current) return;
        if (err.code === 2 || err.code === 3) {
          // Position unavailable or timeout — don't stop, restart
          setGpsStale(true);
          clearWatch();
          setTimeout(() => {
            if (trackingRef.current) startWatch();
          }, 3000);
          return;
        }
        // Permission denied
        setError(t("tracking.permissionDenied"));
        setTracking(false);
        trackingRef.current = false;
        releaseWakeLock();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,   // 3s — fresher data
        timeout: 15000,     // 15s timeout
      },
    );
  }, [allStations, destName, t, resetStaleTimer, releaseWakeLock, clearWatch]);

  // ---- Handle visibility change: restart GPS when screen wakes up ----
  useEffect(() => {
    if (!tracking) return;
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && trackingRef.current) {
        // Screen woke up — restart GPS watch for fresh data
        acquireWakeLock();
        setGpsStale(true);
        setGpsWaiting(true);
        startWatch(); // clearWatch + new watchPosition
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [tracking, acquireWakeLock, startWatch]);

  // ---- Stop ----
  const stop = useCallback(() => {
    clearWatch();
    if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    releaseWakeLock();
    trackingRef.current = false;
    setTracking(false);
    setProgress(-1);
    progressRef.current = -1;
    progressAccuracyRef.current = Infinity;
    setNotified(false);
    setError(null);
    setGpsAccuracy(null);
    setGpsStale(false);
    setGpsWaiting(false);
  }, [releaseWakeLock, clearWatch]);

  // ---- Start ----
  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError(t("tracking.noGps"));
      return;
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    trackingRef.current = true;
    setTracking(true);
    setError(null);
    setNotified(false);
    setGpsWaiting(true);
    progressRef.current = -1;
    progressAccuracyRef.current = Infinity;
    acquireWakeLock();
    resetStaleTimer();
    startWatch();
  }, [t, acquireWakeLock, resetStaleTimer, startWatch]);

  // ---- Cleanup on unmount ----
  useEffect(() => () => {
    clearWatch();
    if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    releaseWakeLock();
    trackingRef.current = false;
  }, [clearWatch, releaseWakeLock]);

  return (
    <div
      className="relative"
      data-tracking={tracking ? "true" : undefined}
      data-nearest={tracking ? nearestIdx : undefined}
    >
      {/* Tracking controls */}
      <div className="px-4 py-2 border-b border-gray-100 bg-white rounded-t-xl">
        {!tracking ? (
          <button
            onClick={start}
            className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            {t("tracking.start")}
          </button>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-green-600">
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full ${
                    gpsWaiting ? "bg-yellow-400" : gpsStale ? "bg-yellow-400" : "bg-green-400"
                  } opacity-75 animate-ping`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    gpsWaiting ? "bg-yellow-500" : gpsStale ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                </span>
                {gpsWaiting
                  ? t("tracking.gpsSearching")
                  : gpsStale
                    ? t("tracking.gpsWeak")
                    : t("tracking.active")
                }
                {nearestIdx >= 0 && !gpsWaiting && (
                  <span className="text-gray-500">
                    — {t("tracking.near", { station: allStations[nearestIdx]?.name.th ?? "" })}
                    <span className="text-gray-400 ml-1">
                      ({nearestIdx + 1}/{allStations.length})
                    </span>
                  </span>
                )}
              </span>
              <button onClick={stop} className="text-xs text-red-500 hover:text-red-700">
                {t("tracking.stop")}
              </button>
            </div>

            {/* Progress bar + ETA */}
            {progress >= 0 && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, (progress / (allStations.length - 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {estimatedRemainingMin !== null && estimatedRemainingMin > 0
                    ? `~${Math.ceil(estimatedRemainingMin)} ${t("tracking.minLeft")}`
                    : t("tracking.arrived")
                  }
                </span>
                {gpsAccuracy !== null && (
                  <span className={`text-[10px] shrink-0 ${
                    gpsAccuracy <= 50 ? "text-green-500"
                    : gpsAccuracy <= 150 ? "text-yellow-500"
                    : gpsAccuracy <= 500 ? "text-orange-500"
                    : "text-red-500"
                  }`}>
                    ±{gpsAccuracy}m
                  </span>
                )}
              </div>
            )}

            {/* Waiting for GPS signal */}
            {gpsWaiting && progress < 0 && (
              <p className="text-[11px] text-yellow-600 animate-pulse">
                {t("tracking.gpsSearching")}...
              </p>
            )}
          </div>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Route card with tracking overlay */}
      <TrackingOverlay tracking={tracking} progress={progress} stationCount={allStations.length}>
        {children}
      </TrackingOverlay>
    </div>
  );
}

function TrackingOverlay({
  tracking, progress, stationCount, children,
}: {
  tracking: boolean; progress: number; stationCount: number; children: React.ReactNode;
}) {
  if (!tracking || progress < 0) return <>{children}</>;

  const nearestIdx = Math.round(progress);
  const styles: string[] = [];

  // Passed stations
  for (let i = 0; i < nearestIdx; i++) {
    const sel = `[data-station-global-index="${i}"]`;
    styles.push(
      `${sel} .station-dot { opacity: 1 !important; filter: brightness(0.7) saturate(1.3) !important; }`,
      `${sel} .station-name { color: #374151 !important; }`,
    );
  }

  // Current station: pulse
  const cur = `[data-station-global-index="${nearestIdx}"]`;
  styles.push(
    `${cur} .station-dot {
      width: 16px !important; height: 16px !important; opacity: 1 !important;
      margin: 0 !important;
      box-shadow: 0 0 0 4px rgba(37,99,235,0.25) !important;
      animation: tracking-pulse 2s ease-in-out infinite !important;
    }`,
    `${cur} .station-name { color: #1d4ed8 !important; font-weight: 700 !important; }`,
    `@keyframes tracking-pulse {
      0%, 100% { box-shadow: 0 0 0 4px rgba(37,99,235,0.25); }
      50% { box-shadow: 0 0 0 8px rgba(37,99,235,0.1), 0 0 12px rgba(37,99,235,0.2); }
    }`,
  );

  // Upcoming stations: faded
  for (let i = nearestIdx + 1; i < stationCount; i++) {
    const sel = `[data-station-global-index="${i}"]`;
    styles.push(
      `${sel} .station-dot { opacity: 0.35 !important; }`,
      `${sel} .station-name { color: #9ca3af !important; }`,
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles.join("\n") }} />
      {children}
    </>
  );
}
