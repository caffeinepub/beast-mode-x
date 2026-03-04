import { usePlayerProfile } from "@/hooks/useBackend";
import { useEffect, useState } from "react";
import type { PlayerProfile } from "../backend.d";

interface RankInfo {
  title: string;
  color: string;
  glow: string;
  badge: string;
}

export function getRankInfo(level: number): RankInfo {
  if (level >= 151) {
    return {
      title: "BEAST MODE",
      color: "oklch(0.62 0.25 22)",
      glow: "0 0 16px oklch(0.62 0.25 22 / 0.8), 0 0 40px oklch(0.62 0.22 295 / 0.4)",
      badge: "🌟",
    };
  }
  if (level >= 101) {
    return {
      title: "AWAKENED ONE",
      color: "oklch(0.78 0.18 280)",
      glow: "0 0 16px oklch(0.78 0.18 280 / 0.8)",
      badge: "🌈",
    };
  }
  if (level >= 76) {
    return {
      title: "DRAGON FIST",
      color: "oklch(0.65 0.22 20)",
      glow: "0 0 16px oklch(0.65 0.22 20 / 0.8)",
      badge: "🐉",
    };
  }
  if (level >= 51) {
    return {
      title: "SHADOW MONARCH",
      color: "oklch(0.55 0.18 295)",
      glow: "0 0 16px oklch(0.55 0.18 295 / 0.8)",
      badge: "👑",
    };
  }
  if (level >= 31) {
    return {
      title: "S-RANK HUNTER",
      color: "oklch(0.82 0.18 85)",
      glow: "0 0 16px oklch(0.82 0.18 85 / 0.8)",
      badge: "⭐",
    };
  }
  if (level >= 21) {
    return {
      title: "A-RANK HUNTER",
      color: "oklch(0.62 0.22 295)",
      glow: "0 0 16px oklch(0.62 0.22 295 / 0.8)",
      badge: "💎",
    };
  }
  if (level >= 11) {
    return {
      title: "B-RANK HUNTER",
      color: "oklch(0.62 0.22 240)",
      glow: "0 0 16px oklch(0.62 0.22 240 / 0.6)",
      badge: "🔷",
    };
  }
  if (level >= 6) {
    return {
      title: "C-RANK HUNTER",
      color: "oklch(0.65 0.18 140)",
      glow: "0 0 16px oklch(0.65 0.18 140 / 0.6)",
      badge: "🟢",
    };
  }
  if (level >= 3) {
    return {
      title: "D-RANK HUNTER",
      color: "oklch(0.65 0.12 50)",
      glow: "0 0 12px oklch(0.65 0.12 50 / 0.5)",
      badge: "🟤",
    };
  }
  return {
    title: "UNAWAKENED",
    color: "oklch(0.6 0.04 260)",
    glow: "0 0 8px oklch(0.6 0.04 260 / 0.3)",
    badge: "⬜",
  };
}

const ACHIEVEMENT_DATA = [
  {
    id: 1n,
    name: "FIRST STEP",
    icon: "👣",
    desc: "Complete your first mission",
  },
  { id: 2n, name: "7-DAY STREAK", icon: "🔥", desc: "7 days consistent" },
  { id: 3n, name: "IRON BODY", icon: "💪", desc: "30 workout sessions" },
  { id: 4n, name: "MIND MASTER", icon: "🧠", desc: "Read 10 books" },
  { id: 5n, name: "IRON WILL", icon: "🛡", desc: "30 days discipline" },
  {
    id: 6n,
    name: "KNOWLEDGE SEEKER",
    icon: "📚",
    desc: "Complete 50 study sessions",
  },
  { id: 7n, name: "ZEN WARRIOR", icon: "🧘", desc: "30 meditation sessions" },
  { id: 8n, name: "SOCIAL BEAST", icon: "🤝", desc: "Connect with 10 people" },
  { id: 9n, name: "EARLY RISER", icon: "🌅", desc: "Wake up early 21 days" },
  {
    id: 10n,
    name: "NO EXCUSES",
    icon: "⚡",
    desc: "Zero missed days in a month",
  },
  { id: 11n, name: "ELITE RANK", icon: "👑", desc: "Reach A-Rank" },
  { id: 12n, name: "BEAST MODE", icon: "🦁", desc: "Reach BEAST MODE rank" },
];

