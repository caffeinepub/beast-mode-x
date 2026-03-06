import { useState } from "react";
import { DEFAULT_CHARACTER_CONFIG, useCharacterStore } from "./CharacterStore";

interface CharacterCreatorProps {
  open: boolean;
  onClose: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const HAIR_STYLES = [
  { label: "Spiky", icon: "⚡" },
  { label: "Long", icon: "🌊" },
  { label: "Short", icon: "✂️" },
  { label: "Ponytail", icon: "🎀" },
  { label: "Bun", icon: "🌀" },
  { label: "Mohawk", icon: "🔥" },
  { label: "Curly", icon: "🌪️" },
  { label: "Straight", icon: "➡️" },
  { label: "Twin Tails", icon: "🎀🎀" },
  { label: "Wild Messy", icon: "💥" },
  { label: "Slicked Back", icon: "🌊" },
  { label: "Undercut", icon: "✂️🔥" },
];

const HAIR_COLORS = [
  { label: "Black", value: "#1a1a1a" },
  { label: "White", value: "#ffffff" },
  { label: "Blonde", value: "#ffdd44" },
  { label: "Red", value: "#ff2244" },
  { label: "Blue", value: "#0088ff" },
  { label: "Purple", value: "#9d00ff" },
  { label: "Green", value: "#00cc66" },
  { label: "Orange", value: "#ff8800" },
  { label: "Silver", value: "#ccccdd" },
  { label: "Pink", value: "#ff66aa" },
];

const SKIN_TONES = [
  { label: "Fair", value: "#fde8d8" },
  { label: "Light", value: "#f5c5a3" },
  { label: "Medium", value: "#d4956a" },
  { label: "Tan", value: "#c68642" },
  { label: "Brown", value: "#8d5524" },
  { label: "Dark", value: "#4a2912" },
];

const EYE_COLORS = [
  { label: "Brown", value: "#6b3f2a" },
  { label: "Black", value: "#1a1a1a" },
  { label: "Blue", value: "#0088ff" },
  { label: "Green", value: "#00aa44" },
  { label: "Red", value: "#ff2244" },
  { label: "Purple", value: "#9d00ff" },
  { label: "Gold", value: "#ffaa00" },
  { label: "Silver", value: "#aaccdd" },
];

const ACCESSORIES = [
  { label: "None", icon: "✕" },
  { label: "Headband", icon: "🎽" },
  { label: "Eyepatch", icon: "🏴‍☠️" },
  { label: "Scar", icon: "⚡" },
  { label: "Face Paint", icon: "🎭" },
  { label: "Headphones", icon: "🎧" },
  { label: "Tribal Tattoo", icon: "🔮" },
  { label: "Glowing Rune", icon: "✨" },
];

const OUTFIT_STYLES = [
  { label: "Warrior", icon: "⚔️" },
  { label: "Mage", icon: "🔮" },
  { label: "Assassin", icon: "🗡️" },
  { label: "Berserker", icon: "💀" },
  { label: "Knight", icon: "🛡️" },
  { label: "Shadow", icon: "🌑" },
  { label: "Ninja", icon: "🌑" },
  { label: "Demon Hunter", icon: "🔱" },
  { label: "God-Tier", icon: "👑" },
];

const OUTFIT_COLORS = [
  { label: "Dark Blue", value: "#001133" },
  { label: "Dark Red", value: "#330011" },
  { label: "Dark Purple", value: "#0d0022" },
  { label: "Dark Green", value: "#001a0d" },
  { label: "Charcoal", value: "#111111" },
  { label: "Midnight", value: "#050510" },
];

const AURA_COLORS = [
  { label: "Blue", value: "#00aaff" },
  { label: "Red", value: "#ff2244" },
  { label: "Purple", value: "#9d00ff" },
  { label: "Gold", value: "#ffaa00" },
  { label: "Green", value: "#00ff88" },
  { label: "White", value: "#ffffff" },
];

// ─── Hair shape renderer ───────────────────────────────────────────────────────
function HairShape({
  hairStyle,
  hairColor,
  isFemale,
}: {
  hairStyle: number;
  hairColor: string;
  isFemale: boolean;
}) {
  const glow = `drop-shadow(0 0 4px ${hairColor})`;

  switch (hairStyle) {
    case 0: // Spiky
      return (
        <>
          {[-20, -10, 0, 10, 20].map((x, idx) => (
            <div
              key={x}
              style={{
                position: "absolute",
                bottom: idx % 2 === 0 ? "88%" : "82%",
                left: `calc(50% + ${x}px)`,
                transform: "translateX(-50%)",
                width: 9,
                height: idx % 2 === 0 ? 30 : 22,
                background: hairColor,
                clipPath: "polygon(50% 0%, 5% 100%, 95% 100%)",
                filter: glow,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "52%",
              background: hairColor,
              borderRadius: "50% 50% 0 0",
              filter: glow,
            }}
          />
        </>
      );

    case 1: // Long
      return (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -6,
              right: -6,
              height: "58%",
              background: hairColor,
              borderRadius: "50% 50% 0 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "48%",
              left: -10,
              width: 16,
              height: isFemale ? 130 : 110,
              background: `linear-gradient(${hairColor}ee, ${hairColor}44, transparent)`,
              borderRadius: "0 0 8px 50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "48%",
              right: -10,
              width: 16,
              height: isFemale ? 120 : 100,
              background: `linear-gradient(${hairColor}ee, ${hairColor}44, transparent)`,
              borderRadius: "0 0 50% 8px",
            }}
          />
          {isFemale && (
            <div
              style={{
                position: "absolute",
                top: "60%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 90,
                background: `linear-gradient(${hairColor}cc, transparent)`,
                borderRadius: "0 0 4px 4px",
              }}
            />
          )}
        </>
      );

    case 2: // Short
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: -4,
            right: -4,
            height: "46%",
            background: hairColor,
            borderRadius: "50% 50% 0 0",
            filter: glow,
          }}
        />
      );

