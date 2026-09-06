import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

export const revalidate = 30;

const CATEGORY_ICON: Record<string, string> = {
  fish: "F",
  chicken: "C",
  seafood: "S",
  meat: "M",
  "frozen-vegetables": "V",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const supabase = createClient();

  const { data: categories } = await supabase.from("categories").select("*");

  let query = supabase
    .from("products")
    .select("*, categories(slug)")
    .eq("is_active", true);

  if (searchParams.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", searchParams.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (searchParams.q) {
    query = query.ilike("name", `%${searchParams.q}%`);
  }

  const { data: products } = await query;

  const activeCategory = searchParams.category;
  const searchQuery = searchParams.q;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {!searchQuery && categories && categories.length > 0 && (
        <div className="mb-6 flex gap-3 overflow-x-auto pb-1 lg:hidden">
          <Link
            href="/shop"
            className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-center transition ${
              !activeCategory
                ? "border-navy bg-navy text-white"
                : "border-navy/15 bg-white text-navy hover:border-frost"
            }`}
          >
            <span className="font-display text-sm font-semibold">All</span>
          </Link>
          {categories.map((c) => {
            const isActive = activeCategory === c.slug;
            return (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-center transition ${
                  isActive
                    ? "border-navy bg-navy text-white"
                    : "border-navy/15 bg-white text-navy hover:border-frost"
                }`}
              >
                <span
                  className={`font-display text-sm font-semibold ${
                    isActive ? "text-white" : "text-frost"
                  }`}
                >
                  {CATEGORY_ICON[c.slug] || c.name.charAt(0)}
                </span>
                <span className="whitespace-nowrap text-xs font-medium">{c.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {categories && categories.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-navy/10 bg-white p-4">
              <h2 className="font-display mb-3 text-sm font-semibold uppercase tracking-wide text-slate-body">
                Categories
              </h2>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/shop"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    !activeCategory && !searchQuery
                      ? "bg-navy text-white"
                      : "text-navy hover:bg-ice"
                  }`}
                >
                  All products
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.slug}`}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      activeCategory === c.slug
                        ? "bg-navy text-white"
                        : "text-navy hover:bg-ice"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        )}

        <div>
          {searchQuery && (
            <>
              <h1 className="font-display mb-1 text-2xl font-semibold text-navy">
                Search results for &quot;{searchQuery}&quot;
              </h1>
              <Link href="/shop" className="mb-6 inline-block text-sm text-frost underline">
                Clear search and browse all products
              </Link>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {products?.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {products?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-navy/15 bg-white py-16 text-center">
              <p className="text-slate-body">
                {searchQuery
                  ? `No products found matching "${searchQuery}".`
                  : "No products found in this category."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
