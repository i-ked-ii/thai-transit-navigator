import { NextRequest, NextResponse } from 'next/server';
import { buildGraph } from '@/lib/graph/builder';
import { findRoutes } from '@/lib/routing/pathfinder';
import { lines, interchanges, getStationById } from '@/data';
import { validateStationId } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const graph = buildGraph(lines, interchanges);

export async function GET(request: NextRequest) {
  // Rate limit: 60 req/min per IP
  const ip = getClientIp(request);
  const limit = checkRateLimit(`route:${ip}`, 60, 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.resetIn) },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing from/to params' }, { status: 400 });
  }

  // Validate station IDs
  const fromValid = validateStationId(from);
  if (!fromValid.valid) {
    return NextResponse.json({ error: fromValid.error }, { status: 400 });
  }
  const toValid = validateStationId(to);
  if (!toValid.valid) {
    return NextResponse.json({ error: toValid.error }, { status: 400 });
  }

  const origin = getStationById(from)!;
  const destination = getStationById(to)!;

  const routes = findRoutes(graph, from, to);

  return NextResponse.json({
    origin,
    destination,
    routes,
    searchedAt: new Date().toISOString(),
  }, {
    headers: {
      'X-RateLimit-Remaining': String(limit.remaining),
    },
  });
}
