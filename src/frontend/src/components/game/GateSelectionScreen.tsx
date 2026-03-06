import { useState } from "react";

// ─── Types & Definitions ──────────────────────────────────────────────────────

export type GateRank = "E" | "D" | "C" | "B" | "A" | "S" | "SPECIAL";

export interface GateDef {
  rank: GateRank;
  color: string;
  glowColor: string;
  waves: number;
  difficulty: string;
  xpMultiplier: number;
  goldMultiplier: number;
  enemyPoolStart: number;
  label: string;
  description: string;
  emoji: string;
}

export const GATE_DEFINITIONS: GateDef[] = [
  {
    rank: "E",
    color: "#888888",
    glowColor: "#aaaaaa",
    waves: 3,
    difficulty: "Easy",
    xpMultiplier: 1,
    goldMultiplier: 1,
    enemyPoolStart: 0,
    label: "E-RANK GATE",
    description: "Low-tier dungeon. Weaklings enter here.",
    emoji: "🌑",
  },
  {
    rank: "D",
    color: "#00cc66",
    glowColor: "#00ff88",
    waves: 5,
    difficulty: "Normal",
    xpMultiplier: 1.5,
    goldMultiplier: 1.5,
    enemyPoolStart: 1,
    label: "D-RANK GATE",
    description: "Standard dungeon. Monsters have awakened.",
    emoji: "🌿",
  },
  {
    rank: "C",
    color: "#0088ff",
    glowColor: "#00aaff",
    waves: 7,
    difficulty: "Hard",
    xpMultiplier: 2,
    goldMultiplier: 2,
    enemyPoolStart: 2,
    label: "C-RANK GATE",
    description: "Dangerous territory. Prepare your skills.",
    emoji: "💧",
  },
  {
    rank: "B",
    color: "#8800cc",
    glowColor: "#aa00ff",
    waves: 8,
    difficulty: "Very Hard",
    xpMultiplier: 3,
    goldMultiplier: 3,
    enemyPoolStart: 3,
    label: "B-RANK GATE",
    description: "High-level monsters. Only the strong survive.",
    emoji: "💜",
  },
  {
    rank: "A",
    color: "#ff6600",
    glowColor: "#ff8800",
    waves: 10,
    difficulty: "Extreme",
    xpMultiplier: 4,
    goldMultiplier: 4,
    enemyPoolStart: 4,
    label: "A-RANK GATE",
    description: "National Hunter level. Death lurks within.",
    emoji: "🔥",
  },
  {
    rank: "S",
    color: "#ffdd00",
    glowColor: "#ffff44",
    waves: 12,
    difficulty: "Nightmare",
    xpMultiplier: 6,
    goldMultiplier: 6,
    enemyPoolStart: 5,
    label: "S-RANK GATE",
    description: "Elite hunters only. Boss guaranteed every wave.",
    emoji: "⭐",
  },
  {
    rank: "SPECIAL",
    color: "#ff0011",
    glowColor: "#ff4444",
    waves: 15,
    difficulty: "DEATH",
    xpMultiplier: 10,
    goldMultiplier: 10,
    enemyPoolStart: 6,
    label: "RED GATE",
    description: "No one comes back alive. You have been warned.",
    emoji: "💀",
  },
];

// ─── Portal Particle ──────────────────────────────────────────────────────────
function PortalParticle({
  angle,
  radius,
  color,
  delay,
}: {
  angle: number;
  radius: number;
  color: string;
  delay: number;
}) {
  const size = 3 + Math.random() * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        background: color,
        borderRadius: "50%",
        boxShadow: `0 0 6px ${color}`,
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`,
        animation: `gateOrbit ${2 + delay}s linear infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: "none",
        opacity: 0.8,
      }}
    />
  );
}

