import { useAuth } from "@/components/auth/AuthProvider";
import { useCompleteHabit, useHabitCompletions } from "@/hooks/useBackend";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
}

const HABITS: Habit[] = [
  {
    id: "morning-workout",
    name: "MORNING WORKOUT",
    icon: "🏋",
    category: "Fitness",
  },
  { id: "meditation", name: "MEDITATION", icon: "🧘", category: "Mind" },
  {
    id: "read-20-pages",
    name: "READ 20 PAGES",
    icon: "📖",
    category: "Knowledge",
  },
  { id: "no-junk-food", name: "NO JUNK FOOD", icon: "🚫", category: "Health" },
  {
    id: "sleep-by-11pm",
    name: "SLEEP BY 11PM",
    icon: "😴",
    category: "Discipline",
  },
  {
    id: "cold-shower",
    name: "COLD SHOWER",
    icon: "🚿",
    category: "Discipline",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Fitness: "oklch(0.62 0.25 22)",
  Knowledge: "oklch(0.62 0.22 295)",
  Mind: "oklch(0.62 0.22 295)",
  Health: "oklch(0.62 0.22 160)",
  Discipline: "oklch(0.62 0.25 22)",
};

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0] ?? "";
}

/**
 * Calculate streak for a habit from its completion dates.
 * Returns the number of consecutive days ending at today (or yesterday if not done today).
 */
function calculateStreak(
  habitId: string,
  completions: string[],
): { streak: number; bestStreak: number; doneToday: boolean } {
  // Filter completions for this habit: format "habitId-YYYY-MM-DD"
  const prefix = `${habitId}-`;
  const dates = completions
    .filter((c) => c.startsWith(prefix))
    .map((c) => c.slice(prefix.length))
    .sort()
    .reverse();

  if (dates.length === 0) return { streak: 0, bestStreak: 0, doneToday: false };

  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  const doneToday = dates.includes(today);

  // Calculate current streak
  let streak = 0;
  let cursor = doneToday ? today : yesterday;
  const dateSet = new Set(dates);

  while (dateSet.has(cursor)) {
    streak++;
    const prev = new Date(cursor);
    prev.setDate(prev.getDate() - 1);
    cursor = prev.toISOString().split("T")[0] ?? "";
  }

  // Calculate best streak (max consecutive)
  let bestStreak = 0;
  let currentRun = 1;
  const sortedAsc = [...dates].sort();
  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1] ?? "");
    const curr = new Date(sortedAsc[i] ?? "");
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
    if (diffDays === 1) {
      currentRun++;
      bestStreak = Math.max(bestStreak, currentRun);
    } else {
      currentRun = 1;
    }
  }
  bestStreak = Math.max(bestStreak, currentRun, streak);

  return { streak, bestStreak, doneToday };
}

