import { X } from "lucide-react";

interface RankTier {
  badge: string;
  title: string;
  levelReq: string;
  color: string;
  glow: string;
  levelMin: number;
}

export const ALL_RANKS: RankTier[] = [
  {
    badge: "⬜",
    title: "UNAWAKENED",
    levelReq: "Level 1–2",
    color: "oklch(0.6 0.04 260)",
    glow: "0 0 8px oklch(0.6 0.04 260 / 0.3)",
    levelMin: 1,
  },
  {
    badge: "🟤",
    title: "D-RANK HUNTER",
    levelReq: "Level 3–5",
    color: "oklch(0.65 0.12 50)",
    glow: "0 0 12px oklch(0.65 0.12 50 / 0.5)",
    levelMin: 3,
  },
  {
    badge: "🟢",
    title: "C-RANK HUNTER",
    levelReq: "Level 6–10",
    color: "oklch(0.65 0.18 140)",
    glow: "0 0 14px oklch(0.65 0.18 140 / 0.6)",
    levelMin: 6,
  },
  {
    badge: "🔷",
    title: "B-RANK HUNTER",
    levelReq: "Level 11–20",
    color: "oklch(0.62 0.22 240)",
    glow: "0 0 14px oklch(0.62 0.22 240 / 0.6)",
    levelMin: 11,
  },
  {
    badge: "💎",
    title: "A-RANK HUNTER",
    levelReq: "Level 21–30",
    color: "oklch(0.62 0.22 295)",
    glow: "0 0 16px oklch(0.62 0.22 295 / 0.8)",
    levelMin: 21,
  },
  {
    badge: "⭐",
    title: "S-RANK HUNTER",
    levelReq: "Level 31–50",
    color: "oklch(0.82 0.18 85)",
    glow: "0 0 16px oklch(0.82 0.18 85 / 0.8)",
    levelMin: 31,
  },
  {
    badge: "👑",
    title: "SHADOW MONARCH",
    levelReq: "Level 51–75",
    color: "oklch(0.55 0.18 295)",
    glow: "0 0 16px oklch(0.55 0.18 295 / 0.8)",
    levelMin: 51,
  },
  {
    badge: "🐉",
    title: "DRAGON FIST",
    levelReq: "Level 76–100",
    color: "oklch(0.65 0.22 20)",
    glow: "0 0 16px oklch(0.65 0.22 20 / 0.8)",
    levelMin: 76,
  },
  {
    badge: "🌈",
    title: "AWAKENED ONE",
    levelReq: "Level 101–150",
    color: "oklch(0.78 0.18 280)",
    glow: "0 0 18px oklch(0.78 0.18 280 / 0.8)",
    levelMin: 101,
  },
  {
    badge: "🌟",
    title: "BEAST MODE",
    levelReq: "Level 151+",
    color: "oklch(0.62 0.25 22)",
    glow: "0 0 20px oklch(0.62 0.25 22 / 0.8), 0 0 40px oklch(0.62 0.22 295 / 0.4)",
    levelMin: 151,
  },
];

interface RanksModalProps {
  onClose: () => void;
  currentLevel?: number;
}

