import { useState } from "react";
import { useCharacterStore } from "./CharacterStore";
import { useGameStore } from "./GameStore";

export interface ClassDefinition {
  id: string;
  name: string;
  icon: string;
  elementType: string;
  elementIcon: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  description: string;
  lore: string;
  previewMoves: string[];
}

export const CLASS_DEFINITIONS: ClassDefinition[] = [
  {
    id: "SHADOW_MONARCH",
    name: "SHADOW MONARCH",
    icon: "👑",
    elementType: "DARK TYPE",
    elementIcon: "🌑",
    primaryColor: "#9d00ff",
    secondaryColor: "#5500aa",
    glowColor: "rgba(157,0,255,0.6)",
    description:
      "Commands the shadows themselves. Raises fallen enemies as shadow soldiers to serve forever.",
    lore: "Arise, my soldiers.",
    previewMoves: [
      "Shadow Fist (Free)",
      "Dark Slash (25 mana)",
      "Shadow Army (40 mana x3)",
      "Void Domination ★",
    ],
  },
  {
    id: "THUNDER_GOD",
    name: "THUNDER GOD",
    icon: "⚡",
    elementType: "LIGHTNING TYPE",
    elementIcon: "🌩️",
    primaryColor: "#ffdd00",
    secondaryColor: "#00ccff",
    glowColor: "rgba(255,220,0,0.6)",
    description:
      "Wields divine lightning with absolute precision. Every strike carries the force of a thunderstorm.",
    lore: "Lightning answers only to the worthy.",
    previewMoves: [
      "Static Punch (Free)",
      "Chain Lightning (20 mana x2)",
      "Thunder Clap (35 mana)",
      "God's Wrath ★",
    ],
  },
  {
    id: "INFERNO_KING",
    name: "INFERNO KING",
    icon: "🔥",
    elementType: "FIRE TYPE",
    elementIcon: "🌋",
    primaryColor: "#ff4400",
    secondaryColor: "#ff8800",
    glowColor: "rgba(255,68,0,0.6)",
    description:
      "Burning with the fury of a thousand suns. Commands primal fire that scorches even the soul.",
    lore: "Everything burns in my presence.",
    previewMoves: [
      "Ember Strike (Free)",
      "Fire Wave (22 mana)",
      "Magma Burst (38 mana)",
      "Dragon's Roar ★",
    ],
  },
  {
    id: "FROST_SOVEREIGN",
    name: "FROST SOVEREIGN",
    icon: "❄️",
    elementType: "ICE TYPE",
    elementIcon: "🧊",
    primaryColor: "#00ffff",
    secondaryColor: "#aaeeff",
    glowColor: "rgba(0,255,255,0.5)",
    description:
      "Absolute cold in human form. Freezes time itself and encases enemies in eternal winter.",
    lore: "All things bow to absolute zero.",
    previewMoves: [
      "Ice Shard (Free)",
      "Blizzard (20 mana)",
      "Cryo Freeze (38 mana + stun)",
      "Absolute Zero ★",
    ],
  },
  {
    id: "BLOOD_BERSERKER",
    name: "BLOOD BERSERKER",
    icon: "⚔️",
    elementType: "RAGE TYPE",
    elementIcon: "🩸",
    primaryColor: "#cc0000",
    secondaryColor: "#880000",
    glowColor: "rgba(200,0,0,0.6)",
    description:
      "Pure bloodlust incarnate. Grows stronger with each wound received, feeding on pain itself.",
    lore: "Pain is my power.",
    previewMoves: [
      "Rage Strike (Free)",
      "Blood Slash (18 mana + lifesteal)",
      "Berserk Mode (30 mana)",
      "Crimson Extinction ★",
    ],
  },
  {
    id: "VOID_ARCHMAGE",
    name: "VOID ARCHMAGE",
    icon: "🌀",
    elementType: "VOID TYPE",
    elementIcon: "🔮",
    primaryColor: "#cc00ff",
    secondaryColor: "#ff44ff",
    glowColor: "rgba(204,0,255,0.6)",
    description:
      "Master of space and time. Manipulates reality itself, stopping time and collapsing dimensions.",
    lore: "Space and time obey my will.",
    previewMoves: [
      "Void Touch (Free)",
      "Space Rend (25 mana)",
      "Time Stop (40 mana)",
      "Singularity ★",
    ],
  },
];

