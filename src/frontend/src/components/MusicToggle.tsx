import { Music, VolumeX } from "lucide-react";
import { useState } from "react";

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <button
      type="button"
      data-ocid="music.toggle"
      onClick={() => setIsPlaying((prev) => !prev)}
      title={isPlaying ? "Mute music" : "Play music"}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 150,
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: "oklch(0.1 0.015 260 / 0.85)",
        border: `1px solid ${isPlaying ? "oklch(0.62 0.25 22 / 0.7)" : "oklch(0.62 0.22 295 / 0.5)"}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: isPlaying
          ? "0 0 12px oklch(0.62 0.25 22 / 0.5), 0 0 30px oklch(0.62 0.25 22 / 0.2)"
          : "0 0 8px oklch(0.62 0.22 295 / 0.25)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1.1)";
        el.style.boxShadow = isPlaying
          ? "0 0 20px oklch(0.62 0.25 22 / 0.7), 0 0 50px oklch(0.62 0.25 22 / 0.3)"
          : "0 0 16px oklch(0.62 0.22 295 / 0.4)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1)";
        el.style.boxShadow = isPlaying
          ? "0 0 12px oklch(0.62 0.25 22 / 0.5), 0 0 30px oklch(0.62 0.25 22 / 0.2)"
          : "0 0 8px oklch(0.62 0.22 295 / 0.25)";
      }}
    >
      {isPlaying ? (
        <Music
          size={20}
          style={{
            color: "oklch(0.62 0.25 22)",
            filter: "drop-shadow(0 0 4px oklch(0.62 0.25 22 / 0.8))",
            animation: "neonPulse 1.5s ease-in-out infinite",
          }}
        />
      ) : (
        <VolumeX
          size={20}
          style={{
            color: "oklch(0.62 0.22 295)",
            filter: "drop-shadow(0 0 4px oklch(0.62 0.22 295 / 0.6))",
          }}
        />
      )}
    </button>
  );
}
