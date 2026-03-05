import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useCharacterStore } from "./CharacterStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnimeBattleSceneProps {
  playerAttacking: boolean;
  enemyAttacking: boolean;
  playerHurt: boolean;
  enemyHurt: boolean;
  enemyData: {
    type: string;
    hp: number;
    maxHp: number;
    isBoss: boolean;
    color: string;
  } | null;
  currentZone: "normal" | "dungeon";
  equippedWeapon: string;
}

// ─── Weapon colors ────────────────────────────────────────────────────────────
const WEAPON_COLORS: Record<string, string> = {
  fists: "#00ffff",
  woodSword: "#8B4513",
  ironSword: "#aaaaaa",
  shadowBlade: "#9d00ff",
  dragonSword: "#ff6600",
  voidScythe: "#ff00ff",
};

// ─── Background Plane (image texture) ─────────────────────────────────────────
function BattleBackground({
  currentZone,
  isBoss,
}: {
  currentZone: "normal" | "dungeon";
  isBoss: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  const bgUrl = isBoss
    ? "/assets/generated/battle-bg-boss.dim_1200x600.jpg"
    : currentZone === "dungeon"
      ? "/assets/generated/battle-bg-dungeon.dim_1200x600.jpg"
      : "/assets/generated/battle-bg-forest.dim_1200x600.jpg";

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(bgUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [bgUrl]);

  return (
    <mesh ref={meshRef} position={[0, 2, -8]}>
      <planeGeometry args={[28, 14]} />
      {texture ? (
        <meshBasicMaterial map={texture} />
      ) : (
        <meshBasicMaterial
          color={
            isBoss
              ? "#220000"
              : currentZone === "dungeon"
                ? "#110022"
                : "#002211"
          }
        />
      )}
    </mesh>
  );
}

// ─── Particles on hit ─────────────────────────────────────────────────────────
interface Particle {
  id: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: string;
  life: number;
  maxLife: number;
}

let particleCounter = 0;

function HitParticles({
  active,
  position,
  color,
}: {
  active: boolean;
  position: [number, number, number];
  color: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevActiveRef = useRef(false);

  useEffect(() => {
    if (active && !prevActiveRef.current) {
      const newPs: Particle[] = Array.from({ length: 8 }).map(() => ({
        id: ++particleCounter,
        pos: new THREE.Vector3(...position),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          Math.random() * 3 + 1,
          (Math.random() - 0.5) * 2,
        ),
        color,
        life: 0.7,
        maxLife: 0.7,
      }));
      setParticles(newPs);
    }
    prevActiveRef.current = active;
  }, [active, position, color]);

  useFrame((_, delta) => {
    if (particles.length === 0) return;
    setParticles((prev) =>
      prev
        .map((p) => {
          p.pos.addScaledVector(p.vel, delta);
          p.vel.y -= 5 * delta;
          p.life -= delta;
          return p;
        })
        .filter((p) => p.life > 0),
    );
  });

  return (
    <>
      {particles.map((p) => (
        <mesh key={p.id} position={[p.pos.x, p.pos.y, p.pos.z]}>
          <sphereGeometry args={[0.12 * (p.life / p.maxLife), 4, 4]} />
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

// ─── Weapon Mesh in hand ──────────────────────────────────────────────────────
function WeaponMesh({ weaponId }: { weaponId: string }) {
  const color = WEAPON_COLORS[weaponId] || "#00ffff";
  if (weaponId === "fists") return null;

  const isScythe = weaponId === "voidScythe";
  return (
    <mesh position={[0, -0.6, 0.15]}>
      <boxGeometry args={isScythe ? [0.08, 1.2, 0.08] : [0.07, 0.9, 0.07]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

// ─── Player Character ─────────────────────────────────────────────────────────
function PlayerCharacter({
  isAttacking,
  isHurt,
  equippedWeapon,
}: {
  isAttacking: boolean;
  isHurt: boolean;
  equippedWeapon: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const baseX = -4;
  const timeRef = useRef(0);
  const { config } = useCharacterStore();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;

    let targetX = baseX;
    let shakeX = 0;

    if (isAttacking) {
      // Lunge right toward enemy
      targetX = baseX + 2 * Math.sin(Math.min(timeRef.current * 8, Math.PI));
    }

    if (isHurt) {
      // Rapid shake
      shakeX = Math.sin(timeRef.current * 30) * 0.25;
    }

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX + shakeX,
      isAttacking ? 0.35 : 0.15,
    );
  });

  // Reset timer when attacking starts
  useEffect(() => {
    if (isAttacking) timeRef.current = 0;
  }, [isAttacking]);

  const isFemale = config.gender === "female";
  const bodyW = isFemale ? 0.65 : 0.8;
  const skinColor = config.skinTone;
  const hairClr = config.hairColor;
  const outfitClr = config.outfitColor;
  const eyeClr = config.eyeColor;
  const auraClr = config.auraColor;

  const bodyMat = {
    color: outfitClr,
    emissive: auraClr,
    emissiveIntensity: 0.8,
  };

  return (
    <group ref={groupRef} position={[baseX, 0, 0]}>
      {/* Player glow */}
      <pointLight color={auraClr} intensity={1.2} distance={5} />

      {/* Body */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[bodyW, 1.1, 0.38]} />
        <meshStandardMaterial {...bodyMat} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial
          color={skinColor}
          emissive={auraClr}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Anime hair spikes / style */}
      {[-0.15, 0, 0.15].map((ox) => (
        <mesh key={ox} position={[ox, 2.45, 0]} rotation={[0, 0, ox * 2]}>
          <coneGeometry args={[0.1, 0.35, 4]} />
          <meshStandardMaterial
            color={hairClr}
            emissive={hairClr}
            emissiveIntensity={0.7}
          />
        </mesh>
      ))}
      {/* Hair cap */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.36, 8, 6]} />
        <meshStandardMaterial
          color={hairClr}
          emissive={hairClr}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Female longer hair */}
      {isFemale && (
        <>
          <mesh position={[-0.38, 1.85, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.12, 0.5, 0.1]} />
            <meshStandardMaterial
              color={hairClr}
              emissive={hairClr}
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0.38, 1.85, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.12, 0.5, 0.1]} />
            <meshStandardMaterial
              color={hairClr}
              emissive={hairClr}
              emissiveIntensity={0.4}
            />
          </mesh>
        </>
      )}

      {/* Glowing eyes */}
      <mesh position={[0.12, 2.04, 0.34]}>
        <boxGeometry args={[0.1, 0.07, 0.05]} />
        <meshStandardMaterial
          color={eyeClr}
          emissive={eyeClr}
          emissiveIntensity={4}
        />
      </mesh>
      <mesh position={[-0.12, 2.04, 0.34]}>
        <boxGeometry args={[0.1, 0.07, 0.05]} />
        <meshStandardMaterial
          color={eyeClr}
          emissive={eyeClr}
          emissiveIntensity={4}
        />
      </mesh>

      {/* Left arm */}
      <mesh position={[-(bodyW / 2 + 0.12), 1.15, 0]}>
        <boxGeometry args={[0.22, 0.75, 0.22]} />
        <meshStandardMaterial
          color={outfitClr}
          emissive={auraClr}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Right arm with weapon */}
      <group position={[bodyW / 2 + 0.12, 1.45, 0]}>
        <mesh position={[0, -0.37, 0]}>
          <boxGeometry args={[0.22, 0.75, 0.22]} />
          <meshStandardMaterial
            color={outfitClr}
            emissive={auraClr}
            emissiveIntensity={0.6}
          />
        </mesh>
        <WeaponMesh weaponId={equippedWeapon} />
      </group>

      {/* Legs */}
      <mesh position={[0.18, 0.35, 0]}>
        <boxGeometry args={[0.28, 0.85, 0.28]} />
        <meshStandardMaterial
          color={outfitClr}
          emissive={auraClr}
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-0.18, 0.35, 0]}>
        <boxGeometry args={[0.28, 0.85, 0.28]} />
        <meshStandardMaterial
          color={outfitClr}
          emissive={auraClr}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Attack flash */}
      {isAttacking && <pointLight color={auraClr} intensity={4} distance={4} />}
    </group>
  );
}