function getGenderAvatar(gender: string): string {
  if (gender === "female") return "👩‍🦰";
  if (gender === "male") return "👨‍🦱";
  return "🧑‍🚀";
}

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  icon: string;
}

function StatBar({ label, value, icon, color }: StatBarProps) {
  const [animVal, setAnimVal] = useState(0);
  const pct = Math.min((value / 100) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => setAnimVal(pct), 200);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        background: "oklch(0.09 0.015 260 / 0.8)",
        border: "1px solid oklch(0.22 0.03 260 / 0.5)",
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.4rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.9rem" }}>{icon}</span>
          <span
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: color,
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
        <span
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "oklch(0.9 0.02 260)",
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          height: "3px",
          background: "oklch(0.15 0.02 260)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${animVal}%`,
            background: color,
            boxShadow: `0 0 6px ${color}`,
            borderRadius: "2px",
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}

export function ProfileView({ profile }: { profile: PlayerProfile }) {
  const level = Number(profile.level);
  const xp = Number(profile.xp);
  const rankInfo = getRankInfo(level);
  const xpInLevel = xp % 1000;
  const xpPct = (xpInLevel / 1000) * 100;
  const [animXp, setAnimXp] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimXp(xpPct), 300);
    return () => clearTimeout(timer);
  }, [xpPct]);

  const unlockedAchievements = profile.achievements.map((a) => Number(a));

  const stats = [
    {
      label: "STR",
      value: Number(profile.stats.strength),
      icon: "💪",
      color: "oklch(0.62 0.25 22)",
    },
    {
      label: "SPD",
      value: Number(profile.stats.speed),
      icon: "⚡",
      color: "oklch(0.82 0.18 85)",
    },
    {
      label: "END",
      value: Number(profile.stats.endurance),
      icon: "🛡",
      color: "oklch(0.65 0.18 160)",
    },
    {
      label: "INT",
      value: Number(profile.stats.intelligence),
      icon: "🧠",
      color: "oklch(0.65 0.22 250)",
    },
    {
      label: "FOC",
      value: Number(profile.stats.focus),
      icon: "🎯",
      color: "oklch(0.62 0.22 295)",
    },
    {
      label: "AUR",
      value: Number(profile.stats.aura),
      icon: "✨",
      color: "oklch(0.78 0.18 280)",
    },
  ];

  const categoryBars = [
    {
      label: "FITNESS",
      value: Number(profile.categoryXP.fitness),
      color: "oklch(0.62 0.25 22)",
    },
    {
      label: "MARTIAL",
      value: Number(profile.categoryXP.martial),
      color: "oklch(0.62 0.22 295)",
    },
    {
      label: "INTEL",
      value: Number(profile.categoryXP.intelligence),
      color: "oklch(0.65 0.22 250)",
    },
    {
      label: "FOCUS",
      value: Number(profile.categoryXP.focus),
      color: "oklch(0.82 0.18 85)",
    },
    {
      label: "DISCIPLINE",
      value: Number(profile.categoryXP.discipline),
      color: "oklch(0.65 0.2 140)",
    },
    {
      label: "MINDSET",
      value: Number(profile.categoryXP.mindset),
      color: "oklch(0.72 0.2 45)",
    },
  ];

  const maxCategoryXP = Math.max(...categoryBars.map((c) => c.value), 1);

  return (
    <div
      data-ocid="dashboard.profile.button"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {/* Top row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: "1.25rem",
          alignItems: "stretch",
        }}
        className="grid-cols-1 sm:grid-cols-3"
      >
        {/* Avatar + info */}
        <div
          className="glass-card-red"
          style={{
            padding: "1.5rem",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, oklch(0.62 0.25 22 / 0.3) 0%, oklch(0.62 0.22 295 / 0.3) 100%)",
              border: "2px solid oklch(0.62 0.25 22 / 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              flexShrink: 0,
              animation: "float 4s ease-in-out infinite",
            }}
          >
            {getGenderAvatar(profile.gender)}
          </div>
          <div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "oklch(0.95 0.02 260)",
                letterSpacing: "0.06em",
                marginBottom: "0.35rem",
              }}
            >
              {profile.username}
            </div>
            <div
              style={{
                display: "inline-flex",
                padding: "0.2rem 0.6rem",
                background:
                  "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                borderRadius: "100px",
                fontSize: "0.68rem",
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                color: "oklch(0.98 0 0)",
                letterSpacing: "0.08em",
                boxShadow: "0 0 8px oklch(0.62 0.25 22 / 0.4)",
              }}
            >
              🏆 LEVEL {level}
            </div>
            {profile.goal && (
              <div
                style={{
                  marginTop: "0.35rem",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.68rem",
                  color: "oklch(0.55 0.04 260)",
                }}
              >
                Goal: {profile.goal}
              </div>
            )}
          </div>
        </div>

        {/* Rank badge */}
        <div
          style={{
            padding: "1.25rem",
            background: "oklch(0.09 0.015 260 / 0.8)",
            border: `1px solid ${rankInfo.color.replace(")", " / 0.4)")}`,
            borderRadius: "10px",
            backdropFilter: "blur(16px)",
            textAlign: "center",
            boxShadow: rankInfo.glow,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            minWidth: "160px",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              fontFamily: '"Sora", sans-serif',
              letterSpacing: "0.2em",
              color: "oklch(0.45 0.03 260)",
              fontWeight: 700,
            }}
          >
            RANK
          </div>
          <div
            style={{
              fontSize: "2.5rem",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            {rankInfo.badge}
          </div>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.68rem",
              fontWeight: 900,
              letterSpacing: "0.12em",
              color: rankInfo.color,
              textShadow: rankInfo.glow.split(",")[0],
              textTransform: "uppercase",
            }}
          >
            {rankInfo.title}
          </div>
        </div>

        {/* XP stats */}
        <div
          className="glass-card-purple"
          style={{ padding: "1.5rem", borderRadius: "10px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "oklch(0.62 0.22 295)",
              }}
            >
              XP PROGRESS
            </span>
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.7rem",
                color: "oklch(0.7 0.04 260)",
              }}
            >
              {xpInLevel} / 1000
            </span>
          </div>
          <div
            style={{
              height: "8px",
              background: "oklch(0.15 0.02 260)",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${animXp}%`,
                background:
                  "linear-gradient(90deg, oklch(0.62 0.25 22) 0%, oklch(0.62 0.22 295) 100%)",
                boxShadow: "0 0 8px oklch(0.62 0.22 295 / 0.7)",
                borderRadius: "4px",
                transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.58rem",
                  color: "oklch(0.45 0.03 260)",
                  letterSpacing: "0.1em",
                  marginBottom: "0.2rem",
                }}
              >
                TOTAL XP
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "oklch(0.62 0.25 22)",
                  textShadow: "0 0 8px oklch(0.62 0.25 22 / 0.6)",
                }}
              >
                {xp.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.58rem",
                  color: "oklch(0.45 0.03 260)",
                  letterSpacing: "0.1em",
                  marginBottom: "0.2rem",
                }}
              >
                SKILL POINTS
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "oklch(0.62 0.22 295)",
                  textShadow: "0 0 8px oklch(0.62 0.22 295 / 0.6)",
                }}
              >
                SP: {Number(profile.skillPoints)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h3
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "oklch(0.62 0.22 295)",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          ◆ LIFE STATS
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.6rem",
          }}
          className="grid grid-cols-2 sm:grid-cols-3"
        >
          {stats.map((s) => (
            <StatBar
              key={s.label}
              label={s.label}
              value={s.value}
              icon={s.icon}
              color={s.color}
            />
          ))}
        </div>
      </div>

      {/* Category XP */}
      <div>
        <h3
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "oklch(0.62 0.25 22)",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          ◆ CATEGORY XP
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.6rem",
          }}
          className="grid grid-cols-2 sm:grid-cols-3"
        >
          {categoryBars.map((cat) => {
            const pct = (cat.value / Math.max(maxCategoryXP, 1)) * 100;
            return (
              <div
                key={cat.label}
                style={{
                  padding: "0.65rem 0.85rem",
                  background: "oklch(0.09 0.015 260 / 0.8)",
                  border: "1px solid oklch(0.2 0.02 260 / 0.5)",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: cat.color,
                    }}
                  >
                    {cat.label}
                  </span>
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      color: "oklch(0.6 0.04 260)",
                    }}
                  >
                    {cat.value}
                  </span>
                </div>
                <div
                  style={{
                    height: "2px",
                    background: "oklch(0.15 0.02 260)",
                    borderRadius: "1px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: cat.color,
                      boxShadow: `0 0 4px ${cat.color}`,
                      borderRadius: "1px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "oklch(0.82 0.18 85)",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          ◆ ACHIEVEMENT BADGES
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "0.6rem",
          }}
          className="grid grid-cols-4 sm:grid-cols-6"
        >
          {ACHIEVEMENT_DATA.map((ach) => {
            const unlocked = unlockedAchievements.includes(Number(ach.id));
            return (
              <div
                key={String(ach.id)}
                title={`${ach.name}: ${ach.desc}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.65rem 0.4rem",
                  background: unlocked
                    ? "oklch(0.62 0.25 22 / 0.1)"
                    : "oklch(0.09 0.01 260 / 0.5)",
                  border: `1px solid ${unlocked ? "oklch(0.62 0.25 22 / 0.5)" : "oklch(0.2 0.02 260 / 0.5)"}`,
                  borderRadius: "8px",
                  boxShadow: unlocked
                    ? "0 0 10px oklch(0.62 0.25 22 / 0.2)"
                    : "none",
                  filter: unlocked ? "none" : "grayscale(1) brightness(0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{ach.icon}</span>
                <span
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.45rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textAlign: "center",
                    color: unlocked
                      ? "oklch(0.82 0.18 85)"
                      : "oklch(0.35 0.02 260)",
                    lineHeight: 1.2,
                  }}
                >
                  {ach.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface PlayerDashboardSectionProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

export function PlayerDashboardSection({
  isLoggedIn,
  onLoginClick,
}: PlayerDashboardSectionProps) {
  const { data: profile, isLoading } = usePlayerProfile();

  return (
    <section
      id="dashboard"
      data-ocid="dashboard.section"
      style={{
        minHeight: "100vh",
        padding: "100px 2rem 80px",
        background: "oklch(0.06 0.01 255)",
        position: "relative",
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.22 295 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.62 0.22 295 / 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
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
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.22 295)",
              }}
            >
              MY PROGRESS
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "oklch(0.95 0.02 260)",
              margin: 0,
              textShadow: "0 0 20px oklch(0.62 0.22 295 / 0.3)",
            }}
          >
            YOUR DASHBOARD
          </h2>
        </div>

        {/* Content */}
        {!isLoggedIn ? (
          <div
            className="glass-card"
            style={{
              padding: "3rem 2rem",
              borderRadius: "12px",
              textAlign: "center",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔒</div>
            <h3
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "oklch(0.95 0.02 260)",
                marginBottom: "0.75rem",
              }}
            >
              ACCESS RESTRICTED
            </h3>
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                color: "oklch(0.6 0.04 260)",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              Login to access your dashboard, track your self-improvement
              journey, and rise through the ranks.
            </p>
            <button
              type="button"
              onClick={onLoginClick}
              className="btn-neon-red"
              style={{
                padding: "0.8rem 2rem",
                fontSize: "0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ⚡ LOGIN TO BEGIN
            </button>
          </div>
        ) : isLoading ? (
          <div
            data-ocid="dashboard.loading_state"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "4rem",
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
                  width: "48px",
                  height: "48px",
                  border: "2px solid oklch(0.62 0.25 22 / 0.2)",
                  borderTop: "2px solid oklch(0.62 0.25 22)",
                  borderRadius: "50%",
                  animation: "spinGlow 0.8s linear infinite",
                }}
              />
              <span
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.62 0.25 22)",
                }}
              >
                LOADING PROFILE...
              </span>
            </div>
          </div>
        ) : !profile ? (
          <div
            className="glass-card"
            style={{
              padding: "3rem 2rem",
              borderRadius: "12px",
              textAlign: "center",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>⚡</div>
            <h3
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "oklch(0.62 0.25 22)",
                marginBottom: "0.75rem",
              }}
            >
              COMPLETE YOUR SETUP
            </h3>
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                color: "oklch(0.6 0.04 260)",
                fontSize: "0.9rem",
              }}
            >
              Finish the onboarding to set up your player profile.
            </p>
          </div>
        ) : (
          <div
            className="glass-card"
            style={{ padding: "2rem", borderRadius: "12px" }}
          >
            <ProfileView profile={profile} />
          </div>
        )}
      </div>
    </section>
  );
}
