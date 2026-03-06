import { useState } from "react";
import {
  ATTACK_CARDS,
  type AttackCard,
  CLASS_ATTACK_CARDS,
  useGameStore,
} from "./GameStore";

// ─── Rarity styling ────────────────────────────────────────────────────────────
const RARITY_COLORS: Record<string, string> = {
  common: "#aaaaaa",
  rare: "#4488ff",
  epic: "#9d00ff",
  legendary: "#ff8800",
};

const RARITY_BG: Record<string, string> = {
  common: "rgba(100,100,100,0.08)",
  rare: "rgba(68,136,255,0.08)",
  epic: "rgba(157,0,255,0.08)",
  legendary: "rgba(255,136,0,0.08)",
};

type FilterTab = "all" | "free" | "rare" | "epic" | "legendary";

// ─── Skill Card Display ────────────────────────────────────────────────────────
function SkillCard({
  card,
  isEquipped,
  equippedSlot,
  onEquip,
  onUnequip,
  gameLevel,
}: {
  card: AttackCard;
  isEquipped: boolean;
  equippedSlot: number;
  onEquip: (card: AttackCard) => void;
  onUnequip: (slotIndex: number) => void;
  gameLevel: number;
}) {
  const rarityColor = RARITY_COLORS[card.rarity] ?? "#aaa";
  const rarityBg = RARITY_BG[card.rarity] ?? "transparent";
  const isLocked = gameLevel < card.minLevel;

  return (
    <div
      data-ocid={`skill.${card.id}.card`}
      style={{
        background: isLocked
          ? "rgba(0,0,0,0.4)"
          : `${rarityBg}, rgba(0,0,0,0.6)`,
        border: `1px solid ${isEquipped ? rarityColor : isLocked ? "rgba(80,80,80,0.3)" : `${rarityColor}55`}`,
        borderRadius: "10px",
        padding: "0.65rem 0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        opacity: isLocked ? 0.45 : 1,
        position: "relative",
        transition: "border-color 0.2s",
        boxShadow: isEquipped ? `0 0 12px ${rarityColor}44` : "none",
        fontFamily: '"Sora", sans-serif',
      }}
    >
      {/* Equipped indicator */}
      {isEquipped && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 8,
            background: rarityColor,
            borderRadius: "4px",
            padding: "1px 6px",
            fontSize: "0.48rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#000",
          }}
        >
          SLOT {equippedSlot + 1}
        </div>
      )}

      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "8px",
          background: isLocked
            ? "rgba(50,50,50,0.5)"
            : `radial-gradient(circle, ${rarityColor}22 0%, transparent 70%)`,
          border: `1px solid ${isLocked ? "rgba(80,80,80,0.3)" : `${rarityColor}44`}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          flexShrink: 0,
          filter: isLocked ? "grayscale(1)" : "none",
        }}
      >
        {isLocked ? "🔒" : card.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 900,
            letterSpacing: "0.04em",
            color: isLocked ? "rgba(150,150,150,0.6)" : rarityColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {card.name}
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            marginTop: "2px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.55rem",
              color: "#ff6666",
              fontWeight: 700,
            }}
          >
            ⚔️ {card.damage}
          </span>
          <span
            style={{
              fontSize: "0.55rem",
              color: card.manaCost === 0 ? "#00ff88" : "#6699ff",
              fontWeight: 700,
            }}
          >
            {card.manaCost === 0 ? "FREE" : `💙 ${card.manaCost}MP`}
          </span>
          {card.hitCount && card.hitCount > 1 && (
            <span style={{ fontSize: "0.5rem", color: "#ffaa00" }}>
              ×{card.hitCount} HITS
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: "0.52rem",
            color: "rgba(255,255,255,0.4)",
            marginTop: "2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isLocked ? `Unlocks at Level ${card.minLevel}` : card.description}
        </div>
      </div>

      {/* Action button */}
      {!isLocked && (
        <button
          type="button"
          data-ocid={`skill.${card.id}.${isEquipped ? "unequip_button" : "equip_button"}`}
          onClick={() => {
            if (isEquipped) {
              onUnequip(equippedSlot);
            } else {
              onEquip(card);
            }
          }}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.55rem",
            letterSpacing: "0.06em",
            padding: "0.35rem 0.6rem",
            background: isEquipped
              ? "rgba(255,60,60,0.15)"
              : `linear-gradient(135deg, ${rarityColor}22, ${rarityColor}11)`,
            border: `1px solid ${isEquipped ? "rgba(255,60,60,0.5)" : `${rarityColor}66`}`,
            borderRadius: "6px",
            color: isEquipped ? "#ff6666" : rarityColor,
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "32px",
            minWidth: "52px",
            flexShrink: 0,
          }}
        >
          {isEquipped ? "REMOVE" : "EQUIP"}
        </button>
      )}
    </div>
  );
}

// ─── Equipped Slot ─────────────────────────────────────────────────────────────
function EquippedSlot({
  slotIndex,
  card,
  onUnequip,
  onSlotClick,
  isSelected,
}: {
  slotIndex: number;
  card: AttackCard | null;
  onUnequip: (slotIndex: number) => void;
  onSlotClick: (slotIndex: number) => void;
  isSelected: boolean;
}) {
  const rarityColor = card ? (RARITY_COLORS[card.rarity] ?? "#aaa") : "#333";

  return (
    <button
      type="button"
      data-ocid={`skill.slot.${slotIndex + 1}.button`}
      onClick={() => {
        if (card) {
          onUnequip(slotIndex);
        } else {
          onSlotClick(slotIndex);
        }
      }}
      style={{
        flex: 1,
        minWidth: 0,
        height: "64px",
        borderRadius: "10px",
        background: card
          ? `radial-gradient(ellipse at center, ${rarityColor}18 0%, rgba(0,0,0,0.7) 100%)`
          : "rgba(0,0,0,0.4)",
        border: isSelected
          ? "2px solid #00ffff"
          : card
            ? `2px solid ${rarityColor}88`
            : "2px dashed rgba(255,255,255,0.15)",
        boxShadow: isSelected
          ? "0 0 14px rgba(0,255,255,0.5)"
          : card
            ? `0 0 8px ${rarityColor}30`
            : "none",
        cursor: "pointer",
        touchAction: "manipulation",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2px",
        transition: "all 0.15s ease",
        fontFamily: '"Sora", sans-serif',
      }}
    >
      {card ? (
        <>
          <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{card.icon}</span>
          <span
            style={{
              fontSize: "0.42rem",
              fontWeight: 700,
              color: rarityColor,
              letterSpacing: "0.04em",
              textAlign: "center",
              maxWidth: "95%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {card.name}
          </span>
          <span
            style={{
              fontSize: "0.38rem",
              color: "rgba(255,100,100,0.8)",
            }}
          >
            {card.damage} DMG
          </span>
        </>
      ) : (
        <>
          <span
            style={{
              fontSize: "1.2rem",
              color: isSelected ? "#00ffff" : "rgba(255,255,255,0.15)",
              lineHeight: 1,
            }}
          >
            {isSelected ? "+" : "○"}
          </span>
          <span
            style={{
              fontSize: "0.42rem",
              color: isSelected ? "#00ffff" : "rgba(255,255,255,0.2)",
              letterSpacing: "0.06em",
            }}
          >
            SLOT {slotIndex + 1}
          </span>
        </>
      )}
    </button>
  );
}

// ─── Main SkillInventoryPage ───────────────────────────────────────────────────
interface SkillInventoryPageProps {
  onBack: () => void;
}

export function SkillInventoryPage({ onBack }: SkillInventoryPageProps) {
  const { equippedSkills, playerClass, gameLevel, equipSkill, unequipSkill } =
    useGameStore();

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // Build all available skills (class-specific first, then generic)
  const allSkills: AttackCard[] = [];
  const seenIds = new Set<string>();

  if (playerClass && CLASS_ATTACK_CARDS[playerClass]) {
    for (const card of CLASS_ATTACK_CARDS[playerClass]) {
      if (!seenIds.has(card.id)) {
        allSkills.push(card);
        seenIds.add(card.id);
      }
    }
  }

  // Add generic pool cards not already added
  for (const card of ATTACK_CARDS) {
    if (!seenIds.has(card.id)) {
      allSkills.push(card);
      seenIds.add(card.id);
    }
  }

  // Ensure equippedSkills is 6 length
  const slots = [...equippedSkills];
  while (slots.length < 6) slots.push("");

  // Build card lookup
  const allCardsByClass: Record<string, AttackCard> = {};
  for (const card of allSkills) allCardsByClass[card.id] = card;
  for (const cards of Object.values(CLASS_ATTACK_CARDS)) {
    for (const card of cards) allCardsByClass[card.id] = card;
  }
  for (const card of ATTACK_CARDS) allCardsByClass[card.id] = card;

  // Slot cards (resolved)
  const slotCards: (AttackCard | null)[] = slots.map((id) =>
    id && allCardsByClass[id] ? allCardsByClass[id] : null,
  );

  const _equippedSet = new Set(slots.filter((id) => id !== ""));

  // Filter skills
  const filteredSkills = allSkills.filter((card) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "free") return card.manaCost === 0;
    return card.rarity === activeFilter;
  });

  const handleEquip = (card: AttackCard) => {
    if (selectedSlot !== null) {
      equipSkill(selectedSlot, card.id);
      setSelectedSlot(null);
      return;
    }
    // Auto-assign to first empty slot
    const emptySlot = slots.findIndex((s) => s === "");
    if (emptySlot !== -1) {
      equipSkill(emptySlot, card.id);
    } else {
      // Replace slot 0
      equipSkill(0, card.id);
    }
  };

  const handleUnequip = (slotIndex: number) => {
    unequipSkill(slotIndex);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slotIndex: number) => {
    setSelectedSlot(selectedSlot === slotIndex ? null : slotIndex);
  };

  const FILTER_TABS: { key: FilterTab; label: string; color: string }[] = [
    { key: "all", label: "ALL", color: "#ffffff" },
    { key: "free", label: "FREE", color: "#00ff88" },
    { key: "rare", label: "RARE", color: "#4488ff" },
    { key: "epic", label: "EPIC", color: "#9d00ff" },
    { key: "legendary", label: "LEGEND", color: "#ff8800" },
  ];

  const unlockedCount = allSkills.filter((c) => c.minLevel <= gameLevel).length;

  return (
    <div
      data-ocid="skill_inventory.page"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background:
          "radial-gradient(ellipse at center, #080018 0%, #000000 70%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Sora", sans-serif',
        overflow: "hidden",
      }}
    >
      {/* BG glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(157,0,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255,136,0,0.05) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(0.75rem, 3vw, 1.25rem)",
          paddingBottom: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          type="button"
          data-ocid="skill_inventory.back.button"
          onClick={onBack}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.7rem",
            padding: "0.5rem 0.9rem",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "7px",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "36px",
            flexShrink: 0,
          }}
        >
          ← BACK
        </button>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "clamp(1rem, 4vw, 1.5rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              background:
                "linear-gradient(135deg, #ff0033 0%, #9d00ff 50%, #ff8800 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
            }}
          >
            ⚔️ SKILL INVENTORY
          </div>
          <div
            style={{
              fontSize: "0.58rem",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.08em",
              marginTop: "1px",
            }}
          >
            {unlockedCount} skills unlocked · Level {gameLevel}
          </div>
        </div>
        {playerClass && (
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#9d00ff",
              background: "rgba(157,0,255,0.1)",
              border: "1px solid rgba(157,0,255,0.3)",
              borderRadius: "6px",
              padding: "0.3rem 0.6rem",
            }}
          >
            {playerClass.replace("_", " ")}
          </div>
        )}
      </div>

      {/* Equipped Slots Section */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0.75rem clamp(0.75rem, 3vw, 1.25rem)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.3)",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          ◆ BATTLE LOADOUT
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.5rem" }}>
            (6 SLOTS · TAP SLOT TO ASSIGN)
          </span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {([0, 1, 2, 3, 4, 5] as const).map((slotIdx) => (
            <EquippedSlot
              key={`slot-${slotIdx}`}
              slotIndex={slotIdx}
              card={slotCards[slotIdx]}
              onUnequip={handleUnequip}
              onSlotClick={handleSlotClick}
              isSelected={selectedSlot === slotIdx}
            />
          ))}
        </div>
        {selectedSlot !== null && (
          <div
            style={{
              marginTop: "0.4rem",
              fontSize: "0.6rem",
              color: "#00ffff",
              letterSpacing: "0.06em",
              textAlign: "center",
            }}
          >
            Tap a skill below to assign to Slot {selectedSlot + 1}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: "4px",
          padding: "0.5rem clamp(0.75rem, 3vw, 1.25rem)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflowX: "auto",
        }}
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            data-ocid={`skill_inventory.filter.${tab.key}.tab`}
            onClick={() => setActiveFilter(tab.key)}
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              padding: "0.35rem 0.8rem",
              background:
                activeFilter === tab.key ? `${tab.color}22` : "rgba(0,0,0,0.4)",
              border: `1px solid ${activeFilter === tab.key ? tab.color : "rgba(255,255,255,0.1)"}`,
              borderRadius: "6px",
              color:
                activeFilter === tab.key ? tab.color : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              touchAction: "manipulation",
              whiteSpace: "nowrap",
              minHeight: "30px",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skill List */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem clamp(0.75rem, 3vw, 1.25rem)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {filteredSkills.length === 0 ? (
          <div
            data-ocid="skill_inventory.empty_state"
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.75rem",
            }}
          >
            No skills in this category
          </div>
        ) : (
          filteredSkills.map((card) => {
            const equippedSlotIndex = slots.indexOf(card.id);
            const isEquipped = equippedSlotIndex !== -1;

            return (
              <SkillCard
                key={card.id}
                card={card}
                isEquipped={isEquipped}
                equippedSlot={equippedSlotIndex}
                onEquip={handleEquip}
                onUnequip={handleUnequip}
                gameLevel={gameLevel}
              />
            );
          })
        )}

        {/* Bottom padding for mobile scroll */}
        <div style={{ height: "1rem" }} />
      </div>
    </div>
  );
}
