import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";

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
      {/* Hero - illustrated frozen-foods background, fading to transparent behind the text */}
      <section className="relative overflow-hidden bg-navy">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/hero-frozen-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "right center",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 20%, black 60%)",
            maskImage: "linear-gradient(to right, transparent 0%, transparent 20%, black 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:grid-cols-5 sm:py-24">
          <div className="hero-rise sm:col-span-3">
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl">
              Skip the sunrise trip to the port.
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/70">
              Order fish, chicken, seafood and meat sourced straight from the
              port. We handle the early morning - you just open the door when
              it arrives.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-coral px-7 py-3 font-semibold text-white shadow-lg shadow-coral/20 transition hover:brightness-105"
              >
                Shop now
              </Link>
              <Link href="/signup" className="font-medium text-white/80 underline-offset-4 hover:underline">
                Create an account
              </Link>
            </div>
          </div>
          <div className="hidden sm:col-span-2 sm:block" />
        </div>
      </section>

      {/* Categories - horizontal strip */}
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

      {/* Popular products - first item larger, rest in a supporting grid */}
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
  );
}
