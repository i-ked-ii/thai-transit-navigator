import { describe, it, expect } from 'vitest';
import { buildGraph } from '@/lib/graph/builder';
import { findRoutes } from '@/lib/routing/pathfinder';
import { lines, interchanges } from '@/data';

const graph = buildGraph(lines, interchanges);

describe('Travel time accuracy', () => {
  it('ARL Hua Mak → BTS Krung Thon Buri should be ~50-55 min (Google Maps: 1hr4min incl. walking to/from)', () => {
    const routes = findRoutes(graph, 'arl-hua-mak', 'bts-silom-krung-thon-buri');
    expect(routes.length).toBeGreaterThan(0);

    const route = routes[0];
    console.log(`Total: ${Math.round(route.totalDurationMinutes)} min, ${route.totalFare} THB`);
    route.segments.forEach(s => {
      console.log(`  ${s.fromStation.name.en} → ${s.toStation.name.en} (${s.lineId}): ride ${Math.round(s.durationMinutes)} min + wait ${s.waitTimeMinutes} min, ${s.fare}฿`);
    });
    route.transfers.forEach(t => {
      console.log(`  Transfer: ${t.fromStation.name.en} → ${t.toStation.name.en}: ${t.walkingTimeMinutes} min`);
    });

    // Google Maps: ~64 min (incl ~8 min walking to/from station)
    // Our calculation: ride + wait + transfer = ~50 min
    expect(route.totalDurationMinutes).toBeGreaterThan(45);
    expect(route.totalDurationMinutes).toBeLessThan(60);
  });

  it('BTS Siam → BTS Asok should be ~11 min (ride 8 + wait 3)', () => {
    const routes = findRoutes(graph, 'bts-sukhumvit-siam', 'bts-sukhumvit-asok');
    const route = routes[0];
    console.log(`Siam → Asok: ${Math.round(route.totalDurationMinutes)} min (ride ${Math.round(route.segments[0].durationMinutes)} + wait ${route.segments[0].waitTimeMinutes})`);
    // 4 stops × 2 min = 8 ride + 3 wait = 11
    expect(route.totalDurationMinutes).toBe(11);
  });

  it('ARL segment should use 3 min/stop + 6 min wait', () => {
    const routes = findRoutes(graph, 'arl-hua-mak', 'arl-phaya-thai');
    const route = routes[0];
    console.log(`ARL Hua Mak → Phaya Thai: ${Math.round(route.totalDurationMinutes)} min`);
    // 4 stops × 3 min = 12 ride + 6 wait = 18
    expect(route.totalDurationMinutes).toBe(18);
  });
});
