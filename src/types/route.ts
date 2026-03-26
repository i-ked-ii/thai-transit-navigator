import type { Station, LineId, OperatorId } from './station';

export interface Interchange {
  fromStationId: string;
  toStationId: string;
  walkingTimeMinutes: number;
  description?: {
    th: string;
    en: string;
  };
}

export interface RouteSegment {
  lineId: LineId;
  operatorId: OperatorId;
  fromStation: Station;
  toStation: Station;
  intermediateStations: Station[];
  durationMinutes: number;
  fare: number;
}

export interface Transfer {
  fromStation: Station;
  toStation: Station;
  walkingTimeMinutes: number;
}

export interface FareBreakdownItem {
  operatorId: OperatorId;
  lineId: LineId;
  lineName: { th: string; en: string };
  fare: number;
  fromStation: string;
  toStation: string;
}

export interface Route {
  segments: RouteSegment[];
  transfers: Transfer[];
  totalDurationMinutes: number;
  totalFare: number;
  totalTransfers: number;
  fareBreakdown: FareBreakdownItem[];
}

export type SortMode = 'fastest' | 'cheapest' | 'fewest-transfers';

export interface RouteSearchResult {
  routes: Route[];
  origin: Station;
  destination: Station;
  searchedAt: string;
}
