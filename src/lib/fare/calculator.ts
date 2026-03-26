import type { Station, OperatorId, RouteSegment } from '@/types';
import { calculateBtsFare } from './bts-fare';

export function calculateSegmentFare(segment: RouteSegment): number {
  return calculateFare(segment.operatorId, segment.fromStation, segment.toStation, segment.intermediateStations.length + 2);
}

export function calculateFare(
  operatorId: OperatorId,
  fromStation: Station,
  toStation: Station,
  stationCount: number,
): number {
  switch (operatorId) {
    case 'bts':
      return calculateBtsFare(fromStation, toStation);
    case 'mrt':
      return calculateMrtBlueFare(stationCount);
    case 'arl':
      return calculateArlFare(stationCount);
    case 'srt':
      return calculateSrtFare(stationCount);
    default:
      return 20;
  }
}

// MRT Blue Line: station-count based fare (17-45 THB)
function calculateMrtBlueFare(stationCount: number): number {
  if (stationCount <= 1) return 0;
  const stops = stationCount - 1;

  // MRT Blue Line fare structure
  const fareTable = [0, 17, 19, 21, 24, 26, 28, 30, 32, 35, 37, 39, 42, 42, 42, 42, 42];
  if (stops < fareTable.length) return fareTable[stops];
  return 42;
}

// ARL: distance-based fare (15-45 THB)
function calculateArlFare(stationCount: number): number {
  if (stationCount <= 1) return 0;
  const stops = stationCount - 1;

  // ARL fare table
  const fareTable = [0, 15, 20, 25, 30, 35, 40, 45];
  if (stops < fareTable.length) return fareTable[stops];
  return 45;
}

// SRT estimate
function calculateSrtFare(stationCount: number): number {
  if (stationCount <= 1) return 0;
  return Math.min(12 + (stationCount - 2) * 3, 42);
}
