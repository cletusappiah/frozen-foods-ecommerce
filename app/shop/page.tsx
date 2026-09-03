import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

export const revalidate = 30;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  let query = supabase.from("products").select("*, categories(slug)").eq("is_active", true);

  if (searchParams.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", searchParams.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  const { data: products } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {searchParams.category ? `Category: ${searchParams.category}` : "All products"}
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products?.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {products?.length === 0 && <p className="text-slate-500">No products found.</p>}
      </div>
    </div>
  );
}
