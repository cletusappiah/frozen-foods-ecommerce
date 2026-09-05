import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

export const revalidate = 30;

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
  const activeCategoryName = categories?.find((c) => c.slug === activeCategory)?.name;
  const searchQuery = searchParams.q;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display mb-1 text-2xl font-semibold text-navy">
        {searchQuery
          ? `Search results for "${searchQuery}"`
          : activeCategoryName
          ? activeCategoryName
          : "All products"}
      </h1>
      <p className="mb-6 text-sm text-slate-body">
        {products?.length ?? 0} {products?.length === 1 ? "item" : "items"} available
      </p>

      {!searchQuery && categories && categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !activeCategory
                ? "bg-navy text-white"
                : "border border-navy/15 text-navy hover:border-frost"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === c.slug
                  ? "bg-navy text-white"
                  : "border border-navy/15 text-navy hover:border-frost"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {searchQuery && (
        <Link href="/shop" className="mb-6 inline-block text-sm text-frost underline">
          Clear search and browse all products
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
  );
}