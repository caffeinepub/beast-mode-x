import { useAuth } from "@/components/auth/AuthProvider";
import { useActor } from "@/hooks/useActor";
import { useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  CameraOff,
  Dumbbell,
  FlipHorizontal,
  Plus,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── TypeScript global ──────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Pose: any;
  }
}

// ─── MediaPipe landmark names ───────────────────────────────────────────────
const MEDIAPIPE_LANDMARK_NAMES = [
  "nose",
  "left_eye_inner",
  "left_eye",
  "left_eye_outer",
  "right_eye_inner",
  "right_eye",
  "right_eye_outer",
  "left_ear",
  "right_ear",
  "mouth_left",
  "mouth_right",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_pinky",
  "right_pinky",
  "left_index",
  "right_index",
  "left_thumb",
  "right_thumb",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
  "left_heel",
  "right_heel",
  "left_foot_index",
  "right_foot_index",
];

// ─── Types ─────────────────────────────────────────────────────────────────
interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

interface Pose {
  keypoints: Keypoint[];
  score?: number;
}

type ExerciseType = "pushup" | "squat" | "situp" | "jumpingjack" | "detecting";

interface ExerciseState {
  type: ExerciseType;
  reps: number;
  phase: "up" | "down" | "neutral";
  lastAngle: number;
}

interface SessionStats {
  pushups: number;
  squats: number;
  situps: number;
  jumpingjacks: number;
  duration: number;
  xpEarned: number;
}

