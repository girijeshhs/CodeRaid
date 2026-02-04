export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-8 py-12">
      <header className="mb-10 flex flex-col items-end justify-between gap-4 border-b border-zinc-800 pb-6 md:flex-row">
        <div className="w-full md:w-auto">
          <div className="mb-2 h-4 w-24 rounded bg-zinc-800"></div>
          <div className="h-8 w-48 rounded bg-zinc-800"></div>
        </div>
        <div className="h-8 w-32 rounded-full bg-zinc-800"></div>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-5 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex w-full items-start justify-between">
              <div className="h-6 w-24 rounded bg-zinc-800"></div>
              <div className="h-6 w-12 rounded-md bg-zinc-800"></div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-3 w-20 rounded bg-zinc-800"></div>
              <div className="h-8 w-16 rounded bg-zinc-800"></div>
            </div>
            <div className="flex w-full justify-between rounded-lg border border-zinc-800 bg-black/20 p-3">
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-3 w-8 rounded bg-zinc-800"></div>
                <div className="h-4 w-6 rounded bg-zinc-800"></div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-3 w-8 rounded bg-zinc-800"></div>
                <div className="h-4 w-6 rounded bg-zinc-800"></div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-3 w-8 rounded bg-zinc-800"></div>
                <div className="h-4 w-6 rounded bg-zinc-800"></div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export function WeeklySkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-8 py-12">
      <header className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 h-3 w-16 rounded bg-zinc-800"></div>
          <div className="mt-1.5 h-8 w-64 rounded bg-zinc-800"></div>
        </div>
        <div className="h-4 w-24 rounded bg-zinc-800"></div>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <div className="grid grid-cols-6 gap-4 border-b border-zinc-800 bg-zinc-950 px-5 py-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 rounded bg-zinc-800"></div>
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 border-b border-zinc-800 px-5 py-5 last:border-b-0">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="h-4 rounded bg-zinc-800"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartiesSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-4xl animate-pulse flex-col gap-8 px-6 py-12">
      <div className="mb-4 h-8 w-32 rounded bg-zinc-800"></div>

      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="mb-6 h-6 w-40 rounded bg-zinc-800"></div>
          <div className="flex flex-col gap-4">
            <div className="h-12 w-full rounded-md bg-zinc-800"></div>
            <div className="h-12 w-full rounded-md bg-zinc-800"></div>
            <div className="h-10 w-24 rounded-md bg-zinc-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
