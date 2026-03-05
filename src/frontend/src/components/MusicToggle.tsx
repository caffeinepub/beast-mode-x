import { Music, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MUSIC_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=epic-cinematic-atmosphere-10076.mp3";

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showVolume, setShowVolume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const initialVolume = 0.4;
    const audio = new Audio();
    audio.src = MUSIC_URL;
    audio.loop = true;
    audio.volume = initialVolume;
    audio.preload = "none";
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => setIsLoading(false));
    audio.addEventListener("waiting", () => setIsLoading(true));
    audio.addEventListener("playing", () => setIsLoading(false));
    audio.addEventListener("error", () => setIsLoading(false));

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentional mount-only effect

  // Sync volume changes to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsLoading(false);
        setIsPlaying(false);
      }
    }
  };

  const handlePointerDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowVolume((prev) => !prev);
    }, 600);
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.5rem",
      }}
    >
      {/* Volume slider popover */}
      {showVolume && (
        <div
          style={{
            background: "oklch(0.1 0.015 260 / 0.95)",
            border: "1px solid oklch(0.62 0.22 295 / 0.4)",
            borderRadius: "10px",
            padding: "0.75rem",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 20px oklch(0.62 0.22 295 / 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            alignItems: "center",
            minWidth: "44px",
          }}
        >
          <span
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.55rem",
              color: "oklch(0.62 0.22 295)",
              letterSpacing: "0.1em",
              fontWeight: 700,
            }}
          >
            VOL
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              writingMode: "vertical-lr" as React.CSSProperties["writingMode"],
              direction: "rtl",
              height: "80px",
              width: "4px",
              cursor: "pointer",
              accentColor: "oklch(0.62 0.22 295)",
            }}
            aria-label="Volume"
          />
          <span
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: "0.55rem",
              color: "oklch(0.55 0.03 260)",
            }}
          >
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}

      {/* Main music button */}
      <button
        type="button"
        data-ocid="music.toggle"
        onClick={togglePlay}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        title={
          isPlaying
            ? "Pause music (hold for volume)"
            : "Play music (hold for volume)"
        }
        style={{
          position: "relative",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "oklch(0.1 0.015 260 / 0.9)",
          border: `1px solid ${isPlaying ? "oklch(0.62 0.25 22 / 0.7)" : "oklch(0.62 0.22 295 / 0.5)"}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: isPlaying
            ? "0 0 14px oklch(0.62 0.25 22 / 0.55), 0 0 32px oklch(0.62 0.25 22 / 0.22)"
            : "0 0 8px oklch(0.62 0.22 295 / 0.25)",
          transition: "all 0.3s ease",
          animation: isPlaying
            ? "neonPulseSlow 2.5s ease-in-out infinite"
            : "none",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none" as React.CSSProperties["userSelect"],
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "scale(1.1)";
          el.style.boxShadow = isPlaying
            ? "0 0 22px oklch(0.62 0.25 22 / 0.75), 0 0 50px oklch(0.62 0.25 22 / 0.3)"
            : "0 0 18px oklch(0.62 0.22 295 / 0.45)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "scale(1)";
          el.style.boxShadow = isPlaying
            ? "0 0 14px oklch(0.62 0.25 22 / 0.55), 0 0 32px oklch(0.62 0.25 22 / 0.22)"
            : "0 0 8px oklch(0.62 0.22 295 / 0.25)";
        }}
      >
        {isLoading ? (
          <div
            style={{
              width: "18px",
              height: "18px",
              border: "2px solid oklch(0.62 0.22 295 / 0.3)",
              borderTop: "2px solid oklch(0.62 0.22 295)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        ) : isPlaying ? (
          <Music
            size={20}
            style={{
              color: "oklch(0.62 0.25 22)",
              filter: "drop-shadow(0 0 5px oklch(0.62 0.25 22 / 0.9))",
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

        {/* Pulsing ring when playing */}
        {isPlaying && (
          <div
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "50%",
              border: "1px solid oklch(0.62 0.25 22 / 0.35)",
              animation: "neonPulse 1.8s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        )}
      </button>
    </div>
  );
}
