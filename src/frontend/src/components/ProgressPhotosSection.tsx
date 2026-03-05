import { Camera } from "lucide-react";

const SLOTS = [
  { label: "WEEK 1", subtitle: "The Beginning", icon: "🌱" },
  { label: "WEEK 4", subtitle: "First Changes", icon: "⚡" },
  { label: "WEEK 12", subtitle: "Transformation", icon: "🔥" },
];

export function ProgressPhotosSection() {
  return (
    <section
      id="progress-photos"
      data-ocid="progress.section"
      style={{
        padding: "80px 2rem",
        background: "oklch(0.065 0.01 260)",
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
            "linear-gradient(oklch(0.62 0.25 22 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "500px",
          background:
            "radial-gradient(ellipse, oklch(0.62 0.25 22 / 0.04) 0%, oklch(0.62 0.22 295 / 0.02) 50%, transparent 70%)",
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
              padding: "0.25rem 0.85rem",
              background: "oklch(0.62 0.25 22 / 0.1)",
              border: "1px solid oklch(0.62 0.25 22 / 0.35)",
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
              VISUAL JOURNEY
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
              letterSpacing: "0.06em",
              margin: "0 0 0.75rem",
              background:
                "linear-gradient(135deg, oklch(0.82 0.18 85) 0%, oklch(0.62 0.25 22) 50%, oklch(0.62 0.22 295) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TRANSFORMATION JOURNEY
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.9rem",
              color: "oklch(0.55 0.04 260)",
            }}
          >
            Document your journey. Every photo tells your story.
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto 3rem",
            padding: "1.25rem 1.5rem",
            background: "oklch(0.09 0.015 260 / 0.8)",
            border: "1px solid oklch(0.62 0.25 22 / 0.25)",
            borderRadius: "12px",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "oklch(0.62 0.25 22)",
                letterSpacing: "0.1em",
              }}
            >
              0% STARTED
            </span>
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "oklch(0.82 0.18 85)",
                letterSpacing: "0.1em",
              }}
            >
              BEAST MODE 100%
            </span>
          </div>
          <div
            style={{
              height: "8px",
              background: "oklch(0.15 0.02 260)",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Animated shimmer bar */}
            <div
              style={{
                height: "100%",
                width: "5%",
                background:
                  "linear-gradient(90deg, oklch(0.62 0.25 22), oklch(0.82 0.18 85))",
                borderRadius: "4px",
                boxShadow: "0 0 8px oklch(0.62 0.25 22 / 0.5)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "20px",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.98 0 0 / 0.3))",
                  animation: "neonPulse 1.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "0.5rem",
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.65rem",
              color: "oklch(0.45 0.03 260)",
            }}
          >
            Your transformation starts with the first step
          </div>
        </div>

        {/* Photo slots */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
          className="grid grid-cols-1 sm:grid-cols-3"
        >
          {SLOTS.map((slot, idx) => (
            <div
              key={slot.label}
              data-ocid={`progress.photo.card.${idx + 1}`}
              style={{
                position: "relative",
                borderRadius: "14px",
                overflow: "hidden",
                border: `1px dashed oklch(0.62 0.25 22 / ${idx === 0 ? "0.4" : "0.2"})`,
                background: "oklch(0.09 0.015 260)",
                transition: "all 0.35s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "oklch(0.62 0.25 22 / 0.6)";
                el.style.boxShadow = "0 0 20px oklch(0.62 0.25 22 / 0.1)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `oklch(0.62 0.25 22 / ${idx === 0 ? "0.4" : "0.2"})`;
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Week label banner */}
              <div
                style={{
                  padding: "0.6rem 1rem",
                  background:
                    idx === 0
                      ? "oklch(0.62 0.25 22 / 0.15)"
                      : "oklch(0.07 0.01 260 / 0.8)",
                  borderBottom: `1px dashed oklch(0.62 0.25 22 / ${idx === 0 ? "0.35" : "0.15"})`,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1rem" }}>{slot.icon}</span>
                <div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.78rem",
                      fontWeight: 900,
                      letterSpacing: "0.15em",
                      color:
                        idx === 0
                          ? "oklch(0.82 0.18 85)"
                          : "oklch(0.55 0.04 260)",
                    }}
                  >
                    {slot.label}
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      color: "oklch(0.45 0.03 260)",
                    }}
                  >
                    {slot.subtitle}
                  </div>
                </div>
              </div>

              {/* Photo placeholder area */}
              <div
                style={{
                  aspectRatio: "3/4",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  padding: "2rem 1.25rem",
                  background:
                    "radial-gradient(ellipse at 50% 30%, oklch(0.62 0.25 22 / 0.04) 0%, transparent 60%)",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "oklch(0.62 0.25 22 / 0.1)",
                    border: "1px dashed oklch(0.62 0.25 22 / 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation:
                      idx === 0 ? "neonPulse 2s ease-in-out infinite" : "none",
                  }}
                >
                  <Camera
                    size={24}
                    style={{
                      color:
                        idx === 0
                          ? "oklch(0.62 0.25 22)"
                          : "oklch(0.35 0.03 260)",
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.72rem",
                      color:
                        idx === 0
                          ? "oklch(0.6 0.04 260)"
                          : "oklch(0.4 0.03 260)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Your Progress Photo
                  </div>
                  <div
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.6rem",
                      color: "oklch(0.35 0.02 260)",
                      lineHeight: 1.4,
                    }}
                  >
                    {idx === 0
                      ? "Take your first photo today!"
                      : "Unlock by completing missions"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon badge + quote */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.6rem 1.25rem",
              background: "oklch(0.82 0.18 85 / 0.08)",
              border: "1px solid oklch(0.82 0.18 85 / 0.3)",
              borderRadius: "100px",
              marginBottom: "1.25rem",
              boxShadow: "0 0 15px oklch(0.82 0.18 85 / 0.1)",
              animation: "neonPulse 3s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>✨</span>
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "oklch(0.82 0.18 85)",
              }}
            >
              COMING SOON: Upload your progress photos
            </span>
          </div>

          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.85rem",
              color: "oklch(0.5 0.03 260)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            "The transformation you fear most is the one that will set you free.
            Document every step — your future self will thank you."
          </p>
        </div>
      </div>
    </section>
  );
}
