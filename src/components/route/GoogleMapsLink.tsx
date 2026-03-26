import type { Station } from "@/types";
import { buildGoogleMapsWalkingUrl } from "@/lib/maps";

interface Props {
  fromStation: Station;
  toStation: Station;
  label?: string;
}

export default function GoogleMapsLink({
  fromStation,
  toStation,
  label = "เปิดใน Google Maps",
}: Props) {
  const url = buildGoogleMapsWalkingUrl(
    fromStation.coordinates.lat,
    fromStation.coordinates.lng,
    toStation.coordinates.lat,
    toStation.coordinates.lng
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
      </svg>
      {label}
    </a>
  );
}
