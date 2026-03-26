import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Thai Transit - ค้นหาเส้นทางรถไฟฟ้า',
    short_name: 'ThaiTransit',
    description: 'ค้นหาเส้นทางรถไฟฟ้าในกรุงเทพฯ BTS MRT ARL พร้อมราคาค่าโดยสาร',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#2563eb',
    orientation: 'portrait',
    categories: ['travel', 'navigation', 'transportation'],
    icons: [
      {
        src: '/skytrain.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/skytrain.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
