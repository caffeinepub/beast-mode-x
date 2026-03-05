import { WEAPONS, useGameStore } from "./GameStore";

interface InventoryModalProps {
  open: boolean;
  onClose: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: "#aaaaaa",
  rare: "#0088ff",
  epic: "#9d00ff",
  legendary: "#ffaa00",
};

const RARITY_GLOW: Record<string, string> = {
  common: "rgba(170,170,170,0.3)",
  rare: "rgba(0,136,255,0.4)",
  epic: "rgba(157,0,255,0.5)",
  legendary: "rgba(255,170,0,0.5)",
};

export function InventoryModal({ open, onClose }: InventoryModalProps) {
  const {
    inventory,
    equippedWeapon,
    equipWeapon,
    usePotion: consumePotion,
    gold,
    gameLevel,
  } = useGameStore();

  if (!open) return null;

  const equippedWeaponData = WEAPONS[equippedWeapon];

  const weapons = inventory.filter((i) => i.type === "weapon");
  const potions = inventory.filter((i) => i.type === "potion");
  const armors = inventory.filter((i) => i.type === "armor");
  const materials = inventory.filter((i) => i.type === "material");

  return (
    <div
      data-ocid="inventory.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      <div
        style={{
          background: "rgba(5,0,20,0.97)",
          border: "1px solid rgba(157,0,255,0.4)",
          borderRadius: "12px",
          boxShadow: "0 0 40px rgba(157,0,255,0.3), 0 0 80px rgba(0,0,0,0.8)",
          width: "min(480px, 95vw)",
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(157,0,255,0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "1.1rem",
                letterSpacing: "0.1em",
                color: "#9d00ff",
                textShadow: "0 0 12px rgba(157,0,255,0.7)",
              }}
            >
              ◆ INVENTORY
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.72rem",
                color: "rgba(255,200,0,0.9)",
                marginTop: "0.2rem",
              }}
            >
              💰 {gold} Gold · Level {gameLevel} Player
            </div>
          </div>
          <button
            type="button"
            data-ocid="inventory.close_button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,0,51,0.4)",
              borderRadius: "4px",
              color: "rgba(255,0,51,0.8)",
              cursor: "pointer",
              padding: "0.3rem 0.7rem",
              fontSize: "1rem",
              fontFamily: '"Sora", sans-serif',
              touchAction: "manipulation",
            }}
          >
            ✕
          </button>
        </div>

        {/* Equipped weapon summary */}
        {equippedWeaponData && (
          <div
            style={{
              margin: "1rem 1.5rem 0",
              padding: "0.75rem 1rem",
              background: "rgba(157,0,255,0.08)",
              border: "1px solid rgba(157,0,255,0.3)",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.65rem",
                color: "rgba(157,0,255,0.7)",
                letterSpacing: "0.1em",
                marginBottom: "0.3rem",
              }}
            >
              EQUIPPED
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>
                {equippedWeaponData.icon}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: RARITY_COLORS[equippedWeaponData.rarity],
                  }}
                >
                  {equippedWeaponData.name}
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  ATK +{equippedWeaponData.damage} · Range{" "}
                  {equippedWeaponData.range} · {equippedWeaponData.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", padding: "1rem 1.5rem", flex: 1 }}>
          {/* Weapons */}
          {weapons.length > 0 && (
            <Section title="⚔️ WEAPONS">
              {weapons.map((item, idx) => {
                const weaponData = WEAPONS[item.id];
                const isEquipped = equippedWeapon === item.id;
                const levelOk = weaponData
                  ? gameLevel >= weaponData.minLevel
                  : true;
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    equipped={isEquipped}
                    locked={!levelOk}
                    lockReason={
                      !levelOk
                        ? `Requires Level ${weaponData?.minLevel}`
                        : undefined
                    }
                    actionLabel={isEquipped ? "EQUIPPED" : "EQUIP"}
                    onAction={
                      !isEquipped && levelOk
                        ? () => equipWeapon(item.id)
                        : undefined
                    }
                    ocid={`inventory.weapon.button.${idx + 1}`}
                  />
                );
              })}
            </Section>
          )}

          {/* Potions */}
          {potions.length > 0 && (
            <Section title="🧪 POTIONS">
              {potions.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  actionLabel="USE"
                  onAction={() => consumePotion(item.id)}
                  ocid={`inventory.potion.button.${idx + 1}`}
                />
              ))}
            </Section>
          )}

          {/* Armor */}
          {armors.length > 0 && (
            <Section title="🛡️ ARMOR">
              {armors.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  actionLabel="EQUIP"
                  ocid={`inventory.armor.button.${idx + 1}`}
                />
              ))}
            </Section>
          )}

          {/* Materials */}
          {materials.length > 0 && (
            <Section title="💎 MATERIALS">
              {materials.map((item, idx) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  ocid={`inventory.material.item.${idx + 1}`}
                />
              ))}
            </Section>
          )}

          {inventory.length <= 1 && (
            <div
              data-ocid="inventory.empty_state"
              style={{
                textAlign: "center",
                padding: "2rem",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Defeat monsters to collect loot!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "rgba(157,0,255,0.7)",
          marginBottom: "0.5rem",
          paddingBottom: "0.3rem",
          borderBottom: "1px solid rgba(157,0,255,0.2)",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {children}
      </div>
    </div>
  );
}

function ItemCard({
  item,
  equipped,
  locked,
  lockReason,
  actionLabel,
  onAction,
  ocid,
}: {
  item: {
    id: string;
    name: string;
    rarity: string;
    icon: string;
    attackBonus: number;
    defenseBonus: number;
    quantity: number;
    description?: string;
  };
  equipped?: boolean;
  locked?: boolean;
  lockReason?: string;
  actionLabel?: string;
  onAction?: () => void;
  ocid: string;
}) {
  const rarityColor = RARITY_COLORS[item.rarity] || "#aaaaaa";
  const rarityGlow = RARITY_GLOW[item.rarity] || "transparent";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5rem 0.75rem",
        background: equipped
          ? "rgba(157,0,255,0.12)"
          : "rgba(255,255,255,0.03)",
        border: equipped
          ? "1px solid rgba(157,0,255,0.5)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "6px",
        boxShadow: equipped ? `0 0 10px ${rarityGlow}` : "none",
        opacity: locked ? 0.5 : 1,
      }}
    >
      <span
        style={{
          fontSize: "1.4rem",
          filter: `drop-shadow(0 0 6px ${rarityGlow})`,
        }}
      >
        {item.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.82rem",
            color: rarityColor,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}{" "}
          {item.quantity > 1 && (
            <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
              ×{item.quantity}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {lockReason ||
            item.description ||
            `${item.attackBonus > 0 ? `ATK +${item.attackBonus}` : ""}${item.defenseBonus > 0 ? ` DEF +${item.defenseBonus}` : ""}` ||
            item.rarity.toUpperCase()}
        </div>
      </div>
      {actionLabel && (
        <button
          type="button"
          data-ocid={ocid}
          onClick={onAction}
          disabled={!onAction || locked}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.62rem",
            letterSpacing: "0.08em",
            padding: "0.3rem 0.65rem",
            background:
              !onAction || locked || equipped
                ? "transparent"
                : "rgba(157,0,255,0.2)",
            border: equipped
              ? "1px solid rgba(157,0,255,0.6)"
              : `1px solid ${rarityColor}40`,
            borderRadius: "4px",
            color: equipped ? "#9d00ff" : rarityColor,
            cursor: onAction && !locked ? "pointer" : "default",
            whiteSpace: "nowrap",
            touchAction: "manipulation",
            minHeight: "32px",
            minWidth: "54px",
          }}
        >
          {equipped ? "✓ ON" : actionLabel}
        </button>
      )}
    </div>
  );
}