    case 3: // Ponytail
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
              top: "8%",
              right: -8,
              width: 13,
              height: 95,
              background: `linear-gradient(${hairColor}, ${hairColor}88, transparent)`,
              borderRadius: "0 20px 20px 0",
              transform: "rotate(12deg)",
            }}
          />
        </>
      );

    case 4: // Bun
      return (
        <>
          <div
            style={{
              position: "absolute",
              top: 2,
              left: 0,
              right: 0,
              height: "45%",
              background: hairColor,
              borderRadius: "50% 50% 0 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-18%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 28,
              height: 28,
              background: hairColor,
              borderRadius: "50%",
              boxShadow: `0 0 8px ${hairColor}`,
            }}
          />
        </>
      );

    case 5: // Mohawk
      return (
        <>
          <div
            style={{
              position: "absolute",
              top: "-24%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 18,
              height: 46,
              background: hairColor,
              clipPath: "polygon(50% 0%, 5% 100%, 95% 100%)",
              filter: `drop-shadow(0 0 8px ${hairColor})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "4%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 18,
              height: "42%",
              background: hairColor,
              borderRadius: "2px 2px 0 0",
            }}
          />
          {/* Shaved sides */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: 0,
              width: "28%",
              height: "55%",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "0 0 0 4px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: 0,
              width: "28%",
              height: "55%",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "0 0 4px 0",
            }}
          />
        </>
      );

    case 6: // Curly
      return (
        <>
          {[-18, -6, 6, 18].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                top: "-10%",
                left: `calc(50% + ${x}px)`,
                transform: "translateX(-50%)",
                width: 16,
                height: 16,
                background: hairColor,
                borderRadius: "50%",
                filter: glow,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -6,
              right: -6,
              height: "55%",
              background: hairColor,
              borderRadius: "50% 50% 0 0",
            }}
          />
          {/* Curly tufts on sides */}
          {[-38, 30].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                top: "30%",
                left: `calc(50% + ${x}px)`,
                transform: "translateX(-50%)",
                width: 14,
                height: 20,
                background: hairColor,
                borderRadius: "50%",
              }}
            />
          ))}
        </>
      );

    case 7: // Straight
      return (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -4,
              right: -4,
              height: "48%",
              background: hairColor,
              borderRadius: "6px 6px 0 0",
            }}
          />
          {/* Straight side strands */}
          <div
            style={{
              position: "absolute",
              top: "44%",
              left: -8,
              width: 14,
              height: 70,
              background: `linear-gradient(${hairColor}, transparent)`,
              borderRadius: "0 0 0 4px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "44%",
              right: -8,
              width: 14,
              height: 70,
              background: `linear-gradient(${hairColor}, transparent)`,
              borderRadius: "0 0 4px 0",
            }}
          />
        </>
      );

    case 8: // Twin Tails
      return (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -2,
              right: -2,
              height: "48%",
              background: hairColor,
              borderRadius: "50% 50% 0 0",
            }}
          />
          {/* Left twin tail */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: -14,
              width: 14,
              height: 110,
              background: `linear-gradient(${hairColor}ff, ${hairColor}88, transparent)`,
              borderRadius: "8px 0 8px 50%",
              transform: "rotate(-8deg)",
            }}
          />
          {/* Right twin tail */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              right: -14,
              width: 14,
              height: 110,
              background: `linear-gradient(${hairColor}ff, ${hairColor}88, transparent)`,
              borderRadius: "0 8px 50% 8px",
              transform: "rotate(8deg)",
            }}
          />
          {/* Hair ties */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: -12,
              width: 10,
              height: 8,
              background: "#ff66aa",
              borderRadius: "4px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30%",
              right: -12,
              width: 10,
              height: 8,
              background: "#ff66aa",
              borderRadius: "4px",
            }}
          />
        </>
      );

    case 9: // Wild Messy
      return (
        <>
          {[-24, -14, -4, 6, 16, 24, 10].map((x, idx) => (
            <div
              key={`spike-${x}`}
              style={{
                position: "absolute",
                bottom: idx % 2 === 0 ? "85%" : "80%",
                left: `calc(50% + ${x}px)`,
                transform: `translateX(-50%) rotate(${(idx - 3) * 15}deg)`,
                width: 8 + (idx % 3) * 3,
                height: 20 + (idx % 3) * 8,
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
              left: -8,
              right: -8,
              height: "55%",
              background: hairColor,
              borderRadius: "50% 50% 0 0",
              filter: glow,
            }}
          />
        </>
      );

    case 10: // Slicked Back
      return (
        <>
          {/* Main slicked-back cap */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -4,
              right: -4,
              height: "50%",
              background: hairColor,
              borderRadius: "50% 50% 0 0",
            }}
          />
          {/* Wave ridge at top */}
          <div
            style={{
              position: "absolute",
              top: "-6%",
              left: "10%",
              right: "10%",
              height: "22%",
              background: hairColor,
              borderRadius: "50%",
              filter: glow,
            }}
          />
          {/* Side tuck lines */}
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "2%",
              width: "16%",
              height: "4px",
              background: `${hairColor}aa`,
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "28%",
              left: "2%",
              width: "12%",
              height: "3px",
              background: `${hairColor}66`,
              borderRadius: "2px",
            }}
          />
        </>
      );

    case 11: // Undercut
      return (
        <>
          {/* Tall dramatic top section */}
          <div
            style={{
              position: "absolute",
              top: "-18%",
              left: "20%",
              right: "20%",
              height: "60%",
              background: hairColor,
              borderRadius: "8px 8px 0 0",
              filter: glow,
            }}
          />
          {/* Short side coverage */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: 0,
              right: 0,
              height: "38%",
              background: hairColor,
              borderRadius: "0",
            }}
          />
          {/* Hard undercut line */}
          <div
            style={{
              position: "absolute",
              top: "44%",
              left: 0,
              right: 0,
              height: "3px",
              background: "rgba(0,0,0,0.5)",
            }}
          />
        </>
      );

    default:
      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: -4,
            right: -4,
            height: "45%",
            background: hairColor,
            borderRadius: "50% 50% 0 0",
            filter: glow,
          }}
        />
      );
  }
}

// ─── Body shape based on outfit ───────────────────────────────────────────────
function OutfitDetails({
  outfitStyle,
  outfitColor,
  auraColor,
  isFemale,
}: {
  outfitStyle: number;
  outfitColor: string;
  auraColor: string;
  isFemale: boolean;
}) {
  const label = OUTFIT_STYLES[outfitStyle]?.label ?? "Warrior";

  return (
    <>
      {/* Chest emblem */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 18,
          height: 18,
          background: `radial-gradient(${auraColor}90, transparent)`,
          borderRadius: "50%",
          border: `1px solid ${auraColor}`,
          boxShadow: `0 0 10px ${auraColor}`,
        }}
      />

      {/* Collar/neckline detail */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: "16%",
          background: `${auraColor}22`,
          borderRadius: "0 0 8px 8px",
          borderBottom: `1px solid ${auraColor}50`,
        }}
      />

      {/* Shoulder pauldrons for Warrior/Knight/Berserker */}
      {(label === "Warrior" || label === "Knight" || label === "Berserker") && (
        <>
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "-12px",
              width: 18,
              height: 14,
              background: auraColor,
              borderRadius: "6px 6px 0 0",
              opacity: 0.85,
              boxShadow: `0 0 6px ${auraColor}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-6px",
              right: "-12px",
              width: 18,
              height: 14,
              background: auraColor,
              borderRadius: "6px 6px 0 0",
              opacity: 0.85,
              boxShadow: `0 0 6px ${auraColor}`,
            }}
          />
        </>
      )}

      {/* Cape for Mage/Shadow/God-Tier */}
      {(label === "Mage" || label === "Shadow" || label === "God-Tier") && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-10px",
            right: "-10px",
            bottom: "-30px",
            background: `linear-gradient(${auraColor}44, ${auraColor}11, transparent)`,
            clipPath:
              "polygon(10% 0%, 90% 0%, 100% 30%, 115% 100%, -15% 100%, 0% 30%)",
            borderRadius: "0 0 20px 20px",
            zIndex: -1,
          }}
        />
      )}

      {/* Hood hint for Assassin/Ninja */}
      {(label === "Assassin" || label === "Ninja") && (
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "0%",
            right: "0%",
            height: "18%",
            background: outfitColor,
            borderRadius: "6px 6px 0 0",
            border: `1px solid ${auraColor}40`,
            opacity: 0.9,
          }}
        />
      )}

      {/* Asymmetric armor for Demon Hunter */}
      {label === "Demon Hunter" && (
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: "-12px",
            width: 22,
            height: 20,
            background: auraColor,
            borderRadius: "6px",
            opacity: 0.9,
            boxShadow: `0 0 8px ${auraColor}`,
          }}
        />
      )}

      {/* Crown for God-Tier */}
      {label === "God-Tier" && (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "0.75rem",
          }}
        >
          👑
        </div>
      )}

      {/* Belt */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: 0,
          right: 0,
          height: "8%",
          background: `${auraColor}44`,
          borderTop: `1px solid ${auraColor}60`,
          borderBottom: `1px solid ${auraColor}60`,
        }}
      />

      {/* Belt buckle */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 8,
          height: 8,
          background: auraColor,
          borderRadius: "2px",
          boxShadow: `0 0 6px ${auraColor}`,
        }}
      />

      {/* Female chest plate elegance */}
      {isFemale && (
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "15%",
            right: "15%",
            height: "30%",
            background: `${auraColor}18`,
            borderRadius: "0 0 40% 40%",
            border: `1px solid ${auraColor}30`,
          }}
        />
      )}
    </>
  );
}

