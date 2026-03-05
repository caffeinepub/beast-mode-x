import type { CategoryXP } from "../backend.d";

// ─── Class System ───────────────────────────────────────────────
export interface ClassInfo {
  name: "WARRIOR" | "SAGE" | "PHANTOM";
  icon: string;
  color: string;
  desc: string;
}

export function getClassInfo(categoryXP: CategoryXP): ClassInfo {
  const warrior = Number(categoryXP.fitness) + Number(categoryXP.martial);
  const sage = Number(categoryXP.intelligence) + Number(categoryXP.focus);
  const phantom = Number(categoryXP.discipline) + Number(categoryXP.mindset);

  if (warrior >= sage && warrior >= phantom) {
    return {
      name: "WARRIOR",
      icon: "⚔️",
      color: "oklch(0.62 0.25 22)",
      desc: "Forged in battle",
    };
  }
  if (sage >= warrior && sage >= phantom) {
    return {
      name: "SAGE",
      icon: "📚",
      color: "oklch(0.65 0.22 250)",
      desc: "Master of mind",
    };
  }
  return {
    name: "PHANTOM",
    icon: "🌙",
    color: "oklch(0.62 0.22 295)",
    desc: "Shadow of discipline",
  };
}

// ─── Avatar System ───────────────────────────────────────────────
export interface AvatarOption {
  index: number;
  letter: string;
  gradient: string;
  border: string;
  glow: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    index: 0,
    letter: "A",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.65 0.22 45) 100%)",
    border: "oklch(0.72 0.28 22)",
    glow: "0 0 12px oklch(0.62 0.25 22 / 0.6)",
  },
  {
    index: 1,
    letter: "B",
    gradient:
      "linear-gradient(135deg, oklch(0.45 0.22 295) 0%, oklch(0.55 0.25 240) 100%)",
    border: "oklch(0.62 0.22 295)",
    glow: "0 0 12px oklch(0.62 0.22 295 / 0.6)",
  },
  {
    index: 2,
    letter: "C",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.2 200) 0%, oklch(0.65 0.18 160) 100%)",
    border: "oklch(0.72 0.2 200)",
    glow: "0 0 12px oklch(0.62 0.2 200 / 0.6)",
  },
  {
    index: 3,
    letter: "D",
    gradient:
      "linear-gradient(135deg, oklch(0.82 0.18 85) 0%, oklch(0.78 0.2 60) 100%)",
    border: "oklch(0.85 0.18 85)",
    glow: "0 0 12px oklch(0.82 0.18 85 / 0.6)",
  },
  {
    index: 4,
    letter: "E",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.2 140) 0%, oklch(0.7 0.22 120) 100%)",
    border: "oklch(0.7 0.2 140)",
    glow: "0 0 12px oklch(0.62 0.2 140 / 0.6)",
  },
  {
    index: 5,
    letter: "F",
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.25 340) 0%, oklch(0.62 0.22 0) 100%)",
    border: "oklch(0.72 0.25 340)",
    glow: "0 0 12px oklch(0.65 0.25 340 / 0.6)",
  },
  {
    index: 6,
    letter: "G",
    gradient:
      "linear-gradient(135deg, oklch(0.82 0.04 260) 0%, oklch(0.72 0.06 240) 100%)",
    border: "oklch(0.85 0.04 260)",
    glow: "0 0 12px oklch(0.82 0.04 260 / 0.5)",
  },
  {
    index: 7,
    letter: "H",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.28 22) 0%, oklch(0.48 0.22 10) 100%)",
    border: "oklch(0.62 0.3 22)",
    glow: "0 0 16px oklch(0.62 0.3 22 / 0.8)",
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
