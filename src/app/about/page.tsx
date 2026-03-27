import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/i18n";

export const metadata: Metadata = {
  title: "เกี่ยวกับ Thai Transit",
  description:
    "Thai Transit คือบริการค้นหาเส้นทางรถไฟฟ้าในประเทศไทย แนะนำเส้นทาง ราคา และข้อมูลสถานที่ใกล้เคียง",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <span className="text-5xl mb-4 block">🚆</span>
        <h1 className="text-3xl font-bold mb-2">
          Thai<span className="text-blue-600">Transit</span>
        </h1>
        <p className="text-gray-500 text-lg">
          <T k="about.subtitle" />
        </p>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3"><T k="about.whatIs" /></h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          <T k="about.desc1" />
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          <T k="about.desc2" />
        </p>
        <p className="text-gray-600 leading-relaxed">
          <T k="about.desc3" />
        </p>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4"><T k="about.features" /></h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: "🔍", titleKey: "about.feat.search", descKey: "about.feat.searchDesc" },
            { icon: "💰", titleKey: "about.feat.fare", descKey: "about.feat.fareDesc" },
            { icon: "🗺️", titleKey: "about.feat.maps", descKey: "about.feat.mapsDesc" },
            { icon: "🚉", titleKey: "about.feat.station", descKey: "about.feat.stationDesc" },
            { icon: "⏱", titleKey: "about.feat.time", descKey: "about.feat.timeDesc" },
            { icon: "📱", titleKey: "about.feat.mobile", descKey: "about.feat.mobileDesc" },
          ].map((f) => (
            <div key={f.titleKey} className="flex gap-3">
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div>
                <h3 className="font-medium text-sm"><T k={f.titleKey} /></h3>
                <p className="text-xs text-gray-500 mt-0.5"><T k={f.descKey} /></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4"><T k="about.coverage" /></h2>
        <div className="space-y-2">
          {[
            { color: "#7DC242", nameKey: "about.btsSukhumvit", stationsKey: "about.btsSukhumvitStations", routeKey: "about.btsSukhumvitRoute", href: "/line/bts-sukhumvit" },
            { color: "#00847F", nameKey: "about.btsSilom", stationsKey: "about.btsSilomStations", routeKey: "about.btsSilomRoute", href: "/line/bts-silom" },
            { color: "#1E3A8A", nameKey: "about.mrtBlue", stationsKey: "about.mrtBlueStations", routeKey: "about.mrtBlueRoute", href: "/line/mrt-blue" },
            { color: "#800080", nameKey: "about.mrtPurple", stationsKey: "about.mrtPurpleStations", routeKey: "about.mrtPurpleRoute", href: "/line/mrt-purple" },
            { color: "#E4002B", nameKey: "about.arl", stationsKey: "about.arlStations", routeKey: "about.arlRoute", href: "/line/arl" },
          ].map((line) => (
            <Link
              key={line.nameKey}
              href={line.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: line.color }} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium"><T k={line.nameKey} /></span>
                <span className="text-xs text-gray-400 ml-2"><T k={line.stationsKey} /></span>
                <p className="text-xs text-gray-400 truncate"><T k={line.routeKey} /></p>
              </div>
              <span className="text-gray-300">&rarr;</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3"><T k="about.dataSources" /></h2>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li><T k="about.dataFare" /></li>
          <li><T k="about.dataTime" /></li>
          <li><T k="about.dataNearby" /></li>
        </ul>
        <p className="text-xs text-gray-400 mt-3">
          <T k="about.dataDisclaimer" />
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3"><T k="about.disclaimer" /></h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          <T k="about.disclaimerText" />
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <T k="about.startSearch" />
        </Link>
      </div>
    </div>
  );
}
