import type { Station, Line, Interchange } from '@/types';
import { btsSukhumvitStations } from './stations/bts-sukhumvit';
import { btsSilomStations } from './stations/bts-silom';
import { mrtBlueStations } from './stations/mrt-blue';
import { arlStations } from './stations/arl';
import { lines } from './lines';
import { interchanges } from './interchanges';

export { lines, interchanges };

export const allStations: Station[] = [
  ...btsSukhumvitStations,
  ...btsSilomStations,
  ...mrtBlueStations,
  ...arlStations,
];

const stationMap = new Map<string, Station>();
allStations.forEach((s) => stationMap.set(s.id, s));

const stationBySlugMap = new Map<string, Station>();
allStations.forEach((s) => stationBySlugMap.set(s.slug, s));

export function getStationById(id: string): Station | undefined {
  return stationMap.get(id);
}

export function getStationBySlug(slug: string): Station | undefined {
  return stationBySlugMap.get(slug);
}

export function getLineById(id: string): Line | undefined {
  return lines.find((l) => l.id === id);
}

export function getStationsByLine(lineId: string): Station[] {
  return allStations.filter((s) => s.lineId === lineId);
}
