import { useAuth } from "@/components/auth/AuthProvider";
import { usePlayerProfile } from "@/hooks/useBackend";
import { Menu, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getRankInfo } from "./PlayerDashboard";

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onAccountSettings?: () => void;
  onDungeonClick?: () => void;
  onCharacterClick?: () => void;
  activeSection?: string;
  onNavClick?: (section: string) => void;
}

export function Navbar({
  onLoginClick,
  onSignupClick,
  onAccountSettings,
  onDungeonClick,
  onCharacterClick,
}: NavbarProps) {
  const { isLoggedIn, logout, identity } = useAuth();
  const { data: profile } = usePlayerProfile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", ocid: "nav.home.link", section: "home" },
    {
      label: "Trainers",
      href: "#trainers",
      ocid: "nav.trainers.link",
      section: "trainers",
    },
    {
      label: "Missions",
      href: "#trainers",
      ocid: "nav.missions.link",
      section: "trainers",
    },
    {
      label: "Martial Arts",
      href: "#martial",
      ocid: "nav.martial.link",
      section: "martial",
    },
    {
      label: "Leaderboard",
      href: "#leaderboard",
      ocid: "nav.leaderboard.link",
      section: "leaderboard",
    },
    {
      label: "Profile",
      href: "#dashboard",
      ocid: "nav.profile.link",
      section: "dashboard",
    },
  ];

  const rankInfo = profile ? getRankInfo(Number(profile.level)) : null;
  const principalShort =
    identity?.getPrincipal().toString().slice(0, 6) ?? null;

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
          ? "oklch(0.07 0.01 250 / 0.92)"
          : "oklch(0.07 0.01 250 / 0.5)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid oklch(0.62 0.25 22 / 0.2)"
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
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
            letterSpacing: "0.08em",
            textDecoration: "none",
            background:
              "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            flexShrink: 0,
          }}
        >
          BEAST MODE LEVEL X
        </a>

        {/* Desktop nav links */}
        <div
          style={{ display: "flex", gap: "0.15rem", alignItems: "center" }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.ocid}
              href={link.href}
              data-ocid={link.ocid}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.78rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "oklch(0.72 0.03 260)",
                padding: "0.4rem 0.75rem",
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
                (e.target as HTMLElement).style.color = "oklch(0.72 0.03 260)";
                (e.target as HTMLElement).style.borderColor = "transparent";
                (e.target as HTMLElement).style.background = "transparent";
                (e.target as HTMLElement).style.textShadow = "none";
              }}
            >
              {link.label}
            </a>
          ))}
          {/* DUNGEON button */}
          {onDungeonClick && (
            <button
              type="button"
              data-ocid="nav.dungeon.link"
              onClick={onDungeonClick}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.4rem 0.85rem",
                borderRadius: "4px",
                background: "oklch(0.25 0.15 22 / 0.3)",
                border: "1px solid oklch(0.62 0.25 22 / 0.5)",
                color: "oklch(0.75 0.25 22)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 0 8px oklch(0.62 0.25 22 / 0.2)",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                minHeight: "36px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.62 0.25 22 / 0.2)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 16px oklch(0.62 0.25 22 / 0.5)";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.9 0.25 22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.25 0.15 22 / 0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 8px oklch(0.62 0.25 22 / 0.2)";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.75 0.25 22)";
              }}
            >
              ⚔️ DUNGEON
            </button>
          )}
          {/* CHARACTER button */}
          {onCharacterClick && (
            <button
              type="button"
              data-ocid="nav.character.link"
              onClick={onCharacterClick}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.4rem 0.85rem",
                borderRadius: "4px",
                background: "oklch(0.15 0.1 220 / 0.3)",
                border: "1px solid oklch(0.55 0.2 220 / 0.5)",
                color: "oklch(0.7 0.2 220)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 0 8px oklch(0.55 0.2 220 / 0.2)",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                minHeight: "36px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.55 0.2 220 / 0.2)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 16px oklch(0.55 0.2 220 / 0.5)";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.9 0.2 220)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "oklch(0.15 0.1 220 / 0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 8px oklch(0.55 0.2 220 / 0.2)";
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(0.7 0.2 220)";
              }}
            >
              🎨 CHARACTER
            </button>
          )}
        </div>

        {/* Auth buttons */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          className="hidden md:flex"
        >
          {isLoggedIn ? (
            <>
              {rankInfo && profile && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.3rem 0.75rem",
                    background: "oklch(0.62 0.25 22 / 0.08)",
                    border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                    borderRadius: "6px",
                  }}
                >
                  <img
                    src={rankInfo.badgeImage}
                    alt={rankInfo.title}
                    style={{
                      width: "22px",
                      height: "22px",
                      objectFit: "contain",
                      filter: `drop-shadow(0 0 4px ${rankInfo.color.replace(")", " / 0.7)")})`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: rankInfo.color,
                      letterSpacing: "0.06em",
                    }}
                  >
                    LVL {Number(profile.level)} · {profile.username}
                  </span>
                  {principalShort && (
                    <span
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "0.58rem",
                        color: "oklch(0.45 0.03 260)",
                        letterSpacing: "0.03em",
                      }}
                    >
                      [{principalShort}...]
                    </span>
                  )}
                </div>
              )}
              {/* Account Settings button */}
              {onAccountSettings && (
                <button
                  type="button"
                  data-ocid="navbar.account_settings.button"
                  onClick={onAccountSettings}
                  title="Account Settings"
                  style={{
                    padding: "0.45rem 0.55rem",
                    background: "transparent",
                    border: "1px solid oklch(0.62 0.22 295 / 0.4)",
                    borderRadius: "4px",
                    color: "oklch(0.62 0.22 295)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    minHeight: "44px",
                    minWidth: "44px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "oklch(0.62 0.22 295 / 0.1)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 8px oklch(0.62 0.22 295 / 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <Settings size={15} />
                </button>
              )}
              <button
                type="button"
                data-ocid="nav.logout.button"
                onClick={logout}
                style={{
                  fontFamily: '"Sora", sans-serif',
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
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background =
                    "oklch(0.62 0.25 22 / 0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                data-ocid="nav.login.button"
                onClick={onLoginClick}
                style={{
                  fontFamily: '"Sora", sans-serif',
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
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background =
                    "oklch(0.62 0.22 295 / 0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                Login
              </button>
              <button
                type="button"
                data-ocid="nav.signup.button"
                onClick={onSignupClick}
                style={{
                  fontFamily: '"Sora", sans-serif',
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
                  boxShadow: "0 0 8px oklch(0.62 0.25 22 / 0.4)",
                  transition: "all 0.2s ease",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.boxShadow =
                    "0 0 16px oklch(0.62 0.25 22 / 0.7)";
                  (e.target as HTMLElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.boxShadow =
                    "0 0 8px oklch(0.62 0.25 22 / 0.4)";
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
            padding: "0.5rem 0.65rem",
            color: "oklch(0.62 0.25 22)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            minHeight: "44px",
            minWidth: "44px",
          }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
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
            gap: "0.5rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.ocid}
              href={link.href}
              data-ocid={link.ocid}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.88rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "oklch(0.75 0.03 260)",
                padding: "0.6rem 0",
                borderBottom: "1px solid oklch(0.2 0.02 260 / 0.4)",
              }}
            >
              {link.label}
            </a>
          ))}
          {/* Dungeon link mobile — prominent */}
          {onDungeonClick && (
            <button
              type="button"
              data-ocid="nav.dungeon.link"
              onClick={() => {
                onDungeonClick();
                setMenuOpen(false);
              }}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.92rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "oklch(0.85 0.25 22)",
                padding: "0.8rem 1rem",
                background: "oklch(0.25 0.15 22 / 0.3)",
                border: "1px solid oklch(0.62 0.25 22 / 0.5)",
                borderRadius: "10px",
                cursor: "pointer",
                textAlign: "left",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                minHeight: "60px",
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                boxShadow: "0 0 12px oklch(0.62 0.25 22 / 0.25)",
              }}
            >
              <span>⚔️ DUNGEON FIGHTER</span>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  color: "oklch(0.55 0.12 22)",
                  letterSpacing: "0.06em",
                }}
              >
                Turn-based RPG • Classes • Loot
              </span>
            </button>
          )}
          {/* Character Creator mobile */}
          {onCharacterClick && (
            <button
              type="button"
              data-ocid="nav.character.link"
              onClick={() => {
                onCharacterClick();
                setMenuOpen(false);
              }}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "oklch(0.7 0.2 220)",
                padding: "0.6rem 0",
                borderBottom: "1px solid oklch(0.2 0.02 260 / 0.4)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              🎨 CHARACTER CREATOR
            </button>
          )}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
            }}
          >
            {isLoggedIn ? (
              <>
                {onAccountSettings && (
                  <button
                    type="button"
                    data-ocid="navbar.account_settings.button"
                    onClick={() => {
                      onAccountSettings();
                      setMenuOpen(false);
                    }}
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      padding: "0.5rem 1rem",
                      background: "transparent",
                      border: "1px solid oklch(0.62 0.22 295 / 0.5)",
                      borderRadius: "4px",
                      color: "oklch(0.62 0.22 295)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Settings size={13} />
                    ACCOUNT
                  </button>
                )}
                <button
                  type="button"
                  data-ocid="nav.logout.button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
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
              </>
            ) : (
              <>
                <button
                  type="button"
                  data-ocid="nav.login.button"
                  onClick={() => {
                    onLoginClick();
                    setMenuOpen(false);
                  }}
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    padding: "0.5rem 1rem",
                    background: "transparent",
                    border: "1px solid oklch(0.62 0.22 295 / 0.5)",
                    borderRadius: "4px",
                    color: "oklch(0.62 0.22 295)",
                    cursor: "pointer",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    minHeight: "44px",
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  data-ocid="nav.signup.button"
                  onClick={() => {
                    onSignupClick();
                    setMenuOpen(false);
                  }}
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    padding: "0.5rem 1.2rem",
                    background:
                      "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
                    border: "1px solid oklch(0.72 0.28 22 / 0.6)",
                    borderRadius: "4px",
                    color: "oklch(0.98 0 0)",
                    cursor: "pointer",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    minHeight: "44px",
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
