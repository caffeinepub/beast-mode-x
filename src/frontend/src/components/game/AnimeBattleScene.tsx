import { useEffect, useRef, useState } from "react";
import { useCharacterStore } from "./CharacterStore";
import { DungeonBackground, type DungeonBgType } from "./DungeonBackground";
import type { AttackCard } from "./GameStore";

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
  attackColor?: string;
  bgType?: DungeonBgType;
  playerClass?: string | null;
  lastAttackCard?: AttackCard | null;
  battlePhase?: string;
  gateRank?: string | null;
  showGateClosed?: boolean;
}

// ─── Class character image map ────────────────────────────────────────────────
export const CLASS_CHARACTER_IMAGES: Record<string, string> = {
  SHADOW_MONARCH: "/assets/uploads/grok_image_1772784510971-1.jpg",
  THUNDER_GOD: "/assets/uploads/grok_image_1772784418586-2.jpg",
  INFERNO_KING: "/assets/uploads/grok_image_1772784606169-3.jpg",
  FROST_SOVEREIGN:
    "/assets/generated/class-frost-sovereign-transparent.dim_400x600.png",
  BLOOD_BERSERKER:
    "/assets/generated/class-blood-berserker-transparent.dim_400x600.png",
  VOID_ARCHMAGE:
    "/assets/generated/class-void-archmage-transparent.dim_400x600.png",
};

// ─── Enemy sprite image map ───────────────────────────────────────────────────
const ENEMY_SPRITE_IMAGES: Record<string, string> = {
  goblin: "/assets/generated/goblin-sprite-transparent.dim_200x280.png",
  shadowBeast:
    "/assets/generated/shadow-beast-sprite-transparent.dim_200x280.png",
};

