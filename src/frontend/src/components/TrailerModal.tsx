import { X } from "lucide-react";
import { useEffect } from "react";

interface TrailerModalProps {
  open: boolean;
  onClose: () => void;
}

export function TrailerModal({ open, onClose }: TrailerModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "oklch(0 0 0 / 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        animation: "fadeIn 0.25s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
    >
      <div
        data-ocid="trailer.modal"
        aria-label="Beast Mode Level X Trailer"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "900px",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid oklch(0.62 0.25 22 / 0.5)",
          boxShadow:
            "0 0 40px oklch(0.62 0.25 22 / 0.3), 0 0 80px oklch(0.62 0.22 295 / 0.15), 0 40px 80px oklch(0 0 0 / 0.7)",
          background: "oklch(0.07 0.01 255)",
          animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top neon line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.62 0.25 22), oklch(0.62 0.22 295), transparent)",
            zIndex: 10,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem 0.75rem",
            background: "oklch(0.07 0.01 255)",
          }}
        >
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.8rem",
              fontWeight: 900,
              letterSpacing: "0.2em",
              color: "oklch(0.82 0.18 85)",
              textShadow: "0 0 10px oklch(0.82 0.18 85 / 0.5)",
              textTransform: "uppercase",
            }}
          >
            ▶ BEAST MODE LEVEL X — TRAILER
          </div>

          <button
            type="button"
            data-ocid="trailer.close_button"
            onClick={onClose}
            aria-label="Close trailer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              background: "oklch(0.12 0.02 260)",
              border: "1px solid oklch(0.3 0.04 260 / 0.5)",
              cursor: "pointer",
              color: "oklch(0.7 0.04 260)",
              transition: "all 0.2s ease",
              flexShrink: 0,
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "oklch(0.62 0.25 22 / 0.15)";
              el.style.borderColor = "oklch(0.62 0.25 22 / 0.5)";
              el.style.color = "oklch(0.9 0.1 22)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "oklch(0.12 0.02 260)";
              el.style.borderColor = "oklch(0.3 0.04 260 / 0.5)";
              el.style.color = "oklch(0.7 0.04 260)";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Video container - 16:9 aspect ratio */}
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            background: "oklch(0 0 0)",
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/g-jwWYX7Jlo?autoplay=1&controls=1&rel=0&modestbranding=1"
            title="Beast Mode Level X Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>

        {/* Bottom corner glow decoration */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.62 0.22 295 / 0.4), transparent)",
          }}
        />
      </div>
    </div>
  );
}
