import { useCallback, useMemo, useState } from "react";
import { gameTargets, isGameTargetId, TARGET_COUNT } from "../data/booths";
import {
  loadGame,
  markCompleted,
  markStarted,
  resetGame as clearStorage,
  saveProgress,
  saveUsername,
  type CollectedStamp,
} from "./storage";

export type CollectResult =
  | { status: "collected"; boothId: string }
  | { status: "duplicate"; boothId: string }
  | { status: "not-a-target"; boothId: string };

export interface Game {
  username: string | null;
  collected: CollectedStamp[];
  collectedIds: Set<string>;
  startedAt: number | null;
  completedAt: number | null;
  count: number;
  total: number;
  isComplete: boolean;
  setUsername: (name: string) => void;
  collect: (boothId: string) => CollectResult;
  reset: () => void;
}

export function useGame(): Game {
  const [state, setState] = useState(loadGame);

  const collectedIds = useMemo(
    () => new Set(state.collected.map((c) => c.id)),
    [state.collected],
  );

  const isComplete = state.collected.length >= TARGET_COUNT;

  const setUsername = useCallback((name: string) => {
    const clean = name.trim();
    saveUsername(clean);
    setState((s) => {
      // Starting the clock the moment a player commits a username.
      const startedAt = s.startedAt ?? Date.now();
      if (s.startedAt === null) markStarted(startedAt);
      return { ...s, username: clean, startedAt };
    });
  }, []);

  const collect = useCallback((boothId: string): CollectResult => {
    if (!isGameTargetId(boothId)) {
      return { status: "not-a-target", boothId };
    }
    let result: CollectResult = { status: "collected", boothId };
    setState((s) => {
      if (s.collected.some((c) => c.id === boothId)) {
        result = { status: "duplicate", boothId };
        return s;
      }
      const collected = [...s.collected, { id: boothId, at: Date.now() }];
      saveProgress(collected);

      const startedAt = s.startedAt ?? Date.now();
      if (s.startedAt === null) markStarted(startedAt);

      let completedAt = s.completedAt;
      if (collected.length >= TARGET_COUNT && completedAt === null) {
        completedAt = Date.now();
        markCompleted(completedAt);
      }
      return { ...s, collected, startedAt, completedAt };
    });
    return result;
  }, []);

  const reset = useCallback(() => {
    clearStorage();
    setState(loadGame());
  }, []);

  return {
    username: state.username,
    collected: state.collected,
    collectedIds,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    count: state.collected.length,
    total: TARGET_COUNT,
    isComplete,
    setUsername,
    collect,
    reset,
  };
}

// Re-export for convenience in UI.
export { gameTargets };
