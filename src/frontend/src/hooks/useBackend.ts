import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PlayerProfile, PlayerStats } from "../backend.d";
import { useActor } from "./useActor";

// ─── Query: Get player profile ───
export function usePlayerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<PlayerProfile | null>({
    queryKey: ["playerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlayerProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Query: Get leaderboard ───
export function useLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<PlayerProfile[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutation: Register player ───
export function useRegisterPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerPlayer(username);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Mutation: Add XP ───
export function useAddXP() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.addXP(amount);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
      void queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

// ─── Mutation: Unlock achievement ───
export function useUnlockAchievement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (badgeId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.unlockAchievement(badgeId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Mutation: Update stats ───
export function useUpdateStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newStats: PlayerStats) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateStats(newStats);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Combined hook for easy access ───
export function useBackend() {
  const { actor, isFetching } = useActor();
  return {
    actor,
    isFetching,
  };
}
