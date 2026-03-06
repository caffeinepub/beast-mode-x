import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CharacterConfig {
  gender: "male" | "female";
  bodyType: "slim" | "athletic" | "strong";
  hairStyle: number; // 0-11
  hairColor: string;
  skinTone: string;
  eyeColor: string;
  outfitStyle: number; // 0-8
  outfitColor: string;
  auraColor: string;
  accessory: number; // 0-7
  characterName: string;
  selectedClass: string | null;
  classProgress: Record<string, { xp: number; kills: number }>;
}

interface CharacterStore {
  config: CharacterConfig;
  setConfig: (config: Partial<CharacterConfig>) => void;
  resetConfig: () => void;
}

export const DEFAULT_CHARACTER_CONFIG: CharacterConfig = {
  gender: "male",
  bodyType: "athletic",
  hairStyle: 2,
  hairColor: "#00ffff",
  skinTone: "#f5c5a3",
  eyeColor: "#00ffff",
  outfitStyle: 0,
  outfitColor: "#001133",
  auraColor: "#00aaff",
  accessory: 0,
  characterName: "BEAST WARRIOR",
  selectedClass: null,
  classProgress: {},
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      config: DEFAULT_CHARACTER_CONFIG,

      setConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
        })),

      resetConfig: () =>
        set({
          config: DEFAULT_CHARACTER_CONFIG,
        }),
    }),
    {
      name: "bmlx_character_v1",
    },
  ),
);
