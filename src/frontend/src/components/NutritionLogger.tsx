import { useState } from "react";

interface NutritionEntry {
  date: string;
  water: number;
  meals: number;
}

const STORAGE_KEY = "bmx-nutrition-log";

function loadNutritionLog(): NutritionEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NutritionEntry[]) : [];
  } catch {
    return [];
  }
}

function saveNutritionLog(entries: NutritionEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getDateString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

const WATER_TIPS = [
  "Hydration boosts focus and energy levels significantly!",
  "Drink more water — your muscles will recover faster!",
  "Perfect hydration! Your cells are operating at peak capacity.",
  "Water is life. You're on the right track!",
  "Amazing! Stay hydrated and keep crushing it!",
];

export function NutritionLogger() {
  const today = getDateString();
  const log = loadNutritionLog();
  const existing = log.find((e) => e.date === today);

  const [water, setWater] = useState(existing?.water ?? 0);
  const [meals, setMeals] = useState(existing?.meals ?? 0);
  const [saved, setSaved] = useState(false);

  const TARGET_GLASSES = 8;
  const waterPct = Math.round((water / TARGET_GLASSES) * 100);
  const calEstimate = meals * 450;

  const waterTip =
    water === 0
      ? "Start with a glass of water right now!"
      : water < 4
        ? "You need more water today, warrior!"
        : water < 6
          ? "Getting there! Keep drinking."
          : (WATER_TIPS[Math.min(water - 3, WATER_TIPS.length - 1)] ??
            "Great job!");

  const handleSave = () => {
    const entry: NutritionEntry = { date: today, water, meals };
    const updated = log.filter((e) => e.date !== today);
    updated.unshift(entry);
    saveNutritionLog(updated.slice(0, 90));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleWater = (idx: number) => {
    // If clicking a filled glass, unfill from that point
    const newWater = idx < water ? idx : idx + 1;
    setWater(newWater);
  };

  return (
    <section
      id="nutrition"
      data-ocid="nutrition.section"
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
            "linear-gradient(oklch(0.65 0.2 140 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.2 140 / 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "500px",
          height: "400px",
          background:
            "radial-gradient(circle, oklch(0.65 0.2 140 / 0.04) 0%, transparent 65%)",
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
              background: "oklch(0.65 0.2 140 / 0.1)",
              border: "1px solid oklch(0.65 0.2 140 / 0.3)",
              borderRadius: "100px",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>🥗</span>
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.65 0.2 140)",
              }}
            >
              FUEL
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
                "linear-gradient(135deg, oklch(0.65 0.2 140) 0%, oklch(0.82 0.18 85) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NUTRITION LOG
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.9rem",
              color: "oklch(0.55 0.04 260)",
            }}
          >
            Track your water and meals to fuel your transformation
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
          {/* Water tracker */}
          <div
            style={{
              background: "oklch(0.09 0.015 260)",
              border: "1px solid oklch(0.65 0.2 140 / 0.25)",
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
                color: "oklch(0.65 0.2 140)",
                margin: "0 0 0.5rem",
              }}
            >
              💧 WATER INTAKE
            </h3>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.7rem",
                color: "oklch(0.5 0.03 260)",
                marginBottom: "1.25rem",
              }}
            >
              Target: {TARGET_GLASSES} glasses/day
            </div>

            {/* Glass icons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.6rem",
                marginBottom: "1.25rem",
              }}
            >
              {Array.from({ length: TARGET_GLASSES }, (_, i) => (
                <button
                  key={`water-glass-${i + 1}`}
                  type="button"
                  data-ocid={`nutrition.water.button.${i + 1}`}
                  onClick={() => toggleWater(i)}
                  title={`Glass ${i + 1}`}
                  style={{
                    width: "48px",
                    height: "56px",
                    borderRadius: "6px",
                    background:
                      i < water
                        ? "oklch(0.65 0.2 140 / 0.2)"
                        : "oklch(0.12 0.015 260)",
                    border: `1px solid ${i < water ? "oklch(0.65 0.2 140 / 0.6)" : "oklch(0.25 0.03 260 / 0.5)"}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.4rem",
                    transition: "all 0.2s ease",
                    boxShadow:
                      i < water ? "0 0 8px oklch(0.65 0.2 140 / 0.3)" : "none",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {i < water ? "🫗" : "🥛"}
                </button>
              ))}
            </div>

            {/* Water progress bar */}
            <div
              style={{
                height: "6px",
                background: "oklch(0.15 0.02 260)",
                borderRadius: "3px",
                marginBottom: "0.5rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${waterPct}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.55 0.18 220), oklch(0.65 0.2 140))",
                  borderRadius: "3px",
                  transition: "width 0.4s ease",
                  boxShadow: "0 0 6px oklch(0.65 0.2 140 / 0.5)",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.68rem",
              }}
            >
              <span style={{ color: "oklch(0.65 0.2 140)", fontWeight: 700 }}>
                {water}/{TARGET_GLASSES} glasses
              </span>
              <span style={{ color: "oklch(0.55 0.04 260)" }}>{waterPct}%</span>
            </div>

            {/* Water tip */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.6rem 0.85rem",
                background: "oklch(0.07 0.01 260 / 0.8)",
                border: "1px solid oklch(0.25 0.03 260 / 0.4)",
                borderRadius: "6px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.7rem",
                color: "oklch(0.55 0.04 260)",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              💡 {waterTip}
            </div>
          </div>

          {/* Meals + summary */}
          <div
            style={{
              background: "oklch(0.09 0.015 260)",
              border: "1px solid oklch(0.65 0.2 140 / 0.25)",
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
              🍽️ MEALS TODAY
            </h3>

            {/* Meal counter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.5rem",
                marginBottom: "1.75rem",
                padding: "1.5rem",
                background: "oklch(0.07 0.01 260 / 0.8)",
                border: "1px solid oklch(0.3 0.04 260 / 0.3)",
                borderRadius: "10px",
              }}
            >
              <button
                type="button"
                data-ocid="nutrition.meals.minus.button"
                onClick={() => setMeals((m) => Math.max(0, m - 1))}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "oklch(0.12 0.015 260)",
                  border: "1px solid oklch(0.62 0.25 22 / 0.4)",
                  color: "oklch(0.62 0.25 22)",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                −
              </button>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "oklch(0.82 0.18 85)",
                    textShadow: "0 0 15px oklch(0.82 0.18 85 / 0.4)",
                    lineHeight: 1,
                  }}
                >
                  {meals}
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.65rem",
                    color: "oklch(0.5 0.03 260)",
                    letterSpacing: "0.12em",
                    marginTop: "0.2rem",
                  }}
                >
                  MEALS
                </div>
              </div>
              <button
                type="button"
                data-ocid="nutrition.meals.plus.button"
                onClick={() => setMeals((m) => Math.min(6, m + 1))}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "oklch(0.65 0.2 140 / 0.15)",
                  border: "1px solid oklch(0.65 0.2 140 / 0.5)",
                  color: "oklch(0.65 0.2 140)",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  transition: "all 0.2s ease",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  boxShadow: "0 0 8px oklch(0.65 0.2 140 / 0.2)",
                }}
              >
                +
              </button>
            </div>

            {/* Summary stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              {[
                {
                  label: "Hydration",
                  value: `${waterPct}%`,
                  color: "oklch(0.65 0.2 140)",
                },
                {
                  label: "Est. Calories",
                  value: `~${calEstimate}`,
                  color: "oklch(0.82 0.18 85)",
                },
                {
                  label: "Meals",
                  value: `${meals}/day`,
                  color: "oklch(0.62 0.22 295)",
                },
                {
                  label: "Status",
                  value: waterPct >= 75 ? "✓ Good" : "⚠️ Low",
                  color:
                    waterPct >= 75
                      ? "oklch(0.65 0.2 140)"
                      : "oklch(0.62 0.25 22)",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "0.75rem",
                    background: "oklch(0.07 0.01 260 / 0.7)",
                    border: "1px solid oklch(0.2 0.02 260 / 0.4)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "1.1rem",
                      fontWeight: 900,
                      color: stat.color,
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      color: "oklch(0.45 0.03 260)",
                      letterSpacing: "0.1em",
                      marginTop: "0.2rem",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              data-ocid="nutrition.save.button"
              onClick={handleSave}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: saved
                  ? "oklch(0.65 0.2 140 / 0.15)"
                  : "linear-gradient(135deg, oklch(0.65 0.2 140) 0%, oklch(0.55 0.18 180) 100%)",
                border: `1px solid ${saved ? "oklch(0.65 0.2 140 / 0.4)" : "oklch(0.72 0.22 140 / 0.5)"}`,
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
                  : "0 0 12px oklch(0.65 0.2 140 / 0.3)",
              }}
            >
              {saved ? "✓ SAVED!" : "🥗 SAVE NUTRITION LOG"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
