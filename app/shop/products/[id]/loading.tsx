export default function ProductLoading() {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-xl bg-slate-200" />
      <div className="space-y-3">
        <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-6 w-1/4 animate-pulse rounded bg-slate-200" />
        <div className="h-20 w-full animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
