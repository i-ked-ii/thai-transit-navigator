"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Route, Station } from "@/types";

interface Props {
  route: Route;
  index: number;
  children: React.ReactNode; // The server-rendered RouteCard content
}

// Haversine distance
function distKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function RouteCardWithTracking({ route, children }: Props) {
  const [tracking, setTracking] = useState(false);
  const [nearestIdx, setNearestIdx] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [notified, setNotified] = useState(false);
  const watchRef = useRef<number | null>(null);

  // Build flat station list from route
  const allStations: Station[] = [];
  for (let i = 0; i < route.segments.length; i++) {
    const seg = route.segments[i];
    if (i === 0) allStations.push(seg.fromStation);
    allStations.push(...seg.intermediateStations);
    allStations.push(seg.toStation);
  }

  const destName = allStations[allStations.length - 1]?.name.th ?? "";

  const stop = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    setTracking(false);
    setNearestIdx(-1);
    setNotified(false);
    setError(null);
  }, []);

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("เบราว์เซอร์ไม่รองรับ GPS");
      return;
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setTracking(true);
    setError(null);
    setNotified(false);

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let minD = Infinity;
        let minI = 0;
        for (let i = 0; i < allStations.length; i++) {
          const d = distKm(latitude, longitude, allStations[i].coordinates.lat, allStations[i].coordinates.lng);
          if (d < minD) { minD = d; minI = i; }
        }
        setNearestIdx(minI);

        // Notify 1 station before end
        if (minI >= allStations.length - 2) {
          setNotified((prev) => {
            if (!prev && "Notification" in window && Notification.permission === "granted") {
              new Notification("Thai Transit", {
                body: `ใกล้ถึง ${destName} แล้ว เตรียมลงสถานี`,
                icon: "/skytrain.png",
              });
            }
            return true;
          });
        }
      },
      (err) => {
        const msgs: Record<number, string> = { 1: "กรุณาอนุญาตการเข้าถึงตำแหน่ง", 2: "ไม่สามารถระบุตำแหน่งได้", 3: "หมดเวลา" };
        setError(msgs[err.code] ?? "เกิดข้อผิดพลาด GPS");
        setTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  }, [allStations, destName]);

  useEffect(() => () => { if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current); }, []);

  // Apply tracking styles via CSS custom property
  // Station dots in RouteCard get data-station-index, we style them via parent class
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
            เปิดติดตามการเดินทาง (GPS)
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-green-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              กำลังติดตาม
              {nearestIdx >= 0 && (
                <span className="text-gray-500">
                  — ใกล้ {allStations[nearestIdx]?.name.th}
                  <span className="text-gray-400 ml-1">
                    ({nearestIdx + 1}/{allStations.length})
                  </span>
                </span>
              )}
            </span>
            <button onClick={stop} className="text-xs text-red-500 hover:text-red-700">
              หยุด
            </button>
          </div>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Route card with tracking overlay */}
      <TrackingOverlay tracking={tracking} nearestIdx={nearestIdx} stationCount={allStations.length}>
        {children}
      </TrackingOverlay>
    </div>
  );
}

function TrackingOverlay({
  tracking,
  nearestIdx,
  stationCount,
  children,
}: {
  tracking: boolean;
  nearestIdx: number;
  stationCount: number;
  children: React.ReactNode;
}) {
  // We inject CSS that targets station dots by their data-station-global-index
  if (!tracking || nearestIdx < 0) return <>{children}</>;

  // Simple tracking: only current station dot gets bigger
  // Passed = normal (as-is), Current = enlarged, Upcoming = normal (as-is)
  const cur = `[data-station-global-index="${nearestIdx}"]`;
  const styles = [
    `${cur} .station-dot { width: 14px !important; height: 14px !important; opacity: 1 !important; margin: 0 !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.3) !important; }`,
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles.join("\n") }} />
      {children}
    </>
  );
}