// ─── Enemy Character ──────────────────────────────────────────────────────────
function EnemyCharacter({
  enemyData,
  isAttacking,
  isHurt,
}: {
  enemyData: {
    type: string;
    hp: number;
    maxHp: number;
    isBoss: boolean;
    color: string;
  };
  isAttacking: boolean;
  isHurt: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef(0);
  const baseX = 4;
  const timeRef = useRef(0);
  const [spawned, setSpawned] = useState(false);

  const { type, isBoss, color } = enemyData;
  const hpFrac = enemyData.hp / enemyData.maxHp;

  // Boss spawn scale animation
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - reset on type change only
  useEffect(() => {
    scaleRef.current = 0;
    setSpawned(false);
    const timer = setTimeout(() => setSpawned(true), 100);
    return () => clearTimeout(timer);
  }, [type]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;

    // Scale up on spawn
    if (!spawned) {
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 0, 0.2);
    } else {
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1, 0.15);
    }

    const baseScale = isBoss ? 1.5 : 1.0;
    const smallTypes = ["goblin"];
    const scaleMultiplier = smallTypes.includes(type) ? 0.65 : baseScale;
    groupRef.current.scale.setScalar(scaleRef.current * scaleMultiplier);

    // Lunge left when attacking
    let targetX = baseX;
    let shakeX = 0;

    if (isAttacking) {
      targetX = baseX - 2 * Math.sin(Math.min(timeRef.current * 8, Math.PI));
    }
    if (isHurt) {
      shakeX = Math.sin(timeRef.current * 30) * 0.3;
    }

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX + shakeX,
      isAttacking ? 0.35 : 0.12,
    );
  });

  useEffect(() => {
    if (isAttacking) timeRef.current = 0;
  }, [isAttacking]);

  const emissive = isHurt ? "#ff0000" : color;
  const emissiveIntensity = isHurt ? 3 : isBoss ? 1.5 : 0.9;

  // VoidKing = sphere, dragonEmperor = dragon, others = humanoid/beast
  const isVoidKing = type === "voidKing";
  const isDragon = type === "dragonEmperor";
  const isGoblin = type === "goblin";
  const isShadowLord = type === "shadowLord";

  const bodyH = isGoblin ? 0.65 : isShadowLord ? 1.3 : isDragon ? 1.0 : 1.0;
  const bodyW = isGoblin ? 0.5 : isDragon ? 1.4 : 0.75;

  return (
    <group ref={groupRef} position={[baseX, 0, 0]}>
      {/* Boss glow */}
      {isBoss && <pointLight color={color} intensity={3} distance={8} />}
      {isHurt && <pointLight color="#ff0000" intensity={5} distance={4} />}

      {isVoidKing ? (
        // Sphere orb creature
        <>
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.9, 10, 10]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Glowing eyes */}
          <mesh position={[-0.28, 1.3, 0.88]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={5}
            />
          </mesh>
          <mesh position={[0.28, 1.3, 0.88]}>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={5}
            />
          </mesh>
          {/* Orbiting orbs */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 3) * Math.PI * 2) * 1.5,
                1.2,
                Math.sin((i / 3) * Math.PI * 2) * 1.5,
              ]}
            >
              <sphereGeometry args={[0.22, 6, 6]} />
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
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[1.4, 1.0, 1.0]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 1.85, 0.4]}>
            <boxGeometry args={[0.6, 0.7, 0.6]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Head */}
          <mesh position={[0, 2.45, 0.65]}>
            <boxGeometry args={[0.8, 0.65, 0.9]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity * 1.3}
            />
          </mesh>
          {/* Dragon eyes */}
          <mesh position={[-0.22, 2.55, 1.12]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial
              color="#ff4400"
              emissive="#ff4400"
              emissiveIntensity={5}
            />
          </mesh>
          <mesh position={[0.22, 2.55, 1.12]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial
              color="#ff4400"
              emissive="#ff4400"
              emissiveIntensity={5}
            />
          </mesh>
          {/* Wings */}
          <mesh position={[-1.6, 1.4, 0]} rotation={[0, 0, -0.45]}>
            <planeGeometry args={[2.0, 1.6]} />
            <meshStandardMaterial
              color="#886600"
              emissive="#664400"
              emissiveIntensity={0.6}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh position={[1.6, 1.4, 0]} rotation={[0, 0, 0.45]}>
            <planeGeometry args={[2.0, 1.6]} />
            <meshStandardMaterial
              color="#886600"
              emissive="#664400"
              emissiveIntensity={0.6}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.4, 0.28, 0]}>
            <boxGeometry args={[0.35, 0.65, 0.35]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity * 0.7}
            />
          </mesh>
          <mesh position={[0.4, 0.28, 0]}>
            <boxGeometry args={[0.35, 0.65, 0.35]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity * 0.7}
            />
          </mesh>
        </>
      ) : (
        // Humanoid / beast
        <>
          {/* Body */}
          <mesh position={[0, bodyH / 2 + 0.1, 0]}>
            <boxGeometry args={[bodyW, bodyH, 0.4]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Head */}
          <mesh position={[0, bodyH + 0.45, 0]}>
            <boxGeometry args={[0.52, 0.52, 0.52]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity * 1.2}
            />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.13, bodyH + 0.52, 0.27]}>
            <boxGeometry args={[0.09, 0.07, 0.05]} />
            <meshStandardMaterial
              color={isBoss ? "#ff0000" : "#ffff00"}
              emissive={isBoss ? "#ff0000" : "#ffff00"}
              emissiveIntensity={4}
            />
          </mesh>
          <mesh position={[0.13, bodyH + 0.52, 0.27]}>
            <boxGeometry args={[0.09, 0.07, 0.05]} />
            <meshStandardMaterial
              color={isBoss ? "#ff0000" : "#ffff00"}
              emissive={isBoss ? "#ff0000" : "#ffff00"}
              emissiveIntensity={4}
            />
          </mesh>
          {/* Arms */}
          <mesh position={[-(bodyW / 2 + 0.15), bodyH * 0.55, 0]}>
            <boxGeometry args={[0.2, bodyH * 0.65, 0.2]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity * 0.8}
            />
          </mesh>
          <mesh position={[bodyW / 2 + 0.15, bodyH * 0.55, 0]}>
            <boxGeometry args={[0.2, bodyH * 0.65, 0.2]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity * 0.8}
            />
          </mesh>
          {/* Legs (for taller humanoids) */}
          {bodyH > 0.7 && (
            <>
              <mesh position={[-0.16, 0.3, 0]}>
                <boxGeometry args={[0.25, 0.7, 0.25]} />
                <meshStandardMaterial
                  color={color}
                  emissive={emissive}
                  emissiveIntensity={emissiveIntensity * 0.7}
                />
              </mesh>
              <mesh position={[0.16, 0.3, 0]}>
                <boxGeometry args={[0.25, 0.7, 0.25]} />
                <meshStandardMaterial
                  color={color}
                  emissive={emissive}
                  emissiveIntensity={emissiveIntensity * 0.7}
                />
              </mesh>
            </>
          )}
          {/* Boss horns / spikes */}
          {isBoss && (
            <>
              <mesh position={[-0.2, bodyH + 0.85, 0]} rotation={[0, 0, 0.3]}>
                <coneGeometry args={[0.1, 0.45, 4]} />
                <meshStandardMaterial
                  color={color}
                  emissive={emissive}
                  emissiveIntensity={2}
                />
              </mesh>
              <mesh position={[0.2, bodyH + 0.85, 0]} rotation={[0, 0, -0.3]}>
                <coneGeometry args={[0.1, 0.45, 4]} />
                <meshStandardMaterial
                  color={color}
                  emissive={emissive}
                  emissiveIntensity={2}
                />
              </mesh>
            </>
          )}
        </>
      )}

      {/* HP bar above */}
      <group
        position={[
          0,
          (isBoss ? 3.5 : 2.8) * (type === "goblin" ? 0.65 : isBoss ? 1.5 : 1),
          0,
        ]}
      >
        {/* Background */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.2, 0.18]} />
          <meshBasicMaterial color="#220000" side={THREE.DoubleSide} />
        </mesh>
        {/* Health fill */}
        <mesh position={[-1.1 * (1 - hpFrac), 0, 0.02]}>
          <planeGeometry args={[2.2 * hpFrac, 0.14]} />
          <meshBasicMaterial
            color={
              hpFrac > 0.5 ? "#00ff44" : hpFrac > 0.25 ? "#ffaa00" : "#ff2200"
            }
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

