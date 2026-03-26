import type { LineId, OperatorId } from '@/types';

export interface GraphEdge {
  from: string;
  to: string;
  lineId: LineId | 'transfer';
  operatorId: OperatorId | 'transfer';
  travelTimeMinutes: number;
  isTransfer: boolean;
  stationCount: number;
}

export interface GraphNode {
  stationId: string;
  edges: GraphEdge[];
}

export type Graph = Map<string, GraphNode>;
