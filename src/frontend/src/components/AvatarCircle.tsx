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
        border: showBorder ? `2px solid ${avatar.border}` : "none",
        boxShadow: showBorder ? avatar.glow : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        background: "oklch(0.08 0.015 260)",
      }}
    >
      <img
        src={avatar.image}
        alt={avatar.label}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top center",
          borderRadius: "50%",
        }}
      />
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
  const maleAvatars = AVATAR_OPTIONS.filter((av) => av.type === "male");
  const femaleAvatars = AVATAR_OPTIONS.filter((av) => av.type === "female");

  const sectionLabel = (label: string) => (
    <div
      style={{
        fontFamily: '"Sora", sans-serif',
        fontSize: "0.58rem",
        fontWeight: 700,
        letterSpacing: "0.2em",
        color: "oklch(0.45 0.04 260)",
        marginBottom: "0.4rem",
        textTransform: "uppercase",
      }}
    >
      ◆ {label}
    </div>
  );

  return (
    <div>
      <div
        style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: "oklch(0.55 0.04 260)",
          marginBottom: "0.85rem",
          textTransform: "uppercase",
        }}
      >
        ◆ CHOOSE AVATAR
      </div>

      {/* Male row */}
      <div style={{ marginBottom: "0.75rem" }}>
        {sectionLabel("Male")}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "0.5rem",
          }}
        >
          {maleAvatars.map((av) => {
            const isSelected = av.index === selectedIndex;
            return (
              <button
                key={av.index}
                type="button"
                data-ocid={`avatar.option.${av.index + 1}`}
                onClick={() => onSelect(av.index)}
                title={av.label}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: isSelected
                    ? `2px solid ${av.border}`
                    : "2px solid oklch(0.25 0.03 260 / 0.4)",
                  boxShadow: isSelected ? av.glow : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.18)" : "scale(1)",
                  outline: "none",
                  overflow: "hidden",
                  padding: 0,
                  background: "oklch(0.08 0.015 260)",
                }}
                aria-pressed={isSelected}
                aria-label={av.label}
              >
                <img
                  src={av.image}
                  alt={av.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Female row */}
      <div>
        {sectionLabel("Female")}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "0.5rem",
          }}
        >
          {femaleAvatars.map((av) => {
            const isSelected = av.index === selectedIndex;
            return (
              <button
                key={av.index}
                type="button"
                data-ocid={`avatar.option.${av.index + 1}`}
                onClick={() => onSelect(av.index)}
                title={av.label}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: isSelected
                    ? `2px solid ${av.border}`
                    : "2px solid oklch(0.25 0.03 260 / 0.4)",
                  boxShadow: isSelected ? av.glow : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.18)" : "scale(1)",
                  outline: "none",
                  overflow: "hidden",
                  padding: 0,
                  background: "oklch(0.08 0.015 260)",
                }}
                aria-pressed={isSelected}
                aria-label={av.label}
              >
                <img
                  src={av.image}
                  alt={av.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
