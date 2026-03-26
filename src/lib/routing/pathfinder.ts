import type { Station, Route, RouteSegment, Transfer, FareBreakdownItem, SortMode, LineId, OperatorId } from '@/types';
import type { FareByPassenger } from '@/types';
import type { Graph, GraphEdge } from '@/lib/graph/types';
import { dijkstra } from './dijkstra';
import { getWeightFn } from './weight';
import { allStations, getStationById, getLineById } from '@/data';
import { calculateFare, calculateFareByType } from '@/lib/fare/calculator';

export function findRoutes(
  graph: Graph,
  originId: string,
  destinationId: string,
): Route[] {
  const modes: SortMode[] = ['fastest', 'cheapest', 'fewest-transfers'];
  const results: Route[] = [];
  const seenPaths = new Set<string>();

  // 1) Find routes using each weight strategy
  for (const mode of modes) {
    const weightFn = getWeightFn(mode);
    const result = dijkstra(graph, originId, destinationId, weightFn);

    if (!result) continue;

    const pathKey = result.path.join('→');
    if (seenPaths.has(pathKey)) continue;
    seenPaths.add(pathKey);

    const route = buildRoute(graph, result.path);
    if (route) results.push(route);
  }

  // 2) Find alternative routes via interchange stations
  //    Skip if origin and destination are on the same line (direct route is always best)
  const originStation = getStationById(originId);
  const destStation = getStationById(destinationId);
  const sameLine = originStation && destStation && originStation.lineId === destStation.lineId;

  if (!sameLine) {
    const alternativeViaStations = findAlternativeViaStations(graph, originId, destinationId);
    for (const viaId of alternativeViaStations) {
      const weightFn = getWeightFn('fastest');
      const leg1 = dijkstra(graph, originId, viaId, weightFn);
      const leg2 = dijkstra(graph, viaId, destinationId, weightFn);

      if (!leg1 || !leg2) continue;

      const combinedPath = [...leg1.path, ...leg2.path.slice(1)];
      const pathKey = combinedPath.join('→');
      if (seenPaths.has(pathKey)) continue;
      seenPaths.add(pathKey);

      const route = buildRoute(graph, combinedPath);
      if (!route) continue;

      // Only add if it's meaningfully different (not just adding unnecessary transfers)
      const bestTransfers = results.length > 0 ? Math.min(...results.map(r => r.totalTransfers)) : Infinity;
      if (route.totalTransfers <= bestTransfers + 1) {
        results.push(route);
      }
    }
  }

  // If same line, remove any routes with unnecessary transfers
  if (sameLine) {
    const directRoutes = results.filter((r) => r.totalTransfers === 0);
    if (directRoutes.length > 0) {
      return directRoutes;
    }
  }

  // Sort: fewest transfers first, then by time
  results.sort((a, b) => {
    if (a.totalTransfers !== b.totalTransfers) return a.totalTransfers - b.totalTransfers;
    return a.totalDurationMinutes - b.totalDurationMinutes;
  });

  return results;
}

function findAlternativeViaStations(graph: Graph, originId: string, destinationId: string): string[] {
  const interchangeStations = [
    'bts-sukhumvit-siam', 'bts-silom-siam',
    'bts-sukhumvit-asok', 'mrt-blue-sukhumvit',
    'bts-silom-sala-daeng', 'mrt-blue-si-lom',
    'bts-sukhumvit-mo-chit', 'mrt-blue-chatuchak-park',
    'bts-sukhumvit-phaya-thai', 'arl-phaya-thai',
    'arl-makkasan', 'mrt-blue-phetchaburi',
    'bts-silom-bang-wa', 'mrt-blue-bang-wa-mrt',
    'mrt-blue-tao-poon', 'bts-sukhumvit-ha-yaek-lat-phrao',
    'mrt-blue-phahon-yothin',
  ];

  return interchangeStations.filter(
    (id) => id !== originId && id !== destinationId && graph.has(id)
  );
}

