import type { CategoryXP } from "../backend.d";

// ─── Class System ───────────────────────────────────────────────
export interface ClassInfo {
  name: "BERSERKER" | "ARCHMAGE" | "SHADOW ASSASSIN";
  icon: string;
  color: string;
  desc: string;
  borderColor: string;
  glowColor: string;
}

export function getClassInfo(categoryXP: CategoryXP): ClassInfo {
  const berserker = Number(categoryXP.fitness) + Number(categoryXP.martial);
  const archmage = Number(categoryXP.intelligence) + Number(categoryXP.focus);
  const shadowAssassin =
    Number(categoryXP.discipline) + Number(categoryXP.mindset);

  if (berserker >= archmage && berserker >= shadowAssassin) {
    return {
      name: "BERSERKER",
      icon: "⚔️",
      color: "oklch(0.62 0.25 22)",
      desc: "Rage forges iron will",
      borderColor: "oklch(0.72 0.28 22)",
      glowColor: "0 0 16px oklch(0.62 0.25 22 / 0.7)",
    };
  }
  if (archmage >= berserker && archmage >= shadowAssassin) {
    return {
      name: "ARCHMAGE",
      icon: "🔮",
      color: "oklch(0.65 0.22 275)",
      desc: "Knowledge is supreme power",
      borderColor: "oklch(0.65 0.25 275)",
      glowColor: "0 0 16px oklch(0.65 0.22 275 / 0.7)",
    };
  }
  return {
    name: "SHADOW ASSASSIN",
    icon: "🗡️",
    color: "oklch(0.62 0.18 295)",
    desc: "Discipline is the deadliest blade",
    borderColor: "oklch(0.62 0.22 295)",
    glowColor: "0 0 16px oklch(0.62 0.18 295 / 0.7)",
  };
}

// ─── Avatar System ───────────────────────────────────────────────
export interface AvatarOption {
  index: number;
  label: string;
  image: string;
  border: string;
  glow: string;
  type: "male" | "female";
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    index: 0,
    label: "Warrior M",
    image: "/assets/generated/avatar-male-warrior-transparent.dim_200x200.png",
    border: "oklch(0.72 0.28 22)",
    glow: "0 0 16px oklch(0.62 0.25 22 / 0.8)",
    type: "male",
  },
  {
    index: 1,
    label: "Sage M",
    image: "/assets/generated/avatar-male-sage-transparent.dim_200x200.png",
    border: "oklch(0.62 0.22 295)",
    glow: "0 0 16px oklch(0.62 0.22 295 / 0.8)",
    type: "male",
  },
  {
    index: 2,
    label: "Martial M",
    image: "/assets/generated/avatar-male-martial-transparent.dim_200x200.png",
    border: "oklch(0.82 0.18 85)",
    glow: "0 0 16px oklch(0.82 0.18 85 / 0.7)",
    type: "male",
  },
  {
    index: 3,
    label: "Phantom M",
    image: "/assets/generated/avatar-male-phantom-transparent.dim_200x200.png",
    border: "oklch(0.65 0.22 200)",
    glow: "0 0 16px oklch(0.65 0.22 200 / 0.7)",
    type: "male",
  },
  {
    index: 4,
    label: "Beast M",
    image: "/assets/generated/avatar-male-beast-transparent.dim_200x200.png",
    border: "oklch(0.72 0.2 45)",
    glow: "0 0 16px oklch(0.72 0.2 45 / 0.8)",
    type: "male",
  },
  {
    index: 5,
    label: "Shadow M",
    image: "/assets/generated/avatar-male-shadow-transparent.dim_200x200.png",
    border: "oklch(0.82 0.04 260)",
    glow: "0 0 16px oklch(0.82 0.04 260 / 0.6)",
    type: "male",
  },
  {
    index: 6,
    label: "Warrior F",
    image:
      "/assets/generated/avatar-female-warrior-transparent.dim_200x200.png",
    border: "oklch(0.72 0.28 22)",
    glow: "0 0 16px oklch(0.62 0.25 22 / 0.8)",
    type: "female",
  },
  {
    index: 7,
    label: "Sage F",
    image: "/assets/generated/avatar-female-sage-transparent.dim_200x200.png",
    border: "oklch(0.62 0.22 295)",
    glow: "0 0 16px oklch(0.62 0.22 295 / 0.8)",
    type: "female",
  },
  {
    index: 8,
    label: "Phantom F",
    image:
      "/assets/generated/avatar-female-phantom-transparent.dim_200x200.png",
    border: "oklch(0.72 0.22 295)",
    glow: "0 0 16px oklch(0.72 0.22 295 / 0.8)",
    type: "female",
  },
  {
    index: 9,
    label: "Martial F",
    image:
      "/assets/generated/avatar-female-martial-transparent.dim_200x200.png",
    border: "oklch(0.82 0.18 85)",
    glow: "0 0 16px oklch(0.82 0.18 85 / 0.7)",
    type: "female",
  },
  {
    index: 10,
    label: "Beast F",
    image: "/assets/generated/avatar-female-beast-transparent.dim_200x200.png",
    border: "oklch(0.72 0.2 45)",
    glow: "0 0 16px oklch(0.72 0.2 45 / 0.7)",
    type: "female",
  },
  {
    index: 11,
    label: "Shadow F",
    image: "/assets/generated/avatar-female-shadow-transparent.dim_200x200.png",
    border: "oklch(0.82 0.04 260)",
    glow: "0 0 16px oklch(0.82 0.04 260 / 0.6)",
    type: "female",
  },
];

export function getAvatarKey(principalId: string): string {
  return `bmx-avatar-${principalId}`;
}

export function loadAvatar(principalId: string): number {
  const stored = localStorage.getItem(getAvatarKey(principalId));
  if (stored !== null) {
    const idx = Number.parseInt(stored, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < AVATAR_OPTIONS.length) {
      return idx;
    }
  }
  return 0;
}

export function saveAvatar(principalId: string, avatarIndex: number): void {
  localStorage.setItem(getAvatarKey(principalId), String(avatarIndex));
}

// ─── Date helpers for mission IDs ───────────────────────────────
export function getDateString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

export function getWeekString(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 +
      startOfYear.getDay() +
      1) /
      7,
  );
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function getMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0] ?? "";
}
