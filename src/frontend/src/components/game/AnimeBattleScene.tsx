import { useEffect, useRef, useState } from "react";
import { useCharacterStore } from "./CharacterStore";
import { DungeonBackground, type DungeonBgType } from "./DungeonBackground";

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
}

// ─── Enemy Sprite Map ─────────────────────────────────────────────────────────
// CSS-drawn enemy sprites using inline styling for Pokemon GBA look
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
  const scale = isBoss ? 1.35 : 1.0;
  const smallTypes = ["goblin"];
  const effectiveScale = smallTypes.includes(type) ? scale * 0.8 : scale;
  const [imgError, setImgError] = useState(false);

  const shakeAnim = isHurt
    ? "pokemonHurt 0.3s ease-in-out"
    : isAttacking
      ? "pokemonAttack 0.4s ease-in-out"
      : "none";

  // CSS Fallback sprites for all enemy types — always use CSS
  // (image sprites may not exist; CSS sprites are reliable and look great)
  return (
    <div style={{ animation: shakeAnim }}>
      {!imgError ? (
        // Hidden img to preload; if it loads we could use it, but CSS sprite
        // is always the visible element for reliability
        <span style={{ display: "none" }}>
          <img
            src={`/assets/generated/enemy-${type}-sprite-transparent.png`}
            alt=""
            onError={() => setImgError(true)}
          />
        </span>
      ) : null}
      <CSSEnemySprite
        type={type}
        isBoss={isBoss}
        color={color}
        isHurt={isHurt}
        scale={effectiveScale}
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
  const size = Math.round(110 * scale);
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

// ─── Player Character Sprite (Pokemon-style, uses custom character config) ────
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
}) {
  // Determine if we should use generated sprite images
  const maleSprite =
    "/assets/generated/battle-hero-male-v2-transparent.dim_200x300.png";
  const femaleSprite =
    "/assets/generated/battle-hero-female-v2-transparent.dim_200x300.png";

  const [spriteLoaded, setSpriteLoaded] = useState(false);
  const [spriteError, setSpriteError] = useState(false);
  const spriteSrc = isFemale ? femaleSprite : maleSprite;

  // Pokemon-style animation
  const bounceAnim = isAttacking
    ? "playerAttack 0.5s ease-in-out"
    : isHurt
      ? "playerHurt 0.4s ease-in-out"
      : "playerIdle 2s ease-in-out infinite";

  return (
    <div
      style={{
        position: "relative",
        width: 120,
        height: 160,
        animation: bounceAnim,
        imageRendering: "pixelated",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {/* Aura glow behind character */}
      <div
        style={{
          position: "absolute",
          inset: -4,
          background: `radial-gradient(ellipse at center 80%, ${auraColor}35 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "auraGlow 2s ease-in-out infinite alternate",
        }}
      />

      {/* Sprite image */}
      {!spriteError ? (
        <img
          src={spriteSrc}
          alt="player"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            filter: isHurt
              ? "brightness(2) saturate(0)"
              : isAttacking
                ? `drop-shadow(0 0 8px ${auraColor})`
                : "none",
            display: spriteLoaded ? "block" : "none",
          }}
          onLoad={() => setSpriteLoaded(true)}
          onError={() => setSpriteError(true)}
        />
      ) : null}

      {/* CSS fallback character — shows if sprite fails to load OR while loading */}
      {(!spriteLoaded || spriteError) && (
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
    <div style={{ position: "relative", width: 80, height: 130, filter }}>
      {/* HEAD */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
          width: 34,
          height: 36,
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
          top: 34,
          width: isFemale ? 8 : 10,
          height: 8,
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
          top: 40,
          width: isFemale ? 26 : 32,
          height: isFemale ? 38 : 40,
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
          top: 41,
          width: isFemale ? 9 : 11,
          height: 32,
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
          top: 41,
          width: isFemale ? 9 : 11,
          height: 32,
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
          top: 78,
          width: isFemale ? 30 : 34,
          height: 8,
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
          marginLeft: isFemale ? -16 : -18,
          top: 84,
          width: isFemale ? 12 : 14,
          height: 30,
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
            width: 14,
            height: 10,
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
          marginLeft: isFemale ? 4 : 4,
          top: 84,
          width: isFemale ? 12 : 14,
          height: 30,
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
            width: 14,
            height: 10,
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

// ─── Pokemon GBA Battle Scene (Pure 2D, no Three.js) ─────────────────────────
function PokemonBattleLayout({
  playerAttacking,
  enemyAttacking,
  playerHurt,
  enemyHurt,
  enemyData,
  currentZone,
  attackColor,
  bgType,
}: AnimeBattleSceneProps) {
  const { config } = useCharacterStore();
  const [attackFlash, setAttackFlash] = useState<string | null>(null);
  const attackFlashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFemale = config.gender === "female";
  const auraColor = config.auraColor || "#00aaff";

  // Show attack flash effect
  useEffect(() => {
    if (playerAttacking || enemyAttacking) {
      const fc = playerAttacking ? attackColor || auraColor : "#ff0033";
      setAttackFlash(fc);
      if (attackFlashRef.current) clearTimeout(attackFlashRef.current);
      attackFlashRef.current = setTimeout(() => setAttackFlash(null), 500);
    }
  }, [playerAttacking, enemyAttacking, attackColor, auraColor]);

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

      {/* Attack flash overlay */}
      {attackFlash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `${attackFlash}22`,
            zIndex: 20,
            pointerEvents: "none",
            animation: "flashFade 0.5s ease-out forwards",
          }}
        />
      )}

      {/* ── POKEMON GBA LAYOUT ── */}
      {/* Enemy platform (top-right, elevated) */}
      <div
        style={{
          position: "absolute",
          right: "8%",
          top: "8%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
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
          /* Loading placeholder — shown during the 500ms spawn delay */
          <div
            style={{
              width: 110,
              height: 110,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,0,51,0.25)",
              borderRadius: "50%",
              animation: "spawnPulse 1s ease-in-out infinite alternate",
            }}
          >
            <div
              style={{
                fontSize: "1.8rem",
                animation: "spawnPulse 0.8s ease-in-out infinite alternate",
              }}
            >
              👾
            </div>
            <div
              style={{
                fontSize: "0.45rem",
                letterSpacing: "0.12em",
                color: "rgba(255,80,80,0.6)",
                fontFamily: '"Sora", sans-serif',
              }}
            >
              SPAWNING...
            </div>
          </div>
        )}
        {/* Enemy shadow ellipse */}
        <div
          style={{
            width: "70%",
            height: 8,
            background: "rgba(0,0,0,0.4)",
            borderRadius: "50%",
            filter: "blur(4px)",
            marginTop: -4,
          }}
        />
      </div>

      {/* Player platform (bottom-left) — raised to avoid overlap with bottom HUD */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          bottom: "38%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
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
        />
        {/* Player shadow */}
        <div
          style={{
            width: "60%",
            height: 8,
            background: "rgba(0,0,0,0.4)",
            borderRadius: "50%",
            filter: "blur(4px)",
            marginTop: -4,
          }}
        />
      </div>

      {/* Ground divide line (Pokemon style) */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }}
      />

      {/* Attack effect line (player attacks → enemy) */}
      {playerAttacking && (
        <div
          style={{
            position: "absolute",
            left: "22%",
            right: "18%",
            top: "40%",
            height: 3,
            background: `linear-gradient(90deg, transparent, ${attackColor || auraColor}, transparent)`,
            boxShadow: `0 0 12px ${attackColor || auraColor}`,
            borderRadius: "2px",
            animation: "attackLine 0.4s ease-out forwards",
            zIndex: 15,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Enemy attack effect line (enemy → player) */}
      {enemyAttacking && (
        <div
          style={{
            position: "absolute",
            left: "18%",
            right: "22%",
            top: "55%",
            height: 3,
            background:
              "linear-gradient(270deg, transparent, #ff0033, transparent)",
            boxShadow: "0 0 12px #ff0033",
            borderRadius: "2px",
            animation: "attackLine 0.4s ease-out forwards",
            zIndex: 15,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Hit sparks */}
      {(enemyHurt || playerHurt) && (
        <HitSparks
          x={enemyHurt ? 75 : 20}
          y={enemyHurt ? 30 : 55}
          color={enemyHurt ? attackColor || auraColor : "#ff0033"}
        />
      )}

      <style>{`
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
        @keyframes playerHurt {
          0%, 100% { transform: translateX(0); filter: brightness(1); }
          20% { transform: translateX(-8px); filter: brightness(3) saturate(0); }
          40% { transform: translateX(8px); filter: brightness(3) saturate(0); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes pokemonHurt {
          0%, 100% { transform: translateX(0) scale(1); filter: brightness(1); }
          25% { transform: translateX(8px) scale(0.95); filter: brightness(3) saturate(0); }
          50% { transform: translateX(-8px) scale(1.05); filter: brightness(3) saturate(0); }
          75% { transform: translateX(4px); }
        }
        @keyframes pokemonAttack {
          0% { transform: translateX(0); }
          30% { transform: translateX(-18px) scale(1.05); }
          60% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        @keyframes attackLine {
          0% { opacity: 0; transform: scaleX(0); transform-origin: left; }
          20% { opacity: 1; transform: scaleX(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: scaleX(1); }
        }
        @keyframes flashFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
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
