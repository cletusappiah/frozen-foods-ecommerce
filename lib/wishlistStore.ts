"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => void;
  add: (productId: string) => void;
  isSaved: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        })),
      add: (productId) =>
        set((state) =>
          state.ids.includes(productId) ? state : { ids: [...state.ids, productId] }
        ),
      isSaved: (productId) => get().ids.includes(productId),
    }),
    { name: "frozen-foods-wishlist" }
  )
);