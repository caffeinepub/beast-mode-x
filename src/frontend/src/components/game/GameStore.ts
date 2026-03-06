import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InventoryItem {
  id: string;
  type: "weapon" | "potion" | "armor" | "material";
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  attackBonus: number;
  defenseBonus: number;
  quantity: number;
  icon: string;
  description?: string;
}

export interface AttackCard {
  id: string;
  name: string;
  icon: string;
  damage: number;
  manaCost: number;
  minLevel: number;
  color: string;
  hitCount?: number;
  aoeRadius?: number;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  healAmount?: number;
}

export const ATTACK_CARDS: AttackCard[] = [
  {
    id: "shadow_fist",
    name: "SHADOW FIST",
    icon: "🌑",
    damage: 18,
    manaCost: 0,
    minLevel: 1,
    color: "#9d00ff",
    description: "Dark energy erupts from your fist. Free attack.",
    rarity: "common",
  },
  {
    id: "beast_surge",
    name: "BEAST SURGE",
    icon: "🔥",
    damage: 30,
    manaCost: 8,
    minLevel: 1,
    color: "#ff4400",
    description: "Raw primal power burst. Burns through defenses.",
    rarity: "common",
  },
  {
    id: "void_slash",
    name: "VOID SLASH",
    icon: "💠",
    damage: 55,
    manaCost: 15,
    minLevel: 3,
    color: "#00ffff",
    description: "Dimensional cut tears through reality.",
    rarity: "rare",
  },
  {
    id: "crimson_strike",
    name: "CRIMSON STRIKE",
    icon: "⚡",
    damage: 85,
    manaCost: 22,
    minLevel: 5,
    color: "#ff0033",
    description: "Blood-red piercing attack. High precision.",
    rarity: "rare",
  },
  {
    id: "soul_rend",
    name: "SOUL REND",
    icon: "💀",
    damage: 120,
    manaCost: 35,
    minLevel: 8,
    color: "#cc00ff",
    description: "Tears through enemy soul. Hits 3x.",
    rarity: "epic",
    hitCount: 3,
    healAmount: 20,
  },
  {
    id: "thunder_burst",
    name: "THUNDER BURST",
    icon: "⚡",
    damage: 200,
    manaCost: 50,
    minLevel: 12,
    color: "#ffff00",
    description: "Lightning explosion vaporizes foes.",
    rarity: "epic",
    hitCount: 2,
  },
  {
    id: "dark_ascension",
    name: "DARK ASCENSION",
    icon: "🌌",
    damage: 350,
    manaCost: 70,
    minLevel: 18,
    color: "#220044",
    description: "Shadow eruption consumes all light.",
    rarity: "legendary",
  },
  {
    id: "beast_mode_ultimate",
    name: "BEAST MODE ULTIMATE",
    icon: "👑",
    damage: 600,
    manaCost: 100,
    minLevel: 25,
    color: "#ff00aa",
    description: "ULTIMATE POWER. All colors. Pure destruction.",
    rarity: "legendary",
    hitCount: 4,
  },
];

export interface EnemyBattleData {
  type: string;
  label: string;
  hp: number;
  maxHp: number;
  damage: number;
  xpReward: number;
  goldReward: number;
  isBoss: boolean;
  color: string;
}

export type BattlePhase =
  | "idle"
  | "start"
  | "player_turn"
  | "enemy_turn"
  | "animating"
  | "victory"
  | "defeat";