// ─── Scene Lighting ───────────────────────────────────────────────────────────
function SceneLighting({
  currentZone,
  isBoss,
}: {
  currentZone: "normal" | "dungeon";
  isBoss: boolean;
}) {
  const zoneColor = isBoss
    ? "#ff0033"
    : currentZone === "dungeon"
      ? "#330011"
      : "#001133";

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight
        position={[0, 8, 2]}
        color={zoneColor}
        intensity={1.5}
        distance={20}
      />
      <pointLight
        position={[-6, 3, 3]}
        color="#9d00ff"
        intensity={0.8}
        distance={15}
      />
      <pointLight
        position={[6, 3, 3]}
        color={isBoss ? "#ff0033" : "#00aaff"}
        intensity={0.8}
        distance={15}
      />
    </>
  );
}

// ─── Ground / Stage ────────────────────────────────────────────────────────────
function BattleStage({ currentZone }: { currentZone: "normal" | "dungeon" }) {
  const floorColor = currentZone === "dungeon" ? "#0a0005" : "#05050a";
  const lineColor = currentZone === "dungeon" ? "#440000" : "#001133";

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial color={floorColor} roughness={0.9} />
      </mesh>
      {/* Center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[0.06, 12]} />
        <meshStandardMaterial
          color={lineColor}
          emissive={lineColor}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// ─── Camera setup (fixed side view) ──────────────────────────────────────────
function FixedCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 1.5, 0);
  }, [camera]);
  return null;
}

// ─── Inner Scene ──────────────────────────────────────────────────────────────
function BattleScene({
  playerAttacking,
  enemyAttacking,
  playerHurt,
  enemyHurt,
  enemyData,
  currentZone,
  equippedWeapon,
}: AnimeBattleSceneProps) {
  const weaponColor = WEAPON_COLORS[equippedWeapon] || "#00ffff";
  const isBoss = enemyData?.isBoss ?? false;

  return (
    <>
      <FixedCamera />
      <SceneLighting currentZone={currentZone} isBoss={isBoss} />
      <BattleBackground currentZone={currentZone} isBoss={isBoss} />
      <BattleStage currentZone={currentZone} />

      <PlayerCharacter
        isAttacking={playerAttacking}
        isHurt={playerHurt}
        equippedWeapon={equippedWeapon}
      />

      {enemyData && (
        <>
          <EnemyCharacter
            enemyData={enemyData}
            isAttacking={enemyAttacking}
            isHurt={enemyHurt}
          />
          <HitParticles
            active={enemyHurt}
            position={[4, 1.5, 0]}
            color={enemyData.color}
          />
        </>
      )}

      <HitParticles
        active={playerHurt}
        position={[-4, 1.5, 0]}
        color="#ff0033"
      />

      {/* Attack flash when player attacks */}
      {playerAttacking && (
        <pointLight
          position={[0, 2, 2]}
          color={weaponColor}
          intensity={8}
          distance={8}
        />
      )}
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function AnimeBattleScene(props: AnimeBattleSceneProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100vw",
        height: "clamp(280px, 45vh, 400px)",
      }}
    >
      <Canvas
        style={{
          touchAction: "none",
          background: "#000000",
          width: "100%",
          height: "100%",
        }}
        camera={{ position: [0, 3, 10], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <BattleScene {...props} />
      </Canvas>
    </div>
  );
}
