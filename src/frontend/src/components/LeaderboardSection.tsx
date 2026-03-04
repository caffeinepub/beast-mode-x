import { useLeaderboard } from "@/hooks/useBackend";
import { Crown } from "lucide-react";

const RANK_COLORS = [
  {
    color: "oklch(0.82 0.18 85)",
    label: "GOLD",
    shadow: "0 0 12px oklch(0.82 0.18 85 / 0.6)",
  },
  {
    color: "oklch(0.78 0.04 260)",
    label: "SILVER",
    shadow: "0 0 12px oklch(0.78 0.04 260 / 0.4)",
  },
  {
    color: "oklch(0.65 0.12 50)",
    label: "BRONZE",
    shadow: "0 0 12px oklch(0.65 0.12 50 / 0.4)",
  },
];

interface RankBadgeInfo {
  name: string;
  image: string;
  color: string;
}

function getPlayerRankInfo(xp: number): RankBadgeInfo {
  if (xp >= 25000) {
    return {
      name: "BEAST",
      image: "/assets/generated/badge-beast-transparent.dim_200x200.png",
      color: "oklch(0.62 0.25 22)",
    };
  }
  if (xp >= 10000) {
    return {
      name: "LEGEND",
      image: "/assets/generated/badge-legend-transparent.dim_200x200.png",
      color: "oklch(0.82 0.18 85)",
    };
  }
  if (xp >= 5000) {
    return {
      name: "ELITE",
      image: "/assets/generated/badge-elite-transparent.dim_200x200.png",
      color: "oklch(0.62 0.22 295)",
    };
  }
  if (xp >= 1000) {
    return {
      name: "WARRIOR",
      image: "/assets/generated/badge-warrior-transparent.dim_200x200.png",
      color: "oklch(0.62 0.22 295)",
    };
  }
  return {
    name: "NOVICE",
    image: "/assets/generated/badge-novice-transparent.dim_200x200.png",
    color: "oklch(0.65 0.04 260)",
  };
}

// Fallback data for display when backend not connected
const SAMPLE_LEADERS = [
  { username: "SHADOWBLADE_X", level: 42n, xp: 41850n },
  { username: "NEON_REAPER", level: 38n, xp: 37620n },
  { username: "CYBERPUNK_GOD", level: 35n, xp: 34800n },
  { username: "VOID_STRIKER", level: 31n, xp: 30450n },
  { username: "GHOST_PROTOCOL", level: 28n, xp: 27200n },
  { username: "IRONCLAD_99", level: 25n, xp: 24300n },
  { username: "QUANTUM_BEAST", level: 22n, xp: 21750n },
  { username: "PLASMA_KNIGHT", level: 19n, xp: 18500n },
  { username: "NIGHT_CRAWLER", level: 17n, xp: 16800n },
  { username: "STORM_RIDER", level: 14n, xp: 13600n },
];

