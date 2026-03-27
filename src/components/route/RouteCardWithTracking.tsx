"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Route, Station } from "@/types";
import { useTranslation } from "@/i18n";

interface Props {
  route: Route;
  index: number;
  children: React.ReactNode; // The server-rendered RouteCard content
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

// Project a point onto a line segment, return fraction [0, 1] along the segment
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

// Compute cumulative route distances (meters) for each station
function computeCumulativeDistances(stations: Station[]): number[] {
  const cum: number[] = [0];
  for (let i = 1; i < stations.length; i++) {
    const prev = stations[i - 1].coordinates;
    const curr = stations[i].coordinates;
    cum.push(cum[i - 1] + distMeters(prev.lat, prev.lng, curr.lat, curr.lng));
  }
  return cum;
}

// Given GPS coords, find the progress along the route as a continuous value
// Returns a float where integer part = station index, fractional part = progress to next
function computeRouteProgress(
  lat: number, lng: number,
  stations: Station[],
  cumDist: number[],
  minProgress: number, // monotonic: can't go backward
): number {
  const minIdx = Math.floor(minProgress);
  let bestProgress = minProgress;
  let bestDist = Infinity;

  // Only check from current minimum station onward (can't go backward)
  // But allow looking 1 station back for edge cases
  const startIdx = Math.max(0, minIdx - 1);

  for (let i = startIdx; i < stations.length - 1; i++) {
    const s1 = stations[i].coordinates;
    const s2 = stations[i + 1].coordinates;
    const frac = projectOntoSegment(lat, lng, s1.lat, s1.lng, s2.lat, s2.lng);
    const projLat = s1.lat + frac * (s2.lat - s1.lat);
    const projLng = s1.lng + frac * (s2.lng - s1.lng);
    const d = distMeters(lat, lng, projLat, projLng);

    const progress = i + frac;
    // Only accept if it's forward progress (or very close to current)
    if (progress >= minProgress - 0.5 && d < bestDist) {
      bestDist = d;
      bestProgress = Math.max(progress, minProgress); // enforce monotonic
    }
  }

  // Also check last station
  const lastDist = distMeters(lat, lng, stations[stations.length - 1].coordinates.lat, stations[stations.length - 1].coordinates.lng);
  if (lastDist < bestDist && stations.length - 1 >= minProgress) {
    bestProgress = stations.length - 1;
  }

  return bestProgress;
}

// Compute cumulative travel time (minutes) for each station
function computeCumulativeTimes(route: Route, stationCount: number): number[] {
  const times: number[] = [0];
  let offset = 0;
  for (const seg of route.segments) {
    const segStations = seg.intermediateStations.length + 2;
    const timePerStation = seg.durationMinutes / (segStations - 1);
    for (let i = 1; i < segStations; i++) {
      times.push(times[times.length - 1] + timePerStation);
    }
    offset += segStations;
  }
  // Pad if needed
  while (times.length < stationCount) {
    times.push(times[times.length - 1]);
  }
  return times;
}

export default function RouteCardWithTracking({ route, children }: Props) {
  const { t } = useTranslation();
  const [tracking, setTracking] = useState(false);
  const [progress, setProgress] = useState(-1); // continuous route progress
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notified, setNotified] = useState(false);
  const [gpsStale, setGpsStale] = useState(false);
  const watchRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const progressRef = useRef(-1); // for monotonic progress in callback
  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  // Build flat station list from route
  const allStations: Station[] = [];
  for (let i = 0; i < route.segments.length; i++) {
    const seg = route.segments[i];
    if (i === 0) allStations.push(seg.fromStation);
    allStations.push(...seg.intermediateStations);
    allStations.push(seg.toStation);
  }

  const destName = allStations[allStations.length - 1]?.name.th ?? "";
  const cumDist = computeCumulativeDistances(allStations);
  const cumTime = computeCumulativeTimes(route, allStations.length);
  const totalRouteDistance = cumDist[cumDist.length - 1];

  const nearestIdx = progress >= 0 ? Math.round(progress) : -1;

  // Estimated remaining time
  const estimatedRemainingMin = progress >= 0
    ? Math.max(0, cumTime[cumTime.length - 1] - (cumTime[Math.floor(progress)] + (progress % 1) * (cumTime[Math.ceil(progress)] - cumTime[Math.floor(progress)])))
    : null;

