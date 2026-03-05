import { useActor } from "@/hooks/useActor";
import {
  type MissionDef,
  type MissionTier,
  getScaledMissions,
  getSpecialMissions,
} from "@/utils/missionData";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Flame, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface TrainerData {
  id: string;
  name: string;
  specialty: string;
  catchphrase: string;
  image: string;
  color: string;
  colorDim: string;
  intro: string;
  praiseLines: string[];
  category: string;
  glow: string;
}

const TRAINERS: TrainerData[] = [
  {
    id: "kira",
    name: "KIRA",
    specialty: "Fitness & Strength",
    catchphrase: "Pain is just weakness leaving your body.",
    image: "/assets/generated/trainer-fitness-female.dim_400x600.png",
    color: "oklch(0.62 0.25 22)",
    colorDim: "oklch(0.62 0.25 22 / 0.15)",
    intro:
      "Push your limits, warrior. Pain is just weakness leaving your body. Today we forge iron.",
    praiseLines: [
      "Outstanding! Your body is getting stronger!",
      "That's the warrior spirit I've been waiting to see!",
      "Pain is temporary, glory is forever! Keep pushing!",
    ],
    category: "fitness",
    glow: "0 0 20px oklch(0.62 0.25 22 / 0.4)",
  },
  {
    id: "ryu",
    name: "RYU",
    specialty: "Martial Arts & Combat",
    catchphrase: "A true fighter masters not just the body, but the spirit.",
    image: "/assets/generated/trainer-martial-male.dim_400x600.png",
    color: "oklch(0.62 0.22 295)",
    colorDim: "oklch(0.62 0.22 295 / 0.15)",
    intro:
      "A true fighter masters not just the body, but the spirit. Today you will learn both.",
    praiseLines: [
      "Your form is improving. The warrior path awaits.",
      "Excellent execution! You have the heart of a fighter.",
      "The spirit of a true warrior flows through you!",
    ],
    category: "martial",
    glow: "0 0 20px oklch(0.62 0.22 295 / 0.4)",
  },
  {
    id: "nova",
    name: "NOVA",
    specialty: "Intelligence & Study",
    catchphrase: "Knowledge is the sharpest blade. Sharpen your mind daily.",
    image: "/assets/generated/trainer-intel-female.dim_400x600.png",
    color: "oklch(0.65 0.22 250)",
    colorDim: "oklch(0.65 0.22 250 / 0.15)",
    intro:
      "Knowledge is the sharpest blade. Every page, every concept — they make you unstoppable.",
    praiseLines: [
      "Your mind grows sharper with every lesson!",
      "Excellent! Knowledge compounds daily. Keep going.",
      "A brilliant mind is your greatest weapon!",
    ],
    category: "intelligence",
    glow: "0 0 20px oklch(0.65 0.22 250 / 0.4)",
  },
  {
    id: "zen",
    name: "ZEN",
    specialty: "Focus & Meditation",
    catchphrase: "The calm before the storm — find your center, then unleash.",
    image: "/assets/generated/trainer-focus-male.dim_400x600.png",
    color: "oklch(0.82 0.18 85)",
    colorDim: "oklch(0.82 0.18 85 / 0.15)",
    intro:
      "The calm before the storm — find your center, then unleash absolute power.",
    praiseLines: [
      "Your inner peace grows stronger. Feel the clarity.",
      "Magnificent! The mind stilled is the mind empowered.",
      "You've found the silence within. That is true power.",
    ],
    category: "focus",
    glow: "0 0 20px oklch(0.82 0.18 85 / 0.4)",
  },
  {
    id: "vega",
    name: "VEGA",
    specialty: "Discipline & Willpower",
    catchphrase:
      "Discipline is choosing what you want most over what you want now.",
    image: "/assets/generated/trainer-discipline-female.dim_400x600.png",
    color: "oklch(0.62 0.22 295)",
    colorDim: "oklch(0.62 0.22 295 / 0.15)",
    intro:
      "Discipline is choosing what you want most over what you want now. Choose wisely.",
    praiseLines: [
      "Iron discipline. You're building an unbreakable will.",
      "Every sacrifice you make today shapes tomorrow's legend.",
      "Remarkable restraint! Discipline IS freedom.",
    ],
    category: "discipline",
    glow: "0 0 20px oklch(0.62 0.22 295 / 0.4)",
  },
  {
    id: "apex",
    name: "APEX",
    specialty: "Mindset & Motivation",
    catchphrase: "Your mind is your greatest weapon. Master it.",
    image: "/assets/generated/trainer-mindset-male.dim_400x600.png",
    color: "oklch(0.72 0.2 45)",
    colorDim: "oklch(0.72 0.2 45 / 0.15)",
    intro:
      "Your mind is your greatest weapon. Master it, and nothing can stop you.",
    praiseLines: [
      "Your mindset is shifting. You're becoming unstoppable!",
      "That's the mentality of a champion. Keep going!",
      "Your beliefs are your reality. You're building a great one!",
    ],
    category: "mindset",
    glow: "0 0 20px oklch(0.72 0.2 45 / 0.4)",
  },
];