function buildRoute(graph: Graph, path: string[]): Route | null {
  if (path.length < 2) return null;

  const segments: RouteSegment[] = [];
  const transfers: Transfer[] = [];

  let currentSegmentStations: string[] = [path[0]];
  let currentLineId: LineId | 'transfer' | null = null;
  let currentOperatorId: OperatorId | 'transfer' | null = null;

  // Walk through path and identify edges
  for (let i = 0; i < path.length - 1; i++) {
    const edge = findEdge(graph, path[i], path[i + 1]);
    if (!edge) return null;

    if (edge.isTransfer) {
      // Finalize current segment
      if (currentSegmentStations.length >= 2 && currentLineId && currentLineId !== 'transfer') {
        const segment = createSegment(graph, currentSegmentStations, currentLineId as LineId, currentOperatorId as OperatorId);
        if (segment) segments.push(segment);
      }

      // Add transfer
      const fromStation = getStationById(path[i]);
      const toStation = getStationById(path[i + 1]);
      if (fromStation && toStation) {
        transfers.push({
          fromStation,
          toStation,
          walkingTimeMinutes: edge.travelTimeMinutes,
        });
      }

      // Start new segment
      currentSegmentStations = [path[i + 1]];
      currentLineId = null;
      currentOperatorId = null;
    } else {
      if (currentLineId === null) {
        currentLineId = edge.lineId;
        currentOperatorId = edge.operatorId;
      } else if (currentLineId !== edge.lineId) {
        // Line changed without transfer (shouldn't happen in normal graph)
        if (currentSegmentStations.length >= 2) {
          const segment = createSegment(graph, currentSegmentStations, currentLineId as LineId, currentOperatorId as OperatorId);
          if (segment) segments.push(segment);
        }
        currentSegmentStations = [path[i]];
        currentLineId = edge.lineId;
        currentOperatorId = edge.operatorId;
      }
      currentSegmentStations.push(path[i + 1]);
    }
  }

  // Finalize last segment
  if (currentSegmentStations.length >= 2 && currentLineId && currentLineId !== 'transfer') {
    const segment = createSegment(graph, currentSegmentStations, currentLineId as LineId, currentOperatorId as OperatorId);
    if (segment) segments.push(segment);
  }

  const totalDurationMinutes = segments.reduce((sum, s) => sum + s.durationMinutes + s.waitTimeMinutes, 0)
    + transfers.reduce((sum, t) => sum + t.walkingTimeMinutes, 0);

  const fareBreakdown: FareBreakdownItem[] = segments.map((s) => {
    const line = getLineById(s.lineId);
    return {
      operatorId: s.operatorId,
      lineId: s.lineId,
      lineName: line?.name ?? { th: '', en: '' },
      fare: s.fare,
      fareByType: s.fareByType,
      fromStation: s.fromStation.name.en,
      toStation: s.toStation.name.en,
    };
  });

  const totalFare = fareBreakdown.reduce((sum, f) => sum + f.fare, 0);
  const totalFareByType: FareByPassenger = {
    adult: segments.reduce((sum, s) => sum + s.fareByType.adult, 0),
    student: segments.reduce((sum, s) => sum + s.fareByType.student, 0),
    senior: segments.reduce((sum, s) => sum + s.fareByType.senior, 0),
    child: segments.reduce((sum, s) => sum + s.fareByType.child, 0),
  };

  return {
    segments,
    transfers,
    totalDurationMinutes,
    totalFare,
    totalFareByType,
    totalTransfers: transfers.length,
    fareBreakdown,
  };
}

function createSegment(
  graph: Graph,
  stationIds: string[],
  lineId: LineId,
  operatorId: OperatorId,
): RouteSegment | null {
  const stations = stationIds.map(getStationById).filter(Boolean) as Station[];
  if (stations.length < 2) return null;

  const fromStation = stations[0];
  const toStation = stations[stations.length - 1];
  const intermediateStations = stations.slice(1, -1);

  // Calculate duration from actual edge weights
  let durationMinutes = 0;
  for (let i = 0; i < stationIds.length - 1; i++) {
    const edge = findEdge(graph, stationIds[i], stationIds[i + 1]);
    durationMinutes += edge?.travelTimeMinutes ?? 2.5;
  }

  const fareByType = calculateFareByType(operatorId, fromStation, toStation, stations.length);

  // Average wait time = half of train frequency
  const waitTimeMinutes = getAverageWaitTime(lineId);

  return {
    lineId,
    operatorId,
    fromStation,
    toStation,
    intermediateStations,
    durationMinutes,
    waitTimeMinutes,
    fare: fareByType.adult,
    fareByType,
  };
}

// Average wait = half of frequency interval (based on operator data)
function getAverageWaitTime(lineId: LineId): number {
  const waitTimes: Record<string, number> = {
    'bts-sukhumvit': 3,  // trains every ~5-6 min
    'bts-silom': 3,      // trains every ~5-6 min
    'bts-gold': 6,       // trains every ~12 min
    'mrt-blue': 3,       // trains every ~5-6 min
    'mrt-purple': 4,     // trains every ~7-8 min
    'arl': 6,            // trains every ~12 min
  };
  return waitTimes[lineId] ?? 4;
}

function findEdge(graph: Graph, from: string, to: string): GraphEdge | undefined {
  const node = graph.get(from);
  if (!node) return undefined;
  return node.edges.find((e) => e.to === to);
}
