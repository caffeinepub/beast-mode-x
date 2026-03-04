import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
    username: string;
    level: bigint;
    stats: PlayerStats;
    achievements: Array<bigint>;
    skillPoints: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addXP(xpToAdd: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<PlayerProfile>>;
    getPlayerProfile(): Promise<PlayerProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerPlayer(username: string): Promise<void>;
    unlockAchievement(badgeId: bigint): Promise<void>;
    updateStats(newStats: PlayerStats): Promise<void>;
}
