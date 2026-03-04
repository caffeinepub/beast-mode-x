import { useActor } from "@/hooks/useActor";
import { CheckCircle, ChevronRight, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface OnboardingFlowProps {
  onComplete: () => void;
}

type Gender = "male" | "female" | "other";
type BodyType = "slim" | "athletic" | "average" | "bulky";
type Goal =
  | "Build Muscle"
  | "Lose Weight"
  | "Mental Clarity"
  | "Discipline & Focus"
  | "Become Unstoppable";
type FitnessLevel = "Beginner" | "Intermediate" | "Advanced" | "Elite";

const BODY_TYPES: {
  key: BodyType;
  label: string;
  icon: string;
  desc: string;
}[] = [
  { key: "slim", label: "SLIM", icon: "🏃", desc: "Lean & fast" },
  {
    key: "athletic",
    label: "ATHLETIC",
    icon: "⚡",
    desc: "Balanced powerhouse",
  },
  { key: "average", label: "AVERAGE", icon: "🧍", desc: "Starting fresh" },
  { key: "bulky", label: "BULKY", icon: "🦍", desc: "Built for power" },
];

const GOALS: { key: Goal; icon: string; desc: string; color: string }[] = [
  {
    key: "Build Muscle",
    icon: "💪",
    desc: "Forge an iron physique",
    color: "oklch(0.62 0.25 22)",
  },
  {
    key: "Lose Weight",
    icon: "🔥",
    desc: "Burn and transform",
    color: "oklch(0.65 0.22 45)",
  },
  {
    key: "Mental Clarity",
    icon: "🧠",
    desc: "Master your mind",
    color: "oklch(0.62 0.22 295)",
  },
  {
    key: "Discipline & Focus",
    icon: "🎯",
    desc: "Build unbreakable habits",
    color: "oklch(0.62 0.22 295)",
  },
  {
    key: "Become Unstoppable",
    icon: "⚔",
    desc: "Reach your peak potential",
    color: "oklch(0.82 0.18 85)",
  },
];

const FITNESS_LEVELS: {
  key: FitnessLevel;
  icon: string;
  desc: string;
  multiplier: string;
}[] = [
  {
    key: "Beginner",
    icon: "🌱",
    desc: "Just starting my journey",
    multiplier: "1x XP",
  },
  {
    key: "Intermediate",
    icon: "⚡",
    desc: "Building momentum",
    multiplier: "1.25x XP",
  },
  {
    key: "Advanced",
    icon: "🔥",
    desc: "Consistent warrior",
    multiplier: "1.5x XP",
  },
  { key: "Elite", icon: "👑", desc: "Peak performer", multiplier: "2x XP" },
];

const TRAINER_SUGGESTIONS: Record<
  Goal,
  { name: string; specialty: string; icon: string }
> = {
  "Build Muscle": { name: "KIRA", specialty: "Fitness & Strength", icon: "💪" },
  "Lose Weight": { name: "KIRA", specialty: "Fitness & Strength", icon: "💪" },
  "Mental Clarity": {
    name: "ZEN",
    specialty: "Focus & Meditation",
    icon: "🧘",
  },
  "Discipline & Focus": {
    name: "VEGA",
    specialty: "Discipline & Willpower",
    icon: "🛡",
  },
  "Become Unstoppable": {
    name: "APEX",
    specialty: "Mindset & Motivation",
    icon: "🌟",
  },
};

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = ((step - 1) / (total - 1)) * 100;
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            color: "oklch(0.55 0.04 260)",
          }}
        >
          STEP {step} OF {total}
        </span>
        <span
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            color: "oklch(0.62 0.25 22)",
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div
        style={{
          height: "4px",
          background: "oklch(0.15 0.02 260)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, oklch(0.62 0.25 22) 0%, oklch(0.62 0.22 295) 100%)",
            boxShadow: "0 0 8px oklch(0.62 0.25 22 / 0.7)",
            borderRadius: "2px",
            transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
      {/* Step dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.75rem",
          padding: "0 2px",
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static step dots with no reordering
            key={i}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                i + 1 < step
                  ? "oklch(0.62 0.25 22)"
                  : i + 1 === step
                    ? "oklch(0.62 0.22 295)"
                    : "oklch(0.2 0.02 260)",
              boxShadow:
                i + 1 <= step
                  ? i + 1 === step
                    ? "0 0 8px oklch(0.62 0.22 295 / 0.8)"
                    : "0 0 6px oklch(0.62 0.25 22 / 0.6)"
                  : "none",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { actor } = useActor();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [bodyType, setBodyType] = useState<BodyType | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(true);
  const TOTAL_STEPS = 5;

  const transitionToStep = (newStep: number) => {
    setVisible(false);
    setTimeout(() => {
      setStep(newStep);
      setVisible(true);
    }, 250);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) transitionToStep(step + 1);
  };

  const handleSubmit = async () => {
    if (
      !actor ||
      !username ||
      !age ||
      !gender ||
      !bodyType ||
      !goal ||
      !fitnessLevel
    )
      return;
    setIsSubmitting(true);
    try {
      await actor.registerPlayer(
        username.trim(),
        BigInt(Number.parseInt(age)),
        gender,
        goal,
        fitnessLevel,
        bodyType,
      );
      transitionToStep(5);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch {
      toast.error("Failed to create profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1)
      return username.trim().length >= 2 && age !== "" && gender !== "";
    if (step === 2) return bodyType !== "";
    if (step === 3) return goal !== "";
    if (step === 4) return fitnessLevel !== "";
    return true;
  };

  const suggestedTrainer = goal ? TRAINER_SUGGESTIONS[goal as Goal] : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(0 0 0 / 0.92)",
          backdropFilter: "blur(16px)",
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.25 22 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Modal */}
      <div
        data-ocid="onboarding.dialog"
        style={{
          position: "relative",
          zIndex: 1,
          background: "oklch(0.09 0.015 260)",
          border: "1px solid oklch(0.62 0.25 22 / 0.4)",
          borderRadius: "16px",
          padding: "2.5rem",
          maxWidth: "560px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow:
            "0 0 40px oklch(0.62 0.25 22 / 0.2), 0 40px 80px oklch(0 0 0 / 0.6)",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.62 0.25 22), oklch(0.62 0.22 295), transparent)",
            borderRadius: "16px 16px 0 0",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "oklch(0.62 0.25 22)",
              marginBottom: "0.5rem",
            }}
          >
            ◆ SYSTEM INITIALIZATION ◆
          </div>
          <h1
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 800,
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              letterSpacing: "0.06em",
              background:
                "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
            }}
          >
            FORGE YOUR IDENTITY
          </h1>
        </div>

        <ProgressBar step={step} total={TOTAL_STEPS} />

        {/* Step content */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.25s ease",
          }}
        >
          {/* Step 1: Username + Age + Gender */}
          {step === 1 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <h2
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "0.08em",
                    color: "oklch(0.9 0.02 260)",
                    marginBottom: "0.25rem",
                  }}
                >
                  WHO ARE YOU, WARRIOR?
                </h2>
                <p
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.82rem",
                    color: "oklch(0.55 0.04 260)",
                  }}
                >
                  Choose your player name and identity
                </p>
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="onboarding-username"
                  style={{
                    display: "block",
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "oklch(0.62 0.25 22)",
                    marginBottom: "0.5rem",
                  }}
                >
                  PLAYER NAME
                </label>
                <input
                  id="onboarding-username"
                  data-ocid="onboarding.username.input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ENTER YOUR NAME..."
                  maxLength={24}
                  style={{
                    width: "100%",
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    padding: "0.85rem 1rem",
                    background: "oklch(0.12 0.02 260)",
                    border: "1px solid oklch(0.62 0.25 22 / 0.4)",
                    borderRadius: "8px",
                    color: "oklch(0.9 0.02 260)",
                    outline: "none",
                    boxSizing: "border-box",
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
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="onboarding-age"
                  style={{
                    display: "block",
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "oklch(0.62 0.22 295)",
                    marginBottom: "0.5rem",
                  }}
                >
                  AGE
                </label>
                <input
                  id="onboarding-age"
                  data-ocid="onboarding.age.input"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="YOUR AGE"
                  min={10}
                  max={80}
                  style={{
                    width: "100%",
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    padding: "0.85rem 1rem",
                    background: "oklch(0.12 0.02 260)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.4)",
                    borderRadius: "8px",
                    color: "oklch(0.9 0.02 260)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLElement).style.borderColor =
                      "oklch(0.62 0.22 295 / 0.8)";
                    (e.target as HTMLElement).style.boxShadow =
                      "0 0 12px oklch(0.62 0.22 295 / 0.2)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLElement).style.borderColor =
                      "oklch(0.62 0.22 295 / 0.4)";
                    (e.target as HTMLElement).style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Gender */}
              <div>
                <p
                  style={{
                    display: "block",
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "oklch(0.62 0.25 22)",
                    marginBottom: "0.5rem",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  GENDER
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.75rem",
                  }}
                >
                  {(["male", "female", "other"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      data-ocid={`onboarding.gender.${g}.radio`}
                      onClick={() => setGender(g)}
                      style={{
                        padding: "0.85rem 0.5rem",
                        background:
                          gender === g
                            ? "oklch(0.62 0.25 22 / 0.2)"
                            : "oklch(0.12 0.02 260)",
                        border: `1px solid ${gender === g ? "oklch(0.62 0.25 22 / 0.8)" : "oklch(0.25 0.04 260 / 0.6)"}`,
                        borderRadius: "8px",
                        color:
                          gender === g
                            ? "oklch(0.62 0.25 22)"
                            : "oklch(0.65 0.03 260)",
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow:
                          gender === g
                            ? "0 0 12px oklch(0.62 0.25 22 / 0.2)"
                            : "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>
                        {g === "male" ? "♂" : g === "female" ? "♀" : "⚧"}
                      </span>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Body type */}
          {step === 2 && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <h2
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "0.08em",
                    color: "oklch(0.9 0.02 260)",
                    marginBottom: "0.25rem",
                  }}
                >
                  CHOOSE YOUR BUILD
                </h2>
                <p
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.82rem",
                    color: "oklch(0.55 0.04 260)",
                  }}
                >
                  What's your current body type?
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.875rem",
                }}
              >
                {BODY_TYPES.map((bt) => (
                  <button
                    key={bt.key}
                    type="button"
                    onClick={() => setBodyType(bt.key)}
                    style={{
                      padding: "1.25rem 1rem",
                      background:
                        bodyType === bt.key
                          ? "oklch(0.62 0.22 295 / 0.2)"
                          : "oklch(0.12 0.02 260)",
                      border: `1px solid ${bodyType === bt.key ? "oklch(0.62 0.22 295 / 0.8)" : "oklch(0.25 0.04 260 / 0.6)"}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow:
                        bodyType === bt.key
                          ? "0 0 16px oklch(0.62 0.22 295 / 0.2)"
                          : "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "2rem" }}>{bt.icon}</span>
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color:
                          bodyType === bt.key
                            ? "oklch(0.62 0.22 295)"
                            : "oklch(0.8 0.02 260)",
                      }}
                    >
                      {bt.label}
                    </span>
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.7rem",
                        color: "oklch(0.55 0.04 260)",
                      }}
                    >
                      {bt.desc}
                    </span>
                    {bodyType === bt.key && (
                      <CheckCircle
                        size={14}
                        style={{ color: "oklch(0.62 0.22 295)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Goal */}
          {step === 3 && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <h2
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "0.08em",
                    color: "oklch(0.9 0.02 260)",
                    marginBottom: "0.25rem",
                  }}
                >
                  WHAT DO YOU SEEK?
                </h2>
                <p
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.82rem",
                    color: "oklch(0.55 0.04 260)",
                  }}
                >
                  Choose your ultimate goal
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {GOALS.map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setGoal(g.key)}
                    style={{
                      padding: "1rem 1.25rem",
                      background:
                        goal === g.key
                          ? `${g.color.replace(")", " / 0.12)")}`
                          : "oklch(0.12 0.02 260)",
                      border: `1px solid ${goal === g.key ? g.color.replace(")", " / 0.7)") : "oklch(0.25 0.04 260 / 0.6)"}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                      {g.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color:
                            goal === g.key ? g.color : "oklch(0.85 0.02 260)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {g.key}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.72rem",
                          color: "oklch(0.55 0.04 260)",
                        }}
                      >
                        {g.desc}
                      </div>
                    </div>
                    {goal === g.key && (
                      <CheckCircle
                        size={16}
                        style={{ color: g.color, flexShrink: 0 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Fitness Level */}
          {step === 4 && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <h2
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "0.08em",
                    color: "oklch(0.9 0.02 260)",
                    marginBottom: "0.25rem",
                  }}
                >
                  CURRENT POWER LEVEL
                </h2>
                <p
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.82rem",
                    color: "oklch(0.55 0.04 260)",
                  }}
                >
                  How fit are you right now?
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.875rem",
                }}
              >
                {FITNESS_LEVELS.map((fl) => (
                  <button
                    key={fl.key}
                    type="button"
                    onClick={() => setFitnessLevel(fl.key)}
                    style={{
                      padding: "1.25rem 1rem",
                      background:
                        fitnessLevel === fl.key
                          ? "oklch(0.62 0.25 22 / 0.15)"
                          : "oklch(0.12 0.02 260)",
                      border: `1px solid ${fitnessLevel === fl.key ? "oklch(0.62 0.25 22 / 0.8)" : "oklch(0.25 0.04 260 / 0.6)"}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.4rem",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "1.75rem" }}>{fl.icon}</span>
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color:
                          fitnessLevel === fl.key
                            ? "oklch(0.62 0.25 22)"
                            : "oklch(0.8 0.02 260)",
                      }}
                    >
                      {fl.key.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.68rem",
                        color: "oklch(0.55 0.04 260)",
                      }}
                    >
                      {fl.desc}
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
                      {fl.multiplier}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Welcome */}
          {step === 5 && (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: "1rem",
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                ⚔
              </div>
              <h2
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  letterSpacing: "0.06em",
                  background:
                    "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "0.75rem",
                }}
              >
                YOUR JOURNEY BEGINS
              </h2>
              <p
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.9rem",
                  color: "oklch(0.7 0.03 260)",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                Welcome to Beast Mode X,{" "}
                <strong style={{ color: "oklch(0.62 0.25 22)" }}>
                  {username}
                </strong>
                .
                <br />
                Your awakening has begun.
              </p>

              {suggestedTrainer && (
                <div
                  style={{
                    padding: "1.25rem",
                    background: "oklch(0.62 0.22 295 / 0.1)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.4)",
                    borderRadius: "10px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      color: "oklch(0.55 0.04 260)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    YOUR RECOMMENDED TRAINER
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {suggestedTrainer.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      color: "oklch(0.62 0.22 295)",
                      textShadow: "0 0 8px oklch(0.62 0.22 295 / 0.6)",
                    }}
                  >
                    {suggestedTrainer.name}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.75rem",
                      color: "oklch(0.6 0.04 260)",
                    }}
                  >
                    {suggestedTrainer.specialty}
                  </div>
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  height: "4px",
                  background: "oklch(0.15 0.02 260)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(90deg, oklch(0.62 0.25 22), oklch(0.62 0.22 295))",
                    animation: "loadingBar 3s linear forwards",
                    borderRadius: "2px",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  color: "oklch(0.55 0.04 260)",
                }}
              >
                ENTERING THE ARENA...
              </p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {step < 5 && (
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            {step > 1 && (
              <button
                type="button"
                onClick={() => transitionToStep(step - 1)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "transparent",
                  border: "1px solid oklch(0.3 0.04 260 / 0.6)",
                  borderRadius: "6px",
                  color: "oklch(0.6 0.03 260)",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                ← BACK
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                data-ocid="onboarding.next.button"
                onClick={handleNext}
                disabled={!canProceed()}
                style={{
                  padding: "0.75rem 2rem",
                  background: canProceed()
                    ? "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)"
                    : "oklch(0.18 0.02 260)",
                  border: canProceed()
                    ? "1px solid oklch(0.72 0.28 22 / 0.6)"
                    : "1px solid oklch(0.25 0.03 260)",
                  borderRadius: "6px",
                  color: canProceed()
                    ? "oklch(0.98 0 0)"
                    : "oklch(0.35 0.02 260)",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: canProceed() ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: canProceed()
                    ? "0 0 12px oklch(0.62 0.25 22 / 0.4)"
                    : "none",
                }}
              >
                NEXT <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                data-ocid="onboarding.submit.button"
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                style={{
                  padding: "0.75rem 2rem",
                  background:
                    canProceed() && !isSubmitting
                      ? "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)"
                      : "oklch(0.18 0.02 260)",
                  border:
                    canProceed() && !isSubmitting
                      ? "1px solid oklch(0.72 0.28 22 / 0.6)"
                      : "1px solid oklch(0.25 0.03 260)",
                  borderRadius: "6px",
                  color:
                    canProceed() && !isSubmitting
                      ? "oklch(0.98 0 0)"
                      : "oklch(0.35 0.02 260)",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor:
                    canProceed() && !isSubmitting ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow:
                    canProceed() && !isSubmitting
                      ? "0 0 12px oklch(0.62 0.25 22 / 0.4)"
                      : "none",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={16}
                      style={{ animation: "spinGlow 0.8s linear infinite" }}
                    />
                    AWAKENING...
                  </>
                ) : (
                  <>⚡ AWAKEN</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
