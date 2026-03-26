import type { LineId, OperatorId } from './station';

export type FareType = 'distance-based' | 'zone-based' | 'flat' | 'matrix';

export type PassengerType = 'adult' | 'student' | 'senior' | 'child';

export interface FareByPassenger {
  adult: number;
  student: number;
  senior: number;
  child: number;       // 0 = free
  childNote?: string;  // e.g. "สูงไม่เกิน 90 ซม. ฟรี"
}

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
