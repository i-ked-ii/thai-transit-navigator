export default function SearchLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="animate-pulse">
        <div className="h-4 w-20 bg-gray-200 rounded mb-4" />
        <div className="h-7 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded mb-8" />

        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded" />
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
