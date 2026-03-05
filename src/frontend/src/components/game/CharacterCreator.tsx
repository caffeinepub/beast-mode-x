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
];

const OUTFIT_STYLES = [
  { label: "Warrior", icon: "⚔️" },
  { label: "Mage", icon: "🔮" },
  { label: "Assassin", icon: "🗡️" },
  { label: "Berserker", icon: "💀" },
  { label: "Knight", icon: "🛡️" },
  { label: "Shadow", icon: "🌑" },
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
  } = config;

  const isFemale = gender === "female";
  const bodyWidth =
    bodyType === "slim" ? 54 : bodyType === "athletic" ? 66 : 80;
  const bodyHeight =
    bodyType === "slim" ? 100 : bodyType === "athletic" ? 90 : 88;
  // Hair shapes based on style index
  const getHairShape = () => {
    switch (hairStyle) {
      case 0: // Spiky
        return (
          <>
            {[-22, -12, 0, 12, 22].map((x, idx) => (
              <div
                key={x}
                style={{
                  position: "absolute",
                  bottom: idx % 2 === 0 ? "90%" : "85%",
                  left: `calc(50% + ${x}px)`,
                  transform: "translateX(-50%)",
                  width: 10,
                  height: idx % 2 === 0 ? 28 : 20,
                  background: hairColor,
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  filter: `drop-shadow(0 0 4px ${hairColor})`,
                }}
              />
            ))}
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
                height: "60%",
                background: hairColor,
                borderRadius: "50% 50% 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: -8,
                width: 14,
                height: 120,
                background: `linear-gradient(${hairColor}, transparent)`,
                borderRadius: "0 0 50% 50%",
              }}
            />
            {!isFemale && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: -8,
                  width: 14,
                  height: 100,
                  background: `linear-gradient(${hairColor}, transparent)`,
                  borderRadius: "0 0 50% 50%",
                }}
              />
            )}
          </>
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
                top: "10%",
                right: -6,
                width: 12,
                height: 90,
                background: `linear-gradient(${hairColor}, transparent)`,
                borderRadius: "0 20px 20px 0",
                transform: "rotate(10deg)",
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
                top: "-20%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 16,
                height: 40,
                background: hairColor,
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                filter: `drop-shadow(0 0 6px ${hairColor})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "5%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 20,
                height: "40%",
                background: hairColor,
                borderRadius: "4px 4px 0 0",
              }}
            />
          </>
        );
      default: // Short / others
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
              filter: `drop-shadow(0 0 4px ${hairColor})`,
            }}
          />
        );
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "360px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: "20px",
      }}
    >
      {/* Aura glow background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 80% at 50% 70%, ${auraColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "30px",
          background: `radial-gradient(ellipse, ${auraColor}40 0%, transparent 70%)`,
          filter: "blur(8px)",
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
            height: 76,
            background: skinTone,
            borderRadius: isFemale ? "50% 50% 45% 45%" : "48% 48% 42% 42%",
            boxShadow: `0 0 12px ${auraColor}30`,
            zIndex: 2,
          }}
        >
          {/* Hair */}
          {getHairShape()}

          {/* Eyes */}
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "20%",
              width: 12,
              height: isFemale ? 10 : 9,
              background: eyeColor,
              borderRadius: isFemale ? "50%" : "3px",
              boxShadow: `0 0 8px ${eyeColor}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "42%",
              right: "20%",
              width: 12,
              height: isFemale ? 10 : 9,
              background: eyeColor,
              borderRadius: isFemale ? "50%" : "3px",
              boxShadow: `0 0 8px ${eyeColor}`,
            }}
          />

          {/* Accessory */}
          {accessory === 1 && ( // Headband
            <div
              style={{
                position: "absolute",
                top: "28%",
                left: -4,
                right: -4,
                height: 10,
                background: `linear-gradient(${auraColor}, ${hairColor})`,
                borderRadius: "2px",
                boxShadow: `0 0 6px ${auraColor}`,
              }}
            />
          )}
          {accessory === 2 && ( // Eyepatch
            <div
              style={{
                position: "absolute",
                top: "38%",
                left: "14%",
                width: 20,
                height: 16,
                background: "#111",
                border: `2px solid ${hairColor}`,
                borderRadius: "3px",
              }}
            />
          )}
          {accessory === 3 && ( // Scar
            <div
              style={{
                position: "absolute",
                top: "35%",
                left: "50%",
                transform: "translateX(-50%) rotate(15deg)",
                width: 3,
                height: 26,
                background: "#ff3333",
                borderRadius: "2px",
                opacity: 0.8,
              }}
            />
          )}
          {accessory === 4 && ( // Face Paint
            <>
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "16%",
                  width: 8,
                  height: 24,
                  background: auraColor,
                  borderRadius: "4px",
                  opacity: 0.7,
                  transform: "rotate(-10deg)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  right: "16%",
                  width: 8,
                  height: 24,
                  background: auraColor,
                  borderRadius: "4px",
                  opacity: 0.7,
                  transform: "rotate(10deg)",
                }}
              />
            </>
          )}
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

        {/* Shoulders */}
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
              width: isFemale ? 16 : 18,
              height: bodyHeight * 0.7,
              background: outfitColor,
              borderRadius: "0 0 8px 8px",
              marginTop: 4,
              border: `1px solid ${auraColor}40`,
              boxShadow: `0 0 8px ${auraColor}20`,
            }}
          />

          {/* Body */}
          <div
            style={{
              width: bodyWidth,
              height: bodyHeight,
              background: outfitColor,
              border: `2px solid ${auraColor}60`,
              boxShadow: `0 0 16px ${auraColor}30, inset 0 0 20px ${auraColor}10`,
              position: "relative",
              borderRadius: isFemale
                ? "10px 10px 20px 20px"
                : "6px 6px 12px 12px",
            }}
          >
            {/* Outfit detail - chest emblem */}
            <div
              style={{
                position: "absolute",
                top: "25%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 20,
                height: 20,
                background: `radial-gradient(${auraColor}80, transparent)`,
                borderRadius: "50%",
                border: `1px solid ${auraColor}`,
                boxShadow: `0 0 10px ${auraColor}`,
              }}
            />
            {/* Belt area for warrior/knight */}
            {(OUTFIT_STYLES[config.outfitStyle]?.label === "Warrior" ||
              OUTFIT_STYLES[config.outfitStyle]?.label === "Knight") && (
              <div
                style={{
                  position: "absolute",
                  bottom: "30%",
                  left: 0,
                  right: 0,
                  height: 8,
                  background: `linear-gradient(90deg, transparent, ${auraColor}60, transparent)`,
                }}
              />
            )}
          </div>

          {/* Right arm */}
          <div
            style={{
              width: isFemale ? 16 : 18,
              height: bodyHeight * 0.7,
              background: outfitColor,
              borderRadius: "0 0 8px 8px",
              marginTop: 4,
              border: `1px solid ${auraColor}40`,
              boxShadow: `0 0 8px ${auraColor}20`,
            }}
          />
        </div>

        {/* Legs */}
        <div style={{ display: "flex", gap: 6 }}>
          <div
            style={{
              width: isFemale ? 24 : 28,
              height: 80,
              background: outfitColor,
              borderRadius: "0 0 8px 8px",
              border: `1px solid ${auraColor}40`,
              filter: "brightness(0.85)",
            }}
          />
          <div
            style={{
              width: isFemale ? 24 : 28,
              height: 80,
              background: outfitColor,
              borderRadius: "0 0 8px 8px",
              border: `1px solid ${auraColor}40`,
              filter: "brightness(0.85)",
            }}
          />
        </div>
      </div>

      {/* Name label */}
      <div
        style={{
          marginTop: 8,
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          color: auraColor,
          textShadow: `0 0 8px ${auraColor}`,
          textTransform: "uppercase",
        }}
      >
        {isFemale ? "♀ FEMALE" : "♂ MALE"} ·{" "}
        {OUTFIT_STYLES[config.outfitStyle]?.label}
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
          maxWidth: "860px",
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
              width: "280px",
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
                        data-ocid={`character.gender.${g === "male" ? "toggle" : "toggle"}`}
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
                          fontSize: "0.55rem",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          padding: "0.6rem 0.3rem",
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
                        <span style={{ fontSize: "1rem" }}>{hs.icon}</span>
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
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          padding: "0.55rem 0.75rem",
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
                        <span style={{ fontSize: "1rem" }}>{a.icon}</span>
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
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          padding: "0.65rem 0.4rem",
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
                        <span style={{ fontSize: "1.2rem" }}>{os.icon}</span>
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
            max-height: 240px;
          }
          .preview-panel > div:last-child {
            transform: scale(0.7);
            transform-origin: top center;
          }
        }
      `}</style>
    </div>
  );
}
