import type { Graph } from '@/lib/graph/types';
import type { WeightFn } from './weight';

export interface DijkstraResult {
  path: string[];
  totalWeight: number;
}

export function dijkstra(
  graph: Graph,
  startId: string,
  endId: string,
  weightFn: WeightFn,
): DijkstraResult | null {
  if (!graph.has(startId) || !graph.has(endId)) return null;
  if (startId === endId) return { path: [startId], totalWeight: 0 };

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();

  // Simple priority queue using array (sufficient for ~200 nodes)
  const queue: Array<{ id: string; distance: number }> = [];

  distances.set(startId, 0);
  previous.set(startId, null);
  queue.push({ id: startId, distance: 0 });

  while (queue.length > 0) {
    // Find minimum distance node
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift()!;

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (current.id === endId) {
      return {
        path: reconstructPath(previous, endId),
        totalWeight: distances.get(endId)!,
      };
    }

    const node = graph.get(current.id);
    if (!node) continue;

    for (const edge of node.edges) {
      if (visited.has(edge.to)) continue;

      const weight = weightFn(edge);
      const newDistance = current.distance + weight;
      const existingDistance = distances.get(edge.to);

      if (existingDistance === undefined || newDistance < existingDistance) {
        distances.set(edge.to, newDistance);
        previous.set(edge.to, current.id);
        queue.push({ id: edge.to, distance: newDistance });
      }
    }
  }

  return null; // No path found
}

function reconstructPath(previous: Map<string, string | null>, endId: string): string[] {
  const path: string[] = [];
  let current: string | null = endId;

  while (current !== null) {
    path.unshift(current);
    current = previous.get(current) ?? null;
  }

  return path;
}
