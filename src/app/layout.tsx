import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Thai Transit - ค้นหาเส้นทางรถไฟฟ้า",
    template: "%s | Thai Transit",
  },
  icons: {
    icon: "/skytrain.png",
    apple: "/skytrain.png",
  },
  description:
    "ค้นหาเส้นทางรถไฟฟ้าในกรุงเทพฯ BTS MRT ARL พร้อมราคาค่าโดยสาร จุดเปลี่ยนสาย และเวลาเดินทาง",
  keywords: [
    "รถไฟฟ้า",
    "BTS",
    "MRT",
    "ARL",
    "เส้นทาง",
    "ค่าโดยสาร",
    "กรุงเทพ",
    "Bangkok transit",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ThaiTransit",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-noto-thai)] bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/skytrain.png" alt="" width={24} height={24} className="w-6 h-6" />
          <span className="font-bold text-lg">
            Thai<span className="text-blue-600">Transit</span>
          </span>
        </a>
        <nav className="flex gap-3 sm:gap-4 text-sm text-gray-600 items-center">
          <a href="/" className="hover:text-blue-600 transition-colors">
            ค้นหา
          </a>
          <a href="/lines" className="hover:text-blue-600 transition-colors">
            สายรถไฟฟ้า
          </a>
          <a href="/about" className="hover:text-blue-600 transition-colors">
            เกี่ยวกับ
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          ข้อมูลราคาค่าโดยสารอ้างอิงจากผู้ให้บริการโดยตรง อาจมีการเปลี่ยนแปลง
        </p>
        <p className="mt-1">
          Thai Transit &copy; {new Date().getFullYear()} &mdash;
          ค้นหาเส้นทางรถไฟฟ้า BTS MRT ARL
        </p>
      </div>
    </footer>
  );
}
