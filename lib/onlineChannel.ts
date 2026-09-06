"use client";

import { createClient } from "./supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface PresenceEntry {
  name: string;
  online_at: string;
}

type SyncCallback = (state: Record<string, PresenceEntry[]>) => void;

let channel: RealtimeChannel | null = null;
const listeners = new Set<SyncCallback>();

export function initOnlineChannel(key: string, label: string) {
  const supabase = createClient();

  if (channel) return channel;

  channel = supabase.channel("online-users", {
    config: { presence: { key } },
  });

  channel.on("presence", { event: "sync" }, () => {
    const state = channel!.presenceState<PresenceEntry>();
    listeners.forEach((cb) => cb(state));
  });

  channel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await channel!.track({ name: label, online_at: new Date().toISOString() });
    }
  });

  return channel;
}

export function onOnlineSync(cb: SyncCallback) {
  listeners.add(cb);
  if (channel) {
    cb(channel.presenceState<PresenceEntry>());
  }
  return () => {
    listeners.delete(cb);
  };
}
