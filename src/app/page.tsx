import { Suspense } from "react";
import SearchForm from "@/components/search/SearchForm";

export default function Home() {
  return (
    <div className="py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          ค้นหาเส้นทาง<span className="text-blue-600">รถไฟฟ้า</span>
        </h1>
        <p className="text-gray-500">
          BTS &middot; MRT &middot; ARL &mdash; ราคา เส้นทาง เวลาเดินทาง
        </p>
      </div>
      <Suspense fallback={<SearchFormSkeleton />}>
        <SearchForm />
      </Suspense>
      <div className="max-w-lg mx-auto mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { color: "#7DC242", label: "BTS สุขุมวิท" },
            { color: "#00847F", label: "BTS สีลม" },
            { color: "#1E3A8A", label: "MRT สีน้ำเงิน" },
            { color: "#800080", label: "MRT สีม่วง" },
            { color: "#E4002B", label: "ARL" },
          ].map((line) => (
            <span
              key={line.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              {line.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchFormSkeleton() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
