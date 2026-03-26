"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Station } from "@/types";
import { searchStations } from "@/lib/search";
import { allStations, getLineById } from "@/data";

interface Props {
  label: string;
  placeholder: string;
  value: Station | null;
  onChange: (station: Station | null) => void;
}

export default function StationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Station[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const found = searchStations(q, allStations);
    setResults(found);
    setIsOpen(found.length > 0);
    setHighlightIndex(-1);
  }, []);

  const selectStation = useCallback(
    (station: Station) => {
      onChange(station);
      setQuery(`${station.name.th} (${station.name.en})`);
      setIsOpen(false);
      setResults([]);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      selectStation(results[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.parentElement?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getLineColor = (station: Station) => {
    const line = getLineById(station.lineId);
    return line?.color ?? "#6B7280";
  };

  const getLineLabel = (station: Station) => {
    const line = getLineById(station.lineId);
    return line?.name.en ?? "";
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          handleSearch(e.target.value);
          if (value) onChange(null);
        }}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base transition-shadow"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setQuery("");
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          aria-label="ล้าง"
        >
          ✕
        </button>
      )}
      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {results.map((station, i) => (
            <li
              key={station.id}
              onClick={() => selectStation(station)}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                i === highlightIndex ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: getLineColor(station) }}
              />
              <div className="min-w-0">
                <div className="font-medium truncate">
                  {station.name.th}
                  <span className="text-gray-500 ml-1 font-normal">
                    {station.name.en}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {station.code} &middot; {getLineLabel(station)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
