import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  onStartClick: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

export function HeroSection({ onStartClick }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTitleVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hexColors = ["#e8421a", "#9b30d4", "#cc2860", "#ff6030"];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    }

    function initParticles() {
      if (!canvas) return;
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      particlesRef.current = Array.from(
        { length: Math.min(count, 120) },
        () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.7 + 0.3,
          color: hexColors[Math.floor(Math.random() * hexColors.length)],
        }),
      );
    }

    function drawFrame() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha = ((120 - dist) / 120) * 0.12;
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.opacity * 0.85;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.radius * 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(drawFrame);
    }

    resize();
    drawFrame();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section
      id="home"
      data-ocid="hero.section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "oklch(0.05 0.01 250)",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Grid pattern */}
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

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.62 0.25 22 / 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Scan line overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 0.03) 2px, oklch(0 0 0 / 0.03) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Moving scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, oklch(0.62 0.25 22 / 0.12), oklch(0.62 0.22 295 / 0.12), transparent)",
          animation: "scanLine 6s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "2rem",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {/* Small label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            padding: "0.35rem 1rem",
            background: "oklch(0.62 0.25 22 / 0.1)",
            border: "1px solid oklch(0.62 0.25 22 / 0.4)",
            borderRadius: "100px",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.6s ease",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "oklch(0.62 0.25 22)",
              boxShadow: "0 0 8px oklch(0.62 0.25 22)",
              display: "inline-block",
              animation: "neonPulse 1.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "oklch(0.62 0.25 22)",
            }}
          >
            Next-Gen Gaming Platform
          </span>
        </div>

        {/* Main title */}
        <h1
          style={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 900,
            fontSize: "clamp(3rem, 12vw, 8rem)",
            letterSpacing: "0.06em",
            lineHeight: 1,
            margin: "0 0 1rem 0",
            background:
              "linear-gradient(135deg, oklch(0.82 0.18 22) 0%, oklch(0.7 0.28 22) 25%, oklch(0.65 0.25 22) 45%, oklch(0.62 0.24 340) 65%, oklch(0.62 0.22 295) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 0 20px oklch(0.62 0.25 22 / 0.5))",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible
              ? "translateY(0) scale(1)"
              : "translateY(30px) scale(0.95)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          BEAST MODE X
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "clamp(1rem, 3vw, 1.4rem)",
            fontWeight: 300,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "oklch(0.72 0.04 260)",
            marginBottom: "3rem",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.3s",
          }}
        >
          Level Up Your Reality
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.5s",
          }}
        >
          <button
            type="button"
            data-ocid="hero.start.primary_button"
            onClick={onStartClick}
            className="btn-neon-red"
            style={{
              padding: "0.9rem 2.5rem",
              fontSize: "0.85rem",
              borderRadius: "4px",
            }}
          >
            ▶ START YOUR JOURNEY
          </button>

          <button
            type="button"
            data-ocid="hero.trailer.secondary_button"
            className="btn-neon-ghost"
            style={{
              padding: "0.9rem 2rem",
              fontSize: "0.85rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ◉ WATCH TRAILER
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            marginTop: "4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            opacity: titleVisible ? 0.5 : 0,
            transition: "opacity 0.7s ease 0.9s",
          }}
        >
          <span
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "oklch(0.55 0.03 260)",
            }}
          >
            SCROLL TO EXPLORE
          </span>
          <div
            style={{
              width: "1px",
              height: "40px",
              background:
                "linear-gradient(to bottom, oklch(0.62 0.25 22 / 0.6), transparent)",
              animation: "float 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
