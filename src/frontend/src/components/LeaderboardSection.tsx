import { useLeaderboard } from "@/hooks/useBackend";
import { Crown, X } from "lucide-react";
import { useState } from "react";
import type { PlayerProfile } from "../backend.d";
import { ProfileView, getRankInfo } from "./PlayerDashboard";

const RANK_COLORS = [
  {
    color: "oklch(0.82 0.18 85)",
    shadow: "0 0 12px oklch(0.82 0.18 85 / 0.6)",
    label: "GOLD",
  },
  {
    color: "oklch(0.78 0.04 260)",
    shadow: "0 0 12px oklch(0.78 0.04 260 / 0.4)",
    label: "SILVER",
  },
  {
    color: "oklch(0.65 0.12 50)",
    shadow: "0 0 12px oklch(0.65 0.12 50 / 0.4)",
    label: "BRONZE",
  },
];

const SAMPLE_LEADERS: PlayerProfile[] = [
  {
    username: "SHADOWBLADE_X",
    level: 42n,
    xp: 41850n,
    age: 22n,
    gender: "male",
    goal: "Become Unstoppable",
    fitnessLevel: "Elite",
    bodyType: "athletic",
    skillPoints: 42n,
    martialArtsXP: 3200n,
    martialArtsLevel: 8n,
    completedMissions: [],
    achievements: [1n, 2n, 3n, 11n],
    stats: {
      strength: 85n,
      speed: 78n,
      endurance: 82n,
      intelligence: 71n,
      focus: 76n,
      aura: 79n,
    },
    categoryXP: {
      fitness: 12000n,
      martial: 9000n,
      intelligence: 7000n,
      focus: 6000n,
      discipline: 8000n,
      mindset: 5000n,
    },
  },
  {
    username: "NEON_REAPER",
    level: 38n,
    xp: 37620n,
    age: 24n,
    gender: "female",
    goal: "Build Muscle",
    fitnessLevel: "Advanced",
    bodyType: "athletic",
    skillPoints: 38n,
    martialArtsXP: 2600n,
    martialArtsLevel: 7n,
    completedMissions: [],
    achievements: [1n, 2n, 3n],
    stats: {
      strength: 79n,
      speed: 81n,
      endurance: 74n,
      intelligence: 68n,
      focus: 72n,
      aura: 75n,
    },
    categoryXP: {
      fitness: 11000n,
      martial: 7000n,
      intelligence: 5500n,
      focus: 5000n,
      discipline: 7000n,
      mindset: 4000n,
    },
  },
  {
    username: "CYBERPUNK_GOD",
    level: 35n,
    xp: 34800n,
    age: 20n,
    gender: "male",
    goal: "Discipline & Focus",
    fitnessLevel: "Advanced",
    bodyType: "slim",
    skillPoints: 35n,
    martialArtsXP: 2200n,
    martialArtsLevel: 6n,
    completedMissions: [],
    achievements: [1n, 2n],
    stats: {
      strength: 72n,
      speed: 75n,
      endurance: 71n,
      intelligence: 80n,
      focus: 83n,
      aura: 78n,
    },
    categoryXP: {
      fitness: 9000n,
      martial: 6500n,
      intelligence: 9000n,
      focus: 8000n,
      discipline: 9000n,
      mindset: 6000n,
    },
  },
  {
    username: "VOID_STRIKER",
    level: 31n,
    xp: 30450n,
    age: 26n,
    gender: "male",
    goal: "Build Muscle",
    fitnessLevel: "Advanced",
    bodyType: "bulky",
    skillPoints: 31n,
    martialArtsXP: 1800n,
    martialArtsLevel: 5n,
    completedMissions: [],
    achievements: [1n, 2n],
    stats: {
      strength: 88n,
      speed: 65n,
      endurance: 80n,
      intelligence: 60n,
      focus: 65n,
      aura: 68n,
    },
    categoryXP: {
      fitness: 13000n,
      martial: 5000n,
      intelligence: 3000n,
      focus: 4000n,
      discipline: 6000n,
      mindset: 3000n,
    },
  },
  {
    username: "GHOST_PROTOCOL",
    level: 28n,
    xp: 27200n,
    age: 23n,
    gender: "other",
    goal: "Mental Clarity",
    fitnessLevel: "Intermediate",
    bodyType: "average",
    skillPoints: 28n,
    martialArtsXP: 1500n,
    martialArtsLevel: 5n,
    completedMissions: [],
    achievements: [1n],
    stats: {
      strength: 65n,
      speed: 70n,
      endurance: 68n,
      intelligence: 85n,
      focus: 82n,
      aura: 88n,
    },
    categoryXP: {
      fitness: 6000n,
      martial: 4000n,
      intelligence: 10000n,
      focus: 9000n,
      discipline: 5000n,
      mindset: 7000n,
    },
  },
  {
    username: "IRONCLAD_99",
    level: 25n,
    xp: 24300n,
    age: 28n,
    gender: "male",
    goal: "Build Muscle",
    fitnessLevel: "Advanced",
    bodyType: "bulky",
    skillPoints: 25n,
    martialArtsXP: 1200n,
    martialArtsLevel: 4n,
    completedMissions: [],
    achievements: [1n],
    stats: {
      strength: 90n,
      speed: 62n,
      endurance: 85n,
      intelligence: 58n,
      focus: 60n,
      aura: 65n,
    },
    categoryXP: {
      fitness: 12000n,
      martial: 4000n,
      intelligence: 2500n,
      focus: 3000n,
      discipline: 7000n,
      mindset: 2500n,
    },
  },
  {
    username: "QUANTUM_BEAST",
    level: 22n,
    xp: 21750n,
    age: 21n,
    gender: "female",
    goal: "Lose Weight",
    fitnessLevel: "Intermediate",
    bodyType: "average",
    skillPoints: 22n,
    martialArtsXP: 900n,
    martialArtsLevel: 4n,
    completedMissions: [],
    achievements: [1n],
    stats: {
      strength: 70n,
      speed: 76n,
      endurance: 72n,
      intelligence: 74n,
      focus: 71n,
      aura: 73n,
    },
    categoryXP: {
      fitness: 8000n,
      martial: 3000n,
      intelligence: 4000n,
      focus: 4500n,
      discipline: 5000n,
      mindset: 4000n,
    },
  },
  {
    username: "PLASMA_KNIGHT",
    level: 19n,
    xp: 18500n,
    age: 25n,
    gender: "male",
    goal: "Discipline & Focus",
    fitnessLevel: "Intermediate",
    bodyType: "athletic",
    skillPoints: 19n,
    martialArtsXP: 750n,
    martialArtsLevel: 3n,
    completedMissions: [],
    achievements: [],
    stats: {
      strength: 68n,
      speed: 71n,
      endurance: 70n,
      intelligence: 72n,
      focus: 75n,
      aura: 70n,
    },
    categoryXP: {
      fitness: 6000n,
      martial: 2500n,
      intelligence: 5000n,
      focus: 6000n,
      discipline: 6000n,
      mindset: 4500n,
    },
  },
  {
    username: "NIGHT_CRAWLER",
    level: 17n,
    xp: 16800n,
    age: 19n,
    gender: "male",
    goal: "Become Unstoppable",
    fitnessLevel: "Beginner",
    bodyType: "slim",
    skillPoints: 17n,
    martialArtsXP: 650n,
    martialArtsLevel: 3n,
    completedMissions: [],
    achievements: [],
    stats: {
      strength: 62n,
      speed: 68n,
      endurance: 65n,
      intelligence: 65n,
      focus: 66n,
      aura: 67n,
    },
    categoryXP: {
      fitness: 4500n,
      martial: 2000n,
      intelligence: 3500n,
      focus: 3000n,
      discipline: 4000n,
      mindset: 4000n,
    },
  },
  {
    username: "STORM_RIDER",
    level: 14n,
    xp: 13600n,
    age: 27n,
    gender: "female",
    goal: "Mental Clarity",
    fitnessLevel: "Beginner",
    bodyType: "slim",
    skillPoints: 14n,
    martialArtsXP: 500n,
    martialArtsLevel: 2n,
    completedMissions: [],
    achievements: [],
    stats: {
      strength: 58n,
      speed: 63n,
      endurance: 60n,
      intelligence: 72n,
      focus: 70n,
      aura: 68n,
    },
    categoryXP: {
      fitness: 3000n,
      martial: 1500n,
      intelligence: 4000n,
      focus: 4000n,
      discipline: 3000n,
      mindset: 3500n,
    },
  },
];

