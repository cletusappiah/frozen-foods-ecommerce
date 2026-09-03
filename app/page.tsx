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

  return (
    <div>
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-14 text-center">
        <h1 className="mx-auto max-w-2xl text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Frozen foods from the port, delivered to your door.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          No more early-morning trips. Order fish, chicken, seafood and more —
          fresh from the port, straight to you.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow"
        >
          Shop now
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-xl font-bold">Shop by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {categories?.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center font-medium shadow-sm hover:shadow-md"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-4 text-xl font-bold">Popular right now</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
