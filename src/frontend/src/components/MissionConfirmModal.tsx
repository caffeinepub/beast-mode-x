import type { MissionDef } from "@/utils/missionData";
import { useCallback, useEffect, useRef, useState } from "react";

interface MissionConfirmModalProps {
  mission: MissionDef;
  trainerName: string;
  trainerColor: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MissionConfirmModal({
  mission,
  trainerName,
  trainerColor,
  onConfirm,
  onCancel,
}: MissionConfirmModalProps) {
  const [checked, setChecked] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0–100
  const [isHolding, setIsHolding] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);
  const HOLD_DURATION_MS = 3000;

  const startHold = useCallback(() => {
    if (!checked || confirmed) return;
    setIsHolding(true);
    holdStartRef.current = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdTimerRef.current!);
        holdTimerRef.current = null;
        setIsHolding(false);
        setConfirmed(true);
        onConfirm();
      }
    }, 30);
  }, [checked, confirmed, onConfirm]);

  const stopHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  const canConfirm = checked && !confirmed;

  return (
    <div
      data-ocid="mission.confirm.dialog"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      aria-label="Mission Confirmation"
    >
      {/* Backdrop — use onPointerDown for reliable touch */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(0 0 0 / 0.94)",
          backdropFilter: "blur(16px)",
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onCancel();
        }}
        role="presentation"
      />

      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 0.04) 2px, oklch(0 0 0 / 0.04) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Modal card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "480px",
          background: "oklch(0.07 0.018 260)",
          border: `2px solid ${trainerColor.replace(")", " / 0.6)")}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: `0 0 60px ${trainerColor.replace(")", " / 0.25)")}, 0 40px 80px oklch(0 0 0 / 0.7)`,
        }}
        role="presentation"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, transparent, ${trainerColor}, oklch(0.62 0.22 295), transparent)`,
          }}
        />

        {/* Red warning header */}
        <div
          style={{
            padding: "1.25rem 1.5rem 1rem",
            background: "oklch(0.62 0.25 22 / 0.08)",
            borderBottom: "1px solid oklch(0.62 0.25 22 / 0.2)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "oklch(0.62 0.25 22)",
              marginBottom: "0.4rem",
              fontWeight: 700,
            }}
          >
            ◆ SYSTEM ALERT ◆
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "1.15rem",
              letterSpacing: "0.1em",
              color: "oklch(0.88 0.22 22)",
              textShadow: "0 0 16px oklch(0.62 0.25 22 / 0.7)",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            ⚠️ HONOR SYSTEM ALERT
          </h2>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Mission info */}
          <div
            style={{
              padding: "1rem 1.25rem",
              background: trainerColor.replace(")", " / 0.08)"),
              border: `1px solid ${trainerColor.replace(")", " / 0.3)")}`,
              borderRadius: "10px",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: trainerColor,
                fontWeight: 700,
                marginBottom: "0.35rem",
                textTransform: "uppercase",
              }}
            >
              {trainerName} — Mission Assignment
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "0.06em",
                color: "oklch(0.92 0.02 260)",
                marginBottom: "0.35rem",
              }}
            >
              {mission.name}
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.75rem",
                color: "oklch(0.62 0.04 260)",
                lineHeight: 1.5,
              }}
            >
              {mission.desc}
            </div>
            <div
              style={{
                marginTop: "0.65rem",
                display: "inline-flex",
                padding: "0.2rem 0.6rem",
                background: "oklch(0.82 0.18 85 / 0.1)",
                border: "1px solid oklch(0.82 0.18 85 / 0.4)",
                borderRadius: "100px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "oklch(0.82 0.18 85)",
                textShadow: "0 0 6px oklch(0.82 0.18 85 / 0.5)",
              }}
            >
              +{mission.xp} XP REWARD
            </div>
          </div>

          {/* Anti-cheat warning */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "oklch(0.62 0.25 22 / 0.07)",
              border: "1px solid oklch(0.62 0.25 22 / 0.35)",
              borderRadius: "8px",
              marginBottom: "1rem",
              display: "flex",
              gap: "0.6rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔒</span>
            <div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "oklch(0.75 0.22 22)",
                  letterSpacing: "0.06em",
                  marginBottom: "0.2rem",
                }}
              >
                THIS ACTION IS RECORDED
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.65rem",
                  color: "oklch(0.55 0.04 260)",
                  lineHeight: 1.5,
                }}
              >
                False confirmations are tracked and timestamped. Abuse will
                trigger rate limits and session bans.{" "}
                <span
                  style={{
                    color: "oklch(0.62 0.25 22 / 0.9)",
                    fontWeight: 600,
                  }}
                >
                  Your progress is only as real as your effort.
                </span>
              </div>
            </div>
          </div>

          {/* What you must do */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "oklch(0.1 0.015 260)",
              border: "1px solid oklch(0.25 0.03 260 / 0.5)",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "oklch(0.55 0.04 260)",
                fontWeight: 700,
                marginBottom: "0.4rem",
                textTransform: "uppercase",
              }}
            >
              ✓ Task Requirements
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.78rem",
                color: "oklch(0.78 0.04 260)",
                lineHeight: 1.6,
              }}
            >
              {mission.desc}
            </div>
            <div
              style={{
                marginTop: "0.4rem",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.7rem",
                color: "oklch(0.55 0.04 260)",
                fontStyle: "italic",
              }}
            >
              Did you physically complete this task in full?
            </div>
          </div>

          {/* Checkbox */}
          <label
            htmlFor="confirm-checkbox"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              cursor: "pointer",
              marginBottom: "1.25rem",
              padding: "0.85rem 1rem",
              background: checked
                ? "oklch(0.65 0.18 140 / 0.08)"
                : "oklch(0.09 0.01 260 / 0.5)",
              border: `1px solid ${checked ? "oklch(0.65 0.18 140 / 0.5)" : "oklch(0.25 0.03 260 / 0.4)"}`,
              borderRadius: "8px",
              transition: "all 0.2s ease",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              minHeight: "52px",
            }}
          >
            <input
              id="confirm-checkbox"
              type="checkbox"
              data-ocid="mission.confirm.checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{
                width: "20px",
                height: "20px",
                accentColor: "oklch(0.65 0.18 140)",
                flexShrink: 0,
                marginTop: "2px",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.8rem",
                lineHeight: 1.5,
                color: checked ? "oklch(0.75 0.15 140)" : "oklch(0.7 0.04 260)",
                fontWeight: 600,
              }}
            >
              I confirm I actually completed this task in real life. I am not
              cheating the system.
            </span>
          </label>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              data-ocid="mission.confirm.cancel_button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "0.85rem 1rem",
                background: "oklch(0.1 0.015 260)",
                border: "1px solid oklch(0.28 0.03 260 / 0.6)",
                borderRadius: "6px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "oklch(0.5 0.03 260)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "uppercase",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                minHeight: "52px",
              }}
            >
              ❌ CANCEL
            </button>

            {/* 3-second hold button */}
            <button
              type="button"
              data-ocid="mission.confirm.submit_button"
              disabled={!canConfirm}
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={(e) => {
                e.preventDefault();
                startHold();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                stopHold();
              }}
              onTouchCancel={stopHold}
              style={{
                flex: 2,
                padding: "0.85rem 1rem",
                position: "relative",
                overflow: "hidden",
                background: canConfirm
                  ? "oklch(0.12 0.02 260)"
                  : "oklch(0.1 0.015 260)",
                border: `1px solid ${canConfirm ? (isHolding ? "oklch(0.65 0.18 140 / 0.9)" : "oklch(0.65 0.18 140 / 0.5)") : "oklch(0.2 0.02 260 / 0.4)"}`,
                borderRadius: "6px",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: canConfirm
                  ? isHolding
                    ? "oklch(0.98 0 0)"
                    : "oklch(0.8 0.15 140)"
                  : "oklch(0.35 0.02 260)",
                cursor: canConfirm ? "pointer" : "not-allowed",
                transition: "color 0.2s ease, border-color 0.2s ease",
                textTransform: "uppercase",
                userSelect: "none",
                WebkitUserSelect: "none",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                minHeight: "52px",
              }}
            >
              {/* Hold progress fill */}
              {canConfirm && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, oklch(0.5 0.22 140 / 0.85) 0%, oklch(0.55 0.2 140 / 0.85) 100%)",
                    width: `${holdProgress}%`,
                    transition: "none",
                    borderRadius: "inherit",
                  }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>
                {isHolding
                  ? `HOLD (${Math.ceil(((100 - holdProgress) / 100) * 3)}s)...`
                  : canConfirm
                    ? "HOLD TO CONFIRM ✅"
                    : "CHECK BOX FIRST"}
              </span>
            </button>
          </div>

          {/* Hint text */}
          {canConfirm && !isHolding && (
            <div
              style={{
                marginTop: "0.6rem",
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.62rem",
                color: "oklch(0.4 0.03 260)",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Hold the button for 3 seconds to confirm. This prevents accidental
              completions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
