import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  const image = product.image_urls?.[0] || "/placeholder-food.png";

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
        <Image src={image} alt={product.name} fill className="object-cover" sizes="500px" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-1 text-slate-500">{product.unit}</p>
        <p className="mt-4 text-xl font-bold text-blue-700">GHS {product.price.toFixed(2)}</p>
        <p className="mt-4 text-slate-700">{product.description}</p>
        <p className="mt-2 text-sm text-slate-500">
          {product.stock_qty > 0 ? `${product.stock_qty} in stock` : "Out of stock"}
        </p>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
