import { useAuth } from "@/components/auth/AuthProvider";
import { useActor } from "@/hooks/useActor";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, LogOut, RefreshCw, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AccountSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type ConfirmMode = "reset" | "delete" | null;

export function AccountSettingsModal({
  open,
  onClose,
}: AccountSettingsModalProps) {
  const { identity, logout } = useAuth();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const principalId = identity?.getPrincipal().toString() ?? "";
  const truncatedId = principalId
    ? `${principalId.slice(0, 12)}...${principalId.slice(-8)}`
    : "—";

  if (!open) return null;

  const handleCopyId = async () => {
    if (!principalId) return;
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = async () => {
    if (!actor) return;
    setIsLoading(true);
    try {
      await actor.resetPlayerProgress();
      await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
      toast.success("⚡ Progress Reset", {
        description: "Your XP, missions, and achievements have been reset.",
      });
      setConfirmMode(null);
      onClose();
    } catch {
      toast.error("Failed to reset progress. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!actor) return;
    setIsLoading(true);
    try {
      await actor.deletePlayer();
      toast.success("Account deleted", {
        description: "Your account has been permanently removed.",
      });
      setConfirmMode(null);
      onClose();
      logout();
    } catch {
      toast.error("Failed to delete account. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    toast.success("Logged out", { description: "See you on the battlefield." });
  };

  return (
    <div
      data-ocid="account_settings.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !confirmMode) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !confirmMode) onClose();
      }}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(0 0 0 / 0.85)",
          backdropFilter: "blur(10px)",
        }}
      />

      {/* Modal card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "oklch(0.08 0.015 260)",
          border: "1px solid oklch(0.62 0.22 295 / 0.5)",
          borderRadius: "14px",
          padding: "2rem",
          width: "100%",
          maxWidth: "460px",
          boxShadow:
            "0 0 40px oklch(0.62 0.22 295 / 0.15), 0 24px 80px oklch(0 0 0 / 0.6)",
        }}
      >
        {/* Top neon line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.62 0.22 295), oklch(0.62 0.25 22), transparent)",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.25em",
                color: "oklch(0.62 0.22 295)",
                marginBottom: "0.25rem",
              }}
            >
              SYSTEM SETTINGS
            </div>
            <h2
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "1.2rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "oklch(0.95 0.02 260)",
                margin: 0,
              }}
            >
              ACCOUNT
            </h2>
          </div>
          <button
            type="button"
            data-ocid="account_settings.close_button"
            onClick={onClose}
            style={{
              background: "oklch(0.12 0.02 260)",
              border: "1px solid oklch(0.25 0.03 260 / 0.6)",
              borderRadius: "6px",
              padding: "0.4rem",
              cursor: "pointer",
              color: "oklch(0.55 0.04 260)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.62 0.22 295 / 0.5)";
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.62 0.22 295)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.25 0.03 260 / 0.6)";
              (e.currentTarget as HTMLElement).style.color =
                "oklch(0.55 0.04 260)";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Principal ID section */}
        <div
          style={{
            marginBottom: "1.5rem",
            padding: "1rem 1.25rem",
            background: "oklch(0.11 0.02 260 / 0.8)",
            border: "1px solid oklch(0.62 0.22 295 / 0.25)",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "oklch(0.62 0.22 295)",
              marginBottom: "0.65rem",
              textTransform: "uppercase",
            }}
          >
            🔑 LOGIN ID
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <code
              data-ocid="account_settings.id_input"
              style={{
                flex: 1,
                fontFamily: '"Geist Mono", monospace',
                fontSize: "0.75rem",
                color: "oklch(0.78 0.04 260)",
                background: "oklch(0.07 0.01 260)",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid oklch(0.2 0.02 260 / 0.6)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                letterSpacing: "0.03em",
              }}
              title={principalId}
            >
              {truncatedId}
            </code>
            <button
              type="button"
              onClick={handleCopyId}
              style={{
                flexShrink: 0,
                padding: "0.5rem",
                background: copied
                  ? "oklch(0.62 0.22 295 / 0.15)"
                  : "oklch(0.12 0.02 260)",
                border: `1px solid ${copied ? "oklch(0.62 0.22 295 / 0.5)" : "oklch(0.25 0.03 260 / 0.6)"}`,
                borderRadius: "6px",
                cursor: "pointer",
                color: copied ? "oklch(0.62 0.22 295)" : "oklch(0.55 0.04 260)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              title="Copy full ID"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div
            style={{
              marginTop: "0.5rem",
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.6rem",
              color: "oklch(0.4 0.03 260)",
              letterSpacing: "0.05em",
            }}
          >
            Your decentralized identity on the Internet Computer
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {/* Reset Progress */}
          <button
            type="button"
            data-ocid="account_settings.reset_button"
            onClick={() => setConfirmMode("reset")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.9rem 1.25rem",
              background: "oklch(0.82 0.18 85 / 0.06)",
              border: "1px solid oklch(0.82 0.18 85 / 0.25)",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              width: "100%",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.82 0.18 85 / 0.12)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.82 0.18 85 / 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.82 0.18 85 / 0.06)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.82 0.18 85 / 0.25)";
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "oklch(0.82 0.18 85 / 0.12)",
                border: "1px solid oklch(0.82 0.18 85 / 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "oklch(0.82 0.18 85)",
                flexShrink: 0,
              }}
            >
              <RefreshCw size={16} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "oklch(0.82 0.18 85)",
                  marginBottom: "0.15rem",
                }}
              >
                RESET PROGRESS
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.68rem",
                  color: "oklch(0.5 0.03 260)",
                }}
              >
                Clear XP, missions & achievements
              </div>
            </div>
          </button>

          {/* Logout */}
          <button
            type="button"
            data-ocid="account_settings.logout_button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.9rem 1.25rem",
              background: "oklch(0.62 0.22 295 / 0.06)",
              border: "1px solid oklch(0.62 0.22 295 / 0.25)",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              width: "100%",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.62 0.22 295 / 0.12)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.62 0.22 295 / 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.62 0.22 295 / 0.06)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.62 0.22 295 / 0.25)";
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "oklch(0.62 0.22 295 / 0.12)",
                border: "1px solid oklch(0.62 0.22 295 / 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "oklch(0.62 0.22 295)",
                flexShrink: 0,
              }}
            >
              <LogOut size={16} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "oklch(0.62 0.22 295)",
                  marginBottom: "0.15rem",
                }}
              >
                LOGOUT
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.68rem",
                  color: "oklch(0.5 0.03 260)",
                }}
              >
                End your session
              </div>
            </div>
          </button>

          {/* Delete Account */}
          <button
            type="button"
            data-ocid="account_settings.delete_button"
            onClick={() => setConfirmMode("delete")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.9rem 1.25rem",
              background: "oklch(0.62 0.25 22 / 0.06)",
              border: "1px solid oklch(0.62 0.25 22 / 0.25)",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              width: "100%",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.62 0.25 22 / 0.12)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.62 0.25 22 / 0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "oklch(0.62 0.25 22 / 0.06)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "oklch(0.62 0.25 22 / 0.25)";
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "oklch(0.62 0.25 22 / 0.12)",
                border: "1px solid oklch(0.62 0.25 22 / 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "oklch(0.75 0.25 22)",
                flexShrink: 0,
              }}
            >
              <Trash2 size={16} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "oklch(0.75 0.25 22)",
                  marginBottom: "0.15rem",
                }}
              >
                DELETE ACCOUNT
              </div>
              <div
                style={{
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.68rem",
                  color: "oklch(0.5 0.03 260)",
                }}
              >
                Permanently remove all data
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Confirmation dialog overlay */}
      {confirmMode && (
        <div
          data-ocid={
            confirmMode === "reset"
              ? "account_settings.reset.dialog"
              : "account_settings.delete.dialog"
          }
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "oklch(0.08 0.015 260)",
              border: `1px solid ${confirmMode === "delete" ? "oklch(0.62 0.25 22 / 0.6)" : "oklch(0.82 0.18 85 / 0.5)"}`,
              borderRadius: "12px",
              padding: "1.75rem",
              width: "100%",
              maxWidth: "380px",
              boxShadow: `0 0 30px ${confirmMode === "delete" ? "oklch(0.62 0.25 22 / 0.2)" : "oklch(0.82 0.18 85 / 0.15)"}`,
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {confirmMode === "delete" ? "⚠️" : "🔄"}
            </div>
            <h3
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.95rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "oklch(0.95 0.02 260)",
                textAlign: "center",
                marginBottom: "0.75rem",
              }}
            >
              {confirmMode === "delete" ? "DELETE ACCOUNT?" : "RESET PROGRESS?"}
            </h3>
            <p
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "0.8rem",
                color: "oklch(0.6 0.04 260)",
                textAlign: "center",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
              }}
            >
              {confirmMode === "delete"
                ? "This will permanently delete your account. This cannot be undone."
                : "This will reset all your XP, missions, and achievements. Are you sure?"}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                data-ocid={
                  confirmMode === "reset"
                    ? "account_settings.reset.cancel_button"
                    : "account_settings.delete.cancel_button"
                }
                onClick={() => setConfirmMode(null)}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "transparent",
                  border: "1px solid oklch(0.3 0.03 260 / 0.6)",
                  borderRadius: "6px",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "oklch(0.55 0.04 260)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(0.4 0.04 260)";
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.7 0.04 260)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(0.3 0.03 260 / 0.6)";
                  (e.currentTarget as HTMLElement).style.color =
                    "oklch(0.55 0.04 260)";
                }}
              >
                CANCEL
              </button>
              <button
                type="button"
                data-ocid={
                  confirmMode === "reset"
                    ? "account_settings.reset.confirm_button"
                    : "account_settings.delete.confirm_button"
                }
                onClick={confirmMode === "reset" ? handleReset : handleDelete}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background:
                    confirmMode === "delete"
                      ? "linear-gradient(135deg, oklch(0.62 0.25 22) 0%, oklch(0.55 0.22 340) 100%)"
                      : "linear-gradient(135deg, oklch(0.62 0.18 85) 0%, oklch(0.55 0.2 60) 100%)",
                  border: `1px solid ${confirmMode === "delete" ? "oklch(0.72 0.28 22 / 0.5)" : "oklch(0.82 0.18 85 / 0.5)"}`,
                  borderRadius: "6px",
                  fontFamily: '"Sora", sans-serif',
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "oklch(0.98 0 0)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  boxShadow: `0 0 10px ${confirmMode === "delete" ? "oklch(0.62 0.25 22 / 0.4)" : "oklch(0.82 0.18 85 / 0.3)"}`,
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid transparent",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    PROCESSING...
                  </>
                ) : confirmMode === "delete" ? (
                  "DELETE"
                ) : (
                  "CONFIRM RESET"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