interface ConfirmModalProps {
  classInfo: ClassDefinition;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ classInfo, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        padding: "1rem",
      }}
      onClick={onCancel}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(ellipse at top, #0d0020 0%, #050010 100%)",
          border: `2px solid ${classInfo.primaryColor}`,
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
          boxShadow: `0 0 40px ${classInfo.glowColor}, 0 0 80px ${classInfo.glowColor.replace("0.6", "0.2")}`,
          textAlign: "center",
          fontFamily: '"Sora", sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
          {classInfo.icon}
        </div>
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: 900,
            letterSpacing: "0.1em",
            color: classInfo.primaryColor,
            textShadow: `0 0 12px ${classInfo.primaryColor}`,
            marginBottom: "0.5rem",
          }}
        >
          {classInfo.name}
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to select this class?
          <br />
          <span style={{ color: "rgba(255,200,0,0.8)", fontSize: "0.75rem" }}>
            You can select other classes too, but switching later will reset
            that class's progress.
          </span>
        </div>

        <div
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}
        >
          <button
            type="button"
            data-ocid="class.confirm_button"
            onClick={onConfirm}
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              padding: "0.75rem 1.75rem",
              background: `linear-gradient(135deg, ${classInfo.primaryColor} 0%, ${classInfo.secondaryColor} 100%)`,
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              boxShadow: `0 0 16px ${classInfo.glowColor}`,
              touchAction: "manipulation",
              minHeight: "48px",
            }}
          >
            ✅ CONFIRM
          </button>
          <button
            type="button"
            data-ocid="class.cancel_button"
            onClick={onCancel}
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              padding: "0.75rem 1.75rem",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              touchAction: "manipulation",
              minHeight: "48px",
            }}
          >
            ✖ CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

