import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const { data: categories } = await supabase.from("categories").select("*");
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(8);

  const [firstProduct, ...restProducts] = products || [];

  return (
    <div>
      <HeroCarousel />

      <div style={{ backgroundImage: "url('/section-frost-pattern.svg')", backgroundRepeat: "repeat" }}>
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display mb-5 text-xl font-semibold text-navy">Shop by category</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories?.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="flex min-w-[130px] flex-col items-center gap-2 rounded-2xl border border-navy/10 bg-white px-5 py-4 text-center shadow-sm transition hover:border-frost hover:shadow-md"
              >
                <span className="font-display text-lg font-semibold text-frost">{c.name.charAt(0)}</span>
                <span className="font-medium text-navy">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {products && products.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-20">
            <h2 className="font-display mb-5 text-xl font-semibold text-navy">Popular right now</h2>
            <div className="grid gap-4 sm:grid-cols-4">
              {firstProduct && (
                <div className="sm:col-span-2 sm:row-span-2">
                  <ProductCard product={firstProduct} />
                </div>
              )}
              {restProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}