import { ProfileView } from "@/components/PlayerDashboard";
import { usePlayerProfile } from "@/hooks/useBackend";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { X } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { data: profile, isLoading } = usePlayerProfile();
  const { identity } = useInternetIdentity();
  const principalId = identity?.getPrincipal().toString() ?? undefined;

  if (!open) return null;

  return (
    <div
      data-ocid="profile_modal.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "oklch(0.06 0.01 255 / 0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem clamp(1rem, 4vw, 2rem)",
          borderBottom: "1px solid oklch(0.62 0.22 295 / 0.2)",
          background: "oklch(0.08 0.02 255 / 0.9)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(1rem, 3vw, 1.4rem)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background:
              "linear-gradient(135deg, oklch(0.7 0.28 22) 0%, oklch(0.62 0.22 295) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          👤 MY PROFILE
        </div>

        <button
          type="button"
          data-ocid="profile_modal.close_button"
          onClick={onClose}
          aria-label="Close profile"
          style={{
            background: "oklch(0.62 0.22 295 / 0.12)",
            border: "1px solid oklch(0.62 0.22 295 / 0.4)",
            borderRadius: "8px",
            padding: "0.55rem",
            color: "oklch(0.72 0.22 295)",
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
              "oklch(0.62 0.22 295 / 0.25)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 12px oklch(0.62 0.22 295 / 0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "oklch(0.62 0.22 295 / 0.12)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "1rem",
          }}
        >
          {isLoading ? (
            <div
              data-ocid="profile_modal.loading_state"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 2rem",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "3px solid oklch(0.62 0.22 295 / 0.2)",
                  borderTop: "3px solid oklch(0.62 0.22 295)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.85rem",
                  color: "oklch(0.55 0.05 260)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Loading Profile...
              </div>
              <style>
                {"@keyframes spin { to { transform: rotate(360deg); } }"}
              </style>
            </div>
          ) : !profile ? (
            <div
              data-ocid="profile_modal.empty_state"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 2rem",
                gap: "1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem", opacity: 0.4 }}>👤</div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "oklch(0.65 0.05 260)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                No Profile Found
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.8rem",
                  color: "oklch(0.45 0.03 260)",
                }}
              >
                Complete the onboarding to create your profile.
              </div>
            </div>
          ) : (
            <ProfileView profile={profile} principalId={principalId} />
          )}
        </div>
      </div>
    </div>
  );
}
