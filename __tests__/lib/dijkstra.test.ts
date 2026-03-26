import { describe, it, expect } from 'vitest';
import { dijkstra } from '@/lib/routing/dijkstra';
import { buildGraph } from '@/lib/graph/builder';
import { createGraph, addBidirectionalEdge } from '@/lib/graph/graph';
import { fastestWeight, fewestTransfersWeight } from '@/lib/routing/weight';
import { lines, interchanges } from '@/data';
import type { GraphEdge } from '@/lib/graph/types';

describe('Dijkstra', () => {
  it('should find path between adjacent stations', () => {
    const graph = createGraph();
    addBidirectionalEdge(graph, {
      from: 'a', to: 'b',
      lineId: 'bts-sukhumvit', operatorId: 'bts',
      travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1,
    });

    const result = dijkstra(graph, 'a', 'b', fastestWeight);
    expect(result).not.toBeNull();
    expect(result!.path).toEqual(['a', 'b']);
    expect(result!.totalWeight).toBe(2.5);
  });

  it('should find path through multiple stations', () => {
    const graph = createGraph();
    const stations = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < stations.length - 1; i++) {
      addBidirectionalEdge(graph, {
        from: stations[i], to: stations[i + 1],
        lineId: 'bts-sukhumvit', operatorId: 'bts',
        travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1,
      });
    }

    const result = dijkstra(graph, 'a', 'd', fastestWeight);
    expect(result).not.toBeNull();
    expect(result!.path).toEqual(['a', 'b', 'c', 'd']);
    expect(result!.totalWeight).toBe(7.5);
  });

  it('should return null when no path exists', () => {
    const graph = createGraph();
    addBidirectionalEdge(graph, {
      from: 'a', to: 'b',
      lineId: 'bts-sukhumvit', operatorId: 'bts',
      travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1,
    });
    addBidirectionalEdge(graph, {
      from: 'c', to: 'd',
      lineId: 'mrt-blue', operatorId: 'mrt',
      travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1,
    });

    const result = dijkstra(graph, 'a', 'd', fastestWeight);
    expect(result).toBeNull();
  });

  it('should return same station when origin equals destination', () => {
    const graph = createGraph();
    addBidirectionalEdge(graph, {
      from: 'a', to: 'b',
      lineId: 'bts-sukhumvit', operatorId: 'bts',
      travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1,
    });

    const result = dijkstra(graph, 'a', 'a', fastestWeight);
    expect(result).not.toBeNull();
    expect(result!.path).toEqual(['a']);
    expect(result!.totalWeight).toBe(0);
  });

  it('should prefer fewer transfers with fewestTransfersWeight', () => {
    const graph = createGraph();

    // Direct path: a → b → c → d (same line, 7.5 min)
    addBidirectionalEdge(graph, { from: 'a', to: 'b', lineId: 'bts-sukhumvit', operatorId: 'bts', travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1 });
    addBidirectionalEdge(graph, { from: 'b', to: 'c', lineId: 'bts-sukhumvit', operatorId: 'bts', travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1 });
    addBidirectionalEdge(graph, { from: 'c', to: 'd', lineId: 'bts-sukhumvit', operatorId: 'bts', travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1 });

    // Shorter path with transfer: a → x → d (5 min + 3 min transfer)
    addBidirectionalEdge(graph, { from: 'a', to: 'x', lineId: 'mrt-blue', operatorId: 'mrt', travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1 });
    addBidirectionalEdge(graph, { from: 'x', to: 'y', lineId: 'transfer' as any, operatorId: 'transfer' as any, travelTimeMinutes: 3, isTransfer: true, stationCount: 0 });
    addBidirectionalEdge(graph, { from: 'y', to: 'd', lineId: 'bts-sukhumvit', operatorId: 'bts', travelTimeMinutes: 2.5, isTransfer: false, stationCount: 1 });

    const result = dijkstra(graph, 'a', 'd', fewestTransfersWeight);
    expect(result).not.toBeNull();
    // Should take the no-transfer path even though it's slightly longer
    expect(result!.path).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('Dijkstra with real data', () => {
  const graph = buildGraph(lines, interchanges);

  it('should find route on same line (BTS Siam → Asok)', () => {
    const result = dijkstra(graph, 'bts-sukhumvit-siam', 'bts-sukhumvit-asok', fastestWeight);
    expect(result).not.toBeNull();
    expect(result!.path.length).toBeGreaterThan(2);
    expect(result!.path[0]).toBe('bts-sukhumvit-siam');
    expect(result!.path[result!.path.length - 1]).toBe('bts-sukhumvit-asok');
  });

  it('should find cross-line route (BTS Asok → MRT Hua Lamphong)', () => {
    const result = dijkstra(graph, 'bts-sukhumvit-asok', 'mrt-blue-hua-lamphong', fastestWeight);
    expect(result).not.toBeNull();
    // Should go through BTS Asok → MRT Sukhumvit (transfer) → ... → Hua Lamphong
    expect(result!.path).toContain('mrt-blue-sukhumvit');
  });

  it('should find route from BTS to ARL via Phaya Thai', () => {
    const result = dijkstra(graph, 'bts-sukhumvit-siam', 'arl-suvarnabhumi', fastestWeight);
    expect(result).not.toBeNull();
    // Should transfer at Phaya Thai
    expect(result!.path).toContain('bts-sukhumvit-phaya-thai');
    expect(result!.path).toContain('arl-phaya-thai');
  });
});
