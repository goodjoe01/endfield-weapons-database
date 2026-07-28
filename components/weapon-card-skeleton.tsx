export function WeaponCardSkeleton() {
  return (
    <div className="flex flex-col gap-0 animate-pulse">
      <div className="relative flex flex-col bg-card border border-border rounded-t-lg overflow-hidden">
        <div className="w-full h-40 bg-muted" />
        <div className="px-2 py-2">
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
        </div>
      </div>
      <div className="w-full h-6 rounded-b-lg border border-t-0 border-border bg-muted/60" />
    </div>
  );
}

export function WeaponGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-9 gap-3 overflow-visible">
      {Array.from({ length: count }).map((_, i) => (
        <WeaponCardSkeleton key={i} />
      ))}
    </div>
  );
}
