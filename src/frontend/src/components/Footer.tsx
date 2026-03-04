import { SiDiscord, SiX, SiYoutube } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      id="footer"
      data-ocid="footer.section"
      style={{
        background: "oklch(0.05 0.01 255)",
        borderTop: "1px solid oklch(0.62 0.25 22 / 0.2)",
        padding: "3rem 2rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top neon divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, oklch(0.62 0.25 22 / 0.6), oklch(0.62 0.22 295 / 0.6), transparent)",
          boxShadow: "0 0 8px oklch(0.62 0.25 22 / 0.3)",
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(oklch(0.62 0.25 22 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.25 22 / 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "2rem",
          }}
          className="grid-cols-1 sm:grid-cols-3"
        >
          {/* Logo + tagline */}
          <div>
            <div
              style={{
                fontFamily: '"Orbitron", monospace',
                fontWeight: 900,
                fontSize: "1.3rem",
                letterSpacing: "0.08em",
                background:
                  "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
              }}
            >
              BEAST MODE X
            </div>
            <p
              style={{
                fontFamily: '"Orbitron", monospace',
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "oklch(0.62 0.25 22)",
                textShadow: "0 0 8px oklch(0.62 0.25 22 / 0.5)",
                textTransform: "uppercase",
              }}
            >
              BUILT FOR LEGENDS
            </p>
          </div>

          {/* Center: social links */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[
              {
                icon: SiX,
                href: "#",
                ocid: "footer.twitter.link",
                label: "X / Twitter",
                color: "oklch(0.9 0.02 260)",
              },
              {
                icon: SiDiscord,
                href: "#",
                ocid: "footer.discord.link",
                label: "Discord",
                color: "oklch(0.62 0.22 275)",
              },
              {
                icon: SiYoutube,
                href: "#",
                ocid: "footer.youtube.link",
                label: "YouTube",
                color: "oklch(0.62 0.25 22)",
              },
            ].map(({ icon: Icon, href, ocid, label, color }) => (
              <a
                key={ocid}
                href={href}
                data-ocid={ocid}
                aria-label={label}
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "oklch(0.12 0.02 260)",
                  border: "1px solid oklch(0.25 0.04 260 / 0.6)",
                  borderRadius: "8px",
                  color: "oklch(0.65 0.04 260)",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = color;
                  el.style.borderColor = `${color.replace(")", " / 0.5)")}`;
                  el.style.background = `${color.replace(")", " / 0.1)")}`;
                  el.style.boxShadow = `0 0 12px ${color.replace(")", " / 0.3)")}`;
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = "oklch(0.65 0.04 260)";
                  el.style.borderColor = "oklch(0.25 0.04 260 / 0.6)";
                  el.style.background = "oklch(0.12 0.02 260)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Right: caffeine attribution */}
          <div style={{ textAlign: "right" }}>
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.75rem",
                color: "oklch(0.5 0.04 260)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.62 0.22 295)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.5 0.04 260)";
              }}
            >
              Built with ♥ using caffeine.ai
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div
          style={{
            height: "1px",
            background: "oklch(0.2 0.02 260 / 0.8)",
            margin: "1.5rem 0",
          }}
        />

        {/* Copyright */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: "0.7rem",
              color: "oklch(0.45 0.03 260)",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            © {currentYear} BEAST MODE X. All Rights Reserved.
          </p>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.72rem",
                  color: "oklch(0.45 0.03 260)",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "oklch(0.62 0.25 22)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color =
                    "oklch(0.45 0.03 260)";
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
