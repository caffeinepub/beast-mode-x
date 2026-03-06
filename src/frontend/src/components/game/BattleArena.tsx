import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WEAPONS, useGameStore } from "./GameStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonsterData {
  id: number;
  type: string;
  hp: number;
  maxHp: number;
  damage: number;
  xpReward: number;
  goldReward: number;
  speed: number;
  position: [number, number, number];
  dead: boolean;
  hitCooldown: number;
  isBoss: boolean;
}

interface Particle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  life: number;
  maxLife: number;
  scale: number;
}

interface MonsterConfig {
  label: string;
  hp: number;
  damage: number;
  xp: number;
  gold: number;
  speed: number;
  color: string;
  emissive: string;
  scale: number;
  isBoss: boolean;
  bodyW: number;
  bodyH: number;
  bodyD: number;
  headSize: number;
}

const MONSTER_TYPES: Record<string, MonsterConfig> = {
  goblin: {
    label: "Goblin",
    hp: 30,
    damage: 5,
    xp: 15,
    gold: 5,
    speed: 2.5,
    color: "#22aa22",
    emissive: "#44ff44",
    scale: 1.2,
    isBoss: false,
    bodyW: 0.6,
    bodyH: 0.9,
    bodyD: 0.4,
    headSize: 0.5,
  },
  shadowBeast: {
    label: "Shadow Beast",
    hp: 80,
    damage: 12,
    xp: 35,
    gold: 15,
    speed: 3.5,
    color: "#9900ff",
    emissive: "#6600cc",
    scale: 1.4,
    isBoss: false,
    bodyW: 1.0,
    bodyH: 0.8,
    bodyD: 0.5,
    headSize: 0.55,
  },
  boneKnight: {
    label: "Bone Knight",
    hp: 150,
    damage: 20,
    xp: 70,
    gold: 30,
    speed: 2.0,
    color: "#ddddcc",
    emissive: "#aaaaaa",
    scale: 1.5,
    isBoss: false,
    bodyW: 0.8,
    bodyH: 1.2,
    bodyD: 0.4,
    headSize: 0.6,
  },
  voidDemon: {
    label: "Void Demon",
    hp: 300,
    damage: 35,
    xp: 150,
    gold: 60,
    speed: 2.0,
    color: "#ff2200",
    emissive: "#cc0000",
    scale: 1.6,
    isBoss: false,
    bodyW: 0.9,
    bodyH: 1.0,
    bodyD: 0.8,
    headSize: 0.7,
  },
  shadowLord: {
    label: "SHADOW LORD",
    hp: 500,
    damage: 50,
    xp: 300,
    gold: 150,
    speed: 1.8,
    color: "#220033",
    emissive: "#9900cc",
    scale: 2.0,
    isBoss: true,
    bodyW: 0.8,
    bodyH: 1.2,
    bodyD: 0.4,
    headSize: 0.6,
  },
  voidKing: {
    label: "VOID KING",
    hp: 1000,
    damage: 80,
    xp: 600,
    gold: 300,
    speed: 1.5,
    color: "#440088",
    emissive: "#aa00ff",
    scale: 2.5,
    isBoss: true,
    bodyW: 0.9,
    bodyH: 0.9,
    bodyD: 0.9,
    headSize: 0.0,
  },
  dragonEmperor: {
    label: "DRAGON EMPEROR",
    hp: 2000,
    damage: 120,
    xp: 1200,
    gold: 600,
    speed: 1.2,
    color: "#cc8800",
    emissive: "#664400",
    scale: 3.0,
    isBoss: true,
    bodyW: 1.2,
    bodyH: 0.8,
    bodyD: 1.0,
    headSize: 0.7,
  },
};

