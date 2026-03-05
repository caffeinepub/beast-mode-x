import { usePlayerProfile } from "@/hooks/useBackend";
import { useEffect, useState } from "react";

interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  cost: number;
  desc: string;
  requires: number | null;
}

const SKILLS: Skill[] = [
  // Fitness
  {
    id: 0,
    name: "BASIC TRAINING",
    category: "Fitness",
    icon: "💪",
    cost: 1,
    desc: "Foundation of physical power",
    requires: null,
  },
  {
    id: 1,
    name: "ENDURANCE+",
    category: "Fitness",
    icon: "🏃",
    cost: 2,
    desc: "Run further, last longer",
    requires: 0,
  },
  {
    id: 2,
    name: "IRON BODY",
    category: "Fitness",
    icon: "🦾",
    cost: 3,
    desc: "Peak physical conditioning",
    requires: 1,
  },
  // Mind
  {
    id: 3,
    name: "FOCUSED MIND",
    category: "Mind",
    icon: "🧠",
    cost: 1,
    desc: "Sharpen your concentration",
    requires: null,
  },
  {
    id: 4,
    name: "DEEP WORK",
    category: "Mind",
    icon: "🎯",
    cost: 2,
    desc: "Hours of uninterrupted focus",
    requires: 3,
  },
  {
    id: 5,
    name: "GENIUS MODE",
    category: "Mind",
    icon: "⚡",
    cost: 3,
    desc: "Unlock your full mental potential",
    requires: 4,
  },
  // Discipline
  {
    id: 6,
    name: "HABIT BUILDER",
    category: "Discipline",
    icon: "🔒",
    cost: 1,
    desc: "Start your streak journey",
    requires: null,
  },
  {
    id: 7,
    name: "IRON WILL",
    category: "Discipline",
    icon: "🛡",
    cost: 2,
    desc: "Resist any temptation",
    requires: 6,
  },
  {
    id: 8,
    name: "UNBREAKABLE",
    category: "Discipline",
    icon: "💎",
    cost: 3,
    desc: "Nothing can stop you",
    requires: 7,
  },
  // Knowledge
  {
    id: 9,
    name: "READER",
    category: "Knowledge",
    icon: "📖",
    cost: 1,
    desc: "Books are your weapons",
    requires: null,
  },
  {
    id: 10,
    name: "SCHOLAR",
    category: "Knowledge",
    icon: "📚",
    cost: 2,
    desc: "Knowledge compounds daily",
    requires: 9,
  },
  {
    id: 11,
    name: "SAGE",
    category: "Knowledge",
    icon: "🦉",
    cost: 3,
    desc: "Wisdom flows through you",
    requires: 10,
  },
  // Social
  {
    id: 12,
    name: "NETWORKER",
    category: "Social",
    icon: "🤝",
    cost: 1,
    desc: "Build your tribe",
    requires: null,
  },
  {
    id: 13,
    name: "LEADER",
    category: "Social",
    icon: "👑",
    cost: 2,
    desc: "Others follow your path",
    requires: 12,
  },
  {
    id: 14,
    name: "LEGEND",
    category: "Social",
    icon: "🌟",
    cost: 3,
    desc: "Your legacy lives forever",
    requires: 13,
  },
];

const CATEGORIES = ["Fitness", "Mind", "Discipline", "Knowledge", "Social"];

const CATEGORY_COLORS: Record<string, string> = {
  Fitness: "oklch(0.62 0.25 22)",
  Mind: "oklch(0.62 0.22 295)",
  Discipline: "oklch(0.62 0.25 22)",
  Knowledge: "oklch(0.62 0.22 295)",
  Social: "oklch(0.62 0.25 22)",
};

const STORAGE_KEY = "bmx_skills";

function loadUnlocked(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as number[];
  } catch {
    // ignore
  }
  return [];
}