export function HabitTrackerSection() {
  const { isLoggedIn } = useAuth();
  const { data: completions = [], isLoading } = useHabitCompletions();
  const completeHabit = useCompleteHabit();

  const handleCheckin = async (habitId: string) => {
    if (!isLoggedIn) {
      toast.error("Login to track habits!");
      return;
    }
    const today = getTodayStr();
    const key = `${habitId}-${today}`;
    if (completions.includes(key)) return; // already done today

    try {
      await completeHabit.mutateAsync({ habitId: key, date: today });
      toast.success("✓ Habit checked in! Keep the streak going!", {
        duration: 2500,
      });
    } catch {
      toast.error("Failed to save habit. Try again.");
    }
  };

  return (
    <section
      id="habits"
      data-ocid="habits.section"
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
            "linear-gradient(oklch(0.62 0.22 295 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "-200px",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, oklch(0.62 0.22 295 / 0.06) 0%, transparent 70%)",
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
              background: "oklch(0.62 0.22 295 / 0.1)",
              border: "1px solid oklch(0.62 0.22 295 / 0.3)",
              borderRadius: "100px",
            }}
          >
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.22 295)",
              }}
            >
              CONSISTENCY TRACKER
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              margin: 0,
              background:
                "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.7 0.28 22) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            HABIT TRACKER
          </h2>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div
            data-ocid="habits.loading_state"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "3rem",
            }}
          >
            <Loader2
              style={{
                animation: "spinGlow 1s linear infinite",
                color: "oklch(0.62 0.22 295)",
              }}
              size={28}
            />
          </div>
        ) : (
          /* Habit cards grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.25rem",
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {HABITS.map((habit, idx) => {
              const { streak, bestStreak, doneToday } = calculateStreak(
                habit.id,
                completions,
              );
              const catColor =
                CATEGORY_COLORS[habit.category] ?? "oklch(0.62 0.22 295)";
              const hasStreak = streak > 0;
              const isPending = completeHabit.isPending;

              return (
                <div
                  key={habit.id}
                  data-ocid={`habits.item.${idx + 1}`}
                  style={{
                    padding: "1.5rem",
                    background: doneToday
                      ? "oklch(0.12 0.02 260 / 0.9)"
                      : "oklch(0.1 0.015 260 / 0.8)",
                    border: `1px solid ${
                      doneToday
                        ? catColor.replace(")", " / 0.5)")
                        : catColor.replace(")", " / 0.2)")
                    }`,
                    borderRadius: "10px",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: doneToday
                      ? `0 0 20px ${catColor.replace(")", " / 0.2)")}`
                      : "none",
                  }}
                >
                  {/* Checked-in shimmer */}
                  {doneToday && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(135deg, ${catColor.replace(")", " / 0.05)")} 0%, transparent 60%)`,
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
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        color: catColor,
                      }}
                    >
                      {habit.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Icon + Name row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "2rem", lineHeight: 1 }}>
                      {habit.icon}
                    </span>
                    <h3
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "oklch(0.9 0.02 260)",
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {habit.name}
                    </h3>
                  </div>

                  {/* Streak display */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      background: "oklch(0.08 0.01 260 / 0.6)",
                      borderRadius: "6px",
                      border: "1px solid oklch(0.2 0.02 260 / 0.5)",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: hasStreak ? "1.5rem" : "1.2rem",
                          fontWeight: 900,
                          color: hasStreak ? catColor : "oklch(0.35 0.03 260)",
                          textShadow: hasStreak
                            ? `0 0 12px ${catColor.replace(")", " / 0.6)")}`
                            : "none",
                          lineHeight: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        {hasStreak ? "🔥" : "—"}
                        {hasStreak && <span>{streak}</span>}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: "0.55rem",
                          color: "oklch(0.45 0.03 260)",
                          letterSpacing: "0.1em",
                          marginTop: "0.25rem",
                        }}
                      >
                        {hasStreak ? "DAY STREAK" : "NO STREAK"}
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "oklch(0.82 0.18 85)",
                          textShadow: "0 0 8px oklch(0.82 0.18 85 / 0.4)",
                          lineHeight: 1,
                        }}
                      >
                        {bestStreak}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: "0.55rem",
                          color: "oklch(0.45 0.03 260)",
                          letterSpacing: "0.1em",
                          marginTop: "0.25rem",
                        }}
                      >
                        BEST
                      </div>
                    </div>
                  </div>

                  {/* Check in button */}
                  {doneToday ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        padding: "0.55rem",
                        background: `${catColor.replace(")", " / 0.15)")}`,
                        border: `1px solid ${catColor.replace(")", " / 0.4)")}`,
                        borderRadius: "4px",
                        color: catColor,
                        boxShadow: `0 0 8px ${catColor.replace(")", " / 0.15)")}`,
                      }}
                    >
                      <span style={{ fontSize: "0.9rem" }}>✓</span>
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                        }}
                      >
                        CHECKED IN TODAY
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      data-ocid={`habits.checkin.button.${idx + 1}`}
                      onClick={() => handleCheckin(habit.id)}
                      disabled={isPending}
                      className="btn-neon-ghost"
                      style={{
                        width: "100%",
                        padding: "0.55rem",
                        fontSize: "0.7rem",
                        borderRadius: "4px",
                        cursor: isPending ? "not-allowed" : "pointer",
                        borderColor: catColor.replace(")", " / 0.6)"),
                        color: catColor,
                        boxShadow: `0 0 6px ${catColor.replace(")", " / 0.15)")}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        opacity: isPending ? 0.7 : 1,
                      }}
                    >
                      {isPending ? (
                        <Loader2
                          size={12}
                          style={{ animation: "spinGlow 1s linear infinite" }}
                        />
                      ) : null}
                      ⚡ CHECK IN
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
