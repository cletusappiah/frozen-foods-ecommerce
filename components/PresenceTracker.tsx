"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

function getGuestId() {
  if (typeof window === "undefined") return "guest";
  let id = localStorage.getItem("guest_id");
  if (!id) {
    id = "guest-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("guest_id", id);
  }
  return id;
}

export default function PresenceTracker() {
  useEffect(() => {
    const supabase = createClient();
    let channelKey = getGuestId();
    let label = "Guest";

    async function join() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        channelKey = user.id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        label = profile?.full_name || user.email || "Customer";
      }

      const channel = supabase.channel("online-users", {
        config: { presence: { key: channelKey } },
      });

      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name: label, online_at: new Date().toISOString() });
        }
      });

      return channel;
    }

    let activeChannel: ReturnType<typeof supabase.channel> | null = null;
    join().then((ch) => {
      activeChannel = ch;
    });

    return () => {
      if (activeChannel) supabase.removeChannel(activeChannel);
    };
  }, []);

  return null;
}
