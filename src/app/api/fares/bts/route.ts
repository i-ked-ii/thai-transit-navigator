import { NextRequest, NextResponse } from 'next/server';
import { validateStationCode } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const BTS_API_URL = process.env.BTS_FARE_API_URL
  ?? 'https://www.ebm.co.th/mobapi-routemap/api/RouteMap/getRouteSuperUltimateStation_key?lang=th';

const FETCH_TIMEOUT = 5000; // 5 seconds

export async function GET(request: NextRequest) {
  // Stricter rate limit for external API proxy: 10 req/min
  const ip = getClientIp(request);
  const limit = checkRateLimit(`fare:${ip}`, 10, 60);
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

  // Validate station codes
  const fromValid = validateStationCode(from);
  if (!fromValid.valid) {
    return NextResponse.json({ error: fromValid.error }, { status: 400 });
  }
  const toValid = validateStationCode(to);
  if (!toValid.valid) {
    return NextResponse.json({ error: toValid.error }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const res = await fetch(BTS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Origin: from,
        Destination: to,
        Origin_Location: 0,
        Destination_Location: 0,
      }),
      signal: controller.signal,
      next: { revalidate: 86400 },
    });

    clearTimeout(timeout);

    const data = await res.json();

    if (data?.IsSuccess && data.data?.RoutesMap?.length > 0) {
      // Only return fare data — don't expose raw API response
      return NextResponse.json({
        fare: Number(data.data.RoutesMap[0].FareRate_Total),
        source: 'api',
      }, {
        headers: { 'X-RateLimit-Remaining': String(limit.remaining) },
      });
    }

    return NextResponse.json({ fare: null, source: 'api' });
  } catch {
    // Don't expose external API details in error
    return NextResponse.json(
      { fare: null, source: 'fallback', error: 'Fare service unavailable' },
      { status: 503 },
    );
  }
}
