"use client";

import { useRouter } from "next/navigation";

interface Props {
  fromId: string;
  toId: string;
  originName: string;
  destinationName: string;
}

export default function SearchFormCompact({
  fromId,
  toId,
  originName,
  destinationName,
}: Props) {
  const router = useRouter();

  const handleSwap = () => {
    router.push(`/search?from=${toId}&to=${fromId}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="truncate font-medium">{originName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <span className="truncate font-medium">{destinationName}</span>
        </div>
      </div>
      <button
        onClick={handleSwap}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600 shrink-0"
        aria-label="สลับเส้นทาง"
        title="สลับต้นทาง-ปลายทาง"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </button>
      <a
        href="/"
        className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
      >
        ค้นหาใหม่
      </a>
    </div>
  );
}
