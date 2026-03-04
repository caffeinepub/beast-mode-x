import { Award, Calendar, Target, TrendingUp, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Real-time Level System",
    description:
      "Watch your power grow in real time as you conquer challenges. Every battle shapes your destiny.",
    color: "oklch(0.62 0.25 22)",
    glow: "0 0 20px oklch(0.62 0.25 22 / 0.3)",
  },
  {
    icon: Zap,
    title: "XP Tracking",
    description:
      "Every action earns XP. Track your progress on the road to legend with precision analytics.",
    color: "oklch(0.62 0.22 295)",
    glow: "0 0 20px oklch(0.62 0.22 295 / 0.3)",
  },
  {
    icon: Target,
    title: "Skill Upgrade System",
    description:
      "Spend SP to unlock devastating abilities and passive upgrades. Build your ultimate warrior.",
    color: "oklch(0.62 0.25 22)",
    glow: "0 0 20px oklch(0.62 0.25 22 / 0.3)",
  },
  {
    icon: Award,
    title: "Achievement Unlock System",
    description:
      "Earn exclusive badges that showcase your elite status. Prove you are in a class of your own.",
    color: "oklch(0.62 0.22 295)",
    glow: "0 0 20px oklch(0.62 0.22 295 / 0.3)",
  },
  {
    icon: Calendar,
    title: "Daily Missions System",
    description:
      "New challenges every day. Complete them for massive XP rewards and rare achievement badges.",
    color: "oklch(0.62 0.25 22)",
    glow: "0 0 20px oklch(0.62 0.25 22 / 0.3)",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      data-ocid="features.section"
      style={{
        padding: "100px 2rem 80px",
        background: "oklch(0.07 0.01 250)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
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

      {/* Corner glow */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, oklch(0.62 0.22 295 / 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, oklch(0.62 0.25 22 / 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
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
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.25 22)",
              }}
            >
              GAME MECHANICS
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
            POWER UP YOUR GAME
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "1rem",
              color: "oklch(0.6 0.04 260)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Five core systems engineered to transform you from a player into a
            legend.
          </p>
        </div>

        {/* Features grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                data-ocid={`features.item.${idx + 1}`}
                style={{
                  padding: "1.75rem",
                  background: "oklch(0.1 0.015 260 / 0.8)",
                  border: "1px solid oklch(0.22 0.03 260 / 0.7)",
                  borderRadius: "10px",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                  ...(idx === 4 && {
                    gridColumn: "span 1",
                  }),
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${feature.color.replace(")", " / 0.5)")}`;
                  el.style.boxShadow = feature.glow;
                  el.style.transform = "translateY(-4px)";
                  el.style.background = "oklch(0.12 0.02 260 / 0.9)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "oklch(0.22 0.03 260 / 0.7)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                  el.style.background = "oklch(0.1 0.015 260 / 0.8)";
                }}
              >
                {/* Top accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                    opacity: 0.6,
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: `oklch(from ${feature.color} l c h / 0.12)`,
                    border: `1px solid oklch(from ${feature.color} l c h / 0.3)`,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  <Icon
                    size={22}
                    style={{
                      color: feature.color,
                      filter: `drop-shadow(0 0 4px ${feature.color})`,
                    }}
                  />
                </div>

                {/* Content */}
                <h3
                  style={{
                    fontFamily: '"Orbitron", monospace',
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "oklch(0.9 0.02 260)",
                    marginBottom: "0.75rem",
                    lineHeight: 1.3,
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.85rem",
                    color: "oklch(0.6 0.03 260)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>

                {/* Corner decoration */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    width: "20px",
                    height: "20px",
                    borderRight: `1px solid ${feature.color}`,
                    borderBottom: `1px solid ${feature.color}`,
                    opacity: 0.3,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
