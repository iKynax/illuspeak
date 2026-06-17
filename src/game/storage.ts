// localStorage is the SOURCE OF TRUTH for game progress and prize unlock.
// Everything here works fully offline (see CLAUDE.md hard rules).

const KEYS = {
  username: "illuspeak_username",
  progress: "illuspeak_progress",
  startedAt: "illuspeak_started_at",
  completedAt: "illuspeak_completed_at",
} as const;

export interface CollectedStamp {
  id: string; // booth id
  at: number; // epoch ms
}

export interface GameState {
  username: string | null;
  collected: CollectedStamp[];
  startedAt: number | null;
  completedAt: number | null;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full / disabled (private mode). Game still runs in-memory this session.
  }
}

export function loadGame(): GameState {
  return {
    username: read<string | null>(KEYS.username, null),
    collected: read<CollectedStamp[]>(KEYS.progress, []),
    startedAt: read<number | null>(KEYS.startedAt, null),
    completedAt: read<number | null>(KEYS.completedAt, null),
  };
}

export function saveUsername(username: string): void {
  write(KEYS.username, username);
}

export function saveProgress(collected: CollectedStamp[]): void {
  write(KEYS.progress, collected);
}

export function markStarted(at: number): void {
  write(KEYS.startedAt, at);
}

export function markCompleted(at: number): void {
  write(KEYS.completedAt, at);
}

export function resetGame(): void {
  for (const key of Object.values(KEYS)) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
