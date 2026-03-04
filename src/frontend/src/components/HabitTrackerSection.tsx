import { useEffect, useState } from "react";

interface Habit {
  id: number;
  name: string;
  icon: string;
  category: string;
}

const HABITS: Habit[] = [
  { id: 0, name: "MORNING WORKOUT", icon: "🏋", category: "Fitness" },
  { id: 1, name: "DAILY READING", icon: "📖", category: "Knowledge" },
  { id: 2, name: "MEDITATION", icon: "🧘", category: "Mind" },
  { id: 3, name: "HEALTHY EATING", icon: "🥗", category: "Health" },
  { id: 4, name: "COLD SHOWER", icon: "🚿", category: "Discipline" },
  { id: 5, name: "NO JUNK FOOD", icon: "🚫", category: "Health" },
];

interface HabitData {
  streak: number;
  bestStreak: number;
  lastCheckin: string | null;
}

type HabitsStorage = Record<number, HabitData>;

const STORAGE_KEY = "bmx_habits";

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function loadHabits(): HabitsStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as HabitsStorage;
  } catch {
    // ignore
  }
  return {};
}

function saveHabits(data: HabitsStorage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const CATEGORY_COLORS: Record<string, string> = {
  Fitness: "oklch(0.62 0.25 22)",
  Knowledge: "oklch(0.62 0.22 295)",
  Mind: "oklch(0.62 0.22 295)",
  Health: "oklch(0.62 0.22 160)",
  Discipline: "oklch(0.62 0.25 22)",
};

export function HabitTrackerSection() {
  const [habitsData, setHabitsData] = useState<HabitsStorage>({});

  useEffect(() => {
    setHabitsData(loadHabits());
  }, []);

  const handleCheckin = (habitId: number) => {
    const today = getTodayStr();
    const yesterday = getYesterdayStr();
    const current = habitsData[habitId] ?? {
      streak: 0,
      bestStreak: 0,
      lastCheckin: null,
    };

    if (current.lastCheckin === today) return; // already done today

    let newStreak: number;
    if (current.lastCheckin === yesterday) {
      newStreak = current.streak + 1;
    } else {
      newStreak = 1;
    }

    const newBest = Math.max(current.bestStreak, newStreak);

    const updated: HabitsStorage = {
      ...habitsData,
      [habitId]: {
        streak: newStreak,
        bestStreak: newBest,
        lastCheckin: today,
      },
    };

    setHabitsData(updated);
    saveHabits(updated);
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
              fontFamily: '"Orbitron", monospace',
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

        {/* Habit cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {HABITS.map((habit, idx) => {
            const data = habitsData[habit.id] ?? {
              streak: 0,
              bestStreak: 0,
              lastCheckin: null,
            };
            const today = getTodayStr();
            const checkedInToday = data.lastCheckin === today;
            const catColor =
              CATEGORY_COLORS[habit.category] ?? "oklch(0.62 0.22 295)";
            const hasStreak = data.streak > 0;

            return (
              <div
                key={habit.id}
                data-ocid={`habits.item.${idx + 1}`}
                style={{
                  padding: "1.5rem",
                  background: checkedInToday
                    ? "oklch(0.12 0.02 260 / 0.9)"
                    : "oklch(0.1 0.015 260 / 0.8)",
                  border: `1px solid ${
                    checkedInToday
                      ? catColor.replace(")", " / 0.5)")
                      : catColor.replace(")", " / 0.2)")
                  }`,
                  borderRadius: "10px",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: checkedInToday
                    ? `0 0 20px ${catColor.replace(")", " / 0.2)")}`
                    : "none",
                }}
              >
                {/* Checked-in shimmer */}
                {checkedInToday && (
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
                      fontFamily: '"Orbitron", monospace',
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
                        fontFamily: '"Orbitron", monospace',
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
                      {hasStreak && <span>{data.streak}</span>}
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
                        fontFamily: '"Orbitron", monospace',
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "oklch(0.82 0.18 85)",
                        textShadow: "0 0 8px oklch(0.82 0.18 85 / 0.4)",
                        lineHeight: 1,
                      }}
                    >
                      {data.bestStreak}
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
                {checkedInToday ? (
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
                        fontFamily: '"Orbitron", monospace',
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
                    className="btn-neon-ghost"
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      fontSize: "0.7rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      borderColor: catColor.replace(")", " / 0.6)"),
                      color: catColor,
                      boxShadow: `0 0 6px ${catColor.replace(")", " / 0.15)")}`,
                    }}
                  >
                    ⚡ CHECK IN
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
