import {
  useAddXP,
  usePlayerProfile,
  useRegisterPlayer,
  useUnlockAchievement,
} from "@/hooks/useBackend";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { PlayerProfile } from "../backend.d";

interface DashboardSectionProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

const STAT_ICONS: Record<string, string> = {
  FITNESS: "💪",
  PRODUCTIVITY: "⚡",
  DISCIPLINE: "🛡",
  KNOWLEDGE: "📚",
  FOCUS: "🎯",
  MINDSET: "🧠",
};

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
  { id: 11n, name: "ELITE RANK", icon: "👑", desc: "Reach ELITE rank" },
  { id: 12n, name: "BEAST MODE", icon: "🦁", desc: "Reach BEAST rank" },
];

interface RankInfo {
  name: string;
  image: string;
  color: string;
  glow: string;
}

function getRankInfo(xp: number): RankInfo {
  if (xp >= 25000) {
    return {
      name: "BEAST",
      image: "/assets/generated/badge-beast-transparent.dim_200x200.png",
      color: "oklch(0.62 0.25 22)",
      glow: "0 0 16px oklch(0.62 0.25 22 / 0.8), 0 0 40px oklch(0.62 0.25 22 / 0.4)",
    };
  }
  if (xp >= 10000) {
    return {
      name: "LEGEND",
      image: "/assets/generated/badge-legend-transparent.dim_200x200.png",
      color: "oklch(0.82 0.18 85)",
      glow: "0 0 16px oklch(0.82 0.18 85 / 0.8), 0 0 40px oklch(0.82 0.18 85 / 0.4)",
    };
  }
  if (xp >= 5000) {
    return {
      name: "ELITE",
      image: "/assets/generated/badge-elite-transparent.dim_200x200.png",
      color: "oklch(0.62 0.22 295)",
      glow: "0 0 16px oklch(0.62 0.22 295 / 0.8), 0 0 40px oklch(0.62 0.22 295 / 0.4)",
    };
  }
  if (xp >= 1000) {
    return {
      name: "WARRIOR",
      image: "/assets/generated/badge-warrior-transparent.dim_200x200.png",
      color: "oklch(0.62 0.22 295)",
      glow: "0 0 16px oklch(0.62 0.22 295 / 0.6), 0 0 30px oklch(0.62 0.22 295 / 0.3)",
    };
  }
  return {
    name: "NOVICE",
    image: "/assets/generated/badge-novice-transparent.dim_200x200.png",
    color: "oklch(0.65 0.04 260)",
    glow: "0 0 12px oklch(0.65 0.04 260 / 0.4)",
  };
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  const pct = Math.min((value / 100) * 100, 100);
  return (
    <div
      style={{
        padding: "0.85rem 1rem",
        background: "oklch(0.09 0.015 260 / 0.8)",
        border: "1px solid oklch(0.25 0.04 260 / 0.6)",
        borderRadius: "6px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "oklch(0.62 0.22 295 / 0.5)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 12px oklch(0.62 0.22 295 / 0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "oklch(0.25 0.04 260 / 0.6)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "1rem" }}>{icon}</span>
          <span
            style={{
              fontFamily: '"Orbitron", monospace',
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "oklch(0.62 0.22 295)",
            }}
          >
            {label}
          </span>
        </div>
        <span
          style={{
            fontFamily: '"Orbitron", monospace',
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "oklch(0.9 0.04 260)",
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          height: "3px",
          background: "oklch(0.18 0.02 260)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, oklch(0.62 0.22 295) 0%, oklch(0.62 0.25 22) 100%)",
            boxShadow: "0 0 6px oklch(0.62 0.22 295 / 0.6)",
            borderRadius: "2px",
            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}

function RankBadge({ xp }: { xp: number }) {
  const rank = getRankInfo(xp);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.4rem",
        padding: "1.25rem",
        background: "oklch(0.09 0.015 260 / 0.8)",
        border: `1px solid ${rank.color.replace(")", " / 0.4)")}`,
        borderRadius: "8px",
        backdropFilter: "blur(16px)",
        textAlign: "center",
        boxShadow: rank.glow,
      }}
    >
      <div
        style={{
          fontFamily: '"Orbitron", monospace',
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "oklch(0.55 0.04 260)",
          marginBottom: "0.25rem",
        }}
      >
        CURRENT RANK
      </div>
      <img
        src={rank.image}
        alt={rank.name}
        width={80}
        height={80}
        style={{
          filter: `drop-shadow(0 0 8px ${rank.color.replace(")", " / 0.8)")})`,
          animation: "float 4s ease-in-out infinite",
        }}
      />
      <span
        style={{
          fontFamily: '"Orbitron", monospace',
          fontSize: "0.75rem",
          fontWeight: 900,
          letterSpacing: "0.15em",
          color: rank.color,
          textShadow: rank.glow.split(",")[0],
        }}
      >
        {rank.name}
      </span>
    </div>
  );
}

function ProfileCard({ profile }: { profile: PlayerProfile }) {
  const xpInLevel = Number(profile.xp) % 1000;
  const xpPct = (xpInLevel / 1000) * 100;
  const [animXp, setAnimXp] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimXp(xpPct), 300);
    return () => clearTimeout(timer);
  }, [xpPct]);

  const addXp = useAddXP();
  const unlockAchievement = useUnlockAchievement();

  const stats = [
    {
      label: "FITNESS",
      value: Number(profile.stats.strength),
      icon: STAT_ICONS.FITNESS,
    },
    {
      label: "PRODUCTIVITY",
      value: Number(profile.stats.speed),
      icon: STAT_ICONS.PRODUCTIVITY,
    },
    {
      label: "DISCIPLINE",
      value: Number(profile.stats.endurance),
      icon: STAT_ICONS.DISCIPLINE,
    },
    {
      label: "KNOWLEDGE",
      value: Number(profile.stats.intelligence),
      icon: STAT_ICONS.KNOWLEDGE,
    },
    {
      label: "FOCUS",
      value: Number(profile.stats.focus),
      icon: STAT_ICONS.FOCUS,
    },
    {
      label: "MINDSET",
      value: Number(profile.stats.aura),
      icon: STAT_ICONS.MINDSET,
    },
  ];

  const unlockedIds = profile.achievements.map((a) => Number(a));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Top profile row — 3 columns: avatar, rank badge, xp */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 180px 1fr",
          gap: "1.5rem",
        }}
        className="grid-cols-1 sm:grid-cols-3"
      >
        {/* Avatar + Identity */}
        <div
          className="glass-card-red"
          style={{
            padding: "1.5rem",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          {/* Avatar */}
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
              boxShadow:
                "0 0 12px oklch(0.62 0.25 22 / 0.3), 0 0 30px oklch(0.62 0.25 22 / 0.1)",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            🏆
          </div>
          <div>
            <div
              style={{
                fontFamily: '"Orbitron", monospace',
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "oklch(0.95 0.02 260)",
                letterSpacing: "0.06em",
                textShadow: "0 0 12px oklch(0.62 0.25 22 / 0.5)",
              }}
            >
              {profile.username}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "0.35rem",
                padding: "0.2rem 0.6rem",
                background:
                  "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                borderRadius: "100px",
                fontSize: "0.7rem",
                fontFamily: '"Orbitron", monospace',
                fontWeight: 700,
                color: "oklch(0.98 0 0)",
                letterSpacing: "0.1em",
                boxShadow: "0 0 8px oklch(0.62 0.25 22 / 0.4)",
              }}
            >
              🏆 LEVEL {Number(profile.level)}
            </div>
          </div>
        </div>

        {/* Rank Badge (center) */}
        <RankBadge xp={Number(profile.xp)} />

        {/* XP + SP */}
        <div
          className="glass-card-purple"
          style={{ padding: "1.5rem", borderRadius: "8px" }}
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
                fontFamily: '"Orbitron", monospace',
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "oklch(0.62 0.22 295)",
              }}
            >
              XP PROGRESS
            </span>
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.75rem",
                color: "oklch(0.8 0.04 260)",
              }}
            >
              {xpInLevel} / 1000
            </span>
          </div>

          {/* XP Bar */}
          <div
            style={{
              height: "8px",
              background: "oklch(0.15 0.02 260)",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "1rem",
              boxShadow: "inset 0 1px 3px oklch(0 0 0 / 0.5)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${animXp}%`,
                background:
                  "linear-gradient(90deg, oklch(0.62 0.25 22) 0%, oklch(0.62 0.22 295) 100%)",
                boxShadow:
                  "0 0 8px oklch(0.62 0.22 295 / 0.7), 0 0 16px oklch(0.62 0.22 295 / 0.4)",
                borderRadius: "4px",
                transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: "oklch(0.95 0 0 / 0.6)",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: "0.6rem",
                  color: "oklch(0.55 0.04 260)",
                  letterSpacing: "0.1em",
                  marginBottom: "0.2rem",
                }}
              >
                TOTAL XP
              </div>
              <div
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "oklch(0.62 0.25 22)",
                  textShadow: "0 0 8px oklch(0.62 0.25 22 / 0.6)",
                }}
              >
                {Number(profile.xp).toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: "0.6rem",
                  color: "oklch(0.55 0.04 260)",
                  letterSpacing: "0.1em",
                  marginBottom: "0.2rem",
                }}
              >
                SKILL POINTS
              </div>
              <div
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: "1.3rem",
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
            fontFamily: '"Orbitron", monospace',
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "oklch(0.62 0.22 295)",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          ◆ Life Stats
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
          }}
          className="grid-cols-2 sm:grid-cols-3"
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3
          style={{
            fontFamily: '"Orbitron", monospace',
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "oklch(0.62 0.25 22)",
            marginBottom: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          ◆ Achievement Badges
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.75rem",
          }}
          className="grid-cols-4 sm:grid-cols-6"
        >
          {ACHIEVEMENT_DATA.map((ach, idx) => {
            const unlocked = unlockedIds.includes(Number(ach.id));
            return (
              <button
                type="button"
                key={ach.id}
                data-ocid={`dashboard.achievement.item.${idx + 1}`}
                title={ach.desc}
                onClick={() => {
                  if (!unlocked) {
                    unlockAchievement.mutate(ach.id);
                  }
                }}
                disabled={unlocked || unlockAchievement.isPending}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.75rem 0.5rem",
                  background: unlocked
                    ? "oklch(0.62 0.25 22 / 0.12)"
                    : "oklch(0.09 0.01 260 / 0.6)",
                  border: `1px solid ${
                    unlocked
                      ? "oklch(0.62 0.25 22 / 0.6)"
                      : "oklch(0.22 0.03 260 / 0.6)"
                  }`,
                  borderRadius: "8px",
                  cursor: unlocked ? "default" : "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: unlocked
                    ? "0 0 10px oklch(0.62 0.25 22 / 0.25)"
                    : "none",
                  filter: unlocked ? "none" : "grayscale(1) brightness(0.4)",
                }}
                onMouseEnter={(e) => {
                  if (!unlocked) {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(0.62 0.22 295 / 0.5)";
                    (e.currentTarget as HTMLElement).style.filter =
                      "grayscale(0.5) brightness(0.7)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!unlocked) {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "oklch(0.22 0.03 260 / 0.6)";
                    (e.currentTarget as HTMLElement).style.filter =
                      "grayscale(1) brightness(0.4)";
                  }
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{ach.icon}</span>
                <span
                  style={{
                    fontFamily: '"Orbitron", monospace',
                    fontSize: "0.5rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textAlign: "center",
                    color: unlocked
                      ? "oklch(0.82 0.18 85)"
                      : "oklch(0.4 0.02 260)",
                    lineHeight: 1.2,
                  }}
                >
                  {ach.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add XP button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          data-ocid="dashboard.addxp.button"
          onClick={() => addXp.mutate(100n)}
          disabled={addXp.isPending}
          className="btn-neon-red"
          style={{
            padding: "0.75rem 2rem",
            fontSize: "0.8rem",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            opacity: addXp.isPending ? 0.7 : 1,
            cursor: addXp.isPending ? "not-allowed" : "pointer",
          }}
        >
          {addXp.isPending && (
            <Loader2
              size={14}
              style={{ animation: "spinGlow 0.8s linear infinite" }}
            />
          )}
          ⚡ COMPLETE MISSION (+100 XP)
        </button>
      </div>
    </div>
  );
}

function RegisterForm() {
  const [username, setUsername] = useState("");
  const register = useRegisterPlayer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) return;
    register.mutate(username.trim());
  };

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          animation: "float 4s ease-in-out infinite",
        }}
      >
        🏆
      </div>
      <h3
        style={{
          fontFamily: '"Orbitron", monospace',
          fontSize: "1.2rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "oklch(0.62 0.25 22)",
          textShadow: "0 0 12px oklch(0.62 0.25 22 / 0.6)",
          marginBottom: "0.5rem",
        }}
      >
        FORGE YOUR IDENTITY
      </h3>
      <p
        style={{
          fontFamily: '"Sora", sans-serif',
          color: "oklch(0.6 0.04 260)",
          fontSize: "0.9rem",
          marginBottom: "2rem",
        }}
      >
        Choose your warrior name to begin your self-improvement journey
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          data-ocid="dashboard.register.input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ENTER PLAYER NAME"
          minLength={2}
          maxLength={24}
          style={{
            fontFamily: '"Orbitron", monospace',
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            padding: "0.9rem 1.25rem",
            background: "oklch(0.09 0.015 260 / 0.8)",
            border: "1px solid oklch(0.62 0.25 22 / 0.4)",
            borderRadius: "6px",
            color: "oklch(0.9 0.02 260)",
            outline: "none",
            textAlign: "center",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => {
            (e.target as HTMLElement).style.borderColor =
              "oklch(0.62 0.25 22 / 0.8)";
            (e.target as HTMLElement).style.boxShadow =
              "0 0 12px oklch(0.62 0.25 22 / 0.2)";
          }}
          onBlur={(e) => {
            (e.target as HTMLElement).style.borderColor =
              "oklch(0.62 0.25 22 / 0.4)";
            (e.target as HTMLElement).style.boxShadow = "none";
          }}
        />
        <button
          data-ocid="dashboard.register.submit_button"
          type="submit"
          disabled={register.isPending || username.trim().length < 2}
          className="btn-neon-red"
          style={{
            padding: "0.9rem",
            fontSize: "0.85rem",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            opacity: register.isPending || username.trim().length < 2 ? 0.6 : 1,
            cursor:
              register.isPending || username.trim().length < 2
                ? "not-allowed"
                : "pointer",
          }}
        >
          {register.isPending && (
            <Loader2
              size={16}
              style={{ animation: "spinGlow 0.8s linear infinite" }}
            />
          )}
          {register.isPending ? "CREATING..." : "⚡ BEGIN YOUR JOURNEY"}
        </button>

        {register.isError && (
          <p
            style={{
              color: "oklch(0.62 0.25 22)",
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.8rem",
              textAlign: "center",
            }}
          >
            {register.error instanceof Error
              ? register.error.message
              : "Failed to register. Try again."}
          </p>
        )}
      </form>
    </div>
  );
}

export function DashboardSection({
  isLoggedIn,
  onLoginClick,
}: DashboardSectionProps) {
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
            "linear-gradient(oklch(0.62 0.22 295 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Radial glow */}
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
        {/* Section header */}
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
                fontFamily: '"Geist Mono", monospace',
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
              fontFamily: '"Orbitron", monospace',
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
                fontFamily: '"Orbitron", monospace',
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
                  fontFamily: '"Orbitron", monospace',
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
            className="glass-card-red"
            style={{ padding: "3rem 2rem", borderRadius: "12px" }}
          >
            <RegisterForm />
          </div>
        ) : (
          <div
            className="glass-card"
            style={{ padding: "2rem", borderRadius: "12px" }}
          >
            <ProfileCard profile={profile} />
          </div>
        )}
      </div>
    </section>
  );
}
