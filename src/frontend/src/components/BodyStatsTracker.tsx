import { useState } from "react";

interface BodyStatEntry {
  date: string;
  weight: number;
  bodyFat: number;
  chest: number;
  waist: number;
  arms: number;
}

const STORAGE_KEY = "bmx-body-stats";

function loadStats(): BodyStatEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BodyStatEntry[]) : [];
  } catch {
    return [];
  }
}

function saveStats(entries: BodyStatEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getDateString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getTrend(
  current: number,
  previous: number,
  lowerIsBetter = false,
): { arrow: string; color: string } {
  if (current === previous)
    return { arrow: "→", color: "oklch(0.55 0.03 260)" };
  const improved = lowerIsBetter ? current < previous : current > previous;
  return improved
    ? { arrow: "↑", color: "oklch(0.65 0.2 140)" }
    : { arrow: "↓", color: "oklch(0.62 0.25 22)" };
}

const FIELDS = [
  { key: "weight" as const, label: "Weight", unit: "kg", lowerBetter: false },
  { key: "bodyFat" as const, label: "Body Fat", unit: "%", lowerBetter: true },
  { key: "chest" as const, label: "Chest", unit: "cm", lowerBetter: false },
  { key: "waist" as const, label: "Waist", unit: "cm", lowerBetter: true },
  { key: "arms" as const, label: "Arms", unit: "cm", lowerBetter: false },
] as const;

export function BodyStatsTracker() {
  const [form, setForm] = useState<Omit<BodyStatEntry, "date">>({
    weight: 70,
    bodyFat: 20,
    chest: 95,
    waist: 80,
    arms: 32,
  });
  const [saved, setSaved] = useState(false);

  const stats = loadStats();

  const handleChange = (key: keyof typeof form, value: string) => {
    const num = Number(value);
    if (!Number.isNaN(num)) {
      setForm((prev) => ({ ...prev, [key]: num }));
    }
  };

  const handleLog = () => {
    const today = getDateString();
    const entry: BodyStatEntry = { date: today, ...form };
    const existing = stats.findIndex((e) => e.date === today);
    const updated = [...stats];
    if (existing >= 0) updated[existing] = entry;
    else updated.unshift(entry);
    saveStats(updated.slice(0, 120));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const recentStats = stats.slice(0, 4);
  const latest = stats[0];
  const prev = stats[1];

  const motivationMsg =
    stats.length < 2
      ? "Log your first entry and start tracking your transformation!"
      : (() => {
          if (!latest || !prev) return "Keep tracking!";
          const weightDiff = latest.weight - prev.weight;
          const waistDiff = latest.waist - prev.waist;
          if (weightDiff < 0 && waistDiff < 0)
            return "🔥 Incredible progress! Weight and waist both improving!";
          if (waistDiff < 0)
            return "💪 Waist is shrinking — great work warrior!";
          if (latest.arms > prev.arms)
            return "⚡ Arms are growing — keep lifting!";
          return "Stay consistent — results take time. Trust the process!";
        })();

  return (
    <section
      id="body-stats"
      data-ocid="bodystats.section"
      style={{
        padding: "80px 2rem",
        background: "oklch(0.07 0.01 250)",
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
            "linear-gradient(oklch(0.62 0.25 22 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.02) 1px, transparent 1px)",
          backgroundSize: "65px 65px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "5%",
          width: "450px",
          height: "450px",
          background:
            "radial-gradient(circle, oklch(0.62 0.25 22 / 0.04) 0%, transparent 65%)",
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
              background: "oklch(0.62 0.25 22 / 0.1)",
              border: "1px solid oklch(0.62 0.25 22 / 0.3)",
              borderRadius: "100px",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>📊</span>
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.25 22)",
              }}
            >
              PROGRESS
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
                "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.82 0.18 85) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            BODY STATS
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.9rem",
              color: "oklch(0.55 0.04 260)",
            }}
          >
            Track your physical transformation — every number tells your story
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
              border: "1px solid oklch(0.62 0.25 22 / 0.3)",
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
                margin: "0 0 1.25rem",
              }}
            >
              ◆ LOG STATS
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.85rem",
                marginBottom: "1.25rem",
              }}
            >
              {FIELDS.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={`bodystats-${field.key}`}
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.7rem",
                      color: "oklch(0.6 0.04 260)",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      display: "block",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {field.label} ({field.unit})
                  </label>
                  <input
                    id={`bodystats-${field.key}`}
                    data-ocid={`bodystats.${field.key}.input`}
                    type="number"
                    min={0}
                    step={0.1}
                    value={form[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      background: "oklch(0.12 0.02 260)",
                      border: "1px solid oklch(0.3 0.04 260 / 0.4)",
                      borderRadius: "6px",
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "0.9rem",
                      color: "oklch(0.85 0.02 260)",
                      outline: "none",
                      minHeight: "44px",
                      boxSizing: "border-box",
                      colorScheme: "dark",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "oklch(0.62 0.25 22 / 0.5)";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 2px oklch(0.62 0.25 22 / 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        "oklch(0.3 0.04 260 / 0.4)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Motivation */}
            <div
              style={{
                padding: "0.65rem 0.85rem",
                background: "oklch(0.62 0.25 22 / 0.06)",
                border: "1px solid oklch(0.62 0.25 22 / 0.22)",
                borderRadius: "6px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.72rem",
                color: "oklch(0.7 0.08 22)",
                lineHeight: 1.5,
                marginBottom: "1rem",
              }}
            >
              {motivationMsg}
            </div>

            <button
              type="button"
              data-ocid="bodystats.log.button"
              onClick={handleLog}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: saved
                  ? "oklch(0.65 0.2 140 / 0.15)"
                  : "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                border: `1px solid ${saved ? "oklch(0.65 0.2 140 / 0.4)" : "oklch(0.72 0.28 22 / 0.5)"}`,
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
                  : "0 0 12px oklch(0.62 0.25 22 / 0.35)",
              }}
            >
              {saved ? "✓ STATS LOGGED!" : "📊 LOG STATS"}
            </button>
          </div>

          {/* Recent entries table */}
          <div
            style={{
              background: "oklch(0.09 0.015 260)",
              border: "1px solid oklch(0.62 0.25 22 / 0.2)",
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
                margin: "0 0 1.25rem",
              }}
            >
              ◆ PROGRESS HISTORY
            </h3>

            {recentStats.length === 0 ? (
              <div
                data-ocid="bodystats.empty_state"
                style={{
                  padding: "3rem 1.5rem",
                  textAlign: "center",
                  color: "oklch(0.45 0.03 260)",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                  📋
                </div>
                No entries yet. Log your first stats!
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.68rem",
                  }}
                >
                  <thead>
                    <tr>
                      {["Date", "Weight", "Fat%", "Chest", "Waist", "Arms"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "0.4rem 0.5rem",
                              textAlign: "left",
                              color: "oklch(0.5 0.03 260)",
                              letterSpacing: "0.08em",
                              fontWeight: 700,
                              borderBottom:
                                "1px solid oklch(0.2 0.02 260 / 0.5)",
                            }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {recentStats.map((entry, idx) => {
                      const prevEntry = recentStats[idx + 1];
                      return (
                        <tr
                          key={entry.date}
                          data-ocid={`bodystats.row.${idx + 1}`}
                          style={{
                            borderBottom:
                              "1px solid oklch(0.15 0.015 260 / 0.5)",
                          }}
                        >
                          <td
                            style={{
                              padding: "0.5rem 0.5rem",
                              color:
                                idx === 0
                                  ? "oklch(0.82 0.18 85)"
                                  : "oklch(0.55 0.03 260)",
                              fontWeight: idx === 0 ? 700 : 400,
                            }}
                          >
                            {formatDate(entry.date)}
                            {idx === 0 && (
                              <span
                                style={{
                                  marginLeft: "0.25rem",
                                  fontSize: "0.55rem",
                                  color: "oklch(0.82 0.18 85)",
                                }}
                              >
                                ★
                              </span>
                            )}
                          </td>
                          {FIELDS.map((field) => {
                            const trend = prevEntry
                              ? getTrend(
                                  entry[field.key],
                                  prevEntry[field.key],
                                  field.lowerBetter,
                                )
                              : null;
                            return (
                              <td
                                key={field.key}
                                style={{
                                  padding: "0.5rem 0.5rem",
                                  color: "oklch(0.75 0.02 260)",
                                }}
                              >
                                {entry[field.key]}
                                {trend && idx === 0 && (
                                  <span
                                    style={{
                                      marginLeft: "0.2rem",
                                      color: trend.color,
                                      fontSize: "0.7rem",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {trend.arrow}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Units reminder */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.55rem 0.75rem",
                background: "oklch(0.07 0.01 260 / 0.7)",
                border: "1px solid oklch(0.2 0.02 260 / 0.4)",
                borderRadius: "6px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.62rem",
                color: "oklch(0.45 0.03 260)",
                lineHeight: 1.5,
              }}
            >
              ↑ = improvement &nbsp;|&nbsp; ↓ = decline &nbsp;|&nbsp; → = same
              &nbsp;|&nbsp; ★ = latest entry
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
