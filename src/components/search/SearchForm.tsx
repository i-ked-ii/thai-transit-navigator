"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Station } from "@/types";
import { getStationById } from "@/data";
import StationAutocomplete from "./StationAutocomplete";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState<Station | null>(null);
  const [destination, setDestination] = useState<Station | null>(null);

  // Read ?from= and ?to= from URL on mount
  useEffect(() => {
    const fromId = searchParams.get("from");
    const toId = searchParams.get("to");
    if (fromId) {
      const station = getStationById(fromId);
      if (station) setOrigin(station);
    }
    if (toId) {
      const station = getStationById(toId);
      if (station) setDestination(station);
    }
  }, [searchParams]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination) return;
    router.push(`/search?from=${origin.id}&to=${destination.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && origin && destination) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4"
        onKeyDown={handleKeyDown}
      >
        <div className="flex gap-2 items-center">
          <div className="flex-1 space-y-3">
            <StationAutocomplete
              label="ต้นทาง"
              placeholder="สถานี เช่น สยาม, Asok, N8..."
              value={origin}
              onChange={setOrigin}
            />
            <StationAutocomplete
              label="ปลายทาง"
              placeholder="สถานี เช่น หมอชิต, Hua Lamphong..."
              value={destination}
              onChange={setDestination}
            />
          </div>
          <button
            type="button"
            onClick={handleSwap}
            className="mt-5 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600 shrink-0"
            aria-label="สลับต้นทางกับปลายทาง"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleSearch}
          disabled={!origin || !destination}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-base"
        >
          ค้นหาเส้นทาง
        </button>
      </div>
    </div>
  );
}
