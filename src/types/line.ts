import type { LineId, OperatorId } from './station';

export interface Line {
  id: LineId;
  slug: string;
  name: {
    th: string;
    en: string;
  };
  color: string;
  operatorId: OperatorId;
  operator: {
    th: string;
    en: string;
  };
  stationIds: string[];
  isLoop: boolean;
  averageIntervalMinutes: number;
}
