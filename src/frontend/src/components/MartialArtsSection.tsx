import { useActorSafe } from "@/hooks/useActorSafe";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Skull,
  Swords,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { PlayerProfile } from "../backend.d";

interface MartialArtsSectionProps {
  profile: PlayerProfile | null | undefined;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

// ── Daily task pool (level-scaled) ──────────────────────────────────────────
const TASK_POOL_BEGINNER = [
  {
    id: "ma_jab_cross",
    name: "100 Jab-Cross Combos",
    icon: "👊",
    xp: 80,
    desc: "Perfect form. Right jab, left cross. 100 reps total.",
    deadline: "23:59",
  },
  {
    id: "ma_squat_kick",
    name: "50 Squat + Side Kicks",
    icon: "🦵",
    xp: 90,
    desc: "Squat low, drive side kick at hip height. Each leg counts.",
    deadline: "23:59",
  },
  {
    id: "ma_plank_hold",
    name: "3 × 1-Min Plank Hold",
    icon: "🛡",
    xp: 70,
    desc: "Core tight, breathe steady. No breaks between sets.",
    deadline: "23:59",
  },
  {
    id: "ma_block_parry",
    name: "Defensive Kata × 3",
    icon: "🥷",
    xp: 75,
    desc: "Block, parry, redirect — full sequence three times.",
    deadline: "23:59",
  },
  {
    id: "ma_burpees_20",
    name: "20 Martial Burpees",
    icon: "💥",
    xp: 85,
    desc: "Burpee + jump kick at the top. Maximum explosive output.",
    deadline: "23:59",
  },
];

const TASK_POOL_INTERMEDIATE = [
  {
    id: "ma_combo_drill",
    name: "200 Full Combo Reps",
    icon: "🔥",
    xp: 130,
    desc: "Jab-cross-hook-uppercut-knee. 200 complete combos.",
    deadline: "23:59",
  },
  {
    id: "ma_shadow_5min",
    name: "5-Min Shadow Boxing",
    icon: "👤",
    xp: 120,
    desc: "Full speed, full power. No rest. 5 full minutes.",
    deadline: "23:59",
  },
  {
    id: "ma_leg_conditioning",
    name: "Leg Conditioning Circuit",
    icon: "⚡",
    xp: 140,
    desc: "100 kicks + 100 stomps + 50 spinning back kicks.",
    deadline: "23:59",
  },
  {
    id: "ma_speed_drill",
    name: "Speed Bag Drill × 5",
    icon: "🏃",
    xp: 125,
    desc: "Maximum hand speed. 5 rounds of 90 seconds.",
    deadline: "23:59",
  },
  {
    id: "ma_stance_work",
    name: "Stance & Footwork Drill",
    icon: "🎯",
    xp: 115,
    desc: "Advance, retreat, pivot, angle — 10 minutes non-stop.",
    deadline: "23:59",
  },
];

const TASK_POOL_ADVANCED = [
  {
    id: "ma_1000_strikes",
    name: "1000-Strike Challenge",
    icon: "💀",
    xp: 250,
    desc: "Any combination. 1000 total strikes before midnight.",
    deadline: "23:59",
  },
  {
    id: "ma_sparring_sim",
    name: "Sparring Simulation",
    icon: "⚔️",
    xp: 220,
    desc: "10 × 3-min rounds. Full intensity shadow sparring.",
    deadline: "23:59",
  },
  {
    id: "ma_iron_conditioning",
    name: "Iron Body Conditioning",
    icon: "🪨",
    xp: 280,
    desc: "Wrist, shin, and knuckle hardening. 30-min circuit.",
    deadline: "23:59",
  },
  {
    id: "ma_weapon_kata",
    name: "Weapon Kata Mastery",
    icon: "🗡️",
    xp: 260,
    desc: "Improvised weapon training. 5 kata sequences × 4 reps.",
    deadline: "23:59",
  },
  {
    id: "ma_endurance_fight",
    name: "Endurance Fighter Drill",
    icon: "🔱",
    xp: 300,
    desc: "20 rounds, 2 min each. No stopping. No excuses.",
    deadline: "23:59",
  },
];

// ── Penalty pool (always different each time) ────────────────────────────────
const PENALTY_POOL = [
  {
    icon: "💀",
    title: "SHADOW WALKER CURSE",
    desc: "A warrior who rests without cause is no warrior. -50 XP deducted.",
    xp: 50,
  },
  {
    icon: "🩸",
    title: "BLOOD DEBT",
    desc: "Your laziness has a price. RYU demands -75 XP as tribute.",
    xp: 75,
  },
  {
    icon: "⛓️",
    title: "CHAIN OF WEAKNESS",
    desc: "You are bound by your own failure. -60 XP removed.",
    xp: 60,
  },
  {
    icon: "🔥",
    title: "DOJO DISGRACE",
    desc: "You have dishonored the dojo. -80 XP burned away.",
    xp: 80,
  },
  {
    icon: "☠️",
    title: "WARRIOR'S SHAME",
    desc: "Incomplete training haunts the spirit. -65 XP consumed.",
    xp: 65,
  },
  {
    icon: "🌑",
    title: "VOID PUNISHMENT",
    desc: "The void claims what you refused to earn. -90 XP lost.",
    xp: 90,
  },
  {
    icon: "⚡",
    title: "LIGHTNING JUDGMENT",
    desc: "RYU's lightning strikes the weak. -70 XP struck down.",
    xp: 70,
  },
  {
    icon: "🗡️",
    title: "BLADE OF CONSEQUENCE",
    desc: "Every missed day sharpens regret. -55 XP cut away.",
    xp: 55,
  },
];

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function getDailyTask(
  level: number,
  dateKey: string,
): (typeof TASK_POOL_BEGINNER)[number] {
  let pool = TASK_POOL_BEGINNER;
  if (level >= 6) pool = TASK_POOL_ADVANCED;
  else if (level >= 3) pool = TASK_POOL_INTERMEDIATE;

  // Deterministic shuffle by date + level so same day = same task
  const seed = dateKey.replace(/-/g, "").slice(-4);
  const idx = (Number(seed) + level) % pool.length;
  return pool[idx];
}

function getRandomPenalty(
  dateKey: string,
  attempt: number,
): (typeof PENALTY_POOL)[number] {
  const seed = dateKey.replace(/-/g, "").slice(-4);
  const idx = (Number(seed) + attempt * 7) % PENALTY_POOL.length;
  return PENALTY_POOL[idx];
}

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

function useCountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calc() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }
    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ── Training confirmation overlay ────────────────────────────────────────────
