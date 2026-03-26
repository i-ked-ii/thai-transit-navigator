import { describe, it, expect } from 'vitest';
import { buildGraph } from '@/lib/graph/builder';
import { findRoutes } from '@/lib/routing/pathfinder';
import { lines, interchanges } from '@/data';

const graph = buildGraph(lines, interchanges);

describe('Same-line routes should not have transfers', () => {
  it('BTS Sukhumvit: Phahon Yothin 59 → On Nut (same line, no transfer)', () => {
    const routes = findRoutes(graph, 'bts-sukhumvit-phahon-yothin-59', 'bts-sukhumvit-on-nut');
    expect(routes.length).toBeGreaterThan(0);

    // All routes should have 0 transfers — both on BTS Sukhumvit
    for (const route of routes) {
      expect(route.totalTransfers).toBe(0);
      expect(route.segments).toHaveLength(1);
      expect(route.segments[0].lineId).toBe('bts-sukhumvit');
    }
  });

  it('MRT Blue: Hua Lamphong → Chatuchak Park (same line, no transfer)', () => {
    const routes = findRoutes(graph, 'mrt-blue-hua-lamphong', 'mrt-blue-chatuchak-park');
    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      expect(route.totalTransfers).toBe(0);
      expect(route.segments).toHaveLength(1);
    }
  });

  it('BTS Silom: National Stadium → Bang Wa (same line, no transfer)', () => {
    const routes = findRoutes(graph, 'bts-silom-national-stadium', 'bts-silom-bang-wa');
    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      expect(route.totalTransfers).toBe(0);
    }
  });

  it('ARL: Suvarnabhumi → Phaya Thai (same line, no transfer)', () => {
    const routes = findRoutes(graph, 'arl-suvarnabhumi', 'arl-phaya-thai');
    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      expect(route.totalTransfers).toBe(0);
    }
  });
});
