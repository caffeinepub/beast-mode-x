import { Moon, Star } from "lucide-react";
import { useState } from "react";

interface SleepEntry {
  date: string;
  hours: number;
  quality: number;
  wakeTime: string;
}

const STORAGE_KEY = "bmx-sleep-log";

function loadSleepLog(): SleepEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SleepEntry[]) : [];
  } catch {
    return [];
  }
}

function saveSleepLog(entries: SleepEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getDateString(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split("T")[0] ?? "";
}

function getSleepColor(hours: number): string {
  if (hours < 6) return "oklch(0.62 0.25 22)";
  if (hours < 7) return "oklch(0.82 0.18 85)";
  return "oklch(0.65 0.2 140)";
}

export function SleepTracker() {
  const [hours, setHours] = useState(7);
  const [quality, setQuality] = useState(3);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [saved, setSaved] = useState(false);

  const sleepLog = loadSleepLog();

  const todayEntry = sleepLog.find((e) => e.date === getDateString());
  const streak = (() => {
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const entry = sleepLog.find((e) => e.date === getDateString(i));
      if (entry && entry.hours >= 7) count++;
      else break;
    }
    return count;
  })();

  const handleLog = () => {
    const today = getDateString();
    const existing = sleepLog.findIndex((e) => e.date === today);
    const entry: SleepEntry = { date: today, hours, quality, wakeTime };
    const updated = [...sleepLog];
    if (existing >= 0) updated[existing] = entry;
    else updated.unshift(entry);
    saveSleepLog(updated.slice(0, 90));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Last 7 days data for bar chart
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = getDateString(6 - i);
    const entry = sleepLog.find((e) => e.date === date);
    const dayName = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    });
    return { date, dayName, hours: entry?.hours ?? 0 };
  });

  const xpMessage =
    hours >= 7
      ? "+15 XP BONUS: Great Sleep! 🌟"
      : hours < 6
        ? "⚠️ Sleep more for better performance!"
        : "Keep improving your sleep!";

  return (
    <section
      id="sleep-tracker"
      data-ocid="sleep.section"
      style={{
        padding: "80px 2rem",
        background: "oklch(0.065 0.012 260)",
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
            "linear-gradient(oklch(0.62 0.22 295 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, oklch(0.62 0.22 295 / 0.05) 0%, transparent 65%)",
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
              padding: "0.25rem 0.85rem",
              background: "oklch(0.62 0.22 295 / 0.1)",
              border: "1px solid oklch(0.62 0.22 295 / 0.3)",
              borderRadius: "100px",
            }}
          >
            <Moon size={12} style={{ color: "oklch(0.62 0.22 295)" }} />
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.22 295)",
              }}
            >
              RECOVERY
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
              letterSpacing: "0.06em",
              margin: "0 0 0.75rem",
              background:
                "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.82 0.18 85) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SLEEP TRACKER
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.9rem",
              color: "oklch(0.55 0.04 260)",
            }}
          >
            Track your sleep for better recovery and peak performance
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
          className="grid grid-cols-1 lg:grid-cols-2"
        >
          {/* Log form */}
          <div
            style={{
              background: "oklch(0.09 0.015 260)",
              border: "1px solid oklch(0.62 0.22 295 / 0.3)",
              borderRadius: "14px",
              padding: "1.75rem",
              backdropFilter: "blur(12px)",
            }}
          >
            <h3
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 800,
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                color: "oklch(0.82 0.18 85)",
                margin: "0 0 1.5rem",
              }}
            >
              ◆ LOG TODAY'S SLEEP
            </h3>

            {/* Hours slider */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.6rem",
                }}
              >
                <label
                  htmlFor="sleep-hours-range"
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.75rem",
                    color: "oklch(0.65 0.04 260)",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  }}
                >
                  Sleep Duration
                </label>
                <span
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    color: getSleepColor(hours),
                    textShadow: `0 0 8px ${getSleepColor(hours)} / 0.6`,
                  }}
                >
                  {hours}h
                </span>
              </div>
              <input
                id="sleep-hours-range"
                data-ocid="sleep.hours.input"
                type="range"
                min={4}
                max={12}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: getSleepColor(hours),
                  cursor: "pointer",
                  height: "4px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "0.6rem",
                  color: "oklch(0.4 0.03 260)",
                  marginTop: "0.3rem",
                }}
              >
                <span>4h</span>
                <span>8h optimal</span>
                <span>12h</span>
              </div>
            </div>

            {/* Quality stars */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.75rem",
                  color: "oklch(0.65 0.04 260)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "0.6rem",
                }}
              >
                Sleep Quality
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    data-ocid={`sleep.quality.button.${star}`}
                    onClick={() => setQuality(star)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.2rem",
                      transition: "transform 0.15s ease",
                      touchAction: "manipulation",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "scale(1.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "scale(1)";
                    }}
                  >
                    <Star
                      size={24}
                      style={{
                        color:
                          star <= quality
                            ? "oklch(0.82 0.18 85)"
                            : "oklch(0.3 0.03 260)",
                        fill: star <= quality ? "oklch(0.82 0.18 85)" : "none",
                        filter:
                          star <= quality
                            ? "drop-shadow(0 0 4px oklch(0.82 0.18 85 / 0.6))"
                            : "none",
                        transition: "all 0.15s ease",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Wake time */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label
                htmlFor="sleep-wake-time"
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.75rem",
                  color: "oklch(0.65 0.04 260)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "0.6rem",
                }}
              >
                Wake Time
              </label>
              <input
                id="sleep-wake-time"
                data-ocid="sleep.wake_time.input"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.85rem",
                  background: "oklch(0.12 0.02 260)",
                  border: "1px solid oklch(0.3 0.04 260 / 0.5)",
                  borderRadius: "6px",
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "0.9rem",
                  color: "oklch(0.85 0.02 260)",
                  outline: "none",
                  colorScheme: "dark",
                  cursor: "pointer",
                  minHeight: "44px",
                }}
              />
            </div>

            {/* XP message */}
            <div
              style={{
                padding: "0.65rem 0.85rem",
                background:
                  hours >= 7
                    ? "oklch(0.65 0.2 140 / 0.1)"
                    : "oklch(0.62 0.25 22 / 0.08)",
                border: `1px solid ${hours >= 7 ? "oklch(0.65 0.2 140 / 0.35)" : "oklch(0.62 0.25 22 / 0.3)"}`,
                borderRadius: "6px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.72rem",
                fontWeight: 700,
                color:
                  hours >= 7 ? "oklch(0.75 0.18 140)" : "oklch(0.7 0.12 22)",
                marginBottom: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              {xpMessage}
            </div>

            <button
              type="button"
              data-ocid="sleep.log.button"
              onClick={handleLog}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: saved
                  ? "oklch(0.65 0.2 140 / 0.2)"
                  : "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.55 0.22 340) 100%)",
                border: `1px solid ${saved ? "oklch(0.65 0.2 140 / 0.5)" : "oklch(0.72 0.24 295 / 0.5)"}`,
                borderRadius: "8px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: saved ? "oklch(0.75 0.18 140)" : "oklch(0.98 0 0)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minHeight: "44px",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                boxShadow: saved
                  ? "none"
                  : "0 0 12px oklch(0.62 0.22 295 / 0.35)",
              }}
            >
              {saved ? "✓ SLEEP LOGGED!" : "🌙 LOG SLEEP"}
            </button>

            {/* Today summary if already logged */}
            {todayEntry && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.6rem 0.85rem",
                  background: "oklch(0.12 0.015 260 / 0.8)",
                  border: "1px solid oklch(0.3 0.04 260 / 0.4)",
                  borderRadius: "6px",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.7rem",
                  color: "oklch(0.55 0.04 260)",
                }}
              >
                Today logged: {todayEntry.hours}h · Quality:{" "}
                {"⭐".repeat(todayEntry.quality)} · Wake: {todayEntry.wakeTime}
              </div>
            )}
          </div>

          {/* Weekly bar chart + streak */}
          <div
            style={{
              background: "oklch(0.09 0.015 260)",
              border: "1px solid oklch(0.62 0.22 295 / 0.25)",
              borderRadius: "14px",
              padding: "1.75rem",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Streak */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.82 0.18 85)",
                  margin: 0,
                }}
              >
                ◆ WEEKLY VIEW
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.25rem 0.65rem",
                  background: "oklch(0.62 0.25 22 / 0.1)",
                  border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                  borderRadius: "100px",
                }}
              >
                <span style={{ fontSize: "0.75rem" }}>🔥</span>
                <span
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "oklch(0.82 0.18 85)",
                  }}
                >
                  {streak} day streak
                </span>
              </div>
            </div>

            {/* Bar chart */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "0.5rem",
                height: "160px",
                marginBottom: "0.5rem",
              }}
            >
              {weekData.map((day) => {
                const maxHours = 12;
                const pct = Math.max((day.hours / maxHours) * 100, 2);
                const color =
                  day.hours === 0
                    ? "oklch(0.2 0.02 260)"
                    : getSleepColor(day.hours);
                const isToday = day.date === getDateString();
                return (
                  <div
                    key={day.date}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "flex-end",
                      gap: "0.3rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "0.55rem",
                        color: day.hours > 0 ? color : "oklch(0.35 0.02 260)",
                        fontWeight: 700,
                      }}
                    >
                      {day.hours > 0 ? `${day.hours}h` : "—"}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        height: `${pct}%`,
                        background: color,
                        borderRadius: "4px 4px 2px 2px",
                        opacity: day.hours === 0 ? 0.25 : 1,
                        boxShadow:
                          day.hours > 0 ? `0 0 8px ${color} / 0.4` : "none",
                        border: isToday
                          ? "1px solid oklch(0.82 0.18 85 / 0.6)"
                          : "none",
                        transition: "height 0.4s ease",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "0.6rem",
                        color: isToday
                          ? "oklch(0.82 0.18 85)"
                          : "oklch(0.45 0.03 260)",
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { color: "oklch(0.62 0.25 22)", label: "<6h" },
                { color: "oklch(0.82 0.18 85)", label: "6-7h" },
                { color: "oklch(0.65 0.2 140)", label: "7h+" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "2px",
                      background: item.color,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.62rem",
                      color: "oklch(0.5 0.03 260)",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tip */}
            <div
              style={{
                marginTop: "1.25rem",
                padding: "0.65rem 0.85rem",
                background: "oklch(0.07 0.01 260 / 0.8)",
                border: "1px solid oklch(0.25 0.03 260 / 0.4)",
                borderRadius: "6px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.68rem",
                color: "oklch(0.5 0.03 260)",
                lineHeight: 1.5,
              }}
            >
              💡{" "}
              <strong style={{ color: "oklch(0.62 0.22 295)" }}>
                Pro Tip:
              </strong>{" "}
              7-9 hours of sleep increases recovery speed, focus, and XP gains
              by up to 40%.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
