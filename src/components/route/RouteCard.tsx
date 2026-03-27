import type { Route, RouteSegment, Transfer, Station } from "@/types";
import type { FareByPassenger } from "@/types";
import { getLineById } from "@/data";
import StationExplore from "./StationExplore";
import { T } from "@/i18n";

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

  const gmapsUrl =
    firstStation && lastStation
      ? `https://www.google.com/maps/dir/?api=1&origin=${firstStation.coordinates.lat},${firstStation.coordinates.lng}&destination=${lastStation.coordinates.lat},${lastStation.coordinates.lng}&travelmode=transit`
      : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ===== Notice: approximate time ===== */}
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-xs text-amber-700">
        <span>⏱</span>
        <span><T k="route.approximateTime" /></span>
        {gmapsUrl && (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto shrink-0 underline hover:text-amber-900"
          >
            <T k="route.viewRealTime" /> &rarr;
          </a>
        )}
      </div>

      {/* ===== Header ===== */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            <T k="route.routeNumber" params={{ n: index + 1 }} />
          </span>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-600">{route.totalFare}</span>
            <span className="text-sm text-gray-500 ml-1"><T k="route.baht" /></span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="flex items-center gap-1 text-gray-700">
            <TrainIcon />
            <strong><T k="route.minutes" params={{ n: Math.round(route.totalDurationMinutes) }} /></strong>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {route.totalTransfers === 0
              ? <T k="route.noTransfer" />
              : <T k="route.transfers" params={{ n: route.totalTransfers }} />}
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
        {route.segments.map((segment, segIdx) => {
          // Calculate global station offset for tracking
          let globalOffset = 0;
          for (let i = 0; i < segIdx; i++) {
            globalOffset += 1 + route.segments[i].intermediateStations.length; // from + intermediates (to is next segment's from)
          }
          return (
          <div key={segIdx}>
            {segIdx > 0 && segIdx - 1 < route.transfers.length && (
              <TransferRow transfer={route.transfers[segIdx - 1]} />
            )}
            <SegmentFullTimeline
              segment={segment}
              isFirst={segIdx === 0}
              isLast={segIdx === route.segments.length - 1}
              globalStationOffset={globalOffset}
            />
          </div>
        );
        })}
      </div>

      {/* ===== Footer: Total fares + Google Maps ===== */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        {/* Total fare by type */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500"><T k="route.total" /></span>
          <FareTypeBadges fareByType={route.totalFareByType} bold />
        </div>

        {/* Child notes */}
        {route.segments.some(s => s.fareByType.childNote) && (
          <div className="text-[10px] text-gray-400 mb-2">
            {Array.from(new Set(route.segments.filter(s => s.fareByType.childNote).map(s => `${s.operatorId.toUpperCase()}: ${s.fareByType.childNote}`))).map((note, i) => (
              <span key={i} className="mr-3">* {note}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <p className="text-[10px] text-gray-400">
            <T k="route.priceDisclaimer" />
          </p>
          {gmapsUrl && (
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
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
   Fare Type Badges — inline display
   ===================================================== */

function FareTypeBadges({ fareByType, bold = false }: { fareByType: FareByPassenger; bold?: boolean }) {
  const items = [
    { icon: "🧑", labelKey: "passenger.adult", value: fareByType.adult, highlight: false },
    { icon: "🎓", labelKey: "passenger.student", value: fareByType.student, highlight: fareByType.student < fareByType.adult },
    { icon: "👴", labelKey: "passenger.senior", value: fareByType.senior, highlight: fareByType.senior < fareByType.adult },
    { icon: "👶", labelKey: "passenger.child", value: fareByType.child, highlight: true },
  ];

  return (
    <div className="flex gap-1.5 flex-wrap">
      {items.map((item) => (
        <span
          key={item.labelKey}
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border ${
            item.highlight && item.value < fareByType.adult
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
          } ${bold ? "font-semibold" : ""}`}
        >
          <span>{item.icon}</span>
          {item.value === 0 ? <T k="route.free" /> : `${item.value}฿`}
        </span>
      ))}
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
  globalStationOffset = 0,
}: {
  segment: RouteSegment;
  isFirst: boolean;
  isLast: boolean;
  globalStationOffset?: number;
}) {
  const line = getLineById(segment.lineId);
  const lineColor = line?.color ?? "#6B7280";
  const intermediates = segment.intermediateStations;
  const hasIntermediates = intermediates.length > 0;
  const departureContext = isFirst ? "departure" : "transfer";
  const arrivalContext = isLast ? "arrival" : "transfer";

  return (
    <div>
      {/* ── Segment info bar (line, time, fares) — BEFORE stations ── */}
      <div className="flex items-center justify-between bg-gray-100 px-3 py-2.5 rounded-lg flex-wrap gap-y-1.5 mb-2">
        <div className="flex items-center gap-x-2 flex-wrap">
          <span
            className="inline-block px-2 py-0.5 rounded text-[11px] font-bold text-white"
            style={{ backgroundColor: lineColor }}
          >
            {line?.name.th ?? segment.lineId}
          </span>
          <span className="text-xs text-gray-500">
            <T k="route.minutes" params={{ n: Math.round(segment.durationMinutes) }} />
            <span className="text-gray-300 mx-1">&middot;</span>
            <T k="route.stations" params={{ n: intermediates.length + 2 }} />
            <span className="text-gray-300 mx-1">&middot;</span>
            <T k="route.waitTime" params={{ n: segment.waitTimeMinutes }} />
          </span>
        </div>
        <FareTypeBadges fareByType={segment.fareByType} />
      </div>

      {/* ── Departure station ── */}
      <StationRow station={segment.fromStation} lineColor={lineColor} type="main" showLine context={departureContext} globalIndex={globalStationOffset} />

      {/* ── Collapsible intermediate stations ── */}
      {hasIntermediates && (
        <details className="group">
          <summary className="flex gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <div className="flex flex-col items-center w-5 shrink-0">
              <div className="w-0.5 flex-1" style={{ backgroundColor: lineColor, opacity: 0.35 }} />
            </div>
            <div className="flex-1 py-1.5 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors select-none mt-1 mb-3">
              <span className="group-open:rotate-90 transition-transform text-[10px]">▶</span>
              <span><T k="route.intermediateStations" params={{ n: intermediates.length }} /></span>
            </div>
          </summary>
          <div>
            {intermediates.map((station, idx) => (
              <StationRow
                key={`${station.id}-mid-${idx}`}
                station={station}
                lineColor={lineColor}
                type="intermediate"
                showLine
                context="intermediate"
                globalIndex={globalStationOffset + 1 + idx}
              />
            ))}
          </div>
        </details>
      )}

      {/* ── Line connector when no intermediates ── */}
      {!hasIntermediates && (
        <div className="flex gap-3">
          <div className="flex flex-col items-center w-5 shrink-0">
            <div className="w-0.5 min-h-2" style={{ backgroundColor: lineColor, opacity: 0.35 }} />
          </div>
          <div />
        </div>
      )}

      {/* ── Arrival station ── */}
      <StationRow station={segment.toStation} lineColor={lineColor} type="main" showLine={false} context={arrivalContext} globalIndex={globalStationOffset + 1 + intermediates.length} />
    </div>
  );
}

/* =====================================================
   Single Station Row
   ===================================================== */

function StationRow({
  station,
  lineColor,
  type,
  showLine,
  context,
  globalIndex,
}: {
  station: Station;
  lineColor: string;
  type: "main" | "intermediate";
  showLine: boolean;
  context: "departure" | "intermediate" | "transfer" | "arrival";
  globalIndex?: number;
}) {
  const isMain = type === "main";

  return (
    <div className="flex gap-3" data-station-global-index={globalIndex}>
      <div className="flex flex-col items-center w-5 shrink-0">
        {isMain ? (
          <div
            className="station-dot w-3.5 h-3.5 rounded-full border-[3px] border-white shrink-0 transition-all duration-300"
            style={{ backgroundColor: lineColor, boxShadow: `0 0 0 2px ${lineColor}` }}
          />
        ) : (
          <div
            className="station-dot w-2 h-2 rounded-full shrink-0 my-[3px] transition-all duration-300"
            style={{ backgroundColor: lineColor, opacity: 0.5 }}
          />
        )}
        {showLine && (
          <div
            className="w-0.5 flex-1 min-h-3"
            style={{ backgroundColor: lineColor, opacity: isMain ? 1 : 0.35 }}
          />
        )}
      </div>

      <div className={`flex-1 ${isMain ? "pb-1" : "pb-1"}`}>
        {isMain ? (
          <>
            <div className="flex items-baseline gap-2 -mt-1">
              <span className="station-name text-sm font-semibold transition-colors duration-300">{station.name.th}</span>
              <span className="text-xs text-gray-400">{station.name.en}</span>
              <span className="text-[10px] text-gray-300">{station.code}</span>
            </div>
            <StationExplore station={station} context={context} />
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5 -mt-0.5">
              <span className="station-name text-xs text-gray-500 transition-colors duration-300">{station.name.th}</span>
              <span className="text-[10px] text-gray-300">{station.name.en} &middot; {station.code}</span>
            </div>
            <StationExplore station={station} context="intermediate" />
          </>
        )}
      </div>
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
          <T k="route.transfer" params={{ n: transfer.walkingTimeMinutes }} />
          <span className="text-amber-500 ml-1">
            ({transfer.fromStation.name.th} &rarr; {transfer.toStation.name.th})
          </span>
        </div>
        <StationExplore station={transfer.toStation} context="transfer" />
      </div>
    </div>
  );
}

/* =====================================================
   Icons
   ===================================================== */

function TrainIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <circle cx="8" cy="19" r="1" />
      <circle cx="16" cy="19" r="1" />
      <path d="M6 17l-2 4M18 17l2 4" />
    </svg>
  );
}