// ─── Class-specific attack cards ──────────────────────────────────────────────
export const CLASS_ATTACK_CARDS: Record<string, AttackCard[]> = {
  SHADOW_MONARCH: [
    {
      id: "shadow_fist_sm",
      name: "SHADOW FIST",
      icon: "🌑",
      damage: 25,
      manaCost: 0,
      minLevel: 1,
      color: "#9d00ff",
      description: "Dark energy erupts from your fist. Free attack.",
      rarity: "common",
    },
    {
      id: "dark_slash",
      name: "DARK SLASH",
      icon: "🗡️",
      damage: 60,
      manaCost: 25,
      minLevel: 3,
      color: "#7700cc",
      description: "A dimensional blade slices through shadow.",
      rarity: "rare",
    },
    {
      id: "shadow_step",
      name: "SHADOW STEP",
      icon: "👣",
      damage: 85,
      manaCost: 30,
      minLevel: 5,
      color: "#6600bb",
      description: "Vanish into shadow and strike from behind.",
      rarity: "rare",
    },
    {
      id: "shadow_army",
      name: "SHADOW ARMY",
      icon: "👥",
      damage: 100,
      manaCost: 40,
      minLevel: 8,
      color: "#5500aa",
      description: "Shadow soldiers attack in unison. Hits 3x.",
      rarity: "epic",
      hitCount: 3,
    },
    {
      id: "domain_expansion_sm",
      name: "DOMAIN EXPANSION",
      icon: "🔲",
      damage: 200,
      manaCost: 55,
      minLevel: 12,
      color: "#440088",
      description: "Expand your domain of shadows. All inside are helpless.",
      rarity: "epic",
    },
    {
      id: "monarch_arise",
      name: "MONARCH ARISE",
      icon: "💀",
      damage: 280,
      manaCost: 65,
      minLevel: 16,
      color: "#8800cc",
      description: "Raise fallen warriors as shadow soldiers.",
      rarity: "epic",
      hitCount: 2,
    },
    {
      id: "void_domination",
      name: "VOID DOMINATION",
      icon: "👑",
      damage: 350,
      manaCost: 80,
      minLevel: 20,
      color: "#cc00ff",
      description: "The Shadow Monarch's absolute authority. LEGENDARY.",
      rarity: "legendary",
    },
    {
      id: "shadow_realm",
      name: "SHADOW REALM",
      icon: "🌌",
      damage: 450,
      manaCost: 80,
      minLevel: 28,
      color: "#440088",
      description: "Drag enemy into the realm of shadows — no escape.",
      rarity: "legendary",
    },
    {
      id: "monarchs_decree",
      name: "MONARCH'S DECREE",
      icon: "👑",
      damage: 750,
      manaCost: 120,
      minLevel: 35,
      color: "#9d00ff",
      description: "The absolute will of the Shadow Monarch. None can resist.",
      rarity: "legendary",
      hitCount: 3,
    },
  ],
  THUNDER_GOD: [
    {
      id: "static_punch",
      name: "STATIC PUNCH",
      icon: "⚡",
      damage: 22,
      manaCost: 0,
      minLevel: 1,
      color: "#ffdd00",
      description: "Electrified fist crackles with static. Free attack.",
      rarity: "common",
    },
    {
      id: "chain_lightning",
      name: "CHAIN LIGHTNING",
      icon: "🌩️",
      damage: 55,
      manaCost: 20,
      minLevel: 3,
      color: "#00ccff",
      description: "Lightning jumps between enemies. Hits 2x.",
      rarity: "rare",
      hitCount: 2,
    },
    {
      id: "volt_spike",
      name: "VOLT SPIKE",
      icon: "🔱",
      damage: 80,
      manaCost: 28,
      minLevel: 5,
      color: "#ffcc00",
      description: "Concentrated voltage spike pierces armor.",
      rarity: "rare",
    },
    {
      id: "thunder_clap",
      name: "THUNDER CLAP",
      icon: "💥",
      damage: 120,
      manaCost: 35,
      minLevel: 8,
      color: "#ffaa00",
      description: "Thunderous shockwave stuns the target.",
      rarity: "epic",
    },
    {
      id: "lightning_prison",
      name: "LIGHTNING PRISON",
      icon: "⚡",
      damage: 190,
      manaCost: 50,
      minLevel: 12,
      color: "#00aaff",
      description: "Cage of lightning entraps and shocks the enemy.",
      rarity: "epic",
    },
    {
      id: "storm_emperor",
      name: "STORM EMPEROR",
      icon: "🌪️",
      damage: 260,
      manaCost: 62,
      minLevel: 16,
      color: "#ffffff",
      description: "Command the full force of the storm.",
      rarity: "epic",
      hitCount: 2,
    },
    {
      id: "gods_wrath",
      name: "GOD'S WRATH",
      icon: "⚡",
      damage: 400,
      manaCost: 75,
      minLevel: 20,
      color: "#ffffff",
      description: "Divine lightning judgment from the heavens. LEGENDARY.",
      rarity: "legendary",
    },
    {
      id: "divine_thunder",
      name: "DIVINE THUNDER",
      icon: "⛈️",
      damage: 480,
      manaCost: 82,
      minLevel: 28,
      color: "#ffee00",
      description: "Thunder blessed by the gods themselves.",
      rarity: "legendary",
    },
    {
      id: "zeus_judgement",
      name: "ZEUS JUDGEMENT",
      icon: "🌩️",
      damage: 780,
      manaCost: 125,
      minLevel: 35,
      color: "#ffffff",
      description: "The divine punishment of Zeus rains down. Obliterates all.",
      rarity: "legendary",
      hitCount: 2,
    },
  ],
  INFERNO_KING: [
    {
      id: "ember_strike",
      name: "EMBER STRIKE",
      icon: "🔥",
      damage: 28,
      manaCost: 0,
      minLevel: 1,
      color: "#ff4400",
      description: "Burning fist ignites the enemy. Free attack.",
      rarity: "common",
    },
    {
      id: "fire_wave",
      name: "FIRE WAVE",
      icon: "🌊",
      damage: 70,
      manaCost: 22,
      minLevel: 3,
      color: "#ff6600",
      description: "A wave of scorching flame washes over the enemy.",
      rarity: "rare",
    },
    {
      id: "flame_blade",
      name: "FLAME BLADE",
      icon: "🗡️",
      damage: 95,
      manaCost: 30,
      minLevel: 5,
      color: "#ff4400",
      description: "Blade wreathed in living fire slashes deeply.",
      rarity: "rare",
    },
    {
      id: "magma_burst",
      name: "MAGMA BURST",
      icon: "🌋",
      damage: 130,
      manaCost: 38,
      minLevel: 8,
      color: "#ff2200",
      description: "Molten magma erupts beneath the enemy.",
      rarity: "epic",
    },
    {
      id: "inferno_nova",
      name: "INFERNO NOVA",
      icon: "☀️",
      damage: 200,
      manaCost: 52,
      minLevel: 12,
      color: "#ff6600",
      description: "Nova explosion of concentrated inferno energy.",
      rarity: "epic",
    },
    {
      id: "volcanic_wrath",
      name: "VOLCANIC WRATH",
      icon: "🌋",
      damage: 270,
      manaCost: 65,
      minLevel: 16,
      color: "#cc2200",
      description: "The wrath of volcanoes unleashed upon your enemy.",
      rarity: "epic",
      hitCount: 2,
    },
    {
      id: "dragons_roar",
      name: "DRAGON'S ROAR",
      icon: "🐉",
      damage: 380,
      manaCost: 80,
      minLevel: 20,
      color: "#ff8800",
      description: "Ancient dragon fire consumes everything. LEGENDARY.",
      rarity: "legendary",
    },
    {
      id: "hellfire_nova",
      name: "HELLFIRE NOVA",
      icon: "💥",
      damage: 460,
      manaCost: 80,
      minLevel: 28,
      color: "#ff0000",
      description: "Fire from the deepest pits of hell erupts outward.",
      rarity: "legendary",
    },
    {
      id: "dragon_emperor_atk",
      name: "DRAGON EMPEROR",
      icon: "🐉",
      damage: 800,
      manaCost: 130,
      minLevel: 35,
      color: "#ff8800",
      description:
        "The Dragon Emperor's ultimate fire. World-destroying power.",
      rarity: "legendary",
      hitCount: 3,
    },
  ],
  FROST_SOVEREIGN: [
    {
      id: "ice_shard",
      name: "ICE SHARD",
      icon: "❄️",
      damage: 20,
      manaCost: 0,
      minLevel: 1,
      color: "#00ffff",
      description: "Razor-sharp ice shard launched at enemy. Free attack.",
      rarity: "common",
    },
    {
      id: "blizzard",
      name: "BLIZZARD",
      icon: "🌨️",
      damage: 65,
      manaCost: 20,
      minLevel: 3,
      color: "#aaeeff",
      description: "Freezing storm batters the enemy continuously.",
      rarity: "rare",
    },
    {
      id: "frost_lance",
      name: "FROST LANCE",
      icon: "🔱",
      damage: 90,
      manaCost: 28,
      minLevel: 5,
      color: "#00ddff",
      description: "A lance of solid ice pierces through armor.",
      rarity: "rare",
    },
    {
      id: "cryo_freeze",
      name: "CRYO FREEZE",
      icon: "🧊",
      damage: 110,
      manaCost: 38,
      minLevel: 8,
      color: "#00ccee",
      description: "Absolute cold freezes enemy in place. Bonus stun.",
      rarity: "epic",
    },
    {
      id: "avalanche",
      name: "AVALANCHE",
      icon: "🏔️",
      damage: 190,
      manaCost: 50,
      minLevel: 12,
      color: "#aaeeff",
      description: "Massive avalanche of ice crushes all before it.",
      rarity: "epic",
    },
    {
      id: "frozen_world",
      name: "FROZEN WORLD",
      icon: "🌍",
      damage: 260,
      manaCost: 63,
      minLevel: 16,
      color: "#00ffff",
      description: "Freeze the entire battlefield — nothing moves.",
      rarity: "epic",
      hitCount: 2,
    },
    {
      id: "absolute_zero",
      name: "ABSOLUTE ZERO",
      icon: "💎",
      damage: 360,
      manaCost: 78,
      minLevel: 20,
      color: "#ccffff",
      description: "Temperature drops to absolute zero. LEGENDARY.",
      rarity: "legendary",
    },
    {
      id: "glacial_epoch",
      name: "GLACIAL EPOCH",
      icon: "🌊",
      damage: 440,
      manaCost: 78,
      minLevel: 28,
      color: "#00ccff",
      description: "Begin a new ice age — the glacial epoch begins now.",
      rarity: "legendary",
    },
    {
      id: "permafrost",
      name: "PERMAFROST",
      icon: "❄️",
      damage: 760,
      manaCost: 120,
      minLevel: 35,
      color: "#ccffff",
      description: "Eternal permafrost encases the enemy forever. Inescapable.",
      rarity: "legendary",
      hitCount: 2,
    },
  ],
  BLOOD_BERSERKER: [
    {
      id: "rage_strike",
      name: "RAGE STRIKE",
      icon: "💢",
      damage: 30,
      manaCost: 0,
      minLevel: 1,
      color: "#cc0000",
      description: "Fury-powered strike with raw aggression. Free attack.",
      rarity: "common",
    },
    {
      id: "blood_slash",
      name: "BLOOD SLASH",
      icon: "🩸",
      damage: 80,
      manaCost: 18,
      minLevel: 3,
      color: "#aa0000",
      description: "Crimson blade draws blood and heals the berserker.",
      rarity: "rare",
      healAmount: 20,
    },
    {
      id: "frenzy_strike",
      name: "FRENZY STRIKE",
      icon: "⚔️",
      damage: 100,
      manaCost: 24,
      minLevel: 5,
      color: "#dd0000",
      description: "Frenzied multi-hit barrage. Hits 2x.",
      rarity: "rare",
      hitCount: 2,
    },
    {
      id: "berserk_mode",
      name: "BERSERK MODE",
      icon: "😤",
      damage: 140,
      manaCost: 30,
      minLevel: 8,
      color: "#880000",
      description: "Pure unbridled rage unleashed. Maximum damage.",
      rarity: "epic",
    },
    {
      id: "blood_nova",
      name: "BLOOD NOVA",
      icon: "💥",
      damage: 210,
      manaCost: 48,
      minLevel: 12,
      color: "#ff0000",
      description: "Explosion of blood energy tears the air apart.",
      rarity: "epic",
    },
    {
      id: "carnage",
      name: "CARNAGE",
      icon: "🗡️",
      damage: 280,
      manaCost: 60,
      minLevel: 16,
      color: "#cc0022",
      description: "Pure carnage mode — no mercy, only destruction.",
      rarity: "epic",
      hitCount: 3,
      healAmount: 30,
    },
    {
      id: "crimson_extinction",
      name: "CRIMSON EXTINCTION",
      icon: "☠️",
      damage: 420,
      manaCost: 70,
      minLevel: 20,
      color: "#ff0044",
      description: "Total annihilation through pure bloodlust. LEGENDARY.",
      rarity: "legendary",
    },
    {
      id: "crimson_tide",
      name: "CRIMSON TIDE",
      icon: "🌊",
      damage: 470,
      manaCost: 85,
      minLevel: 28,
      color: "#cc0000",
      description: "A tide of crimson blood washes over all enemies.",
      rarity: "legendary",
    },
    {
      id: "blood_god_mode",
      name: "BLOOD GOD MODE",
      icon: "💀",
      damage: 810,
      manaCost: 130,
      minLevel: 35,
      color: "#ff0033",
      description:
        "Ascend to Blood God form — pure destruction incarnate. LEGENDARY.",
      rarity: "legendary",
      hitCount: 4,
      healAmount: 100,
    },
  ],
  VOID_ARCHMAGE: [
    {
      id: "void_touch",
      name: "VOID TOUCH",
      icon: "🔮",
      damage: 22,
      manaCost: 0,
      minLevel: 1,
      color: "#cc00ff",
      description: "Touch of void energy drains life. Free attack.",
      rarity: "common",
    },
    {
      id: "space_rend",
      name: "SPACE REND",
      icon: "💠",
      damage: 75,
      manaCost: 25,
      minLevel: 3,
      color: "#aa00dd",
      description: "Tears through the fabric of space itself.",
      rarity: "rare",
    },
    {
      id: "dimension_cut",
      name: "DIMENSION CUT",
      icon: "✂️",
      damage: 100,
      manaCost: 32,
      minLevel: 5,
      color: "#dd00ff",
      description: "Cut through dimensional barriers dealing massive damage.",
      rarity: "rare",
    },
    {
      id: "time_stop",
      name: "TIME STOP",
      icon: "⏱️",
      damage: 100,
      manaCost: 40,
      minLevel: 8,
      color: "#ff00cc",
      description: "Time frozen — enemy helpless against assault.",
      rarity: "epic",
    },
    {
      id: "void_collapse",
      name: "VOID COLLAPSE",
      icon: "🌀",
      damage: 220,
      manaCost: 55,
      minLevel: 12,
      color: "#aa00ff",
      description: "Collapse a section of void onto the target.",
      rarity: "epic",
    },
    {
      id: "reality_distort",
      name: "REALITY DISTORT",
      icon: "🔄",
      damage: 300,
      manaCost: 68,
      minLevel: 16,
      color: "#cc44ff",
      description: "Distort reality around the enemy — they cannot escape.",
      rarity: "epic",
      hitCount: 2,
    },
    {
      id: "singularity",
      name: "SINGULARITY",
      icon: "🌀",
      damage: 500,
      manaCost: 85,
      minLevel: 20,
      color: "#ff44ff",
      description:
        "Collapses reality into a single point of infinite power. LEGENDARY.",
      rarity: "legendary",
    },
    {
      id: "reality_break",
      name: "REALITY BREAK",
      icon: "💥",
      damage: 500,
      manaCost: 90,
      minLevel: 28,
      color: "#cc00ff",
      description: "Break reality itself — nothing survives the fracture.",
      rarity: "legendary",
    },
    {
      id: "big_bang",
      name: "BIG BANG",
      icon: "💫",
      damage: 850,
      manaCost: 135,
      minLevel: 35,
      color: "#ff88ff",
      description:
        "Recreate the birth of the universe in condensed form. Ultimate destruction.",
      rarity: "legendary",
      hitCount: 3,
    },
  ],
};

