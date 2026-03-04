import { useActor } from "@/hooks/useActor";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PlayerProfile } from "../backend.d";

interface MartialArtsSectionProps {
  profile: PlayerProfile | null | undefined;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

interface DrillData {
  name: string;
  icon: string;
  desc: string;
  xp: number;
  duration: string;
}

const DRILLS: DrillData[] = [
  {
    name: "Basic Strike Combo",
    icon: "👊",
    desc: "Jab-cross-hook-uppercut combination. Perfect your form before adding speed.",
    xp: 50,
    duration: "5 min",
  },
  {
    name: "Defensive Kata",
    icon: "🛡",
    desc: "Practice the defensive flow sequence. Block, parry, redirect — movement is armor.",
    xp: 75,
    duration: "8 min",
  },
  {
    name: "Power Conditioning",
    icon: "💥",
    desc: "Explosive training for maximum impact force. Bursts of full-power strikes.",
    xp: 100,
    duration: "10 min",
  },
];

function getMartialArtsLevel(martialXP: bigint): number {
  const xp = Number(martialXP);
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2200) return 6;
  if (xp < 3000) return 7;
  if (xp < 4000) return 8;
  if (xp < 5500) return 9;
  return 10;
}

function getMartialXPForNextLevel(martialXP: bigint): {
  current: number;
  needed: number;
} {
  const thresholds = [
    0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 9999999,
  ];
  const xp = Number(martialXP);
  const level = getMartialArtsLevel(martialXP);
  const currentThreshold = thresholds[level - 1] ?? 0;
  const nextThreshold = thresholds[level] ?? 9999999;
  return {
    current: xp - currentThreshold,
    needed: nextThreshold - currentThreshold,
  };
}

interface TrainingOverlayProps {
  drill: DrillData;
  onComplete: () => void;
  onCancel: () => void;
}

