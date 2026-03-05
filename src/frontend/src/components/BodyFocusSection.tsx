import { useAuth } from "@/components/auth/AuthProvider";
import { useCompleteWorkout, usePlayerProfile } from "@/hooks/useBackend";
import { getDateString } from "@/utils/gameUtils";
import { Dumbbell, Loader2, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Exercise {
  name: string;
  sets: number;
  repsOrTime: string;
}

interface WorkoutDefinition {
  id: string;
  name: string;
  duration: number;
  exerciseCount: number;
  difficulty: 1 | 2 | 3;
  xp: number;
  exercises: Exercise[];
}

type BodyFocusCategory = "ABS" | "ARMS" | "CHEST" | "LEGS" | "SHOULDERS";

// ─── Workout Data ─────────────────────────────────────────────────────────────
const WORKOUTS: Record<BodyFocusCategory, WorkoutDefinition[]> = {
  ABS: [
    {
      id: "abs-beginner",
      name: "Abs Beginner",
      duration: 14,
      exerciseCount: 16,
      difficulty: 1,
      xp: 100,
      exercises: [
        { name: "Crunches", sets: 3, repsOrTime: "15" },
        { name: "Leg Raises", sets: 3, repsOrTime: "12" },
        { name: "Bicycle Crunches", sets: 3, repsOrTime: "20" },
        { name: "Plank", sets: 3, repsOrTime: "30s" },
        { name: "Reverse Crunches", sets: 3, repsOrTime: "12" },
      ],
    },
    {
      id: "abs-intermediate",
      name: "Abs Intermediate",
      duration: 22,
      exerciseCount: 21,
      difficulty: 2,
      xp: 200,
      exercises: [
        { name: "V-Ups", sets: 3, repsOrTime: "15" },
        { name: "Dragon Flags", sets: 3, repsOrTime: "8" },
        { name: "Side Plank", sets: 3, repsOrTime: "45s" },
        { name: "Ab Wheel Rollout", sets: 3, repsOrTime: "10" },
        { name: "Hanging Knee Raises", sets: 3, repsOrTime: "15" },
      ],
    },
    {
      id: "abs-sixpack",
      name: "Six Pack Crusher",
      duration: 30,
      exerciseCount: 25,
      difficulty: 3,
      xp: 350,
      exercises: [
        { name: "Decline Sit-ups", sets: 4, repsOrTime: "20" },
        { name: "L-Sits", sets: 4, repsOrTime: "20s" },
        { name: "Windshield Wipers", sets: 4, repsOrTime: "12" },
        { name: "Toes to Bar", sets: 4, repsOrTime: "10" },
        { name: "Plank to Pike", sets: 4, repsOrTime: "15" },
      ],
    },
  ],
  ARMS: [
    {
      id: "arms-toner",
      name: "Arm Toner",
      duration: 12,
      exerciseCount: 14,
      difficulty: 1,
      xp: 90,
      exercises: [
        { name: "Push-ups", sets: 3, repsOrTime: "15" },
        { name: "Diamond Push-ups", sets: 3, repsOrTime: "12" },
        { name: "Tricep Dips", sets: 3, repsOrTime: "15" },
        { name: "Pike Push-ups", sets: 3, repsOrTime: "12" },
        { name: "Arm Circles", sets: 3, repsOrTime: "30" },
      ],
    },
    {
      id: "arms-builder",
      name: "Arm Builder",
      duration: 20,
      exerciseCount: 18,
      difficulty: 2,
      xp: 180,
      exercises: [
        { name: "Close-grip Push-ups", sets: 4, repsOrTime: "15" },
        { name: "Decline Push-ups", sets: 4, repsOrTime: "12" },
        { name: "Tricep Extension", sets: 4, repsOrTime: "15" },
        { name: "Plank Shoulder Taps", sets: 4, repsOrTime: "20" },
        { name: "Handstand Practice", sets: 4, repsOrTime: "20s" },
      ],
    },
    {
      id: "arms-beast",
      name: "Beast Arms",
      duration: 28,
      exerciseCount: 22,
      difficulty: 3,
      xp: 320,
      exercises: [
        { name: "Planche Lean", sets: 4, repsOrTime: "20s" },
        { name: "Pseudo Planche Push-ups", sets: 4, repsOrTime: "10" },
        { name: "One-Arm Push-up Neg", sets: 4, repsOrTime: "5" },
        { name: "Ring Dips (chair)", sets: 4, repsOrTime: "15" },
        { name: "Clap Push-ups", sets: 4, repsOrTime: "12" },
      ],
    },
  ],
  CHEST: [
    {
      id: "chest-starter",
      name: "Chest Starter",
      duration: 14,
      exerciseCount: 15,
      difficulty: 1,
      xp: 95,
      exercises: [
        { name: "Wide Push-ups", sets: 3, repsOrTime: "15" },
        { name: "Incline Push-ups", sets: 3, repsOrTime: "15" },
        { name: "Chest Squeeze", sets: 3, repsOrTime: "20s" },
        { name: "Push-up Holds", sets: 3, repsOrTime: "10" },
        { name: "Superman", sets: 3, repsOrTime: "15" },
      ],
    },
    {
      id: "chest-power",
      name: "Power Chest",
      duration: 22,
      exerciseCount: 20,
      difficulty: 2,
      xp: 190,
      exercises: [
        { name: "Archer Push-ups", sets: 4, repsOrTime: "10" },
        { name: "Decline Push-ups", sets: 4, repsOrTime: "15" },
        { name: "Plyometric Push-ups", sets: 4, repsOrTime: "10" },
        { name: "Chest Dips", sets: 4, repsOrTime: "12" },
        { name: "Weighted Push-ups", sets: 4, repsOrTime: "15" },
      ],
    },
    {
      id: "chest-elite",
      name: "Elite Chest",
      duration: 32,
      exerciseCount: 24,
      difficulty: 3,
      xp: 340,
      exercises: [
        { name: "Muscle-up Transition", sets: 4, repsOrTime: "5" },
        { name: "Dips", sets: 4, repsOrTime: "20" },
        { name: "Pike Clap Push-ups", sets: 4, repsOrTime: "10" },
        { name: "Ring Push-ups", sets: 4, repsOrTime: "12" },
        { name: "Explosive Push-ups", sets: 4, repsOrTime: "15" },
      ],
    },
  ],
  LEGS: [
    {
      id: "legs-basic",
      name: "Leg Day Basic",
      duration: 16,
      exerciseCount: 16,
      difficulty: 1,
      xp: 110,
      exercises: [
        { name: "Squats", sets: 3, repsOrTime: "20" },
        { name: "Lunges", sets: 3, repsOrTime: "15 each" },
        { name: "Glute Bridges", sets: 3, repsOrTime: "20" },
        { name: "Calf Raises", sets: 3, repsOrTime: "25" },
        { name: "Wall Sit", sets: 3, repsOrTime: "45s" },
      ],
    },
    {
      id: "legs-power",
      name: "Leg Power",
      duration: 24,
      exerciseCount: 20,
      difficulty: 2,
      xp: 210,
      exercises: [
        { name: "Jump Squats", sets: 4, repsOrTime: "15" },
        { name: "Bulgarian Split Squats", sets: 4, repsOrTime: "12 each" },
        { name: "Pistol Squat Assist", sets: 4, repsOrTime: "8" },
        { name: "Box Jumps", sets: 4, repsOrTime: "12" },
        { name: "Nordic Curls", sets: 4, repsOrTime: "8" },
      ],
    },
    {
      id: "legs-beast",
      name: "Beast Legs",
      duration: 35,
      exerciseCount: 25,
      difficulty: 3,
      xp: 380,
      exercises: [
        { name: "Pistol Squats", sets: 4, repsOrTime: "10 each" },
        { name: "Shrimp Squats", sets: 4, repsOrTime: "8" },
        { name: "Jumping Lunges", sets: 4, repsOrTime: "20" },
        { name: "Dragon Pistols", sets: 4, repsOrTime: "6" },
        { name: "Sprinting", sets: 4, repsOrTime: "100m" },
      ],
    },
  ],
  SHOULDERS: [
    {
      id: "shoulders-starter",
      name: "Shoulder Starter",
      duration: 12,
      exerciseCount: 14,
      difficulty: 1,
      xp: 85,
      exercises: [
        { name: "Arm Circles", sets: 3, repsOrTime: "30" },
        { name: "Pike Push-ups", sets: 3, repsOrTime: "12" },
        { name: "Lateral Raises (bodyweight)", sets: 3, repsOrTime: "15" },
        { name: "Shoulder Taps", sets: 3, repsOrTime: "20" },
        { name: "Bear Crawl", sets: 3, repsOrTime: "20s" },
      ],
    },
    {
      id: "shoulders-warrior",
      name: "Shoulder Warrior",
      duration: 20,
      exerciseCount: 18,
      difficulty: 2,
      xp: 175,
      exercises: [
        { name: "Handstand Practice", sets: 4, repsOrTime: "30s" },
        { name: "Pike Push-up Holds", sets: 4, repsOrTime: "15" },
        { name: "Wall Handstand", sets: 4, repsOrTime: "30s" },
        { name: "Decline Push-ups", sets: 4, repsOrTime: "15" },
        { name: "L-Sit to Handstand", sets: 4, repsOrTime: "5" },
      ],
    },
    {
      id: "shoulders-iron",
      name: "Iron Shoulders",
      duration: 30,
      exerciseCount: 22,
      difficulty: 3,
      xp: 300,
      exercises: [
        { name: "Freestanding Handstand", sets: 4, repsOrTime: "30s" },
        { name: "Handstand Push-ups", sets: 4, repsOrTime: "8" },
        { name: "Press to Handstand", sets: 4, repsOrTime: "5" },
        { name: "One-Arm Handstand Lean", sets: 4, repsOrTime: "15s" },
        { name: "Planche Press", sets: 4, repsOrTime: "5" },
      ],
    },
  ],
};

const CATEGORY_TABS: { key: BodyFocusCategory; label: string; icon: string }[] =
  [
    { key: "ABS", label: "Abs", icon: "🔥" },
    { key: "ARMS", label: "Arms", icon: "💪" },
    { key: "CHEST", label: "Chest", icon: "🏋" },
    { key: "LEGS", label: "Legs", icon: "🦵" },
    { key: "SHOULDERS", label: "Shoulders & Back", icon: "⚡" },
  ];

const DIFFICULTY_COLORS: Record<number, string> = {
  1: "oklch(0.65 0.2 140)",
  2: "oklch(0.82 0.18 85)",
  3: "oklch(0.62 0.25 22)",
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "BEGINNER",
  2: "INTERMEDIATE",
  3: "ADVANCED",
};

// ─── Workout Modal ─────────────────────────────────────────────────────────────
interface WorkoutModalProps {
  workout: WorkoutDefinition;
  completedKey: string | null;
  onClose: () => void;
  onComplete: (workout: WorkoutDefinition) => Promise<void>;
  isCompleting: boolean;
}

function WorkoutModal({
  workout,
  completedKey,
  onClose,
  onComplete,
  isCompleting,
}: WorkoutModalProps) {
  const diffColor =
    DIFFICULTY_COLORS[workout.difficulty] ?? "oklch(0.62 0.25 22)";

  return (
    <div
      data-ocid="bodyfocus.workout.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "oklch(0 0 0 / 0.85)",
        backdropFilter: "blur(10px)",
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        style={{
          background: "oklch(0.09 0.015 260)",
          border: "1px solid oklch(0.62 0.25 22 / 0.4)",
          borderRadius: "14px",
          padding: "2rem",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "85vh",
          overflowY: "auto",
          position: "relative",
          boxShadow:
            "0 0 40px oklch(0.62 0.25 22 / 0.15), 0 24px 80px oklch(0 0 0 / 0.6)",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.62 0.25 22), transparent)",
          }}
        />

        {/* Close */}
        <button
          type="button"
          data-ocid="bodyfocus.workout.close_button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "1px solid oklch(0.3 0.03 260 / 0.5)",
            borderRadius: "4px",
            padding: "0.4rem",
            cursor: "pointer",
            color: "oklch(0.55 0.04 260)",
            display: "flex",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            minHeight: "40px",
            minWidth: "40px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        {/* Workout title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                padding: "0.18rem 0.55rem",
                background: diffColor.replace(")", " / 0.12)"),
                border: `1px solid ${diffColor.replace(")", " / 0.4)")}`,
                borderRadius: "100px",
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: diffColor,
              }}
            >
              {"⚡".repeat(workout.difficulty)}{" "}
              {DIFFICULTY_LABELS[workout.difficulty]}
            </span>
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.58rem",
                color: "oklch(0.5 0.03 260)",
                letterSpacing: "0.05em",
              }}
            >
              {workout.duration} mins • {workout.exerciseCount} exercises
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "1.3rem",
              fontWeight: 900,
              letterSpacing: "0.04em",
              color: "oklch(0.95 0.02 260)",
              margin: 0,
            }}
          >
            {workout.name}
          </h2>
          {completedKey && (
            <div
              style={{
                marginTop: "0.4rem",
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.6rem",
                color: "oklch(0.65 0.2 140)",
                letterSpacing: "0.08em",
              }}
            >
              ✓ Last completed: {completedKey.split("-").slice(-3).join("-")}
            </div>
          )}
        </div>

        {/* XP badge */}
        <div
          style={{
            padding: "0.85rem",
            background: "oklch(0.62 0.25 22 / 0.08)",
            border: "1px solid oklch(0.62 0.25 22 / 0.25)",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "oklch(0.62 0.25 22)",
              textShadow: "0 0 12px oklch(0.62 0.25 22 / 0.6)",
              lineHeight: 1,
            }}
          >
            +{workout.xp} XP
          </div>
          <div
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: "0.58rem",
              color: "oklch(0.5 0.03 260)",
              letterSpacing: "0.12em",
              marginTop: "0.25rem",
            }}
          >
            REWARD ON COMPLETION
          </div>
        </div>

        {/* Exercise list */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "oklch(0.5 0.03 260)",
              marginBottom: "0.75rem",
            }}
          >
            ◆ EXERCISE LIST
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            {workout.exercises.map((ex, i) => (
              <div
                key={ex.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.6rem 0.85rem",
                  background: "oklch(0.11 0.015 260 / 0.7)",
                  border: "1px solid oklch(0.2 0.02 260 / 0.5)",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "0.55rem",
                      color: "oklch(0.62 0.25 22)",
                      fontWeight: 700,
                      minWidth: "1rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.78rem",
                      color: "oklch(0.82 0.02 260)",
                    }}
                  >
                    {ex.name}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: diffColor,
                    whiteSpace: "nowrap",
                  }}
                >
                  {ex.sets}×{ex.repsOrTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Complete button */}
        <button
          type="button"
          data-ocid="workout.complete.button"
          onClick={() => void onComplete(workout)}
          disabled={isCompleting}
          style={{
            width: "100%",
            padding: "0.95rem",
            background: isCompleting
              ? "oklch(0.15 0.02 260)"
              : "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
            border: "1px solid oklch(0.72 0.28 22 / 0.5)",
            borderRadius: "8px",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.82rem",
            fontWeight: 900,
            letterSpacing: "0.12em",
            color: "oklch(0.98 0 0)",
            cursor: isCompleting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            boxShadow: isCompleting
              ? "none"
              : "0 0 16px oklch(0.62 0.25 22 / 0.4)",
            transition: "all 0.2s ease",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            minHeight: "52px",
          }}
        >
          {isCompleting ? (
            <Loader2
              size={16}
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Zap size={16} />
          )}
          {isCompleting ? "COMPLETING..." : "COMPLETE WORKOUT"}
        </button>
      </div>
    </div>
  );
}