// ─── Gate Card ────────────────────────────────────────────────────────────────
function GateCard({
  gate,
  onSelect,
  playerLevel,
}: {
  gate: GateDef;
  onSelect: (gate: GateDef) => void;
  playerLevel: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isSpecial = gate.rank === "SPECIAL";
  const isLocked =
    (gate.rank === "A" && playerLevel < 10) ||
    (gate.rank === "S" && playerLevel < 20) ||
    (gate.rank === "SPECIAL" && playerLevel < 30);

  const particles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div
      data-ocid={`gate.${gate.rank.toLowerCase()}.card`}
      style={{
        position: "relative",
        background: isSpecial
          ? "radial-gradient(ellipse at center, rgba(200,0,20,0.25) 0%, rgba(0,0,0,0.9) 70%)"
          : `radial-gradient(ellipse at center, ${gate.color}15 0%, rgba(0,0,0,0.85) 70%)`,
        border: `2px solid ${hovered ? gate.glowColor : gate.color}${isSpecial && !hovered ? "aa" : ""}`,
        borderRadius: "16px",
        padding: "1.25rem 1rem",
        cursor: isLocked ? "not-allowed" : "pointer",
        opacity: isLocked ? 0.45 : 1,
        transition: "all 0.25s ease",
        transform:
          hovered && !isLocked ? "scale(1.04) translateY(-4px)" : "scale(1)",
        boxShadow:
          hovered && !isLocked
            ? `0 0 30px ${gate.glowColor}66, 0 0 60px ${gate.color}33, inset 0 0 20px ${gate.color}08`
            : `0 0 12px ${gate.color}22`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        overflow: "hidden",
        animation: isSpecial
          ? "specialGateFlicker 0.8s ease-in-out infinite alternate"
          : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Portal portal swirl */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "14px",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Rotating border ring */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: "16px",
            border: "2px solid transparent",
            backgroundImage: `conic-gradient(${gate.color}88, transparent, ${gate.glowColor}88, transparent, ${gate.color}88)`,
            backgroundOrigin: "border-box",
            WebkitMask:
              "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: "gateRingRotate 4s linear infinite",
          }}
        />
        {/* Floating particles */}
        {hovered &&
          particles.map((i) => (
            <PortalParticle
              key={i}
              angle={(i / particles.length) * 360}
              radius={55 + (i % 3) * 12}
              color={gate.glowColor}
              delay={i * 0.25}
            />
          ))}
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            borderRadius: "14px",
            zIndex: 10,
            gap: "0.3rem",
          }}
        >
          <div style={{ fontSize: "1.5rem" }}>🔒</div>
          <div
            style={{
              fontSize: "0.55rem",
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            LV {gate.rank === "A" ? 10 : gate.rank === "S" ? 20 : 30} REQUIRED
          </div>
        </div>
      )}

      {/* Rank letter */}
      <div
        style={{
          fontSize: isSpecial
            ? "clamp(1.8rem, 5vw, 2.8rem)"
            : "clamp(2.5rem, 6vw, 3.5rem)",
          fontWeight: 900,
          fontFamily: '"Sora", sans-serif',
          color: gate.glowColor,
          textShadow: `0 0 20px ${gate.color}, 0 0 40px ${gate.color}88`,
          lineHeight: 1,
          letterSpacing: isSpecial ? "0.02em" : "0.05em",
          zIndex: 1,
        }}
      >
        {isSpecial ? "🔴" : gate.rank}
      </div>

      {/* Rank label */}
      <div
        style={{
          fontSize: "0.55rem",
          fontFamily: '"Sora", sans-serif',
          fontWeight: 900,
          letterSpacing: "0.12em",
          color: gate.glowColor,
          textShadow: `0 0 8px ${gate.color}`,
          zIndex: 1,
        }}
      >
        {gate.label}
      </div>

      {/* Difficulty badge */}
      <div
        style={{
          padding: "3px 10px",
          background: `${gate.color}22`,
          border: `1px solid ${gate.color}66`,
          borderRadius: "20px",
          fontSize: "0.5rem",
          fontFamily: '"Sora", sans-serif',
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: gate.glowColor,
          zIndex: 1,
        }}
      >
        {gate.difficulty}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: "2px 7px",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "5px",
            fontSize: "0.48rem",
            fontFamily: '"Sora", sans-serif',
            color: "rgba(255,255,255,0.6)",
          }}
        >
          🌊 {gate.waves} Waves
        </div>
        <div
          style={{
            padding: "2px 7px",
            background: "rgba(0,0,0,0.5)",
            border: `1px solid ${gate.color}44`,
            borderRadius: "5px",
            fontSize: "0.48rem",
            fontFamily: '"Sora", sans-serif',
            color: gate.glowColor,
            fontWeight: 700,
          }}
        >
          ✨ {gate.xpMultiplier}x XP
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: "0.48rem",
          fontFamily: '"Sora", sans-serif',
          color: "rgba(255,255,255,0.4)",
          textAlign: "center",
          maxWidth: "130px",
          lineHeight: 1.4,
          zIndex: 1,
        }}
      >
        {gate.description}
      </div>

      {/* Enter button */}
      <button
        type="button"
        data-ocid={`gate.${gate.rank.toLowerCase()}.button`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLocked) onSelect(gate);
        }}
        disabled={isLocked}
        style={{
          fontFamily: '"Sora", sans-serif',
          fontWeight: 900,
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          padding: "0.45rem 1rem",
          background: isLocked
            ? "rgba(255,255,255,0.05)"
            : `linear-gradient(135deg, ${gate.color}cc, ${gate.glowColor}99)`,
          border: `1px solid ${gate.color}`,
          borderRadius: "8px",
          color: isLocked ? "rgba(255,255,255,0.2)" : "white",
          cursor: isLocked ? "not-allowed" : "pointer",
          touchAction: "manipulation",
          zIndex: 1,
          boxShadow: isLocked ? "none" : `0 0 14px ${gate.color}66`,
          transition: "all 0.15s ease",
        }}
      >
        {isSpecial ? "⚠️ ENTER" : "⚔️ ENTER GATE"}
      </button>
    </div>
  );
}