// ─── Enemy Sprite Map ─────────────────────────────────────────────────────────
function EnemySprite({
  type,
  isBoss,
  color,
  isHurt,
  isAttacking,
}: {
  type: string;
  isBoss: boolean;
  color: string;
  isHurt: boolean;
  isAttacking: boolean;
}) {
  const scale = isBoss ? 1.4 : 1.1;
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const shakeAnim = isHurt
    ? "pokemonHurt 0.3s ease-in-out"
    : isAttacking
      ? "pokemonAttack 0.4s ease-in-out"
      : "enemyIdleBob 2s ease-in-out infinite";

  const spriteUrl = ENEMY_SPRITE_IMAGES[type];

  if (spriteUrl && !imgError) {
    const spriteSize = Math.round(190 * scale);
    return (
      <div
        style={{
          animation: shakeAnim,
          position: "relative",
          width: spriteSize,
          height: spriteSize * 1.4,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {/* Boss aura */}
        {isBoss && (
          <div
            style={{
              position: "absolute",
              inset: -16,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${color}50 0%, transparent 70%)`,
              animation: "bossAura 1.5s ease-in-out infinite alternate",
              pointerEvents: "none",
            }}
          />
        )}
        <img
          src={spriteUrl}
          alt={type}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            filter: isHurt
              ? "brightness(3) saturate(0)"
              : isAttacking
                ? `drop-shadow(0 0 12px ${color}) brightness(1.2)`
                : `drop-shadow(0 0 6px ${color}88)`,
            display: imgLoaded ? "block" : "none",
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
        {!imgLoaded && (
          <CSSEnemySprite
            type={type}
            isBoss={isBoss}
            color={color}
            isHurt={isHurt}
            scale={scale}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ animation: shakeAnim }}>
      <CSSEnemySprite
        type={type}
        isBoss={isBoss}
        color={color}
        isHurt={isHurt}
        scale={scale}
      />
    </div>
  );
}

function CSSEnemySprite({
  type,
  isBoss,
  color,
  isHurt,
  scale,
}: {
  type: string;
  isBoss: boolean;
  color: string;
  isHurt: boolean;
  scale: number;
}) {
  const size = Math.round(180 * scale);
  const bodyColor = isHurt ? "#ffffff" : color;
  const emissive = isHurt ? "#ffffff" : color;

  const isDragon = type === "dragonEmperor";
  const isVoidKing = type === "voidKing";
  const isBoneKnight = type === "boneKnight";
  const isVoidDemon = type === "voidDemon";
  const isShadowLord = type === "shadowLord";
  const isShadowBeast = type === "shadowBeast";

  if (isDragon) {
    return (
      <div
        style={{
          position: "relative",
          width: size * 1.5,
          height: size,
          imageRendering: "pixelated",
        }}
      >
        {/* Wings */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "10%",
            width: "40%",
            height: "70%",
            background: "#886600",
            clipPath: "polygon(100% 0%, 0% 20%, 20% 100%, 100% 80%)",
            filter: "drop-shadow(0 0 6px #ff6600)",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "10%",
            width: "40%",
            height: "70%",
            background: "#886600",
            clipPath: "polygon(0% 0%, 100% 20%, 80% 100%, 0% 80%)",
            filter: "drop-shadow(0 0 6px #ff6600)",
            opacity: 0.9,
          }}
        />
        {/* Body */}
        <div
          style={{
            position: "absolute",
            left: "30%",
            top: "20%",
            width: "40%",
            height: "60%",
            background: bodyColor,
            borderRadius: "30% 30% 20% 20%",
            boxShadow: `0 0 12px ${emissive}`,
          }}
        />
        {/* Head */}
        <div
          style={{
            position: "absolute",
            left: "35%",
            top: "0%",
            width: "30%",
            height: "28%",
            background: bodyColor,
            borderRadius: "40% 40% 20% 20%",
            boxShadow: `0 0 10px ${emissive}`,
          }}
        >
          {/* Eyes */}
          <div
            style={{
              position: "absolute",
              left: "15%",
              top: "40%",
              width: "22%",
              height: "30%",
              background: "#ff4400",
              borderRadius: "50%",
              boxShadow: "0 0 6px #ff4400",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "15%",
              top: "40%",
              width: "22%",
              height: "30%",
              background: "#ff4400",
              borderRadius: "50%",
              boxShadow: "0 0 6px #ff4400",
            }}
          />
        </div>
        {/* Fire breath */}
        <div
          style={{
            position: "absolute",
            right: "5%",
            top: "8%",
            width: "25%",
            height: "25%",
            background: "linear-gradient(90deg, #ff4400, #ffaa00, transparent)",
            clipPath: "polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)",
            opacity: 0.8,
          }}
        />
        {isBoss && (
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${color}40 0%, transparent 70%)`,
              animation: "bossAura 2s ease-in-out infinite alternate",
            }}
          />
        )}
      </div>
    );
  }

  if (isVoidKing) {
    return (
      <div
        style={{
          position: "relative",
          width: size * 1.3,
          height: size * 1.2,
          imageRendering: "pixelated",
        }}
      >
        {/* Orbiting orbs */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 12,
              height: 12,
              background: "#aa00ff",
              borderRadius: "50%",
              boxShadow: "0 0 8px #aa00ff",
              transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateX(${size * 0.4}px)`,
              animation: "orbitSpin 3s linear infinite",
              animationDelay: `${i * 0.75}s`,
            }}
          />
        ))}
        {/* Main body sphere */}
        <div
          style={{
            position: "absolute",
            left: "25%",
            top: "15%",
            width: "50%",
            height: "50%",
            background: `radial-gradient(circle at 35% 35%, ${bodyColor}cc, ${bodyColor}44)`,
            borderRadius: "50%",
            boxShadow: `0 0 20px ${emissive}, 0 0 40px ${emissive}66`,
            border: `2px solid ${color}88`,
          }}
        >
          {/* Glowing eyes */}
          <div
            style={{
              position: "absolute",
              left: "22%",
              top: "38%",
              width: "18%",
              height: "14%",
              background: "#ff00ff",
              borderRadius: "50%",
              boxShadow: "0 0 8px #ff00ff",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "22%",
              top: "38%",
              width: "18%",
              height: "14%",
              background: "#ff00ff",
              borderRadius: "50%",
              boxShadow: "0 0 8px #ff00ff",
            }}
          />
        </div>
        {/* Ring */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: "35%",
            width: "80%",
            height: "30%",
            border: `3px solid ${color}`,
            borderRadius: "50%",
            boxShadow: `0 0 10px ${color}`,
            opacity: 0.7,
            transform: "rotateX(70deg)",
          }}
        />
        {isBoss && (
          <div
            style={{
              position: "absolute",
              inset: -12,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${color}35 0%, transparent 70%)`,
              animation: "bossAura 1.5s ease-in-out infinite alternate",
            }}
          />
        )}
      </div>
    );
  }

  if (isBoneKnight) {
    const bw = Math.round(size * 0.55);
    const bh = Math.round(size * 0.9);
    return (
      <div
        style={{
          position: "relative",
          width: bw + 40,
          height: bh,
          imageRendering: "pixelated",
        }}
      >
        {/* Body */}
        <div
          style={{
            position: "absolute",
            left: "30%",
            top: "20%",
            width: "40%",
            height: "55%",
            background: "#ddddcc",
            border: "2px solid #aaaaaa",
            boxShadow: isHurt ? "0 0 15px #fff" : "0 0 6px #ccccaa",
          }}
        />
        {/* Head skull */}
        <div
          style={{
            position: "absolute",
            left: "33%",
            top: "2%",
            width: "34%",
            height: "22%",
            background: "#e8e8d8",
            border: "2px solid #aaaaaa",
            borderRadius: "30% 30% 15% 15%",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "15%",
              top: "40%",
              width: "25%",
              height: "30%",
              background: "#ffaa00",
              borderRadius: "3px",
              boxShadow: "0 0 6px #ffaa00",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "15%",
              top: "40%",
              width: "25%",
              height: "30%",
              background: "#ffaa00",
              borderRadius: "3px",
              boxShadow: "0 0 6px #ffaa00",
            }}
          />
          {/* Crown spikes */}
          {[-1, 0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "-25%",
                left: `${40 + i * 22}%`,
                width: "12%",
                height: "30%",
                background: "#e0e0cc",
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                transform: `rotate(${i * 8}deg)`,
              }}
            />
          ))}
        </div>
        {/* Arms */}
        <div
          style={{
            position: "absolute",
            left: "8%",
            top: "25%",
            width: "20%",
            height: "45%",
            background: "#ddddcc",
            border: "2px solid #aaa",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "25%",
            width: "20%",
            height: "45%",
            background: "#ddddcc",
            border: "2px solid #aaa",
          }}
        />
        {/* Sword */}
        <div
          style={{
            position: "absolute",
            right: "2%",
            top: "10%",
            width: "8%",
            height: "65%",
            background: "#cccccc",
            boxShadow: "0 0 4px #aaaaaa",
          }}
        />
        {/* Legs */}
        <div
          style={{
            position: "absolute",
            left: "33%",
            bottom: "0%",
            width: "15%",
            height: "24%",
            background: "#ccccbb",
            border: "2px solid #aaa",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "33%",
            bottom: "0%",
            width: "15%",
            height: "24%",
            background: "#ccccbb",
            border: "2px solid #aaa",
          }}
        />
        {isBoss && (
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "10px",
              background:
                "radial-gradient(ellipse, #aaaaaa30 0%, transparent 70%)",
              animation: "bossAura 2s ease-in-out infinite alternate",
            }}
          />
        )}
      </div>
    );
  }

  if (isShadowBeast || isVoidDemon || isShadowLord) {
    const dColor = isShadowLord
      ? "#9900ff"
      : isVoidDemon
        ? "#cc0030"
        : "#440088";
    return (
      <div
        style={{
          position: "relative",
          width: size * 1.1,
          height: size * 1.1,
          imageRendering: "pixelated",
        }}
      >
        {/* Floating shadow body */}
        <div
          style={{
            position: "absolute",
            left: "20%",
            top: "10%",
            width: "60%",
            height: "70%",
            background: `radial-gradient(ellipse at 40% 35%, ${isHurt ? "#ffffff" : dColor}cc, ${dColor}22)`,
            borderRadius: "50% 50% 40% 40%",
            boxShadow: `0 0 20px ${dColor}, 0 0 40px ${dColor}66`,
            border: `2px solid ${dColor}88`,
          }}
        >
          {/* Eyes */}
          <div
            style={{
              position: "absolute",
              left: "20%",
              top: "35%",
              width: "22%",
              height: "18%",
              background: "#ff0000",
              borderRadius: "50%",
              boxShadow: "0 0 8px #ff0000, 0 0 16px #ff000066",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "20%",
              top: "35%",
              width: "22%",
              height: "18%",
              background: "#ff0000",
              borderRadius: "50%",
              boxShadow: "0 0 8px #ff0000, 0 0 16px #ff000066",
            }}
          />
          {/* Horns for shadowLord/voidDemon */}
          {(isShadowLord || isVoidDemon) && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: "15%",
                  top: "-20%",
                  width: "18%",
                  height: "30%",
                  background: dColor,
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  filter: `drop-shadow(0 0 4px ${dColor})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "15%",
                  top: "-20%",
                  width: "18%",
                  height: "30%",
                  background: dColor,
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  filter: `drop-shadow(0 0 4px ${dColor})`,
                }}
              />
            </>
          )}
        </div>
        {/* Shadow orbs */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${20 + i * 25}%`,
              bottom: "5%",
              width: 10,
              height: 10,
              background: dColor,
              borderRadius: "50%",
              boxShadow: `0 0 8px ${dColor}`,
              opacity: 0.8,
              animation: "shadowFloat 2s ease-in-out infinite",
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
        {isBoss && (
          <div
            style={{
              position: "absolute",
              inset: -12,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${dColor}40 0%, transparent 70%)`,
              animation: "bossAura 1.5s ease-in-out infinite alternate",
            }}
          />
        )}
      </div>
    );
  }

  // Default humanoid (goblin fallback)
  const hw = Math.round(size * 0.55);
  const hh = Math.round(size * 0.85);
  return (
    <div
      style={{
        position: "relative",
        width: hw,
        height: hh,
        imageRendering: "pixelated",
      }}
    >
      {/* Body */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "22%",
          width: "50%",
          height: "50%",
          background: bodyColor,
          boxShadow: `0 0 8px ${emissive}`,
          border: `2px solid ${color}cc`,
        }}
      />
      {/* Head */}
      <div
        style={{
          position: "absolute",
          left: "28%",
          top: "2%",
          width: "44%",
          height: "22%",
          background: bodyColor,
          borderRadius: "30% 30% 10% 10%",
          boxShadow: `0 0 8px ${emissive}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "15%",
            top: "40%",
            width: "25%",
            height: "30%",
            background: "#ffaa00",
            borderRadius: "50%",
            boxShadow: "0 0 5px #ffaa00",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "15%",
            top: "40%",
            width: "25%",
            height: "30%",
            background: "#ffaa00",
            borderRadius: "50%",
            boxShadow: "0 0 5px #ffaa00",
          }}
        />
        {/* Ears for goblin */}
        <div
          style={{
            position: "absolute",
            left: "-15%",
            top: "20%",
            width: "18%",
            height: "40%",
            background: bodyColor,
            clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)",
            border: "2px solid #22aa22",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-15%",
            top: "20%",
            width: "18%",
            height: "40%",
            background: bodyColor,
            clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)",
            border: "2px solid #22aa22",
          }}
        />
      </div>
      {/* Arms */}
      <div
        style={{
          position: "absolute",
          left: "5%",
          top: "25%",
          width: "20%",
          height: "40%",
          background: bodyColor,
          border: `2px solid ${color}99`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "25%",
          width: "20%",
          height: "40%",
          background: bodyColor,
          border: `2px solid ${color}99`,
        }}
      />
      {/* Club weapon */}
      <div
        style={{
          position: "absolute",
          right: "0%",
          top: "15%",
          width: "10%",
          height: "55%",
          background: "#8B4513",
          boxShadow: "0 0 4px #8B4513",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-5%",
          top: "10%",
          width: "22%",
          height: "22%",
          background: "#6B3410",
          borderRadius: "30%",
          boxShadow: "0 0 4px #8B4513",
        }}
      />
      {/* Legs */}
      <div
        style={{
          position: "absolute",
          left: "28%",
          bottom: "0%",
          width: "18%",
          height: "28%",
          background: bodyColor,
          border: `2px solid ${color}77`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "28%",
          bottom: "0%",
          width: "18%",
          height: "28%",
          background: bodyColor,
          border: `2px solid ${color}77`,
        }}
      />
    </div>
  );
}