export function LeaderboardSection() {
  const { data: leaders, isLoading, isError } = useLeaderboard();

  const displayLeaders =
    leaders && leaders.length > 0 ? leaders.slice(0, 10) : SAMPLE_LEADERS;

  return (
    <section
      id="leaderboard"
      data-ocid="leaderboard.section"
      style={{
        padding: "100px 2rem 80px",
        background: "oklch(0.06 0.01 255)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.82 0.18 85 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.18 85 / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse, oklch(0.82 0.18 85 / 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
              padding: "0.25rem 0.75rem",
              background: "oklch(0.82 0.18 85 / 0.1)",
              border: "1px solid oklch(0.82 0.18 85 / 0.3)",
              borderRadius: "100px",
            }}
          >
            <Crown size={12} style={{ color: "oklch(0.82 0.18 85)" }} />
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.82 0.18 85)",
              }}
            >
              HALL OF LEGENDS
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Orbitron", monospace',
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              margin: "0 0 1rem 0",
              background:
                "linear-gradient(135deg, oklch(0.9 0.15 85) 0%, oklch(0.75 0.12 60) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            HALL OF LEGENDS
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.95rem",
              color: "oklch(0.6 0.04 260)",
            }}
          >
            The most consistent self-improvers in the arena
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            data-ocid="leaderboard.loading_state"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "3rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid oklch(0.82 0.18 85 / 0.2)",
                  borderTop: "2px solid oklch(0.82 0.18 85)",
                  borderRadius: "50%",
                  animation: "spinGlow 0.8s linear infinite",
                }}
              />
              <span
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.82 0.18 85)",
                }}
              >
                LOADING LEGENDS...
              </span>
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div
            data-ocid="leaderboard.error_state"
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "oklch(0.62 0.25 22)",
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.9rem",
            }}
          >
            Failed to load leaderboard. Showing cached data.
          </div>
        )}

        {/* Leaderboard table */}
        {!isLoading && (
          <div
            data-ocid="leaderboard.table"
            style={{
              background: "oklch(0.09 0.015 260 / 0.8)",
              border: "1px solid oklch(0.25 0.04 260 / 0.6)",
              borderRadius: "12px",
              overflow: "hidden",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 70px 80px 100px",
                padding: "0.75rem 1.5rem",
                background: "oklch(0.12 0.02 260)",
                borderBottom: "1px solid oklch(0.25 0.04 260 / 0.6)",
                gap: "1rem",
              }}
            >
              {["RANK", "PLAYER", "BADGE", "LEVEL", "XP"].map((label) => (
                <span
                  key={label}
                  style={{
                    fontFamily: '"Orbitron", monospace',
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "oklch(0.5 0.04 260)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Rows */}
            {displayLeaders.length === 0 && !isLoading ? (
              <div
                data-ocid="leaderboard.empty_state"
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  fontFamily: '"Sora", sans-serif',
                  color: "oklch(0.5 0.04 260)",
                  fontSize: "0.9rem",
                }}
              >
                No players yet. Be the first legend!
              </div>
            ) : (
              displayLeaders.slice(0, 10).map((player, idx) => {
                const rank = idx + 1;
                const rankInfo = RANK_COLORS[idx] ?? null;
                const isFirst = rank === 1;
                const playerRank = getPlayerRankInfo(Number(player.xp));

                return (
                  <div
                    key={`${player.username}-${idx}`}
                    data-ocid={`leaderboard.row.item.${rank}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr 70px 80px 100px",
                      padding: "0.9rem 1.5rem",
                      gap: "1rem",
                      alignItems: "center",
                      borderBottom:
                        idx < displayLeaders.length - 1
                          ? "1px solid oklch(0.18 0.02 260 / 0.8)"
                          : "none",
                      background: isFirst
                        ? "oklch(0.82 0.18 85 / 0.06)"
                        : idx % 2 === 0
                          ? "transparent"
                          : "oklch(0.08 0.01 260 / 0.4)",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "oklch(0.62 0.22 295 / 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        isFirst
                          ? "oklch(0.82 0.18 85 / 0.06)"
                          : idx % 2 === 0
                            ? "transparent"
                            : "oklch(0.08 0.01 260 / 0.4)";
                    }}
                  >
                    {/* Rank */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      {isFirst && (
                        <Crown
                          size={14}
                          style={{
                            color: "oklch(0.82 0.18 85)",
                            filter:
                              "drop-shadow(0 0 4px oklch(0.82 0.18 85 / 0.8))",
                          }}
                        />
                      )}
                      <span
                        style={{
                          fontFamily: '"Orbitron", monospace',
                          fontSize: isFirst ? "1rem" : "0.85rem",
                          fontWeight: 700,
                          color: rankInfo
                            ? rankInfo.color
                            : "oklch(0.62 0.25 22)",
                          textShadow: rankInfo ? rankInfo.shadow : "none",
                        }}
                      >
                        #{rank}
                      </span>
                    </div>

                    {/* Player name */}
                    <span
                      style={{
                        fontFamily: '"Orbitron", monospace',
                        fontSize: "0.75rem",
                        fontWeight: isFirst ? 700 : 500,
                        letterSpacing: "0.06em",
                        color: isFirst
                          ? "oklch(0.9 0.04 260)"
                          : "oklch(0.78 0.03 260)",
                        textShadow: isFirst
                          ? "0 0 8px oklch(0.82 0.18 85 / 0.3)"
                          : "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {player.username}
                    </span>

                    {/* Rank Badge */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <img
                        src={playerRank.image}
                        alt={playerRank.name}
                        width={32}
                        height={32}
                        style={{
                          filter: `drop-shadow(0 0 4px ${playerRank.color.replace(")", " / 0.6)")})`,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: '"Orbitron", monospace',
                          fontSize: "0.45rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: playerRank.color,
                        }}
                      >
                        {playerRank.name}
                      </span>
                    </div>

                    {/* Level */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.2rem 0.5rem",
                        background: "oklch(0.62 0.25 22 / 0.1)",
                        border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                        borderRadius: "4px",
                        width: "fit-content",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"Orbitron", monospace',
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "oklch(0.62 0.25 22)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        LVL {Number(player.level)}
                      </span>
                    </div>

                    {/* XP */}
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "0.8rem",
                        color: rankInfo
                          ? rankInfo.color
                          : "oklch(0.62 0.22 295)",
                        fontWeight: 600,
                        textShadow: rankInfo ? rankInfo.shadow : "none",
                      }}
                    >
                      {Number(player.xp).toLocaleString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
