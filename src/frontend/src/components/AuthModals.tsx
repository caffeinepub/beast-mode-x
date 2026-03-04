import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2, X } from "lucide-react";

interface AuthModalsProps {
  loginOpen: boolean;
  signupOpen: boolean;
  onCloseLogin: () => void;
  onCloseSignup: () => void;
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(0 0 0 / 0.8)",
          backdropFilter: "blur(8px)",
        }}
      />
      {children}
    </div>
  );
}

export function AuthModals({
  loginOpen,
  signupOpen,
  onCloseLogin,
  onCloseSignup,
}: AuthModalsProps) {
  const { login, isLoggingIn, isLoginError, loginError } = useAuth();

  if (!loginOpen && !signupOpen) return null;

  // Signup modal — directs to login with II
  if (signupOpen) {
    return (
      <ModalOverlay onClose={onCloseSignup}>
        <div
          data-ocid="signup.modal"
          style={{
            position: "relative",
            zIndex: 1,
            background: "oklch(0.09 0.015 260)",
            border: "1px solid oklch(0.62 0.22 295 / 0.5)",
            borderRadius: "12px",
            padding: "2.5rem",
            maxWidth: "440px",
            width: "100%",
            boxShadow:
              "0 0 30px oklch(0.62 0.22 295 / 0.15), 0 20px 60px oklch(0 0 0 / 0.5)",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            data-ocid="signup.close_button"
            onClick={onCloseSignup}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "transparent",
              border: "1px solid oklch(0.3 0.03 260 / 0.6)",
              borderRadius: "4px",
              padding: "0.3rem",
              cursor: "pointer",
              color: "oklch(0.6 0.04 260)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>

          {/* Top accent */}
          <div
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, oklch(0.62 0.22 295), transparent)",
              borderRadius: "1px",
              marginBottom: "2rem",
              opacity: 0.6,
            }}
          />

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                animation: "float 4s ease-in-out infinite",
              }}
            >
              ⚔
            </div>
            <h2
              style={{
                fontFamily: '"Orbitron", monospace',
                fontSize: "1.3rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "oklch(0.95 0.02 260)",
                marginBottom: "0.5rem",
              }}
            >
              JOIN THE BATTLE
            </h2>
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                color: "oklch(0.6 0.04 260)",
                fontSize: "0.85rem",
                lineHeight: 1.5,
              }}
            >
              Sign up with Internet Identity for a secure, decentralized gaming
              profile.
            </p>
          </div>

          <button
            type="button"
            data-ocid="signup.submit_button"
            onClick={() => {
              login();
              onCloseSignup();
            }}
            style={{
              width: "100%",
              padding: "1rem",
              fontFamily: '"Orbitron", monospace',
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background:
                "linear-gradient(135deg, oklch(0.62 0.22 295) 0%, oklch(0.55 0.22 330) 100%)",
              border: "1px solid oklch(0.72 0.22 295 / 0.5)",
              borderRadius: "6px",
              color: "oklch(0.98 0 0)",
              cursor: "pointer",
              boxShadow:
                "0 0 12px oklch(0.62 0.22 295 / 0.4), 0 0 30px oklch(0.62 0.22 295 / 0.2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.boxShadow =
                "0 0 20px oklch(0.62 0.22 295 / 0.7), 0 0 50px oklch(0.62 0.22 295 / 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.boxShadow =
                "0 0 12px oklch(0.62 0.22 295 / 0.4), 0 0 30px oklch(0.62 0.22 295 / 0.2)";
            }}
          >
            🔐 SIGN UP WITH INTERNET IDENTITY
          </button>

          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.75rem",
              color: "oklch(0.45 0.03 260)",
              textAlign: "center",
              marginTop: "1rem",
            }}
          >
            Secured by the Internet Computer Protocol
          </p>
        </div>
      </ModalOverlay>
    );
  }

  // Login modal
  return (
    <ModalOverlay onClose={onCloseLogin}>
      <div
        data-ocid="login.modal"
        style={{
          position: "relative",
          zIndex: 1,
          background: "oklch(0.09 0.015 260)",
          border: "1px solid oklch(0.62 0.25 22 / 0.5)",
          borderRadius: "12px",
          padding: "2.5rem",
          maxWidth: "420px",
          width: "100%",
          boxShadow:
            "0 0 30px oklch(0.62 0.25 22 / 0.15), 0 20px 60px oklch(0 0 0 / 0.5)",
        }}
      >
        {/* Close */}
        <button
          type="button"
          data-ocid="login.close_button"
          onClick={onCloseLogin}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "1px solid oklch(0.3 0.03 260 / 0.6)",
            borderRadius: "4px",
            padding: "0.3rem",
            cursor: "pointer",
            color: "oklch(0.6 0.04 260)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        {/* Top accent */}
        <div
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.62 0.25 22), transparent)",
            borderRadius: "1px",
            marginBottom: "2rem",
            opacity: 0.7,
          }}
        />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              filter: "drop-shadow(0 0 12px oklch(0.62 0.25 22 / 0.6))",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            🎮
          </div>
          <h2
            style={{
              fontFamily: '"Orbitron", monospace',
              fontSize: "1.3rem",
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: "oklch(0.95 0.02 260)",
              marginBottom: "0.5rem",
              textShadow: "0 0 12px oklch(0.62 0.25 22 / 0.4)",
            }}
          >
            PLAYER LOGIN
          </h2>
          <p
            style={{
              fontFamily: '"Sora", sans-serif',
              color: "oklch(0.6 0.04 260)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
            }}
          >
            Authenticate with Internet Identity to access your battle profile.
          </p>
        </div>

        {isLoginError && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "oklch(0.62 0.25 22 / 0.1)",
              border: "1px solid oklch(0.62 0.25 22 / 0.4)",
              borderRadius: "6px",
              marginBottom: "1rem",
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.8rem",
              color: "oklch(0.78 0.15 22)",
            }}
          >
            {loginError?.message ?? "Login failed. Please try again."}
          </div>
        )}

        <button
          type="button"
          data-ocid="login.submit_button"
          onClick={login}
          disabled={isLoggingIn}
          style={{
            width: "100%",
            padding: "1rem",
            fontFamily: '"Orbitron", monospace',
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: isLoggingIn
              ? "oklch(0.4 0.06 22)"
              : "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)",
            border: "1px solid oklch(0.72 0.28 22 / 0.5)",
            borderRadius: "6px",
            color: "oklch(0.98 0 0)",
            cursor: isLoggingIn ? "not-allowed" : "pointer",
            boxShadow: isLoggingIn
              ? "none"
              : "0 0 12px oklch(0.62 0.25 22 / 0.4), 0 0 30px oklch(0.62 0.25 22 / 0.2)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {isLoggingIn ? (
            <>
              <Loader2
                size={16}
                style={{ animation: "spin 1s linear infinite" }}
              />
              CONNECTING...
            </>
          ) : (
            "⚡ LOGIN WITH INTERNET IDENTITY"
          )}
        </button>

        <p
          style={{
            fontFamily: '"Sora", sans-serif',
            fontSize: "0.75rem",
            color: "oklch(0.45 0.03 260)",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          No password needed — just your Internet Identity
        </p>
      </div>
    </ModalOverlay>
  );
}