// ─── Class Idle Aura Effects ──────────────────────────────────────────────────
function ClassIdleAura({ playerClass }: { playerClass: string }) {
  if (playerClass === "SHADOW_MONARCH") {
    return (
      <>
        {/* Purple shadow wisps */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${20 + i * 18}%`,
              bottom: `${10 + (i % 2) * 15}%`,
              width: 8 + i * 2,
              height: 20 + i * 4,
              background: "rgba(157,0,255,0.6)",
              borderRadius: "50% 50% 30% 30%",
              filter: "blur(3px)",
              animation: `shadowWisp 2.${i + 1}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Dark particles */}
        {[0, 1, 2].map((i) => (
          <div
            key={`p${i}`}
            style={{
              position: "absolute",
              left: `${30 + i * 20}%`,
              top: `${15 + i * 20}%`,
              width: 5,
              height: 5,
              background: "#9d00ff",
              borderRadius: "50%",
              boxShadow: "0 0 6px #9d00ff",
              animation: `darkParticle 3.${i}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
              pointerEvents: "none",
            }}
          />
        ))}
      </>
    );
  }

  if (playerClass === "THUNDER_GOD") {
    return (
      <>
        {/* Gold lightning bolts */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${15 + i * 25}%`,
              top: `${5 + i * 15}%`,
              width: 3,
              height: 25 + i * 5,
              background:
                "linear-gradient(180deg, transparent, #ffdd00, transparent)",
              clipPath:
                "polygon(40% 0%, 60% 0%, 75% 40%, 60% 40%, 80% 100%, 20% 45%, 40% 45%)",
              filter: "drop-shadow(0 0 4px #ffdd00)",
              animation: `lightningFlicker ${1.2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Electric arc lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "1px solid rgba(255,221,0,0.2)",
            borderRadius: "4px",
            animation: "electricPulse 1.5s ease-in-out infinite alternate",
            pointerEvents: "none",
          }}
        />
      </>
    );
  }

  if (playerClass === "INFERNO_KING") {
    return (
      <>
        {/* Rising flames */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${15 + i * 20}%`,
              bottom: "5%",
              width: 10 + i * 3,
              height: 25 + i * 5,
              background: `linear-gradient(180deg, transparent, ${i % 2 === 0 ? "#ff4400" : "#ff8800"})`,
              borderRadius: "50% 50% 30% 30%",
              filter: "blur(2px)",
              animation: `flameRise ${1.5 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.35}s`,
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Ember particles */}
        {[0, 1, 2].map((i) => (
          <div
            key={`e${i}`}
            style={{
              position: "absolute",
              left: `${25 + i * 22}%`,
              bottom: `${20 + i * 15}%`,
              width: 4,
              height: 4,
              background: "#ffaa00",
              borderRadius: "50%",
              boxShadow: "0 0 4px #ff6600",
              animation: `emberFloat ${2 + i * 0.5}s ease-out infinite`,
              animationDelay: `${i * 0.4}s`,
              pointerEvents: "none",
            }}
          />
        ))}
      </>
    );
  }

  if (playerClass === "FROST_SOVEREIGN") {
    return (
      <>
        {/* Ice crystals */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${10 + i * 22}%`,
              top: `${10 + (i % 2) * 30}%`,
              width: 8,
              height: 8,
              background: "rgba(0,255,255,0.7)",
              boxShadow: "0 0 6px #00ffff",
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              animation: `iceCrystalFloat ${2 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Cold mist */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse, rgba(0,200,255,0.08) 0%, transparent 70%)",
            animation: "coldMistPulse 2.5s ease-in-out infinite alternate",
            pointerEvents: "none",
          }}
        />
      </>
    );
  }

  if (playerClass === "BLOOD_BERSERKER") {
    return (
      <>
        {/* Pulsing red aura rings */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: -8 - i * 10,
              borderRadius: "4px",
              border: `${2 - i}px solid rgba(200,0,0,${0.5 - i * 0.15})`,
              animation: `bloodAuraPulse ${1.2 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Red crack effects */}
        {[0, 1, 2].map((i) => (
          <div
            key={`c${i}`}
            style={{
              position: "absolute",
              left: `${20 + i * 25}%`,
              top: `${30 + (i % 2) * 20}%`,
              width: 2,
              height: 15 + i * 5,
              background: "#cc0000",
              boxShadow: "0 0 4px #ff0000",
              transform: `rotate(${-20 + i * 20}deg)`,
              animation: `bloodCrack ${1.8 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              pointerEvents: "none",
            }}
          />
        ))}
      </>
    );
  }

  if (playerClass === "VOID_ARCHMAGE") {
    return (
      <>
        {/* Orbiting void orbs */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 10,
              height: 10,
              background: "#cc00ff",
              borderRadius: "50%",
              boxShadow: "0 0 8px #aa00ff",
              transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateX(55px)`,
              animation: `voidOrbOrbit ${3 + i * 0.5}s linear infinite`,
              animationDelay: `${-i * 1}s`,
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Dimensional distortion rings */}
        {[0, 1].map((i) => (
          <div
            key={`r${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 80 + i * 40,
              height: 30 + i * 15,
              border: `1px solid rgba(204,0,255,${0.3 - i * 0.1})`,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              animation: `voidRingPulse ${2 + i * 0.8}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              pointerEvents: "none",
            }}
          />
        ))}
      </>
    );
  }

  return null;
}

// ─── Player Character Sprite (class-image based) ──────────────────────────────
function PlayerSprite({
  isAttacking,
  isHurt,
  isFemale,
  hairColor,
  skinTone,
  outfitColor,
  eyeColor,
  auraColor,
  hairStyle,
  playerClass,
}: {
  isAttacking: boolean;
  isHurt: boolean;
  isFemale: boolean;
  hairColor: string;
  skinTone: string;
  outfitColor: string;
  eyeColor: string;
  auraColor: string;
  hairStyle: number;
  playerClass?: string | null;
}) {
  const [classImgLoaded, setClassImgLoaded] = useState(false);
  const [classImgError, setClassImgError] = useState(false);

  const classImageSrc = playerClass
    ? CLASS_CHARACTER_IMAGES[playerClass]
    : null;

  // Pokemon-style animation
  const containerAnim = isAttacking
    ? "classPlayerAttack 0.5s ease-in-out"
    : isHurt
      ? "classPlayerHurt 0.4s ease-in-out"
      : "classPlayerIdle 3s ease-in-out infinite";

  const imgFilter = isHurt
    ? "brightness(3) saturate(0)"
    : isAttacking
      ? `drop-shadow(0 0 12px ${auraColor}) brightness(1.15)`
      : `drop-shadow(0 0 6px ${auraColor}88)`;

  // Show class image if available
  if (classImageSrc && !classImgError) {
    return (
      <div
        style={{
          position: "relative",
          width: 150,
          height: 280,
          animation: containerAnim,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {/* Aura glow behind character */}
        <div
          style={{
            position: "absolute",
            inset: -8,
            background: `radial-gradient(ellipse at center 80%, ${auraColor}30 0%, transparent 70%)`,
            borderRadius: "50%",
            pointerEvents: "none",
            animation: "classAuraGlow 2s ease-in-out infinite alternate",
          }}
        />

        {/* Class image */}
        <img
          src={classImageSrc}
          alt={playerClass ?? "player"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: imgFilter,
            display: classImgLoaded ? "block" : "none",
            borderRadius: "4px",
          }}
          onLoad={() => setClassImgLoaded(true)}
          onError={() => setClassImgError(true)}
        />

        {/* Loading fallback */}
        {!classImgLoaded && (
          <CSSPlayerCharacter
            isFemale={isFemale}
            hairColor={hairColor}
            skinTone={skinTone}
            outfitColor={outfitColor}
            eyeColor={eyeColor}
            auraColor={auraColor}
            hairStyle={hairStyle}
            isAttacking={isAttacking}
            isHurt={isHurt}
          />
        )}

        {/* Per-class idle aura overlay */}
        {classImgLoaded && playerClass && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            <ClassIdleAura playerClass={playerClass} />
          </div>
        )}
      </div>
    );
  }

  // Fallback: CSS character
  return (
    <div
      style={{
        position: "relative",
        width: 150,
        height: 240,
        animation: containerAnim,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -4,
          background: `radial-gradient(ellipse at center 80%, ${auraColor}35 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "classAuraGlow 2s ease-in-out infinite alternate",
        }}
      />
      <CSSPlayerCharacter
        isFemale={isFemale}
        hairColor={hairColor}
        skinTone={skinTone}
        outfitColor={outfitColor}
        eyeColor={eyeColor}
        auraColor={auraColor}
        hairStyle={hairStyle}
        isAttacking={isAttacking}
        isHurt={isHurt}
      />
      {playerClass && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          <ClassIdleAura playerClass={playerClass} />
        </div>
      )}
    </div>
  );
}

// ─── CSS Player Character (proper anime humanoid, NOT blocky) ─────────────────
function CSSPlayerCharacter({
  isFemale,
  hairColor,
  skinTone,
  outfitColor,
  eyeColor,
  auraColor,
  hairStyle,
  isAttacking,
  isHurt,
}: {
  isFemale: boolean;
  hairColor: string;
  skinTone: string;
  outfitColor: string;
  eyeColor: string;
  auraColor: string;
  hairStyle: number;
  isAttacking: boolean;
  isHurt: boolean;
}) {
  const filter = isHurt
    ? "brightness(3) saturate(0)"
    : isAttacking
      ? `drop-shadow(0 0 6px ${auraColor})`
      : "none";

  return (
    <div style={{ position: "relative", width: 110, height: 200, filter }}>
      {/* HEAD */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
          width: 40,
          height: 43,
          background: skinTone,
          borderRadius: isFemale
            ? "50% 50% 45% 45% / 55% 55% 45% 45%"
            : "44% 44% 38% 38% / 50% 50% 38% 38%",
          boxShadow: `0 2px 6px rgba(0,0,0,0.3), 0 0 8px ${auraColor}30`,
          zIndex: 3,
          overflow: "visible",
        }}
      >
        {/* Hair */}
        <HairSprite
          hairStyle={hairStyle}
          hairColor={hairColor}
          isFemale={isFemale}
        />

        {/* Left eye */}
        <div
          style={{
            position: "absolute",
            left: "18%",
            top: "42%",
            width: 7,
            height: isFemale ? 7 : 6,
            background: "#111",
            borderRadius: isFemale ? "50% 50% 40% 40%" : "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 1,
              background: eyeColor,
              borderRadius: "inherit",
              boxShadow: `0 0 4px ${eyeColor}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "55%",
              width: 2,
              height: 2,
              background: "#fff",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Right eye */}
        <div
          style={{
            position: "absolute",
            right: "18%",
            top: "42%",
            width: 7,
            height: isFemale ? 7 : 6,
            background: "#111",
            borderRadius: isFemale ? "50% 50% 40% 40%" : "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 1,
              background: eyeColor,
              borderRadius: "inherit",
              boxShadow: `0 0 4px ${eyeColor}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "55%",
              width: 2,
              height: 2,
              background: "#fff",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Mouth */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "15%",
            width: isFemale ? 8 : 6,
            height: 2,
            background: isFemale ? "#dd7777" : "rgba(0,0,0,0.2)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* NECK */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 41,
          width: isFemale ? 10 : 12,
          height: 10,
          background: skinTone,
          zIndex: 2,
        }}
      />

      {/* TORSO */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 49,
          width: isFemale ? 31 : 38,
          height: isFemale ? 46 : 48,
          background: outfitColor,
          borderRadius: isFemale ? "4px 4px 10px 10px" : "3px 3px 8px 8px",
          border: `1px solid ${auraColor}50`,
          boxShadow: `inset 0 0 10px ${auraColor}15, 0 0 8px ${auraColor}20`,
          zIndex: 2,
          overflow: "visible",
        }}
      >
        {/* Chest emblem */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "25%",
            transform: "translateX(-50%)",
            width: 8,
            height: 8,
            background: `radial-gradient(${auraColor}cc, transparent)`,
            borderRadius: "50%",
            border: `1px solid ${auraColor}`,
            boxShadow: `0 0 6px ${auraColor}`,
          }}
        />
      </div>

      {/* LEFT ARM (back, facing right = sword arm outstretched) */}
      <div
        style={{
          position: "absolute",
          left: isFemale ? "14%" : "10%",
          top: 50,
          width: isFemale ? 11 : 13,
          height: 38,
          background: outfitColor,
          borderRadius: "4px",
          border: `1px solid ${auraColor}40`,
          zIndex: 1,
          transform: isAttacking ? "rotate(30deg) translateY(-6px)" : "none",
          transformOrigin: "top center",
          transition: "transform 0.2s",
        }}
      />

      {/* RIGHT ARM (weapon arm) */}
      <div
        style={{
          position: "absolute",
          right: isFemale ? "14%" : "10%",
          top: 50,
          width: isFemale ? 11 : 13,
          height: 38,
          background: outfitColor,
          borderRadius: "4px",
          border: `1px solid ${auraColor}40`,
          zIndex: 3,
          transform: isAttacking
            ? "rotate(-40deg) translateY(-8px) translateX(4px)"
            : "rotate(10deg)",
          transformOrigin: "top center",
          transition: "transform 0.2s",
        }}
      >
        {/* Weapon in hand */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 3,
            height: 24,
            background: auraColor,
            boxShadow: `0 0 8px ${auraColor}, 0 0 16px ${auraColor}66`,
            borderRadius: "2px",
          }}
        />
        {/* Sword crossguard */}
        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 10,
            height: 3,
            background: auraColor,
            boxShadow: `0 0 4px ${auraColor}`,
            borderRadius: "1px",
          }}
        />
      </div>

      {/* HIPS */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 95,
          width: isFemale ? 36 : 41,
          height: 10,
          background: outfitColor,
          border: `1px solid ${auraColor}40`,
          borderRadius: "0 0 4px 4px",
          zIndex: 2,
        }}
      />

      {/* LEFT LEG */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          marginLeft: isFemale ? -19 : -22,
          top: 103,
          width: isFemale ? 14 : 17,
          height: 36,
          background: outfitColor,
          borderRadius: "0 0 4px 4px",
          border: `1px solid ${auraColor}30`,
          zIndex: 2,
        }}
      >
        {/* Boot */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: -1,
            width: 17,
            height: 12,
            background: "#111",
            borderRadius: "0 0 4px 4px",
            boxShadow: `0 0 4px ${auraColor}20`,
          }}
        />
      </div>

      {/* RIGHT LEG */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          marginLeft: isFemale ? 5 : 5,
          top: 103,
          width: isFemale ? 14 : 17,
          height: 36,
          background: outfitColor,
          borderRadius: "0 0 4px 4px",
          border: `1px solid ${auraColor}30`,
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: -1,
            width: 17,
            height: 12,
            background: "#111",
            borderRadius: "0 0 4px 4px",
            boxShadow: `0 0 4px ${auraColor}20`,
          }}
        />
      </div>

      {/* Attack glow overlay */}
      {isAttacking && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${auraColor}50 0%, transparent 70%)`,
            pointerEvents: "none",
            animation: "attackGlow 0.5s ease-out",
          }}
        />
      )}
    </div>
  );
}

// ─── Hair Sprite for CSS character ────────────────────────────────────────────
function HairSprite({
  hairStyle,
  hairColor,
  isFemale,
}: { hairStyle: number; hairColor: string; isFemale: boolean }) {
  const glow = `drop-shadow(0 0 3px ${hairColor})`;

  const idx = Math.min(hairStyle, 5);

  if (idx === 0) {
    return (
      <>
        {[-6, -3, 0, 3, 6].map((x, i) => (
          <div
            key={x}
            style={{
              position: "absolute",
              bottom: "88%",
              left: `calc(50% + ${x}px)`,
              transform: "translateX(-50%)",
              width: 5,
              height: i % 2 === 0 ? 14 : 10,
              background: hairColor,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              filter: glow,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: -2,
            right: -2,
            height: "50%",
            background: hairColor,
            borderRadius: "50% 50% 0 0",
            filter: glow,
          }}
        />
      </>
    );
  }
  if (idx === 1) {
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: -3,
            right: -3,
            height: "55%",
            background: hairColor,
            borderRadius: "50% 50% 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: -6,
            width: 8,
            height: isFemale ? 60 : 50,
            background: `linear-gradient(${hairColor}ee, transparent)`,
            borderRadius: "0 0 6px 50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "45%",
            right: -6,
            width: 8,
            height: isFemale ? 55 : 45,
            background: `linear-gradient(${hairColor}ee, transparent)`,
            borderRadius: "0 0 50% 6px",
          }}
        />
      </>
    );
  }
  if (idx === 2) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -3,
          right: -3,
          height: "44%",
          background: hairColor,
          borderRadius: "50% 50% 0 0",
          filter: glow,
        }}
      />
    );
  }
  if (idx === 3) {
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: hairColor,
            borderRadius: "50% 50% 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "5%",
            right: -5,
            width: 7,
            height: 40,
            background: `linear-gradient(${hairColor}, transparent)`,
            borderRadius: "0 10px 10px 0",
            transform: "rotate(8deg)",
          }}
        />
      </>
    );
  }
  if (idx === 4) {
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 0,
            right: 0,
            height: "44%",
            background: hairColor,
            borderRadius: "50% 50% 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 14,
            height: 14,
            background: hairColor,
            borderRadius: "50%",
            boxShadow: `0 0 6px ${hairColor}`,
          }}
        />
      </>
    );
  }
  // 5: Mohawk
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "-22%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 10,
          height: 22,
          background: hairColor,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          filter: glow,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 10,
          height: "38%",
          background: hairColor,
          borderRadius: "2px 2px 0 0",
        }}
      />
    </>
  );
}

// ─── Attack Intro Overlay ──────────────────────────────────────────────────────
function AttackIntroOverlay({
  card,
  visible,
}: {
  card: AttackCard | null;
  visible: boolean;
}) {
  if (!visible || !card) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        animation: "attackIntroFade 0.6s ease-out forwards",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.3rem",
          background: "rgba(0,0,0,0.6)",
          border: `1px solid ${card.color}88`,
          borderRadius: "12px",
          padding: "0.75rem 1.5rem",
          boxShadow: `0 0 30px ${card.color}55`,
        }}
      >
        <span
          style={{
            fontSize: "2.5rem",
            filter: `drop-shadow(0 0 8px ${card.color})`,
          }}
        >
          {card.icon}
        </span>
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(0.85rem, 3vw, 1.2rem)",
            letterSpacing: "0.1em",
            color: card.color,
            textShadow: `0 0 12px ${card.color}`,
          }}
        >
          {card.name}
        </div>
        {card.rarity === "legendary" && (
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              color: "gold",
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
            }}
          >
            ✦ LEGENDARY ✦
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Battle Start Overlay ─────────────────────────────────────────────────────
function BattleStartOverlay({
  enemy,
  gateRank,
  visible,
}: {
  enemy: AnimeBattleSceneProps["enemyData"] | null;
  gateRank?: string | null;
  visible: boolean;
}) {
  if (!visible || !enemy) return null;

  const isBoss = enemy.isBoss;
  const gateColors: Record<string, string> = {
    E: "#888888",
    D: "#00cc66",
    C: "#0088ff",
    B: "#8800cc",
    A: "#ff6600",
    S: "#ffdd00",
    SPECIAL: "#ff0011",
  };
  const rankColor = gateRank
    ? (gateColors[gateRank] ?? "#9d00ff")
    : isBoss
      ? "#ff0033"
      : "#9d00ff";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.8rem",
        animation: "battleStartReveal 1.8s ease forwards",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Black flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          animation: "battleStartFlash 1.8s ease forwards",
        }}
      />
      {/* Screen border flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 60px ${rankColor}66, inset 0 0 120px ${rankColor}33`,
          animation: "battleBorderFlash 1.8s ease forwards",
          borderRadius: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        {/* Gate rank badge */}
        {gateRank && (
          <div
            style={{
              padding: "4px 14px",
              background: `${rankColor}22`,
              border: `2px solid ${rankColor}`,
              borderRadius: "20px",
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: rankColor,
              textShadow: `0 0 12px ${rankColor}`,
              boxShadow: `0 0 20px ${rankColor}44`,
              animation: "slideInTop 0.4s ease forwards 0.3s",
              opacity: 0,
            }}
          >
            {gateRank}-RANK GATE
          </div>
        )}

        {/* Enemy name */}
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(1.4rem, 5vw, 2.4rem)",
            letterSpacing: "0.08em",
            color: isBoss ? "#ff0033" : "#ffffff",
            textShadow: isBoss
              ? "0 0 30px #ff0033, 0 0 60px #ff003366"
              : `0 0 20px ${rankColor}, 0 0 40px ${rankColor}66`,
            textAlign: "center",
            animation: "slideInTop 0.5s ease forwards 0.5s",
            opacity: 0,
          }}
        >
          {enemy.type === "goblin"
            ? "GOBLIN"
            : enemy.type === "shadowBeast"
              ? "SHADOW BEAST"
              : enemy.type === "boneKnight"
                ? "BONE KNIGHT"
                : enemy.type === "voidDemon"
                  ? "VOID DEMON"
                  : enemy.type === "shadowLord"
                    ? "SHADOW LORD"
                    : enemy.type === "voidKing"
                      ? "VOID KING"
                      : enemy.type === "dragonEmperor"
                        ? "DRAGON EMPEROR"
                        : enemy.type.toUpperCase()}
        </div>

        {/* VS text */}
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(2rem, 8vw, 4rem)",
            letterSpacing: "0.15em",
            color: "white",
            textShadow: "0 0 20px rgba(255,255,255,0.8)",
            animation: "vsAppear 0.4s ease forwards 0.8s",
            opacity: 0,
            lineHeight: 1,
          }}
        >
          VS
        </div>

        {/* Boss indicator */}
        {isBoss && (
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "#ff0033",
              textShadow: "0 0 12px #ff0033",
              animation: "slideInTop 0.4s ease forwards 1s",
              opacity: 0,
            }}
          >
            ⚠️ BOSS ENCOUNTER
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gate Closed Overlay ───────────────────────────────────────────────────────
function GateClosedOverlay({
  visible,
  gateRank,
}: {
  visible: boolean;
  gateRank?: string | null;
}) {
  if (!visible) return null;

  const gateColors: Record<string, string> = {
    E: "#888888",
    D: "#00cc66",
    C: "#0088ff",
    B: "#8800cc",
    A: "#ff6600",
    S: "#ffdd00",
    SPECIAL: "#ff0011",
  };
  const rankColor = gateRank ? (gateColors[gateRank] ?? "#9d00ff") : "#9d00ff";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 55,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        pointerEvents: "none",
        animation: "gateClosedFadeOut 2.5s ease forwards",
        overflow: "hidden",
      }}
    >
      {/* Dark BG */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Swirling portal closing */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "200px",
          height: "200px",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: i * 20,
              borderRadius: "50%",
              border: `${3 - i * 0.5}px solid ${rankColor}${["ff", "cc", "88", "44"][i]}`,
              animation: `gatePortalClose ${0.8 + i * 0.3}s ease-in forwards`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: "35%",
            borderRadius: "50%",
            background: rankColor,
            boxShadow: `0 0 30px ${rankColor}, 0 0 60px ${rankColor}88`,
            animation: "gatePortalCore 0.6s ease-in forwards 0.4s",
            opacity: 0,
          }}
        />
      </div>

      {/* Text */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        {gateRank && (
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: rankColor,
              textShadow: `0 0 12px ${rankColor}`,
              marginBottom: "0.5rem",
            }}
          >
            {gateRank}-RANK GATE
          </div>
        )}
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(1.8rem, 6vw, 3rem)",
            letterSpacing: "0.15em",
            color: "white",
            textShadow: `0 0 30px ${rankColor}, 0 0 60px ${rankColor}88`,
          }}
        >
          GATE CLOSED
        </div>
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.5)",
            marginTop: "0.4rem",
            letterSpacing: "0.1em",
          }}
        >
          Dungeon cleared. Gate has been sealed.
        </div>
      </div>
    </div>
  );
}

