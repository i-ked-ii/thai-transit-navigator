import type { Station } from '@/types';
import { getBtsFare } from '@/data/fares/bts';

export function calculateBtsFare(fromStation: Station, toStation: Station): number {
  const fare = getBtsFare(fromStation.code, toStation.code);
  if (fare !== null) return fare;

  // Fallback estimate if fare not found in matrix
  return 32;
}