interface XPFloater {
  id: number;
  xp: number;
  x: number;
}

interface TrainerCardProps {
  trainer: TrainerData;
  onOpen: (trainer: TrainerData) => void;
}

function TrainerCard({ trainer, onOpen }: TrainerCardProps) {
  return (
    <button
      type="button"
      data-ocid={`trainer.${trainer.id}.card`}
      onClick={() => onOpen(trainer)}
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        border: `1px solid ${trainer.color.replace(")", " / 0.3)")}`,
        background: "oklch(0.08 0.015 260)",
        transition: "all 0.3s ease",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        padding: 0,
        width: "100%",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-6px)";
        el.style.boxShadow = trainer.glow;
        el.style.borderColor = trainer.color.replace(")", " / 0.7)");
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = trainer.color.replace(")", " / 0.3)");
      }}
    >
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <img
          src={trainer.image}
          alt={trainer.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            filter: "contrast(1.05) saturate(1.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, transparent 40%, ${trainer.color.replace(")", " / 0.3)")} 80%, oklch(0.08 0.015 260) 100%)`,
          }}
        />
      </div>
      <div
        style={{
          padding: "1.25rem",
          background: "oklch(0.08 0.015 260)",
          borderTop: `1px solid ${trainer.color.replace(")", " / 0.2)")}`,
        }}
      >
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "1.3rem",
            letterSpacing: "0.12em",
            color: trainer.color,
            textShadow: `0 0 8px ${trainer.color.replace(")", " / 0.6)")}`,
            marginBottom: "0.25rem",
          }}
        >
          {trainer.name}
        </div>
        <div
          style={{
            display: "inline-flex",
            padding: "0.2rem 0.6rem",
            background: trainer.colorDim,
            border: `1px solid ${trainer.color.replace(")", " / 0.3)")}`,
            borderRadius: "100px",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: trainer.color,
            marginBottom: "0.6rem",
          }}
        >
          {trainer.specialty}
        </div>
        <p
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.72rem",
            color: "oklch(0.6 0.03 260)",
            fontStyle: "italic",
            lineHeight: 1.4,
            margin: "0 0 0.75rem",
          }}
        >
          "{trainer.catchphrase}"
        </p>
        <div
          style={{
            padding: "0.5rem 1rem",
            background: trainer.colorDim,
            border: `1px solid ${trainer.color.replace(")", " / 0.4)")}`,
            borderRadius: "6px",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: trainer.color,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Train with {trainer.name} →
        </div>
      </div>
    </button>
  );
}

interface TrainerPanelProps {
  trainer: TrainerData;
  completedMissions: string[];
  playerLevel: number;
  onClose: () => void;
}