interface ClassCardProps {
  classInfo: ClassDefinition;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function ClassCard({ classInfo, isSelected, onSelect }: ClassCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-ocid={`class.${classInfo.id.toLowerCase()}.card`}
      style={{
        background: hovered
          ? `radial-gradient(ellipse at top, ${classInfo.primaryColor}15 0%, rgba(0,0,0,0.8) 80%)`
          : "rgba(0,0,0,0.6)",
        border: isSelected
          ? `2px solid ${classInfo.primaryColor}`
          : hovered
            ? `1px solid ${classInfo.primaryColor}`
            : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "1.25rem",
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "scale(1.02) translateY(-2px)" : "scale(1)",
        boxShadow: hovered
          ? `0 0 25px ${classInfo.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`
          : isSelected
            ? `0 0 15px ${classInfo.glowColor}`
            : "none",
        fontFamily: '"Sora", sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top glow accent */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${classInfo.primaryColor}, transparent)`,
          }}
        />
      )}

      {/* Selected badge */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: "0.6rem",
            right: "0.6rem",
            background: classInfo.primaryColor,
            borderRadius: "20px",
            padding: "0.15rem 0.5rem",
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "white",
          }}
        >
          ACTIVE
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.6rem",
        }}
      >
        <span
          style={{
            fontSize: "2rem",
            filter: `drop-shadow(0 0 8px ${classInfo.primaryColor})`,
          }}
        >
          {classInfo.icon}
        </span>
        <div>
          <div
            style={{
              fontSize: "clamp(0.8rem, 2vw, 1rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: classInfo.primaryColor,
              textShadow: hovered
                ? `0 0 10px ${classInfo.primaryColor}`
                : "none",
              transition: "text-shadow 0.2s",
            }}
          >
            {classInfo.name}
          </div>
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: classInfo.secondaryColor,
              fontWeight: 700,
              marginTop: "0.15rem",
            }}
          >
            {classInfo.elementIcon} {classInfo.elementType}
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.5,
          marginBottom: "0.6rem",
        }}
      >
        {classInfo.description}
      </div>

      {/* Lore */}
      <div
        style={{
          fontSize: "0.65rem",
          fontStyle: "italic",
          color: classInfo.primaryColor,
          opacity: 0.7,
          marginBottom: "0.75rem",
        }}
      >
        "{classInfo.lore}"
      </div>

      {/* Moves preview */}
      <div style={{ marginBottom: "0.9rem" }}>
        <div
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "0.35rem",
            fontWeight: 700,
          }}
        >
          ◆ SIGNATURE MOVES
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}
        >
          {classInfo.previewMoves.map((move, i) => (
            <div
              key={move}
              style={{
                fontSize: "0.62rem",
                color:
                  i === classInfo.previewMoves.length - 1
                    ? classInfo.primaryColor
                    : "rgba(255,255,255,0.55)",
                fontWeight: i === classInfo.previewMoves.length - 1 ? 700 : 400,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <span style={{ opacity: 0.5 }}>▸</span>
              {move}
              {i === classInfo.previewMoves.length - 1 && (
                <span style={{ fontSize: "0.6rem", color: "gold" }}>
                  LEGENDARY
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Select button */}
      <button
        type="button"
        data-ocid={`class.${classInfo.id.toLowerCase()}.primary_button`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(classInfo.id);
        }}
        style={{
          width: "100%",
          fontFamily: '"Sora", sans-serif',
          fontWeight: 700,
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          padding: "0.65rem 1rem",
          background: hovered
            ? `linear-gradient(135deg, ${classInfo.primaryColor} 0%, ${classInfo.secondaryColor} 100%)`
            : `linear-gradient(135deg, ${classInfo.primaryColor}44 0%, ${classInfo.secondaryColor}33 100%)`,
          border: `1px solid ${classInfo.primaryColor}`,
          borderRadius: "8px",
          color: hovered ? "white" : classInfo.primaryColor,
          cursor: "pointer",
          boxShadow: hovered ? `0 0 16px ${classInfo.glowColor}` : "none",
          transition: "all 0.2s ease",
          touchAction: "manipulation",
          minHeight: "44px",
        }}
      >
        {isSelected ? "✓ SELECTED CLASS" : "⚔ SELECT CLASS"}
      </button>
    </div>
  );
}

interface ClassSelectionScreenProps {
  onClassSelected: (className: string) => void;
}

export function ClassSelectionScreen({
  onClassSelected,
}: ClassSelectionScreenProps) {
  const [pendingClass, setPendingClass] = useState<string | null>(null);
  const { config, setConfig } = useCharacterStore();
  const { setPlayerClass, resetClassProgress } = useGameStore();
  const currentClass = config.selectedClass;

  const handleSelect = (classId: string) => {
    setPendingClass(classId);
  };

  const handleConfirm = () => {
    if (!pendingClass) return;

    // If switching from an existing class, reset that class's progress
    if (currentClass && currentClass !== pendingClass) {
      resetClassProgress(currentClass);
    }

    setConfig({ selectedClass: pendingClass });
    setPlayerClass(pendingClass);
    setPendingClass(null);
    onClassSelected(pendingClass);
  };

  const handleCancel = () => {
    setPendingClass(null);
  };

  const pendingClassInfo = pendingClass
    ? (CLASS_DEFINITIONS.find((c) => c.id === pendingClass) ?? null)
    : null;

  return (
    <div
      data-ocid="class.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background:
          "radial-gradient(ellipse at center, #0a0020 0%, #000000 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: '"Sora", sans-serif',
        padding: "clamp(1rem, 4vw, 2rem)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Atmospheric bg glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(circle at 15% 50%, rgba(157,0,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 85% 20%, rgba(255,0,51,0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(0,255,255,0.04) 0%, transparent 50%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          marginBottom: "2rem",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <div
          style={{
            fontSize: "clamp(0.6rem, 1.5vw, 0.85rem)",
            letterSpacing: "0.35em",
            color: "rgba(157,0,255,0.6)",
            marginBottom: "0.6rem",
          }}
        >
          ⚔️ BEAST MODE LEVEL X ⚔️
        </div>
        <div
          style={{
            fontSize: "clamp(2rem, 7vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            background:
              "linear-gradient(135deg, #ff0033 0%, #9d00ff 50%, #00ffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
            marginBottom: "0.75rem",
          }}
        >
          CHOOSE YOUR CLASS
        </div>
        <div
          style={{
            fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.1em",
          }}
        >
          Each class has unique powers. You can master all 6.
        </div>
        {currentClass && (
          <div
            style={{
              marginTop: "0.75rem",
              fontSize: "0.7rem",
              color: "rgba(255,200,0,0.7)",
              letterSpacing: "0.08em",
            }}
          >
            Current Active:{" "}
            {CLASS_DEFINITIONS.find((c) => c.id === currentClass)?.name ??
              currentClass}
          </div>
        )}
      </div>

      {/* Class grid */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          maxWidth: "700px",
          width: "100%",
          marginBottom: "2rem",
        }}
      >
        {CLASS_DEFINITIONS.map((classInfo) => (
          <ClassCard
            key={classInfo.id}
            classInfo={classInfo}
            isSelected={currentClass === classInfo.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Skip/continue if already has a class */}
      {currentClass && (
        <button
          type="button"
          data-ocid="class.continue.button"
          onClick={() => onClassSelected(currentClass)}
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            padding: "0.75rem 2rem",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "48px",
            marginBottom: "2rem",
          }}
        >
          ▶ CONTINUE WITH CURRENT CLASS
        </button>
      )}

      {/* Confirmation modal */}
      {pendingClassInfo && (
        <ConfirmModal
          classInfo={pendingClassInfo}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      <style>{`
        @media (max-width: 480px) {
          [data-ocid="class.modal"] {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
