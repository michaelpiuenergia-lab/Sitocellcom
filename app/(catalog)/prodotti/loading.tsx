export default function ProductsLoading() {
  return (
    <div className="min-h-screen px-6 lg:px-16 pt-8 pb-20 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-8">
        {/* Header skeleton */}
        <div className="text-center flex flex-col gap-4">
          <div className="h-[clamp(36px,5vw,64px)] w-64 bg-muted rounded mx-auto animate-pulse" />
          <div className="h-6 w-96 bg-muted rounded mx-auto animate-pulse" />
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 w-20 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-7 w-24 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card"
            >
              <div className="aspect-[4/5] rounded-xl bg-muted animate-pulse" />
              <div className="flex items-center gap-2 mt-1">
                <div className="h-4 w-12 bg-muted rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-muted rounded-full animate-pulse" />
              </div>
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
              <div className="mt-auto flex items-baseline justify-between">
                <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
