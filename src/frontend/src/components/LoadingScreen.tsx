import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"entering" | "loading" | "exiting">(
    "entering",
  );

  useEffect(() => {
    // Animate progress
    const startTime = Date.now();
    const duration = 2200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setPhase("exiting");
        setTimeout(onComplete, 350);
      }
    }, 20);

    const phaseTimer = setTimeout(() => setPhase("loading"), 300);

    return () => {
      clearInterval(interval);
      clearTimeout(phaseTimer);
    };
  }, [onComplete]);

  return (
    <div
      data-ocid="loading.panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "oklch(0.05 0.01 250)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        transition: "opacity 0.35s ease",
        opacity: phase === "exiting" ? 0 : 1,
      }}
    >
      {/* Grid pattern background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.25 22 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.25 22 / 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Corner decorations */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          width: "60px",
          height: "60px",
          borderTop: "2px solid oklch(0.62 0.25 22 / 0.7)",
          borderLeft: "2px solid oklch(0.62 0.25 22 / 0.7)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "2rem",
          width: "60px",
          height: "60px",
          borderBottom: "2px solid oklch(0.62 0.22 295 / 0.7)",
          borderRight: "2px solid oklch(0.62 0.22 295 / 0.7)",
        }}
      />

      {/* Main title */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          opacity: phase === "entering" ? 0 : 1,
          transform:
            phase === "entering" ? "translateY(20px)" : "translateY(0)",
          transition: "all 0.5s ease",
        }}
      >
        {/* Glitch layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontFamily: '"Orbitron", monospace',
            fontWeight: 900,
            fontSize: "clamp(2rem, 8vw, 5rem)",
            letterSpacing: "0.12em",
            color: "oklch(0.62 0.25 22)",
            animation: "glitchShift 0.15s steps(1) infinite",
            opacity: 0.4,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          BEAST MODE LEVEL X
        </div>

        <h1
          style={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 900,
            fontSize: "clamp(1.5rem, 6vw, 4rem)",
            letterSpacing: "0.12em",
            background:
              "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.65 0.25 22) 30%, oklch(0.62 0.24 340) 60%, oklch(0.62 0.22 295) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            margin: 0,
          }}
        >
          BEAST MODE LEVEL X
        </h1>

        <p
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)",
            color: "oklch(0.62 0.22 295)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: "0.5rem",
            textShadow: "0 0 12px oklch(0.62 0.22 295 / 0.7)",
          }}
        >
          INITIALIZING SYSTEM...
        </p>
      </div>

      {/* Progress bar container */}
      <div
        style={{
          width: "clamp(280px, 60vw, 500px)",
          opacity: phase === "entering" ? 0 : 1,
          transition: "opacity 0.4s ease 0.2s",
        }}
      >
        {/* Progress label */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            fontFamily: '"Geist Mono", monospace',
            fontSize: "0.75rem",
            color: "oklch(0.6 0.04 260)",
            letterSpacing: "0.1em",
          }}
        >
          <span>LOADING ASSETS</span>
          <span style={{ color: "oklch(0.62 0.25 22)" }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Track */}
        <div
          style={{
            height: "4px",
            background: "oklch(0.18 0.03 260)",
            borderRadius: "2px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Fill */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, oklch(0.62 0.25 22) 0%, oklch(0.62 0.22 295) 100%)",
              boxShadow:
                "0 0 8px oklch(0.62 0.25 22 / 0.8), 0 0 16px oklch(0.62 0.22 295 / 0.5)",
              transition: "width 0.04s linear",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Status dots */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1rem",
            justifyContent: "center",
          }}
        >
          {["HERO", "DASHBOARD", "LEADERBOARD", "SYSTEM"].map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.6rem",
                fontFamily: '"Geist Mono", monospace',
                letterSpacing: "0.1em",
                color:
                  progress > (i + 1) * 22
                    ? "oklch(0.62 0.25 22)"
                    : "oklch(0.4 0.02 260)",
                transition: "color 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background:
                    progress > (i + 1) * 22
                      ? "oklch(0.62 0.25 22)"
                      : "oklch(0.25 0.02 260)",
                  boxShadow:
                    progress > (i + 1) * 22
                      ? "0 0 6px oklch(0.62 0.25 22)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