interface ConfirmOverlayProps {
  task: (typeof TASK_POOL_BEGINNER)[number];
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmOverlay({ task, onConfirm, onCancel }: ConfirmOverlayProps) {
  const [checked, setChecked] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    setCanConfirm(true);
  }, [countdown]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0 0 0 / 0.85)",
        backdropFilter: "blur(10px)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "oklch(0.09 0.015 260)",
          border: "1px solid oklch(0.62 0.22 295 / 0.5)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 0 40px oklch(0.62 0.22 295 / 0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
            {task.icon}
          </div>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              color: "oklch(0.9 0.02 260)",
              marginBottom: "0.4rem",
            }}
          >
            {task.name}
          </div>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.8rem",
              color: "oklch(0.6 0.04 260)",
              lineHeight: 1.5,
            }}
          >
            {task.desc}
          </div>
          <div
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "oklch(0.82 0.18 85 / 0.1)",
              border: "1px solid oklch(0.82 0.18 85 / 0.3)",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                fontSize: "1rem",
                color: "oklch(0.82 0.18 85)",
              }}
            >
              +{task.xp} XP
            </span>
          </div>
        </div>

        {/* Honor oath */}
        <label
          htmlFor="honor-oath"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            padding: "1rem",
            marginBottom: "1.25rem",
            background: "oklch(0.62 0.22 295 / 0.06)",
            border: `1px solid ${checked ? "oklch(0.62 0.22 295 / 0.5)" : "oklch(0.3 0.04 260 / 0.4)"}`,
            borderRadius: "10px",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
        >
          <input
            id="honor-oath"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            data-ocid="martial.honor_oath.checkbox"
            style={{
              width: "18px",
              height: "18px",
              marginTop: "2px",
              accentColor: "oklch(0.62 0.22 295)",
              flexShrink: 0,
              cursor: "pointer",
            }}
          />
          <span
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.78rem",
              color: "oklch(0.7 0.04 260)",
              lineHeight: 1.5,
            }}
          >
            🥋{" "}
            <strong style={{ color: "oklch(0.85 0.05 260)" }}>
              Honor Oath:
            </strong>{" "}
            I confirm I actually completed this training session. A true warrior
            never lies.
          </span>
        </label>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={onCancel}
            data-ocid="martial.confirm.cancel_button"
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "8px",
              background: "transparent",
              border: "1px solid oklch(0.3 0.04 260 / 0.5)",
              color: "oklch(0.55 0.04 260)",
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              minHeight: "48px",
              touchAction: "manipulation",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!checked || !canConfirm}
            data-ocid="martial.confirm.confirm_button"
            style={{
              flex: 2,
              padding: "0.75rem",
              borderRadius: "8px",
              background:
                checked && canConfirm
                  ? "linear-gradient(135deg, oklch(0.62 0.22 295), oklch(0.55 0.22 320))"
                  : "oklch(0.18 0.02 295)",
              border: "none",
              color: checked && canConfirm ? "white" : "oklch(0.4 0.04 295)",
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: checked && canConfirm ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              minHeight: "48px",
              touchAction: "manipulation",
              boxShadow:
                checked && canConfirm
                  ? "0 0 15px oklch(0.62 0.22 295 / 0.4)"
                  : "none",
            }}
          >
            {!canConfirm
              ? `Wait ${countdown}s...`
              : checked
                ? "✓ CONFIRM COMPLETE"
                : "Check oath first"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Penalty reveal overlay ────────────────────────────────────────────────────
interface PenaltyOverlayProps {
  penalty: (typeof PENALTY_POOL)[number];
  onClose: () => void;
}

function PenaltyOverlay({ penalty, onClose }: PenaltyOverlayProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0 0 0 / 0.9)",
        backdropFilter: "blur(12px)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "oklch(0.07 0.01 10)",
          border: "1px solid oklch(0.62 0.25 22 / 0.6)",
          borderRadius: "16px",
          padding: "2rem",
          textAlign: "center",
          boxShadow:
            "0 0 60px oklch(0.62 0.25 22 / 0.3), 0 0 120px oklch(0.62 0.25 22 / 0.1)",
          animation: "neonPulse 0.6s ease-in-out",
        }}
      >
        <div
          style={{
            fontSize: "4rem",
            marginBottom: "0.75rem",
            filter: "drop-shadow(0 0 16px oklch(0.62 0.25 22))",
          }}
        >
          {penalty.icon}
        </div>
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "1.3rem",
            letterSpacing: "0.12em",
            color: "oklch(0.62 0.25 22)",
            textShadow: "0 0 20px oklch(0.62 0.25 22 / 0.8)",
            marginBottom: "0.75rem",
          }}
        >
          {penalty.title}
        </div>
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.85rem",
            color: "oklch(0.65 0.04 20)",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
        >
          {penalty.desc}
        </div>
        <div
          style={{
            padding: "0.6rem 1.2rem",
            background: "oklch(0.62 0.25 22 / 0.1)",
            border: "1px solid oklch(0.62 0.25 22 / 0.4)",
            borderRadius: "8px",
            display: "inline-block",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "1.4rem",
              color: "oklch(0.62 0.25 22)",
              textShadow: "0 0 10px oklch(0.62 0.25 22)",
            }}
          >
            -{penalty.xp} XP
          </span>
        </div>
        <div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="martial.penalty.close_button"
            style={{
              width: "100%",
              padding: "0.75rem 1.5rem",
              background: "oklch(0.62 0.25 22)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
              touchAction: "manipulation",
              boxShadow: "0 0 15px oklch(0.62 0.25 22 / 0.5)",
            }}
          >
            I ACCEPT MY PUNISHMENT
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function MartialArtsSection({
  profile,
  isLoggedIn,
  onLoginClick,
}: MartialArtsSectionProps) {
  const { actor, isFetching: actorFetching } = useActorSafe();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPenalty, setShowPenalty] = useState<
    (typeof PENALTY_POOL)[number] | null
  >(null);
  const [prevLevel, setPrevLevel] = useState<number | null>(null);
  const [levelUpFlash, setLevelUpFlash] = useState(false);
  const [xpFloat, setXpFloat] = useState<number | null>(null);
  const penaltyAppliedRef = useRef(false);

  const martialXP = profile?.martialArtsXP ?? 0n;
  const martialLevel = getMartialArtsLevel(martialXP);
  const { current, needed } = getMartialXPForNextLevel(martialXP);
  const levelPct = Math.min((current / needed) * 100, 100);
  const countdown = useCountdownToMidnight();

  const todayKey = getTodayKey();
  const dailyTask = useMemo(
    () => getDailyTask(martialLevel, todayKey),
    [martialLevel, todayKey],
  );

  // Check if today's task is already completed
  const taskMissionId = `martial_daily_${todayKey}`;
  const isCompleted =
    profile?.completedMissions?.includes(taskMissionId) ?? false;

  // Check if YESTERDAY's task was missed → penalty
  const yesterdayKey = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }, []);
  const yesterdayMissionId = `martial_daily_${yesterdayKey}`;
  const yesterdayMissed =
    isLoggedIn &&
    profile &&
    !profile.completedMissions?.includes(yesterdayMissionId) &&
    Number(profile.martialArtsXP) > 0; // only penalise if they've trained before

  // Apply penalty once when profile loads and yesterday was missed
  useEffect(() => {
    if (!yesterdayMissed || penaltyAppliedRef.current || !actor || !isLoggedIn)
      return;
    penaltyAppliedRef.current = true;

    const penaltyAttempt = Math.floor(Date.now() / 86_400_000); // changes daily
    const penalty = getRandomPenalty(todayKey, penaltyAttempt);

    (async () => {
      try {
        await actor.applySelfPenalty(BigInt(penalty.xp));
        await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
        setShowPenalty(penalty);
      } catch {
        // silent — don't spam user
      }
    })();
  }, [yesterdayMissed, actor, isLoggedIn, todayKey, queryClient]);

  // Level-up detection
  // biome-ignore lint/correctness/useExhaustiveDependencies: prevLevel is a ref-like tracker
  useEffect(() => {
    if (prevLevel !== null && martialLevel > prevLevel) {
      setLevelUpFlash(true);
      setTimeout(() => setLevelUpFlash(false), 1500);
      toast.success(`🥋 Martial Arts Level Up! Now Level ${martialLevel}!`);
    }
    setPrevLevel(martialLevel);
  }, [martialLevel]);

  const handleComplete = async () => {
    setShowConfirm(false);
    if (!actor) {
      toast.error("Not connected. Please wait and try again.");
      return;
    }
    setSaving(true);
    try {
      await actor.completeMission(
        taskMissionId,
        "martial",
        BigInt(dailyTask.xp),
      );
      await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });

      // Floating XP
      setXpFloat(dailyTask.xp);
      setTimeout(() => setXpFloat(null), 2000);

      toast.success(`🥋 Daily Training Complete! +${dailyTask.xp} XP`, {
        description: `RYU: "Shaabaash! Aaj ka kaam poora hua."`,
      });
    } catch {
      toast.error("Failed to record training. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
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

      {showConfirm && (
        <ConfirmOverlay
          task={dailyTask}
          onConfirm={handleComplete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showPenalty && (
        <PenaltyOverlay
          penalty={showPenalty}
          onClose={() => setShowPenalty(null)}
        />
      )}

      {/* Floating XP */}
      {xpFloat !== null && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 600,
            pointerEvents: "none",
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "2.5rem",
            color: "oklch(0.82 0.18 85)",
            textShadow: "0 0 20px oklch(0.82 0.18 85)",
            animation: "floatUp 2s ease-out forwards",
          }}
        >
          +{xpFloat} XP
        </div>
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
        {/* Grid bg */}
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
              <Swords size={12} style={{ color: "oklch(0.62 0.22 295)" }} />
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

          {/* Main grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "360px 1fr",
              gap: "2rem",
              alignItems: "start",
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            {/* Left: Trainer card + stats */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Trainer portrait */}
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

              {/* Stats card */}
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
                    data-ocid="martial.login.button"
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

            {/* Right: Daily task */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Section label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
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
                  ◆ TODAY'S DAILY TASK
                </div>
                {/* Countdown */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.25rem 0.6rem",
                    background: "oklch(0.62 0.25 22 / 0.08)",
                    border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                    borderRadius: "6px",
                  }}
                >
                  <Clock size={11} style={{ color: "oklch(0.62 0.25 22)" }} />
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "oklch(0.62 0.25 22)",
                      letterSpacing: "0.05em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {countdown}
                  </span>
                </div>
              </div>

              {/* Penalty warning banner */}
              {isLoggedIn && yesterdayMissed && !showPenalty && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "oklch(0.62 0.25 22 / 0.08)",
                    border: "1px solid oklch(0.62 0.25 22 / 0.4)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <AlertTriangle
                    size={14}
                    style={{ color: "oklch(0.62 0.25 22)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.73rem",
                      color: "oklch(0.65 0.04 20)",
                      lineHeight: 1.4,
                    }}
                  >
                    <strong style={{ color: "oklch(0.75 0.15 22)" }}>
                      Yesterday's mission was missed.
                    </strong>{" "}
                    Penalty was applied.
                  </span>
                </div>
              )}

              {/* Task card */}
              <div
                style={{
                  padding: "2rem",
                  background: isCompleted
                    ? "oklch(0.08 0.012 145 / 0.8)"
                    : "oklch(0.1 0.015 260 / 0.8)",
                  border: `2px solid ${isCompleted ? "oklch(0.62 0.22 145 / 0.5)" : "oklch(0.62 0.22 295 / 0.4)"}`,
                  borderRadius: "14px",
                  backdropFilter: "blur(10px)",
                  boxShadow: isCompleted
                    ? "0 0 30px oklch(0.62 0.22 145 / 0.1)"
                    : "0 0 30px oklch(0.62 0.22 295 / 0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Completed banner */}
                {isCompleted && (
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.3rem 0.75rem",
                      background: "oklch(0.62 0.22 145 / 0.15)",
                      border: "1px solid oklch(0.62 0.22 145 / 0.4)",
                      borderRadius: "100px",
                    }}
                  >
                    <CheckCircle2
                      size={12}
                      style={{ color: "oklch(0.62 0.22 145)" }}
                    />
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        color: "oklch(0.62 0.22 145)",
                      }}
                    >
                      COMPLETED
                    </span>
                  </div>
                )}

                {/* Task icon + info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "14px",
                      background: isCompleted
                        ? "oklch(0.62 0.22 145 / 0.1)"
                        : "oklch(0.62 0.22 295 / 0.1)",
                      border: `1px solid ${isCompleted ? "oklch(0.62 0.22 145 / 0.3)" : "oklch(0.62 0.22 295 / 0.3)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.2rem",
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? "✅" : dailyTask.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        letterSpacing: "0.06em",
                        color: isCompleted
                          ? "oklch(0.62 0.22 145)"
                          : "oklch(0.9 0.02 260)",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      {dailyTask.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.83rem",
                        color: "oklch(0.6 0.04 260)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {dailyTask.desc}
                    </p>
                  </div>
                </div>

                {/* XP reward + deadline row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.35rem 0.9rem",
                      background: "oklch(0.82 0.18 85 / 0.1)",
                      border: "1px solid oklch(0.82 0.18 85 / 0.3)",
                      borderRadius: "8px",
                    }}
                  >
                    <Zap size={13} style={{ color: "oklch(0.82 0.18 85)" }} />
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "oklch(0.82 0.18 85)",
                      }}
                    >
                      +{dailyTask.xp} XP
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.35rem 0.9rem",
                      background: "oklch(0.62 0.25 22 / 0.08)",
                      border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                      borderRadius: "8px",
                    }}
                  >
                    <Skull size={13} style={{ color: "oklch(0.62 0.25 22)" }} />
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.72rem",
                        color: "oklch(0.65 0.06 22)",
                        fontWeight: 600,
                      }}
                    >
                      Miss = XP PENALTY
                    </span>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.65rem",
                      color: "oklch(0.45 0.04 260)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    RESETS IN {countdown}
                  </div>
                </div>

                {/* Action button */}
                {isLoggedIn ? (
                  <button
                    type="button"
                    data-ocid="martial.daily_task.button"
                    disabled={isCompleted || saving || actorFetching}
                    onClick={() => {
                      if (!actor) {
                        toast.error("Connecting... please wait.");
                        return;
                      }
                      setShowConfirm(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      background: isCompleted
                        ? "oklch(0.12 0.015 145)"
                        : saving || actorFetching
                          ? "oklch(0.18 0.02 295)"
                          : "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.55 0.22 320) 100%)",
                      border: `1px solid ${isCompleted ? "oklch(0.35 0.1 145 / 0.4)" : "oklch(0.72 0.22 295 / 0.5)"}`,
                      borderRadius: "10px",
                      color: isCompleted
                        ? "oklch(0.62 0.22 145)"
                        : saving || actorFetching
                          ? "oklch(0.5 0.06 295)"
                          : "white",
                      fontFamily: '"Sora", sans-serif',
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor:
                        isCompleted || saving || actorFetching
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.2s ease",
                      minHeight: "54px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      touchAction: "manipulation",
                      WebkitTapHighlightColor: "transparent",
                      boxShadow:
                        isCompleted || saving || actorFetching
                          ? "none"
                          : "0 0 20px oklch(0.62 0.22 295 / 0.4)",
                    }}
                  >
                    {saving || actorFetching ? (
                      <>
                        <Loader2
                          size={16}
                          style={{ animation: "spin 1s linear infinite" }}
                        />{" "}
                        Saving...
                      </>
                    ) : isCompleted ? (
                      <>
                        <CheckCircle2 size={16} /> MISSION COMPLETE — COME BACK
                        TOMORROW
                      </>
                    ) : (
                      "🥋 COMPLETE DAILY TRAINING"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    data-ocid="martial.login_to_train.button"
                    onClick={onLoginClick}
                    className="btn-neon-red"
                    style={{
                      width: "100%",
                      padding: "1rem",
                      fontSize: "0.85rem",
                      borderRadius: "10px",
                      cursor: "pointer",
                      minHeight: "54px",
                      touchAction: "manipulation",
                    }}
                  >
                    ⚡ LOGIN TO TRAIN
                  </button>
                )}
              </div>

              {/* How penalties work info card */}
              <div
                style={{
                  padding: "1.25rem",
                  background: "oklch(0.08 0.01 260 / 0.6)",
                  border: "1px solid oklch(0.3 0.04 260 / 0.3)",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    color: "oklch(0.5 0.04 260)",
                    marginBottom: "0.75rem",
                  }}
                >
                  ⚔️ THE WARRIOR'S CODE
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {[
                    {
                      icon: "🔄",
                      text: "New task appears every day at midnight",
                    },
                    {
                      icon: "⬆️",
                      text: "Task difficulty scales with your level",
                    },
                    {
                      icon: "💀",
                      text: "Miss a day = random penalty + XP loss",
                    },
                    {
                      icon: "🏆",
                      text: "Complete streak = bonus XP multiplier",
                    },
                  ].map((item) => (
                    <div
                      key={item.text}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                      }}
                    >
                      <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.75rem",
                          color: "oklch(0.55 0.04 260)",
                        }}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
