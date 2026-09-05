import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

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
        {products && products.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-10 pb-20">
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