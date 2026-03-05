import { X } from "lucide-react";

interface RankTier {
  badgeImage: string;
  title: string;
  levelReq: string;
  color: string;
  glow: string;
  levelMin: number;
  desc: string;
}

export const ALL_RANKS: RankTier[] = [
  {
    badgeImage: "/assets/generated/rank-badge-e-rank.dim_300x300.png",
    title: "E-RANK",
    levelReq: "Level 1–2",
    color: "oklch(0.6 0.05 260)",
    glow: "0 0 8px oklch(0.6 0.05 260 / 0.4)",
    levelMin: 1,
    desc: "Barely awakened. The journey begins here.",
  },
  {
    badgeImage: "/assets/generated/rank-badge-d-rank.dim_300x300.png",
    title: "D-RANK",
    levelReq: "Level 3–5",
    color: "oklch(0.7 0.15 50)",
    glow: "0 0 12px oklch(0.7 0.15 50 / 0.6)",
    levelMin: 3,
    desc: "The weak learn to survive. You are learning.",
  },
  {
    badgeImage: "/assets/generated/rank-badge-c-rank.dim_300x300.png",
    title: "C-RANK",
    levelReq: "Level 6–10",
    color: "oklch(0.68 0.2 140)",
    glow: "0 0 14px oklch(0.68 0.2 140 / 0.6)",
    levelMin: 6,
    desc: "A hunter recognized by the system. You have potential.",
  },
  {
    badgeImage: "/assets/generated/rank-badge-b-rank.dim_300x300.png",
    title: "B-RANK",
    levelReq: "Level 11–20",
    color: "oklch(0.65 0.24 240)",
    glow: "0 0 14px oklch(0.65 0.24 240 / 0.7)",
    levelMin: 11,
    desc: "Your power grows. Demons of the mid-tier tremble.",
  },
  {
    badgeImage: "/assets/generated/rank-badge-a-rank.dim_300x300.png",
    title: "A-RANK",
    levelReq: "Level 21–30",
    color: "oklch(0.72 0.26 295)",
    glow: "0 0 16px oklch(0.72 0.26 295 / 0.8)",
    levelMin: 21,
    desc: "Elite hunter. A name spoken with respect in the guild halls.",
  },
  {
    badgeImage: "/assets/generated/rank-badge-s-rank.dim_300x300.png",
    title: "S-RANK",
    levelReq: "Level 31–50",
    color: "oklch(0.88 0.2 85)",
    glow: "0 0 18px oklch(0.88 0.2 85 / 0.85)",
    levelMin: 31,
    desc: "The pinnacle of human power. One in ten thousand.",
  },
  {
    badgeImage: "/assets/generated/rank-badge-national.dim_300x300.png",
    title: "NATIONAL LEVEL",
    levelReq: "Level 51–75",
    color: "oklch(0.72 0.28 22)",
    glow: "0 0 20px oklch(0.72 0.28 22 / 0.9), 0 0 40px oklch(0.82 0.18 85 / 0.4)",
    levelMin: 51,
    desc: "A force that shapes nations. Your power is a weapon of war.",
  },
  {
    badgeImage: "/assets/generated/rank-badge-shadow-monarch.dim_300x300.png",
    title: "SHADOW MONARCH",
    levelReq: "Level 76–100",
    color: "oklch(0.72 0.22 295)",
    glow: "0 0 22px oklch(0.72 0.22 295 / 0.9), 0 0 45px oklch(0.55 0.18 295 / 0.5)",
    levelMin: 76,
    desc: "Ruler of shadows. An army of the dead bows to your will.",
  },
  {
    badgeImage: "/assets/generated/rank-badge-beast-mode.dim_300x300.png",
    title: "BEAST MODE X",
    levelReq: "Level 101+",
    color: "oklch(0.72 0.28 22)",
    glow: "0 0 24px oklch(0.72 0.28 22 / 0.9), 0 0 50px oklch(0.62 0.22 295 / 0.6)",
    levelMin: 101,
    desc: "Transcendent being. Beyond all rankings. You ARE the system.",
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
          background: "oklch(0 0 0 / 0.92)",
          backdropFilter: "blur(20px)",
        }}
      />

      {/* Atmospheric glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 20%, oklch(0.62 0.25 22 / 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.25 22 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.025) 1px, transparent 1px)",
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
          background: "oklch(0.07 0.018 260)",
          border: "1px solid oklch(0.62 0.25 22 / 0.35)",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "620px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow:
            "0 0 80px oklch(0.62 0.25 22 / 0.12), 0 0 80px oklch(0.62 0.22 295 / 0.08), 0 40px 80px oklch(0 0 0 / 0.7)",
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
              "linear-gradient(90deg, transparent, oklch(0.62 0.25 22), oklch(0.62 0.22 295), oklch(0.88 0.2 85), transparent)",
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
            zIndex: 2,
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.58rem",
              letterSpacing: "0.35em",
              color: "oklch(0.62 0.25 22)",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            ◆ HUNTER RANK CLASSIFICATION ◆
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              letterSpacing: "0.1em",
              background:
                "linear-gradient(135deg, oklch(0.88 0.2 85) 0%, oklch(0.62 0.22 295) 50%, oklch(0.72 0.28 22) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0 0 0.5rem 0",
              textTransform: "uppercase",
            }}
          >
            ALL RANK TIERS
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.78rem",
              color: "oklch(0.5 0.04 260)",
              fontStyle: "italic",
            }}
          >
            "Arise. The weak will stay weak. The strong will grow stronger."
          </p>
        </div>

        {/* Rank list */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}
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
                    ? `${rank.color.replace(")", " / 0.1)")}`
                    : isUnlocked
                      ? "oklch(0.09 0.015 260)"
                      : "oklch(0.08 0.01 260 / 0.5)",
                  border: `1px solid ${
                    isCurrentRank
                      ? rank.color.replace(")", " / 0.65)")
                      : isUnlocked
                        ? rank.color.replace(")", " / 0.2)")
                        : "oklch(0.16 0.02 260 / 0.4)"
                  }`,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  boxShadow: isCurrentRank ? rank.glow : "none",
                  filter: isUnlocked
                    ? "none"
                    : "grayscale(0.7) brightness(0.5)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Current rank highlight beam */}
                {isCurrentRank && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "3px",
                      height: "100%",
                      background: rank.color,
                      boxShadow: `0 0 8px ${rank.color}`,
                    }}
                  />
                )}

                {/* Rank number */}
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "oklch(0.38 0.03 260)",
                    width: "16px",
                    flexShrink: 0,
                    textAlign: "right",
                  }}
                >
                  {idx + 1}
                </div>

                {/* Badge image */}
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    flexShrink: 0,
                    filter: isCurrentRank
                      ? `drop-shadow(0 0 8px ${rank.color.replace(")", " / 0.8)")})`
                      : "none",
                    animation: isCurrentRank
                      ? "float 4s ease-in-out infinite"
                      : "none",
                  }}
                >
                  <img
                    src={rank.badgeImage}
                    alt={rank.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Title + level req + desc */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontWeight: 900,
                      fontSize: "0.85rem",
                      letterSpacing: "0.1em",
                      color: isUnlocked ? rank.color : "oklch(0.38 0.03 260)",
                      textShadow: isCurrentRank
                        ? rank.glow.split(",")[0]
                        : "none",
                      marginBottom: "0.15rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {rank.title}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      color: isUnlocked
                        ? "oklch(0.5 0.03 260)"
                        : "oklch(0.35 0.02 260)",
                      letterSpacing: "0.05em",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {rank.levelReq}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.65rem",
                      color: isUnlocked
                        ? "oklch(0.58 0.04 260)"
                        : "oklch(0.35 0.02 260)",
                      fontStyle: "italic",
                      lineHeight: 1.4,
                    }}
                  >
                    "{rank.desc}"
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
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        color: rank.color,
                        textShadow: rank.glow.split(",")[0],
                        textTransform: "uppercase",
                      }}
                    >
                      ◆ NOW
                    </span>
                  )}
                  {isUnlocked && !isCurrentRank && (
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.75rem",
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
                        fontSize: "0.75rem",
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

        {/* Footer quote */}
        <div
          style={{
            marginTop: "1.75rem",
            padding: "1rem 1.25rem",
            background:
              "linear-gradient(135deg, oklch(0.62 0.25 22 / 0.06), oklch(0.62 0.22 295 / 0.06))",
            border: "1px solid oklch(0.62 0.25 22 / 0.18)",
            borderRadius: "8px",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.72rem",
            color: "oklch(0.6 0.04 260)",
            textAlign: "center",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          ⚡ Every level you gain is a battle you've already won inside
          yourself.
          <br />
          <span
            style={{
              color: "oklch(0.62 0.25 22)",
              fontSize: "0.65rem",
              fontStyle: "normal",
              fontWeight: 700,
            }}
          >
            ARISE. LEVEL UP. BECOME.
          </span>
        </div>
      </div>
    </div>
  );
}
