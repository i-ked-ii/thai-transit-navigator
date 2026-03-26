import { NextRequest, NextResponse } from 'next/server';
import { buildGraph } from '@/lib/graph/builder';
import { findRoutes } from '@/lib/routing/pathfinder';
import { lines, interchanges, getStationById } from '@/data';

const graph = buildGraph(lines, interchanges);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing from/to params' }, { status: 400 });
  }

  const origin = getStationById(from);
  const destination = getStationById(to);

  if (!origin || !destination) {
    return NextResponse.json({ error: 'Invalid station ID' }, { status: 404 });
  }

  const routes = findRoutes(graph, from, to);

  return NextResponse.json({
    origin,
    destination,
    routes,
    searchedAt: new Date().toISOString(),
  });
}
