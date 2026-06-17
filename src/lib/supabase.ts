import type { SupabaseClient } from "@supabase/supabase-js";

// OPTIONAL decoration only. Everything is wrapped so the game never depends on
// the network (CLAUDE.md hard rule). If env vars are missing, this is a no-op.
//
// Supabase table (create once in the dashboard):
//   create table leaderboard (
//     id uuid primary key default gen_random_uuid(),
//     username text not null,
//     completed_at timestamptz not null,
//     duration_seconds int not null
//   );
//   alter table leaderboard enable row level security;
//   create policy "anon insert" on leaderboard for insert to anon with check (true);
//   create policy "anon read"   on leaderboard for select to anon using (true);

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const leaderboardEnabled = Boolean(url && key);

// Lazy-load the SDK only when the leaderboard is actually used, so ~110KB of
// Supabase stays out of the initial bundle (matters on venue wifi).
let clientPromise: Promise<SupabaseClient | null> | null = null;
function getClient(): Promise<SupabaseClient | null> {
  if (!leaderboardEnabled) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js")
      .then(({ createClient }) => createClient(url!, key!))
      .catch(() => null);
  }
  return clientPromise;
}

const PROFANITY = ["fuck", "shit", "bitch", "cunt", "nigg", "fag", "slut", "rape"];

export function cleanUsername(raw: string): string {
  let name = raw.trim().slice(0, 18);
  const lower = name.toLowerCase();
  if (PROFANITY.some((w) => lower.includes(w))) name = "mystery artist";
  return name;
}

export interface LeaderboardEntry {
  username: string;
  completed_at: string;
  duration_seconds: number;
}

const SUBMIT_FLAG = "illuspeak_submitted";

// Insert one completion row and derive "you were the Nth to finish".
// Returns the rank, or null if disabled/offline/already-submitted.
export async function submitCompletion(params: {
  username: string;
  durationSeconds: number;
  completedAt: number;
}): Promise<number | null> {
  if (!leaderboardEnabled) return null;
  // Client-side rate-limit: only one insert per finished game.
  try {
    if (localStorage.getItem(SUBMIT_FLAG)) return readCachedRank();
  } catch {
    /* ignore */
  }

  const client = await getClient();
  if (!client) return null;
  const completedIso = new Date(params.completedAt).toISOString();
  try {
    const { error } = await client.from("leaderboard").insert({
      username: cleanUsername(params.username),
      completed_at: completedIso,
      duration_seconds: params.durationSeconds,
    });
    if (error) return null;

    const { count } = await client
      .from("leaderboard")
      .select("*", { count: "exact", head: true })
      .lte("completed_at", completedIso);

    const rank = count ?? null;
    try {
      localStorage.setItem(SUBMIT_FLAG, "1");
      if (rank != null) localStorage.setItem("illuspeak_rank", String(rank));
    } catch {
      /* ignore */
    }
    return rank;
  } catch {
    return null;
  }
}

function readCachedRank(): number | null {
  try {
    const r = localStorage.getItem("illuspeak_rank");
    return r ? Number(r) : null;
  } catch {
    return null;
  }
}

// Recent finishers for the About tab. Returns null if disabled/offline.
export async function fetchLeaderboard(limit = 10): Promise<LeaderboardEntry[] | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("leaderboard")
      .select("username, completed_at, duration_seconds")
      .order("duration_seconds", { ascending: true })
      .limit(limit);
    if (error || !data) return null;
    return data as LeaderboardEntry[];
  } catch {
    return null;
  }
}
