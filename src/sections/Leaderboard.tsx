import { useEffect, useState } from "react";
import {
  fetchLeaderboard,
  leaderboardEnabled,
  type LeaderboardEntry,
} from "../lib/supabase";
import { formatDuration } from "../lib/format";
import { Star } from "../components/Doodles";

// Live leaderboard widget (PRD §5.3). Pure decoration — renders nothing
// disruptive if Supabase is unconfigured or offline.
export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!leaderboardEnabled) return;
    let alive = true;
    fetchLeaderboard(10).then((data) => {
      if (!alive) return;
      setEntries(data);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Hidden entirely when the backend isn't set up — no empty/broken UI.
  if (!leaderboardEnabled) return null;

  return (
    <div>
      <h2 className="mt-8 flex items-center gap-2 font-display text-2xl text-ink">
        <Star className="h-6 w-6" color="#FFE53D" /> Fastest finishers
      </h2>

      <div className="ink-outline mt-3 overflow-hidden rounded-2xl bg-paper">
        {!loaded && (
          <p className="px-4 py-5 text-center font-body text-sm text-ink/50">
            Loading…
          </p>
        )}
        {loaded && (!entries || entries.length === 0) && (
          <p className="px-4 py-5 text-center font-body text-sm text-ink/60">
            No finishers yet — be the first! 🏁
          </p>
        )}
        {loaded &&
          entries?.map((e, i) => (
            <div
              key={`${e.username}-${e.completed_at}`}
              className="flex items-center gap-3 border-b border-ink/10 px-4 py-2.5 last:border-0"
            >
              <span className="font-display text-lg text-hotpink">{i + 1}</span>
              <span className="flex-1 truncate font-body font-semibold text-ink">
                {e.username}
              </span>
              <span className="font-display tabular-nums text-ink/80">
                {formatDuration(e.duration_seconds)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