function saveUnlocked(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function SkillTreeSection() {
  const { data: profile } = usePlayerProfile();
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [spSpent, setSpSpent] = useState(0);

  useEffect(() => {
    const saved = loadUnlocked();
    setUnlockedIds(saved);
    const spent = saved.reduce((acc, id) => {
      const skill = SKILLS.find((s) => s.id === id);
      return acc + (skill?.cost ?? 0);
    }, 0);
    setSpSpent(spent);
  }, []);

  const availableSP = Math.max(0, Number(profile?.skillPoints ?? 0) - spSpent);

  const canUnlock = (skill: Skill): boolean => {
    if (unlockedIds.includes(skill.id)) return false;
    if (availableSP < skill.cost) return false;
    if (skill.requires !== null && !unlockedIds.includes(skill.requires))
      return false;
    return true;
  };

  const handleUnlock = (skill: Skill) => {
    if (!canUnlock(skill)) return;
    const updated = [...unlockedIds, skill.id];
    setUnlockedIds(updated);
    saveUnlocked(updated);
    setSpSpent((prev) => prev + skill.cost);
  };

  return (
    <section
      id="skills"
      data-ocid="skills.section"
      style={{
        padding: "100px clamp(1rem, 4vw, 2rem) 80px",
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
            "linear-gradient(oklch(0.62 0.22 295 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse, oklch(0.62 0.22 295 / 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1300px",
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
              SKILL TREE
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Orbitron", monospace',
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              margin: "0 0 1.5rem 0",
              background:
                "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.7 0.28 22) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            UPGRADE YOUR SKILLS
          </h2>

          {/* SP display */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem 1.25rem",
              background: "oklch(0.62 0.22 295 / 0.1)",
              border: "1px solid oklch(0.62 0.22 295 / 0.4)",
              borderRadius: "8px",
              boxShadow: "0 0 16px oklch(0.62 0.22 295 / 0.15)",
            }}
          >
            <span
              style={{
                fontFamily: '"Orbitron", monospace',
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "oklch(0.55 0.04 260)",
              }}
            >
              AVAILABLE SP
            </span>
            <span
              style={{
                fontFamily: '"Orbitron", monospace',
                fontSize: "1.4rem",
                fontWeight: 900,
                color: "oklch(0.62 0.22 295)",
                textShadow: "0 0 12px oklch(0.62 0.22 295 / 0.7)",
              }}
            >
              {availableSP}
            </span>
            {!profile && (
              <span
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.7rem",
                  color: "oklch(0.5 0.03 260)",
                }}
              >
                (login to earn SP)
              </span>
            )}
          </div>
        </div>

        {/* Skill tree columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
            overflowX: "auto",
          }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        >
          {CATEGORIES.map((category) => {
            const catColor =
              CATEGORY_COLORS[category] ?? "oklch(0.62 0.22 295)";
            const catSkills = SKILLS.filter((s) => s.category === category);

            return (
              <div
                key={category}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0",
                }}
              >
                {/* Category header */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "1rem",
                    padding: "0.5rem",
                    background: `${catColor.replace(")", " / 0.1)")}`,
                    border: `1px solid ${catColor.replace(")", " / 0.3)")}`,
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Orbitron", monospace',
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: catColor,
                    }}
                  >
                    {category.toUpperCase()}
                  </span>
                </div>

                {/* Skills in column */}
                {catSkills.map((skill, skillIdx) => {
                  const isUnlocked = unlockedIds.includes(skill.id);
                  const prereqMet =
                    skill.requires === null ||
                    unlockedIds.includes(skill.requires);
                  const isLocked = !prereqMet;
                  const canUnlockSkill = canUnlock(skill);
                  const globalIdx = SKILLS.findIndex((s) => s.id === skill.id);

                  return (
                    <div key={skill.id} style={{ position: "relative" }}>
                      {/* Connector line (not on first) */}
                      {skillIdx > 0 && (
                        <div
                          style={{
                            width: "2px",
                            height: "16px",
                            margin: "0 auto",
                            background: isUnlocked
                              ? catColor
                              : "oklch(0.2 0.02 260)",
                            boxShadow: isUnlocked
                              ? `0 0 6px ${catColor.replace(")", " / 0.6)")}`
                              : "none",
                            transition: "all 0.3s ease",
                          }}
                        />
                      )}

                      {/* Skill card */}
                      <div
                        data-ocid={`skills.item.${globalIdx + 1}`}
                        style={{
                          padding: "1rem",
                          background: isUnlocked
                            ? `${catColor.replace(")", " / 0.15)")}`
                            : isLocked
                              ? "oklch(0.07 0.01 260 / 0.6)"
                              : "oklch(0.1 0.015 260 / 0.8)",
                          border: `1px solid ${
                            isUnlocked
                              ? catColor.replace(")", " / 0.6)")
                              : isLocked
                                ? "oklch(0.18 0.02 260 / 0.6)"
                                : catColor.replace(")", " / 0.25)")
                          }`,
                          borderRadius: "8px",
                          backdropFilter: "blur(8px)",
                          transition: "all 0.3s ease",
                          filter: isLocked
                            ? "grayscale(0.8) brightness(0.7)"
                            : "none",
                          boxShadow: isUnlocked
                            ? `0 0 16px ${catColor.replace(")", " / 0.2)")}`
                            : "none",
                          position: "relative",
                          overflow: "hidden",
                          marginBottom: "0",
                        }}
                      >
                        {/* Unlocked glow overlay */}
                        {isUnlocked && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: `linear-gradient(135deg, ${catColor.replace(")", " / 0.08)")} 0%, transparent 60%)`,
                              pointerEvents: "none",
                            }}
                          />
                        )}

                        {/* Icon */}
                        <div
                          style={{
                            fontSize: "1.6rem",
                            lineHeight: 1,
                            marginBottom: "0.5rem",
                            filter: isLocked ? "grayscale(1)" : "none",
                          }}
                        >
                          {skill.icon}
                        </div>

                        {/* Name */}
                        <h4
                          style={{
                            fontFamily: '"Orbitron", monospace',
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: isUnlocked
                              ? catColor
                              : isLocked
                                ? "oklch(0.35 0.02 260)"
                                : "oklch(0.85 0.02 260)",
                            margin: "0 0 0.35rem",
                            lineHeight: 1.3,
                            textShadow: isUnlocked
                              ? `0 0 8px ${catColor.replace(")", " / 0.6)")}`
                              : "none",
                          }}
                        >
                          {skill.name}
                        </h4>

                        {/* Desc */}
                        <p
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.68rem",
                            color: isLocked
                              ? "oklch(0.35 0.02 260)"
                              : "oklch(0.55 0.03 260)",
                            margin: "0 0 0.75rem",
                            lineHeight: 1.4,
                          }}
                        >
                          {skill.desc}
                        </p>

                        {/* Cost + action */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingTop: "0.5rem",
                            borderTop: `1px solid ${
                              isUnlocked
                                ? catColor.replace(")", " / 0.2)")
                                : "oklch(0.18 0.02 260 / 0.5)"
                            }`,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: '"Orbitron", monospace',
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              color: isLocked
                                ? "oklch(0.3 0.02 260)"
                                : catColor,
                              textShadow: !isLocked
                                ? `0 0 6px ${catColor.replace(")", " / 0.5)")}`
                                : "none",
                            }}
                          >
                            {skill.cost} SP
                          </span>

                          {isUnlocked ? (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: catColor,
                                textShadow: `0 0 8px ${catColor.replace(")", " / 0.8)")}`,
                              }}
                            >
                              ✓
                            </span>
                          ) : isLocked ? (
                            <span
                              style={{
                                fontFamily: '"Orbitron", monospace',
                                fontSize: "0.55rem",
                                color: "oklch(0.3 0.02 260)",
                                letterSpacing: "0.08em",
                              }}
                            >
                              🔒 LOCKED
                            </span>
                          ) : (
                            <button
                              type="button"
                              data-ocid={`skills.unlock.button.${globalIdx + 1}`}
                              onClick={() => handleUnlock(skill)}
                              disabled={!canUnlockSkill}
                              style={{
                                padding: "0.25rem 0.6rem",
                                background: canUnlockSkill
                                  ? `${catColor.replace(")", " / 0.2)")}`
                                  : "oklch(0.12 0.01 260)",
                                border: `1px solid ${
                                  canUnlockSkill
                                    ? catColor.replace(")", " / 0.6)")
                                    : "oklch(0.2 0.02 260)"
                                }`,
                                borderRadius: "3px",
                                color: canUnlockSkill
                                  ? catColor
                                  : "oklch(0.35 0.02 260)",
                                fontFamily: '"Orbitron", monospace',
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                cursor: canUnlockSkill
                                  ? "pointer"
                                  : "not-allowed",
                                transition: "all 0.2s ease",
                                boxShadow: canUnlockSkill
                                  ? `0 0 8px ${catColor.replace(")", " / 0.3)")}`
                                  : "none",
                              }}
                            >
                              UNLOCK
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.75rem",
            color: "oklch(0.45 0.03 260)",
            marginTop: "2rem",
          }}
        >
          Earn SP by leveling up through completing missions and gaining XP.
        </p>
      </div>
    </section>
  );
}
