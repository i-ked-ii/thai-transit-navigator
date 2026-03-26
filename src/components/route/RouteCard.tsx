import type { Route, RouteSegment, Transfer, Station } from "@/types";
import { getLineById } from "@/data";
import StationExplore from "./StationExplore";

interface Props {
  route: Route;
  index: number;
}

export default function RouteCard({ route, index }: Props) {
  const firstStation = route.segments[0]?.fromStation;
  const lastStation = route.segments[route.segments.length - 1]?.toStation;

  const lineBadges = route.segments.map((seg) => {
    const line = getLineById(seg.lineId);
    return { color: line?.color ?? "#6B7280", name: line?.name.en ?? seg.lineId };
  });

  // Google Maps transit direction
  const gmapsUrl =
    firstStation && lastStation
      ? `https://www.google.com/maps/dir/?api=1&origin=${firstStation.coordinates.lat},${firstStation.coordinates.lng}&destination=${lastStation.coordinates.lat},${lastStation.coordinates.lng}&travelmode=transit`
      : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ===== Header ===== */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            เส้นทาง {index + 1}
          </span>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-600">{route.totalFare}</span>
            <span className="text-sm text-gray-500 ml-1">บาท</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="flex items-center gap-1 text-gray-700">
            <ClockIcon />
            <strong>~{Math.round(route.totalDurationMinutes)} นาที</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {route.totalTransfers === 0
              ? "ไม่ต้องเปลี่ยนสาย"
              : `เปลี่ยน ${route.totalTransfers} ครั้ง`}
          </span>
          <span className="text-gray-300">|</span>
          <div className="flex gap-1">
            {lineBadges.map((b, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                style={{ backgroundColor: b.color }}
              >
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Full Timeline ===== */}
      <div className="px-4 py-3">
        {route.segments.map((segment, segIdx) => (
          <div key={segIdx}>
            {/* Transfer between segments */}
            {segIdx > 0 && segIdx - 1 < route.transfers.length && (
              <TransferRow transfer={route.transfers[segIdx - 1]} />
            )}
            <SegmentFullTimeline
              segment={segment}
              isFirst={segIdx === 0}
              isLast={segIdx === route.segments.length - 1}
            />
          </div>
        ))}
      </div>

      {/* ===== Footer: Fare breakdown ===== */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <p className="text-xs font-medium text-gray-500 mb-1">รายละเอียดค่าโดยสาร</p>
            {route.fareBreakdown.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: getLineById(f.lineId)?.color ?? "#6B7280" }}
                />
                <span className="text-gray-600">
                  {f.lineName.th}: {f.fromStation} &rarr; {f.toStation}
                </span>
                <span className="font-semibold text-gray-800 ml-auto">{f.fare}฿</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between text-xs">
              <span className="font-medium text-gray-600">รวม</span>
              <span className="font-bold text-blue-600">{route.totalFare}฿</span>
            </div>
          </div>
          {gmapsUrl && (
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              🗺️ Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   Full Timeline — every station visible
   ===================================================== */

function SegmentFullTimeline({
  segment,
  isFirst,
  isLast,
}: {
  segment: RouteSegment;
  isFirst: boolean;
  isLast: boolean;
}) {
  const line = getLineById(segment.lineId);
  const lineColor = line?.color ?? "#6B7280";

  // Build ordered station list: from → intermediates → to
  const allStations = [
    segment.fromStation,
    ...segment.intermediateStations,
    segment.toStation,
  ];

  return (
    <div>
      {/* Line badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block px-2 py-0.5 rounded text-[11px] font-bold text-white"
          style={{ backgroundColor: lineColor }}
        >
          {line?.name.th ?? segment.lineId}
        </span>
        <span className="text-xs text-gray-500">
          {allStations.length} สถานี &middot; ~{Math.round(segment.durationMinutes)} นาที
          &middot; {segment.fare}฿
        </span>
      </div>

      {/* Station-by-station timeline */}
      {allStations.map((station, stIdx) => {
        const isFrom = stIdx === 0;
        const isTo = stIdx === allStations.length - 1;
        const isMainStation = isFrom || isTo;
        const isRouteStart = isFirst && isFrom;
        const isRouteEnd = isLast && isTo;

        // Determine explore context
        let exploreContext: "departure" | "intermediate" | "transfer" | "arrival" = "intermediate";
        if (isRouteStart) exploreContext = "departure";
        else if (isRouteEnd) exploreContext = "arrival";
        else if (isFrom || isTo) exploreContext = "transfer";

        return (
          <div key={station.id} className="flex gap-3">
            {/* Rail */}
            <div className="flex flex-col items-center w-5 shrink-0">
              {/* Dot */}
              {isMainStation ? (
                <div
                  className="w-3.5 h-3.5 rounded-full border-[3px] border-white shrink-0"
                  style={{ backgroundColor: lineColor, boxShadow: `0 0 0 2px ${lineColor}` }}
                />
              ) : (
                <div
                  className="w-2 h-2 rounded-full shrink-0 my-[3px]"
                  style={{ backgroundColor: lineColor, opacity: 0.5 }}
                />
              )}
              {/* Line (not after last station) */}
              {!isTo && (
                <div
                  className="w-0.5 flex-1 min-h-4"
                  style={{ backgroundColor: lineColor, opacity: isMainStation ? 1 : 0.35 }}
                />
              )}
            </div>

            {/* Station content */}
            <div className={`flex-1 ${isMainStation ? "pb-2" : "pb-1.5"}`}>
              {isMainStation ? (
                <>
                  {/* Main station: bold + explore links */}
                  <div className="flex items-baseline gap-2 -mt-1">
                    <span className="text-sm font-semibold">{station.name.th}</span>
                    <span className="text-xs text-gray-400">{station.name.en}</span>
                    <span className="text-[10px] text-gray-300">{station.code}</span>
                  </div>
                  <StationExplore station={station} context={exploreContext} />
                </>
              ) : (
                <>
                  {/* Intermediate station: lighter + compact explore */}
                  <div className="flex items-baseline gap-1.5 -mt-0.5">
                    <span className="text-xs text-gray-500">{station.name.th}</span>
                    <span className="text-[10px] text-gray-300">{station.code}</span>
                  </div>
                  <StationExplore station={station} context="intermediate" />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =====================================================
   Transfer Row
   ===================================================== */

function TransferRow({ transfer }: { transfer: Transfer }) {
  return (
    <div className="flex gap-3 py-2 my-1">
      <div className="flex flex-col items-center w-5 shrink-0">
        <div className="w-0.5 h-1.5 bg-gray-300" />
        <div className="w-5 h-5 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-[10px]">
          🚶
        </div>
        <div className="w-0.5 h-1.5 bg-gray-300" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md inline-block">
          เปลี่ยนสาย &middot; เดิน ~{transfer.walkingTimeMinutes} นาที
          <span className="text-amber-500 ml-1">
            ({transfer.fromStation.name.th} &rarr; {transfer.toStation.name.th})
          </span>
        </div>
        {/* Explore at transfer point */}
        <StationExplore station={transfer.toStation} context="transfer" />
      </div>
    </div>
  );
}

/* =====================================================
   Icons
   ===================================================== */

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