// ─── Gate Selection Screen ────────────────────────────────────────────────────
export function GateSelectionScreen({
  onGateSelected,
  onBack,
  playerLevel = 1,
}: {
  onGateSelected: (gate: GateDef) => void;
  onBack: () => void;
  playerLevel?: number;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background:
          "radial-gradient(ellipse at center, #060012 0%, #000000 70%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Sora", sans-serif',
        overflowY: "auto",
        overflowX: "hidden",
        maxWidth: "100vw",
      }}
    >
      {/* Atmospheric BG */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(circle at 15% 40%, rgba(136,0,204,0.07) 0%, transparent 45%),
            radial-gradient(circle at 85% 60%, rgba(255,0,17,0.06) 0%, transparent 45%),
            radial-gradient(circle at 50% 20%, rgba(255,221,0,0.04) 0%, transparent 35%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Scanning lines overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          padding: "1rem clamp(1rem, 4vw, 2rem) 0.75rem",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, transparent 100%)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          type="button"
          data-ocid="gate.back.button"
          onClick={onBack}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            padding: "0.5rem 1rem",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            touchAction: "manipulation",
          }}
        >
          ← BACK
        </button>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "clamp(1.2rem, 4vw, 2rem)",
              fontWeight: 900,
              letterSpacing: "0.08em",
              background:
                "linear-gradient(135deg, #ff0033 0%, #9d00ff 50%, #ffdd00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.1,
            }}
          >
            SELECT GATE
          </div>
          <div
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.3)",
              marginTop: "2px",
            }}
          >
            SOLO LEVELING DUNGEON SYSTEM · LV {playerLevel}
          </div>
        </div>
      </div>

      {/* Warning bar for SPECIAL */}
      <div
        style={{
          margin: "0.5rem clamp(1rem, 4vw, 2rem)",
          padding: "0.5rem 1rem",
          background: "rgba(255,0,17,0.08)",
          border: "1px solid rgba(255,0,17,0.3)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 1,
          animation: "warningPulse 2s ease-in-out infinite alternate",
        }}
      >
        <span style={{ fontSize: "0.9rem" }}>⚠️</span>
        <div>
          <div
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              color: "rgba(255,80,80,0.9)",
              letterSpacing: "0.08em",
            }}
          >
            GATE SYSTEM WARNING
          </div>
          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.35)" }}>
            Higher rank gates cannot be closed. Boss must be defeated to escape.
          </div>
        </div>
      </div>

      {/* Gate Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(170px, 44vw), 1fr))",
          gap: "0.85rem",
          padding: "0.5rem clamp(1rem, 4vw, 2rem) 2rem",
          zIndex: 1,
        }}
      >
        {GATE_DEFINITIONS.map((gate) => (
          <GateCard
            key={gate.rank}
            gate={gate}
            onSelect={onGateSelected}
            playerLevel={playerLevel}
          />
        ))}
      </div>

      <style>{`
        @keyframes gateRingRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gateOrbit {
          0% { opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { opacity: 0; transform: translate(-50%, -50%) rotate(360deg) translateX(var(--r, 55px)); }
        }
        @keyframes specialGateFlicker {
          0% { box-shadow: 0 0 12px rgba(255,0,17,0.3); }
          100% { box-shadow: 0 0 30px rgba(255,0,17,0.6), 0 0 60px rgba(255,0,17,0.2); }
        }
        @keyframes warningPulse {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
