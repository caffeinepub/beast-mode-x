import { useAuth } from "@/components/auth/AuthProvider";
import {
  useAdvanceChallengeDay,
  usePlayerProfile,
  useStartChallenge,
} from "@/hooks/useBackend";
import { getDateString } from "@/utils/gameUtils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ChallengeDefinition {
  id: string;
  name: string;
  totalDays: number;
  icon: string;
  color: string;
  glow: string;
  description: string;
}

const CHALLENGES: ChallengeDefinition[] = [
  {
    id: "lower-body-28",
    name: "28-Day Lower Body Challenge",
    totalDays: 28,
    icon: "🦵",
    color: "oklch(0.62 0.25 22)",
    glow: "0 0 20px oklch(0.62 0.25 22 / 0.3)",
    description: "Build powerful legs & glutes",
  },
  {
    id: "full-body-28",
    name: "28-Day Full Body Challenge",
    totalDays: 28,
    icon: "💪",
    color: "oklch(0.62 0.22 295)",
    glow: "0 0 20px oklch(0.62 0.22 295 / 0.3)",
    description: "Total body transformation",
  },
  {
    id: "meditation-30",
    name: "30-Day Meditation Challenge",
    totalDays: 30,
    icon: "🧘",
    color: "oklch(0.82 0.18 85)",
    glow: "0 0 20px oklch(0.82 0.18 85 / 0.3)",
    description: "Master your mind & focus",
  },
  {
    id: "discipline-21",
    name: "21-Day Discipline Protocol",
    totalDays: 21,
    icon: "⚡",
    color: "oklch(0.65 0.2 140)",
    glow: "0 0 20px oklch(0.65 0.2 140 / 0.3)",
    description: "Forge unbreakable habits",
  },
];

// Touch-optimized button base style
const TOUCH_BTN: React.CSSProperties = {
  touchAction: "manipulation",
  WebkitTapHighlightColor: "transparent",
  cursor: "pointer",
  minHeight: "48px",
  userSelect: "none",
  WebkitUserSelect: "none",
};

