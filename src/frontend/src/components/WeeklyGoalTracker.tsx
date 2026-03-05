import { useAuth } from "@/components/auth/AuthProvider";
import { usePlayerProfile } from "@/hooks/useBackend";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WEEKLY_GOAL = 5;

function getThisWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  // Adjust so Monday = 0
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0] ?? "";
  });
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

export function WeeklyGoalTracker() {
  const { isLoggedIn } = useAuth();
  const { data: profile } = usePlayerProfile();

  const weekDates = getThisWeekDates();
  const today = getTodayString();
  const weeklyWorkouts = profile?.weeklyWorkouts ?? [];

  // Count completed days this week
  const completedDays = weekDates.filter((d) =>
    weeklyWorkouts.includes(d),
  ).length;

  if (!isLoggedIn) return null;

  return (
    <section
      id="weekly-goal"
      data-ocid="weekly.goal.section"
      style={{
        padding: "60px 2rem 60px",
        background: "oklch(0.07 0.012 255)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.22 295 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
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
        <div
          style={{
            padding: "1.75rem 2rem",
            background: "oklch(0.1 0.02 260 / 0.8)",
            border: "1px solid oklch(0.62 0.22 295 / 0.3)",
            borderRadius: "14px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 30px oklch(0.62 0.22 295 / 0.08)",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  color: "oklch(0.62 0.22 295)",
                  marginBottom: "0.3rem",
                }}
              >
                THIS WEEK
              </div>
              <h3
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  color: "oklch(0.92 0.02 260)",
                  margin: 0,
                }}
              >
                WEEKLY WORKOUT GOAL
              </h3>
            </div>

            {/* Goal progress */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "2rem",
                  fontWeight: 900,
                  color:
                    completedDays >= WEEKLY_GOAL
                      ? "oklch(0.65 0.2 140)"
                      : "oklch(0.62 0.22 295)",
                  textShadow:
                    completedDays >= WEEKLY_GOAL
                      ? "0 0 12px oklch(0.65 0.2 140 / 0.6)"
                      : "0 0 12px oklch(0.62 0.22 295 / 0.6)",
                  lineHeight: 1,
                }}
              >
                {completedDays}/{WEEKLY_GOAL}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "0.55rem",
                    letterSpacing: "0.12em",
                    color: "oklch(0.45 0.03 260)",
                  }}
                >
                  WORKOUTS
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color:
                      completedDays >= WEEKLY_GOAL
                        ? "oklch(0.65 0.2 140)"
                        : "oklch(0.55 0.04 260)",
                  }}
                >
                  {completedDays >= WEEKLY_GOAL
                    ? "🏆 GOAL REACHED!"
                    : `${WEEKLY_GOAL - completedDays} to go`}
                </div>
              </div>
            </div>
          </div>

          {/* Day circles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "0.6rem",
            }}
          >
            {weekDates.map((date, i) => {
              const isToday = date === today;
              const isCompleted = weeklyWorkouts.includes(date);
              const dayLabel = DAY_LABELS[i] ?? "";

              let circleColor = "oklch(0.15 0.02 260)";
              let borderColor = "oklch(0.25 0.03 260 / 0.5)";
              let glowShadow = "none";

              if (isCompleted) {
                circleColor = "oklch(0.62 0.22 295 / 0.25)";
                borderColor = "oklch(0.62 0.22 295 / 0.7)";
                glowShadow = "0 0 12px oklch(0.62 0.22 295 / 0.4)";
              } else if (isToday) {
                circleColor = "oklch(0.62 0.25 22 / 0.15)";
                borderColor = "oklch(0.62 0.25 22 / 0.7)";
                glowShadow = "0 0 12px oklch(0.62 0.25 22 / 0.4)";
              }

              return (
                <div
                  key={date}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  {/* Day label */}
                  <span
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      color: isToday
                        ? "oklch(0.62 0.25 22)"
                        : "oklch(0.4 0.03 260)",
                      fontWeight: isToday ? 700 : 400,
                    }}
                  >
                    {dayLabel}
                  </span>

                  {/* Circle */}
                  <div
                    style={{
                      width: "clamp(36px, 5vw, 52px)",
                      height: "clamp(36px, 5vw, 52px)",
                      borderRadius: "50%",
                      background: circleColor,
                      border: `2px solid ${borderColor}`,
                      boxShadow: glowShadow,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      position: "relative",
                    }}
                  >
                    {isCompleted ? (
                      <span style={{ fontSize: "1rem" }}>✓</span>
                    ) : isToday ? (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "oklch(0.62 0.25 22)",
                          boxShadow: "0 0 6px oklch(0.62 0.25 22 / 0.8)",
                          animation: "neonPulseSlow 1.5s ease-in-out infinite",
                        }}
                      />
                    ) : null}

                    {/* Today label */}
                    {isToday && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-18px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: "0.45rem",
                          letterSpacing: "0.08em",
                          color: "oklch(0.62 0.25 22)",
                          whiteSpace: "nowrap",
                          fontWeight: 700,
                        }}
                      >
                        TODAY
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "2rem" }}>
            <div
              style={{
                height: "4px",
                background: "oklch(0.15 0.02 260)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min((completedDays / WEEKLY_GOAL) * 100, 100)}%`,
                  background:
                    completedDays >= WEEKLY_GOAL
                      ? "linear-gradient(90deg, oklch(0.65 0.2 140) 0%, oklch(0.72 0.22 120) 100%)"
                      : "linear-gradient(90deg, oklch(0.62 0.25 22) 0%, oklch(0.62 0.22 295) 100%)",
                  boxShadow:
                    completedDays >= WEEKLY_GOAL
                      ? "0 0 8px oklch(0.65 0.2 140 / 0.6)"
                      : "0 0 8px oklch(0.62 0.22 295 / 0.5)",
                  borderRadius: "2px",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
