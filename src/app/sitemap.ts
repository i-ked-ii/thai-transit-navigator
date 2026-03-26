import type { MetadataRoute } from 'next';
import { allStations, lines } from '@/data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thaitransit.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const stationUrls = allStations.map((station) => ({
    url: `${BASE_URL}/station/${station.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const lineUrls = lines.map((line) => ({
    url: `${BASE_URL}/line/${line.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...lineUrls,
    ...stationUrls,
  ];
}
