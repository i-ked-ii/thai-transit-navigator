import type { Station } from '@/types';

export function searchStations(query: string, allStations: Station[]): Station[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];

  return allStations
    .map((station) => ({
      station,
      score: Math.max(
        substringScore(normalized, station.name.en.toLowerCase()),
        substringScore(normalized, station.name.th),
        substringScore(normalized, station.code.toLowerCase()),
      ),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((r) => r.station);
}

function substringScore(query: string, target: string): number {
  if (target === query) return 1;
  if (target.startsWith(query)) return 0.8;
  if (target.includes(query)) return 0.5;
  return 0;
}
