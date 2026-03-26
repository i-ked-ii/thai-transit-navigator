import type { Metadata } from "next";
import Link from "next/link";
import { buildGraph } from "@/lib/graph/builder";
import { findRoutes } from "@/lib/routing/pathfinder";
import { lines, interchanges, getStationById } from "@/data";
import RouteCard from "@/components/route/RouteCard";
import QuickLinks from "@/components/route/QuickLinks";
import SearchFormCompact from "@/components/search/SearchFormCompact";

const graph = buildGraph(lines, interchanges);

interface Props {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const origin = params.from ? getStationById(params.from) : null;
  const destination = params.to ? getStationById(params.to) : null;

  if (origin && destination) {
    return {
      title: `${origin.name.th} → ${destination.name.th} | เส้นทางรถไฟฟ้า`,
      description: `วิธีเดินทางจาก ${origin.name.th} ไป ${destination.name.th} ด้วยรถไฟฟ้า BTS MRT ARL พร้อมราคาและเวลา`,
    };
  }

  return { title: "ค้นหาเส้นทาง" };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const { from, to } = params;

  if (!from || !to) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">กรุณาเลือกสถานีต้นทางและปลายทาง</p>
        <Link href="/" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
          &larr; กลับไปค้นหา
        </Link>
      </div>
    );
  }

  const origin = getStationById(from);
  const destination = getStationById(to);

  if (!origin || !destination) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500">ไม่พบสถานีที่ระบุ</p>
        <Link href="/" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
          &larr; กลับไปค้นหา
        </Link>
      </div>
    );
  }

  const routes = findRoutes(graph, from, to);

  // Google Maps transit direction URL
  const googleMapsTransitUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.coordinates.lat},${origin.coordinates.lng}&destination=${destination.coordinates.lat},${destination.coordinates.lng}&travelmode=transit`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Compact search bar */}
      <SearchFormCompact
        fromId={from}
        toId={to}
        originName={`${origin.name.th} (${origin.code})`}
        destinationName={`${destination.name.th} (${destination.code})`}
      />

      {/* Route header */}
      <div className="mt-5 mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            {origin.name.th}
            <span className="text-gray-300 font-normal">&rarr;</span>
            {destination.name.th}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {origin.name.en} ({origin.code}) &rarr; {destination.name.en} ({destination.code})
          </p>
        </div>
        <a
          href={googleMapsTransitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <span>🗺️</span>
          ดูใน Google Maps
        </a>
      </div>

      {/* Route count summary */}
      {routes.length > 0 && (
        <p className="text-sm text-gray-500 mb-3">
          พบ <strong className="text-gray-700">{routes.length}</strong> เส้นทาง
        </p>
      )}

      {/* All route results */}
      {routes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-2xl mb-2">🚫</p>
          <p className="text-gray-500">ไม่พบเส้นทางรถไฟฟ้าระหว่างสถานีที่เลือก</p>
          <a
            href={googleMapsTransitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            ลองค้นหาใน Google Maps &rarr;
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map((route, i) => (
            <RouteCard key={i} route={route} index={i} />
          ))}
        </div>
      )}

      {/* Quick Links — Hyperdia style */}
      <div className="mt-6">
        <QuickLinks origin={origin} destination={destination} />
      </div>

      {/* Disclaimer */}
      <div className="mt-6 mb-4 text-center">
        <p className="text-[11px] text-gray-400">
          ราคาค่าโดยสารอ้างอิงจากผู้ให้บริการ อาจมีการเปลี่ยนแปลง &middot;
          เวลาเดินทางเป็นค่าประมาณ &middot;
          ข้อมูลบริการใกล้สถานีจาก Google
        </p>
      </div>
    </div>
  );
}
