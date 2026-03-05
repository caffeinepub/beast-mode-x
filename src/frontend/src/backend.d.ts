import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CategoryXP {
    focus: bigint;
    discipline: bigint;
    mindset: bigint;
    martial: bigint;
    fitness: bigint;
    intelligence: bigint;
}
export interface PlayerStats {
    focus: bigint;
    aura: bigint;
    speed: bigint;
    strength: bigint;
    endurance: bigint;
    intelligence: bigint;
}
export interface PlayerProfile {
    xp: bigint;
    age: bigint;
    categoryXP: CategoryXP;
    weight: string;
    height: string;
    fitnessLevel: string;
    username: string;
    goal: string;
    martialArtsLevel: bigint;
    completedMissions: Array<string>;
    level: bigint;
    stats: PlayerStats;
    achievements: Array<bigint>;
    gender: string;
    skillPoints: bigint;
    martialArtsXP: bigint;
    bodyType: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyPenalty(player: Principal, xpLoss: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    awardCameraXP(xpAmount: bigint, category: string): Promise<void>;
    completeMission(missionId: string, category: string, xpReward: bigint): Promise<void>;
    deletePlayer(): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<PlayerProfile>>;
    getMissionCompletions(): Promise<Array<string>>;
    getPlayerProfile(): Promise<PlayerProfile | null>;
    getPublicProfile(player: Principal): Promise<PlayerProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerPlayer(username: string, age: bigint, gender: string, goal: string, fitnessLevel: string, bodyType: string, weight: string, height: string): Promise<void>;
    resetPlayerProgress(): Promise<void>;
    unlockAchievement(badgeId: bigint): Promise<void>;
    updateMartialArtsXP(xpToAdd: bigint): Promise<void>;
    updateStats(newStats: PlayerStats): Promise<void>;
}
