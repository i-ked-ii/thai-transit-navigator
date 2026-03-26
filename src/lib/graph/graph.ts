import type { Graph, GraphNode, GraphEdge } from './types';

export function createGraph(): Graph {
  return new Map<string, GraphNode>();
}

export function addNode(graph: Graph, stationId: string): void {
  if (!graph.has(stationId)) {
    graph.set(stationId, { stationId, edges: [] });
  }
}

export function addEdge(graph: Graph, edge: GraphEdge): void {
  addNode(graph, edge.from);
  addNode(graph, edge.to);

  const fromNode = graph.get(edge.from)!;
  fromNode.edges.push(edge);
}

export function addBidirectionalEdge(graph: Graph, edge: GraphEdge): void {
  addEdge(graph, edge);
  addEdge(graph, {
    ...edge,
    from: edge.to,
    to: edge.from,
  });
}

export function getNode(graph: Graph, stationId: string): GraphNode | undefined {
  return graph.get(stationId);
}

export function getEdges(graph: Graph, stationId: string): GraphEdge[] {
  return graph.get(stationId)?.edges ?? [];
}
