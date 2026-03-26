import type { GraphEdge } from '@/lib/graph/types';
import type { SortMode } from '@/types';

export type WeightFn = (edge: GraphEdge) => number;

export const fastestWeight: WeightFn = (edge) => edge.travelTimeMinutes;

export const cheapestWeight: WeightFn = (edge) => {
  if (edge.isTransfer) return edge.travelTimeMinutes;
  // Approximate: ~3 THB per station as a heuristic for cost-based routing
  return edge.stationCount * 3;
};

export const fewestTransfersWeight: WeightFn = (edge) => {
  if (edge.isTransfer) return 1000 + edge.travelTimeMinutes;
  return edge.travelTimeMinutes;
};

export function getWeightFn(mode: SortMode): WeightFn {
  switch (mode) {
    case 'fastest':
      return fastestWeight;
    case 'cheapest':
      return cheapestWeight;
    case 'fewest-transfers':
      return fewestTransfersWeight;
  }
}
