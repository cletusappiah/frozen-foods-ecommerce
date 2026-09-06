export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 aspect-square animate-pulse rounded-lg bg-slate-200" />
      <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-8 w-full animate-pulse rounded-full bg-slate-100" />
    </div>
  );
}