export function ChallengeSection() {
  const { isLoggedIn } = useAuth();
  const { data: profile } = usePlayerProfile();
  const startChallenge = useStartChallenge();
  const advanceDay = useAdvanceChallengeDay();

  // Confirmation state for replacing active challenge
  const [switchConfirmId, setSwitchConfirmId] = useState<string | null>(null);

  const activeChallenge = profile?.activeChallenge;

  const handleStart = async (challengeId: string) => {
    if (!isLoggedIn) {
      toast.error("Login to start a challenge!");
      return;
    }

    // If there's an active challenge different from the one being started, confirm switch
    if (activeChallenge && activeChallenge.challengeId !== challengeId) {
      if (switchConfirmId !== challengeId) {
        setSwitchConfirmId(challengeId);
        toast("⚠️ Tap again to confirm switching your active challenge!", {
          duration: 4000,
          description: "This will replace your current challenge progress.",
        });
        return;
      }
    }

    setSwitchConfirmId(null);

    try {
      await startChallenge.mutateAsync({
        challengeId,
        startDate: getDateString(),
      });
      toast.success("🎯 Challenge started! Complete daily tasks to advance.", {
        duration: 4000,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to start challenge: ${msg}. Try again.`);
    }
  };

  const handleAdvance = async () => {
    if (!isLoggedIn) return;
    try {
      await advanceDay.mutateAsync();
      toast.success("⚡ Day advanced! Keep pushing forward!", {
        duration: 3000,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to advance day: ${msg}. Try again.`);
    }
  };

  return (
    <section
      id="challenges"
      data-ocid="challenges.section"
      style={{
        padding: "100px 2rem 80px",
        background: "oklch(0.065 0.012 255)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
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
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "300px",
          background:
            "radial-gradient(ellipse, oklch(0.62 0.25 22 / 0.05) 0%, transparent 70%)",
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
              SOLO LEVELING STYLE
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              margin: "0 0 0.5rem",
              background:
                "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.82 0.18 85) 50%, oklch(0.62 0.22 295) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ACTIVE CHALLENGES
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.9rem",
              color: "oklch(0.55 0.04 260)",
              letterSpacing: "0.03em",
            }}
          >
            Commit to a challenge. Complete every day. Evolve.
          </p>
        </div>

        {/* Challenge cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{
            display: "grid",
            gap: "1.25rem",
            paddingBottom: "1rem",
          }}
        >
          {CHALLENGES.map((challenge, idx) => {
            const isActive = activeChallenge?.challengeId === challenge.id;
            const currentDay = isActive ? Number(activeChallenge.day) : 0;
            const pct = Math.min((currentDay / challenge.totalDays) * 100, 100);
            const isCompleted = currentDay >= challenge.totalDays;
            const isSwitchPending = switchConfirmId === challenge.id;

            return (
              <div
                key={challenge.id}
                data-ocid={`challenge.card.${idx + 1}`}
                style={{
                  padding: "1.5rem",
                  background: isActive
                    ? "oklch(0.12 0.025 260 / 0.95)"
                    : "oklch(0.09 0.015 260 / 0.8)",
                  border: `1px solid ${isActive ? challenge.color.replace(")", " / 0.5)") : isSwitchPending ? "oklch(0.82 0.18 85 / 0.6)" : "oklch(0.22 0.03 260 / 0.6)"}`,
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                  boxShadow: isActive
                    ? challenge.glow
                    : isSwitchPending
                      ? "0 0 16px oklch(0.82 0.18 85 / 0.2)"
                      : "none",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Active shimmer overlay */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${challenge.color.replace(")", " / 0.05)")} 0%, transparent 60%)`,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* CURRENT ACTIVE badge */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "0.18rem 0.55rem",
                      background: `linear-gradient(135deg, ${challenge.color.replace(")", " / 0.3)")} 0%, ${challenge.color.replace(")", " / 0.15)")} 100%)`,
                      border: `1px solid ${challenge.color.replace(")", " / 0.7)")}`,
                      borderRadius: "100px",
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "0.52rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      color: challenge.color,
                      boxShadow: `0 0 8px ${challenge.color.replace(")", " / 0.4)")}`,
                      animation: "neonPulse 2s ease-in-out infinite",
                      zIndex: 2,
                    }}
                  >
                    ◆ ACTIVE
                  </div>
                )}

                {/* Top row: icon + days badge */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      background: challenge.color.replace(")", " / 0.12)"),
                      border: `1px solid ${challenge.color.replace(")", " / 0.3)")}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      flexShrink: 0,
                    }}
                  >
                    {challenge.icon}
                  </div>
                  <div
                    style={{
                      padding: "0.2rem 0.6rem",
                      background: challenge.color.replace(")", " / 0.12)"),
                      border: `1px solid ${challenge.color.replace(")", " / 0.35)")}`,
                      borderRadius: "100px",
                      marginTop: isActive ? "1.6rem" : 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        color: challenge.color,
                      }}
                    >
                      {challenge.totalDays} DAYS
                    </span>
                  </div>
                </div>

                {/* Challenge name & description */}
                <div>
                  <h3
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.88rem",
                      fontWeight: 800,
                      letterSpacing: "0.03em",
                      color: isActive
                        ? "oklch(0.95 0.02 260)"
                        : "oklch(0.8 0.03 260)",
                      margin: "0 0 0.3rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {challenge.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.72rem",
                      color: "oklch(0.5 0.03 260)",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {challenge.description}
                  </p>
                </div>

                {/* Day display + progress */}
                {isActive ? (
                  <div>
                    {/* Big day number */}
                    <div
                      style={{
                        textAlign: "center",
                        padding: "0.75rem",
                        background: "oklch(0.08 0.01 260 / 0.6)",
                        borderRadius: "8px",
                        border: `1px solid ${challenge.color.replace(")", " / 0.2)")}`,
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.55rem",
                          fontWeight: 700,
                          letterSpacing: "0.2em",
                          color: "oklch(0.45 0.03 260)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        CURRENT
                      </div>
                      <div
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "2rem",
                          fontWeight: 900,
                          color: challenge.color,
                          textShadow: `0 0 12px ${challenge.color.replace(")", " / 0.6)")}`,
                          lineHeight: 1,
                        }}
                      >
                        DAY {currentDay}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: "0.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.35rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: '"Geist Mono", monospace',
                            fontSize: "0.6rem",
                            color: "oklch(0.5 0.03 260)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {Math.round(pct)}% Finished
                        </span>
                        <span
                          style={{
                            fontFamily: '"Geist Mono", monospace',
                            fontSize: "0.6rem",
                            color: challenge.color,
                          }}
                        >
                          {currentDay}/{challenge.totalDays}
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
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${challenge.color} 0%, ${challenge.color.replace(")", " / 0.7)")} 100%)`,
                            boxShadow: `0 0 8px ${challenge.color.replace(")", " / 0.5)")}`,
                            borderRadius: "3px",
                            transition: "width 0.8s ease",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* No active challenge state */
                  <div
                    style={{
                      textAlign: "center",
                      padding: "0.6rem",
                      background: isSwitchPending
                        ? "oklch(0.82 0.18 85 / 0.08)"
                        : "oklch(0.08 0.01 260 / 0.5)",
                      borderRadius: "6px",
                      border: isSwitchPending
                        ? "1px solid oklch(0.82 0.18 85 / 0.4)"
                        : "1px solid oklch(0.18 0.02 260 / 0.5)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "0.6rem",
                        color: isSwitchPending
                          ? "oklch(0.82 0.18 85)"
                          : "oklch(0.4 0.03 260)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {isSwitchPending
                        ? "⚠️ TAP AGAIN TO SWITCH"
                        : "NOT STARTED"}
                    </span>
                  </div>
                )}

                {/* CTA button */}
                {isCompleted ? (
                  <div
                    style={{
                      padding: "0.65rem",
                      textAlign: "center",
                      background: challenge.color.replace(")", " / 0.1)"),
                      border: `1px solid ${challenge.color.replace(")", " / 0.4)")}`,
                      borderRadius: "6px",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: challenge.color,
                      minHeight: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓ COMPLETED!
                  </div>
                ) : isActive ? (
                  <button
                    type="button"
                    data-ocid="challenge.advance.button"
                    onClick={handleAdvance}
                    disabled={advanceDay.isPending}
                    style={{
                      ...TOUCH_BTN,
                      width: "100%",
                      padding: "0.85rem",
                      background: `linear-gradient(135deg, ${challenge.color} 0%, ${challenge.color.replace(")", " / 0.7)")} 100%)`,
                      border: `1px solid ${challenge.color.replace(")", " / 0.6)")}`,
                      borderRadius: "8px",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.78rem",
                      fontWeight: 900,
                      letterSpacing: "0.12em",
                      color: "oklch(0.98 0 0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      boxShadow: advanceDay.isPending
                        ? "none"
                        : `0 0 16px ${challenge.color.replace(")", " / 0.5)")}`,
                      opacity: advanceDay.isPending ? 0.7 : 1,
                      transition: "all 0.2s ease",
                      marginTop: "auto",
                      animation: advanceDay.isPending
                        ? "none"
                        : "advancePulse 2s ease-in-out infinite",
                    }}
                  >
                    {advanceDay.isPending ? (
                      <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    ) : null}
                    ⚡ ADVANCE DAY
                  </button>
                ) : (
                  <button
                    type="button"
                    data-ocid={`challenge.start.button.${idx + 1}`}
                    onClick={() => handleStart(challenge.id)}
                    disabled={startChallenge.isPending}
                    style={{
                      ...TOUCH_BTN,
                      width: "100%",
                      padding: "0.75rem",
                      background: isSwitchPending
                        ? "linear-gradient(135deg, oklch(0.82 0.18 85) 0%, oklch(0.72 0.2 65) 100%)"
                        : activeChallenge
                          ? "linear-gradient(135deg, oklch(0.55 0.2 295) 0%, oklch(0.45 0.18 310) 100%)"
                          : "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                      border: isSwitchPending
                        ? "1px solid oklch(0.82 0.18 85 / 0.7)"
                        : activeChallenge
                          ? "1px solid oklch(0.62 0.22 295 / 0.6)"
                          : "1px solid oklch(0.72 0.28 22 / 0.6)",
                      borderRadius: "8px",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.72rem",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      color: "oklch(0.98 0 0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      boxShadow: isSwitchPending
                        ? "0 0 12px oklch(0.82 0.18 85 / 0.5)"
                        : activeChallenge
                          ? "0 0 8px oklch(0.62 0.22 295 / 0.35)"
                          : "0 0 10px oklch(0.62 0.25 22 / 0.4)",
                      opacity: startChallenge.isPending ? 0.7 : 1,
                      transition: "all 0.2s ease",
                      marginTop: "auto",
                    }}
                  >
                    {startChallenge.isPending ? (
                      <Loader2
                        size={14}
                        style={{
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    ) : isSwitchPending ? (
                      "⚠️ CONFIRM SWITCH"
                    ) : activeChallenge ? (
                      "🔄 SWITCH CHALLENGE"
                    ) : (
                      "⚡ START CHALLENGE"
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Active challenge banner */}
        {activeChallenge && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.25rem 1.5rem",
              background: "oklch(0.12 0.025 260 / 0.8)",
              border: "1px solid oklch(0.62 0.25 22 / 0.35)",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                🏆
              </span>
              <div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "oklch(0.5 0.03 260)",
                    marginBottom: "0.2rem",
                  }}
                >
                  ACTIVE CHALLENGE
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "oklch(0.62 0.25 22)",
                    textShadow: "0 0 8px oklch(0.62 0.25 22 / 0.4)",
                  }}
                >
                  {CHALLENGES.find((c) => c.id === activeChallenge.challengeId)
                    ?.name ?? activeChallenge.challengeId}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "oklch(0.82 0.18 85)",
                    textShadow: "0 0 10px oklch(0.82 0.18 85 / 0.5)",
                    lineHeight: 1,
                  }}
                >
                  {Number(activeChallenge.day)}
                </div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                    color: "oklch(0.45 0.03 260)",
                    marginTop: "0.2rem",
                  }}
                >
                  DAYS DONE
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "oklch(0.62 0.22 295)",
                    textShadow: "0 0 10px oklch(0.62 0.22 295 / 0.5)",
                    lineHeight: 1,
                  }}
                >
                  {activeChallenge.startDate}
                </div>
                <div
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "0.55rem",
                    letterSpacing: "0.1em",
                    color: "oklch(0.45 0.03 260)",
                    marginTop: "0.2rem",
                  }}
                >
                  STARTED
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes advancePulse {
          0%, 100% { box-shadow: 0 0 16px oklch(0.62 0.25 22 / 0.5); }
          50% { box-shadow: 0 0 28px oklch(0.62 0.25 22 / 0.8), 0 0 50px oklch(0.62 0.25 22 / 0.3); }
        }
      `}</style>
    </section>
  );
}