// ─── Angle helpers ──────────────────────────────────────────────────────────
function angleBetween(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

function getKeypoint(pose: Pose, name: string): Keypoint | null {
  const kp = pose.keypoints.find((k) => k.name === name);
  if (!kp || (kp.score !== undefined && kp.score < 0.3)) return null;
  return kp;
}

// ─── Skeleton drawing ───────────────────────────────────────────────────────
const SKELETON_CONNECTIONS = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
  ["left_ear", "left_shoulder"],
  ["right_ear", "right_shoulder"],
];

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  pose: Pose,
  width: number,
  height: number,
) {
  const kpMap = new Map<string, Keypoint>();
  for (const kp of pose.keypoints) {
    if (kp.name) kpMap.set(kp.name, kp);
  }

  // Draw connections
  ctx.lineWidth = 3;
  for (const [a, b] of SKELETON_CONNECTIONS) {
    const pa = kpMap.get(a);
    const pb = kpMap.get(b);
    if (!pa || !pb) continue;
    if ((pa.score ?? 1) < 0.25 || (pb.score ?? 1) < 0.25) continue;

    const x1 = pa.x * width;
    const y1 = pa.y * height;
    const x2 = pb.x * width;
    const y2 = pb.y * height;

    ctx.strokeStyle = "rgba(180,50,255,0.85)";
    ctx.shadowColor = "rgba(180,50,255,0.6)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Draw keypoints
  for (const kp of pose.keypoints) {
    if ((kp.score ?? 1) < 0.25) continue;
    const x = kp.x * width;
    const y = kp.y * height;
    ctx.fillStyle = "rgba(255,60,60,1)";
    ctx.shadowColor = "rgba(255,60,60,0.8)";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
}

// ─── Exercise detection logic ────────────────────────────────────────────────
function detectExercise(
  pose: Pose,
  exerciseState: ExerciseState,
): {
  type: ExerciseType;
  repAdded: boolean;
  newPhase: "up" | "down" | "neutral";
  angle: number;
} {
  // Push-up detection: left/right elbow angle
  const leftShoulder = getKeypoint(pose, "left_shoulder");
  const leftElbow = getKeypoint(pose, "left_elbow");
  const leftWrist = getKeypoint(pose, "left_wrist");
  const rightShoulder = getKeypoint(pose, "right_shoulder");
  const rightElbow = getKeypoint(pose, "right_elbow");
  const rightWrist = getKeypoint(pose, "right_wrist");

  // Squat: hip-knee-ankle
  const leftHip = getKeypoint(pose, "left_hip");
  const leftKnee = getKeypoint(pose, "left_knee");
  const leftAnkle = getKeypoint(pose, "left_ankle");

  // Sit-up: shoulder-hip-knee angle
  const rightHip = getKeypoint(pose, "right_hip");
  const rightKnee = getKeypoint(pose, "right_knee");

  // Jumping jack: wrist vs shoulder height
  const leftWristJJ = getKeypoint(pose, "left_wrist");
  const rightWristJJ = getKeypoint(pose, "right_wrist");

  // Compute angles
  let pushupAngle = -1;
  if (leftShoulder && leftElbow && leftWrist) {
    pushupAngle = angleBetween(leftShoulder, leftElbow, leftWrist);
  } else if (rightShoulder && rightElbow && rightWrist) {
    pushupAngle = angleBetween(rightShoulder, rightElbow, rightWrist);
  }

  let squatAngle = -1;
  if (leftHip && leftKnee && leftAnkle) {
    squatAngle = angleBetween(leftHip, leftKnee, leftAnkle);
  }

  let situpAngle = -1;
  if (leftShoulder && leftHip && leftKnee) {
    situpAngle = angleBetween(leftShoulder, leftHip, leftKnee);
  } else if (rightShoulder && rightHip && rightKnee) {
    situpAngle = angleBetween(rightShoulder, rightHip, rightKnee);
  }

  // Determine what exercise is most likely based on body position
  // and which angles are in exercise range
  const pushupActive = pushupAngle > 0 && pushupAngle < 160;
  const squatActive = squatAngle > 0 && squatAngle < 170;
  const situpActive = situpAngle > 0 && situpAngle < 130;

  // Jumping jack: wrists above shoulders
  let jjActive = false;
  if (leftWristJJ && leftShoulder && rightWristJJ && rightShoulder) {
    jjActive =
      leftWristJJ.y < leftShoulder.y || rightWristJJ.y < rightShoulder.y;
  }

  // Determine exercise type
  let detectedType: ExerciseType = "detecting";
  let activeAngle = -1;

  if (exerciseState.type !== "detecting") {
    // Stick with current exercise if angle is still in range
    detectedType = exerciseState.type;
    if (detectedType === "pushup") activeAngle = pushupAngle;
    else if (detectedType === "squat") activeAngle = squatAngle;
    else if (detectedType === "situp") activeAngle = situpAngle;
    else if (detectedType === "jumpingjack") activeAngle = jjActive ? 45 : 160;
  } else {
    if (pushupActive) {
      detectedType = "pushup";
      activeAngle = pushupAngle;
    } else if (squatActive) {
      detectedType = "squat";
      activeAngle = squatAngle;
    } else if (situpActive) {
      detectedType = "situp";
      activeAngle = situpAngle;
    } else if (jjActive) {
      detectedType = "jumpingjack";
      activeAngle = 45;
    }
  }

  // Rep counting
  let repAdded = false;
  let newPhase = exerciseState.phase;

  if (detectedType === "pushup" && pushupAngle > 0) {
    if (pushupAngle < 90 && exerciseState.phase !== "down") {
      newPhase = "down";
    } else if (pushupAngle > 150 && exerciseState.phase === "down") {
      newPhase = "up";
      repAdded = true;
    }
  } else if (detectedType === "squat" && squatAngle > 0) {
    if (squatAngle < 100 && exerciseState.phase !== "down") {
      newPhase = "down";
    } else if (squatAngle > 160 && exerciseState.phase === "down") {
      newPhase = "up";
      repAdded = true;
    }
  } else if (detectedType === "situp" && situpAngle > 0) {
    if (situpAngle < 80 && exerciseState.phase !== "down") {
      newPhase = "down";
    } else if (situpAngle > 140 && exerciseState.phase === "down") {
      newPhase = "up";
      repAdded = true;
    }
  } else if (detectedType === "jumpingjack") {
    const wristsUp =
      leftWristJJ && leftShoulder ? leftWristJJ.y < leftShoulder.y : false;
    if (wristsUp && exerciseState.phase !== "up") {
      newPhase = "up";
    } else if (!wristsUp && exerciseState.phase === "up") {
      newPhase = "down";
      repAdded = true;
    }
  }

  return { type: detectedType, repAdded, newPhase, angle: activeAngle };
}

// ─── XP calculation ─────────────────────────────────────────────────────────
const XP_PER_REP: Record<string, number> = {
  pushup: 3,
  squat: 4,
  situp: 3,
  jumpingjack: 2,
};

function calculateXP(stats: SessionStats): number {
  const rawXP =
    stats.pushups * XP_PER_REP.pushup +
    stats.squats * XP_PER_REP.squat +
    stats.situps * XP_PER_REP.situp +
    stats.jumpingjacks * XP_PER_REP.jumpingjack;
  return Math.min(Math.max(rawXP, 5), 500);
}

// ─── Exercise name display ───────────────────────────────────────────────────
const EXERCISE_LABELS: Record<ExerciseType, string> = {
  pushup: "PUSH-UP",
  squat: "SQUAT",
  situp: "SIT-UP",
  jumpingjack: "JUMPING JACK",
  detecting: "DETECTING...",
};

const EXERCISE_ICONS: Record<ExerciseType, string> = {
  pushup: "💪",
  squat: "🦵",
  situp: "🧘",
  jumpingjack: "⭐",
  detecting: "📷",
};

// ─── Session Summary Modal ──────────────────────────────────────────────────
interface SessionSummaryProps {
  stats: SessionStats;
  onClose: () => void;
}

function SessionSummaryModal({ stats, onClose }: SessionSummaryProps) {
  const minutes = Math.floor(stats.duration / 60);
  const seconds = stats.duration % 60;
  const totalReps =
    stats.pushups + stats.squats + stats.situps + stats.jumpingjacks;

  return (
    <div
      data-ocid="cam_tracker.session.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "oklch(0 0 0 / 0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          background: "oklch(0.09 0.015 260)",
          border: "1px solid oklch(0.62 0.25 22 / 0.5)",
          borderRadius: "14px",
          padding: "2rem",
          width: "100%",
          maxWidth: "440px",
          boxShadow:
            "0 0 40px oklch(0.62 0.25 22 / 0.2), 0 24px 80px oklch(0 0 0 / 0.6)",
          position: "relative",
        }}
      >
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

        <button
          type="button"
          data-ocid="cam_tracker.session.close_button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "1px solid oklch(0.3 0.03 260 / 0.5)",
            borderRadius: "4px",
            padding: "0.3rem",
            cursor: "pointer",
            color: "oklch(0.55 0.04 260)",
            display: "flex",
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏆</div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "1.2rem",
              fontWeight: 900,
              letterSpacing: "0.12em",
              color: "oklch(0.82 0.18 85)",
              textShadow: "0 0 12px oklch(0.82 0.18 85 / 0.5)",
              margin: 0,
            }}
          >
            SESSION COMPLETE!
          </h2>
        </div>

        {/* XP earned hero */}
        <div
          style={{
            textAlign: "center",
            padding: "1.25rem",
            background: "oklch(0.62 0.25 22 / 0.08)",
            border: "1px solid oklch(0.62 0.25 22 / 0.3)",
            borderRadius: "10px",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "3rem",
              fontWeight: 900,
              color: "oklch(0.62 0.25 22)",
              textShadow: "0 0 20px oklch(0.62 0.25 22 / 0.7)",
              lineHeight: 1,
            }}
          >
            +{stats.xpEarned} XP
          </div>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.68rem",
              color: "oklch(0.55 0.04 260)",
              letterSpacing: "0.15em",
              marginTop: "0.3rem",
            }}
          >
            FITNESS XP EARNED
          </div>
        </div>

        {/* Exercise breakdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem",
            marginBottom: "1.25rem",
          }}
        >
          {[
            {
              label: "PUSH-UPS",
              value: stats.pushups,
              icon: "💪",
              color: "oklch(0.62 0.25 22)",
            },
            {
              label: "SQUATS",
              value: stats.squats,
              icon: "🦵",
              color: "oklch(0.62 0.22 295)",
            },
            {
              label: "SIT-UPS",
              value: stats.situps,
              icon: "🧘",
              color: "oklch(0.82 0.18 85)",
            },
            {
              label: "JUMPING JACKS",
              value: stats.jumpingjacks,
              icon: "⭐",
              color: "oklch(0.65 0.2 140)",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "0.75rem",
                background: "oklch(0.11 0.015 260 / 0.8)",
                border: "1px solid oklch(0.2 0.02 260 / 0.5)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                {item.icon}
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "1.3rem",
                  fontWeight: 900,
                  color: item.color,
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.55rem",
                  color: "oklch(0.45 0.03 260)",
                  letterSpacing: "0.08em",
                  marginTop: "0.2rem",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "0.75rem",
            background: "oklch(0.11 0.015 260 / 0.6)",
            border: "1px solid oklch(0.2 0.02 260 / 0.5)",
            borderRadius: "8px",
            marginBottom: "1.25rem",
          }}
        >
          {[
            { label: "TOTAL REPS", value: String(totalReps) },
            {
              label: "DURATION",
              value: `${minutes}:${String(seconds).padStart(2, "0")}`,
            },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "oklch(0.9 0.02 260)",
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.55rem",
                  color: "oklch(0.45 0.03 260)",
                  letterSpacing: "0.1em",
                  marginTop: "0.15rem",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            padding: "0.85rem",
            background:
              "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
            border: "1px solid oklch(0.72 0.28 22 / 0.5)",
            borderRadius: "8px",
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "oklch(0.98 0 0)",
            cursor: "pointer",
            boxShadow: "0 0 12px oklch(0.62 0.25 22 / 0.4)",
          }}
        >
          ⚡ CONTINUE TRAINING
        </button>
      </div>
    </div>
  );
}

// ─── Main CameraTracker component ───────────────────────────────────────────
export function CameraTracker() {
  const { isLoggedIn } = useAuth();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const detectorRef = useRef<{
    estimatePoses: (video: HTMLVideoElement) => Promise<Pose[]>;
  } | null>(null);
  const startTimeRef = useRef<number>(0);
  const exerciseStateRef = useRef<ExerciseState>({
    type: "detecting",
    reps: 0,
    phase: "neutral",
    lastAngle: 0,
  });
  const sessionStatsRef = useRef<SessionStats>({
    pushups: 0,
    squats: 0,
    situps: 0,
    jumpingjacks: 0,
    duration: 0,
    xpEarned: 0,
  });

  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const facingModeRef = useRef<"user" | "environment">("user");
  const [modelLoading, setModelLoading] = useState(false);
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null); // null = unknown
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] =
    useState<ExerciseType>("detecting");
  const [totalReps, setTotalReps] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Load MediaPipe Pose model via CDN script injection
  const loadModel = useCallback(async () => {
    setModelLoading(true);
    try {
      // Load MediaPipe Pose via script tag injection if not already loaded
      if (!window.Pose && !document.querySelector("script[data-mediapipe]")) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js";
          script.setAttribute("data-mediapipe", "true");
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load MediaPipe"));
          document.head.appendChild(script);
        });
      }

      // Wait for Pose constructor to be available
      await new Promise<void>((resolve) => {
        const check = () => {
          if (window.Pose) resolve();
          else setTimeout(check, 100);
        };
        check();
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const pose = new window.Pose({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Create a wrapper matching our estimatePoses interface
      detectorRef.current = {
        estimatePoses: (video: HTMLVideoElement): Promise<Pose[]> => {
          return new Promise((resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            pose.onResults(
              (results: {
                poseLandmarks?: { x: number; y: number; visibility: number }[];
              }) => {
                if (results.poseLandmarks) {
                  const keypoints = results.poseLandmarks.map(
                    (lm, idx: number) => ({
                      x: lm.x,
                      y: lm.y,
                      score: lm.visibility,
                      name: MEDIAPIPE_LANDMARK_NAMES[idx] ?? `landmark_${idx}`,
                    }),
                  );
                  resolve([{ keypoints, score: 1 }]);
                } else {
                  resolve([]);
                }
              },
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            pose.send({ image: video }).catch(() => resolve([]));
          });
        },
      };

      setModelAvailable(true);
      setModelLoading(false);
    } catch (err) {
      console.warn("MediaPipe failed to load, using manual mode:", err);
      // Fall back to manual rep counting — users tap buttons to count
      detectorRef.current = null;
      setModelAvailable(false);
      setModelLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    setCameraActive(false);
  }, []);

  // Sync facingModeRef with state
  useEffect(() => {
    facingModeRef.current = facingMode;
  }, [facingMode]);

  // Pose estimation loop using canvas + motion detection heuristics
  const runDetectionLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(runDetectionLoop);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Use ref to get current facing mode (avoids stale closure)
    const currentFacingMode = facingModeRef.current;

    // Draw video frame (mirrored for selfie cam)
    ctx.save();
    if (currentFacingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // If real detector loaded, use it; otherwise use motion-based skeleton hint
    if (detectorRef.current) {
      detectorRef.current
        .estimatePoses(video)
        .then((poses) => {
          if (poses.length > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            if (currentFacingMode === "user") {
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            drawSkeleton(ctx, poses[0], canvas.width, canvas.height);

            const prev = exerciseStateRef.current;
            const result = detectExercise(poses[0], prev);

            exerciseStateRef.current = {
              ...prev,
              type: result.type,
              phase: result.newPhase,
              lastAngle: result.angle,
            };

            if (result.repAdded) {
              exerciseStateRef.current.reps += 1;
              const stats = sessionStatsRef.current;
              if (result.type === "pushup") stats.pushups += 1;
              else if (result.type === "squat") stats.squats += 1;
              else if (result.type === "situp") stats.situps += 1;
              else if (result.type === "jumpingjack") stats.jumpingjacks += 1;

              const newReps =
                stats.pushups +
                stats.squats +
                stats.situps +
                stats.jumpingjacks;
              const newXp = calculateXP(stats);
              const newCalories = Math.round(newReps * 0.4);

              setTotalReps(newReps);
              setXpEarned(newXp);
              setCalories(newCalories);
            }

            setCurrentExercise(result.type);
          }
        })
        .catch(() => {
          // silently ignore detection errors
        });
    } else {
      // Draw scanning overlay without full skeleton (model not available)
      drawScanOverlay(ctx, canvas.width, canvas.height);
    }

    animFrameRef.current = requestAnimationFrame(runDetectionLoop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- uses refs only, no stale closures

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingModeRef.current,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      startTimeRef.current = Date.now();
      sessionStatsRef.current = {
        pushups: 0,
        squats: 0,
        situps: 0,
        jumpingjacks: 0,
        duration: 0,
        xpEarned: 0,
      };
      exerciseStateRef.current = {
        type: "detecting",
        reps: 0,
        phase: "neutral",
        lastAngle: 0,
      };
      setTotalReps(0);
      setElapsed(0);
      setCalories(0);
      setXpEarned(5);
      setCurrentExercise("detecting");

      // Timer
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      // Load model
      await loadModel();

      animFrameRef.current = requestAnimationFrame(runDetectionLoop);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("Permission") || msg.includes("NotAllowed")) {
        setCameraError(
          "Camera access denied. Please allow camera permission and try again.",
        );
      } else {
        setCameraError(`Camera error: ${msg}`);
      }
    }
  }, [loadModel, runDetectionLoop]);

  const handleManualRep = useCallback(
    (type: "pushup" | "squat" | "situp" | "jumpingjack") => {
      const stats = sessionStatsRef.current;
      if (type === "pushup") stats.pushups += 1;
      else if (type === "squat") stats.squats += 1;
      else if (type === "situp") stats.situps += 1;
      else if (type === "jumpingjack") stats.jumpingjacks += 1;
      exerciseStateRef.current.reps += 1;
      const newReps =
        stats.pushups + stats.squats + stats.situps + stats.jumpingjacks;
      const newXp = calculateXP(stats);
      const newCalories = Math.round(newReps * 0.4);
      setTotalReps(newReps);
      setXpEarned(newXp);
      setCalories(newCalories);
      setCurrentExercise(type);
    },
    [],
  );

  const handleEndSession = async () => {
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const stats = sessionStatsRef.current;
    const xp = calculateXP(stats);

    stats.duration = duration;
    stats.xpEarned = xp;

    stopCamera();

    // Award XP
    if (actor && isLoggedIn) {
      try {
        await actor.awardCameraXP(BigInt(xp), "fitness");
        await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
      } catch {
        // silently fail
      }
    }

    setSessionStats({ ...stats });
    setShowSummary(true);
  };

  const handleToggleCamera = useCallback(() => {
    const newMode = facingModeRef.current === "user" ? "environment" : "user";
    facingModeRef.current = newMode;
    setFacingMode(newMode);
    if (cameraActive) {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 300);
    }
  }, [cameraActive, stopCamera, startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Note: detection loop is started directly in startCamera, no need for effect here

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <>
      <section
        id="cam-tracker"
        data-ocid="cam_tracker.section"
        style={{
          padding: "100px 2rem 80px",
          background: "oklch(0.06 0.01 255)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(oklch(0.62 0.25 22 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.25 22 / 0.025) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, oklch(0.62 0.25 22 / 0.05) 0%, transparent 65%)",
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
              <Camera size={12} style={{ color: "oklch(0.62 0.25 22)" }} />
              <span
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "oklch(0.62 0.25 22)",
                }}
              >
                AI POWERED
              </span>
            </div>
            <h2
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                letterSpacing: "0.06em",
                margin: "0 0 0.5rem",
                background:
                  "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.82 0.18 85) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CAM TRACKER
            </h2>
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.95rem",
                color: "oklch(0.6 0.04 260)",
                letterSpacing: "0.05em",
              }}
            >
              Real-Time AI Exercise Detection — Do the exercise, earn XP
            </p>
          </div>

          {/* Main layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "1.5rem",
              alignItems: "start",
            }}
            className="grid grid-cols-1 lg:grid-cols-2"
          >
            {/* Camera feed */}
            <div>
              {!cameraActive ? (
                /* Pre-camera state */
                <div
                  style={{
                    aspectRatio: "16/9",
                    background: "oklch(0.09 0.015 260 / 0.8)",
                    border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1.25rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Scan lines */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.62 0.25 22 / 0.03) 2px, oklch(0.62 0.25 22 / 0.03) 4px)",
                      pointerEvents: "none",
                    }}
                  />

                  {cameraError ? (
                    <div
                      data-ocid="cam_tracker.error_state"
                      style={{
                        padding: "1.5rem",
                        textAlign: "center",
                        maxWidth: "360px",
                      }}
                    >
                      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                        📷
                      </div>
                      <div
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.85rem",
                          color: "oklch(0.75 0.25 22)",
                          marginBottom: "1rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {cameraError}
                      </div>
                      <button
                        type="button"
                        data-ocid="cam_tracker.start_button"
                        onClick={() => {
                          setCameraError(null);
                          startCamera();
                        }}
                        style={{
                          padding: "0.75rem 2rem",
                          background:
                            "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                          border: "1px solid oklch(0.72 0.28 22 / 0.5)",
                          borderRadius: "6px",
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          color: "oklch(0.98 0 0)",
                          cursor: "pointer",
                        }}
                      >
                        TRY AGAIN
                      </button>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          background: "oklch(0.62 0.25 22 / 0.1)",
                          border: "1px solid oklch(0.62 0.25 22 / 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          animation: "float 4s ease-in-out infinite",
                        }}
                      >
                        <Camera
                          size={32}
                          style={{ color: "oklch(0.62 0.25 22)" }}
                        />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "1rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: "oklch(0.9 0.02 260)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          CAMERA WORKOUT TRACKER
                        </div>
                        <div
                          style={{
                            fontFamily: '"Sora", sans-serif',
                            fontSize: "0.8rem",
                            color: "oklch(0.5 0.03 260)",
                            maxWidth: "300px",
                            lineHeight: 1.5,
                          }}
                        >
                          Allow camera access to start AI-powered exercise
                          detection. Supports push-ups, squats, sit-ups &
                          jumping jacks.
                        </div>
                      </div>
                      <button
                        type="button"
                        data-ocid="cam_tracker.start_button"
                        onClick={startCamera}
                        style={{
                          padding: "0.85rem 2.5rem",
                          background:
                            "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                          border: "1px solid oklch(0.72 0.28 22 / 0.6)",
                          borderRadius: "8px",
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.82rem",
                          fontWeight: 900,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "oklch(0.98 0 0)",
                          cursor: "pointer",
                          boxShadow:
                            "0 0 16px oklch(0.62 0.25 22 / 0.5), 0 0 40px oklch(0.62 0.25 22 / 0.2)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 0 24px oklch(0.62 0.25 22 / 0.8), 0 0 60px oklch(0.62 0.25 22 / 0.3)";
                          (e.currentTarget as HTMLElement).style.transform =
                            "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 0 16px oklch(0.62 0.25 22 / 0.5), 0 0 40px oklch(0.62 0.25 22 / 0.2)";
                          (e.currentTarget as HTMLElement).style.transform =
                            "translateY(0)";
                        }}
                      >
                        <Camera size={18} />
                        START CAMERA
                      </button>
                    </>
                  )}
                </div>
              ) : (
                /* Active camera state */
                <div
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid oklch(0.62 0.25 22 / 0.4)",
                    boxShadow:
                      "0 0 30px oklch(0.62 0.25 22 / 0.15), 0 0 0 1px oklch(0.62 0.25 22 / 0.05)",
                    aspectRatio: "16/9",
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "none", // hidden, canvas shows the feed
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    data-ocid="cam_tracker.canvas_target"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Model loading overlay */}
                  {modelLoading && (
                    <div
                      data-ocid="cam_tracker.loading_state"
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "0.5rem 1rem",
                        background: "oklch(0 0 0 / 0.7)",
                        borderRadius: "100px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          border: "2px solid oklch(0.62 0.22 295 / 0.3)",
                          borderTop: "2px solid oklch(0.62 0.22 295)",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.7rem",
                          color: "oklch(0.7 0.04 260)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        LOADING AI MODEL...
                      </span>
                    </div>
                  )}

                  {/* Current exercise badge overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      padding: "0.4rem 0.85rem",
                      background: "oklch(0 0 0 / 0.7)",
                      border: "1px solid oklch(0.62 0.25 22 / 0.5)",
                      borderRadius: "6px",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color:
                          currentExercise === "detecting"
                            ? "oklch(0.5 0.03 260)"
                            : "oklch(0.82 0.18 85)",
                      }}
                    >
                      {EXERCISE_ICONS[currentExercise]}{" "}
                      {EXERCISE_LABELS[currentExercise]}
                    </span>
                  </div>

                  {/* Neon corner decorations */}
                  {(
                    [
                      { pos: "tl", top: "6px", left: "6px" },
                      { pos: "tr", top: "6px", right: "6px" },
                      { pos: "bl", bottom: "6px", left: "6px" },
                      { pos: "br", bottom: "6px", right: "6px" },
                    ] as const
                  ).map((corner) => (
                    <div
                      key={corner.pos}
                      style={{
                        position: "absolute",
                        width: "16px",
                        height: "16px",
                        top: "top" in corner ? corner.top : undefined,
                        bottom: "bottom" in corner ? corner.bottom : undefined,
                        left: "left" in corner ? corner.left : undefined,
                        right: "right" in corner ? corner.right : undefined,
                        borderColor: "oklch(0.62 0.25 22)",
                        borderStyle: "solid",
                        borderWidth: "2px",
                        borderRight:
                          "right" in corner
                            ? "2px solid oklch(0.62 0.25 22)"
                            : "none",
                        borderBottom:
                          "bottom" in corner
                            ? "2px solid oklch(0.62 0.25 22)"
                            : "none",
                        borderLeft:
                          "left" in corner
                            ? "2px solid oklch(0.62 0.25 22)"
                            : "none",
                        borderTop:
                          "top" in corner
                            ? "2px solid oklch(0.62 0.25 22)"
                            : "none",
                        boxShadow: "0 0 6px oklch(0.62 0.25 22 / 0.6)",
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Manual rep counting fallback — shown when AI detection unavailable */}
              {cameraActive && modelAvailable === false && (
                <div
                  style={{
                    marginTop: "0.85rem",
                    padding: "0.85rem 1rem",
                    background: "oklch(0.09 0.015 260 / 0.9)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.4)",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      color: "oklch(0.62 0.22 295)",
                      marginBottom: "0.65rem",
                      textAlign: "center",
                    }}
                  >
                    ◆ MANUAL REP COUNTER (AI unavailable)
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.5rem",
                    }}
                  >
                    {(
                      [
                        {
                          type: "pushup" as const,
                          label: "Push-up",
                          icon: "💪",
                          color: "oklch(0.62 0.25 22)",
                        },
                        {
                          type: "squat" as const,
                          label: "Squat",
                          icon: "🦵",
                          color: "oklch(0.62 0.22 295)",
                        },
                        {
                          type: "situp" as const,
                          label: "Sit-up",
                          icon: "🧘",
                          color: "oklch(0.82 0.18 85)",
                        },
                        {
                          type: "jumpingjack" as const,
                          label: "Jump Jack",
                          icon: "⭐",
                          color: "oklch(0.65 0.2 140)",
                        },
                      ] as const
                    ).map((ex) => (
                      <button
                        key={ex.type}
                        type="button"
                        data-ocid={`cam_tracker.${ex.type}.button`}
                        onClick={() => handleManualRep(ex.type)}
                        style={{
                          padding: "0.55rem 0.5rem",
                          background: `${ex.color.replace(")", " / 0.1)")}`,
                          border: `1px solid ${ex.color.replace(")", " / 0.45)")}`,
                          borderRadius: "6px",
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: ex.color,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                          transition: "all 0.15s ease",
                          textTransform: "uppercase",
                          boxShadow: `0 0 6px ${ex.color.replace(")", " / 0.15)")}`,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            ex.color.replace(")", " / 0.2)");
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            `0 0 12px ${ex.color.replace(")", " / 0.4)")}`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background =
                            ex.color.replace(")", " / 0.1)");
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            `0 0 6px ${ex.color.replace(")", " / 0.15)")}`;
                        }}
                      >
                        <Plus size={11} />
                        {ex.icon} {ex.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Camera controls */}
              {cameraActive && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    type="button"
                    data-ocid="cam_tracker.toggle"
                    onClick={handleToggleCamera}
                    style={{
                      flex: 1,
                      padding: "0.7rem",
                      background: "oklch(0.11 0.02 260 / 0.8)",
                      border: "1px solid oklch(0.25 0.03 260 / 0.6)",
                      borderRadius: "8px",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "oklch(0.7 0.04 260)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "oklch(0.62 0.22 295 / 0.5)";
                      (e.currentTarget as HTMLElement).style.color =
                        "oklch(0.62 0.22 295)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "oklch(0.25 0.03 260 / 0.6)";
                      (e.currentTarget as HTMLElement).style.color =
                        "oklch(0.7 0.04 260)";
                    }}
                  >
                    <FlipHorizontal size={16} />
                    {facingMode === "user" ? "REAR CAM" : "FRONT CAM"}
                  </button>
                  <button
                    type="button"
                    data-ocid="cam_tracker.end_button"
                    onClick={handleEndSession}
                    style={{
                      flex: 2,
                      padding: "0.7rem",
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                      border: "1px solid oklch(0.72 0.28 22 / 0.5)",
                      borderRadius: "8px",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      color: "oklch(0.98 0 0)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      boxShadow: "0 0 10px oklch(0.62 0.25 22 / 0.4)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 0 20px oklch(0.62 0.25 22 / 0.7)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        "0 0 10px oklch(0.62 0.25 22 / 0.4)";
                    }}
                  >
                    <CameraOff size={16} />
                    END SESSION
                  </button>
                </div>
              )}
            </div>

            {/* Right: Stats panel */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Current exercise display */}
              <div
                style={{
                  padding: "1.5rem",
                  background: "oklch(0.09 0.015 260 / 0.8)",
                  border: `1px solid ${cameraActive && currentExercise !== "detecting" ? "oklch(0.62 0.25 22 / 0.4)" : "oklch(0.22 0.02 260 / 0.5)"}`,
                  borderRadius: "10px",
                  backdropFilter: "blur(12px)",
                  textAlign: "center",
                  boxShadow:
                    cameraActive && currentExercise !== "detecting"
                      ? "0 0 20px oklch(0.62 0.25 22 / 0.1)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                  {cameraActive ? EXERCISE_ICONS[currentExercise] : "🎯"}
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "1.2rem",
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    color:
                      cameraActive && currentExercise !== "detecting"
                        ? "oklch(0.82 0.18 85)"
                        : "oklch(0.5 0.03 260)",
                    textShadow:
                      cameraActive && currentExercise !== "detecting"
                        ? "0 0 12px oklch(0.82 0.18 85 / 0.5)"
                        : "none",
                    marginBottom: "0.25rem",
                  }}
                >
                  {cameraActive ? EXERCISE_LABELS[currentExercise] : "READY"}
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.62rem",
                    color: "oklch(0.4 0.03 260)",
                    letterSpacing: "0.15em",
                  }}
                >
                  {cameraActive ? "DETECTED EXERCISE" : "START CAMERA TO TRACK"}
                </div>
              </div>

              {/* Rep counter */}
              <div
                style={{
                  padding: "1.25rem",
                  background: "oklch(0.09 0.015 260 / 0.8)",
                  border: "1px solid oklch(0.62 0.22 295 / 0.3)",
                  borderRadius: "10px",
                  backdropFilter: "blur(12px)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "oklch(0.55 0.04 260)",
                    marginBottom: "0.4rem",
                  }}
                >
                  TOTAL REPS
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "4rem",
                    fontWeight: 900,
                    color: "oklch(0.62 0.22 295)",
                    textShadow: "0 0 20px oklch(0.62 0.22 295 / 0.6)",
                    lineHeight: 1,
                  }}
                >
                  {totalReps}
                </div>
              </div>

              {/* Stats grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.6rem",
                }}
              >
                {[
                  {
                    label: "CALORIES",
                    value: calories,
                    icon: "🔥",
                    color: "oklch(0.75 0.25 22)",
                  },
                  {
                    label: "TIME",
                    value: formatTime(elapsed),
                    icon: "⏱",
                    color: "oklch(0.65 0.22 250)",
                  },
                  {
                    label: "XP EARNED",
                    value: `+${xpEarned}`,
                    icon: "⚡",
                    color: "oklch(0.82 0.18 85)",
                  },
                  {
                    label: "SESSION",
                    value: cameraActive ? "LIVE" : "—",
                    icon: "🎮",
                    color: cameraActive
                      ? "oklch(0.62 0.2 140)"
                      : "oklch(0.4 0.03 260)",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "0.85rem",
                      background: "oklch(0.09 0.015 260 / 0.8)",
                      border: "1px solid oklch(0.2 0.02 260 / 0.5)",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
                      {item.icon}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: item.color,
                        lineHeight: 1,
                        textShadow: cameraActive
                          ? `0 0 8px ${item.color} / 0.4`
                          : "none",
                      }}
                    >
                      {item.value}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Sora", sans-serif',
                        fontSize: "0.55rem",
                        color: "oklch(0.4 0.03 260)",
                        letterSpacing: "0.1em",
                        marginTop: "0.15rem",
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Exercise breakdown */}
              {cameraActive && (
                <div
                  style={{
                    padding: "1rem",
                    background: "oklch(0.09 0.015 260 / 0.8)",
                    border: "1px solid oklch(0.22 0.03 260 / 0.5)",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      color: "oklch(0.5 0.03 260)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    ◆ EXERCISE BREAKDOWN
                  </div>
                  {[
                    {
                      label: "Push-ups",
                      count: sessionStatsRef.current.pushups,
                      color: "oklch(0.62 0.25 22)",
                    },
                    {
                      label: "Squats",
                      count: sessionStatsRef.current.squats,
                      color: "oklch(0.62 0.22 295)",
                    },
                    {
                      label: "Sit-ups",
                      count: sessionStatsRef.current.situps,
                      color: "oklch(0.82 0.18 85)",
                    },
                    {
                      label: "Jumping Jacks",
                      count: sessionStatsRef.current.jumpingjacks,
                      color: "oklch(0.65 0.2 140)",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.35rem 0",
                        borderBottom: "1px solid oklch(0.15 0.02 260 / 0.5)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.7rem",
                          color: "oklch(0.6 0.04 260)",
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: item.color,
                        }}
                      >
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* How to use */}
              {!cameraActive && (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    background: "oklch(0.09 0.015 260 / 0.6)",
                    border: "1px solid oklch(0.2 0.02 260 / 0.4)",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      color: "oklch(0.5 0.03 260)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    ◆ SUPPORTED EXERCISES
                  </div>
                  {[
                    { icon: "💪", name: "Push-ups", xp: "3 XP/rep" },
                    { icon: "🦵", name: "Squats", xp: "4 XP/rep" },
                    { icon: "🧘", name: "Sit-ups", xp: "3 XP/rep" },
                    { icon: "⭐", name: "Jumping Jacks", xp: "2 XP/rep" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.3rem 0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.72rem",
                          color: "oklch(0.65 0.04 260)",
                        }}
                      >
                        <span>{item.icon}</span>
                        {item.name}
                      </div>
                      <span
                        style={{
                          fontFamily: '"Sora", sans-serif',
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "oklch(0.62 0.22 295)",
                        }}
                      >
                        {item.xp}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.5rem 0.75rem",
                      background: "oklch(0.62 0.25 22 / 0.06)",
                      border: "1px solid oklch(0.62 0.25 22 / 0.2)",
                      borderRadius: "6px",
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.65rem",
                      color: "oklch(0.6 0.04 260)",
                      lineHeight: 1.4,
                    }}
                  >
                    <Dumbbell
                      size={11}
                      style={{
                        display: "inline",
                        marginRight: "4px",
                        color: "oklch(0.62 0.25 22)",
                      }}
                    />
                    Min 5 XP per session (participation bonus). Max 500 XP.
                  </div>
                </div>
              )}

              {/* Login prompt */}
              {!isLoggedIn && cameraActive && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "oklch(0.62 0.22 295 / 0.07)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.3)",
                    borderRadius: "8px",
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "0.72rem",
                    color: "oklch(0.62 0.22 295)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Zap size={14} />
                  Login to save XP to your profile
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Session summary modal */}
      {showSummary && sessionStats && (
        <SessionSummaryModal
          stats={sessionStats}
          onClose={() => {
            setShowSummary(false);
            setSessionStats(null);
          }}
        />
      )}
    </>
  );
}

// ─── Scan overlay (no pose model) ────────────────────────────────────────────
function drawScanOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const t = Date.now() / 1000;
  const scanY = ((t % 3) / 3) * height;

  // Scanning line
  const gradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
  gradient.addColorStop(0, "rgba(255,60,60,0)");
  gradient.addColorStop(0.5, "rgba(255,60,60,0.35)");
  gradient.addColorStop(1, "rgba(255,60,60,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, scanY - 20, width, 40);

  // Corner brackets
  const bSize = 24;
  ctx.strokeStyle = "rgba(255,60,60,0.7)";
  ctx.shadowColor = "rgba(255,60,60,0.5)";
  ctx.shadowBlur = 6;
  ctx.lineWidth = 2;
  const corners = [
    [0, 0, bSize, 0, 0, bSize],
    [width, 0, width - bSize, 0, width, bSize],
    [0, height, bSize, height, 0, height - bSize],
    [width, height, width - bSize, height, width, height - bSize],
  ] as const;
  for (const [x1, y1, x2, y2, x3, y3] of corners) {
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x3, y3);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}
