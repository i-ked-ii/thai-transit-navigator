import type { LineId, OperatorId } from './station';

export type FareType = 'distance-based' | 'zone-based' | 'flat' | 'matrix';

export interface FareRule {
  operatorId: OperatorId;
  lineId: LineId;
  type: FareType;
  baseFare: number;
  perKmRate?: number;
  maxFare: number;
  minFare: number;
  fareMatrix?: Record<string, Record<string, number>>;
  brackets?: Array<{
    fromKm: number;
    toKm: number;
    farePerKm: number;
  }>;
}
