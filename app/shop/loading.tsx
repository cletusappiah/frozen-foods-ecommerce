import ProductCardSkeleton from "@/components/ProductCardSkeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-slate-200" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