function PublicProfileModal({
  player,
  onClose,
}: { player: PlayerProfile; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
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
          position: "absolute",
          inset: 0,
          background: "oklch(0 0 0 / 0.85)",
          backdropFilter: "blur(12px)",
        }}
      />
      <div
        data-ocid="profile.dialog"
        style={{
          position: "relative",
          zIndex: 1,
          background: "oklch(0.09 0.015 260)",
          border: "1px solid oklch(0.62 0.25 22 / 0.4)",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow:
            "0 0 40px oklch(0.62 0.25 22 / 0.15), 0 40px 80px oklch(0 0 0 / 0.5)",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.62 0.25 22), oklch(0.62 0.22 295), transparent)",
            borderRadius: "16px 16px 0 0",
          }}
        />

        <button
          type="button"
          data-ocid="profile.close_button"
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
          }}
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              color: "oklch(0.55 0.04 260)",
              marginBottom: "0.4rem",
            }}
          >
            PLAYER PROFILE
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "1.5rem",
              letterSpacing: "0.1em",
              background:
                "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
            }}
          >
            {player.username}
          </h2>
        </div>

        <ProfileView profile={player} />
      </div>
    </div>
  );
}

export function LeaderboardSection() {
  const { data: leaders, isLoading, isError } = useLeaderboard();
  const [viewingPlayer, setViewingPlayer] = useState<PlayerProfile | null>(
    null,
  );

  const displayLeaders =
    leaders && leaders.length > 0 ? leaders.slice(0, 10) : SAMPLE_LEADERS;

  return (
    <>
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
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(oklch(0.82 0.18 85 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.18 85 / 0.025) 1px, transparent 1px)",
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
              "radial-gradient(ellipse, oklch(0.82 0.18 85 / 0.04) 0%, transparent 70%)",
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
                  fontFamily: '"Sora", sans-serif',
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
                fontFamily: '"Sora", sans-serif',
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
                    fontFamily: '"Sora", sans-serif',
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

          {isError && (
            <div
              data-ocid="leaderboard.error_state"
              style={{
                textAlign: "center",
                padding: "1rem",
                color: "oklch(0.62 0.25 22)",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              Showing sample data — connect wallet to see live rankings
            </div>
          )}

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
                  gridTemplateColumns: "56px 1fr 80px 100px 80px 100px",
                  padding: "0.75rem 1.5rem",
                  background: "oklch(0.12 0.02 260)",
                  borderBottom: "1px solid oklch(0.22 0.03 260 / 0.6)",
                  gap: "0.75rem",
                }}
                className="hidden sm:grid"
              >
                {["RANK", "PLAYER", "TITLE", "LEVEL", "MARTIAL", "XP"].map(
                  (label) => (
                    <span
                      key={label}
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        color: "oklch(0.5 0.04 260)",
                      }}
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>

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
                  const rankColor = RANK_COLORS[idx] ?? null;
                  const isFirst = rank === 1;
                  const rankInfo = getRankInfo(Number(player.level));

                  return (
                    <button
                      type="button"
                      key={`${player.username}-${idx}`}
                      data-ocid={`leaderboard.player.item.${rank}`}
                      onClick={() => setViewingPlayer(player)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "56px 1fr 80px 100px 80px 100px",
                        padding: "0.9rem 1.5rem",
                        gap: "0.75rem",
                        alignItems: "center",
                        width: "100%",
                        borderBottom:
                          idx < displayLeaders.length - 1
                            ? "1px solid oklch(0.16 0.02 260 / 0.8)"
                            : "none",
                        background: isFirst
                          ? "oklch(0.82 0.18 85 / 0.04)"
                          : "transparent",
                        transition: "background 0.2s ease",
                        cursor: "pointer",
                        border: "none",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "oklch(0.62 0.22 295 / 0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          isFirst
                            ? "oklch(0.82 0.18 85 / 0.04)"
                            : "transparent";
                      }}
                      className="grid grid-cols-3 sm:grid-cols-6"
                    >
                      {/* Rank */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        {isFirst && (
                          <Crown
                            size={13}
                            style={{
                              color: "oklch(0.82 0.18 85)",
                              filter:
                                "drop-shadow(0 0 4px oklch(0.82 0.18 85 / 0.8))",
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: isFirst ? "1rem" : "0.85rem",
                            fontWeight: 700,
                            color: rankColor
                              ? rankColor.color
                              : "oklch(0.62 0.25 22)",
                            textShadow: rankColor ? rankColor.shadow : "none",
                          }}
                        >
                          #{rank}
                        </span>
                      </div>

                      {/* Player name */}
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.78rem",
                          fontWeight: isFirst ? 700 : 500,
                          letterSpacing: "0.05em",
                          color: isFirst
                            ? "oklch(0.92 0.04 260)"
                            : "oklch(0.78 0.03 260)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {player.username}
                      </span>

                      {/* Rank title */}
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: rankInfo.color,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        className="hidden sm:block"
                      >
                        {rankInfo.badge} {rankInfo.title}
                      </span>

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
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            color: "oklch(0.62 0.25 22)",
                            letterSpacing: "0.06em",
                          }}
                        >
                          LVL {Number(player.level)}
                        </span>
                      </div>

                      {/* Martial arts level */}
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: "oklch(0.62 0.22 295)",
                          letterSpacing: "0.05em",
                        }}
                        className="hidden sm:block"
                      >
                        🥋 Lv.{Number(player.martialArtsLevel)}
                      </span>

                      {/* XP */}
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.8rem",
                          color: rankColor
                            ? rankColor.color
                            : "oklch(0.62 0.22 295)",
                          fontWeight: 600,
                          textShadow: rankColor ? rankColor.shadow : "none",
                        }}
                      >
                        {Number(player.xp).toLocaleString()}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>

      {/* Public profile modal */}
      {viewingPlayer && (
        <PublicProfileModal
          player={viewingPlayer}
          onClose={() => setViewingPlayer(null)}
        />
      )}
    </>
  );
}