// GateRank type (avoid circular deps with GateSelectionScreen)
export type GateRankStore = string | null;

export interface GameState {
  // Player
  playerHP: number;
  maxPlayerHP: number;
  playerMana: number;
  maxPlayerMana: number;
  playerAgility: number;
  gold: number;
  kills: number;
  dungeonRuns: number;
  gameLevel: number;
  gameXP: number;
  sessionXP: number;
  sessionKills: number;
  playerClass: string | null;
  classKills: Record<string, number>;
  classXP: Record<string, number>;

  // Gate system
  gateRank: GateRankStore;
  gateWaves: number;

  // Inventory
  inventory: InventoryItem[];
  equippedWeapon: string;

  // Skill system
  unlockedSkills: string[]; // skill IDs unlocked by level
  equippedSkills: string[]; // 6 skill slot IDs (can be empty string for empty slot)
  lastNewSkills: string[]; // newly unlocked in last level-up (for notification)

  // Game
  currentZone: "normal" | "dungeon";
  wave: number;
  isGameOver: boolean;
  lastXPSync: number;

  // Turn-based battle state
  battlePhase: BattlePhase;
  currentEnemy: EnemyBattleData | null;
  battleLog: string[];
  isPlayerAttacking: boolean;
  isEnemyAttacking: boolean;
  isPlayerHurt: boolean;
  isEnemyHurt: boolean;
  lastLoot: InventoryItem[];