function TrainingOverlay({
  drill,
  onComplete,
  onCancel,
}: TrainingOverlayProps) {
  const [phase, setPhase] = useState<"countdown" | "training" | "complete">(
    "countdown",
  );
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (phase === "countdown") {
      if (count > 0) {
        const timer = setTimeout(() => setCount((c) => c - 1), 800);
        return () => clearTimeout(timer);
      }
      setPhase("training");
      const done = setTimeout(() => setPhase("complete"), 2000);
      return () => clearTimeout(done);
    }
  }, [phase, count]);

  useEffect(() => {
    if (phase === "complete") {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 350,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0 0 0 / 0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {phase === "countdown" && count > 0 && (
          <>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(6rem, 20vw, 12rem)",
                color: "oklch(0.62 0.22 295)",
                textShadow:
                  "0 0 30px oklch(0.62 0.22 295 / 0.8), 0 0 60px oklch(0.62 0.22 295 / 0.4)",
                lineHeight: 1,
                animation: "neonPulse 0.6s ease-in-out",
                transition: "all 0.2s ease",
              }}
            >
              {count}
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "1rem",
                letterSpacing: "0.3em",
                color: "oklch(0.6 0.04 260)",
                marginTop: "1rem",
              }}
            >
              PREPARE YOURSELF
            </div>
          </>
        )}

        {phase === "countdown" && count === 0 && (
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(3rem, 10vw, 6rem)",
              color: "oklch(0.62 0.25 22)",
              textShadow: "0 0 30px oklch(0.62 0.25 22)",
              animation: "neonPulse 0.3s ease-in-out",
            }}
          >
            GO!
          </div>
        )}

        {phase === "training" && (
          <div>
            <div
              style={{
                fontSize: "5rem",
                marginBottom: "1rem",
                animation: "float 0.5s ease-in-out infinite",
              }}
            >
              {drill.icon}
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                fontSize: "1.5rem",
                letterSpacing: "0.1em",
                color: "oklch(0.9 0.02 260)",
              }}
            >
              {drill.name.toUpperCase()}
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.9rem",
                color: "oklch(0.6 0.04 260)",
                marginTop: "0.5rem",
                letterSpacing: "0.15em",
              }}
            >
              TRAINING IN PROGRESS...
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2rem, 8vw, 4rem)",
                color: "oklch(0.82 0.18 85)",
                textShadow: "0 0 20px oklch(0.82 0.18 85)",
                letterSpacing: "0.1em",
              }}
            >
              ✓ COMPLETE!
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "oklch(0.62 0.25 22)",
                textShadow: "0 0 12px oklch(0.62 0.25 22)",
                marginTop: "0.75rem",
              }}
            >
              +{drill.xp} XP EARNED!
            </div>
          </div>
        )}

        {phase === "countdown" && count > 0 && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1.5rem",
              background: "transparent",
              border: "1px solid oklch(0.3 0.04 260 / 0.6)",
              borderRadius: "6px",
              color: "oklch(0.5 0.03 260)",
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.78rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export function MartialArtsSection({
  profile,
  isLoggedIn,
  onLoginClick,
}: MartialArtsSectionProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [activeDrill, setActiveDrill] = useState<DrillData | null>(null);
  const [prevLevel, setPrevLevel] = useState<number | null>(null);
  const [levelUpFlash, setLevelUpFlash] = useState(false);

  const martialXP = profile?.martialArtsXP ?? 0n;
  const martialLevel = getMartialArtsLevel(martialXP);
  const { current, needed } = getMartialXPForNextLevel(martialXP);
  const levelPct = Math.min((current / needed) * 100, 100);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - prevLevel is a ref to previous value, not a reactive dep
  useEffect(() => {
    if (prevLevel !== null && martialLevel > prevLevel) {
      setLevelUpFlash(true);
      setTimeout(() => setLevelUpFlash(false), 1500);
      toast.success(`🥋 Martial Arts Level Up! Now Level ${martialLevel}!`);
    }
    setPrevLevel(martialLevel);
  }, [martialLevel]);

  const handleDrillComplete = async (drill: DrillData) => {
    if (!actor) return;
    try {
      await actor.updateMartialArtsXP(BigInt(drill.xp));
      await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
      toast.success(`Training complete! +${drill.xp} Martial Arts XP`, {
        description: `RYU: "Excellent work. Your body grows stronger."`,
      });
    } catch {
      toast.error("Failed to record training. Try again.");
    } finally {
      setActiveDrill(null);
    }
  };

  return (
    <>
      {/* Level up flash overlay */}
      {levelUpFlash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 400,
            background: "oklch(0.62 0.22 295 / 0.15)",
            animation: "neonPulseSlow 1.5s ease-in-out forwards",
            pointerEvents: "none",
          }}
        />
      )}

      <section
        id="martial"
        data-ocid="martial.section"
        style={{
          padding: "100px 2rem 80px",
          background: "oklch(0.06 0.01 255)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background dojo pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(oklch(0.62 0.22 295 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, oklch(0.62 0.22 295 / 0.06) 0%, transparent 60%)",
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
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "oklch(0.62 0.22 295)",
                }}
              >
                RYU'S DOJO
              </span>
            </div>
            <h2
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                letterSpacing: "0.06em",
                margin: "0 0 0.75rem 0",
                background:
                  "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.82 0.18 85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MARTIAL ARTS DOJO
            </h2>
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.95rem",
                color: "oklch(0.6 0.04 260)",
              }}
            >
              Train under RYU's guidance. Master body and spirit.
            </p>
          </div>

          {/* Main content grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "360px 1fr",
              gap: "2rem",
              alignItems: "start",
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            {/* Left: RYU portrait + martial arts stats */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Trainer card */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid oklch(0.62 0.22 295 / 0.5)",
                  height: "360px",
                  boxShadow: "0 0 30px oklch(0.62 0.22 295 / 0.2)",
                }}
              >
                <img
                  src="/assets/generated/trainer-martial-male.dim_400x600.png"
                  alt="RYU - Martial Arts Trainer"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, oklch(0.06 0.01 255) 0%, oklch(0.62 0.22 295 / 0.2) 60%, transparent 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontWeight: 900,
                      fontSize: "2rem",
                      letterSpacing: "0.15em",
                      color: "oklch(0.62 0.22 295)",
                      textShadow: "0 0 12px oklch(0.62 0.22 295 / 0.8)",
                    }}
                  >
                    RYU
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.75rem",
                      color: "oklch(0.7 0.04 260)",
                      fontStyle: "italic",
                      marginTop: "0.3rem",
                    }}
                  >
                    "A true fighter masters not just the body, but the spirit."
                  </div>
                </div>
              </div>

              {/* Martial Arts Level */}
              <div
                style={{
                  padding: "1.5rem",
                  background: "oklch(0.09 0.015 260 / 0.8)",
                  border: "1px solid oklch(0.62 0.22 295 / 0.4)",
                  borderRadius: "10px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 20px oklch(0.62 0.22 295 / 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        color: "oklch(0.55 0.04 260)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      MARTIAL ARTS RANK
                    </div>
                    <div
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontWeight: 900,
                        fontSize: "1.6rem",
                        letterSpacing: "0.08em",
                        color: "oklch(0.62 0.22 295)",
                        textShadow: "0 0 10px oklch(0.62 0.22 295 / 0.6)",
                      }}
                    >
                      🥋 Level {isLoggedIn ? martialLevel : "—"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.65rem",
                        letterSpacing: "0.15em",
                        color: "oklch(0.55 0.04 260)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      TOTAL XP
                    </div>
                    <div
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "oklch(0.82 0.18 85)",
                        textShadow: "0 0 8px oklch(0.82 0.18 85 / 0.5)",
                      }}
                    >
                      {isLoggedIn ? Number(martialXP).toLocaleString() : "0"} XP
                    </div>
                  </div>
                </div>

                {/* XP bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.62rem",
                      color: "oklch(0.5 0.04 260)",
                    }}
                  >
                    RANK PROGRESS
                  </span>
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.62rem",
                      color: "oklch(0.62 0.22 295)",
                    }}
                  >
                    {isLoggedIn ? `${current} / ${needed}` : "Login to track"}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "oklch(0.15 0.02 260)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${isLoggedIn ? levelPct : 0}%`,
                      background:
                        "linear-gradient(90deg, oklch(0.62 0.22 295) 0%, oklch(0.82 0.18 85) 100%)",
                      boxShadow: "0 0 8px oklch(0.62 0.22 295 / 0.6)",
                      borderRadius: "3px",
                      transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>

                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="btn-neon-red"
                    style={{
                      width: "100%",
                      padding: "0.65rem",
                      fontSize: "0.75rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginTop: "1rem",
                    }}
                  >
                    ⚡ LOGIN TO TRAIN
                  </button>
                )}
              </div>
            </div>

            {/* Right: Training drills */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  color: "oklch(0.55 0.04 260)",
                  textTransform: "uppercase",
                }}
              >
                ◆ TRAINING DRILLS
              </div>

              {DRILLS.map((drill, idx) => (
                <div
                  key={drill.name}
                  style={{
                    padding: "1.5rem",
                    background: "oklch(0.1 0.015 260 / 0.8)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.3)",
                    borderRadius: "10px",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "oklch(0.62 0.22 295 / 0.6)";
                    el.style.boxShadow = "0 0 20px oklch(0.62 0.22 295 / 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "oklch(0.62 0.22 295 / 0.3)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "12px",
                        background: "oklch(0.62 0.22 295 / 0.1)",
                        border: "1px solid oklch(0.62 0.22 295 / 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.8rem",
                        flexShrink: 0,
                      }}
                    >
                      {drill.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: "oklch(0.9 0.02 260)",
                            margin: 0,
                          }}
                        >
                          {drill.name}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.65rem",
                              color: "oklch(0.55 0.04 260)",
                            }}
                          >
                            {drill.duration}
                          </span>
                          <span
                            style={{
                              padding: "0.2rem 0.6rem",
                              background: "oklch(0.82 0.18 85 / 0.1)",
                              border: "1px solid oklch(0.82 0.18 85 / 0.4)",
                              borderRadius: "100px",
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "oklch(0.82 0.18 85)",
                            }}
                          >
                            +{drill.xp} XP
                          </span>
                        </div>
                      </div>
                      <p
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.78rem",
                          color: "oklch(0.6 0.04 260)",
                          lineHeight: 1.5,
                          margin: "0 0 1rem",
                        }}
                      >
                        {drill.desc}
                      </p>

                      <button
                        type="button"
                        data-ocid={`martial.train.button.${idx + 1}`}
                        onClick={() => {
                          if (!isLoggedIn) {
                            onLoginClick();
                            return;
                          }
                          setActiveDrill(drill);
                        }}
                        style={{
                          padding: "0.6rem 1.5rem",
                          background:
                            "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.55 0.22 320) 100%)",
                          border: "1px solid oklch(0.72 0.22 295 / 0.6)",
                          borderRadius: "6px",
                          color: "oklch(0.98 0 0)",
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: "0 0 10px oklch(0.62 0.22 295 / 0.4)",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.boxShadow =
                            "0 0 20px oklch(0.62 0.22 295 / 0.7)";
                          (e.target as HTMLElement).style.transform =
                            "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.boxShadow =
                            "0 0 10px oklch(0.62 0.22 295 / 0.4)";
                          (e.target as HTMLElement).style.transform =
                            "translateY(0)";
                        }}
                      >
                        🥋 TRAIN NOW
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Training overlay */}
      {activeDrill && (
        <TrainingOverlay
          drill={activeDrill}
          onComplete={() => handleDrillComplete(activeDrill)}
          onCancel={() => setActiveDrill(null)}
        />
      )}
    </>
  );
}