  // Wake Lock management
  const acquireWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          wakeLockRef.current = null;
        });
      }
    } catch {
      // Wake Lock not available or denied — non-critical
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    wakeLockRef.current?.release();
    wakeLockRef.current = null;
  }, []);

  // Re-acquire wake lock when page becomes visible again
  useEffect(() => {
    if (!tracking) return;
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && tracking) {
        acquireWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [tracking, acquireWakeLock]);

  const resetStaleTimer = useCallback(() => {
    if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    setGpsStale(false);
    staleTimerRef.current = setTimeout(() => setGpsStale(true), 30_000); // 30s without update = stale
  }, []);

  const stop = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    releaseWakeLock();
    setTracking(false);
    setProgress(-1);
    progressRef.current = -1;
    setNotified(false);
    setError(null);
    setGpsAccuracy(null);
    setGpsStale(false);
    retryCountRef.current = 0;
  }, [releaseWakeLock]);

  const startWatch = useCallback(() => {
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        retryCountRef.current = 0;
        resetStaleTimer();
        setGpsAccuracy(Math.round(accuracy));

        // Ignore very inaccurate readings (> 200m)
        if (accuracy > 200) return;

        const newProgress = computeRouteProgress(
          latitude, longitude,
          allStations, cumDist,
          progressRef.current,
        );
        progressRef.current = newProgress;
        setProgress(newProgress);

        // Notify 1 station before end
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
        // On timeout or position unavailable, don't stop — just show warning and retry
        if (err.code === 2 || err.code === 3) {
          setGpsStale(true);
          // Auto-retry up to 5 times
          if (retryCountRef.current < 5) {
            retryCountRef.current++;
            // Restart watch
            if (watchRef.current !== null) {
              navigator.geolocation.clearWatch(watchRef.current);
            }
            setTimeout(() => {
              if (progressRef.current >= -1) { // still tracking
                startWatch();
              }
            }, 2000);
          } else {
            setError(t("tracking.gpsError"));
          }
          return;
        }
        // Permission denied — stop completely
        const msgs: Record<number, string> = {
          1: t("tracking.permissionDenied"),
        };
        setError(msgs[err.code] ?? t("tracking.gpsError"));
        setTracking(false);
        releaseWakeLock();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,  // Reduced from 10s to 5s for fresher data
        timeout: 20000,    // Increased from 15s to 20s for reliability
      },
    );
  }, [allStations, cumDist, destName, t, resetStaleTimer, releaseWakeLock]);

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError(t("tracking.noGps"));
      return;
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setTracking(true);
    setError(null);
    setNotified(false);
    progressRef.current = -1;
    retryCountRef.current = 0;
    acquireWakeLock();
    resetStaleTimer();
    startWatch();
  }, [t, acquireWakeLock, resetStaleTimer, startWatch]);

  useEffect(() => () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    releaseWakeLock();
  }, [releaseWakeLock]);

  const distanceText = progress >= 0
    ? `${(totalRouteDistance * (1 - progress / (allStations.length - 1)) / 1000).toFixed(1)} km`
    : "";

  return (
    <div
      className="relative"
      data-tracking={tracking ? "true" : undefined}
      data-nearest={tracking ? nearestIdx : undefined}
      style={{ "--nearest-idx": nearestIdx } as React.CSSProperties}
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
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-green-600">
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full ${gpsStale ? "bg-yellow-400" : "bg-green-400"} opacity-75 animate-ping`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${gpsStale ? "bg-yellow-500" : "bg-green-500"}`} />
                </span>
                {gpsStale ? t("tracking.gpsWeak") : t("tracking.active")}
                {nearestIdx >= 0 && (
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
                    className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
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
                  <span className={`text-[10px] ${gpsAccuracy <= 50 ? "text-green-400" : gpsAccuracy <= 150 ? "text-yellow-400" : "text-red-400"}`}>
                    ±{gpsAccuracy}m
                  </span>
                )}
              </div>
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
  tracking,
  progress,
  stationCount,
  children,
}: {
  tracking: boolean;
  progress: number;
  stationCount: number;
  children: React.ReactNode;
}) {
  if (!tracking || progress < 0) return <>{children}</>;

  const nearestIdx = Math.round(progress);
  const styles: string[] = [];

  // Passed stations: darken and mark as visited
  for (let i = 0; i < nearestIdx; i++) {
    const sel = `[data-station-global-index="${i}"]`;
    styles.push(
      `${sel} .station-dot { opacity: 1 !important; filter: brightness(0.7) saturate(1.3) !important; }`,
      `${sel} .station-name { color: #374151 !important; }`,
    );
  }

  // Current station: enlarged + pulse animation
  const cur = `[data-station-global-index="${nearestIdx}"]`;
  styles.push(
    `${cur} .station-dot {
      width: 16px !important;
      height: 16px !important;
      opacity: 1 !important;
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

  // Upcoming stations: slightly faded
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
