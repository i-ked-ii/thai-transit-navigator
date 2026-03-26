import type { Line, Interchange, LineId, OperatorId } from '@/types';
import type { Graph, GraphEdge } from './types';
import { createGraph, addBidirectionalEdge } from './graph';

// Real travel time per station by line (verified against BTS API + Google Maps)
// BTS API confirms exactly 2 min between all BTS stations
// ARL: Google Maps shows ~3 min/stop average (Hua Mak→Phaya Thai = 12 min, 4 stops)
// MRT Blue: Google Maps shows ~2.5 min/stop average
const TRAVEL_TIME_PER_STATION: Record<string, number> = {
  'bts-sukhumvit': 2.0, // BTS API: exactly 2 min between all stations
  'bts-silom': 2.0,     // BTS API: exactly 2 min between all stations
  'bts-gold': 2.0,      // BTS API: 2 min
  'arl': 3.0,           // Google Maps: Hua Mak→Phaya Thai 12 min / 4 stops
  'mrt-blue': 2.5,      // Google Maps verified average
  'mrt-purple': 2.5,    // Similar to MRT Blue
  'default': 2.5,
};

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
  const timePerStation = TRAVEL_TIME_PER_STATION[line.id] ?? TRAVEL_TIME_PER_STATION['default'];

  // Connect consecutive stations
  for (let i = 0; i < stationIds.length - 1; i++) {
    const edge: GraphEdge = {
      from: stationIds[i],
      to: stationIds[i + 1],
      lineId: line.id,
      operatorId: line.operatorId,
      travelTimeMinutes: timePerStation,
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
      travelTimeMinutes: timePerStation,
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
