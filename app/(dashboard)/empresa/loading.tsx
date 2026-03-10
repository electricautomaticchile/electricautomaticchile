export default function LoadingEmpresa() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar skeleton */}
      <div className="w-64 shrink-0 border-r border-border/60 bg-card p-4 space-y-3">
        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 w-full bg-muted rounded-lg animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-9 w-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="h-12 w-12 bg-muted rounded-xl" />
              </div>
              <div className="h-10 w-20 bg-muted rounded" />
              <div className="h-3 w-36 bg-muted rounded" />
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-6 space-y-4 animate-pulse">
              <div className="h-5 w-40 bg-muted rounded" />
              <div className="h-64 w-full bg-muted rounded-lg" />
            </div>
          ))}
        </div>

        {/* Bottom KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 space-y-3 animate-pulse" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-3 w-28 bg-muted rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
