import { NextRequest, NextResponse } from 'next/server';

const BTS_API_URL =
  'https://www.ebm.co.th/mobapi-routemap/api/RouteMap/getRouteSuperUltimateStation_key?lang=th';

interface BtsApiResponse {
  IsSuccess: boolean;
  data: {
    RoutesMap: Array<{
      FareRate_Total: number;
    }>;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing from/to params' }, { status: 400 });
  }

  try {
    const res = await fetch(BTS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Origin: from,
        Destination: to,
        Origin_Location: 0,
        Destination_Location: 0,
      }),
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    const data: BtsApiResponse = await res.json();

    if (data.IsSuccess && data.data.RoutesMap?.length > 0) {
      return NextResponse.json({
        fare: data.data.RoutesMap[0].FareRate_Total,
        source: 'api',
      });
    }

    return NextResponse.json({ fare: null, source: 'api', error: 'No route found' });
  } catch {
    return NextResponse.json({ fare: null, source: 'error' }, { status: 502 });
  }
}