  // Actions
  setGateRank: (rank: string, waves: number) => void;
  awardKill: (xp: number, gold: number, drops: InventoryItem[]) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  equipWeapon: (id: string) => void;
  usePotion: (id: string) => void;
  enterDungeon: () => void;
  exitDungeon: () => void;
  nextWave: () => void;
  setGameLevel: (level: number) => void;
  resetHP: () => void;
  markXPSynced: () => void;
  addItem: (item: InventoryItem) => void;
  resetGame: () => void;
  setPlayerClass: (className: string) => void;
  resetClassProgress: (className: string) => void;

  // Skill actions
  unlockSkill: (skillId: string) => void;
  equipSkill: (slotIndex: number, skillId: string) => void;
  unequipSkill: (slotIndex: number) => void;
  clearLastNewSkills: () => void;
  getEquippedSkillCards: () => AttackCard[];

  // Turn-based battle actions
  setBattlePhase: (phase: BattlePhase) => void;
  spawnEnemy: (
    wave: number,
    zone: "normal" | "dungeon",
    gameLevel: number,
  ) => void;
  playerAttack: (card: AttackCard) => void;
  enemyAttack: () => void;
  addBattleLog: (msg: string) => void;
  clearBattle: () => void;
}

export const WEAPONS: Record<
  string,
  {
    name: string;
    icon: string;
    range: number;
    damage: number;
    manaCost: number;
    minLevel: number;
    color: string;
    rarity: "common" | "rare" | "epic" | "legendary";
    aoeRadius?: number;
    hitCount?: number;
    description: string;
  }
> = {
  fists: {
    name: "Shadow Fists",
    icon: "👊",
    range: 2.0,
    damage: 10,
    manaCost: 0,
    minLevel: 1,
    color: "#00ffff",
    rarity: "common",
    description: "Your fists infused with dark energy",
  },
  woodSword: {
    name: "Void Dagger",
    icon: "🗡️",
    range: 2.5,
    damage: 18,
    manaCost: 2,
    minLevel: 3,
    color: "#8B4513",
    rarity: "common",
    description: "A blade that cuts through dimensions",
  },
  ironSword: {
    name: "Crimson Edge",
    icon: "⚔️",
    range: 2.5,
    damage: 30,
    manaCost: 3,
    minLevel: 5,
    color: "#aaaaaa",
    rarity: "common",
    description: "Red-forged blade of pure power",
  },
  shadowBlade: {
    name: "Soul Reaper",
    icon: "🌑",
    range: 3.0,
    damage: 50,
    manaCost: 8,
    minLevel: 8,
    color: "#9d00ff",
    rarity: "epic",
    hitCount: 3,
    description: "Three-hit shadow slash",
  },
  dragonSword: {
    name: "Thunder Blade",
    icon: "🐉",
    range: 3.5,
    damage: 100,
    manaCost: 15,
    minLevel: 15,
    color: "#ff6600",
    rarity: "legendary",
    aoeRadius: 2.5,
    description: "Lightning-infused dragon weapon",
  },
  voidScythe: {
    name: "Void Scythe of Ascension",
    icon: "💀",
    range: 5.0,
    damage: 200,
    manaCost: 30,
    minLevel: 25,
    color: "#ff00ff",
    rarity: "legendary",
    aoeRadius: 5.0,
    description: "Ultimate weapon. Destroys all.",
  },
};

// ─── Monster definitions for turn-based battles ──────────────────────────────
interface MonsterBattleConfig {
  label: string;
  baseHp: number;
  baseDamage: number;
  xp: number;
  gold: number;
  isBoss: boolean;
  color: string;
  type: string;
}

const BATTLE_MONSTERS: MonsterBattleConfig[] = [
  {
    type: "goblin",
    label: "Goblin",
    baseHp: 40,
    baseDamage: 8,
    xp: 15,
    gold: 5,
    isBoss: false,
    color: "#22aa22",
  },
  {
    type: "shadowBeast",
    label: "Shadow Beast",
    baseHp: 90,
    baseDamage: 15,
    xp: 35,
    gold: 15,
    isBoss: false,
    color: "#6600aa",
  },
  {
    type: "boneKnight",
    label: "Bone Knight",
    baseHp: 160,
    baseDamage: 22,
    xp: 70,
    gold: 30,
    isBoss: false,
    color: "#ddddcc",
  },
  {
    type: "voidDemon",
    label: "Void Demon",
    baseHp: 300,
    baseDamage: 38,
    xp: 150,
    gold: 60,
    isBoss: false,
    color: "#cc1100",
  },
  {
    type: "shadowLord",
    label: "⚠ SHADOW LORD",
    baseHp: 600,
    baseDamage: 55,
    xp: 300,
    gold: 150,
    isBoss: true,
    color: "#9900cc",
  },
  {
    type: "voidKing",
    label: "⚠ VOID KING",
    baseHp: 1200,
    baseDamage: 85,
    xp: 600,
    gold: 300,
    isBoss: true,
    color: "#aa00ff",
  },
  {
    type: "dragonEmperor",
    label: "⚠ DRAGON EMPEROR",
    baseHp: 2500,
    baseDamage: 130,
    xp: 1200,
    gold: 600,
    isBoss: true,
    color: "#ff6600",
  },
];

