import { MissionConfirmModal } from "@/components/MissionConfirmModal";
import { useActorSafe } from "@/hooks/useActorSafe";
import {
  type MissionDef,
  type MissionTier,
  getScaledMissions,
  getSpecialMissions,
} from "@/utils/missionData";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Clock,
  Flame,
  Loader2,
  ShieldAlert,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Anti-cheat constants ────────────────────────────────────────────────────
const BEAST_MISSION_ATTEMPTS_KEY = "beast_mission_attempts";
const BEAST_SESSION_COMPLETIONS_KEY = "beast_session_completions";
const MAX_COMPLETIONS_PER_SESSION = 20;
const MIN_SECONDS_BETWEEN_SAME_MISSION = 30;

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
  emoji: string;
  tier: string;
  trainerStats: {
    specialty: string;
    style: string;
    difficulty: string;
  };
}

const TRAINERS: TrainerData[] = [
  {
    id: "kira",
    name: "KIRA",
    specialty: "Fitness & Strength",
    catchphrase: "Pain is just weakness leaving your body.",
    image: "/assets/generated/trainer-kira-fitness.dim_400x600.png",
    color: "oklch(0.62 0.25 22)",
    colorDim: "oklch(0.62 0.25 22 / 0.15)",
    intro:
      "Uth jao warrior! Dard sirf kamzori ko chhod raha hai. Aaj hum lohe ki tarah ban'te hain!",
    praiseLines: [
      "Shabash! Tera sharir aur mazboot ho raha hai!",
      "Yahi hai warrior spirit! Aur karo, aur barho!",
      "Dard temporary hai, ibadat permanent hai! Ruko mat!",
    ],
    category: "fitness",
    glow: "0 0 20px oklch(0.62 0.25 22 / 0.4)",
    emoji: "💪",
    tier: "ELITE TRAINER",
    trainerStats: {
      specialty: "Fitness",
      style: "Aggressive",
      difficulty: "★★★★☆",
    },
  },
  {
    id: "ryu",
    name: "RYU",
    specialty: "Martial Arts & Combat",
    catchphrase: "A true fighter masters not just the body, but the spirit.",
    image: "/assets/generated/trainer-ryu-martial.dim_400x600.png",
    color: "oklch(0.62 0.22 295)",
    colorDim: "oklch(0.62 0.22 295 / 0.15)",
    intro:
      "Sachcha yoddha sirf sharir nahi, aatma bhi master karta hai. Aaj dono seekhenge.",
    praiseLines: [
      "Teri technique sudhar rahi hai. Yoddha ka rasta khul raha hai.",
      "Zabardast! Tujhme ek asli fighter ka dil hai.",
      "Teri aatma mein sachcha yoddha ka josh hai!",
    ],
    category: "martial",
    glow: "0 0 20px oklch(0.62 0.22 295 / 0.4)",
    emoji: "⚔️",
    tier: "MASTER TRAINER",
    trainerStats: {
      specialty: "Martial Arts",
      style: "Disciplined",
      difficulty: "★★★★★",
    },
  },
  {
    id: "nova",
    name: "NOVA",
    specialty: "Intelligence & Study",
    catchphrase: "Knowledge is the sharpest blade. Sharpen your mind daily.",
    image: "/assets/generated/trainer-nova-intel.dim_400x600.png",
    color: "oklch(0.65 0.22 250)",
    colorDim: "oklch(0.65 0.22 250 / 0.15)",
    intro:
      "Gyan sabse tez hathiyar hai. Har page, har concept tujhe andhero se bahar laata hai.",
    praiseLines: [
      "Tera dimag aur tez ho raha hai! Seekhte raho!",
      "Brilliant! Gyan roz compound hota hai.",
      "Ek tez dimag teri sabse badi taakat hai!",
    ],
    category: "intelligence",
    glow: "0 0 20px oklch(0.65 0.22 250 / 0.4)",
    emoji: "🧠",
    tier: "ELITE TRAINER",
    trainerStats: {
      specialty: "Intelligence",
      style: "Strategic",
      difficulty: "★★★☆☆",
    },
  },
  {
    id: "zen",
    name: "ZEN",
    specialty: "Focus & Meditation",
    catchphrase: "The calm before the storm — find your center, then unleash.",
    image: "/assets/generated/trainer-zen-focus.dim_400x600.png",
    color: "oklch(0.82 0.18 85)",
    colorDim: "oklch(0.82 0.18 85 / 0.15)",
    intro:
      "Toofan se pehle ki shanti - apna kendra dhundho, phir poori taakat se unleash karo.",
    praiseLines: [
      "Teri andar ki shanti mazboot ho rahi hai. Yahi sacchai hai.",
      "Shandar! Shant dimaag hi sashakt dimaag hota hai.",
      "Tu andar ki khamoshi tak pahunch gaya. Yahi asli taakat hai.",
    ],
    category: "focus",
    glow: "0 0 20px oklch(0.82 0.18 85 / 0.4)",
    emoji: "🧘",
    tier: "MASTER TRAINER",
    trainerStats: {
      specialty: "Meditation",
      style: "Serene",
      difficulty: "★★★☆☆",
    },
  },
  {
    id: "vega",
    name: "VEGA",
    specialty: "Discipline & Willpower",
    catchphrase:
      "Discipline is choosing what you want most over what you want now.",
    image: "/assets/generated/trainer-vega-discipline.dim_400x600.png",
    color: "oklch(0.68 0.22 310)",
    colorDim: "oklch(0.68 0.22 310 / 0.15)",
    intro:
      "Discipline woh hai jo tum abhi chahte ho uski jagah jo tum sabse zyada chahte ho chunna. Samajhdaari se chuno.",
    praiseLines: [
      "Lohe jaisi discipline. Tu ek toodnewala iraada bana raha hai.",
      "Aaj ki har qurbani kal ki legend banati hai.",
      "Zabardast! Discipline hi azaadi hai.",
    ],
    category: "discipline",
    glow: "0 0 20px oklch(0.68 0.22 310 / 0.4)",
    emoji: "🛡️",
    tier: "ELITE TRAINER",
    trainerStats: {
      specialty: "Discipline",
      style: "Relentless",
      difficulty: "★★★★☆",
    },
  },
  {
    id: "apex",
    name: "APEX",
    specialty: "Mindset & Motivation",
    catchphrase: "Your mind is your greatest weapon. Master it.",
    image: "/assets/generated/trainer-apex-mindset.dim_400x600.png",
    color: "oklch(0.72 0.2 45)",
    colorDim: "oklch(0.72 0.2 45 / 0.15)",
    intro:
      "Tera dimag tera sabse bada hathiyar hai. Ise master kar lo - koi nahi rok sakta tujhe.",
    praiseLines: [
      "Tera soch badal raha hai. Tu anrukable ban raha hai!",
      "Yahi hai champion ki soch. Aage badh!",
      "Teri beliefs teri reality hai. Tu ek acchi duniya bana raha hai!",
    ],
    category: "mindset",
    glow: "0 0 20px oklch(0.72 0.2 45 / 0.4)",
    emoji: "⚡",
    tier: "LEGEND TRAINER",
    trainerStats: {
      specialty: "Mindset",
      style: "Explosive",
      difficulty: "★★★★★",
    },
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
  const [imgError, setImgError] = useState(false);

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
        border: `1px solid ${trainer.color.replace(")", " / 0.35)")}`,
        background: "oklch(0.08 0.015 260)",
        transition: "all 0.35s ease",
        height: "420px",
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        padding: 0,
        width: "100%",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-8px) scale(1.01)";
        el.style.boxShadow = `${trainer.glow}, 0 0 0 1px ${trainer.color.replace(")", " / 0.6)")}`;
        el.style.borderColor = trainer.color.replace(")", " / 0.8)");
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0) scale(1)";
        el.style.boxShadow = "none";
        el.style.borderColor = trainer.color.replace(")", " / 0.35)");
      }}
    >
      {/* AI TRAINER label */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 10,
          padding: "0.18rem 0.55rem",
          background: "oklch(0 0 0 / 0.75)",
          border: "1px solid oklch(0.62 0.25 22 / 0.6)",
          borderRadius: "100px",
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "oklch(0.62 0.25 22)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
        }}
      >
        <Sparkles size={8} style={{ color: "oklch(0.62 0.25 22)" }} />
        AI TRAINER
      </div>

      {/* Tier badge */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
          padding: "0.18rem 0.55rem",
          background: trainer.colorDim,
          border: `1px solid ${trainer.color.replace(")", " / 0.5)")}`,
          borderRadius: "100px",
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.52rem",
          fontWeight: 800,
          letterSpacing: "0.12em",
          color: trainer.color,
          backdropFilter: "blur(6px)",
        }}
      >
        {trainer.tier}
      </div>

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {imgError ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `radial-gradient(ellipse at 50% 30%, ${trainer.color.replace(")", " / 0.25)")} 0%, oklch(0.08 0.015 260) 70%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "5rem",
            }}
          >
            {trainer.emoji}
          </div>
        ) : (
          <img
            src={trainer.image}
            alt={trainer.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              filter: "contrast(1.05) saturate(1.15) brightness(0.95)",
            }}
            onError={() => setImgError(true)}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, transparent 35%, ${trainer.color.replace(")", " / 0.2)")} 75%, oklch(0.08 0.015 260) 100%)`,
          }}
        />
        {/* Shimmer overlay on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              ${trainer.color.replace(")", " / 0.03)")} 10px,
              ${trainer.color.replace(")", " / 0.03)")} 11px
            )`,
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        style={{
          padding: "1.1rem 1.25rem 1.25rem",
          background: "oklch(0.08 0.015 260)",
          borderTop: `1px solid ${trainer.color.replace(")", " / 0.2)")}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "0.2rem",
          }}
        >
          <span style={{ fontSize: "1rem" }}>{trainer.emoji}</span>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "1.25rem",
              letterSpacing: "0.12em",
              color: trainer.color,
              textShadow: `0 0 10px ${trainer.color.replace(")", " / 0.6)")}`,
            }}
          >
            {trainer.name}
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            padding: "0.18rem 0.55rem",
            background: trainer.colorDim,
            border: `1px solid ${trainer.color.replace(")", " / 0.3)")}`,
            borderRadius: "100px",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: trainer.color,
            marginBottom: "0.55rem",
          }}
        >
          {trainer.specialty}
        </div>
        <p
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.68rem",
            color: "oklch(0.58 0.03 260)",
            fontStyle: "italic",
            lineHeight: 1.4,
            margin: "0 0 0.7rem",
          }}
        >
          "{trainer.catchphrase}"
        </p>
        <div
          style={{
            padding: "0.45rem 1rem",
            background: trainer.colorDim,
            border: `1px solid ${trainer.color.replace(")", " / 0.45)")}`,
            borderRadius: "6px",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: trainer.color,
            textAlign: "center",
            textTransform: "uppercase",
            boxShadow: `0 0 8px ${trainer.color.replace(")", " / 0.15)")}`,
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
  const { actor, isFetching: actorFetching } = useActorSafe();
  const queryClient = useQueryClient();
  const [completing, setCompleting] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState(trainer.intro);
  const [displayedDialogue, setDisplayedDialogue] = useState("");
  const [floaters, setFloaters] = useState<XPFloater[]>([]);
  const [activeTier, setActiveTier] = useState<MissionTier>("daily");
  const [imgError, setImgError] = useState(false);
  const floaterIdRef = useRef(0);

  // Anti-cheat: pending confirm
  const [pendingMission, setPendingMission] = useState<MissionDef | null>(null);
  const [pendingIsSpecial, setPendingIsSpecial] = useState(false);

  // Anti-cheat: cooldown
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [cooldownSecs, setCooldownSecs] = useState(0);

  // Rate limiting: completions per session
  const completionTimestampsRef = useRef<number[]>([]);

  // Daily reset countdown
  const [resetCountdown, setResetCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setResetCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cooldown countdown ticker
  useEffect(() => {
    if (cooldownUntil <= 0) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCooldownSecs(0);
        setCooldownUntil(0);
        clearInterval(interval);
      } else {
        setCooldownSecs(remaining);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  // Mission progress today
  const dailyMissions = getScaledMissions(trainer.id, "daily", playerLevel);
  const todayCompleted = dailyMissions.filter((m) =>
    completedMissions.includes(m.id),
  ).length;

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

  const weeklyMissions = getScaledMissions(trainer.id, "weekly", playerLevel);
  const monthlyMissions = getScaledMissions(trainer.id, "monthly", playerLevel);
  const specialMissions = getSpecialMissions(playerLevel);

  const currentMissions =
    activeTier === "daily"
      ? dailyMissions
      : activeTier === "weekly"
        ? weeklyMissions
        : monthlyMissions;

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const windowMs = 60000; // 60 seconds
    const maxPerWindow = 5;
    completionTimestampsRef.current = completionTimestampsRef.current.filter(
      (t) => now - t < windowMs,
    );
    if (completionTimestampsRef.current.length >= maxPerWindow) {
      // Rate limited: add 30-second cooldown
      const cooldown = now + 30000;
      setCooldownUntil(cooldown);
      toast.warning(
        "⚠️ Slow down, warrior. Completing too many missions too quickly raises suspicion.",
        { duration: 5000 },
      );
      return false;
    }
    completionTimestampsRef.current.push(now);
    return true;
  };

  /** Check if mission was attempted too recently (timestamp anti-cheat) */
  const checkTimestampAntiCheat = (missionId: string): boolean => {
    const raw = localStorage.getItem(BEAST_MISSION_ATTEMPTS_KEY);
    const attempts: Record<string, number> = raw ? JSON.parse(raw) : {};
    const lastAttempt = attempts[missionId] ?? 0;
    const now = Date.now();
    if (now - lastAttempt < MIN_SECONDS_BETWEEN_SAME_MISSION * 1000) {
      const remaining = Math.ceil(
        (MIN_SECONDS_BETWEEN_SAME_MISSION * 1000 - (now - lastAttempt)) / 1000,
      );
      toast.error(
        `⏳ Same mission completed too recently. Wait ${remaining}s before re-attempting.`,
        { duration: 4000 },
      );
      return false;
    }
    attempts[missionId] = now;
    localStorage.setItem(BEAST_MISSION_ATTEMPTS_KEY, JSON.stringify(attempts));
    return true;
  };

  /** Check per-session mission cap */
  const checkSessionLimit = (): boolean => {
    const raw = sessionStorage.getItem(BEAST_SESSION_COMPLETIONS_KEY);
    const count = raw ? Number.parseInt(raw, 10) : 0;
    if (count >= MAX_COMPLETIONS_PER_SESSION) {
      toast.error(
        `🛑 Session limit reached (${MAX_COMPLETIONS_PER_SESSION} missions). Rest and come back tomorrow.`,
        { duration: 6000 },
      );
      return false;
    }
    sessionStorage.setItem(BEAST_SESSION_COMPLETIONS_KEY, String(count + 1));
    return true;
  };

  const executeMissionComplete = async (
    mission: MissionDef,
    isSpecial: boolean,
  ) => {
    if (!actor || completing) return;
    if (cooldownUntil > Date.now()) {
      toast.error(`⏳ Cooldown active. Wait ${cooldownSecs}s.`);
      return;
    }

    if (!checkTimestampAntiCheat(mission.id)) return;
    if (!checkSessionLimit()) return;
    if (!checkRateLimit()) return;

    setCompleting(mission.id);
    // 3-second cooldown after this completion
    setCooldownUntil(Date.now() + 3000);

    try {
      await actor.completeMission(
        mission.id,
        mission.category,
        BigInt(mission.xp),
      );
      await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
      if (!isSpecial) {
        await queryClient.invalidateQueries({
          queryKey: ["missionCompletions"],
        });
      }

      const floaterId = floaterIdRef.current++;
      setFloaters((prev) => [
        ...prev,
        { id: floaterId, xp: mission.xp, x: 50 },
      ]);
      setTimeout(
        () => setFloaters((prev) => prev.filter((f) => f.id !== floaterId)),
        isSpecial ? 2000 : 1500,
      );

      if (!isSpecial) {
        const praise =
          trainer.praiseLines[
            Math.floor(Math.random() * trainer.praiseLines.length)
          ];
        setDialogue(praise ?? trainer.intro);
        toast.success(`+${mission.xp} XP earned! Mission complete!`, {
          description: mission.name,
        });
      } else {
        toast.success(`⚡ SPECIAL MISSION COMPLETE! +${mission.xp} XP!`, {
          description: mission.name,
          duration: 5000,
        });
      }
    } catch {
      toast.error("Failed to complete mission. Try again.");
    } finally {
      setCompleting(null);
    }
  };

  const handleComplete = (mission: MissionDef) => {
    // Silently ignore button press while actor is still connecting
    if (!actor || actorFetching) return;
    if (completing) return;
    if (completedMissions.includes(mission.id)) return;
    if (cooldownUntil > Date.now()) {
      toast.error(`⏳ Cooldown active. Wait ${cooldownSecs}s.`);
      return;
    }
    setPendingMission(mission);
    setPendingIsSpecial(false);
  };

  const handleSpecialComplete = (mission: MissionDef) => {
    // Silently ignore button press while actor is still connecting
    if (!actor || actorFetching) return;
    if (completing) return;
    if (completedMissions.includes(mission.id)) return;
    if (cooldownUntil > Date.now()) {
      toast.error(`⏳ Cooldown active. Wait ${cooldownSecs}s.`);
      return;
    }
    setPendingMission(mission);
    setPendingIsSpecial(true);
  };

  const handleConfirmMission = () => {
    if (!pendingMission) return;
    const mission = pendingMission;
    const isSpecial = pendingIsSpecial;
    setPendingMission(null);
    setPendingIsSpecial(false);
    void executeMissionComplete(mission, isSpecial);
  };

  const handleCancelMission = () => {
    setPendingMission(null);
    setPendingIsSpecial(false);
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
        {/* Mission Confirm Modal */}
        {pendingMission && (
          <MissionConfirmModal
            mission={pendingMission}
            trainerName={trainer.name}
            trainerColor={trainer.color}
            onConfirm={handleConfirmMission}
            onCancel={handleCancelMission}
          />
        )}

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
            {imgError ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "300px",
                  background: `radial-gradient(ellipse at 50% 30%, ${trainer.color.replace(")", " / 0.3)")} 0%, oklch(0.06 0.01 260) 70%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "6rem",
                }}
              >
                {trainer.emoji}
              </div>
            ) : (
              <img
                src={trainer.image}
                alt={trainer.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
                onError={() => setImgError(true)}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, oklch(0.09 0.015 260) 0%, ${trainer.color.replace(")", " / 0.15)")} 50%, transparent 100%)`,
              }}
            />
            {/* Shimmer/particle overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `radial-gradient(circle at 30% 20%, ${trainer.color.replace(")", " / 0.12)")} 0%, transparent 50%),
                  radial-gradient(circle at 75% 65%, ${trainer.color.replace(")", " / 0.08)")} 0%, transparent 40%)`,
                pointerEvents: "none",
                animation: "neonPulse 3s ease-in-out infinite",
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
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "0.2rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{trainer.emoji}</span>
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

              {/* Trainer intro stats */}
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.55rem 0.75rem",
                  background: "oklch(0.06 0.01 260 / 0.85)",
                  border: `1px solid ${trainer.color.replace(")", " / 0.25)")}`,
                  borderRadius: "6px",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.6rem",
                  color: "oklch(0.55 0.04 260)",
                  lineHeight: 1.8,
                }}
              >
                <div>
                  <span style={{ color: "oklch(0.45 0.03 260)" }}>
                    Specialty:{" "}
                  </span>
                  <span style={{ color: trainer.color, fontWeight: 600 }}>
                    {trainer.trainerStats.specialty}
                  </span>
                </div>
                <div>
                  <span style={{ color: "oklch(0.45 0.03 260)" }}>Style: </span>
                  <span
                    style={{ color: "oklch(0.75 0.03 260)", fontWeight: 600 }}
                  >
                    {trainer.trainerStats.style}
                  </span>
                </div>
                <div>
                  <span style={{ color: "oklch(0.45 0.03 260)" }}>
                    Difficulty:{" "}
                  </span>
                  <span
                    style={{ color: "oklch(0.82 0.18 85)", fontWeight: 600 }}
                  >
                    {trainer.trainerStats.difficulty}
                  </span>
                </div>
              </div>

              {/* Level info */}
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "0.4rem 0.75rem",
                  background: "oklch(0.06 0.01 260 / 0.8)",
                  border: `1px solid ${trainer.color.replace(")", " / 0.2)")}`,
                  borderRadius: "6px",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.62rem",
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
                {trainer.name} KAH RAHA HAI:
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

            {/* Anti-cheat honor code banner */}
            <div
              style={{
                padding: "0.55rem 0.85rem",
                background: "oklch(0.62 0.25 22 / 0.06)",
                border: "1px solid oklch(0.62 0.25 22 / 0.22)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ShieldAlert
                size={12}
                style={{ color: "oklch(0.62 0.25 22)", flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.62rem",
                  color: "oklch(0.6 0.04 260)",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: "oklch(0.62 0.25 22)", fontWeight: 700 }}>
                  ⚠️ HONOR CODE:
                </span>{" "}
                Complete missions for real. The system tracks your progress over
                time.
              </span>
            </div>

            {/* Mission progress + daily reset */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.65rem",
                  background: "oklch(0.12 0.02 260)",
                  border: "1px solid oklch(0.25 0.03 260 / 0.5)",
                  borderRadius: "100px",
                }}
              >
                <CheckCircle size={11} style={{ color: trainer.color }} />
                <span
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: trainer.color,
                    letterSpacing: "0.06em",
                  }}
                >
                  {todayCompleted}/{dailyMissions.length} today
                </span>
              </div>
              {resetCountdown && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.25rem 0.65rem",
                    background: "oklch(0.1 0.015 260)",
                    border: "1px solid oklch(0.22 0.02 260 / 0.4)",
                    borderRadius: "100px",
                  }}
                >
                  <Clock size={11} style={{ color: "oklch(0.5 0.04 260)" }} />
                  <span
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "0.62rem",
                      color: "oklch(0.5 0.04 260)",
                    }}
                  >
                    Resets in {resetCountdown}
                  </span>
                </div>
              )}
              {cooldownSecs > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.25rem 0.65rem",
                    background: "oklch(0.62 0.25 22 / 0.08)",
                    border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                    borderRadius: "100px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.62rem",
                      color: "oklch(0.62 0.25 22)",
                      fontWeight: 700,
                    }}
                  >
                    ⏳ {cooldownSecs}s cooldown
                  </span>
                </div>
              )}
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
                            disabled={!actor || actorFetching || !!completing}
                            style={{
                              padding: "0.4rem 0.75rem",
                              background:
                                !actor || actorFetching
                                  ? "oklch(0.15 0.015 260)"
                                  : completing === mission.id
                                    ? "oklch(0.18 0.02 260)"
                                    : "oklch(0.82 0.18 85 / 0.2)",
                              border: `1px solid ${!actor || actorFetching ? "oklch(0.3 0.02 260 / 0.5)" : "oklch(0.82 0.18 85 / 0.6)"}`,
                              borderRadius: "4px",
                              color:
                                !actor || actorFetching
                                  ? "oklch(0.45 0.03 260)"
                                  : "oklch(0.9 0.15 85)",
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              cursor:
                                !actor || actorFetching || !!completing
                                  ? "not-allowed"
                                  : "pointer",
                              transition: "all 0.2s ease",
                              touchAction: "manipulation",
                              WebkitTapHighlightColor: "transparent",
                              minHeight: "44px",
                              minWidth: "90px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.3rem",
                            }}
                          >
                            {completing === mission.id || actorFetching ? (
                              <Loader2
                                size={10}
                                style={{
                                  animation: "spin 1s linear infinite",
                                }}
                              />
                            ) : (
                              "COMPLETE"
                            )}
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
                              padding: "0.35rem 0.75rem",
                              background: `${trainer.color.replace(")", " / 0.1)")}`,
                              border: `1px solid ${trainer.color.replace(")", " / 0.4)")}`,
                              borderRadius: "4px",
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              color: trainer.color,
                              minHeight: "44px",
                              minWidth: "90px",
                              justifyContent: "center",
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
                            disabled={
                              !actor ||
                              actorFetching ||
                              !!completing ||
                              cooldownSecs > 0
                            }
                            style={{
                              padding: "0.45rem 0.85rem",
                              background:
                                !actor || actorFetching
                                  ? "oklch(0.14 0.015 260)"
                                  : isCompletingThis
                                    ? "oklch(0.18 0.02 260)"
                                    : cooldownSecs > 0
                                      ? "oklch(0.62 0.25 22 / 0.15)"
                                      : `linear-gradient(135deg, ${trainer.color} 0%, ${trainer.color.replace(")", " / 0.8)")})`,
                              border: `1px solid ${!actor || actorFetching ? "oklch(0.28 0.02 260 / 0.5)" : cooldownSecs > 0 ? "oklch(0.62 0.25 22 / 0.4)" : trainer.color.replace(")", " / 0.6)")}`,
                              borderRadius: "6px",
                              color:
                                !actor || actorFetching
                                  ? "oklch(0.45 0.03 260)"
                                  : isCompletingThis
                                    ? "oklch(0.5 0.03 260)"
                                    : "oklch(0.98 0 0)",
                              fontFamily: '"Sora", sans-serif',
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              cursor:
                                !actor ||
                                actorFetching ||
                                !!completing ||
                                cooldownSecs > 0
                                  ? "not-allowed"
                                  : "pointer",
                              transition: "all 0.2s ease",
                              touchAction: "manipulation",
                              WebkitTapHighlightColor: "transparent",
                              minHeight: "44px",
                              minWidth: "90px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.35rem",
                              boxShadow:
                                !completing &&
                                actor &&
                                !actorFetching &&
                                cooldownSecs === 0
                                  ? `0 0 10px ${trainer.color.replace(")", " / 0.45)")}`
                                  : "none",
                            }}
                          >
                            {isCompletingThis || actorFetching ? (
                              <Loader2
                                size={12}
                                style={{
                                  animation: "spin 1s linear infinite",
                                }}
                              />
                            ) : cooldownSecs > 0 ? (
                              `⏳ ${cooldownSecs}s`
                            ) : (
                              "COMPLETE"
                            )}
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

      {/* Trainer panel modal — key forces full remount when trainer changes */}
      {activeTrainer && (
        <TrainerPanel
          key={activeTrainer.id}
          trainer={activeTrainer}
          completedMissions={completedMissions}
          playerLevel={playerLevel}
          onClose={() => setActiveTrainer(null)}
        />
      )}
    </section>
  );
}
