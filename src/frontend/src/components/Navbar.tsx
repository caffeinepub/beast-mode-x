import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const { isLoggedIn, logout, identity } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", ocid: "navbar.home.link" },
    { label: "Dashboard", href: "#dashboard", ocid: "navbar.dashboard.link" },
    { label: "Features", href: "#features", ocid: "navbar.features.link" },
    {
      label: "Leaderboard",
      href: "#leaderboard",
      ocid: "navbar.leaderboard.link",
    },
  ];

  const principalShort = identity
    ? `${identity.getPrincipal().toString().slice(0, 10)}...`
    : null;

  return (
    <header
      data-ocid="navbar.panel"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled
          ? "oklch(0.07 0.01 250 / 0.9)"
          : "oklch(0.07 0.01 250 / 0.5)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid oklch(0.62 0.25 22 / 0.25)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px oklch(0 0 0 / 0.4)" : "none",
      }}
    >
      <nav
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          style={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 900,
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            letterSpacing: "0.08em",
            textDecoration: "none",
            background:
              "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            flexShrink: 0,
          }}
        >
          BEAST MODE X
        </a>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            alignItems: "center",
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={link.ocid}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.82rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "oklch(0.75 0.03 260)",
                padding: "0.4rem 0.85rem",
                borderRadius: "4px",
                transition: "all 0.2s ease",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.62 0.25 22)";
                (e.target as HTMLElement).style.borderColor =
                  "oklch(0.62 0.25 22 / 0.3)";
                (e.target as HTMLElement).style.background =
                  "oklch(0.62 0.25 22 / 0.07)";
                (e.target as HTMLElement).style.textShadow =
                  "0 0 8px oklch(0.62 0.25 22 / 0.6)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "oklch(0.75 0.03 260)";
                (e.target as HTMLElement).style.borderColor = "transparent";
                (e.target as HTMLElement).style.background = "transparent";
                (e.target as HTMLElement).style.textShadow = "none";
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          className="hidden md:flex"
        >
          {isLoggedIn ? (
            <>
              <span
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "0.75rem",
                  color: "oklch(0.62 0.22 295)",
                  letterSpacing: "0.05em",
                  padding: "0.3rem 0.75rem",
                  background: "oklch(0.62 0.22 295 / 0.08)",
                  border: "1px solid oklch(0.62 0.22 295 / 0.3)",
                  borderRadius: "4px",
                }}
              >
                {principalShort}
              </span>
              <button
                type="button"
                data-ocid="navbar.logout.button"
                onClick={logout}
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.45rem 1rem",
                  background: "transparent",
                  border: "1px solid oklch(0.62 0.25 22 / 0.5)",
                  borderRadius: "4px",
                  color: "oklch(0.62 0.25 22)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background =
                    "oklch(0.62 0.25 22 / 0.12)";
                  (e.target as HTMLElement).style.boxShadow =
                    "0 0 10px oklch(0.62 0.25 22 / 0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                  (e.target as HTMLElement).style.boxShadow = "none";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                data-ocid="navbar.login.button"
                onClick={onLoginClick}
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.45rem 1rem",
                  background: "transparent",
                  border: "1px solid oklch(0.62 0.22 295 / 0.5)",
                  borderRadius: "4px",
                  color: "oklch(0.62 0.22 295)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background =
                    "oklch(0.62 0.22 295 / 0.1)";
                  (e.target as HTMLElement).style.boxShadow =
                    "0 0 12px oklch(0.62 0.22 295 / 0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                  (e.target as HTMLElement).style.boxShadow = "none";
                }}
              >
                Login
              </button>
              <button
                type="button"
                data-ocid="navbar.signup.button"
                onClick={onSignupClick}
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.45rem 1.2rem",
                  background:
                    "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                  border: "1px solid oklch(0.72 0.28 22 / 0.6)",
                  borderRadius: "4px",
                  color: "oklch(0.98 0 0)",
                  cursor: "pointer",
                  boxShadow:
                    "0 0 8px oklch(0.62 0.25 22 / 0.4), 0 0 20px oklch(0.62 0.25 22 / 0.2)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.boxShadow =
                    "0 0 12px oklch(0.62 0.25 22 / 0.8), 0 0 30px oklch(0.62 0.25 22 / 0.4)";
                  (e.target as HTMLElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.boxShadow =
                    "0 0 8px oklch(0.62 0.25 22 / 0.4), 0 0 20px oklch(0.62 0.25 22 / 0.2)";
                  (e.target as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "1px solid oklch(0.62 0.25 22 / 0.4)",
            borderRadius: "4px",
            padding: "0.4rem 0.6rem",
            color: "oklch(0.62 0.25 22)",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "oklch(0.07 0.01 250 / 0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid oklch(0.62 0.25 22 / 0.2)",
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={link.ocid}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "oklch(0.75 0.03 260)",
                padding: "0.6rem 0",
                borderBottom: "1px solid oklch(0.25 0.04 260 / 0.4)",
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            {isLoggedIn ? (
              <button
                type="button"
                data-ocid="navbar.logout.button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                style={{
                  fontFamily: '"Orbitron", monospace',
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.5rem 1rem",
                  background: "transparent",
                  border: "1px solid oklch(0.62 0.25 22 / 0.5)",
                  borderRadius: "4px",
                  color: "oklch(0.62 0.25 22)",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  type="button"
                  data-ocid="navbar.login.button"
                  onClick={() => {
                    onLoginClick();
                    setMenuOpen(false);
                  }}
                  style={{
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.5rem 1rem",
                    background: "transparent",
                    border: "1px solid oklch(0.62 0.22 295 / 0.5)",
                    borderRadius: "4px",
                    color: "oklch(0.62 0.22 295)",
                    cursor: "pointer",
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  data-ocid="navbar.signup.button"
                  onClick={() => {
                    onSignupClick();
                    setMenuOpen(false);
                  }}
                  style={{
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.5rem 1.2rem",
                    background:
                      "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                    border: "1px solid oklch(0.72 0.28 22 / 0.6)",
                    borderRadius: "4px",
                    color: "oklch(0.98 0 0)",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