function getLootDrops(monsterType: string): InventoryItem[] {
  const drops: InventoryItem[] = [];
  const rand = Math.random;

  if (rand() < 0.25) {
    drops.push({
      id: "health_potion",
      type: "potion",
      name: "Health Potion",
      rarity: "common",
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "🧪",
    });
  }
  if (
    (monsterType === "boneKnight" ||
      monsterType === "shadowLord" ||
      monsterType === "voidKing" ||
      monsterType === "dragonEmperor") &&
    rand() < 0.2
  ) {
    drops.push({
      id: "ironSword",
      type: "weapon",
      name: "Iron Sword",
      rarity: "common",
      attackBonus: 30,
      defenseBonus: 0,
      quantity: 1,
      icon: "⚔️",
    });
  }
  if (
    (monsterType === "boneKnight" ||
      monsterType === "shadowLord" ||
      monsterType === "voidDemon") &&
    rand() < 0.25
  ) {
    drops.push({
      id: "armor_shard",
      type: "armor",
      name: "Armor Shard",
      rarity: "rare",
      attackBonus: 0,
      defenseBonus: 5,
      quantity: 1,
      icon: "🛡️",
    });
  }
  if (
    (monsterType === "voidDemon" ||
      monsterType === "voidKing" ||
      monsterType === "dragonEmperor") &&
    rand() < 0.25
  ) {
    drops.push({
      id: "shadowBlade",
      type: "weapon",
      name: "Shadow Blade",
      rarity: "epic",
      attackBonus: 50,
      defenseBonus: 0,
      quantity: 1,
      icon: "🌑",
    });
  }
  if (
    (monsterType === "voidDemon" || monsterType === "voidKing") &&
    rand() < 0.3
  ) {
    drops.push({
      id: "epic_potion",
      type: "potion",
      name: "Epic Potion",
      rarity: "epic",
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "💜",
    });
  }

  // Iron Armor from bone knight+
  if (
    (monsterType === "boneKnight" || monsterType === "shadowLord") &&
    rand() < 0.2
  ) {
    drops.push({
      id: "iron_armor",
      type: "armor",
      name: "Iron Armor",
      rarity: "rare",
      attackBonus: 0,
      defenseBonus: 15,
      quantity: 1,
      icon: "🥋",
    });
  }
  // Shadow Armor from void demon+
  if (
    (monsterType === "voidDemon" || monsterType === "voidKing") &&
    rand() < 0.2
  ) {
    drops.push({
      id: "shadow_armor",
      type: "armor",
      name: "Shadow Armor",
      rarity: "epic",
      attackBonus: 0,
      defenseBonus: 30,
      quantity: 1,
      icon: "🛡️",
    });
  }
  // Dragon Armor from dragon emperor
  if (monsterType === "dragonEmperor" && rand() < 0.3) {
    drops.push({
      id: "dragon_armor",
      type: "armor",
      name: "Dragon Armor",
      rarity: "legendary",
      attackBonus: 0,
      defenseBonus: 60,
      quantity: 1,
      icon: "🔥",
    });
  }
  // Skill scrolls (materials)
  if (rand() < 0.12) {
    const scrolls = [
      { id: "fire_scroll", name: "Fire Scroll", icon: "🔥" },
      { id: "thunder_scroll", name: "Thunder Scroll", icon: "⚡" },
      { id: "ice_scroll", name: "Ice Scroll", icon: "❄️" },
    ];
    const scroll = scrolls[Math.floor(Math.random() * scrolls.length)];
    drops.push({
      ...(scroll as { id: string; name: string; icon: string }),
      type: "material",
      rarity: "rare",
      attackBonus: 10,
      defenseBonus: 0,
      quantity: 1,
    });
  }
  // Gems
  if (rand() < 0.1) {
    drops.push({
      id: `gem_${Date.now()}`,
      type: "material",
      name: "Power Gem",
      rarity: "rare",
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "💎",
    });
  }
  // Elixirs
  if (rand() < 0.1) {
    drops.push({
      id: "elixir",
      type: "potion",
      name: "Elixir",
      rarity: "legendary",
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "✨",
      description: "Fully restores HP and MP",
    });
  }

  // Boss guaranteed drops
  if (monsterType === "shadowLord") {
    drops.push({
      id: "shadowBlade",
      type: "weapon",
      name: "Shadow Blade",
      rarity: "epic",
      attackBonus: 50,
      defenseBonus: 0,
      quantity: 1,
      icon: "🌑",
    });
    drops.push({
      id: "shadow_material",
      type: "material",
      name: "Shadow Crystal",
      rarity: "epic",
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "💎",
    });
  }
  if (monsterType === "voidKing") {
    drops.push({
      id: "dragonSword",
      type: "weapon",
      name: "Dragon Sword",
      rarity: "legendary",
      attackBonus: 100,
      defenseBonus: 0,
      quantity: 1,
      icon: "🐉",
    });
  }
  if (monsterType === "dragonEmperor") {
    drops.push({
      id: "voidScythe",
      type: "weapon",
      name: "Void Scythe",
      rarity: "legendary",
      attackBonus: 200,
      defenseBonus: 0,
      quantity: 1,
      icon: "💀",
    });
    drops.push({
      id: "dragon_scale",
      type: "material",
      name: "Dragon Scale",
      rarity: "legendary",
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "🔥",
    });
  }

  return drops;
}

const initialInventory: InventoryItem[] = [
  {
    id: "fists",
    type: "weapon",
    name: "Shadow Fists",
    rarity: "common",
    attackBonus: 10,
    defenseBonus: 0,
    quantity: 1,
    icon: "👊",
    description: "Your fists infused with dark energy",
  },
  {
    id: "health_potion_starter",
    type: "potion",
    name: "Health Potion",
    rarity: "common",
    attackBonus: 0,
    defenseBonus: 0,
    quantity: 3,
    icon: "🧪",
    description: "Restores 50 HP",
  },
];

