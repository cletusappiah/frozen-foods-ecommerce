"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  unit: string;
  price: number;
  stock_qty: number;
  image_urls: string[] | null;
  video_url: string | null;
  is_active: boolean;
  category_id: string | null;
};

type Category = {
  id: string;
  name: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ProductForm({
  mode,
  initialProduct,
}: {
  mode: "new" | "edit";
  initialProduct?: Product;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id ?? "");
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [unit, setUnit] = useState(initialProduct?.unit ?? "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "");
  const [stockQty, setStockQty] = useState(initialProduct?.stock_qty?.toString() ?? "");
  const [videoUrl, setVideoUrl] = useState(initialProduct?.video_url ?? "");
  const [isActive, setIsActive] = useState(initialProduct?.is_active ?? true);
  const [imageUrls, setImageUrls] = useState<string[]>(initialProduct?.image_urls ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setImageUrls((prev) => [...prev, data.secure_url]);
    } catch (err) {
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!categoryId) {
      setError("Please choose a category for this product.");
      setSaving(false);
      return;
    }

    const payload = {
      name,
      slug: slugify(name),
      description: description || null,
      unit,
      price: parseFloat(price),
      stock_qty: parseInt(stockQty, 10),
      image_urls: imageUrls,
      video_url: videoUrl || null,
      is_active: isActive,
      category_id: categoryId,
    };

    if (mode === "new") {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", initialProduct!.id);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5 px-4 py-8">
      <h1 className="text-2xl font-bold">
        {mode === "new" ? "New Product" : "Edit Product"}
      </h1>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Frozen Tilapia"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Unit</label>
          <input
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="3kg bag"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Price (GHS)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Stock quantity</label>
        <input
          required
          type="number"
          min="0"
          value={stockQty}
          onChange={(e) => setStockQty(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Photos</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        {uploading && <p className="mt-1 text-sm text-slate-500">Uploading...</p>}
        {imageUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {imageUrls.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-xs text-white"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Video URL (optional)</label>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label htmlFor="is_active" className="text-sm font-medium">
          Active (visible in shop)
        </label>
      </div>

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full rounded-full bg-blue-600 py-2.5 font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : mode === "new" ? "Create Product" : "Save Changes"}
      </button>
    </form>
  );
}