// ─── Accessory renderer ───────────────────────────────────────────────────────
function AccessoryRenderer({
  accessory,
  auraColor,
  hairColor,
}: {
  accessory: number;
  auraColor: string;
  hairColor: string;
}) {
  switch (accessory) {
    case 1: // Headband
      return (
        <div
          style={{
            position: "absolute",
            top: "28%",
            left: -4,
            right: -4,
            height: 10,
            background: `linear-gradient(90deg, ${auraColor}cc, ${hairColor}cc, ${auraColor}cc)`,
            borderRadius: "2px",
            boxShadow: `0 0 6px ${auraColor}`,
          }}
        />
      );
    case 2: // Eyepatch
      return (
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "12%",
            width: 22,
            height: 16,
            background: "#111",
            border: `2px solid ${hairColor}`,
            borderRadius: "3px",
          }}
        />
      );
    case 3: // Scar
      return (
        <div
          style={{
            position: "absolute",
            top: "34%",
            left: "50%",
            transform: "translateX(-50%) rotate(15deg)",
            width: 3,
            height: 28,
            background: "#ff3333",
            borderRadius: "2px",
            opacity: 0.85,
          }}
        />
      );
    case 4: // Face Paint
      return (
        <>
          <div
            style={{
              position: "absolute",
              top: "28%",
              left: "15%",
              width: 8,
              height: 26,
              background: auraColor,
              borderRadius: "4px",
              opacity: 0.75,
              transform: "rotate(-12deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "28%",
              right: "15%",
              width: 8,
              height: 26,
              background: auraColor,
              borderRadius: "4px",
              opacity: 0.75,
              transform: "rotate(12deg)",
            }}
          />
        </>
      );
    case 5: // Headphones
      return (
        <>
          {/* Left cup */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: -10,
              width: 14,
              height: 18,
              background: "#222",
              border: `2px solid ${auraColor}`,
              borderRadius: "50%",
              boxShadow: `0 0 6px ${auraColor}`,
            }}
          />
          {/* Right cup */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              right: -10,
              width: 14,
              height: 18,
              background: "#222",
              border: `2px solid ${auraColor}`,
              borderRadius: "50%",
              boxShadow: `0 0 6px ${auraColor}`,
            }}
          />
          {/* Band over top */}
          <div
            style={{
              position: "absolute",
              top: "2%",
              left: "8%",
              right: "8%",
              height: "28%",
              border: `2px solid ${auraColor}88`,
              borderBottom: "none",
              borderRadius: "50% 50% 0 0",
            }}
          />
        </>
      );
    case 6: // Tribal Tattoo
      return (
        <>
          <div
            style={{
              position: "absolute",
              top: "44%",
              right: "16%",
              width: 10,
              height: 10,
              background: "transparent",
              border: `2px solid ${auraColor}`,
              borderRadius: "50%",
              boxShadow: `0 0 4px ${auraColor}, inset 0 0 4px ${auraColor}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "14%",
              width: 3,
              height: 16,
              background: `linear-gradient(${auraColor}, transparent)`,
              borderRadius: "2px",
            }}
          />
        </>
      );
    case 7: // Glowing Rune
      return (
        <div
          style={{
            position: "absolute",
            top: "16%",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 12,
            height: 12,
            background: auraColor,
            borderRadius: "2px",
            boxShadow: `0 0 12px ${auraColor}, 0 0 24px ${auraColor}66`,
            opacity: 0.9,
          }}
        />
      );
    default:
      return null;
  }
}

// ─── Boot renderer ────────────────────────────────────────────────────────────
function LegWithBoot({
  width,
  height,
  outfitColor,
  auraColor,
  isFemale,
}: {
  width: number;
  height: number;
  outfitColor: string;
  auraColor: string;
  isFemale: boolean;
}) {
  const legH = height * 0.72;
  const bootH = height * 0.28;
  const bootColor = "#0d0d0d";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
      }}
    >
      {/* Leg */}
      <div
        style={{
          width,
          height: legH,
          background: outfitColor,
          borderRadius: "0",
          border: `1px solid ${auraColor}30`,
          filter: "brightness(0.85)",
        }}
      />
      {/* Boot */}
      <div
        style={{
          width: isFemale ? width : width + 2,
          height: bootH,
          background: bootColor,
          borderRadius: "0 0 4px 4px",
          border: `1px solid ${auraColor}40`,
          boxShadow: `0 0 4px ${auraColor}20`,
          marginLeft: isFemale ? 0 : -1,
          // Heeled boot for female
          ...(isFemale
            ? {
                clipPath: "polygon(0 0, 100% 0, 100% 70%, 80% 100%, 0% 100%)",
              }
            : {}),
        }}
      />
    </div>
  );
}

// ─── Mini Preview Character (CSS-based anime 2D) ───────────────────────────────
function CharacterPreview() {
  const { config } = useCharacterStore();
  const {
    skinTone,
    hairColor,
    outfitColor,
    eyeColor,
    auraColor,
    hairStyle,
    gender,
    bodyType,
    accessory,
    outfitStyle,
    characterName,
  } = config;

  const isFemale = gender === "female";
  const bodyWidth =
    bodyType === "slim" ? 52 : bodyType === "athletic" ? 64 : 78;
  const bodyHeight =
    bodyType === "slim" ? 96 : bodyType === "athletic" ? 88 : 86;

  // Hip ratio for female
  const hipWidth = isFemale ? Math.round(bodyWidth * 1.15) : bodyWidth;

  const legWidth = isFemale ? 24 : 28;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "380px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "16px",
      }}
    >
      {/* Aura glow background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 55% 75% at 50% 65%, ${auraColor}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      {/* Floor shadow */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "110px",
          height: "24px",
          background: `radial-gradient(ellipse, ${auraColor}50 0%, transparent 70%)`,
          filter: "blur(6px)",
        }}
      />

      {/* Character body */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Head */}
        <div
          style={{
            position: "relative",
            width: 70,
            height: 80,
            background: skinTone,
            borderRadius: isFemale
              ? "46% 46% 42% 42% / 50% 50% 40% 40%"
              : "44% 44% 38% 38% / 48% 48% 36% 36%",
            boxShadow: `0 0 14px ${auraColor}35`,
            zIndex: 2,
            overflow: "visible",
          }}
        >
          {/* Hair */}
          <HairShape
            hairStyle={hairStyle}
            hairColor={hairColor}
            isFemale={isFemale}
          />

          {/* Eyebrows */}
          <div
            style={{
              position: "absolute",
              top: "32%",
              left: "18%",
              width: 14,
              height: 3,
              background: hairColor,
              borderRadius: "2px",
              transform: isFemale ? "rotate(-5deg)" : "rotate(-8deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "32%",
              right: "18%",
              width: 14,
              height: 3,
              background: hairColor,
              borderRadius: "2px",
              transform: isFemale ? "rotate(5deg)" : "rotate(8deg)",
            }}
          />

          {/* Left eye */}
          <div
            style={{
              position: "absolute",
              top: "43%",
              left: "16%",
              width: 15,
              height: isFemale ? 13 : 11,
              background: "#111",
              borderRadius: isFemale ? "50% 50% 40% 40%" : "3px",
              overflow: "hidden",
              boxShadow: `0 0 5px ${eyeColor}66`,
            }}
          >
            {/* Iris */}
            <div
              style={{
                position: "absolute",
                inset: "1px",
                background: eyeColor,
                borderRadius: isFemale ? "50% 50% 40% 40%" : "2px",
                boxShadow: `0 0 6px ${eyeColor}`,
              }}
            />
            {/* Pupil */}
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "30%",
                width: 5,
                height: 5,
                background: "#000",
                borderRadius: "50%",
              }}
            />
            {/* Catchlight */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: "55%",
                width: 3,
                height: 3,
                background: "#ffffff",
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Right eye */}
          <div
            style={{
              position: "absolute",
              top: "43%",
              right: "16%",
              width: 15,
              height: isFemale ? 13 : 11,
              background: "#111",
              borderRadius: isFemale ? "50% 50% 40% 40%" : "3px",
              overflow: "hidden",
              boxShadow: `0 0 5px ${eyeColor}66`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "1px",
                background: eyeColor,
                borderRadius: isFemale ? "50% 50% 40% 40%" : "2px",
                boxShadow: `0 0 6px ${eyeColor}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "30%",
                width: 5,
                height: 5,
                background: "#000",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: "55%",
                width: 3,
                height: 3,
                background: "#ffffff",
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Nose */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 2,
              height: 8,
              background: `${skinTone}`,
              borderRadius: "1px",
              boxShadow: "1px 1px 0 rgba(0,0,0,0.15)",
            }}
          />
          {/* Nose tip dots */}
          <div
            style={{
              position: "absolute",
              top: "72%",
              left: "42%",
              width: 3,
              height: 2,
              background: "rgba(0,0,0,0.15)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "72%",
              left: "56%",
              width: 3,
              height: 2,
              background: "rgba(0,0,0,0.15)",
              borderRadius: "50%",
            }}
          />

          {/* Lips */}
          <div
            style={{
              position: "absolute",
              bottom: "16%",
              left: "50%",
              transform: "translateX(-50%)",
              width: isFemale ? 16 : 12,
              height: isFemale ? 4 : 3,
              background: isFemale ? "#e88" : `${skinTone}`,
              borderRadius: "50%",
              boxShadow: isFemale ? "0 0 3px #e8888866" : "none",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          />

          {/* Cheekbone highlight */}
          <div
            style={{
              position: "absolute",
              top: "48%",
              left: "8%",
              width: 10,
              height: 6,
              background: isFemale ? "rgba(255,160,160,0.18)" : "transparent",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "48%",
              right: "8%",
              width: 10,
              height: 6,
              background: isFemale ? "rgba(255,160,160,0.18)" : "transparent",
              borderRadius: "50%",
            }}
          />

          {/* Accessory */}
          <AccessoryRenderer
            accessory={accessory}
            auraColor={auraColor}
            hairColor={hairColor}
          />
        </div>

        {/* Neck */}
        <div
          style={{
            width: isFemale ? 14 : 18,
            height: 14,
            background: skinTone,
            zIndex: 1,
            marginTop: -2,
          }}
        />

        {/* Shoulders + Torso + Arms */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: 0,
            zIndex: 2,
            marginTop: -2,
          }}
        >
          {/* Left arm */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <div
              style={{
                width: isFemale ? 15 : 18,
                height: bodyHeight * 0.68,
                background: outfitColor,
                borderRadius: "0 0 6px 6px",
                border: `1px solid ${auraColor}40`,
                boxShadow: `0 0 6px ${auraColor}15`,
              }}
            />
            {/* Left hand */}
            <div
              style={{
                width: isFemale ? 11 : 14,
                height: 9,
                background: skinTone,
                borderRadius: "3px 3px 4px 4px",
                marginTop: 1,
              }}
            />
          </div>

          {/* Body */}
          <div
            style={{
              width: bodyWidth,
              height: bodyHeight,
              background: outfitColor,
              border: `2px solid ${auraColor}60`,
              boxShadow: `0 0 16px ${auraColor}28, inset 0 0 18px ${auraColor}10`,
              position: "relative",
              borderRadius: isFemale
                ? "8px 8px 18px 18px"
                : "5px 5px 10px 10px",
              overflow: "visible",
            }}
          >
            <OutfitDetails
              outfitStyle={outfitStyle}
              outfitColor={outfitColor}
              auraColor={auraColor}
              isFemale={isFemale}
            />
          </div>

          {/* Right arm */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <div
              style={{
                width: isFemale ? 15 : 18,
                height: bodyHeight * 0.68,
                background: outfitColor,
                borderRadius: "0 0 6px 6px",
                border: `1px solid ${auraColor}40`,
                boxShadow: `0 0 6px ${auraColor}15`,
              }}
            />
            {/* Right hand */}
            <div
              style={{
                width: isFemale ? 11 : 14,
                height: 9,
                background: skinTone,
                borderRadius: "3px 3px 4px 4px",
                marginTop: 1,
              }}
            />
          </div>
        </div>

        {/* Hip area (wider for female) */}
        <div
          style={{
            width: hipWidth + 4,
            height: 12,
            background: outfitColor,
            border: `1px solid ${auraColor}40`,
            borderRadius: "0 0 4px 4px",
            marginTop: -2,
          }}
        />

        {/* Legs */}
        <div style={{ display: "flex", gap: isFemale ? 6 : 8 }}>
          <LegWithBoot
            width={legWidth}
            height={82}
            outfitColor={outfitColor}
            auraColor={auraColor}
            isFemale={isFemale}
          />
          <LegWithBoot
            width={legWidth}
            height={82}
            outfitColor={outfitColor}
            auraColor={auraColor}
            isFemale={isFemale}
          />
        </div>
      </div>

      {/* Character name label */}
      <div
        style={{
          marginTop: 10,
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: auraColor,
          textShadow: `0 0 10px ${auraColor}, 0 0 20px ${auraColor}66`,
          textTransform: "uppercase",
          textAlign: "center",
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {characterName || "BEAST WARRIOR"}
      </div>
      <div
        style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.52rem",
          letterSpacing: "0.15em",
          color: `${auraColor}88`,
          marginTop: 2,
        }}
      >
        {isFemale ? "♀" : "♂"} {OUTFIT_STYLES[outfitStyle]?.label}
      </div>
    </div>
  );
}

// ─── Tab Content ──────────────────────────────────────────────────────────────
type TabId = "gender" | "hair" | "face" | "outfit";

function ColorCircle({
  value,
  selected,
  onClick,
  label,
}: {
  value: string;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: value,
        border: selected
          ? "3px solid #ffffff"
          : "2px solid rgba(255,255,255,0.15)",
        cursor: "pointer",
        boxShadow: selected ? `0 0 12px ${value}, 0 0 20px ${value}80` : "none",
        transition: "all 0.15s",
        flexShrink: 0,
        touchAction: "manipulation",
        padding: 0,
      }}
    />
  );
}