// ─── Workout Card ──────────────────────────────────────────────────────────────
interface WorkoutCardProps {
  workout: WorkoutDefinition;
  cardIndex: number;
  completedKey: string | null;
  onStart: (workout: WorkoutDefinition) => void;
}

function WorkoutCard({
  workout,
  cardIndex,
  completedKey,
  onStart,
}: WorkoutCardProps) {
  const diffColor =
    DIFFICULTY_COLORS[workout.difficulty] ?? "oklch(0.62 0.25 22)";

  return (
    <div
      style={{
        padding: "1.25rem",
        background: completedKey
          ? "oklch(0.11 0.018 260 / 0.9)"
          : "oklch(0.09 0.015 260 / 0.8)",
        border: `1px solid ${completedKey ? "oklch(0.65 0.2 140 / 0.4)" : "oklch(0.22 0.03 260 / 0.5)"}`,
        borderRadius: "10px",
        backdropFilter: "blur(10px)",
        boxShadow: completedKey ? "0 0 16px oklch(0.65 0.2 140 / 0.1)" : "none",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
    >
      {/* Difficulty + completed */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            padding: "0.15rem 0.5rem",
            background: diffColor.replace(")", " / 0.1)"),
            border: `1px solid ${diffColor.replace(")", " / 0.3)")}`,
            borderRadius: "100px",
            fontFamily: '"Geist Mono", monospace',
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: diffColor,
          }}
        >
          {"⚡".repeat(workout.difficulty)}{" "}
          {DIFFICULTY_LABELS[workout.difficulty]}
        </span>
        {completedKey && (
          <span
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: "0.55rem",
              color: "oklch(0.65 0.2 140)",
              letterSpacing: "0.05em",
            }}
          >
            ✓ Done
          </span>
        )}
      </div>

      {/* Name */}
      <h4
        style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.9rem",
          fontWeight: 800,
          color: "oklch(0.92 0.02 260)",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {workout.name}
      </h4>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: '"Geist Mono", monospace',
            fontSize: "0.6rem",
            color: "oklch(0.5 0.03 260)",
          }}
        >
          ⏱ {workout.duration} mins
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: '"Geist Mono", monospace',
            fontSize: "0.6rem",
            color: "oklch(0.5 0.03 260)",
          }}
        >
          <Dumbbell size={9} />
          {workout.exerciseCount} exercises
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: '"Geist Mono", monospace',
            fontSize: "0.6rem",
            color: "oklch(0.62 0.25 22)",
            fontWeight: 700,
          }}
        >
          ⚡ {workout.xp} XP
        </span>
      </div>

      {/* Last completed */}
      {completedKey && (
        <div
          style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: "0.57rem",
            color: "oklch(0.45 0.03 260)",
            letterSpacing: "0.05em",
          }}
        >
          Last completed: {completedKey.split("-").slice(-3).join("-")}
        </div>
      )}

      {/* Start button */}
      <button
        type="button"
        data-ocid={`workout.start.button.${cardIndex}`}
        onClick={() => onStart(workout)}
        style={{
          width: "100%",
          padding: "0.7rem",
          background: completedKey
            ? "oklch(0.12 0.015 260 / 0.6)"
            : "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
          border: completedKey
            ? "1px solid oklch(0.65 0.2 140 / 0.4)"
            : "1px solid oklch(0.72 0.28 22 / 0.5)",
          borderRadius: "6px",
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.7rem",
          fontWeight: 900,
          letterSpacing: "0.1em",
          color: completedKey ? "oklch(0.65 0.2 140)" : "oklch(0.98 0 0)",
          cursor: "pointer",
          boxShadow: completedKey
            ? "none"
            : "0 0 8px oklch(0.62 0.25 22 / 0.3)",
          transition: "all 0.2s ease",
          marginTop: "auto",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          minHeight: "44px",
        }}
      >
        {completedKey ? "🔄 REDO WORKOUT" : "⚡ START WORKOUT"}
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function BodyFocusSection() {
  const { isLoggedIn } = useAuth();
  const { data: profile } = usePlayerProfile();
  const completeWorkout = useCompleteWorkout();

  const [activeCategory, setActiveCategory] =
    useState<BodyFocusCategory>("ABS");
  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutDefinition | null>(null);

  // Build a map of workout base-id -> completed date key
  const completedMap: Record<string, string> = {};
  for (const id of profile?.completedMissions ?? []) {
    // workout IDs are stored as: <workoutId>-<dateString> where dateString is YYYY-MM-DD
    const parts = id.split("-");
    if (parts.length >= 4) {
      // workoutId might have dashes, so extract date from the last 3 segments
      const dateStr = parts.slice(-3).join("-");
      const workoutBaseId = parts.slice(0, -3).join("-");
      if (!completedMap[workoutBaseId]) {
        completedMap[workoutBaseId] = dateStr;
      }
    }
  }

  const handleCompleteWorkout = async (workout: WorkoutDefinition) => {
    if (!isLoggedIn) {
      toast.error("Login to save your workout progress!");
      return;
    }
    const dateStr = getDateString();
    const workoutId = `${workout.id}-${dateStr}`;

    try {
      await completeWorkout.mutateAsync({
        workoutId,
        xpReward: BigInt(workout.xp),
        category: "fitness",
      });
      toast.success(`💪 Workout Complete! +${workout.xp} XP earned!`, {
        duration: 4000,
        style: {
          background: "oklch(0.12 0.04 22)",
          border: "1px solid oklch(0.62 0.25 22 / 0.5)",
          color: "oklch(0.9 0.05 22)",
        },
      });
      setSelectedWorkout(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to save workout: ${msg}. Try again.`, {
        duration: 5000,
        action: {
          label: "Retry",
          onClick: () => void handleCompleteWorkout(workout),
        },
      });
      // Do NOT close modal on error — user can retry
    }
  };

  const currentWorkouts = WORKOUTS[activeCategory];

  return (
    <>
      <section
        id="body-focus"
        data-ocid="bodyfocus.section"
        style={{
          padding: "100px 2rem 80px",
          background: "oklch(0.06 0.01 255)",
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
            top: "20%",
            left: "-200px",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, oklch(0.62 0.22 295 / 0.05) 0%, transparent 70%)",
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
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "oklch(0.62 0.22 295)",
                }}
              >
                HOME WORKOUT SYSTEM
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
                  "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.62 0.25 22) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              BODY FOCUS WORKOUTS
            </h2>
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.9rem",
                color: "oklch(0.55 0.04 260)",
              }}
            >
              Target specific muscle groups. No equipment needed.
            </p>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "2rem",
              overflowX: "auto",
              paddingBottom: "0.25rem",
              WebkitOverflowScrolling:
                "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            }}
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  data-ocid={`bodyfocus.${tab.key.toLowerCase()}.tab`}
                  onClick={() => setActiveCategory(tab.key)}
                  style={{
                    flexShrink: 0,
                    padding: "0.55rem 1.1rem",
                    background: isActive
                      ? "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)"
                      : "oklch(0.1 0.015 260 / 0.7)",
                    border: isActive
                      ? "1px solid oklch(0.72 0.28 22 / 0.6)"
                      : "1px solid oklch(0.22 0.03 260 / 0.5)",
                    borderRadius: "8px",
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: isActive ? "oklch(0.98 0 0)" : "oklch(0.6 0.03 260)",
                    cursor: "pointer",
                    boxShadow: isActive
                      ? "0 0 10px oklch(0.62 0.25 22 / 0.4)"
                      : "none",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Workout Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.25rem",
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {currentWorkouts?.map((workout, idx) => {
              const completedKey = completedMap[workout.id] ?? null;
              return (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  cardIndex={idx + 1}
                  completedKey={completedKey}
                  onStart={setSelectedWorkout}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Workout Modal */}
      {selectedWorkout && (
        <WorkoutModal
          workout={selectedWorkout}
          completedKey={completedMap[selectedWorkout.id] ?? null}
          onClose={() => setSelectedWorkout(null)}
          onComplete={handleCompleteWorkout}
          isCompleting={completeWorkout.isPending}
        />
      )}
    </>
  );
}
