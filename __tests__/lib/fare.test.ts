import { describe, it, expect } from 'vitest';
import { getBtsFare } from '@/data/fares/bts';
import { calculateBtsFare } from '@/lib/fare/bts-fare';
import { findRoutes } from '@/lib/routing/pathfinder';
import { buildGraph } from '@/lib/graph/builder';
import { lines, interchanges } from '@/data';

describe('BTS Fare Matrix', () => {
  it('should return correct fare for Siam to Asok (4 stops)', () => {
    expect(getBtsFare('CEN', 'E4')).toBe(32);
  });

  it('should return correct fare for Mo Chit to On Nut (9 stops)', () => {
    expect(getBtsFare('N8', 'E9')).toBe(47);
  });

  it('should return correct fare for Khu Khot to Kheha (max distance)', () => {
    expect(getBtsFare('N24', 'E23')).toBe(65);
  });

  it('should return 0 for same station', () => {
    expect(getBtsFare('CEN', 'CEN')).toBe(0);
  });

  it('should be symmetric (A→B = B→A)', () => {
    expect(getBtsFare('CEN', 'E4')).toBe(getBtsFare('E4', 'CEN'));
    expect(getBtsFare('N8', 'S2')).toBe(getBtsFare('S2', 'N8'));
  });

  it('should return 17 THB for 1 stop from Siam', () => {
    expect(getBtsFare('CEN', 'E1')).toBe(17);
    expect(getBtsFare('CEN', 'N1')).toBe(17);
  });

  it('should handle cross-line fares (Sukhumvit to Silom)', () => {
    // Mo Chit to Sala Daeng (cross at Siam)
    const fare = getBtsFare('N8', 'S2');
    expect(fare).toBeGreaterThan(0);
    expect(fare).toBeLessThanOrEqual(65);
  });
});

describe('Route fare calculation with real BTS data', () => {
  const graph = buildGraph(lines, interchanges);

  it('should calculate correct fare for BTS-only route (Siam → Asok)', () => {
    const routes = findRoutes(graph, 'bts-sukhumvit-siam', 'bts-sukhumvit-asok');
    expect(routes.length).toBeGreaterThan(0);
    // Siam to Asok = 32 THB
    expect(routes[0].totalFare).toBe(32);
  });

  it('should calculate cross-operator fare (BTS + MRT)', () => {
    const routes = findRoutes(graph, 'bts-sukhumvit-siam', 'mrt-blue-hua-lamphong');
    expect(routes.length).toBeGreaterThan(0);
    // Should have BTS fare + MRT fare
    const route = routes[0];
    expect(route.fareBreakdown.length).toBeGreaterThanOrEqual(2);
    expect(route.totalFare).toBeGreaterThan(0);
  });
});
