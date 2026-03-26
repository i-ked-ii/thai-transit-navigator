import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lines, getStationById, getLineById } from '@/data';
import { interchanges } from '@/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return lines.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const line = lines.find((l) => l.slug === slug);
  if (!line) return { title: 'ไม่พบสายรถไฟฟ้า' };

  return {
    title: `${line.name.th} (${line.name.en}) — รถไฟฟ้า${line.operator.th}`,
    description: `ข้อมูลรถไฟฟ้า${line.name.th} ${line.name.en} ${line.stationIds.length} สถานี สาย${line.operator.th} พร้อมรายชื่อสถานีและจุดเปลี่ยนสาย`,
    alternates: { canonical: `/line/${line.slug}` },
  };
}

export default async function LinePage({ params }: Props) {
  const { slug } = await params;
  const line = lines.find((l) => l.slug === slug);
  if (!line) notFound();

  const stations = line.stationIds.map(getStationById).filter(Boolean);

  // Find interchanges on this line
  const lineInterchanges = interchanges.filter(
    (ic) => line.stationIds.includes(ic.fromStationId) || line.stationIds.includes(ic.toStationId)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-blue-600">หน้าแรก</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">{line.name.th}</span>
      </nav>

      {/* Line header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
        style={{ borderTop: `4px solid ${line.color}` }}
      >
        <div className="px-5 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: line.color }}
            >
              {line.name.en}
            </span>
            {line.name.th}
          </h1>
          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            <span>ผู้ให้บริการ: {line.operator.th}</span>
            <span>{stations.length} สถานี</span>
            <span>รถมาทุก ~{line.averageIntervalMinutes} นาที</span>
            {line.isLoop && <span className="text-blue-600">วงรอบ</span>}
          </div>
        </div>
      </div>

      {/* Station list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">สถานีทั้งหมด</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {stations.map((station, i) => {
            if (!station) return null;
            const isInterchange = station.isInterchange;
            // Find what lines connect here
            const connectingInterchanges = lineInterchanges.filter(
              (ic) => ic.fromStationId === station.id || ic.toStationId === station.id
            );
            const connectingLines = connectingInterchanges.map((ic) => {
              const otherId = ic.fromStationId === station.id ? ic.toStationId : ic.fromStationId;
              const other = getStationById(otherId);
              return other ? getLineById(other.lineId) : null;
            }).filter(Boolean);

            return (
              <Link
                key={station.id}
                href={`/station/${station.slug}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center w-5 shrink-0">
                  <div
                    className={`rounded-full shrink-0 ${isInterchange ? 'w-3.5 h-3.5 border-[3px] border-white' : 'w-2.5 h-2.5'}`}
                    style={{
                      backgroundColor: line.color,
                      boxShadow: isInterchange ? `0 0 0 2px ${line.color}` : undefined,
                    }}
                  />
                </div>

                {/* Station info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{station.name.th}</span>
                    <span className="text-xs text-gray-400">{station.name.en}</span>
                  </div>
                  {connectingLines.length > 0 && (
                    <div className="flex gap-1 mt-0.5">
                      {connectingLines.map((cl, j) => cl && (
                        <span
                          key={j}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                          style={{ backgroundColor: cl.color }}
                        >
                          {cl.name.en}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Station code */}
                <span className="text-xs text-gray-400 shrink-0">{station.code}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
