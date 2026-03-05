import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PlayerProfile, PlayerStats } from "../backend.d";
import { useActorSafe } from "./useActorSafe";

// ─── Query: Get player profile ───
export function usePlayerProfile() {
  const { actor, isFetching } = useActorSafe();
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
  const { actor, isFetching } = useActorSafe();
  return useQuery<PlayerProfile[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Query: Get mission completions ───
export function useMissionCompletions() {
  const { actor, isFetching } = useActorSafe();
  return useQuery<string[]>({
    queryKey: ["missionCompletions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMissionCompletions();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutation: Register player ───
export function useRegisterPlayer() {
  const { actor } = useActorSafe();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      age,
      gender,
      goal,
      fitnessLevel,
      bodyType,
      weight,
      height,
    }: {
      username: string;
      age: bigint;
      gender: string;
      goal: string;
      fitnessLevel: string;
      bodyType: string;
      weight: string;
      height: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerPlayer(
        username,
        age,
        gender,
        goal,
        fitnessLevel,
        bodyType,
        weight,
        height,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Mutation: Complete mission ───
export function useCompleteMission() {
  const { actor } = useActorSafe();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      missionId,
      category,
      xpReward,
    }: {
      missionId: string;
      category: string;
      xpReward: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeMission(missionId, category, xpReward);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
      void queryClient.invalidateQueries({ queryKey: ["missionCompletions"] });
      void queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

// ─── Mutation: Update martial arts XP ───
export function useUpdateMartialArtsXP() {
  const { actor } = useActorSafe();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (xpToAdd: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMartialArtsXP(xpToAdd);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Mutation: Unlock achievement ───
export function useUnlockAchievement() {
  const { actor } = useActorSafe();
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
  const { actor } = useActorSafe();
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

// ─── Query: Get habit completions ───
export function useHabitCompletions() {
  const { actor, isFetching } = useActorSafe();
  return useQuery<string[]>({
    queryKey: ["habitCompletions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHabitCompletions();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutation: Complete habit ───
export function useCompleteHabit() {
  const { actor } = useActorSafe();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      habitId,
      date,
    }: {
      habitId: string;
      date: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeHabit(habitId, date);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["habitCompletions"] });
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Mutation: Complete workout ───
export function useCompleteWorkout() {
  const { actor } = useActorSafe();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workoutId,
      xpReward,
      category,
    }: {
      workoutId: string;
      xpReward: bigint;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeWorkout(workoutId, xpReward, category);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Mutation: Start challenge ───
export function useStartChallenge() {
  const { actor } = useActorSafe();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      challengeId,
      startDate,
    }: {
      challengeId: string;
      startDate: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.startChallenge(challengeId, startDate);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Mutation: Advance challenge day ───
export function useAdvanceChallengeDay() {
  const { actor } = useActorSafe();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.advanceChallengeDay();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    },
  });
}

// ─── Combined hook for easy access ───
export function useBackend() {
  const { actor, isFetching } = useActorSafe();
  return {
    actor,
    isFetching,
  };
}
