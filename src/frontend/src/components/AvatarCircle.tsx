import { AVATAR_OPTIONS } from "@/utils/gameUtils";

interface AvatarCircleProps {
  avatarIndex: number;
  size?: number;
  showBorder?: boolean;
}

export function AvatarCircle({
  avatarIndex,
  size = 60,
  showBorder = true,
}: AvatarCircleProps) {
  const avatar = AVATAR_OPTIONS[avatarIndex] ?? AVATAR_OPTIONS[0]!;
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: avatar.gradient,
        border: showBorder ? `2px solid ${avatar.border}` : "none",
        boxShadow: showBorder ? avatar.glow : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: '"Sora", sans-serif',
        fontSize: `${size * 0.4}px`,
        fontWeight: 900,
        color: "oklch(0.98 0 0)",
        textShadow: `0 0 ${size * 0.15}px oklch(0 0 0 / 0.5)`,
        letterSpacing: "0",
        userSelect: "none",
      }}
    >
      {avatar.letter}
    </div>
  );
}

interface AvatarSelectorProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function AvatarSelector({
  selectedIndex,
  onSelect,
}: AvatarSelectorProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: "oklch(0.55 0.04 260)",
          marginBottom: "0.65rem",
          textTransform: "uppercase",
        }}
      >
        ◆ CHOOSE AVATAR
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {AVATAR_OPTIONS.map((av) => {
          const isSelected = av.index === selectedIndex;
          return (
            <button
              key={av.index}
              type="button"
              data-ocid={`avatar.option.${av.index + 1}`}
              onClick={() => onSelect(av.index)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: av.gradient,
                border: isSelected
                  ? `2px solid ${av.border}`
                  : "2px solid oklch(0.25 0.03 260 / 0.4)",
                boxShadow: isSelected ? av.glow : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontFamily: '"Sora", sans-serif',
                fontSize: "1rem",
                fontWeight: 900,
                color: "oklch(0.98 0 0)",
                transition: "all 0.2s ease",
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                outline: "none",
              }}
              aria-pressed={isSelected}
              aria-label={`Avatar ${av.letter}`}
            >
              {av.letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
