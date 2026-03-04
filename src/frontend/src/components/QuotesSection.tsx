import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Hard work beats talent when talent doesn't work hard.",
    author: "Tim Notke",
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
  },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
];

function getDailyBaseIndex(): number {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return dayOfYear % QUOTES.length;
}

export function QuotesSection() {
  const [currentIndex, setCurrentIndex] = useState(getDailyBaseIndex());
  const [visible, setVisible] = useState(true);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrentIndex((index + QUOTES.length) % QUOTES.length);
      setVisible(true);
    }, 300);
  };

  const quote = QUOTES[currentIndex];

  return (
    <section
      id="quotes"
      data-ocid="quotes.section"
      style={{
        padding: "80px 2rem",
        background: "oklch(0.065 0.01 252)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.25 22 / 0.025) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 295 / 0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "300px",
          background:
            "radial-gradient(ellipse, oklch(0.62 0.22 295 / 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
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
              DAILY WISDOM
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Orbitron", monospace',
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              margin: 0,
              color: "oklch(0.9 0.02 260)",
              textShadow: "0 0 20px oklch(0.62 0.22 295 / 0.3)",
            }}
          >
            TODAY'S MOTIVATION
          </h2>
        </div>

        {/* Quote card */}
        <div
          style={{
            position: "relative",
            padding: "2.5rem 3rem",
            background: "oklch(0.1 0.015 260 / 0.8)",
            border: "1px solid oklch(0.62 0.22 295 / 0.3)",
            borderRadius: "12px",
            backdropFilter: "blur(16px)",
            boxShadow:
              "0 0 30px oklch(0.62 0.22 295 / 0.1), inset 0 0 30px oklch(0.62 0.22 295 / 0.03)",
            overflow: "hidden",
          }}
        >
          {/* Decorative quote marks */}
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1.5rem",
              fontFamily: '"Orbitron", monospace',
              fontSize: "4rem",
              fontWeight: 900,
              color: "oklch(0.62 0.22 295 / 0.15)",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            "
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "0.5rem",
              right: "1.5rem",
              fontFamily: '"Orbitron", monospace',
              fontSize: "4rem",
              fontWeight: 900,
              color: "oklch(0.62 0.25 22 / 0.15)",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            "
          </div>

          {/* Corner decoration */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, oklch(0.62 0.22 295 / 0.6), oklch(0.62 0.25 22 / 0.6), transparent)",
            }}
          />

          {/* Quote text */}
          <div
            style={{
              textAlign: "center",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
                fontStyle: "italic",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "oklch(0.88 0.02 260)",
                margin: "0 0 1.5rem",
                letterSpacing: "0.02em",
                position: "relative",
                zIndex: 1,
              }}
            >
              {quote?.text}
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "1px",
                  background: "oklch(0.62 0.25 22)",
                  boxShadow: "0 0 4px oklch(0.62 0.25 22 / 0.6)",
                }}
              />
              <span
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "oklch(0.62 0.25 22)",
                  textShadow: "0 0 6px oklch(0.62 0.25 22 / 0.6)",
                }}
              >
                {quote?.author}
              </span>
              <div
                style={{
                  width: "24px",
                  height: "1px",
                  background: "oklch(0.62 0.25 22)",
                  boxShadow: "0 0 4px oklch(0.62 0.25 22 / 0.6)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          <button
            type="button"
            data-ocid="quotes.prev.button"
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous quote"
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "oklch(0.1 0.015 260 / 0.8)",
              border: "1px solid oklch(0.62 0.22 295 / 0.4)",
              borderRadius: "50%",
              color: "oklch(0.62 0.22 295)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "oklch(0.62 0.22 295 / 0.15)";
              el.style.boxShadow = "0 0 12px oklch(0.62 0.22 295 / 0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "oklch(0.1 0.015 260 / 0.8)";
              el.style.boxShadow = "none";
            }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            {QUOTES.map((q, i) => (
              <button
                key={q.text.slice(0, 20)}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Quote ${i + 1}`}
                style={{
                  width: i === currentIndex ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background:
                    i === currentIndex
                      ? "oklch(0.62 0.22 295)"
                      : "oklch(0.3 0.03 260)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                  boxShadow:
                    i === currentIndex
                      ? "0 0 8px oklch(0.62 0.22 295 / 0.6)"
                      : "none",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            data-ocid="quotes.next.button"
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next quote"
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "oklch(0.1 0.015 260 / 0.8)",
              border: "1px solid oklch(0.62 0.22 295 / 0.4)",
              borderRadius: "50%",
              color: "oklch(0.62 0.22 295)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "oklch(0.62 0.22 295 / 0.15)";
              el.style.boxShadow = "0 0 12px oklch(0.62 0.22 295 / 0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "oklch(0.1 0.015 260 / 0.8)";
              el.style.boxShadow = "none";
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