export function RanksModal({ onClose, currentLevel = 1 }: RanksModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
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
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(0 0 0 / 0.9)",
          backdropFilter: "blur(16px)",
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.25 22 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Modal */}
      <div
        data-ocid="ranks.modal"
        style={{
          position: "relative",
          zIndex: 1,
          background: "oklch(0.09 0.015 260)",
          border: "1px solid oklch(0.62 0.25 22 / 0.4)",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow:
            "0 0 60px oklch(0.62 0.25 22 / 0.15), 0 40px 80px oklch(0 0 0 / 0.6)",
        }}
      >
        {/* Top accent gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.62 0.25 22), oklch(0.62 0.22 295), oklch(0.82 0.18 85), transparent)",
            borderRadius: "16px 16px 0 0",
          }}
        />

        {/* Close */}
        <button
          type="button"
          data-ocid="ranks.close_button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "oklch(0.12 0.02 260)",
            border: "1px solid oklch(0.3 0.04 260 / 0.6)",
            borderRadius: "6px",
            padding: "0.4rem",
            cursor: "pointer",
            color: "oklch(0.6 0.04 260)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              color: "oklch(0.62 0.25 22)",
              marginBottom: "0.5rem",
            }}
          >
            ◆ RANK SYSTEM ◆
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
              letterSpacing: "0.08em",
              background:
                "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 50%, oklch(0.82 0.18 85) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
            }}
          >
            ALL RANK TIERS
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.8rem",
              color: "oklch(0.55 0.04 260)",
              marginTop: "0.5rem",
            }}
          >
            Level up to unlock new titles. How far can you rise?
          </p>
        </div>

        {/* Rank list */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          {ALL_RANKS.map((rank, idx) => {
            const isCurrentRank =
              currentLevel >= rank.levelMin &&
              (idx === ALL_RANKS.length - 1 ||
                currentLevel < (ALL_RANKS[idx + 1]?.levelMin ?? 9999));
            const isUnlocked = currentLevel >= rank.levelMin;

            return (
              <div
                key={rank.title}
                data-ocid={`ranks.item.${idx + 1}`}
                style={{
                  padding: "0.85rem 1.25rem",
                  background: isCurrentRank
                    ? `${rank.color.replace(")", " / 0.12)")}`
                    : isUnlocked
                      ? "oklch(0.11 0.015 260)"
                      : "oklch(0.09 0.01 260 / 0.6)",
                  border: `1px solid ${
                    isCurrentRank
                      ? rank.color.replace(")", " / 0.7)")
                      : isUnlocked
                        ? rank.color.replace(")", " / 0.25)")
                        : "oklch(0.18 0.02 260 / 0.4)"
                  }`,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  boxShadow: isCurrentRank ? rank.glow : "none",
                  filter: isUnlocked
                    ? "none"
                    : "grayscale(0.6) brightness(0.6)",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {/* Rank number */}
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "oklch(0.45 0.03 260)",
                    width: "20px",
                    flexShrink: 0,
                    textAlign: "right",
                  }}
                >
                  {idx + 1}
                </div>

                {/* Badge */}
                <div
                  style={{
                    fontSize: "1.75rem",
                    width: "40px",
                    textAlign: "center",
                    flexShrink: 0,
                    filter: isCurrentRank
                      ? "drop-shadow(0 0 8px currentColor)"
                      : "none",
                  }}
                >
                  {rank.badge}
                </div>

                {/* Title + level req */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      letterSpacing: "0.1em",
                      color: isUnlocked ? rank.color : "oklch(0.4 0.03 260)",
                      textShadow: isCurrentRank
                        ? rank.glow.split(",")[0]
                        : "none",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {rank.title}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.65rem",
                      color: "oklch(0.5 0.03 260)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {rank.levelReq}
                  </div>
                </div>

                {/* Status badge */}
                <div style={{ flexShrink: 0 }}>
                  {isCurrentRank && (
                    <span
                      style={{
                        padding: "0.25rem 0.65rem",
                        background: rank.color.replace(")", " / 0.2)"),
                        border: `1px solid ${rank.color.replace(")", " / 0.6)")}`,
                        borderRadius: "100px",
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        color: rank.color,
                        textShadow: rank.glow.split(",")[0],
                      }}
                    >
                      ◆ CURRENT
                    </span>
                  )}
                  {isUnlocked && !isCurrentRank && (
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.68rem",
                        color: "oklch(0.55 0.12 140)",
                      }}
                    >
                      ✓
                    </span>
                  )}
                  {!isUnlocked && (
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.68rem",
                        color: "oklch(0.35 0.03 260)",
                      }}
                    >
                      🔒
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer tip */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "0.85rem 1.25rem",
            background: "oklch(0.62 0.25 22 / 0.08)",
            border: "1px solid oklch(0.62 0.25 22 / 0.2)",
            borderRadius: "8px",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.75rem",
            color: "oklch(0.65 0.04 260)",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          ⚡ Complete missions daily to earn XP and level up. Higher levels
          unlock harder challenges and greater rewards.
        </div>
      </div>
    </div>
  );
}
