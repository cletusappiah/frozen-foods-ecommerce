"use client";

import { createBrowserClient } from "@supabase/ssr";

// Singleton: only ever create ONE Supabase client for the whole browser tab.
// Creating more than one causes competing token-refresh loops that log
// users out repeatedly.
let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