function TrainerPanel({
  trainer,
  completedMissions,
  playerLevel,
  onClose,
}: TrainerPanelProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [completing, setCompleting] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState(trainer.intro);
  const [displayedDialogue, setDisplayedDialogue] = useState("");
  const [floaters, setFloaters] = useState<XPFloater[]>([]);
  const [activeTier, setActiveTier] = useState<MissionTier>("daily");
  const floaterIdRef = useRef(0);

  // Typewriter effect
  useEffect(() => {
    setDisplayedDialogue("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedDialogue(dialogue.slice(0, i + 1));
      i++;
      if (i >= dialogue.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [dialogue]);

  const dailyMissions = getScaledMissions(trainer.id, "daily", playerLevel);
  const weeklyMissions = getScaledMissions(trainer.id, "weekly", playerLevel);
  const monthlyMissions = getScaledMissions(trainer.id, "monthly", playerLevel);
  const specialMissions = getSpecialMissions(playerLevel);

  const currentMissions =
    activeTier === "daily"
      ? dailyMissions
      : activeTier === "weekly"
        ? weeklyMissions
        : monthlyMissions;

  const handleComplete = async (mission: MissionDef) => {
    if (!actor || completing) return;
    const isAlreadyDone = completedMissions.includes(mission.id);
    if (isAlreadyDone) return;

    setCompleting(mission.id);
    try {
      await actor.completeMission(
        mission.id,
        mission.category,
        BigInt(mission.xp),
      );
      await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["missionCompletions"] });

      const floaterId = floaterIdRef.current++;
      setFloaters((prev) => [
        ...prev,
        { id: floaterId, xp: mission.xp, x: 50 },
      ]);
      setTimeout(
        () => setFloaters((prev) => prev.filter((f) => f.id !== floaterId)),
        1500,
      );

      const praise =
        trainer.praiseLines[
          Math.floor(Math.random() * trainer.praiseLines.length)
        ];
      setDialogue(praise ?? trainer.intro);

      toast.success(`+${mission.xp} XP earned! Mission complete!`, {
        description: mission.name,
      });
    } catch {
      toast.error("Failed to complete mission. Try again.");
    } finally {
      setCompleting(null);
    }
  };

  const handleSpecialComplete = async (mission: MissionDef) => {
    if (!actor || completing) return;
    if (completedMissions.includes(mission.id)) return;
    setCompleting(mission.id);
    try {
      await actor.completeMission(
        mission.id,
        mission.category,
        BigInt(mission.xp),
      );
      await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });

      const floaterId = floaterIdRef.current++;
      setFloaters((prev) => [
        ...prev,
        { id: floaterId, xp: mission.xp, x: 50 },
      ]);
      setTimeout(
        () => setFloaters((prev) => prev.filter((f) => f.id !== floaterId)),
        2000,
      );

      toast.success(`⚡ SPECIAL MISSION COMPLETE! +${mission.xp} XP!`, {
        description: mission.name,
        duration: 5000,
      });
    } catch {
      toast.error("Failed to complete special mission.");
    } finally {
      setCompleting(null);
    }
  };

  const tierColors: Record<MissionTier, string> = {
    daily: trainer.color,
    weekly: "oklch(0.62 0.22 295)",
    monthly: "oklch(0.82 0.18 85)",
  };

  const tierLabels: Record<MissionTier, string> = {
    daily: "DAILY",
    weekly: "WEEKLY",
    monthly: "MONTHLY",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(0 0 0 / 0.88)",
          backdropFilter: "blur(12px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "oklch(0.09 0.015 260)",
          border: `1px solid ${trainer.color.replace(")", " / 0.5)")}`,
          borderRadius: "16px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: `0 0 40px ${trainer.color.replace(")", " / 0.2)")}, 0 40px 80px oklch(0 0 0 / 0.6)`,
        }}
      >
        {/* XP Floaters */}
        {floaters.map((f) => (
          <div
            key={f.id}
            style={{
              position: "absolute",
              top: "40%",
              left: `${f.x}%`,
              transform: "translateX(-50%)",
              zIndex: 100,
              fontFamily: '"Sora", sans-serif',
              fontSize: "1.5rem",
              fontWeight: 900,
              color: trainer.color,
              textShadow: `0 0 12px ${trainer.color}`,
              animation: "fadeInUp 1.5s ease forwards",
              pointerEvents: "none",
            }}
          >
            +{f.xp} XP
          </div>
        ))}

        {/* Close */}
        <button
          type="button"
          data-ocid="trainer.panel.close_button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 10,
            background: "oklch(0.12 0.02 260)",
            border: "1px solid oklch(0.3 0.04 260 / 0.6)",
            borderRadius: "6px",
            padding: "0.4rem",
            cursor: "pointer",
            color: "oklch(0.6 0.04 260)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            minHeight: "500px",
          }}
          className="grid-cols-1 md:grid-cols-2"
        >
          {/* Left: Trainer portrait */}
          <div
            style={{
              position: "relative",
              borderRight: `1px solid ${trainer.color.replace(")", " / 0.2)")}`,
              overflow: "hidden",
              minHeight: "300px",
            }}
          >
            <img
              src={trainer.image}
              alt={trainer.name}
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
                background: `linear-gradient(to top, oklch(0.09 0.015 260) 0%, ${trainer.color.replace(")", " / 0.2)")} 50%, transparent 100%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1.5rem 1.25rem 1rem",
              }}
            >
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 900,
                  fontSize: "2rem",
                  letterSpacing: "0.15em",
                  color: trainer.color,
                  textShadow: `0 0 12px ${trainer.color.replace(")", " / 0.8)")}`,
                }}
              >
                {trainer.name}
              </div>
              <div
                style={{
                  padding: "0.2rem 0.6rem",
                  display: "inline-flex",
                  background: trainer.colorDim,
                  border: `1px solid ${trainer.color.replace(")", " / 0.4)")}`,
                  borderRadius: "100px",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: trainer.color,
                }}
              >
                {trainer.specialty}
              </div>

              {/* Level info */}
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  background: "oklch(0.06 0.01 260 / 0.8)",
                  border: `1px solid ${trainer.color.replace(")", " / 0.2)")}`,
                  borderRadius: "6px",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.65rem",
                  color: "oklch(0.6 0.04 260)",
                }}
              >
                Your Level:{" "}
                <strong style={{ color: trainer.color }}>{playerLevel}</strong>{" "}
                —{" "}
                {playerLevel <= 10
                  ? "Beginner"
                  : playerLevel <= 30
                    ? "Intermediate"
                    : playerLevel <= 60
                      ? "Advanced"
                      : "Elite"}{" "}
                tasks
              </div>
            </div>
          </div>

          {/* Right: Missions */}
          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Trainer dialogue */}
            <div
              style={{
                padding: "1rem 1.25rem",
                background: trainer.colorDim,
                border: `1px solid ${trainer.color.replace(")", " / 0.3)")}`,
                borderRadius: "8px",
                borderLeft: `3px solid ${trainer.color}`,
              }}
            >
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: trainer.color,
                  marginBottom: "0.4rem",
                  fontWeight: 700,
                }}
              >
                {trainer.name} SAYS:
              </div>
              <p
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.85rem",
                  color: "oklch(0.82 0.02 260)",
                  lineHeight: 1.6,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                "{displayedDialogue}"
                <span
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    background: trainer.color,
                    marginLeft: "2px",
                    verticalAlign: "text-bottom",
                    animation: "neonPulse 0.6s ease-in-out infinite",
                  }}
                />
              </p>
            </div>

            {/* Tier tabs */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {(["daily", "weekly", "monthly"] as MissionTier[]).map((tier) => {
                const isActive = activeTier === tier;
                const tColor = tierColors[tier];
                return (
                  <button
                    key={tier}
                    type="button"
                    data-ocid={`trainer.${tier}.tab`}
                    onClick={() => setActiveTier(tier)}
                    style={{
                      padding: "0.35rem 0.85rem",
                      background: isActive
                        ? tColor.replace(")", " / 0.2)")
                        : "oklch(0.12 0.02 260)",
                      border: `1px solid ${isActive ? tColor.replace(")", " / 0.7)") : "oklch(0.25 0.03 260 / 0.6)"}`,
                      borderRadius: "100px",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: isActive ? tColor : "oklch(0.55 0.03 260)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isActive
                        ? `0 0 8px ${tColor.replace(")", " / 0.3)")}`
                        : "none",
                    }}
                  >
                    {tierLabels[tier]}
                  </button>
                );
              })}
            </div>

            {/* Special missions banner (only when level % 5 === 0) */}
            {activeTier === "daily" && specialMissions.length > 0 && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Star size={12} style={{ color: "oklch(0.82 0.18 85)" }} />
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      color: "oklch(0.82 0.18 85)",
                    }}
                  >
                    ◆ SPECIAL MISSIONS — MILESTONE BONUS
                  </span>
                </div>
                {specialMissions.map((mission, idx) => {
                  const isDone = completedMissions.includes(mission.id);
                  return (
                    <div
                      key={mission.id}
                      style={{
                        padding: "0.75rem 1rem",
                        background: isDone
                          ? "oklch(0.82 0.18 85 / 0.06)"
                          : "oklch(0.82 0.18 85 / 0.05)",
                        border: `1px solid ${isDone ? "oklch(0.82 0.18 85 / 0.4)" : "oklch(0.82 0.18 85 / 0.25)"}`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "0.5rem",
                        boxShadow: isDone
                          ? "none"
                          : "0 0 12px oklch(0.82 0.18 85 / 0.08)",
                      }}
                    >
                      <Flame
                        size={16}
                        style={{ color: "oklch(0.82 0.18 85)", flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: isDone
                              ? "oklch(0.65 0.12 85)"
                              : "oklch(0.82 0.18 85)",
                            marginBottom: "0.2rem",
                            textDecoration: isDone ? "line-through" : "none",
                          }}
                        >
                          {mission.name}
                        </div>
                        <div
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.68rem",
                            color: "oklch(0.55 0.04 260)",
                            lineHeight: 1.4,
                          }}
                        >
                          {mission.desc}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.4rem",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "oklch(0.82 0.18 85)",
                            textShadow: "0 0 6px oklch(0.82 0.18 85 / 0.6)",
                          }}
                        >
                          +{mission.xp} XP ⭐
                        </span>
                        {isDone ? (
                          <span
                            style={{
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.62rem",
                              color: "oklch(0.65 0.12 85)",
                              fontWeight: 700,
                            }}
                          >
                            ✓ DONE
                          </span>
                        ) : (
                          <button
                            type="button"
                            data-ocid={`special.mission.button.${idx + 1}`}
                            onClick={() => handleSpecialComplete(mission)}
                            disabled={!!completing || !actor}
                            style={{
                              padding: "0.3rem 0.65rem",
                              background: "oklch(0.82 0.18 85 / 0.2)",
                              border: "1px solid oklch(0.82 0.18 85 / 0.6)",
                              borderRadius: "4px",
                              color: "oklch(0.9 0.15 85)",
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              cursor:
                                completing || !actor
                                  ? "not-allowed"
                                  : "pointer",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {completing === mission.id ? "..." : "COMPLETE"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Regular missions for active tier */}
            <div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  color: "oklch(0.55 0.04 260)",
                  marginBottom: "0.75rem",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                ◆{" "}
                {activeTier === "daily"
                  ? "DAILY MISSIONS"
                  : activeTier === "weekly"
                    ? "WEEKLY MISSIONS"
                    : "MONTHLY MISSIONS"}
                <span
                  style={{
                    padding: "0.1rem 0.45rem",
                    background: "oklch(0.62 0.25 22 / 0.1)",
                    border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                    borderRadius: "100px",
                    fontSize: "0.6rem",
                    color: "oklch(0.62 0.25 22)",
                  }}
                >
                  Resets{" "}
                  {activeTier === "daily"
                    ? "daily"
                    : activeTier === "weekly"
                      ? "weekly"
                      : "monthly"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {currentMissions.map((mission, idx) => {
                  const isDone = completedMissions.includes(mission.id);
                  const isCompletingThis = completing === mission.id;

                  return (
                    <div
                      key={mission.id}
                      style={{
                        padding: "0.85rem 1rem",
                        background: isDone
                          ? `${trainer.color.replace(")", " / 0.08)")}`
                          : "oklch(0.12 0.02 260)",
                        border: `1px solid ${isDone ? trainer.color.replace(")", " / 0.4)") : "oklch(0.22 0.03 260 / 0.6)"}`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        opacity: isDone ? 0.8 : 1,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: isDone
                              ? trainer.color
                              : "oklch(0.88 0.02 260)",
                            marginBottom: "0.2rem",
                            textDecoration: isDone ? "line-through" : "none",
                          }}
                        >
                          {mission.name}
                        </div>
                        <div
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.7rem",
                            color: "oklch(0.55 0.04 260)",
                            lineHeight: 1.4,
                          }}
                        >
                          {mission.desc}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.4rem",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "oklch(0.82 0.18 85)",
                            textShadow: "0 0 6px oklch(0.82 0.18 85 / 0.5)",
                          }}
                        >
                          +{mission.xp} XP
                        </span>

                        {isDone ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.3rem 0.6rem",
                              background: `${trainer.color.replace(")", " / 0.1)")}`,
                              border: `1px solid ${trainer.color.replace(")", " / 0.4)")}`,
                              borderRadius: "4px",
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              color: trainer.color,
                            }}
                          >
                            <CheckCircle size={10} />
                            DONE
                          </div>
                        ) : (
                          <button
                            type="button"
                            data-ocid={`mission.complete.button.${idx + 1}`}
                            onClick={() => handleComplete(mission)}
                            disabled={!!completing || !actor}
                            style={{
                              padding: "0.35rem 0.75rem",
                              background: isCompletingThis
                                ? "oklch(0.18 0.02 260)"
                                : `linear-gradient(135deg, ${trainer.color} 0%, ${trainer.color.replace(")", " / 0.8)")})`,
                              border: `1px solid ${trainer.color.replace(")", " / 0.6)")}`,
                              borderRadius: "4px",
                              color: isCompletingThis
                                ? "oklch(0.5 0.03 260)"
                                : "oklch(0.98 0 0)",
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              cursor:
                                completing || !actor
                                  ? "not-allowed"
                                  : "pointer",
                              transition: "all 0.2s ease",
                              boxShadow:
                                !completing && actor
                                  ? `0 0 8px ${trainer.color.replace(")", " / 0.4)")}`
                                  : "none",
                            }}
                          >
                            {isCompletingThis ? "..." : "COMPLETE"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TrainerHubProps {
  completedMissions: string[];
  isLoggedIn: boolean;
  onLoginClick: () => void;
  playerLevel?: number;
}

export function TrainerHub({
  completedMissions,
  isLoggedIn,
  onLoginClick,
  playerLevel = 1,
}: TrainerHubProps) {
  const [activeTrainer, setActiveTrainer] = useState<TrainerData | null>(null);

  return (
    <section
      id="trainers"
      data-ocid="trainers.section"
      style={{
        padding: "100px 2rem 80px",
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
            "linear-gradient(oklch(0.62 0.25 22 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "600px",
          background:
            "radial-gradient(ellipse, oklch(0.62 0.25 22 / 0.04) 0%, transparent 70%)",
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
              background: "oklch(0.62 0.25 22 / 0.1)",
              border: "1px solid oklch(0.62 0.25 22 / 0.3)",
              borderRadius: "100px",
            }}
          >
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.25 22)",
              }}
            >
              AI TRAINER ROSTER
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              letterSpacing: "0.06em",
              margin: "0 0 1rem 0",
              background:
                "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            CHOOSE YOUR TRAINER
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.95rem",
              color: "oklch(0.6 0.04 260)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Six elite trainers. Daily · Weekly · Monthly missions. Tasks scale
            with your level.
          </p>
        </div>

        {/* Login required banner */}
        {!isLoggedIn && (
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "oklch(0.62 0.25 22 / 0.08)",
              border: "1px solid oklch(0.62 0.25 22 / 0.3)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.85rem",
                color: "oklch(0.75 0.04 260)",
                margin: 0,
              }}
            >
              🔒 Login to complete missions and earn XP
            </p>
            <button
              type="button"
              onClick={onLoginClick}
              className="btn-neon-red"
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.75rem",
                borderRadius: "4px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ⚡ LOGIN
            </button>
          </div>
        )}

        {/* Trainers grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TRAINERS.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onOpen={setActiveTrainer}
            />
          ))}
        </div>
      </div>

      {/* Trainer panel modal */}
      {activeTrainer && (
        <TrainerPanel
          trainer={activeTrainer}
          completedMissions={completedMissions}
          playerLevel={playerLevel}
          onClose={() => setActiveTrainer(null)}
        />
      )}
    </section>
  );
}
