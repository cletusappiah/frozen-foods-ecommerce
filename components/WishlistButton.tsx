"use client";

import { useWishlistStore } from "@/lib/wishlistStore";

export default function WishlistButton({ productId }: { productId: string }) {
  const isSaved = useWishlistStore((s) => s.isSaved(productId));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isSaved ? "#FF6B4A" : "none"}
        stroke={isSaved ? "#FF6B4A" : "#0A2540"}
        strokeWidth="2"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
