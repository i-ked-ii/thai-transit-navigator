import type { Station } from "@/types";

interface Props {
  station: Station;
  context?: "departure" | "intermediate" | "transfer" | "arrival";
}

interface ExploreLink {
  icon: string;
  label: string;
  url: string;
  color: string;
}

function buildLinks(station: Station, context: string): ExploreLink[] {
  const { lat, lng } = station.coordinates;
  const name = station.name.en;
  const q = encodeURIComponent(`${name} station Bangkok`);

  // Intermediate stations: show fewer links
  if (context === "intermediate") {
    return [
      {
        icon: "🗺️",
        label: "Map",
        url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        color: "bg-gray-50 text-gray-500 hover:bg-gray-100",
      },
      {
        icon: "🍜",
        label: "อาหาร",
        url: `https://www.google.com/maps/search/restaurant+near+${q}/@${lat},${lng},15z`,
        color: "bg-gray-50 text-gray-500 hover:bg-gray-100",
      },
      {
        icon: "📍",
        label: "สถานที่",
        url: `https://www.google.com/maps/search/attraction+near+${q}/@${lat},${lng},15z`,
        color: "bg-gray-50 text-gray-500 hover:bg-gray-100",
      },
    ];
  }

  // Main stations: full links
  const links: ExploreLink[] = [
    {
      icon: "🗺️",
      label: "Map",
      url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      icon: "🍜",
      label: "อาหาร",
      url: `https://www.google.com/maps/search/restaurant+near+${q}/@${lat},${lng},15z`,
      color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    },
    {
      icon: "☕",
      label: "คาเฟ่",
      url: `https://www.google.com/maps/search/cafe+near+${q}/@${lat},${lng},15z`,
      color: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    },
    {
      icon: "📍",
      label: "สถานที่",
      url: `https://www.google.com/maps/search/attraction+near+${q}/@${lat},${lng},15z`,
      color: "bg-rose-50 text-rose-700 hover:bg-rose-100",
    },
  ];

  if (context === "transfer" || context === "arrival") {
    links.push(
      {
        icon: "🏨",
        label: "โรงแรม",
        url: `https://www.google.com/maps/search/hotel+near+${q}/@${lat},${lng},15z`,
        color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
      },
      {
        icon: "🛍️",
        label: "ช้อปปิ้ง",
        url: `https://www.google.com/maps/search/shopping+mall+near+${q}/@${lat},${lng},15z`,
        color: "bg-pink-50 text-pink-700 hover:bg-pink-100",
      },
    );
  }

  if (context === "arrival") {
    links.push({
      icon: "🚗",
      label: "เช่ารถ",
      url: `https://www.google.com/search?q=${encodeURIComponent(`rent a car near ${name} station Bangkok`)}`,
      color: "bg-teal-50 text-teal-700 hover:bg-teal-100",
    });
  }

  return links;
}

export default function StationExplore({ station, context = "intermediate" }: Props) {
  const links = buildLinks(station, context);

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium transition-colors ${link.color}`}
          title={`${link.label} ใกล้สถานี${station.name.th}`}
        >
          <span className="text-[10px]">{link.icon}</span>
          {link.label}
        </a>
      ))}
    </div>
  );
}
