import type { Station } from "@/types";

interface Props {
  origin: Station;
  destination: Station;
}

export default function QuickLinks({ origin, destination }: Props) {
  const { lat, lng } = destination.coordinates;
  const q = encodeURIComponent(`${destination.name.en} station Bangkok`);

  const links = [
    { icon: "🧭", label: "เส้นทาง Google Maps", url: `https://www.google.com/maps/dir/?api=1&origin=${origin.coordinates.lat},${origin.coordinates.lng}&destination=${lat},${lng}&travelmode=transit`, color: "bg-green-50 text-green-700 border-green-200" },
    { icon: "🏨", label: "โรงแรมใกล้ปลายทาง", url: `https://www.google.com/maps/search/hotel+near+${q}/@${lat},${lng},15z`, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { icon: "🚗", label: "เช่ารถใกล้ปลายทาง", url: `https://www.google.com/search?q=${encodeURIComponent(`rent a car near ${destination.name.en} station Bangkok`)}`, color: "bg-teal-50 text-teal-700 border-teal-200" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <p className="text-xs font-medium text-gray-500 mb-2">
        บริการเพิ่มเติมใกล้สถานี{destination.name.th}
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:shadow-sm ${link.color}`}
          >
            <span>{link.icon}</span>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
