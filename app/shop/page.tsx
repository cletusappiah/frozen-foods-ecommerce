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
    <div className="mx-auto flex max-w-6xl">
      {categories && categories.length > 0 && !searchQuery && (
        <aside className="w-20 shrink-0 border-r border-navy/10 bg-white sm:w-28">
          <nav className="sticky top-16 flex flex-col">
            <Link
              href="/shop"
              className={`flex flex-col items-center gap-1 border-l-4 px-2 py-4 text-center transition ${
                !activeCategory
                  ? "border-coral bg-ice"
                  : "border-transparent hover:bg-ice/60"
              }`}
            >
              <span className="font-display text-sm font-semibold text-frost">All</span>
              <span className="text-[11px] font-medium leading-tight text-navy">Products</span>
            </Link>
            {categories.map((c) => {
              const isActive = activeCategory === c.slug;
              return (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  className={`flex flex-col items-center gap-1 border-l-4 px-2 py-4 text-center transition ${
                    isActive ? "border-coral bg-ice" : "border-transparent hover:bg-ice/60"
                  }`}
                >
                  <span className="font-display text-sm font-semibold text-frost">
                    {CATEGORY_ICON[c.slug] || c.name.charAt(0)}
                  </span>
                  <span className="text-[11px] font-medium leading-tight text-navy">
                    {c.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>
      )}

      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
  );
}
