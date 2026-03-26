import type { Metadata } from "next";
import Link from "next/link";
import { lines, getStationById, getLineById } from "@/data";
import { interchanges } from "@/data";

export const metadata: Metadata = {
  title: "สายรถไฟฟ้าทั้งหมด",
  description:
    "รวมข้อมูลสายรถไฟฟ้าทั้งหมดในกรุงเทพฯ BTS สุขุมวิท สีลม MRT สีน้ำเงิน สีม่วง ARL พร้อมรายชื่อสถานีและจุดเปลี่ยนสาย",
};

export default function LinesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-blue-600">
          หน้าแรก
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">สายรถไฟฟ้า</span>
      </nav>

      <h1 className="text-2xl font-bold mb-1">สายรถไฟฟ้าทั้งหมด</h1>
      <p className="text-sm text-gray-500 mb-6">
        {lines.length} สาย &middot;{" "}
        {lines.reduce((sum, l) => sum + l.stationIds.length, 0)} สถานี
      </p>

      <div className="space-y-3">
        {lines.map((line) => {
          const stations = line.stationIds
            .map(getStationById)
            .filter(Boolean);
          const firstStation = stations[0];
          const lastStation = stations[stations.length - 1];

          // Find interchanges on this line
          const lineInterchanges = interchanges.filter(
            (ic) =>
              line.stationIds.includes(ic.fromStationId) ||
              line.stationIds.includes(ic.toStationId)
          );

          return (
            <details
              key={line.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group"
            >
              {/* Line header — always visible */}
              <summary
                className="cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 hover:bg-gray-50 transition-colors"
                style={{ borderLeft: `4px solid ${line.color}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: line.color }}
                    >
                      {line.name.en}
                    </span>
                    <div>
                      <h2 className="font-semibold text-sm">{line.name.th}</h2>
                      <p className="text-xs text-gray-400">
                        {line.operator.th} &middot; {stations.length} สถานี
                        &middot; รถมาทุก ~{line.averageIntervalMinutes} นาที
                        {line.isLoop && (
                          <span className="text-blue-500 ml-1">(วงรอบ)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {firstStation && lastStation && (
                      <span className="text-xs text-gray-400 hidden sm:block">
                        {firstStation.name.th} — {lastStation.name.th}
                      </span>
                    )}
                    <span className="text-gray-300 group-open:rotate-180 transition-transform">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </summary>

              {/* Expanded: station list */}
              <div className="border-t border-gray-100">
                <div className="divide-y divide-gray-50">
                  {stations.map((station, i) => {
                    if (!station) return null;

                    // Find connecting lines at this station
                    const connectingLines = lineInterchanges
                      .filter(
                        (ic) =>
                          ic.fromStationId === station.id ||
                          ic.toStationId === station.id
                      )
                      .map((ic) => {
                        const otherId =
                          ic.fromStationId === station.id
                            ? ic.toStationId
                            : ic.fromStationId;
                        const other = getStationById(otherId);
                        return other ? getLineById(other.lineId) : null;
                      })
                      .filter(Boolean);

                    return (
                      <Link
                        key={station.id}
                        href={`/station/${station.slug}`}
                        className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center w-5 shrink-0">
                          <div
                            className={`rounded-full shrink-0 ${
                              station.isInterchange
                                ? "w-3 h-3 border-[2px] border-white"
                                : "w-2 h-2"
                            }`}
                            style={{
                              backgroundColor: line.color,
                              boxShadow: station.isInterchange
                                ? `0 0 0 2px ${line.color}`
                                : undefined,
                            }}
                          />
                        </div>

                        {/* Station info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span
                              className={`text-sm ${station.isInterchange ? "font-semibold" : ""}`}
                            >
                              {station.name.th}
                            </span>
                            <span className="text-xs text-gray-400">
                              {station.name.en}
                            </span>
                          </div>
                          {connectingLines.length > 0 && (
                            <div className="flex gap-1 mt-0.5">
                              <span className="text-[10px] text-gray-400">
                                เปลี่ยน:
                              </span>
                              {connectingLines.map(
                                (cl, j) =>
                                  cl && (
                                    <span
                                      key={j}
                                      className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                                      style={{ backgroundColor: cl.color }}
                                    >
                                      {cl.name.en}
                                    </span>
                                  )
                              )}
                            </div>
                          )}
                        </div>

                        {/* Station code */}
                        <span className="text-xs text-gray-300 shrink-0">
                          {station.code}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
