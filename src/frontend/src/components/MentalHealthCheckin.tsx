import { useState } from "react";

interface CheckinEntry {
  date: string;
  mood: number;
  gratitude: [string, string, string];
}

const STORAGE_KEY = "bmx-mental-checkin";

function loadCheckins(): CheckinEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CheckinEntry[]) : [];
  } catch {
    return [];
  }
}

function saveCheckins(entries: CheckinEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getDateString(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split("T")[0] ?? "";
}

const MOODS = [
  { emoji: "😤", label: "Very Bad", value: 1 },
  { emoji: "😞", label: "Bad", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😄", label: "Great", value: 5 },
];

const HINDI_MESSAGES: Record<number, string> = {
  1: "Yeh waqt bhi guzar jayega. Ek kadam aage badho. Tu strong hai.",
  2: "Bura din hai, par tera safar nahi ruka. Chhoti khushiyan dhundho.",
  3: "Normal din bhi progress ka hissa hai. Aaj ka task poora karo.",
  4: "Achcha laga! Is energy ko missions mein lagao!",
  5: "Tu top form mein hai! Aaj ka din maximize karo!",
};

const MOOD_COLORS: Record<number, string> = {
  1: "oklch(0.62 0.25 22)",
  2: "oklch(0.65 0.2 45)",
  3: "oklch(0.82 0.18 85)",
  4: "oklch(0.65 0.2 140)",
  5: "oklch(0.62 0.22 295)",
};

function getMoodDotColor(mood: number): string {
  return MOOD_COLORS[mood] ?? "oklch(0.3 0.02 260)";
}

export function MentalHealthCheckin() {
  const today = getDateString();
  const checkins = loadCheckins();
  const existing = checkins.find((e) => e.date === today);

  const [mood, setMood] = useState<number>(existing?.mood ?? 0);
  const [gratitude, setGratitude] = useState<[string, string, string]>(
    existing?.gratitude ?? ["", "", ""],
  );
  const [saved, setSaved] = useState(false);

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = getDateString(6 - i);
    const entry = checkins.find((e) => e.date === date);
    return { date, mood: entry?.mood ?? 0 };
  });

  const handleSave = () => {
    if (mood === 0) return;
    const entry: CheckinEntry = { date: today, mood, gratitude };
    const updated = checkins.filter((e) => e.date !== today);
    updated.unshift(entry);
    saveCheckins(updated.slice(0, 90));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section
      id="mental-health"
      data-ocid="mental.section"
      style={{
        padding: "80px 2rem",
        background: "oklch(0.065 0.01 260)",
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
            "linear-gradient(oklch(0.62 0.22 295 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.25 22 / 0.02) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse, oklch(0.62 0.22 295 / 0.06) 0%, transparent 65%)",
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
            <span style={{ fontSize: "0.8rem" }}>🧠</span>
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.22 295)",
              }}
            >
              INNER BALANCE
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
                "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.68 0.22 310) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MENTAL HEALTH CHECK-IN
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.9rem",
              color: "oklch(0.55 0.04 260)",
            }}
          >
            A warrior's strength starts from within — nurture your mind daily
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
          {/* Mood + gratitude form */}
          <div
            style={{
              background: "oklch(0.09 0.015 260)",
              border: "1px solid oklch(0.62 0.22 295 / 0.3)",
              borderRadius: "14px",
              padding: "1.75rem",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Mood selector */}
            <h3
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 800,
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                color: "oklch(0.62 0.22 295)",
                margin: "0 0 1rem",
              }}
            >
              ◆ AAJ KAISA FEEL KAR RAHE HO?
            </h3>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1.25rem",
                justifyContent: "space-between",
              }}
            >
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  data-ocid={`mental.mood.button.${m.value}`}
                  onClick={() => setMood(m.value)}
                  title={m.label}
                  style={{
                    flex: 1,
                    padding: "0.65rem 0.25rem",
                    borderRadius: "10px",
                    border: `1px solid ${mood === m.value ? getMoodDotColor(m.value) : "oklch(0.2 0.02 260 / 0.5)"}`,
                    background:
                      mood === m.value
                        ? `${getMoodDotColor(m.value).replace(")", " / 0.15)")}`
                        : "oklch(0.12 0.015 260)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.3rem",
                    transition: "all 0.2s ease",
                    boxShadow:
                      mood === m.value
                        ? `0 0 10px ${getMoodDotColor(m.value).replace(")", " / 0.3)")}`
                        : "none",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    transform: mood === m.value ? "translateY(-2px)" : "none",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{m.emoji}</span>
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.52rem",
                      color:
                        mood === m.value
                          ? getMoodDotColor(m.value)
                          : "oklch(0.45 0.03 260)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Hindi motivational message */}
            {mood > 0 && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  background: `${getMoodDotColor(mood).replace(")", " / 0.08)")}`,
                  border: `1px solid ${getMoodDotColor(mood).replace(")", " / 0.3)")}`,
                  borderLeft: `3px solid ${getMoodDotColor(mood)}`,
                  borderRadius: "8px",
                  marginBottom: "1.25rem",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                  color: "oklch(0.82 0.02 260)",
                  lineHeight: 1.6,
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  style={{
                    color: getMoodDotColor(mood),
                    fontWeight: 700,
                    fontStyle: "normal",
                  }}
                >
                  ✦{" "}
                </span>
                {HINDI_MESSAGES[mood]}
              </div>
            )}

            {/* Gratitude journal */}
            <div style={{ marginBottom: "1.25rem" }}>
              <h4
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  letterSpacing: "0.1em",
                  color: "oklch(0.65 0.04 260)",
                  margin: "0 0 0.75rem",
                }}
              >
                🙏 AAJ MUJHE KHUSHI HAI KI...
              </h4>
              {([0, 1, 2] as const).map((i) => (
                <div key={i} style={{ marginBottom: "0.65rem" }}>
                  <input
                    data-ocid={`mental.gratitude.input.${i + 1}`}
                    type="text"
                    placeholder={`Gratitude ${i + 1}...`}
                    value={gratitude[i]}
                    onChange={(e) => {
                      const newG = [...gratitude] as [string, string, string];
                      newG[i] = e.target.value;
                      setGratitude(newG);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem",
                      background: "oklch(0.12 0.018 260)",
                      border: "1px solid oklch(0.3 0.04 260 / 0.4)",
                      borderRadius: "6px",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.8rem",
                      color: "oklch(0.85 0.02 260)",
                      outline: "none",
                      minHeight: "44px",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "oklch(0.62 0.22 295 / 0.5)";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 2px oklch(0.62 0.22 295 / 0.1)";
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

            <button
              type="button"
              data-ocid="mental.save.button"
              onClick={handleSave}
              disabled={mood === 0}
              style={{
                width: "100%",
                padding: "0.85rem",
                background:
                  mood === 0
                    ? "oklch(0.12 0.02 260)"
                    : saved
                      ? "oklch(0.65 0.2 140 / 0.15)"
                      : `linear-gradient(135deg, ${getMoodDotColor(mood)} 0%, oklch(0.55 0.22 340) 100%)`,
                border: `1px solid ${mood === 0 ? "oklch(0.25 0.03 260 / 0.4)" : saved ? "oklch(0.65 0.2 140 / 0.4)" : getMoodDotColor(mood).replace(")", " / 0.5)")}`,
                borderRadius: "8px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color:
                  mood === 0
                    ? "oklch(0.4 0.03 260)"
                    : saved
                      ? "oklch(0.75 0.18 140)"
                      : "oklch(0.98 0 0)",
                cursor: mood === 0 ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                minHeight: "44px",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {mood === 0
                ? "SELECT YOUR MOOD FIRST"
                : saved
                  ? "✓ CHECK-IN SAVED!"
                  : "💜 SAVE CHECK-IN"}
            </button>
          </div>

          {/* Weekly mood trend */}
          <div
            style={{
              background: "oklch(0.09 0.015 260)",
              border: "1px solid oklch(0.62 0.22 295 / 0.25)",
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
                color: "oklch(0.62 0.22 295)",
                margin: "0 0 1.25rem",
              }}
            >
              ◆ WEEKLY MOOD TREND
            </h3>

            {/* Mood dots */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                alignItems: "flex-end",
                marginBottom: "1.25rem",
                padding: "1.5rem",
                background: "oklch(0.07 0.01 260 / 0.6)",
                borderRadius: "10px",
                border: "1px solid oklch(0.2 0.02 260 / 0.4)",
              }}
            >
              {weekData.map((day) => {
                const dayName = new Date(
                  `${day.date}T12:00:00`,
                ).toLocaleDateString("en-US", { weekday: "short" });
                const isToday = day.date === today;
                const moodEmoji =
                  day.mood > 0 ? MOODS[day.mood - 1]?.emoji : "·";
                const dotColor =
                  day.mood > 0
                    ? getMoodDotColor(day.mood)
                    : "oklch(0.2 0.02 260)";

                return (
                  <div
                    key={day.date}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.4rem",
                      flex: 1,
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>
                      {day.mood > 0 ? moodEmoji : "—"}
                    </span>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: dotColor,
                        boxShadow:
                          day.mood > 0
                            ? `0 0 8px ${dotColor.replace(")", " / 0.5)")}`
                            : "none",
                        border: isToday
                          ? "2px solid oklch(0.82 0.18 85)"
                          : "none",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "0.58rem",
                        color: isToday
                          ? "oklch(0.82 0.18 85)"
                          : "oklch(0.4 0.03 260)",
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {dayName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mood legend */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.6rem",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              {MOODS.map((m) => (
                <div
                  key={m.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: getMoodDotColor(m.value),
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      color: "oklch(0.5 0.03 260)",
                    }}
                  >
                    {m.emoji} {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Mental health tips */}
            <div
              style={{
                padding: "1rem 1.1rem",
                background: "oklch(0.07 0.01 260 / 0.8)",
                border: "1px solid oklch(0.25 0.03 260 / 0.4)",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  color: "oklch(0.62 0.22 295)",
                  marginBottom: "0.6rem",
                }}
              >
                💜 MENTAL STRENGTH TIPS
              </div>
              {[
                "Roz 5 min meditation karo — dimag saaf hoga.",
                "Negative soch ko notice karo, replace karo.",
                "Apne achievements ko appreciate karo.",
                "Ek kaam ek waqt mein — multitask nahi.",
              ].map((tip) => (
                <div
                  key={tip.slice(0, 20)}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "oklch(0.62 0.22 295)",
                      fontSize: "0.65rem",
                      marginTop: "0.1rem",
                    }}
                  >
                    ▸
                  </span>
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.7rem",
                      color: "oklch(0.55 0.03 260)",
                      lineHeight: 1.5,
                    }}
                  >
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
