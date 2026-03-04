import { useAddXP } from "@/hooks/useBackend";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Mission {
  id: number;
  title: string;
  icon: string;
  xp: number;
  category: string;
  desc: string;
}

const DAILY_MISSIONS: Mission[] = [
  {
    id: 0,
    title: "30 MIN WORKOUT",
    icon: "💪",
    xp: 50,
    category: "Fitness",
    desc: "Any physical exercise for 30 minutes",
  },
  {
    id: 1,
    title: "READ 20 PAGES",
    icon: "📚",
    xp: 40,
    category: "Knowledge",
    desc: "Read any book for growth",
  },
  {
    id: 2,
    title: "MEDITATE 10 MIN",
    icon: "🧘",
    xp: 30,
    category: "Mind",
    desc: "Clear your mind, find your focus",
  },
  {
    id: 3,
    title: "NO SOCIAL MEDIA",
    icon: "📵",
    xp: 35,
    category: "Discipline",
    desc: "Stay off social media for 2 hours",
  },
  {
    id: 4,
    title: "SLEEP BY 11PM",
    icon: "🌙",
    xp: 45,
    category: "Recovery",
    desc: "Prioritize recovery and rest",
  },
];

function getDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getStorageKey(): string {
  return `bmx_missions_${getDateStr()}`;
}

interface DailyMissionsSectionProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Fitness: "oklch(0.62 0.25 22)",
  Knowledge: "oklch(0.62 0.22 295)",
  Mind: "oklch(0.62 0.22 295)",
  Discipline: "oklch(0.62 0.25 22)",
  Recovery: "oklch(0.62 0.22 295)",
};

