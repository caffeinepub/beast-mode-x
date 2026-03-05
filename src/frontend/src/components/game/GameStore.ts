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
    id: "basic_strike",
    name: "Basic Strike",
    icon: "👊",
    damage: 15,
    manaCost: 0,
    minLevel: 1,
    color: "#00ffff",
    description: "Simple punch attack",
    rarity: "common",
  },
  {
    id: "power_slam",
    name: "Power Slam",
    icon: "💥",
    damage: 25,
    manaCost: 5,
    minLevel: 1,
    color: "#ffaa00",
    description: "Heavy slam attack",
    rarity: "common",
  },
  {
    id: "heal_strike",
    name: "Heal Strike",
    icon: "💚",
    damage: 10,
    manaCost: 15,
    minLevel: 1,
    color: "#00ff88",
    description: "Attack + heal 30 HP",
    rarity: "rare",
    healAmount: 30,
  },
  {
    id: "wood_slash",
    name: "Wood Slash",
    icon: "🗡️",
    damage: 35,
    manaCost: 8,
    minLevel: 3,
    color: "#8B4513",
    description: "Wooden sword strike",
    rarity: "common",
  },
  {
    id: "iron_strike",
    name: "Iron Strike",
    icon: "⚔️",
    damage: 55,
    manaCost: 12,
    minLevel: 5,
    color: "#aaaaaa",
    description: "Iron blade slash",
    rarity: "rare",
  },
  {
    id: "shadow_slash",
    name: "Shadow Slash",
    icon: "🌑",
    damage: 80,
    manaCost: 20,
    minLevel: 8,
    color: "#9d00ff",
    description: "Dark blade, hits 3x",
    rarity: "epic",
    hitCount: 3,
  },
  {
    id: "dragon_fist",
    name: "Dragon Fist",
    icon: "🐉",
    damage: 150,
    manaCost: 35,
    minLevel: 15,
    color: "#ff6600",
    description: "Explosive dragon punch",
    rarity: "legendary",
  },
  {
    id: "void_blast",
    name: "Void Blast",
    icon: "💀",
    damage: 300,
    manaCost: 60,
    minLevel: 25,
    color: "#ff00ff",
    description: "Annihilates all foes",
    rarity: "legendary",
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

export interface GameState {
  // Player
  playerHP: number;
  maxPlayerHP: number;
  playerMana: number;
  maxPlayerMana: number;
  gold: number;
  kills: number;
  dungeonRuns: number;
  gameLevel: number;
  gameXP: number;
  sessionXP: number;
  sessionKills: number;

  // Inventory
  inventory: InventoryItem[];
  equippedWeapon: string;

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
    name: "Iron Fists",
    icon: "👊",
    range: 2.0,
    damage: 10,
    manaCost: 0,
    minLevel: 1,
    color: "#00ffff",
    rarity: "common",
    description: "Basic punching attack",
  },
  woodSword: {
    name: "Wood Sword",
    icon: "🗡️",
    range: 2.5,
    damage: 18,
    manaCost: 2,
    minLevel: 3,
    color: "#8B4513",
    rarity: "common",
    description: "A basic wooden sword",
  },
  ironSword: {
    name: "Iron Sword",
    icon: "⚔️",
    range: 2.5,
    damage: 30,
    manaCost: 3,
    minLevel: 5,
    color: "#aaaaaa",
    rarity: "common",
    description: "Reliable iron blade",
  },
  shadowBlade: {
    name: "Shadow Blade",
    icon: "🌑",
    range: 3.0,
    damage: 50,
    manaCost: 8,
    minLevel: 8,
    color: "#9d00ff",
    rarity: "epic",
    hitCount: 3,
    description: "Neon purple cone attack, hits 3 enemies",
  },
  dragonSword: {
    name: "Dragon Sword",
    icon: "🐉",
    range: 3.5,
    damage: 100,
    manaCost: 15,
    minLevel: 15,
    color: "#ff6600",
    rarity: "legendary",
    aoeRadius: 2.5,
    description: "Dragon Fist - orange explosion radius",
  },
  voidScythe: {
    name: "Void Scythe",
    icon: "💀",
    range: 5.0,
    damage: 200,
    manaCost: 30,
    minLevel: 25,
    color: "#ff00ff",
    rarity: "legendary",
    aoeRadius: 5.0,
    description: "Void Blast - hits all enemies in radius",
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
    name: "Iron Fists",
    rarity: "common",
    attackBonus: 10,
    defenseBonus: 0,
    quantity: 1,
    icon: "👊",
    description: "Your bare hands",
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

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerHP: 100,
      maxPlayerHP: 100,
      playerMana: 50,
      maxPlayerMana: 50,
      gold: 0,
      kills: 0,
      dungeonRuns: 0,
      gameLevel: 1,
      gameXP: 0,
      sessionXP: 0,
      sessionKills: 0,
      inventory: initialInventory,
      equippedWeapon: "fists",
      currentZone: "normal",
      wave: 1,
      isGameOver: false,
      lastXPSync: 0,

      // Turn-based battle state
      battlePhase: "idle",
      currentEnemy: null,
      battleLog: [],
      isPlayerAttacking: false,
      isEnemyAttacking: false,
      isPlayerHurt: false,
      isEnemyHurt: false,
      lastLoot: [],

      awardKill: (xp, gold, drops) => {
        const state = get();
        const newKills = state.kills + 1;
        const newSessionKills = state.sessionKills + 1;
        const newGold = state.gold + gold;
        const newGameXP = state.gameXP + xp;
        const newSessionXP = state.sessionXP + xp;

        // Level up formula: level = floor(sqrt(totalXP / 50)) + 1
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

        // Max HP increases with game level
        const newMaxHP = 100 + (newLevel - 1) * 10;
        const newMaxMana = 50 + (newLevel - 1) * 5;

        set({
          kills: newKills,
          sessionKills: newSessionKills,
          gold: newGold,
          gameXP: newGameXP,
          sessionXP: newSessionXP,
          gameLevel: newLevel,
          maxPlayerHP: newMaxHP,
          maxPlayerMana: newMaxMana,
          inventory: newInventory,
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

          // Calculate damage with hit count
          const hitCount = card.hitCount ?? 1;
          let totalDamage = 0;
          for (let i = 0; i < hitCount; i++) {
            totalDamage += Math.floor(
              card.damage * (0.85 + Math.random() * 0.3),
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
      name: "bmlx_game_v1",
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
      }),
    },
  ),
);
