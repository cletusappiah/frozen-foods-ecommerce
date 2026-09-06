"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface OnlinePerson {
  key: string;
  name: string;
  online_at: string;
}

export default function AdminOnlinePage() {
  const [people, setPeople] = useState<OnlinePerson[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("online-users", {
      config: { presence: { key: "admin-viewer" } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ name: string; online_at: string }>();
        const list: OnlinePerson[] = Object.entries(state).map(([key, entries]) => ({
          key,
          name: entries[0]?.name || "Unknown",
          online_at: entries[0]?.online_at || "",
        }));
        setPeople(list);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display mb-2 text-2xl font-semibold text-navy">Online now</h1>
      <p className="mb-6 text-sm text-navy/60">
        Anyone currently browsing the site, updated live.
      </p>

      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
        {people.length === 0 ? (
          <p className="p-4 text-sm text-navy/50">No one is currently online.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-navy/5 text-left text-navy/70">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Since</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.key} className="border-t border-navy/5">
                  <td className="p-3 font-medium text-navy">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
                    {p.name}
                  </td>
                  <td className="p-3 text-navy/60">
                    {p.online_at ? new Date(p.online_at).toLocaleTimeString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
