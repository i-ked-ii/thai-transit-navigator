import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allStations, getStationBySlug, getLineById, getStationsByLine, lines } from '@/data';
import { interchanges } from '@/data';
import StationExplore from '@/components/route/StationExplore';
import { T } from '@/i18n';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allStations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const station = getStationBySlug(slug);
  if (!station) return { title: 'ไม่พบสถานี' };

  const line = getLineById(station.lineId);
  return {
    title: `สถานี${station.name.th} (${station.name.en}) — ${line?.name.th ?? ''}`,
    description: `ข้อมูลสถานี${station.name.th} ${station.name.en} รหัส ${station.code} ${line?.name.th ?? ''} พร้อมเส้นทาง ราคาค่าโดยสาร และสถานที่ใกล้เคียง`,
    alternates: { canonical: `/station/${station.slug}` },
  };
}

export default async function StationPage({ params }: Props) {
  const { slug } = await params;
  const station = getStationBySlug(slug);
  if (!station) notFound();

  const line = getLineById(station.lineId);
  const lineColor = line?.color ?? '#6B7280';
  const lineStations = line ? getStationsByLine(line.id) : [];

  // Find interchanges at this station
  const stationInterchanges = interchanges.filter(
    (ic) => ic.fromStationId === station.id || ic.toStationId === station.id
  );

  // Find neighboring stations on the same line
  const stationIndex = line?.stationIds.indexOf(station.id) ?? -1;
  const prevStationId = stationIndex > 0 ? line?.stationIds[stationIndex - 1] : null;
  const nextStationId = stationIndex >= 0 && stationIndex < (line?.stationIds.length ?? 0) - 1 ? line?.stationIds[stationIndex + 1] : null;
  const prevStation = prevStationId ? allStations.find((s) => s.id === prevStationId) : null;
  const nextStation = nextStationId ? allStations.find((s) => s.id === nextStationId) : null;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${station.name.th} (${station.name.en})`,
    alternateName: station.name.en,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: station.coordinates.lat,
      longitude: station.coordinates.lng,
    },
    description: `สถานีรถไฟฟ้า ${line?.name.th ?? ''} รหัส ${station.code}`,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-blue-600"><T k="nav.home" /></Link>
        <span className="mx-1">/</span>
        {line && (
          <>
            <Link href={`/line/${line.slug}`} className="hover:text-blue-600">{line.name.th}</Link>
            <span className="mx-1">/</span>
          </>
        )}
        <span className="text-gray-600">{station.name.th}</span>
      </nav>

      {/* Station header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4" style={{ borderTop: `4px solid ${lineColor}` }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{station.name.th}</h1>
              <p className="text-gray-500 mt-0.5">{station.name.en}</p>
            </div>
            <span
              className="px-3 py-1 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: lineColor }}
            >
              {station.code}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span
              className="px-2 py-0.5 rounded text-xs font-semibold text-white"
              style={{ backgroundColor: lineColor }}
            >
              {line?.name.th}
            </span>
            <span className="text-xs text-gray-500">
              {line?.operator.th}
            </span>
          </div>
        </div>

        {/* Navigation: prev/next station */}
        <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">
          {prevStation ? (
            <Link href={`/station/${prevStation.slug}`} className="text-sm text-blue-600 hover:text-blue-800">
              &larr; {prevStation.name.th}
            </Link>
          ) : <span />}
          {nextStation ? (
            <Link href={`/station/${nextStation.slug}`} className="text-sm text-blue-600 hover:text-blue-800">
              {nextStation.name.th} &rarr;
            </Link>
          ) : <span />}
        </div>
      </div>

      {/* Interchanges */}
      {stationInterchanges.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3"><T k="station.interchanges" /></h2>
          <div className="space-y-2">
            {stationInterchanges.map((ic, i) => {
              const otherId = ic.fromStationId === station.id ? ic.toStationId : ic.fromStationId;
              const other = allStations.find((s) => s.id === otherId);
              const otherLine = other ? getLineById(other.lineId) : null;
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {otherLine && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: otherLine.color }}
                    >
                      {otherLine.name.th}
                    </span>
                  )}
                  <span className="text-gray-600">
                    {other?.name.th} — <T k="station.walkMinutes" params={{ n: ic.walkingTimeMinutes }} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Explore nearby */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3"><T k="station.nearbyPlaces" /></h2>
        <StationExplore station={station} context="arrival" />
      </div>

      {/* Quick search from this station */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3"><T k="station.searchFromHere" /></h2>
        <Link
          href={`/?from=${station.id}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <T k="station.searchFrom" params={{ station: station.name.th }} />
        </Link>
      </div>
    </div>
  );
}