export function DailyMissionsSection({
  isLoggedIn,
  onLoginClick,
}: DailyMissionsSectionProps) {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const addXp = useAddXP();

  // Load from localStorage on mount & date check
  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as number[];
        setCompletedIds(parsed);
      } catch {
        setCompletedIds([]);
      }
    } else {
      setCompletedIds([]);
    }
  }, []);

  const handleComplete = (mission: Mission) => {
    if (!isLoggedIn) {
      onLoginClick();
      return;
    }
    if (completedIds.includes(mission.id)) return;
    setPendingId(mission.id);

    addXp.mutate(BigInt(mission.xp), {
      onSuccess: () => {
        const updated = [...completedIds, mission.id];
        setCompletedIds(updated);
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
        setPendingId(null);
        toast.success(`+${mission.xp} XP earned! Mission complete.`);
      },
      onError: () => {
        setPendingId(null);
        toast.error("Failed to submit mission. Try again.");
      },
    });
  };

  const completedCount = completedIds.length;
  const totalXpAvailable = DAILY_MISSIONS.filter(
    (m) => !completedIds.includes(m.id),
  ).reduce((sum, m) => sum + m.xp, 0);
  const progressPct = (completedCount / DAILY_MISSIONS.length) * 100;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <section
      id="missions"
      data-ocid="missions.section"
      style={{
        padding: "100px 2rem 80px",
        background: "oklch(0.07 0.015 250)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.25 22 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.25 22 / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      {/* Corner glows */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, oklch(0.62 0.25 22 / 0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
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
              background: "oklch(0.62 0.25 22 / 0.1)",
              border: "1px solid oklch(0.62 0.25 22 / 0.3)",
              borderRadius: "100px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "oklch(0.62 0.25 22)",
                boxShadow: "0 0 8px oklch(0.62 0.25 22)",
                display: "inline-block",
                animation: "neonPulse 1.5s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.25 22)",
              }}
            >
              DAILY QUESTS
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
                "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TODAY'S MISSIONS
          </h2>

          {/* Date + stats row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "0.35rem 1rem",
                background: "oklch(0.09 0.015 260 / 0.8)",
                border: "1px solid oklch(0.25 0.04 260 / 0.6)",
                borderRadius: "100px",
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.7rem",
                color: "oklch(0.72 0.04 260)",
                letterSpacing: "0.08em",
              }}
            >
              📅 {today}
            </div>
            <div
              style={{
                padding: "0.35rem 1rem",
                background: "oklch(0.62 0.25 22 / 0.1)",
                border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                borderRadius: "100px",
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.7rem",
                color: "oklch(0.62 0.25 22)",
                letterSpacing: "0.08em",
              }}
            >
              ⚡ {totalXpAvailable} XP available
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto 3rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: '"Orbitron", monospace',
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "oklch(0.62 0.22 295)",
              }}
            >
              MISSION PROGRESS
            </span>
            <span
              style={{
                fontFamily: '"Orbitron", monospace',
                fontSize: "0.75rem",
                fontWeight: 700,
                color:
                  completedCount === DAILY_MISSIONS.length
                    ? "oklch(0.62 0.22 160)"
                    : "oklch(0.72 0.04 260)",
              }}
            >
              {completedCount}/{DAILY_MISSIONS.length} COMPLETE
              {completedCount === DAILY_MISSIONS.length && " 🏆"}
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "oklch(0.15 0.02 260)",
              borderRadius: "3px",
              overflow: "hidden",
              boxShadow: "inset 0 1px 3px oklch(0 0 0 / 0.5)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background:
                  completedCount === DAILY_MISSIONS.length
                    ? "linear-gradient(90deg, oklch(0.62 0.22 160) 0%, oklch(0.72 0.22 140) 100%)"
                    : "linear-gradient(90deg, oklch(0.62 0.25 22) 0%, oklch(0.62 0.22 295) 100%)",
                boxShadow:
                  completedCount === DAILY_MISSIONS.length
                    ? "0 0 10px oklch(0.62 0.22 160 / 0.7)"
                    : "0 0 8px oklch(0.62 0.22 295 / 0.6)",
                borderRadius: "3px",
                transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        </div>

        {/* Mission cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DAILY_MISSIONS.map((mission, idx) => {
            const completed = completedIds.includes(mission.id);
            const isPending = pendingId === mission.id;
            const catColor =
              CATEGORY_COLORS[mission.category] ?? "oklch(0.62 0.22 295)";

            return (
              <div
                key={mission.id}
                data-ocid={`missions.item.${idx + 1}`}
                style={{
                  padding: "1.5rem",
                  background: completed
                    ? "oklch(0.1 0.03 160 / 0.3)"
                    : "oklch(0.1 0.015 260 / 0.8)",
                  border: `1px solid ${
                    completed
                      ? "oklch(0.62 0.22 160 / 0.4)"
                      : `${catColor.replace(")", " / 0.25)")}`
                  }`,
                  borderRadius: "10px",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: completed
                    ? "0 0 16px oklch(0.62 0.22 160 / 0.15)"
                    : "none",
                }}
              >
                {/* Completed overlay shimmer */}
                {completed && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.22 160 / 0.05) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Category chip */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.2rem 0.6rem",
                    background: `${catColor.replace(")", " / 0.1)")}`,
                    border: `1px solid ${catColor.replace(")", " / 0.3)")}`,
                    borderRadius: "100px",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      color: catColor,
                    }}
                  >
                    {mission.category.toUpperCase()}
                  </span>
                </div>

                {/* Icon + Title */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "2rem",
                      lineHeight: 1,
                      filter: completed ? "grayscale(0.3)" : "none",
                    }}
                  >
                    {mission.icon}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: '"Orbitron", monospace',
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: completed
                          ? "oklch(0.62 0.22 160)"
                          : "oklch(0.9 0.02 260)",
                        margin: 0,
                        marginBottom: "0.35rem",
                        lineHeight: 1.3,
                        textDecoration: completed ? "line-through" : "none",
                        textDecorationColor: "oklch(0.62 0.22 160 / 0.5)",
                      }}
                    >
                      {mission.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.78rem",
                        color: "oklch(0.58 0.03 260)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {mission.desc}
                    </p>
                  </div>
                </div>

                {/* XP + Action row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid oklch(0.2 0.02 260 / 0.6)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.3rem 0.6rem",
                      background: "oklch(0.62 0.25 22 / 0.1)",
                      border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                      borderRadius: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Orbitron", monospace',
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "oklch(0.62 0.25 22)",
                        textShadow: "0 0 6px oklch(0.62 0.25 22 / 0.6)",
                      }}
                    >
                      +{mission.xp} XP
                    </span>
                  </div>

                  {completed ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.4rem 0.8rem",
                        background: "oklch(0.62 0.22 160 / 0.15)",
                        border: "1px solid oklch(0.62 0.22 160 / 0.4)",
                        borderRadius: "4px",
                        color: "oklch(0.62 0.22 160)",
                        boxShadow: "0 0 8px oklch(0.62 0.22 160 / 0.2)",
                      }}
                    >
                      <CheckCircle size={12} />
                      <span
                        style={{
                          fontFamily: '"Orbitron", monospace',
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        COMPLETED
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      data-ocid={`missions.complete.button.${idx + 1}`}
                      onClick={() => handleComplete(mission)}
                      disabled={isPending}
                      className="btn-neon-red"
                      style={{
                        padding: "0.4rem 1rem",
                        fontSize: "0.65rem",
                        borderRadius: "4px",
                        cursor: isPending ? "not-allowed" : "pointer",
                        opacity: isPending ? 0.7 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      {isPending ? (
                        <>
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              border: "1.5px solid oklch(0.98 0 0 / 0.3)",
                              borderTop: "1.5px solid oklch(0.98 0 0)",
                              borderRadius: "50%",
                              animation: "spinGlow 0.8s linear infinite",
                            }}
                          />
                          SAVING...
                        </>
                      ) : (
                        "✓ COMPLETE"
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Not logged in notice */}
        {!isLoggedIn && (
          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
              padding: "1rem",
              background: "oklch(0.09 0.015 260 / 0.6)",
              border: "1px solid oklch(0.25 0.04 260 / 0.4)",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.82rem",
                color: "oklch(0.6 0.04 260)",
                margin: 0,
              }}
            >
              🔒 Login to save your mission progress and earn XP on the
              blockchain
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
