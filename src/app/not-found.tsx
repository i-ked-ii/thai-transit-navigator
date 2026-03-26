import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          ไม่พบหน้าที่ต้องการ
        </h1>
        <p className="text-gray-500 mb-6">
          หน้านี้อาจถูกย้ายหรือไม่มีอยู่ในระบบ
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}
