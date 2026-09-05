import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  const image = product.image_urls?.[0] || "/placeholder-food.png";
  const category = (product as any).categories;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-body">
        <Link href="/" className="hover:text-navy">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-navy">
          Shop
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/shop?category=${category.slug}`} className="hover:text-navy">
              {category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-ice">
          <Image src={image} alt={product.name} fill className="object-cover" sizes="500px" />
          {product.stock_qty <= 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              Out of stock
            </span>
          )}
        </div>

        <div>
          {category && (
            <Link
              href={`/shop?category=${category.slug}`}
              className="text-xs font-semibold uppercase tracking-wide text-frost"
            >
              {category.name}
            </Link>
          )}
          <h1 className="font-display mt-1 text-2xl font-semibold text-navy sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-slate-body">{product.unit}</p>

          <p className="font-display mt-4 text-2xl font-semibold text-navy">
            GHS {product.price.toFixed(2)}
          </p>

          {product.description && (
            <p className="mt-4 leading-relaxed text-slate-body">{product.description}</p>
          )}

          <p className="mt-4 text-sm">
            {product.stock_qty > 0 ? (
              <span className="font-medium text-teal">
                {product.stock_qty} in stock
              </span>
            ) : (
              <span className="font-medium text-coral">Out of stock</span>
            )}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}