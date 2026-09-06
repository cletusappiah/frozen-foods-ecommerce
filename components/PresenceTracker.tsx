"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { initOnlineChannel } from "@/lib/onlineChannel";

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

    async function join() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let key = getGuestId();
      let label = "Guest";

      if (user) {
        key = user.id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        label = profile?.full_name || user.email || "Customer";
      }

      initOnlineChannel(key, label);
    }

    join();
  }, []);

  return null;
}
