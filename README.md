# Thai Transit - ค้นหาเส้นทางรถไฟฟ้า

ระบบค้นหาเส้นทางรถไฟฟ้าในประเทศไทย แนะนำเส้นทางที่เหมาะสม ราคาค่าโดยสาร และข้อมูลสถานที่ใกล้เคียง แรงบันดาลใจจาก [Hyperdia](https://www.hyperdia.com/) (ญี่ปุ่น) ผสม Google Maps

## Features

- **ค้นหาเส้นทาง** — กรอกสถานีต้นทาง-ปลายทาง แสดงทุกเส้นทางที่เป็นไปได้
- **ราคาค่าโดยสาร** — ราคาจริงจากผู้ให้บริการ เปรียบเทียบ ผู้ใหญ่ / นักเรียน / ผู้สูงอายุ / เด็ก
- **เชื่อมโยงข้อมูลรอบสถานี** — ร้านอาหาร คาเฟ่ โรงแรม ช้อปปิ้ง เช่ารถ ผ่าน Google Maps ทุกสถานี
- **Live Tracking** — เปิด GPS ติดตามการเดินทาง แจ้งเตือนเมื่อใกล้ถึงปลายทาง
- **ข้อมูลสถานี** — หน้ารายละเอียดทุกสถานี พร้อมจุดเปลี่ยนสาย สถานที่ใกล้เคียง
- **SEO** — SSG 130+ หน้า, sitemap, structured data (JSON-LD)
- **PWA** — ติดตั้งเป็นแอปบนมือถือได้
- **Security** — CSP with nonce, HSTS, rate limiting, input validation

## สายรถไฟฟ้าที่รองรับ

| สาย               | สถานี | เส้นทาง                    |
| ----------------- | ----- | -------------------------- |
| BTS สายสุขุมวิท   | 44    | คูคต — เคหะฯ               |
| BTS สายสีลม       | 14    | สนามกีฬาแห่งชาติ — บางหว้า |
| MRT สายสีน้ำเงิน  | 31    | วงรอบ (ท่าพระ — หัวลำโพง)  |
| MRT สายสีม่วง     | 16    | คลองบางไผ่ — เตาปูน        |
| Airport Rail Link | 8     | สุวรรณภูมิ — พญาไท         |

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4**
- **Vitest** — testing
- **Dijkstra Algorithm** — pathfinding (custom implementation)
- **Static Data** — ไม่ใช้ database, ข้อมูลสถานี/ราคาเป็น TypeScript files
- **BTS Fare API** — ราคาจริงจาก API ผู้ให้บริการ (3,540 คู่ราคา)

## Getting Started

```bash
# Install
npm install

# Copy environment variables
cp .env.example .env.local

# Development
npm run dev

# Build
npm run build

# Test
npm run test
```

## Environment Variables

| Variable               | Description                         |
| ---------------------- | ----------------------------------- |
| `BTS_FARE_API_URL`     | BTS fare API endpoint (มี fallback) |
| `NEXT_PUBLIC_SITE_URL` | Site URL สำหรับ sitemap/OG tags     |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # หน้าแรก — search form
│   ├── search/page.tsx     # ผลการค้นหา (SSR)
│   ├── station/[slug]/     # หน้าสถานี (SSG)
│   ├── line/[slug]/        # หน้าสาย (SSG)
│   ├── lines/              # รวมทุกสาย (accordion)
│   ├── about/              # เกี่ยวกับ
│   ├── api/route/          # Route calculation API
│   └── api/fares/bts/      # BTS fare proxy API
├── components/
│   ├── search/             # SearchForm, StationAutocomplete
│   └── route/              # RouteCard, StationExplore, LiveTracker
├── data/
│   ├── stations/           # ข้อมูลสถานีแยกตามสาย
│   ├── fares/              # BTS fare matrix (จาก API)
│   ├── lines.ts            # ข้อมูลสาย
│   └── interchanges.ts     # จุดเปลี่ยนสาย
├── lib/
│   ├── graph/              # Graph data structure + builder
│   ├── routing/            # Dijkstra + pathfinder
│   ├── fare/               # Fare calculator (แยกตาม operator)
│   ├── validation.ts       # API input validation
│   └── rate-limit.ts       # Rate limiter
├── types/                  # TypeScript types
└── proxy.ts                # Security headers (CSP, HSTS, etc.)
```

## Security

| Feature                 | Detail                                |
| ----------------------- | ------------------------------------- |
| Content Security Policy | Nonce-based CSP via `proxy.ts`        |
| X-Frame-Options         | DENY (ป้องกัน clickjacking)           |
| HSTS                    | max-age=63072000 (production)         |
| Rate Limiting           | 60 req/min API, 10 req/min fare proxy |
| Input Validation        | Station ID format + existence check   |
| X-Content-Type-Options  | nosniff                               |
| Referrer-Policy         | origin-when-cross-origin              |
| Permissions-Policy      | ปิด camera, microphone, geolocation   |

## Routing Algorithm

ใช้ **Dijkstra** บน adjacency list graph:

- Nodes = สถานี (~130), Edges = เชื่อมต่อสถานี + จุดเปลี่ยนสาย (~300)
- รันสาม weight functions: เร็วสุด / ถูกสุด / เปลี่ยนน้อยสุด
- รวม alternative routes ผ่านจุดเปลี่ยนสาย (สำหรับ cross-line)
- เส้นทางสายเดียวกันจะไม่มี transfer ที่ไม่จำเป็น

## Deploy

แนะนำ deploy บน **Vercel**:

```bash
npm run build   # ต้องผ่าน + generate 130+ static pages
```

แนะนำใช้ **Cloudflare** (ฟรี) เป็น DNS/CDN สำหรับ DDoS protection เพิ่มเติม

## License

MIT