export function CharacterCreator({ open, onClose }: CharacterCreatorProps) {
  const { config, setConfig, resetConfig } = useCharacterStore();
  const [activeTab, setActiveTab] = useState<TabId>("gender");

  if (!open) return null;

  const labelStyle: React.CSSProperties = {
    fontFamily: '"Sora", sans-serif',
    fontSize: "0.6rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "0.5rem",
    display: "block",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: "1.25rem",
  };

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "gender", label: "BODY", icon: "⚧" },
    { id: "hair", label: "HAIR", icon: "✂️" },
    { id: "face", label: "FACE", icon: "👁" },
    { id: "outfit", label: "OUTFIT", icon: "🎽" },
  ];

  return (
    <div
      data-ocid="character.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(16px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Sora", sans-serif',
        padding:
          "env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "880px",
          maxHeight: "95vh",
          background: "rgba(6, 4, 18, 0.98)",
          border: "1px solid rgba(157, 0, 255, 0.4)",
          borderRadius: "16px",
          boxShadow:
            "0 0 60px rgba(157,0,255,0.15), 0 0 120px rgba(255,0,51,0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(157,0,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(157,0,255,0.06)",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                color: "rgba(157,0,255,0.7)",
                marginBottom: "2px",
              }}
            >
              BEAST MODE LEVEL X
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                background:
                  "linear-gradient(135deg, #ff0033, #9d00ff, #00ffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              🎨 CHARACTER CREATOR
            </div>
          </div>
          <button
            type="button"
            data-ocid="character.close_button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: "0.5rem 0.75rem",
              fontSize: "0.75rem",
              fontFamily: '"Sora", sans-serif',
              touchAction: "manipulation",
              minHeight: "44px",
              minWidth: "44px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body — 2 columns on desktop, stack on mobile */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            minHeight: 0,
          }}
          className="flex-col-mobile"
        >
          {/* Preview panel */}
          <div
            style={{
              width: "290px",
              flexShrink: 0,
              borderRight: "1px solid rgba(157,0,255,0.15)",
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            className="preview-panel"
          >
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "0.5rem",
              }}
            >
              LIVE PREVIEW
            </div>
            <CharacterPreview />
          </div>

          {/* Options panel */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              minWidth: 0,
            }}
          >
            {/* CHARACTER NAME INPUT — above all tabs */}
            <div style={{ ...sectionStyle, marginBottom: "1rem" }}>
              <label style={labelStyle} htmlFor="char-name-input">
                CHARACTER NAME
              </label>
              <input
                id="char-name-input"
                data-ocid="character.name.input"
                type="text"
                maxLength={20}
                value={config.characterName ?? "BEAST WARRIOR"}
                onChange={(e) =>
                  setConfig({ characterName: e.target.value.toUpperCase() })
                }
                placeholder="BEAST WARRIOR"
                style={{
                  width: "100%",
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  padding: "0.6rem 0.9rem",
                  background: "rgba(0,0,0,0.5)",
                  border: `1px solid ${config.auraColor}60`,
                  borderRadius: "8px",
                  color: config.auraColor,
                  outline: "none",
                  boxSizing: "border-box",
                  boxShadow: `0 0 10px ${config.auraColor}20`,
                  textTransform: "uppercase",
                }}
              />
            </div>

            {/* Tab buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.4rem",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-ocid={`character.${tab.id}.tab`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      padding: "0.45rem 0.9rem",
                      borderRadius: "6px",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(255,0,51,0.3), rgba(157,0,255,0.3))"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(157,0,255,0.6)"
                        : "1px solid rgba(255,255,255,0.12)",
                      color: isActive ? "white" : "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      boxShadow: isActive
                        ? "0 0 12px rgba(157,0,255,0.3)"
                        : "none",
                      transition: "all 0.15s",
                      touchAction: "manipulation",
                      minHeight: "36px",
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                );
              })}
            </div>

            {/* GENDER & BODY Tab */}
            {activeTab === "gender" && (
              <div>
                <div style={sectionStyle}>
                  <span style={labelStyle}>GENDER</span>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        data-ocid="character.gender.toggle"
                        onClick={() => setConfig({ gender: g })}
                        style={{
                          flex: 1,
                          fontFamily: '"Sora", sans-serif',
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          letterSpacing: "0.1em",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          background:
                            config.gender === g
                              ? "linear-gradient(135deg, rgba(255,0,51,0.25), rgba(157,0,255,0.25))"
                              : "rgba(0,0,0,0.3)",
                          border:
                            config.gender === g
                              ? "2px solid rgba(157,0,255,0.7)"
                              : "1px solid rgba(255,255,255,0.1)",
                          color:
                            config.gender === g
                              ? "white"
                              : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          boxShadow:
                            config.gender === g
                              ? "0 0 16px rgba(157,0,255,0.3)"
                              : "none",
                          transition: "all 0.15s",
                          touchAction: "manipulation",
                          minHeight: "52px",
                        }}
                      >
                        {g === "male" ? "♂ MALE" : "♀ FEMALE"}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={sectionStyle}>
                  <span style={labelStyle}>BODY TYPE</span>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    {(["slim", "athletic", "strong"] as const).map((bt) => (
                      <button
                        key={bt}
                        type="button"
                        data-ocid="character.body.toggle"
                        onClick={() => setConfig({ bodyType: bt })}
                        style={{
                          flex: 1,
                          fontFamily: '"Sora", sans-serif',
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          letterSpacing: "0.08em",
                          padding: "0.6rem 0.5rem",
                          borderRadius: "6px",
                          background:
                            config.bodyType === bt
                              ? "rgba(0,170,255,0.15)"
                              : "rgba(0,0,0,0.3)",
                          border:
                            config.bodyType === bt
                              ? "2px solid rgba(0,170,255,0.6)"
                              : "1px solid rgba(255,255,255,0.1)",
                          color:
                            config.bodyType === bt
                              ? "#00aaff"
                              : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          touchAction: "manipulation",
                          textTransform: "uppercase",
                          minHeight: "44px",
                        }}
                      >
                        {bt === "slim"
                          ? "🏃 Slim"
                          : bt === "athletic"
                            ? "⚡ Athletic"
                            : "💪 Strong"}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={sectionStyle}>
                  <span style={labelStyle}>AURA COLOR</span>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {AURA_COLORS.map((c) => (
                      <ColorCircle
                        key={c.value}
                        value={c.value}
                        label={c.label}
                        selected={config.auraColor === c.value}
                        onClick={() => setConfig({ auraColor: c.value })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* HAIR Tab */}
            {activeTab === "hair" && (
              <div>
                <div style={sectionStyle}>
                  <span style={labelStyle}>HAIR STYLE</span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "0.5rem",
                    }}
                  >
                    {HAIR_STYLES.map((hs, i) => (
                      <button
                        key={hs.label}
                        type="button"
                        data-ocid="character.hair.toggle"
                        onClick={() => setConfig({ hairStyle: i })}
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.52rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          padding: "0.55rem 0.25rem",
                          borderRadius: "6px",
                          background:
                            config.hairStyle === i
                              ? "rgba(0,255,255,0.12)"
                              : "rgba(0,0,0,0.3)",
                          border:
                            config.hairStyle === i
                              ? "2px solid rgba(0,255,255,0.6)"
                              : "1px solid rgba(255,255,255,0.1)",
                          color:
                            config.hairStyle === i
                              ? "#00ffff"
                              : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "3px",
                          transition: "all 0.15s",
                          touchAction: "manipulation",
                          minHeight: "52px",
                        }}
                      >
                        <span style={{ fontSize: "0.9rem" }}>{hs.icon}</span>
                        <span>{hs.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={sectionStyle}>
                  <span style={labelStyle}>HAIR COLOR</span>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {HAIR_COLORS.map((c) => (
                      <ColorCircle
                        key={c.value}
                        value={c.value}
                        label={c.label}
                        selected={config.hairColor === c.value}
                        onClick={() => setConfig({ hairColor: c.value })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FACE Tab */}
            {activeTab === "face" && (
              <div>
                <div style={sectionStyle}>
                  <span style={labelStyle}>SKIN TONE</span>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {SKIN_TONES.map((c) => (
                      <ColorCircle
                        key={c.value}
                        value={c.value}
                        label={c.label}
                        selected={config.skinTone === c.value}
                        onClick={() => setConfig({ skinTone: c.value })}
                      />
                    ))}
                  </div>
                </div>

                <div style={sectionStyle}>
                  <span style={labelStyle}>EYE COLOR</span>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {EYE_COLORS.map((c) => (
                      <ColorCircle
                        key={c.value}
                        value={c.value}
                        label={c.label}
                        selected={config.eyeColor === c.value}
                        onClick={() => setConfig({ eyeColor: c.value })}
                      />
                    ))}
                  </div>
                </div>

                <div style={sectionStyle}>
                  <span style={labelStyle}>ACCESSORY</span>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {ACCESSORIES.map((a, i) => (
                      <button
                        key={a.label}
                        type="button"
                        data-ocid="character.accessory.toggle"
                        onClick={() => setConfig({ accessory: i })}
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.55rem",
                          fontWeight: 600,
                          padding: "0.5rem 0.65rem",
                          borderRadius: "6px",
                          background:
                            config.accessory === i
                              ? "rgba(255,170,0,0.12)"
                              : "rgba(0,0,0,0.3)",
                          border:
                            config.accessory === i
                              ? "2px solid rgba(255,170,0,0.6)"
                              : "1px solid rgba(255,255,255,0.1)",
                          color:
                            config.accessory === i
                              ? "#ffaa00"
                              : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "2px",
                          transition: "all 0.15s",
                          touchAction: "manipulation",
                          minHeight: "52px",
                          minWidth: "60px",
                        }}
                      >
                        <span style={{ fontSize: "0.85rem" }}>{a.icon}</span>
                        <span>{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* OUTFIT & AURA Tab */}
            {activeTab === "outfit" && (
              <div>
                <div style={sectionStyle}>
                  <span style={labelStyle}>OUTFIT STYLE</span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "0.5rem",
                    }}
                  >
                    {OUTFIT_STYLES.map((os, i) => (
                      <button
                        key={os.label}
                        type="button"
                        data-ocid="character.outfit.toggle"
                        onClick={() => setConfig({ outfitStyle: i })}
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.58rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          padding: "0.6rem 0.35rem",
                          borderRadius: "6px",
                          background:
                            config.outfitStyle === i
                              ? "rgba(255,0,51,0.12)"
                              : "rgba(0,0,0,0.3)",
                          border:
                            config.outfitStyle === i
                              ? "2px solid rgba(255,0,51,0.6)"
                              : "1px solid rgba(255,255,255,0.1)",
                          color:
                            config.outfitStyle === i
                              ? "#ff0033"
                              : "rgba(255,255,255,0.4)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.15s",
                          touchAction: "manipulation",
                          minHeight: "56px",
                        }}
                      >
                        <span style={{ fontSize: "1.1rem" }}>{os.icon}</span>
                        <span>{os.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={sectionStyle}>
                  <span style={labelStyle}>OUTFIT COLOR</span>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {OUTFIT_COLORS.map((c) => (
                      <ColorCircle
                        key={c.value}
                        value={c.value === "#111111" ? "#333333" : c.value}
                        label={c.label}
                        selected={config.outfitColor === c.value}
                        onClick={() => setConfig({ outfitColor: c.value })}
                      />
                    ))}
                  </div>
                </div>

                <div style={sectionStyle}>
                  <span style={labelStyle}>AURA COLOR</span>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {AURA_COLORS.map((c) => (
                      <ColorCircle
                        key={c.value}
                        value={c.value}
                        label={c.label}
                        selected={config.auraColor === c.value}
                        onClick={() => setConfig({ auraColor: c.value })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(157,0,255,0.2)",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
            background: "rgba(0,0,0,0.3)",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            data-ocid="character.reset.button"
            onClick={resetConfig}
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              padding: "0.65rem 1.25rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              touchAction: "manipulation",
              minHeight: "44px",
            }}
          >
            ↺ RESET
          </button>
          <button
            type="button"
            data-ocid="character.save.primary_button"
            onClick={onClose}
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              padding: "0.65rem 2rem",
              background: "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(157,0,255,0.4)",
              touchAction: "manipulation",
              minHeight: "44px",
            }}
          >
            ✓ SAVE CHARACTER
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .flex-col-mobile {
            flex-direction: column !important;
          }
          .preview-panel {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(157,0,255,0.15);
            max-height: 260px;
          }
          .preview-panel > div:last-child {
            transform: scale(0.65);
            transform-origin: top center;
          }
        }
      `}</style>
    </div>
  );
}
