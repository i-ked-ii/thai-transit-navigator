import type { RouteSegment as RouteSegmentType } from "@/types";
import { getLineById } from "@/data";

interface Props {
  segment: RouteSegmentType;
}

export default function RouteSegment({ segment }: Props) {
  const line = getLineById(segment.lineId);
  const lineColor = line?.color ?? "#6B7280";
  const stationCount = segment.intermediateStations.length + 2;

  return (
    <div className="flex gap-3">
      {/* Line indicator */}
      <div className="flex flex-col items-center">
        <div
          className="w-3 h-3 rounded-full border-2 border-white ring-2 shrink-0"
          style={{ backgroundColor: lineColor, outlineColor: lineColor }}
        />
        <div
          className="w-0.5 flex-1 min-h-8"
          style={{ backgroundColor: lineColor }}
        />
        <div
          className="w-3 h-3 rounded-full border-2 border-white ring-2 shrink-0"
          style={{ backgroundColor: lineColor, outlineColor: lineColor }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: lineColor }}
          >
            {line?.name.en ?? segment.lineId}
          </span>
          <span className="text-xs text-gray-500">
            {stationCount} สถานี &middot; ~{Math.round(segment.durationMinutes)}{" "}
            นาที
          </span>
        </div>
        <div className="text-sm font-medium">
          {segment.fromStation.name.th}
          <span className="text-gray-400 mx-1">({segment.fromStation.code})</span>
        </div>

        {/* Intermediate stations (collapsible) */}
        {segment.intermediateStations.length > 0 && (
          <details className="my-1">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
              ผ่าน {segment.intermediateStations.length} สถานี
            </summary>
            <div className="mt-1 ml-1 space-y-0.5">
              {segment.intermediateStations.map((s) => (
                <div key={s.id} className="text-xs text-gray-400">
                  {s.name.th}
                  <span className="ml-1">({s.code})</span>
                </div>
              ))}
            </div>
          </details>
        )}

        <div className="text-sm font-medium">
          {segment.toStation.name.th}
          <span className="text-gray-400 mx-1">({segment.toStation.code})</span>
        </div>
      </div>

      {/* Fare */}
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-blue-600">
          {segment.fare} <span className="text-xs font-normal">บาท</span>
        </div>
      </div>
    </div>
  );
}