// ─── Helper: get IDs of newly unlocked skills between two levels ──────────────
function getNewlyUnlockedSkillIds(
  prevLevel: number,
  newLevel: number,
  playerClass: string | null,
): string[] {
  if (newLevel <= prevLevel) return [];
  const pool =
    playerClass && CLASS_ATTACK_CARDS[playerClass]
      ? CLASS_ATTACK_CARDS[playerClass]
      : ATTACK_CARDS;
  return pool
    .filter((card) => card.minLevel > prevLevel && card.minLevel <= newLevel)
    .map((card) => card.id);
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerHP: 100,
      maxPlayerHP: 100,
      playerMana: 80,
      maxPlayerMana: 80,
      playerAgility: 1,
      gold: 0,
      kills: 0,
      dungeonRuns: 0,
      gameLevel: 1,
      gameXP: 0,
      sessionXP: 0,
      sessionKills: 0,
      playerClass: null,
      classKills: {},
      classXP: {},
      inventory: initialInventory,
      equippedWeapon: "fists",

      // Skill system — start with first 2 generic skills unlocked and equipped
      unlockedSkills: ["shadow_fist", "beast_surge"],
      equippedSkills: ["shadow_fist", "beast_surge", "", "", "", ""],
      lastNewSkills: [],

      currentZone: "normal",
      wave: 1,
      isGameOver: false,
      lastXPSync: 0,
      gateRank: null,
      gateWaves: 3,

      // Turn-based battle state
      battlePhase: "idle",
      currentEnemy: null,
      battleLog: [],
      isPlayerAttacking: false,
      isEnemyAttacking: false,
      isPlayerHurt: false,
      isEnemyHurt: false,
      lastLoot: [],

      setGateRank: (rank, waves) => {
        set({ gateRank: rank, gateWaves: waves });
      },

      awardKill: (xp, gold, drops) => {
        const state = get();
        const newKills = state.kills + 1;
        const newSessionKills = state.sessionKills + 1;
        const newGold = state.gold + gold;
        const newGameXP = state.gameXP + xp;
        const newSessionXP = state.sessionXP + xp;

        // Level up formula: level = floor(sqrt(totalXP / 50)) + 1
        const prevLevel = state.gameLevel;
        const newLevel = Math.floor(Math.sqrt(newGameXP / 50)) + 1;

        // Merge drops into inventory
        const newInventory = [...state.inventory];
        for (const drop of drops) {
          const existing = newInventory.find((item) => item.id === drop.id);
          if (existing) {
            existing.quantity += drop.quantity;
          } else {
            newInventory.push({ ...drop });
          }
        }

        // Max HP/Mana increases with game level (new formulas)
        const newMaxHP = 100 + newLevel * 15;
        const newMaxMana = 80 + newLevel * 8;
        // Agility: +1 per 5 levels
        const newAgility = Math.floor(newLevel / 5) + 1;

        // Track class-specific progress
        const newClassKills = { ...state.classKills };
        const newClassXP = { ...state.classXP };
        if (state.playerClass) {
          newClassKills[state.playerClass] =
            (newClassKills[state.playerClass] ?? 0) + 1;
          newClassXP[state.playerClass] =
            (newClassXP[state.playerClass] ?? 0) + xp;
        }

        // Auto-unlock new skills on level-up
        let newUnlockedSkills = [...state.unlockedSkills];
        let newLastNewSkills: string[] = [];
        if (newLevel > prevLevel) {
          const newSkillIds = getNewlyUnlockedSkillIds(
            prevLevel,
            newLevel,
            state.playerClass,
          );
          for (const id of newSkillIds) {
            if (!newUnlockedSkills.includes(id)) {
              newUnlockedSkills.push(id);
              newLastNewSkills.push(id);
            }
          }
          // Also unlock class-specific skills if class is now set
          if (state.playerClass) {
            const classPool = CLASS_ATTACK_CARDS[state.playerClass] ?? [];
            for (const card of classPool) {
              if (
                card.minLevel <= newLevel &&
                !newUnlockedSkills.includes(card.id)
              ) {
                newUnlockedSkills.push(card.id);
                newLastNewSkills.push(card.id);
              }
            }
          }
        }

        set({
          kills: newKills,
          sessionKills: newSessionKills,
          gold: newGold,
          gameXP: newGameXP,
          sessionXP: newSessionXP,
          gameLevel: newLevel,
          maxPlayerHP: newMaxHP,
          maxPlayerMana: newMaxMana,
          playerAgility: newAgility,
          inventory: newInventory,
          classKills: newClassKills,
          classXP: newClassXP,
          unlockedSkills: newUnlockedSkills,
          lastNewSkills: newLastNewSkills,
        });
      },

      takeDamage: (amount) => {
        const state = get();
        const defense =
          state.inventory
            .filter((i) => i.type === "armor" && i.id === state.equippedWeapon)
            .reduce((sum, i) => sum + i.defenseBonus, 0) ?? 0;
        const reduced = Math.max(1, amount - defense);
        const newHP = Math.max(0, state.playerHP - reduced);
        set({ playerHP: newHP, isGameOver: newHP <= 0 });
      },

      heal: (amount) => {
        const state = get();
        set({ playerHP: Math.min(state.maxPlayerHP, state.playerHP + amount) });
      },

      equipWeapon: (id) => {
        const state = get();
        const weapon = state.inventory.find(
          (i) => i.id === id && i.type === "weapon",
        );
        if (weapon) {
          set({ equippedWeapon: id });
        }
      },

      usePotion: (id) => {
        const state = get();
        const potion = state.inventory.find(
          (i) => i.id === id && i.type === "potion",
        );
        if (!potion || potion.quantity <= 0) return;

        const healAmount = id.includes("epic") ? 150 : 50;
        const newHP = Math.min(state.maxPlayerHP, state.playerHP + healAmount);

        const newInventory = state.inventory
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.type !== "potion" || item.quantity > 0);

        set({ playerHP: newHP, inventory: newInventory });
      },

      enterDungeon: () => {
        const state = get();
        set({
          currentZone: "dungeon",
          wave: 1,
          dungeonRuns: state.dungeonRuns + 1,
          playerHP: state.maxPlayerHP,
          playerMana: state.maxPlayerMana,
          battlePhase: "idle",
          currentEnemy: null,
          battleLog: [],
        });
      },

      exitDungeon: () => {
        set({
          currentZone: "normal",
          wave: 1,
          battlePhase: "idle",
          currentEnemy: null,
          battleLog: [],
        });
      },

      nextWave: () => {
        const state = get();
        set({ wave: state.wave + 1 });
      },

      setGameLevel: (level) => {
        set({ gameLevel: level });
      },

      resetHP: () => {
        const state = get();
        set({
          playerHP: state.maxPlayerHP,
          isGameOver: false,
          battlePhase: "idle",
          currentEnemy: null,
          battleLog: [],
        });
      },

      markXPSynced: () => {
        const state = get();
        set({ lastXPSync: state.sessionXP });
      },

      addItem: (item) => {
        const state = get();
        const existing = state.inventory.find((i) => i.id === item.id);
        if (existing) {
          set({
            inventory: state.inventory.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
        } else {
          set({ inventory: [...state.inventory, item] });
        }
      },

      resetGame: () => {
        set({
          playerHP: 100,
          maxPlayerHP: 100,
          playerMana: 50,
          maxPlayerMana: 50,
          gold: 0,
          kills: 0,
          sessionXP: 0,
          sessionKills: 0,
          currentZone: "normal",
          wave: 1,
          isGameOver: false,
          battlePhase: "idle",
          currentEnemy: null,
          battleLog: [],
        });
      },

      setPlayerClass: (className) => {
        const state = get();
        const existing = state.classKills[className] ?? 0;
        set({
          playerClass: className,
          classKills: { ...state.classKills, [className]: existing },
          classXP: {
            ...state.classXP,
            [className]: state.classXP[className] ?? 0,
          },
        });
      },

      resetClassProgress: (className) => {
        const state = get();
        set({
          classKills: { ...state.classKills, [className]: 0 },
          classXP: { ...state.classXP, [className]: 0 },
        });
      },

      // ─── Skill actions ──────────────────────────────────────────────────────

      unlockSkill: (skillId) => {
        const state = get();
        if (!state.unlockedSkills.includes(skillId)) {
          set({ unlockedSkills: [...state.unlockedSkills, skillId] });
        }
      },

      equipSkill: (slotIndex, skillId) => {
        const state = get();
        if (slotIndex < 0 || slotIndex > 5) return;
        const newSlots = [...state.equippedSkills];
        // Ensure array is 6 elements
        while (newSlots.length < 6) newSlots.push("");
        // Remove the skill from any other slot first
        for (let i = 0; i < 6; i++) {
          if (newSlots[i] === skillId && i !== slotIndex) {
            newSlots[i] = "";
          }
        }
        newSlots[slotIndex] = skillId;
        set({ equippedSkills: newSlots });
      },

      unequipSkill: (slotIndex) => {
        const state = get();
        if (slotIndex < 0 || slotIndex > 5) return;
        const newSlots = [...state.equippedSkills];
        while (newSlots.length < 6) newSlots.push("");
        newSlots[slotIndex] = "";
        set({ equippedSkills: newSlots });
      },

      clearLastNewSkills: () => {
        set({ lastNewSkills: [] });
      },

      getEquippedSkillCards: () => {
        const state = get();
        const allCards =
          state.playerClass && CLASS_ATTACK_CARDS[state.playerClass]
            ? [...CLASS_ATTACK_CARDS[state.playerClass], ...ATTACK_CARDS]
            : ATTACK_CARDS;
        const cardMap: Record<string, AttackCard> = {};
        for (const card of allCards) {
          cardMap[card.id] = card;
        }
        // Also add class cards
        for (const cards of Object.values(CLASS_ATTACK_CARDS)) {
          for (const card of cards) {
            cardMap[card.id] = card;
          }
        }
        const slots = state.equippedSkills.slice(0, 6);
        while (slots.length < 6) slots.push("");
        return slots
          .filter((id) => id !== "")
          .map((id) => cardMap[id])
          .filter(Boolean) as AttackCard[];
      },

      // ─── Turn-based battle actions ──────────────────────────────────────────

      setBattlePhase: (phase) => {
        set({ battlePhase: phase });
      },

      spawnEnemy: (wave, zone, gameLevel) => {
        const levelScale = 1 + (gameLevel - 1) * 0.15;
        const isDungeon = zone === "dungeon";

        // Determine boss spawn
        const isBossWave =
          (isDungeon && wave % 3 === 0) ||
          (!isDungeon && wave > 3 && Math.random() < 0.2);

        let cfg: MonsterBattleConfig;

        if (isBossWave) {
          if (gameLevel >= 25) {
            cfg = BATTLE_MONSTERS.find((m) => m.type === "dragonEmperor")!;
          } else if (gameLevel >= 15) {
            cfg = BATTLE_MONSTERS.find((m) => m.type === "voidKing")!;
          } else {
            cfg = BATTLE_MONSTERS.find((m) => m.type === "shadowLord")!;
          }
        } else {
          // Normal enemy pool
          const pool: MonsterBattleConfig[] = [];
          pool.push(
            BATTLE_MONSTERS.find((m) => m.type === "goblin")!,
            BATTLE_MONSTERS.find((m) => m.type === "goblin")!,
          );
          if (wave >= 2 || gameLevel >= 3)
            pool.push(BATTLE_MONSTERS.find((m) => m.type === "shadowBeast")!);
          if (wave >= 4 || gameLevel >= 5)
            pool.push(BATTLE_MONSTERS.find((m) => m.type === "boneKnight")!);
          if (wave >= 6 || gameLevel >= 8)
            pool.push(BATTLE_MONSTERS.find((m) => m.type === "voidDemon")!);

          // Dungeon zone gives harder enemies
          const dungeonBonus = isDungeon ? 1 : 0;
          const effectivePool = pool.slice(
            0,
            Math.min(pool.length, 2 + Math.floor(wave / 3) + dungeonBonus),
          );
          cfg = effectivePool[Math.floor(Math.random() * effectivePool.length)];
        }

        const scaledHp = Math.floor(cfg.baseHp * levelScale);
        const scaledDmg = Math.floor(
          cfg.baseDamage * (1 + (gameLevel - 1) * 0.08),
        );

        const enemy: EnemyBattleData = {
          type: cfg.type,
          label: cfg.label,
          hp: scaledHp,
          maxHp: scaledHp,
          damage: scaledDmg,
          xpReward: cfg.xp,
          goldReward: cfg.gold,
          isBoss: cfg.isBoss,
          color: cfg.color,
        };

        set({
          currentEnemy: enemy,
          battlePhase: "start",
          battleLog: [`⚔️ ${enemy.label} appeared!`],
          isPlayerAttacking: false,
          isEnemyAttacking: false,
          isPlayerHurt: false,
          isEnemyHurt: false,
          lastLoot: [],
        });

        // Transition to player turn after start delay
        setTimeout(() => {
          const s = get();
          if (s.battlePhase === "start") {
            set({ battlePhase: "player_turn" });
          }
        }, 2000);
      },

      playerAttack: (card) => {
        const state = get();
        if (
          state.battlePhase !== "player_turn" ||
          !state.currentEnemy ||
          state.playerMana < card.manaCost
        )
          return;

        // Consume mana
        const newMana = Math.max(0, state.playerMana - card.manaCost);

        set({
          playerMana: newMana,
          isPlayerAttacking: true,
          battlePhase: "animating",
        });

        setTimeout(() => {
          const s = get();
          if (!s.currentEnemy) return;

          // Calculate damage with hit count + level scaling
          const hitCount = card.hitCount ?? 1;
          const levelDmgMult = 1 + s.gameLevel * 0.08;
          let totalDamage = 0;
          for (let i = 0; i < hitCount; i++) {
            totalDamage += Math.floor(
              card.damage * levelDmgMult * (0.85 + Math.random() * 0.3),
            );
          }

          const newEnemyHp = Math.max(0, s.currentEnemy.hp - totalDamage);
          const hitText = hitCount > 1 ? ` (x${hitCount} hits!)` : "";
          const logMsg = `⚔️ You used ${card.name}!${hitText} -${totalDamage} DMG`;

          // Heal strike bonus
          let playerHpAfter = s.playerHP;
          if (card.healAmount) {
            playerHpAfter = Math.min(
              s.maxPlayerHP,
              playerHpAfter + card.healAmount,
            );
          }

          set({
            currentEnemy: { ...s.currentEnemy, hp: newEnemyHp },
            isPlayerAttacking: false,
            isEnemyHurt: true,
            playerHP: playerHpAfter,
          });

          // Add log after damage calc
          const newLog = [...s.battleLog.slice(-4), logMsg];
          set({ battleLog: newLog });

          // Mana regen
          setTimeout(() => {
            const s2 = get();
            set({
              playerMana: Math.min(
                s2.maxPlayerMana,
                s2.playerMana + Math.ceil(card.manaCost * 0.5),
              ),
            });
          }, 3000);

          setTimeout(() => {
            set({ isEnemyHurt: false });
            const s2 = get();
            if (!s2.currentEnemy || s2.currentEnemy.hp <= 0) {
              // Enemy dead
              const drops = getLootDrops(s2.currentEnemy?.type ?? "goblin");
              if (s2.currentEnemy) {
                get().awardKill(
                  s2.currentEnemy.xpReward,
                  s2.currentEnemy.goldReward,
                  drops,
                );
              }
              const victoryLog = [
                ...s2.battleLog.slice(-3),
                `✨ ${s2.currentEnemy?.label} defeated!`,
              ];
              set({
                battlePhase: "victory",
                battleLog: victoryLog,
                lastLoot: drops,
              });
            } else {
              // Enemy's turn
              setTimeout(() => {
                get().enemyAttack();
              }, 600);
            }
          }, 300);
        }, 600);
      },

      enemyAttack: () => {
        const state = get();
        if (!state.currentEnemy) return;

        set({
          isEnemyAttacking: true,
          battlePhase: "animating",
        });

        setTimeout(() => {
          const s = get();
          if (!s.currentEnemy) return;

          // Agility-based dodge chance
          const agility = s.playerAgility ?? 1;
          const dodgeChance = agility > 6 ? 0.2 : agility > 3 ? 0.1 : 0;
          const dodged = Math.random() < dodgeChance;

          if (dodged) {
            const dodgeLog = [
              ...s.battleLog.slice(-4),
              `💨 You DODGED the attack! (AGI ${agility})`,
            ];
            set({
              isEnemyAttacking: false,
              isPlayerHurt: false,
              battleLog: dodgeLog,
            });
            setTimeout(() => {
              set({ battlePhase: "player_turn" });
            }, 300);
            return;
          }

          const rawDmg = Math.floor(
            s.currentEnemy.damage * (0.8 + Math.random() * 0.4),
          );
          const defense =
            s.inventory
              .filter((i) => i.type === "armor")
              .reduce((sum, i) => sum + i.defenseBonus, 0) ?? 0;
          const actualDmg = Math.max(1, rawDmg - defense);
          const newPlayerHp = Math.max(0, s.playerHP - actualDmg);

          const logMsg = `💀 ${s.currentEnemy.label} attacks! -${actualDmg} HP`;
          const newLog = [...s.battleLog.slice(-4), logMsg];

          set({
            playerHP: newPlayerHp,
            isEnemyAttacking: false,
            isPlayerHurt: true,
            battleLog: newLog,
          });

          setTimeout(() => {
            set({ isPlayerHurt: false });
            if (newPlayerHp <= 0) {
              set({ battlePhase: "defeat", isGameOver: true });
            } else {
              set({ battlePhase: "player_turn" });
            }
          }, 300);
        }, 600);
      },

      addBattleLog: (msg) => {
        const state = get();
        set({ battleLog: [...state.battleLog.slice(-4), msg] });
      },

      clearBattle: () => {
        set({
          battlePhase: "idle",
          currentEnemy: null,
          battleLog: [],
          isPlayerAttacking: false,
          isEnemyAttacking: false,
          isPlayerHurt: false,
          isEnemyHurt: false,
          lastLoot: [],
        });
      },
    }),
    {
      name: "bmlx_game_v3",
      partialize: (state) => ({
        gold: state.gold,
        kills: state.kills,
        dungeonRuns: state.dungeonRuns,
        gameLevel: state.gameLevel,
        gameXP: state.gameXP,
        inventory: state.inventory,
        equippedWeapon: state.equippedWeapon,
        maxPlayerHP: state.maxPlayerHP,
        maxPlayerMana: state.maxPlayerMana,
        playerAgility: state.playerAgility,
        playerClass: state.playerClass,
        classKills: state.classKills,
        classXP: state.classXP,
        unlockedSkills: state.unlockedSkills,
        equippedSkills: state.equippedSkills,
        gateRank: state.gateRank,
        gateWaves: state.gateWaves,
      }),
    },
  ),
);