function getLootDrops(
  monsterType: string,
): import("./GameStore").InventoryItem[] {
  const drops: import("./GameStore").InventoryItem[] = [];
  const rand = Math.random;

  if (rand() < 0.2) {
    drops.push({
      id: "health_potion",
      type: "potion" as const,
      name: "Health Potion",
      rarity: "common" as const,
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
    rand() < 0.15
  ) {
    drops.push({
      id: "ironSword",
      type: "weapon" as const,
      name: "Iron Sword",
      rarity: "common" as const,
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
    rand() < 0.2
  ) {
    drops.push({
      id: "armor_shard",
      type: "armor" as const,
      name: "Armor Shard",
      rarity: "rare" as const,
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
    rand() < 0.2
  ) {
    drops.push({
      id: "shadowBlade",
      type: "weapon" as const,
      name: "Shadow Blade",
      rarity: "epic" as const,
      attackBonus: 50,
      defenseBonus: 0,
      quantity: 1,
      icon: "🌑",
    });
  }
  if (
    (monsterType === "voidDemon" || monsterType === "voidKing") &&
    rand() < 0.25
  ) {
    drops.push({
      id: "epic_potion",
      type: "potion" as const,
      name: "Epic Potion",
      rarity: "epic" as const,
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "💜",
    });
  }

  // Boss guaranteed drops
  if (monsterType === "shadowLord") {
    drops.push({
      id: "shadowBlade",
      type: "weapon" as const,
      name: "Shadow Blade",
      rarity: "epic" as const,
      attackBonus: 50,
      defenseBonus: 0,
      quantity: 1,
      icon: "🌑",
    });
    drops.push({
      id: "shadow_material",
      type: "material" as const,
      name: "Shadow Crystal",
      rarity: "epic" as const,
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "💎",
    });
  }
  if (monsterType === "voidKing") {
    drops.push({
      id: "dragonSword",
      type: "weapon" as const,
      name: "Dragon Sword",
      rarity: "legendary" as const,
      attackBonus: 100,
      defenseBonus: 0,
      quantity: 1,
      icon: "🐉",
    });
  }
  if (monsterType === "dragonEmperor") {
    drops.push({
      id: "voidScythe",
      type: "weapon" as const,
      name: "Void Scythe",
      rarity: "legendary" as const,
      attackBonus: 200,
      defenseBonus: 0,
      quantity: 1,
      icon: "💀",
    });
    drops.push({
      id: "dragon_scale",
      type: "material" as const,
      name: "Dragon Scale",
      rarity: "legendary" as const,
      attackBonus: 0,
      defenseBonus: 0,
      quantity: 1,
      icon: "🔥",
    });
  }

  return drops;
}

// ─── Arena Floor ──────────────────────────────────────────────────────────────
function ArenaFloor({ isDungeon }: { isDungeon: boolean }) {
  const size = isDungeon ? [20, 60] : [50, 50];
  const color = isDungeon ? "#0a0005" : "#050508";
  const gridColor = isDungeon ? "#440000" : "#001133";

  return (
    <group>
      {/* Main floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, -0.01, 0]}
      >
        <planeGeometry args={[size[0], size[1]]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Grid lines - static geometry */}
      {Array.from({ length: 11 }, (_, i) => {
        const pos = -size[0] / 2 + i * (size[0] / 10);
        const posKey = pos.toFixed(2);
        return (
          <mesh
            key={`vline-${posKey}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[pos, 0, 0]}
          >
            <planeGeometry args={[0.04, size[1]]} />
            <meshStandardMaterial
              color={gridColor}
              emissive={gridColor}
              emissiveIntensity={0.6}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
      {Array.from({ length: 11 }, (_, i) => {
        const pos = -size[1] / 2 + i * (size[1] / 10);
        const posKey = pos.toFixed(2);
        return (
          <mesh
            key={`hline-${posKey}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, pos]}
          >
            <planeGeometry args={[size[0], 0.04]} />
            <meshStandardMaterial
              color={gridColor}
              emissive={gridColor}
              emissiveIntensity={0.6}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
      {/* Walls */}
      {(
        [
          {
            key: "wall-n",
            pos: [0, 2, -size[1] / 2] as [number, number, number],
            rot: [0, 0, 0] as [number, number, number],
            w: size[0],
            h: 4,
          },
          {
            key: "wall-s",
            pos: [0, 2, size[1] / 2] as [number, number, number],
            rot: [0, Math.PI, 0] as [number, number, number],
            w: size[0],
            h: 4,
          },
          {
            key: "wall-w",
            pos: [-size[0] / 2, 2, 0] as [number, number, number],
            rot: [0, Math.PI / 2, 0] as [number, number, number],
            w: size[1],
            h: 4,
          },
          {
            key: "wall-e",
            pos: [size[0] / 2, 2, 0] as [number, number, number],
            rot: [0, -Math.PI / 2, 0] as [number, number, number],
            w: size[1],
            h: 4,
          },
        ] as const
      ).map((wall) => (
        <mesh
          key={wall.key}
          position={wall.pos}
          rotation={wall.rot as [number, number, number]}
        >
          <planeGeometry args={[wall.w, wall.h]} />
          <meshStandardMaterial
            color={isDungeon ? "#110005" : "#020210"}
            emissive={isDungeon ? "#330000" : "#000033"}
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Neon edge glow */}
      {(
        [
          {
            key: "light-w",
            pos: [-size[0] / 2, 0, 0] as [number, number, number],
          },
          {
            key: "light-e",
            pos: [size[0] / 2, 0, 0] as [number, number, number],
          },
          {
            key: "light-n",
            pos: [0, 0, -size[1] / 2] as [number, number, number],
          },
          {
            key: "light-s",
            pos: [0, 0, size[1] / 2] as [number, number, number],
          },
        ] as const
      ).map(({ key, pos }) => (
        <pointLight
          key={key}
          position={pos}
          color={isDungeon ? "#ff0011" : "#0033ff"}
          intensity={0.8}
          distance={8}
        />
      ))}
    </group>
  );
}

// ─── Player Character ─────────────────────────────────────────────────────────
function PlayerCharacter({
  joystickInput,
  isAttacking,
  isDodging,
  onPositionUpdate,
}: {
  joystickInput: { x: number; y: number };
  isAttacking: boolean;
  isDodging: boolean;
  onPositionUpdate: (pos: THREE.Vector3) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const { playerHP, isGameOver, heal } = useGameStore();
  const lastHealTime = useRef(0);
  const lastDamageTime = useRef(0);
  const isDungeonZone = useGameStore((s) => s.currentZone === "dungeon");

  useFrame((_, delta) => {
    if (!groupRef.current || isGameOver || playerHP <= 0) return;

    const speed = isDodging ? 12 : 5;
    const dx = joystickInput.x * speed * delta;
    const dz = joystickInput.y * speed * delta;

    // Movement
    if (Math.abs(dx) > 0.001 || Math.abs(dz) > 0.001) {
      const angle = Math.atan2(dx, dz);
      groupRef.current.rotation.y = angle;
    }

    const arenaBound = isDungeonZone ? 8 : 22;
    const arenaBoundZ = isDungeonZone ? 27 : 22;

    groupRef.current.position.x = THREE.MathUtils.clamp(
      groupRef.current.position.x + dx,
      -arenaBound,
      arenaBound,
    );
    groupRef.current.position.z = THREE.MathUtils.clamp(
      groupRef.current.position.z + dz,
      -arenaBoundZ,
      arenaBoundZ,
    );

    // Auto heal when not taking damage for 3 seconds
    if (
      Date.now() - lastDamageTime.current > 3000 &&
      Date.now() - lastHealTime.current > 1000
    ) {
      heal(1);
      lastHealTime.current = Date.now();
    }

    // Report position
    onPositionUpdate(groupRef.current.position.clone());

    // Attack animation
    if (rightArmRef.current) {
      if (isAttacking) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          -Math.PI / 2,
          0.3,
        );
      } else {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.x,
          0,
          0.15,
        );
      }
    }
  });

  const bodyMat = (
    <meshStandardMaterial
      color="#001133"
      emissive="#00aaff"
      emissiveIntensity={0.6}
    />
  );
  const headMat = (
    <meshStandardMaterial
      color="#001155"
      emissive="#00ccff"
      emissiveIntensity={0.8}
    />
  );
  const limbMat = (
    <meshStandardMaterial
      color="#000d22"
      emissive="#0088dd"
      emissiveIntensity={0.5}
    />
  );

  const equippedWeapon = useGameStore((s) => s.equippedWeapon);
  const weaponInfo = WEAPONS[equippedWeapon];
  const weaponColor = weaponInfo?.color || "#00ffff";

  // Scale up character by 1.4x for better visibility
  const S = 1.4;

  return (
    <group ref={groupRef} position={[0, 0, 0]} castShadow>
      {/* Point light on player */}
      <pointLight color="#00aaff" intensity={2} distance={6} />
      {/* Body */}
      <mesh position={[0, 1.2 * S, 0]} castShadow>
        <boxGeometry args={[0.8 * S, 1.2 * S, 0.4 * S]} />
        {bodyMat}
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.1 * S, 0]} castShadow>
        <boxGeometry args={[0.6 * S, 0.6 * S, 0.6 * S]} />
        {headMat}
      </mesh>
      {/* Eyes */}
      <mesh position={[0.15 * S, 2.15 * S, 0.31 * S]}>
        <boxGeometry args={[0.14 * S, 0.1 * S, 0.05]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={4}
        />
      </mesh>
      <mesh position={[-0.15 * S, 2.15 * S, 0.31 * S]}>
        <boxGeometry args={[0.14 * S, 0.1 * S, 0.05]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={4}
        />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.55 * S, 1.2 * S, 0]} castShadow>
        <boxGeometry args={[0.25 * S, 0.8 * S, 0.25 * S]} />
        {limbMat}
      </mesh>
      {/* Right arm (attack group) */}
      <group ref={rightArmRef} position={[0.55 * S, 1.5 * S, 0]}>
        <mesh position={[0, -0.4 * S, 0]} castShadow>
          <boxGeometry args={[0.25 * S, 0.8 * S, 0.25 * S]} />
          {limbMat}
        </mesh>
        {/* Weapon in hand */}
        {equippedWeapon !== "fists" && (
          <mesh position={[0, -1.0 * S, 0.1]} castShadow>
            <boxGeometry
              args={
                equippedWeapon === "voidScythe"
                  ? [0.1 * S, 1.6 * S, 0.1 * S]
                  : [0.09 * S, 1.2 * S, 0.09 * S]
              }
            />
            <meshStandardMaterial
              color={weaponColor}
              emissive={weaponColor}
              emissiveIntensity={1.5}
            />
          </mesh>
        )}
      </group>
      {/* Legs */}
      <mesh position={[0.2 * S, 0.35 * S, 0]} castShadow>
        <boxGeometry args={[0.3 * S, 0.9 * S, 0.3 * S]} />
        {limbMat}
      </mesh>
      <mesh position={[-0.2 * S, 0.35 * S, 0]} castShadow>
        <boxGeometry args={[0.3 * S, 0.9 * S, 0.3 * S]} />
        {limbMat}
      </mesh>
    </group>
  );
}

// ─── Monster Entity ────────────────────────────────────────────────────────────
function MonsterEntity({
  monster,
  playerPos,
  onDeath,
  onDamagePlayer,
}: {
  monster: MonsterData;
  playerPos: React.MutableRefObject<THREE.Vector3>;
  onDeath: (id: number) => void;
  onDamagePlayer: (dmg: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cfg = MONSTER_TYPES[monster.type] || MONSTER_TYPES.goblin;
  const hpRef = useRef(monster.hp);
  const deathCalledRef = useRef(false);
  const lastPlayerHitRef = useRef(0);

  // Sync HP from monster data
  useEffect(() => {
    hpRef.current = monster.hp;
  }, [monster.hp]);

  useFrame((_, delta) => {
    if (!groupRef.current || monster.dead) return;
    if (hpRef.current <= 0) {
      if (!deathCalledRef.current) {
        deathCalledRef.current = true;
        onDeath(monster.id);
      }
      return;
    }

    const pos = groupRef.current.position;
    const target = playerPos.current;

    const dx = target.x - pos.x;
    const dz = target.z - pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Face player
    if (dist > 0.1) {
      groupRef.current.rotation.y = Math.atan2(dx, dz);
    }

    // Move toward player if far
    const attackRange = 1.5;
    if (dist > attackRange) {
      const speed = cfg.speed * delta;
      const nx = (dx / dist) * speed;
      const nz = (dz / dist) * speed;

      const isDungeon = Math.abs(pos.x) < 10 && Math.abs(pos.z) < 30;
      const bound = isDungeon ? 9 : 23;
      pos.x = THREE.MathUtils.clamp(pos.x + nx, -bound, bound);
      pos.z = THREE.MathUtils.clamp(pos.z + nz, -bound, bound);
    } else {
      // Attack player
      const now = Date.now();
      if (now - lastPlayerHitRef.current > 1000) {
        onDamagePlayer(monster.damage);
        lastPlayerHitRef.current = now;
      }
    }
  });

  if (monster.dead) return null;

  const s = cfg.scale;
  const emissiveIntensity = cfg.isBoss ? 1.5 : 0.8;
  const hpFrac = monster.hp / monster.maxHp;

  // VoidKing = sphere, DragonEmperor = box + wings, others = humanoid
  const isVoidKing = monster.type === "voidKing";
  const isDragon = monster.type === "dragonEmperor";

  return (
    <group ref={groupRef} position={monster.position}>
      {/* Boss glow */}
      {cfg.isBoss && (
        <pointLight color={cfg.emissive} intensity={2} distance={6} />
      )}

      {isVoidKing ? (
        // Sphere creature
        <>
          <mesh position={[0, 0.9 * s, 0]} castShadow>
            <sphereGeometry args={[0.8 * s, 8, 8]} />
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Orbiting orbs */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 3) * Math.PI * 2) * 1.5 * s,
                0.9 * s,
                Math.sin((i / 3) * Math.PI * 2) * 1.5 * s,
              ]}
            >
              <sphereGeometry args={[0.2 * s, 6, 6]} />
              <meshStandardMaterial
                color="#aa00ff"
                emissive="#aa00ff"
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </>
      ) : isDragon ? (
        // Dragon body
        <>
          <mesh position={[0, 0.8 * s, 0]} castShadow>
            <boxGeometry
              args={[cfg.bodyW * 2 * s, cfg.bodyH * 1.5 * s, cfg.bodyD * 2 * s]}
            />
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Head */}
          <mesh position={[0, 2.0 * s, cfg.bodyD * s]} castShadow>
            <boxGeometry
              args={[
                cfg.headSize * 1.5 * s,
                cfg.headSize * s,
                cfg.headSize * 1.5 * s,
              ]}
            />
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.emissive}
              emissiveIntensity={2}
            />
          </mesh>
          {/* Wings */}
          <mesh position={[-2 * s, 1.2 * s, 0]} rotation={[0, 0, -0.4]}>
            <planeGeometry args={[2 * s, 1.5 * s]} />
            <meshStandardMaterial
              color="#886600"
              emissive="#664400"
              emissiveIntensity={0.5}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[2 * s, 1.2 * s, 0]} rotation={[0, 0, 0.4]}>
            <planeGeometry args={[2 * s, 1.5 * s]} />
            <meshStandardMaterial
              color="#886600"
              emissive="#664400"
              emissiveIntensity={0.5}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Eyes */}
          <mesh
            position={[
              -0.2 * s,
              2.1 * s,
              cfg.bodyD * s + cfg.headSize * 0.8 * s,
            ]}
          >
            <sphereGeometry args={[0.12 * s, 6, 6]} />
            <meshStandardMaterial
              color="#ff4400"
              emissive="#ff4400"
              emissiveIntensity={4}
            />
          </mesh>
          <mesh
            position={[
              0.2 * s,
              2.1 * s,
              cfg.bodyD * s + cfg.headSize * 0.8 * s,
            ]}
          >
            <sphereGeometry args={[0.12 * s, 6, 6]} />
            <meshStandardMaterial
              color="#ff4400"
              emissive="#ff4400"
              emissiveIntensity={4}
            />
          </mesh>
        </>
      ) : (
        // Humanoid / beast
        <>
          {/* Body */}
          <mesh position={[0, (cfg.bodyH / 2 + 0.1) * s, 0]} castShadow>
            <boxGeometry args={[cfg.bodyW * s, cfg.bodyH * s, cfg.bodyD * s]} />
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Head */}
          {cfg.headSize > 0 && (
            <mesh
              position={[0, (cfg.bodyH + cfg.headSize * 0.7) * s, 0]}
              castShadow
            >
              <boxGeometry
                args={[cfg.headSize * s, cfg.headSize * s, cfg.headSize * s]}
              />
              <meshStandardMaterial
                color={cfg.color}
                emissive={cfg.emissive}
                emissiveIntensity={emissiveIntensity * 1.2}
              />
            </mesh>
          )}
          {/* Eyes (bosses) */}
          {cfg.isBoss && cfg.headSize > 0 && (
            <>
              <mesh
                position={[
                  -0.12 * s,
                  (cfg.bodyH + cfg.headSize * 0.8) * s,
                  cfg.headSize * 0.52 * s,
                ]}
              >
                <boxGeometry args={[0.1 * s, 0.08 * s, 0.05]} />
                <meshStandardMaterial
                  color="#ff0000"
                  emissive="#ff0000"
                  emissiveIntensity={5}
                />
              </mesh>
              <mesh
                position={[
                  0.12 * s,
                  (cfg.bodyH + cfg.headSize * 0.8) * s,
                  cfg.headSize * 0.52 * s,
                ]}
              >
                <boxGeometry args={[0.1 * s, 0.08 * s, 0.05]} />
                <meshStandardMaterial
                  color="#ff0000"
                  emissive="#ff0000"
                  emissiveIntensity={5}
                />
              </mesh>
            </>
          )}
          {/* Arms */}
          <mesh
            position={[-(cfg.bodyW / 2 + 0.12) * s, cfg.bodyH * 0.6 * s, 0]}
          >
            <boxGeometry args={[0.2 * s, cfg.bodyH * 0.7 * s, 0.2 * s]} />
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.emissive}
              emissiveIntensity={emissiveIntensity * 0.8}
            />
          </mesh>
          <mesh position={[(cfg.bodyW / 2 + 0.12) * s, cfg.bodyH * 0.6 * s, 0]}>
            <boxGeometry args={[0.2 * s, cfg.bodyH * 0.7 * s, 0.2 * s]} />
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.emissive}
              emissiveIntensity={emissiveIntensity * 0.8}
            />
          </mesh>
          {/* Legs (humanoids) */}
          {cfg.bodyH > 0.8 && (
            <>
              <mesh position={[-0.15 * s, 0.35 * s, 0]}>
                <boxGeometry args={[0.25 * s, 0.7 * s, 0.25 * s]} />
                <meshStandardMaterial
                  color={cfg.color}
                  emissive={cfg.emissive}
                  emissiveIntensity={emissiveIntensity * 0.7}
                />
              </mesh>
              <mesh position={[0.15 * s, 0.35 * s, 0]}>
                <boxGeometry args={[0.25 * s, 0.7 * s, 0.25 * s]} />
                <meshStandardMaterial
                  color={cfg.color}
                  emissive={cfg.emissive}
                  emissiveIntensity={emissiveIntensity * 0.7}
                />
              </mesh>
            </>
          )}
        </>
      )}

      {/* HP Bar */}
      <group position={[0, (cfg.isBoss ? 4.5 : 2.5) * s, 0]}>
        <mesh>
          <planeGeometry args={[1.2 * s, 0.15 * s]} />
          <meshStandardMaterial color="#220000" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.6 * s + hpFrac * 0.6 * s, 0, 0.01]}>
          <planeGeometry args={[hpFrac * 1.2 * s, 0.12 * s]} />
          <meshStandardMaterial
            color={
              hpFrac > 0.5 ? "#00ff44" : hpFrac > 0.25 ? "#ffaa00" : "#ff2200"
            }
            side={THREE.DoubleSide}
          />
        </mesh>
        {cfg.isBoss && (
          <mesh position={[0, 0.2 * s, 0]}>
            <planeGeometry args={[1.5 * s, 0.18 * s]} />
            <meshStandardMaterial
              color={cfg.emissive}
              emissive={cfg.emissive}
              emissiveIntensity={0.5}
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

// ─── Particle System ──────────────────────────────────────────────────────────
function ParticleSystem({ particles }: { particles: Particle[] }) {
  return (
    <>
      {particles.map((p) => (
        <mesh key={p.id} position={[p.position.x, p.position.y, p.position.z]}>
          <sphereGeometry args={[p.scale * (p.life / p.maxLife), 4, 4]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={2}
            transparent
            opacity={p.life / p.maxLife}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Attack VFX (shows brief flash at hit point) ──────────────────────────────
function AttackVFX({
  active,
  playerPos,
  weaponColor,
}: {
  active: boolean;
  playerPos: THREE.Vector3;
  weaponColor: string;
}) {
  if (!active) return null;
  return (
    <pointLight
      position={[playerPos.x, 1.5, playerPos.z - 1]}
      color={weaponColor}
      intensity={8}
      distance={4}
    />
  );
}

// ─── Camera Follow ────────────────────────────────────────────────────────────
function CameraFollow({
  playerPos,
}: { playerPos: React.MutableRefObject<THREE.Vector3> }) {
  const { camera } = useThree();
  useFrame(() => {
    const target = playerPos.current;
    // Closer camera - player fills more of screen
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.x, 0.1);
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      target.z + 7,
      0.1,
    );
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 5, 0.1);
    camera.lookAt(target.x, 1.2, target.z);
  });
  return null;
}

// ─── Game Logic Controller ────────────────────────────────────────────────────
let particleIdCounter = 0;
let monsterIdCounter = 0;

function GameController({
  joystickInput,
  attackPressed,
  specialPressed,
  dodgePressed,
  onXPFloat,
  onWaveComplete,
}: {
  joystickInput: React.MutableRefObject<{ x: number; y: number }>;
  attackPressed: React.MutableRefObject<boolean>;
  specialPressed: React.MutableRefObject<boolean>;
  dodgePressed: React.MutableRefObject<boolean>;
  onXPFloat: (xp: number) => void;
  onWaveComplete: () => void;
}) {
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const [monsters, setMonsters] = useState<MonsterData[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isDodging, setIsDodging] = useState(false);
  const [attackVFXActive, setAttackVFXActive] = useState(false);

  const {
    currentZone,
    wave,
    gameLevel,
    equippedWeapon,
    takeDamage,
    awardKill,
    playerMana,
    isGameOver,
    nextWave,
  } = useGameStore();

  const weaponInfo = WEAPONS[equippedWeapon];
  const waveStarted = useRef(false);
  const attackCooldown = useRef(0);

  // Spawn monsters for a wave
  const spawnWave = useCallback(() => {
    const isDungeon = currentZone === "dungeon";
    const baseCount = isDungeon ? 5 : 3;
    const waveCount = Math.min(baseCount + Math.floor(wave / 2), 12);
    const newMonsters: MonsterData[] = [];

    // Determine which monster types to spawn based on wave/level
    const monsterPool: string[] = [];

    if (wave >= 1) monsterPool.push("goblin", "goblin");
    if (wave >= 2 || gameLevel >= 3) monsterPool.push("shadowBeast");
    if (wave >= 4 || gameLevel >= 5) monsterPool.push("boneKnight");
    if (wave >= 6 || gameLevel >= 8) monsterPool.push("voidDemon");

    // Boss spawn logic
    let spawnBoss = false;
    let bossType = "shadowLord";

    if (isDungeon && wave % 3 === 0) {
      spawnBoss = true;
    } else if (!isDungeon && wave > 3 && Math.random() < 0.15) {
      spawnBoss = true;
    }

    if (spawnBoss) {
      if (gameLevel >= 25) bossType = "dragonEmperor";
      else if (gameLevel >= 15) bossType = "voidKing";
      else bossType = "shadowLord";
    }

    for (let i = 0; i < waveCount; i++) {
      const type = monsterPool[Math.floor(Math.random() * monsterPool.length)];
      const cfg = MONSTER_TYPES[type];

      // Scale HP/damage with level
      const levelScale = 1 + (gameLevel - 1) * 0.15;
      const scaledHp = Math.floor(cfg.hp * levelScale);
      const scaledDmg = Math.floor(cfg.damage * (1 + (gameLevel - 1) * 0.08));

      // Spawn closer to player (visible range), not at far edges
      const spawnDist = 6 + Math.random() * 4; // 6-10 units away
      const angle = Math.random() * Math.PI * 2;
      let spawnX = Math.cos(angle) * spawnDist;
      let spawnZ = Math.sin(angle) * spawnDist - 3; // slightly in front

      newMonsters.push({
        id: ++monsterIdCounter,
        type,
        hp: scaledHp,
        maxHp: scaledHp,
        damage: scaledDmg,
        xpReward: cfg.xp,
        goldReward: cfg.gold,
        speed: cfg.speed,
        position: [spawnX, 0, spawnZ],
        dead: false,
        hitCooldown: 0,
        isBoss: cfg.isBoss,
      });
    }

    if (spawnBoss) {
      const bossCfg = MONSTER_TYPES[bossType];
      const bossLevelScale = 1 + (gameLevel - 1) * 0.2;
      newMonsters.push({
        id: ++monsterIdCounter,
        type: bossType,
        hp: Math.floor(bossCfg.hp * bossLevelScale),
        maxHp: Math.floor(bossCfg.hp * bossLevelScale),
        damage: Math.floor(bossCfg.damage * (1 + (gameLevel - 1) * 0.1)),
        xpReward: bossCfg.xp,
        goldReward: bossCfg.gold,
        speed: bossCfg.speed,
        position: [0, 0, -(isDungeon ? 20 : 18)],
        dead: false,
        hitCooldown: 0,
        isBoss: true,
      });
    }

    setMonsters(newMonsters);
    waveStarted.current = true;
  }, [currentZone, wave, gameLevel]);

  // Initial spawn + wave changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: spawnWave is stable callback
  useEffect(() => {
    if (!isGameOver) {
      const timer = setTimeout(() => spawnWave(), 500);
      return () => clearTimeout(timer);
    }
  }, [wave, currentZone, spawnWave, isGameOver]);

  // Game loop
  useFrame((_, delta) => {
    if (isGameOver) return;

    // Cooldowns
    if (attackCooldown.current > 0) attackCooldown.current -= delta;

    // Attack input
    if (attackPressed.current && attackCooldown.current <= 0) {
      attackPressed.current = false;
      performAttack(false);
    }
    if (specialPressed.current && attackCooldown.current <= 0) {
      specialPressed.current = false;
      performAttack(true);
    }

    // Dodge
    if (dodgePressed.current) {
      dodgePressed.current = false;
      setIsDodging(true);
      setTimeout(() => setIsDodging(false), 400);
    }

    // Keyboard attack
    // (handled in FightingGame component)

    // Check wave completion
    const aliveMonsters = monsters.filter((m) => !m.dead);
    if (
      waveStarted.current &&
      aliveMonsters.length === 0 &&
      monsters.length > 0
    ) {
      waveStarted.current = false;
      setTimeout(() => {
        nextWave();
        onWaveComplete();
      }, 2000);
    }

    // Update particles
    setParticles((prev) =>
      prev
        .map((p) => {
          p.position.addScaledVector(p.velocity, delta);
          p.velocity.y -= 4 * delta; // gravity
          p.life -= delta;
          return p;
        })
        .filter((p) => p.life > 0),
    );
  });

  const performAttack = useCallback(
    (isSpecial: boolean) => {
      if (!weaponInfo) return;

      const damage = isSpecial ? weaponInfo.damage * 1.5 : weaponInfo.damage;
      const range = isSpecial ? weaponInfo.range * 1.3 : weaponInfo.range;
      const manaCost = isSpecial
        ? weaponInfo.manaCost * 2
        : weaponInfo.manaCost;
      const isAOE =
        isSpecial || (weaponInfo.aoeRadius && weaponInfo.aoeRadius > 0);

      // Check mana
      if (manaCost > 0 && playerMana < manaCost) return;

      // Drain mana
      if (manaCost > 0) {
        const store = useGameStore.getState();
        useGameStore.setState({
          playerMana: Math.max(0, store.playerMana - manaCost),
        });
      }

      // Mana regen
      setTimeout(() => {
        const store = useGameStore.getState();
        useGameStore.setState({
          playerMana: Math.min(
            store.maxPlayerMana,
            store.playerMana + manaCost,
          ),
        });
      }, 3000);

      setIsAttacking(true);
      setAttackVFXActive(true);
      attackCooldown.current = 0.4;

      setTimeout(() => {
        setIsAttacking(false);
        setAttackVFXActive(false);
      }, 300);

      // Hit detection
      const playerPos = playerPosRef.current;
      setMonsters((prev) => {
        const updated = [...prev];
        let hitCount = 0;
        const maxHits = weaponInfo.hitCount || (isAOE ? 99 : 1);

        for (const m of updated) {
          if (m.dead || hitCount >= maxHits) continue;

          const mx = m.position[0];
          const mz = m.position[2];
          const dist = Math.sqrt(
            (mx - playerPos.x) ** 2 + (mz - playerPos.z) ** 2,
          );

          const effectiveRange = isAOE ? weaponInfo.aoeRadius || range : range;

          if (dist <= effectiveRange) {
            const actualDamage = Math.floor(
              damage * (0.85 + Math.random() * 0.3),
            );
            m.hp = Math.max(0, m.hp - actualDamage);
            hitCount++;

            // Spawn hit particles
            const hitColor = weaponInfo.color;
            const newParticles: Particle[] = Array.from({ length: 5 }).map(
              () => ({
                id: ++particleIdCounter,
                position: new THREE.Vector3(mx, 1.0, mz),
                velocity: new THREE.Vector3(
                  (Math.random() - 0.5) * 5,
                  Math.random() * 5 + 2,
                  (Math.random() - 0.5) * 5,
                ),
                color: hitColor,
                life: 0.6,
                maxLife: 0.6,
                scale: 0.15,
              }),
            );
            setParticles((p) => [...p, ...newParticles]);

            if (m.hp <= 0) {
              m.dead = true;
              const drops = getLootDrops(m.type);
              awardKill(m.xpReward, m.goldReward, drops);
              onXPFloat(m.xpReward);

              // Death explosion
              const deathColor = MONSTER_TYPES[m.type]?.color || "#ff4400";
              const deathParticles: Particle[] = Array.from({ length: 12 }).map(
                () => ({
                  id: ++particleIdCounter,
                  position: new THREE.Vector3(mx, 0.8, mz),
                  velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 8,
                    Math.random() * 6 + 2,
                    (Math.random() - 0.5) * 8,
                  ),
                  color: deathColor,
                  life: 1.0,
                  maxLife: 1.0,
                  scale: 0.2,
                }),
              );
              setParticles((p) => [...p, ...deathParticles]);
            }
          }
        }
        return updated;
      });
    },
    [weaponInfo, playerMana, awardKill, onXPFloat],
  );

  const handleMonsterDeath = useCallback((id: number) => {
    setMonsters((prev) =>
      prev.map((m) => (m.id === id ? { ...m, dead: true } : m)),
    );
  }, []);

  const handleDamagePlayer = useCallback(
    (dmg: number) => {
      takeDamage(dmg);
    },
    [takeDamage],
  );

  return (
    <>
      <PlayerCharacter
        joystickInput={joystickInput.current}
        isAttacking={isAttacking}
        isDodging={isDodging}
        onPositionUpdate={(pos) => {
          playerPosRef.current.copy(pos);
        }}
      />

      {monsters.map((m) =>
        m.dead ? null : (
          <MonsterEntity
            key={m.id}
            monster={m}
            playerPos={playerPosRef}
            onDeath={handleMonsterDeath}
            onDamagePlayer={handleDamagePlayer}
          />
        ),
      )}

      <ParticleSystem particles={particles} />

      <AttackVFX
        active={attackVFXActive}
        playerPos={playerPosRef.current}
        weaponColor={weaponInfo?.color || "#00ffff"}
      />

      <CameraFollow playerPos={playerPosRef} />
    </>
  );
}

// ─── BattleArena (main export) ────────────────────────────────────────────────
interface BattleArenaProps {
  joystickInput: React.MutableRefObject<{ x: number; y: number }>;
  attackPressed: React.MutableRefObject<boolean>;
  specialPressed: React.MutableRefObject<boolean>;
  dodgePressed: React.MutableRefObject<boolean>;
  onXPFloat: (xp: number, x: number, y: number) => void;
  onWaveComplete: () => void;
}

export function BattleArena({
  joystickInput,
  attackPressed,
  specialPressed,
  dodgePressed,
  onXPFloat,
  onWaveComplete,
}: BattleArenaProps) {
  const { currentZone } = useGameStore();
  const isDungeon = currentZone === "dungeon";

  const handleXPFloat = useCallback(
    (xp: number) => {
      // Use center of screen as default position
      onXPFloat(xp, window.innerWidth / 2, window.innerHeight / 2 - 100);
    },
    [onXPFloat],
  );

  return (
    <Canvas
      style={{ touchAction: "none", background: "#000000" }}
      camera={{ position: [0, 5, 8], fov: 70, near: 0.1, far: 500 }}
      shadows
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <hemisphereLight
        color={isDungeon ? "#330000" : "#000033"}
        groundColor="#000000"
        intensity={0.5}
      />
      <pointLight
        position={[0, 12, 0]}
        color={isDungeon ? "#ff2200" : "#0033ff"}
        intensity={1.5}
        distance={40}
        castShadow
      />
      <pointLight
        position={[10, 4, 10]}
        color="#9d00ff"
        intensity={0.8}
        distance={20}
      />
      <pointLight
        position={[-10, 4, -10]}
        color="#00ffff"
        intensity={0.5}
        distance={20}
      />

      {/* Fog - start further so enemies are clearly visible */}
      <fog attach="fog" args={[isDungeon ? "#0a0000" : "#000008", 30, 80]} />

      <ArenaFloor isDungeon={isDungeon} />

      <GameController
        joystickInput={joystickInput}
        attackPressed={attackPressed}
        specialPressed={specialPressed}
        dodgePressed={dodgePressed}
        onXPFloat={handleXPFloat}
        onWaveComplete={onWaveComplete}
      />
    </Canvas>
  );
}
