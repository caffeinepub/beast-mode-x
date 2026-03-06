import { useEffect, useRef } from "react";

export type DungeonBgType =
  | "cave"
  | "tunnel"
  | "desert"
  | "ruins"
  | "volcano"
  | "void"
  | "boss";

const BG_IMAGES: Record<Exclude<DungeonBgType, "boss">, string> = {
  cave: "/assets/generated/dungeon-bg-cave.dim_800x450.jpg",
  tunnel: "/assets/generated/dungeon-bg-tunnel.dim_800x450.jpg",
  desert: "/assets/generated/dungeon-bg-desert.dim_800x450.jpg",
  ruins: "/assets/generated/dungeon-bg-ruins.dim_800x450.jpg",
  volcano: "/assets/generated/dungeon-bg-volcano.dim_800x450.jpg",
  void: "/assets/generated/dungeon-bg-void.dim_800x450.jpg",
};

// Each bg type has an overlay gradient for atmosphere
const BG_OVERLAYS: Record<DungeonBgType, string> = {
  cave: "linear-gradient(to bottom, rgba(10,0,30,0.45) 0%, rgba(5,0,20,0.2) 50%, rgba(10,0,30,0.55) 100%)",
  tunnel:
    "linear-gradient(to bottom, rgba(20,0,0,0.5) 0%, rgba(10,0,0,0.2) 50%, rgba(30,0,0,0.6) 100%)",
  desert:
    "linear-gradient(to bottom, rgba(10,5,0,0.55) 0%, rgba(5,2,0,0.2) 50%, rgba(15,5,0,0.6) 100%)",
  ruins:
    "linear-gradient(to bottom, rgba(0,15,5,0.5) 0%, rgba(0,8,3,0.2) 50%, rgba(0,20,5,0.6) 100%)",
  volcano:
    "linear-gradient(to bottom, rgba(30,0,0,0.4) 0%, rgba(15,0,0,0.1) 50%, rgba(40,5,0,0.65) 100%)",
  void: "linear-gradient(to bottom, rgba(10,0,25,0.5) 0%, rgba(5,0,15,0.15) 50%, rgba(15,0,35,0.65) 100%)",
  boss: "radial-gradient(ellipse at center, rgba(40,0,80,0.7) 0%, rgba(0,0,0,0.9) 100%)",
};

interface ParticleConfig {
  count: number;
  color: string;
  glowColor: string;
  size: [number, number]; // [min, max] px
  speed: [number, number]; // [min, max] s
  opacity: [number, number];
}

const BG_PARTICLES: Record<DungeonBgType, ParticleConfig> = {
  cave: {
    count: 8,
    color: "#9d00ff",
    glowColor: "rgba(157,0,255,0.8)",
    size: [3, 6],
    speed: [3, 6],
    opacity: [0.4, 0.8],
  },
  tunnel: {
    count: 10,
    color: "#ff4400",
    glowColor: "rgba(255,68,0,0.8)",
    size: [2, 5],
    speed: [1.5, 3.5],
    opacity: [0.5, 0.9],
  },
  desert: {
    count: 12,
    color: "#cc8800",
    glowColor: "rgba(200,130,0,0.6)",
    size: [1, 3],
    speed: [2, 5],
    opacity: [0.3, 0.7],
  },
  ruins: {
    count: 8,
    color: "#00ff88",
    glowColor: "rgba(0,255,136,0.7)",
    size: [2, 4],
    speed: [2.5, 5.5],
    opacity: [0.4, 0.7],
  },
  volcano: {
    count: 14,
    color: "#ff6600",
    glowColor: "rgba(255,102,0,0.9)",
    size: [3, 7],
    speed: [1.2, 2.8],
    opacity: [0.6, 1.0],
  },
  void: {
    count: 15,
    color: "#cc00ff",
    glowColor: "rgba(204,0,255,0.8)",
    size: [2, 5],
    speed: [3, 7],
    opacity: [0.3, 0.8],
  },
  boss: {
    count: 20,
    color: "#aa00ff",
    glowColor: "rgba(170,0,255,0.9)",
    size: [2, 6],
    speed: [2, 5],
    opacity: [0.4, 0.9],
  },
};