// ─── Dragon Quest Battle Scene (Pure 2D) ──────────────────────────────────────
function PokemonBattleLayout({
  playerAttacking,
  enemyAttacking,
  playerHurt,
  enemyHurt,
  enemyData,
  currentZone,
  attackColor,
  bgType,
  playerClass,
  lastAttackCard,
  battlePhase,
  gateRank,
  showGateClosed,
}: AnimeBattleSceneProps) {
  const { config } = useCharacterStore();
  const [attackFlash, setAttackFlash] = useState<string | null>(null);
  const [playerRushing, setPlayerRushing] = useState(false);
  const [enemyRushing, setEnemyRushing] = useState(false);
  const [hitEffect, setHitEffect] = useState<{
    x: number;
    y: number;
    color: string;
  } | null>(null);
  const [showAttackIntro, setShowAttackIntro] = useState(false);
  const attackFlashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFemale = config.gender === "female";
  const auraColor = config.auraColor || "#00aaff";
  const effectAttackColor = attackColor || auraColor;

  // Player rush animation sequence: rush → hit → return
  useEffect(() => {
    if (playerAttacking) {
      setPlayerRushing(true);
      setShowAttackIntro(true);
      const fc = effectAttackColor;
      setAttackFlash(fc);
      if (attackFlashRef.current) clearTimeout(attackFlashRef.current);
      // Hide intro after 0.6s
      setTimeout(() => setShowAttackIntro(false), 600);
      // Hit effect at enemy position
      setTimeout(() => {
        setHitEffect({ x: 65, y: 22, color: fc });
        setTimeout(() => setHitEffect(null), 500);
      }, 250);
      attackFlashRef.current = setTimeout(() => {
        setAttackFlash(null);
        setPlayerRushing(false);
      }, 600);
    }
  }, [playerAttacking, effectAttackColor]);

  // Enemy rush animation sequence
  useEffect(() => {
    if (enemyAttacking) {
      setEnemyRushing(true);
      setAttackFlash("#ff0033");
      if (attackFlashRef.current) clearTimeout(attackFlashRef.current);
      // Hit effect at player position
      setTimeout(() => {
        setHitEffect({ x: 15, y: 50, color: "#ff0033" });
        setTimeout(() => setHitEffect(null), 500);
      }, 250);
      attackFlashRef.current = setTimeout(() => {
        setAttackFlash(null);
        setEnemyRushing(false);
      }, 600);
    }
  }, [enemyAttacking]);

  useEffect(() => {
    return () => {
      if (attackFlashRef.current) clearTimeout(attackFlashRef.current);
    };
  }, []);

  const effectiveBgType: DungeonBgType = bgType
    ? bgType
    : enemyData?.isBoss
      ? "void"
      : currentZone === "dungeon"
        ? "tunnel"
        : "cave";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        imageRendering: "pixelated",
      }}
    >
      {/* Background */}
      <DungeonBackground
        bgType={effectiveBgType}
        isBoss={enemyData?.isBoss ?? false}
      />

      {/* Screen shake on hit */}
      {(enemyHurt || playerHurt) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation: "screenShake 0.3s ease-out",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Attack flash overlay */}
      {attackFlash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `${attackFlash}1a`,
            zIndex: 20,
            pointerEvents: "none",
            animation: "flashFade 0.5s ease-out forwards",
          }}
        />
      )}

      {/* Attack intro overlay — shows skill name/icon */}
      <AttackIntroOverlay
        card={lastAttackCard ?? null}
        visible={showAttackIntro}
      />

      {/* ── DQ BATTLE LAYOUT ── */}
      {/* Enemy — top-right, with rush animation when attacking */}
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "6%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.8))",
          animation: enemyRushing ? "enemyRush 0.5s ease-in-out" : undefined,
          transition: "transform 0.1s ease",
        }}
      >
        {enemyData ? (
          <EnemySprite
            type={enemyData.type}
            isBoss={enemyData.isBoss}
            color={enemyData.color}
            isHurt={enemyHurt}
            isAttacking={enemyAttacking}
          />
        ) : (
          /* Loading placeholder */
          <div
            style={{
              width: 130,
              height: 130,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "rgba(0,0,0,0.5)",
              border: "2px solid rgba(255,0,51,0.4)",
              borderRadius: "50%",
              animation: "spawnPulse 1s ease-in-out infinite alternate",
              boxShadow: "0 0 20px rgba(255,0,51,0.3)",
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                animation: "spawnPulse 0.8s ease-in-out infinite alternate",
              }}
            >
              👾
            </div>
            <div
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.12em",
                color: "rgba(255,80,80,0.8)",
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
              }}
            >
              SPAWNING...
            </div>
          </div>
        )}
        {/* Enemy ground shadow */}
        <div
          style={{
            width: "80%",
            height: 10,
            background: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            filter: "blur(6px)",
            marginTop: -6,
          }}
        />
      </div>

      {/* Player — bottom-left, with rush animation when attacking */}
      <div
        style={{
          position: "absolute",
          left: "4%",
          bottom: "38%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          zIndex: 10,
          minHeight: "320px",
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.8))",
          animation: playerRushing ? "playerRush 0.5s ease-in-out" : undefined,
        }}
      >
        <PlayerSprite
          isAttacking={playerAttacking}
          isHurt={playerHurt}
          isFemale={isFemale}
          hairColor={config.hairColor}
          skinTone={config.skinTone}
          outfitColor={config.outfitColor}
          eyeColor={config.eyeColor}
          auraColor={auraColor}
          hairStyle={config.hairStyle}
          playerClass={playerClass}
        />
        {/* Player shadow */}
        <div
          style={{
            width: "70%",
            height: 10,
            background: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            filter: "blur(5px)",
            marginTop: -5,
          }}
        />
      </div>

      {/* Ground divide line */}
      <div
        style={{
          position: "absolute",
          bottom: "38%",
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      {/* Attack energy effect (enhanced DQ style) */}
      {playerAttacking && (
        <>
          {/* Energy line */}
          <div
            style={{
              position: "absolute",
              left: "18%",
              right: "12%",
              top: "35%",
              height: 5,
              background: `linear-gradient(90deg, transparent, ${effectAttackColor}, white, ${effectAttackColor}44, transparent)`,
              boxShadow: `0 0 20px ${effectAttackColor}, 0 0 40px ${effectAttackColor}66`,
              borderRadius: "3px",
              animation: "attackSlash 0.45s ease-out forwards",
              zIndex: 15,
              pointerEvents: "none",
            }}
          />
          {/* Secondary slash diagonal */}
          <div
            style={{
              position: "absolute",
              left: "45%",
              top: "15%",
              width: 5,
              height: "30%",
              background: `linear-gradient(180deg, transparent, ${effectAttackColor}cc, transparent)`,
              boxShadow: `0 0 12px ${effectAttackColor}`,
              borderRadius: "3px",
              animation: "attackSlashV 0.4s ease-out forwards",
              zIndex: 15,
              pointerEvents: "none",
              transform: "rotate(25deg)",
            }}
          />
        </>
      )}

      {/* Enemy attack energy */}
      {enemyAttacking && (
        <div
          style={{
            position: "absolute",
            left: "12%",
            right: "18%",
            top: "50%",
            height: 5,
            background:
              "linear-gradient(270deg, transparent, #ff0033, white, #ff003366, transparent)",
            boxShadow: "0 0 20px #ff0033, 0 0 40px #ff003366",
            borderRadius: "3px",
            animation: "attackSlash 0.45s ease-out forwards",
            zIndex: 15,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Hit sparks at position */}
      {hitEffect && (
        <HitSparks x={hitEffect.x} y={hitEffect.y} color={hitEffect.color} />
      )}

      {/* Extra hurt flash on characters */}
      {(enemyHurt || playerHurt) && (
        <HitSparks
          x={enemyHurt ? 70 : 15}
          y={enemyHurt ? 20 : 48}
          color={enemyHurt ? effectAttackColor : "#ff0033"}
        />
      )}

      {/* Battle start animation overlay */}
      <BattleStartOverlay
        enemy={enemyData}
        gateRank={gateRank}
        visible={battlePhase === "start"}
      />

      {/* Gate closed overlay */}
      <GateClosedOverlay
        visible={showGateClosed ?? false}
        gateRank={gateRank}
      />

      <style>{`
        @keyframes classPlayerIdle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes classPlayerAttack {
          0% { transform: translateX(0) scale(1); }
          25% { transform: translateX(30px) scale(1.08); }
          55% { transform: translateX(10px) scale(1.03); }
          100% { transform: translateX(0) scale(1); }
        }
        @keyframes classPlayerHurt {
          0%, 100% { transform: translateX(0); filter: brightness(1); }
          20% { transform: translateX(-12px); filter: brightness(4) saturate(0); }
          40% { transform: translateX(12px); filter: brightness(4) saturate(0); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes classAuraGlow {
          0% { opacity: 0.25; }
          100% { opacity: 0.7; }
        }
        @keyframes shadowWisp {
          0%, 100% { transform: translateY(0) scaleX(1); opacity: 0.6; }
          50% { transform: translateY(-12px) scaleX(0.8); opacity: 0.9; }
        }
        @keyframes darkParticle {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.7; }
          33% { transform: translate(-4px,-8px) scale(1.2); opacity: 1; }
          66% { transform: translate(5px,-4px) scale(0.8); opacity: 0.5; }
        }
        @keyframes lightningFlicker {
          0%, 100% { opacity: 0.8; transform: scaleX(1); }
          25% { opacity: 0.2; }
          50% { opacity: 1; transform: scaleX(1.1); }
          75% { opacity: 0.4; }
        }
        @keyframes electricPulse {
          0% { opacity: 0.1; box-shadow: 0 0 4px rgba(255,221,0,0.2); }
          100% { opacity: 0.4; box-shadow: 0 0 12px rgba(255,221,0,0.5); }
        }
        @keyframes flameRise {
          0% { transform: translateY(0) scaleX(1); opacity: 0.8; }
          50% { transform: translateY(-18px) scaleX(0.7); opacity: 0.6; }
          100% { transform: translateY(-30px) scaleX(0.4); opacity: 0; }
        }
        @keyframes emberFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-15px) scale(1.3); opacity: 0.7; }
          100% { transform: translateY(-28px) scale(0.5); opacity: 0; }
        }
        @keyframes iceCrystalFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-8px) rotate(45deg); opacity: 1; }
        }
        @keyframes coldMistPulse {
          0% { opacity: 0.3; transform: scale(0.97); }
          100% { opacity: 0.7; transform: scale(1.03); }
        }
        @keyframes bloodAuraPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.04); }
        }
        @keyframes bloodCrack {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; box-shadow: 0 0 8px #ff0000; }
        }
        @keyframes voidOrbOrbit {
          0% { transform: translate(-50%,-50%) rotate(0deg) translateX(55px); }
          100% { transform: translate(-50%,-50%) rotate(360deg) translateX(55px); }
        }
        @keyframes voidRingPulse {
          0%, 100% { opacity: 0.2; transform: translate(-50%,-50%) scale(0.97); }
          50% { opacity: 0.5; transform: translate(-50%,-50%) scale(1.03); }
        }
        @keyframes attackIntroFade {
          0% { opacity: 0; transform: scale(0.85); }
          20% { opacity: 1; transform: scale(1.05); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.95); }
        }
        @keyframes playerIdle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes playerAttack {
          0% { transform: translateX(0); }
          30% { transform: translateX(20px) scaleX(1.05); }
          60% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        @keyframes playerRush {
          0% { transform: translateX(0) translateY(0) scale(1); }
          35% { transform: translateX(55%) translateY(-12%) scale(1.08); }
          60% { transform: translateX(45%) translateY(-8%) scale(1.05); }
          80% { transform: translateX(10%) translateY(-2%) scale(1.02); }
          100% { transform: translateX(0) translateY(0) scale(1); }
        }
        @keyframes enemyRush {
          0% { transform: translateX(0) translateY(0) scale(1); }
          35% { transform: translateX(-65%) translateY(15%) scale(1.08); }
          60% { transform: translateX(-50%) translateY(10%) scale(1.05); }
          80% { transform: translateX(-15%) translateY(3%) scale(1.02); }
          100% { transform: translateX(0) translateY(0) scale(1); }
        }
        @keyframes playerHurt {
          0%, 100% { transform: translateX(0); filter: brightness(1); }
          20% { transform: translateX(-10px); filter: brightness(4) saturate(0); }
          40% { transform: translateX(10px); filter: brightness(4) saturate(0); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes pokemonHurt {
          0%, 100% { transform: translateX(0) scale(1); filter: brightness(1); }
          25% { transform: translateX(10px) scale(0.93); filter: brightness(4) saturate(0); }
          50% { transform: translateX(-10px) scale(1.07); filter: brightness(4) saturate(0); }
          75% { transform: translateX(5px); }
        }
        @keyframes pokemonAttack {
          0% { transform: translateX(0); }
          30% { transform: translateX(-18px) scale(1.05); }
          60% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        @keyframes attackSlash {
          0% { opacity: 0; transform: scaleX(0); transform-origin: left; }
          15% { opacity: 1; transform: scaleX(1); }
          75% { opacity: 0.8; }
          100% { opacity: 0; transform: scaleX(1); }
        }
        @keyframes attackSlashV {
          0% { opacity: 0; transform: rotate(25deg) scaleY(0); transform-origin: top; }
          20% { opacity: 1; transform: rotate(25deg) scaleY(1); }
          80% { opacity: 0.6; }
          100% { opacity: 0; }
        }
        @keyframes flashFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-4px, 3px); }
          40% { transform: translate(4px, -3px); }
          60% { transform: translate(-3px, 2px); }
          80% { transform: translate(2px, -1px); }
        }
        @keyframes bossAura {
          0% { opacity: 0.4; transform: scale(0.97); }
          100% { opacity: 0.8; transform: scale(1.03); }
        }
        @keyframes orbitSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(45px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(45px); }
        }
        @keyframes shadowFloat {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-6px); opacity: 0.6; }
        }
        @keyframes attackGlow {
          0% { opacity: 0.8; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes auraGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }
        @keyframes sparkPop {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5) rotate(45deg); opacity: 0; }
        }
        @keyframes spawnPulse {
          0% { opacity: 0.4; transform: scale(0.95); }
          100% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes enemyIdleBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes battleStartReveal {
          0% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        @keyframes battleStartFlash {
          0% { opacity: 1; }
          30% { opacity: 0.9; }
          60% { opacity: 0.5; }
          85% { opacity: 0.15; }
          100% { opacity: 0; }
        }
        @keyframes battleBorderFlash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          60% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes slideInTop {
          0% { opacity: 0; transform: translateY(-30px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes vsAppear {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes gateClosedFadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes gatePortalClose {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes gatePortalCore {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Hit Sparks Effect ────────────────────────────────────────────────────────
function HitSparks({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: 60,
        height: 60,
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <div
          key={deg}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 3,
            height: 16,
            background: color,
            boxShadow: `0 0 6px ${color}`,
            borderRadius: "2px",
            transformOrigin: "bottom center",
            transform: `translate(-50%, -100%) rotate(${deg}deg)`,
            animation: "sparkPop 0.4s ease-out forwards",
            animationDelay: `${deg * 0.001}s`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 20,
          height: 20,
          background: color,
          borderRadius: "50%",
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}66`,
          transform: "translate(-50%, -50%)",
          animation: "sparkPop 0.4s ease-out forwards",
        }}
      />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function AnimeBattleScene(props: AnimeBattleSceneProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <PokemonBattleLayout {...props} />
    </div>
  );
}
