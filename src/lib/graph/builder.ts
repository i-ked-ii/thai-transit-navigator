import type { Line, Interchange, LineId, OperatorId } from '@/types';
import type { Graph, GraphEdge } from './types';
import { createGraph, addBidirectionalEdge } from './graph';

const AVERAGE_TRAVEL_TIME_PER_STATION = 2.5; // minutes

export function buildGraph(lines: Line[], interchanges: Interchange[]): Graph {
  const graph = createGraph();

  for (const line of lines) {
    addLineEdges(graph, line);
  }

  for (const interchange of interchanges) {
    addTransferEdge(graph, interchange);
  }

  return graph;
}

function addLineEdges(graph: Graph, line: Line): void {
  const { stationIds, isLoop } = line;

  // Connect consecutive stations
  for (let i = 0; i < stationIds.length - 1; i++) {
    const edge: GraphEdge = {
      from: stationIds[i],
      to: stationIds[i + 1],
      lineId: line.id,
      operatorId: line.operatorId,
      travelTimeMinutes: AVERAGE_TRAVEL_TIME_PER_STATION,
      isTransfer: false,
      stationCount: 1,
    };
    addBidirectionalEdge(graph, edge);
  }

  // If loop line, connect last station back to first
  if (isLoop && stationIds.length > 2) {
    const edge: GraphEdge = {
      from: stationIds[stationIds.length - 1],
      to: stationIds[0],
      lineId: line.id,
      operatorId: line.operatorId,
      travelTimeMinutes: AVERAGE_TRAVEL_TIME_PER_STATION,
      isTransfer: false,
      stationCount: 1,
    };
    addBidirectionalEdge(graph, edge);
  }
}

function addTransferEdge(graph: Graph, interchange: Interchange): void {
  const edge: GraphEdge = {
    from: interchange.fromStationId,
    to: interchange.toStationId,
    lineId: 'transfer' as LineId | 'transfer',
    operatorId: 'transfer' as OperatorId | 'transfer',
    travelTimeMinutes: interchange.walkingTimeMinutes,
    isTransfer: true,
    stationCount: 0,
  };
  addBidirectionalEdge(graph, edge);
}
