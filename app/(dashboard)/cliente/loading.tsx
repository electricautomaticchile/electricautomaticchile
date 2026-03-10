export default function LoadingCliente() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar skeleton */}
      <div className="w-16 shrink-0 border-r border-border/60 bg-card p-3 space-y-3 flex flex-col items-center">
        <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
        <div className="space-y-3 pt-4 w-full flex flex-col items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-9 bg-muted rounded-lg animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <main className="flex-1 p-6 space-y-5 max-w-4xl mx-auto w-full">
        {/* Welcome */}
        <div className="space-y-1">
          <div className="h-7 w-52 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>

        {/* Hero card */}
        <div className="h-44 w-full bg-muted rounded-2xl animate-pulse" />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-4 space-y-2 animate-pulse" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>

        {/* Chart card */}
        <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4 animate-pulse">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-3 w-12 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-1.5 w-full bg-muted rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-1.5 w-full bg-muted rounded-full" />
            </div>
          </div>
        </div>

        {/* IA card */}
        <div className="h-32 w-full bg-muted rounded-xl animate-pulse" />
      </main>
    </div>
  );
}