interface FloatingParticle {
  key: string;
  left: number;
  bottom: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(
  config: ParticleConfig,
  seed: number,
  prefix: string,
): FloatingParticle[] {
  const particles: FloatingParticle[] = [];
  for (let i = 0; i < config.count; i++) {
    // Deterministic-ish based on index+seed
    const r = ((i * 1234 + seed * 567) % 100) / 100;
    const r2 = ((i * 4321 + seed * 789) % 100) / 100;
    const r3 = ((i * 2345 + seed * 123) % 100) / 100;
    const r4 = ((i * 9876 + seed * 456) % 100) / 100;
    const r5 = ((i * 5678 + seed * 890) % 100) / 100;
    particles.push({
      key: `${prefix}_p${i}`,
      left: r * 95 + 2,
      bottom: r2 * 25 + 2,
      size: config.size[0] + r3 * (config.size[1] - config.size[0]),
      duration: config.speed[0] + r4 * (config.speed[1] - config.speed[0]),
      delay: r5 * 3,
      opacity: config.opacity[0] + r * (config.opacity[1] - config.opacity[0]),
    });
  }
  return particles;
}

export function DungeonBackground({
  bgType,
  isBoss,
}: {
  bgType: DungeonBgType;
  isBoss?: boolean;
}) {
  const effectiveType = isBoss ? "boss" : bgType;
  const bgImage =
    effectiveType === "boss"
      ? BG_IMAGES.void
      : BG_IMAGES[effectiveType as Exclude<DungeonBgType, "boss">];
  const overlay = BG_OVERLAYS[effectiveType];
  const particleCfg = BG_PARTICLES[effectiveType];
  const particles = generateParticles(
    particleCfg,
    bgType.length,
    effectiveType,
  );

  // Unique animation name per type
  const animId = `particle_${effectiveType}`;
  const bossRingAnimId = `bossRing_${effectiveType}`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Atmospheric overlay gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlay,
          zIndex: 1,
        }}
      />

      {/* Ambient color tint */}
      {effectiveType === "volcano" && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: "linear-gradient(transparent, rgba(200,40,0,0.3))",
            zIndex: 2,
          }}
        />
      )}
      {effectiveType === "cave" && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "25%",
            background: "linear-gradient(transparent, rgba(80,0,120,0.25))",
            zIndex: 2,
          }}
        />
      )}
      {effectiveType === "void" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(100,0,200,0.15) 0%, transparent 70%)",
            zIndex: 2,
          }}
        />
      )}

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.key}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: particleCfg.color,
            boxShadow: `0 0 ${p.size * 2}px ${particleCfg.glowColor}`,
            opacity: p.opacity,
            animation: `${animId} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            zIndex: 3,
          }}
        />
      ))}

      {/* Boss: pulsing void rings */}
      {isBoss && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          {[0.3, 0.55, 0.8].map((scale, i) => (
            <div
              key={scale}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                width: "80%",
                height: "50%",
                border: `2px solid rgba(100,0,220,${0.5 - i * 0.12})`,
                borderRadius: "50%",
                boxShadow: `0 0 ${20 + i * 12}px rgba(100,0,220,0.35)`,
                animation: `${bossRingAnimId} ${2.5 + i * 0.7}s ease-in-out infinite alternate`,
              }}
            />
          ))}
          {/* Void lightning cracks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg)`,
                transformOrigin: "0 0",
                width: "40%",
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(150,0,255,0.8), transparent)",
                boxShadow: "0 0 4px rgba(150,0,255,0.6)",
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes ${animId} {
          0% { transform: translateY(0) scale(1); opacity: ${particleCfg.opacity[0]}; }
          50% { transform: translateY(-${effectiveType === "volcano" ? 22 : 18}px) scale(0.7); opacity: ${particleCfg.opacity[1]}; }
          100% { transform: translateY(-${effectiveType === "volcano" ? 40 : 35}px) scale(0.3); opacity: 0; }
        }
        @keyframes ${bossRingAnimId} {
          0% { opacity: 0.6; transform: translate(-50%, -50%) scale(var(--s, 0.3)); }
          100% { opacity: 0.15; transform: translate(-50%, -50%) scale(calc(var(--s, 0.3) * 1.08)); }
        }
      `}</style>
    </div>
  );
}
