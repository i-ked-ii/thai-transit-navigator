import { describe, it, expect } from 'vitest';
import { createGraph, addNode, addEdge, addBidirectionalEdge, getNode, getEdges } from '@/lib/graph/graph';
import { buildGraph } from '@/lib/graph/builder';
import { lines, interchanges } from '@/data';
import type { GraphEdge } from '@/lib/graph/types';

describe('Graph', () => {
  it('should create an empty graph', () => {
    const graph = createGraph();
    expect(graph.size).toBe(0);
  });

  it('should add nodes', () => {
    const graph = createGraph();
    addNode(graph, 'station-a');
    addNode(graph, 'station-b');
    expect(graph.size).toBe(2);
    expect(getNode(graph, 'station-a')).toBeDefined();
  });

  it('should add edges', () => {
    const graph = createGraph();
    const edge: GraphEdge = {
      from: 'a',
      to: 'b',
      lineId: 'bts-sukhumvit',
      operatorId: 'bts',
      travelTimeMinutes: 2.5,
      isTransfer: false,
      stationCount: 1,
    };
    addEdge(graph, edge);

    const edges = getEdges(graph, 'a');
    expect(edges).toHaveLength(1);
    expect(edges[0].to).toBe('b');

    // One-directional: b should have no edges
    expect(getEdges(graph, 'b')).toHaveLength(0);
  });

  it('should add bidirectional edges', () => {
    const graph = createGraph();
    const edge: GraphEdge = {
      from: 'a',
      to: 'b',
      lineId: 'bts-sukhumvit',
      operatorId: 'bts',
      travelTimeMinutes: 2.5,
      isTransfer: false,
      stationCount: 1,
    };
    addBidirectionalEdge(graph, edge);

    expect(getEdges(graph, 'a')).toHaveLength(1);
    expect(getEdges(graph, 'b')).toHaveLength(1);
    expect(getEdges(graph, 'b')[0].to).toBe('a');
  });

  it('should return empty edges for non-existent node', () => {
    const graph = createGraph();
    expect(getEdges(graph, 'nonexistent')).toEqual([]);
  });
});

describe('buildGraph', () => {
  it('should build a graph from lines and interchanges', () => {
    const graph = buildGraph(lines, interchanges);
    expect(graph.size).toBeGreaterThan(0);
  });

  it('should have bidirectional edges for all line connections', () => {
    const graph = buildGraph(lines, interchanges);

    // Check BTS Sukhumvit: Siam → Chit Lom should have both directions
    const siamEdges = getEdges(graph, 'bts-sukhumvit-siam');
    const chitLomEdges = getEdges(graph, 'bts-sukhumvit-chit-lom');

    const siamToChitLom = siamEdges.find((e) => e.to === 'bts-sukhumvit-chit-lom');
    const chitLomToSiam = chitLomEdges.find((e) => e.to === 'bts-sukhumvit-siam');

    expect(siamToChitLom).toBeDefined();
    expect(chitLomToSiam).toBeDefined();
  });

  it('should have transfer edges for interchanges', () => {
    const graph = buildGraph(lines, interchanges);

    // BTS Asok ↔ MRT Sukhumvit
    const asokEdges = getEdges(graph, 'bts-sukhumvit-asok');
    const transferEdge = asokEdges.find((e) => e.to === 'mrt-blue-sukhumvit');

    expect(transferEdge).toBeDefined();
    expect(transferEdge!.isTransfer).toBe(true);
    expect(transferEdge!.travelTimeMinutes).toBe(5);
  });

  it('should handle MRT Blue Line loop', () => {
    const graph = buildGraph(lines, interchanges);
    const blueLine = lines.find((l) => l.id === 'mrt-blue')!;
    const lastStationId = blueLine.stationIds[blueLine.stationIds.length - 1];
    const firstStationId = blueLine.stationIds[0];

    const lastEdges = getEdges(graph, lastStationId);
    const loopEdge = lastEdges.find((e) => e.to === firstStationId);

    expect(loopEdge).toBeDefined();
    expect(loopEdge!.lineId).toBe('mrt-blue');
  });
});
