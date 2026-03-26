"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          เกิดข้อผิดพลาด
        </h1>
        <p className="text-gray-500 mb-6">กรุณาลองใหม่อีกครั้ง</p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          ลองใหม่
        </button>
      </div>
    </div>
  );
}
