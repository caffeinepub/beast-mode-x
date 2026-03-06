import { useEffect, useRef, useState } from "react";
import type { AttackCard } from "./GameStore";

export interface BattleHUDProps {
  playerHP: number;
  maxPlayerHP: number;
  playerMana: number;
  maxPlayerMana: number;
  enemyHP: number;
  maxEnemyHP: number;
  enemyName: string;
  isPlayerTurn: boolean;
  battlePhase:
    | "start"
    | "player_turn"
    | "enemy_turn"
    | "victory"
    | "defeat"
    | "animating"
    | "idle";
  battleLog: string[];
  onAttack: (cardIndex: number) => void;
  onPotion: () => void;
  onFlee: () => void;
  availableCards: AttackCard[]; // equipped skills (up to 6)
  playerManaForCards: number;
  gold: number;
  wave: number;
  currentZone: "normal" | "dungeon";
  gameLevel: number;
}

// ─── HP Bar ────────────────────────────────────────────────────────────────────
function HPBar({
  label,
  current,
  max,
  isEnemy,
}: {
  label: string;
  current: number;
  max: number;
  isEnemy: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const barColor = pct > 50 ? "#00cc44" : pct > 25 ? "#ffaa00" : "#ff2200";

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${isEnemy ? "rgba(255,0,51,0.5)" : "rgba(0,255,255,0.5)"}`,
        borderRadius: "10px",
        padding: "6px 10px",
        minWidth: "min(140px, 38vw)",
        maxWidth: "170px",
        fontFamily: '"Sora", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <span
          style={{
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: isEnemy ? "rgba(255,120,120,0.9)" : "rgba(100,220,255,0.9)",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: "0.58rem", fontWeight: 700, color: barColor }}>
          {Math.max(0, current)}/{max}
        </span>
      </div>
      <div
        style={{
          height: "10px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "5px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            borderRadius: "4px",
            boxShadow: `0 0 6px ${barColor}88`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── Turn Banner ──────────────────────────────────────────────────────────────
function TurnBanner({
  battlePhase,
}: {
  battlePhase: BattleHUDProps["battlePhase"];
}) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#00ff88");

  useEffect(() => {
    let t = "";
    let c = "#00ff88";

    if (battlePhase === "start") {
      t = "⚔️ BATTLE START!";
      c = "#ffaa00";
    } else if (battlePhase === "player_turn") {
      t = "⚔️ YOUR TURN";
      c = "#00ff88";
    } else if (battlePhase === "enemy_turn" || battlePhase === "animating") {
      t = "💀 ENEMY TURN";
      c = "#ff0033";
    } else if (battlePhase === "victory") {
      t = "✨ VICTORY!";
      c = "#ffaa00";
    } else if (battlePhase === "defeat") {
      t = "💀 DEFEATED";
      c = "#ff0033";
    }

    if (t) {
      setText(t);
      setColor(c);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1800);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [battlePhase]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 50,
        textAlign: "center",
        animation: "bannerFadeInOut 1.8s ease forwards",
      }}
    >
      <div
        style={{
          fontFamily: '"Sora", sans-serif',
          fontWeight: 900,
          fontSize: "clamp(1.4rem, 5vw, 2.2rem)",
          letterSpacing: "0.12em",
          color,
          textShadow: `0 0 20px ${color}, 0 0 40px ${color}88`,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          border: `2px solid ${color}66`,
          borderRadius: "10px",
          padding: "0.4rem 1.5rem",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ─── Boss Intro Overlay ───────────────────────────────────────────────────────
function BossIntroOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(180,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        pointerEvents: "none",
        animation: "bossFlash 2s ease forwards",
      }}
    >
      <div
        style={{
          fontFamily: '"Sora", sans-serif',
          fontWeight: 900,
          fontSize: "clamp(1.8rem, 7vw, 3.5rem)",
          letterSpacing: "0.1em",
          color: "#ff0033",
          textShadow: "0 0 30px #ff0033, 0 0 60px #ff003380",
          textAlign: "center",
          animation: "bossTextPulse 0.5s ease-in-out infinite",
        }}
      >
        ⚠️ BOSS APPEARS!
      </div>
    </div>
  );
}

// ─── DQ Command Menu ──────────────────────────────────────────────────────────
type CommandTab = "main" | "skills" | "items";

function CommandMenu({
  availableCards,
  playerManaForCards,
  gameLevel,
  isPlayerTurn,
  onAttack,
  onPotion,
  onFlee,
  battleLog,
}: {
  availableCards: AttackCard[];
  playerManaForCards: number;
  gameLevel: number;
  isPlayerTurn: boolean;
  onAttack: (idx: number) => void;
  onPotion: () => void;
  onFlee: () => void;
  battleLog: string[];
}) {
  const [tab, setTab] = useState<CommandTab>("main");
  const logRef = useRef<HTMLDivElement>(null);

  // Auto scroll battle log
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional ref scroll
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

  const isDisabled = !isPlayerTurn;

  // DQ main menu items
  const mainMenuItems = [
    { key: "fight", label: "FIGHT", icon: "⚔️" },
    { key: "skills", label: "SKILLS", icon: "✨" },
    { key: "items", label: "ITEMS", icon: "🎒" },
    { key: "flee", label: "FLEE", icon: "🏃" },
  ];

  const handleMainMenu = (key: string) => {
    if (isDisabled) return;
    if (key === "fight") {
      // Basic attack: first free skill or first available skill
      const freeCard = availableCards.find(
        (c) => c.manaCost === 0 && gameLevel >= c.minLevel,
      );
      const idx = freeCard ? availableCards.indexOf(freeCard) : 0;
      if (availableCards[idx]) {
        onAttack(idx);
      }
    } else if (key === "skills") {
      setTab("skills");
    } else if (key === "items") {
      setTab("items");
    } else if (key === "flee") {
      onFlee();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        pointerEvents: "all",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Battle log box — Dragon Quest style */}
      <div
        ref={logRef}
        style={{
          margin: "0 10px 6px 10px",
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "8px",
          padding: "6px 10px",
          maxHeight: "56px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          fontFamily: '"Sora", sans-serif',
        }}
      >
        {battleLog.length === 0 ? (
          <span
            style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.25)" }}
          >
            Battle log...
          </span>
        ) : (
          battleLog.slice(-3).map((log) => (
            <div
              key={log}
              style={{
                fontSize: "0.57rem",
                color: log.includes("You used")
                  ? "rgba(100,220,255,0.9)"
                  : log.includes("VICTORY") || log.includes("defeated")
                    ? "rgba(255,200,0,0.9)"
                    : log.includes("attacks")
                      ? "rgba(255,120,120,0.9)"
                      : "rgba(200,200,200,0.8)",
                fontFamily: "monospace",
                lineHeight: 1.4,
              }}
            >
              {log}
            </div>
          ))
        )}
      </div>

      {/* Command panel — DQ style */}
      <div
        style={{
          margin: "0 10px 10px 10px",
          background: "rgba(0,0,0,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "10px",
          overflow: "hidden",
          fontFamily: '"Sora", sans-serif',
        }}
      >
        {/* Tab title bar */}
        {tab !== "main" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <button
              type="button"
              data-ocid="battle.menu.back.button"
              onClick={() => setTab("main")}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                fontSize: "0.58rem",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                padding: "0 4px 0 0",
                touchAction: "manipulation",
              }}
            >
              ← BACK
            </button>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.7)",
                marginLeft: "0.4rem",
              }}
            >
              {tab === "skills" ? "✨ SKILLS" : "🎒 ITEMS"}
            </span>
            {tab === "skills" && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.52rem",
                  color: "rgba(100,180,255,0.7)",
                }}
              >
                💙 {playerManaForCards} MP
              </span>
            )}
          </div>
        )}

        {/* Main menu */}
        {tab === "main" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0",
            }}
          >
            {mainMenuItems.map((item, idx) => {
              const isTopLeft = idx === 0;
              const isTopRight = idx === 1;
              const isBottomLeft = idx === 2;
              const _isBottomRight = idx === 3;
              return (
                <button
                  key={item.key}
                  type="button"
                  data-ocid={`battle.menu.${item.key}.button`}
                  onClick={() => handleMainMenu(item.key)}
                  disabled={isDisabled}
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    padding: "0.7rem 0.5rem",
                    background: "transparent",
                    border: "none",
                    borderRight:
                      isTopLeft || isBottomLeft
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                    borderBottom:
                      isTopLeft || isTopRight
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                    color: isDisabled
                      ? "rgba(255,255,255,0.25)"
                      : item.key === "flee"
                        ? "rgba(255,120,120,0.9)"
                        : item.key === "fight"
                          ? "rgba(100,220,255,0.95)"
                          : item.key === "skills"
                            ? "rgba(200,100,255,0.95)"
                            : "rgba(255,200,0,0.9)",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    touchAction: "manipulation",
                    minHeight: "44px",
                    transition: "background 0.1s",
                    borderRadius: isTopLeft
                      ? "0"
                      : isTopRight
                        ? "0"
                        : isBottomLeft
                          ? "0 0 0 10px"
                          : "0 0 10px 0",
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Skills submenu */}
        {tab === "skills" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "190px",
              overflowY: "auto",
            }}
          >
            {availableCards.length === 0 ? (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                No skills equipped. Visit Skill Inventory to equip skills.
              </div>
            ) : (
              availableCards.map((card, i) => {
                const locked = gameLevel < card.minLevel;
                const noMana =
                  playerManaForCards < card.manaCost && card.manaCost > 0;
                const disabled = isDisabled || locked;
                const rarityColors: Record<string, string> = {
                  common: "#aaaaaa",
                  rare: "#4488ff",
                  epic: "#9d00ff",
                  legendary: "#ff8800",
                };
                const cardColor = rarityColors[card.rarity] ?? card.color;

                return (
                  <button
                    key={card.id}
                    type="button"
                    data-ocid={`battle.skill.${i + 1}.button`}
                    onClick={() => {
                      if (!disabled && !noMana) {
                        onAttack(i);
                        setTab("main");
                      }
                    }}
                    disabled={disabled || noMana}
                    style={{
                      fontFamily: '"Sora", sans-serif',
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.5rem 0.75rem",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      color: disabled
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(255,255,255,0.9)",
                      cursor: disabled || noMana ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.45 : noMana ? 0.6 : 1,
                      touchAction: "manipulation",
                      textAlign: "left",
                      width: "100%",
                      minHeight: "40px",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      if (!disabled && !noMana)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Icon */}
                    <span
                      style={{
                        fontSize: "1.2rem",
                        lineHeight: 1,
                        filter: disabled ? "grayscale(1)" : "none",
                      }}
                    >
                      {locked ? "🔒" : card.icon}
                    </span>

                    {/* Name + desc */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          color: disabled ? "rgba(150,150,150,0.5)" : cardColor,
                        }}
                      >
                        {card.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.5rem",
                          color: "rgba(255,255,255,0.35)",
                          marginTop: "1px",
                        }}
                      >
                        {locked
                          ? `Requires Level ${card.minLevel}`
                          : card.description}
                      </div>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "2px",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.62rem",
                          fontWeight: 900,
                          color: disabled ? "#555" : "#ff6666",
                        }}
                      >
                        {card.damage} DMG
                        {card.hitCount && card.hitCount > 1
                          ? ` ×${card.hitCount}`
                          : ""}
                      </span>
                      <span
                        style={{
                          fontSize: "0.52rem",
                          fontWeight: 700,
                          color:
                            card.manaCost === 0
                              ? "#00ff88"
                              : noMana
                                ? "#ff4444"
                                : "rgba(100,180,255,0.8)",
                        }}
                      >
                        {card.manaCost === 0 ? "FREE" : `${card.manaCost} MP`}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Items submenu */}
        {tab === "items" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Potion option */}
            <button
              type="button"
              data-ocid="battle.item.potion.button"
              onClick={() => {
                if (!isDisabled) {
                  onPotion();
                  setTab("main");
                }
              }}
              disabled={isDisabled}
              style={{
                fontFamily: '"Sora", sans-serif',
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 0.75rem",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                color: isDisabled
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.9)",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.45 : 1,
                touchAction: "manipulation",
                textAlign: "left",
                width: "100%",
                minHeight: "44px",
              }}
              onMouseEnter={(e) => {
                if (!isDisabled)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>🧪</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#00ff88",
                    letterSpacing: "0.04em",
                  }}
                >
                  Health Potion
                </div>
                <div
                  style={{
                    fontSize: "0.52rem",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Restore 50 HP
                </div>
              </div>
              <span
                style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)" }}
              >
                USE
              </span>
            </button>
            <div
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.55rem",
                color: "rgba(255,255,255,0.2)",
                textAlign: "center",
              }}
            >
              Check main Inventory for all items
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main BattleHUD ────────────────────────────────────────────────────────────
export function BattleHUD({
  playerHP,
  maxPlayerHP,
  playerMana,
  maxPlayerMana,
  enemyHP,
  maxEnemyHP,
  enemyName,
  isPlayerTurn,
  battlePhase,
  battleLog,
  onAttack,
  onPotion,
  onFlee,
  availableCards,
  playerManaForCards,
  gold,
  wave,
  currentZone,
  gameLevel,
}: BattleHUDProps) {
  const [showBossIntro, setShowBossIntro] = useState(false);
  const prevPhaseRef = useRef<string>("");

  // Boss intro on start when boss
  useEffect(() => {
    if (
      battlePhase === "start" &&
      prevPhaseRef.current !== "start" &&
      enemyName.includes("⚠")
    ) {
      setShowBossIntro(true);
      setTimeout(() => setShowBossIntro(false), 2500);
    }
    prevPhaseRef.current = battlePhase;
  }, [battlePhase, enemyName]);

  return (
    <>
      {/* Main HUD container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          fontFamily: '"Sora", sans-serif',
          zIndex: 10,
        }}
      >
        {/* ── Top Left: Enemy HP ── */}
        <div style={{ position: "absolute", top: "8px", left: "8px" }}>
          <div
            style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(255,120,120,0.8)",
              marginBottom: "3px",
              textShadow: "0 0 8px rgba(255,0,51,0.5)",
            }}
          >
            {enemyName}
          </div>
          <HPBar label="HP" current={enemyHP} max={maxEnemyHP} isEnemy={true} />
        </div>

        {/* ── Top Right: Player HP + Mana ── */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            alignItems: "flex-end",
          }}
        >
          <HPBar
            label="YOU"
            current={playerHP}
            max={maxPlayerHP}
            isEnemy={false}
          />
          {/* Mana bar */}
          <div
            style={{
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0,100,255,0.4)",
              borderRadius: "8px",
              padding: "5px 10px",
              minWidth: "min(140px, 38vw)",
              maxWidth: "170px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3px",
              }}
            >
              <span
                style={{
                  fontSize: "0.55rem",
                  color: "rgba(100,150,255,0.9)",
                  fontWeight: 700,
                }}
              >
                💙 MP
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  color: "rgba(150,200,255,0.9)",
                  fontWeight: 700,
                }}
              >
                {playerMana}/{maxPlayerMana}
              </span>
            </div>
            <div
              style={{
                height: "7px",
                background: "rgba(0,0,255,0.12)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.max(0, (playerMana / maxPlayerMana) * 100)}%`,
                  background: "linear-gradient(90deg, #0044ff, #00aaff)",
                  borderRadius: "4px",
                  boxShadow: "0 0 5px rgba(0,100,255,0.5)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Wave + Gold + Level info */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              fontSize: "0.52rem",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(157,0,255,0.4)",
                borderRadius: "5px",
                padding: "2px 5px",
                color: "#9d00ff",
              }}
            >
              LV {gameLevel}
            </span>
            <span
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,200,0,0.3)",
                borderRadius: "5px",
                padding: "2px 5px",
                color: "#ffaa00",
              }}
            >
              💰 {gold}
            </span>
            <span
              style={{
                background:
                  currentZone === "dungeon"
                    ? "rgba(255,0,0,0.12)"
                    : "rgba(0,0,0,0.6)",
                border:
                  currentZone === "dungeon"
                    ? "1px solid rgba(255,0,0,0.5)"
                    : "1px solid rgba(0,255,255,0.3)",
                borderRadius: "5px",
                padding: "2px 5px",
                color: currentZone === "dungeon" ? "#ff6666" : "#00ffff",
              }}
            >
              {currentZone === "dungeon" ? "⚔️" : "🌍"} W{wave}
            </span>
          </div>
        </div>

        {/* ── Center: Turn Banner ── */}
        <TurnBanner battlePhase={battlePhase} />

        {/* ── Bottom: Dragon Quest Command Menu ── */}
        <div style={{ pointerEvents: "all" }}>
          <CommandMenu
            availableCards={availableCards}
            playerManaForCards={playerManaForCards}
            gameLevel={gameLevel}
            isPlayerTurn={isPlayerTurn}
            onAttack={onAttack}
            onPotion={onPotion}
            onFlee={onFlee}
            battleLog={battleLog}
          />
        </div>
      </div>

      {/* Boss intro overlay */}
      <BossIntroOverlay show={showBossIntro} />

      <style>{`
        @keyframes bannerFadeInOut {
          0% { opacity: 0; transform: translate(-50%, -60%) scale(0.8); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          75% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -40%) scale(0.95); }
        }
        @keyframes bossFlash {
          0% { opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes bossTextPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </>
  );
}

// ─── Victory Screen ────────────────────────────────────────────────────────────
export function VictoryScreen({
  xpEarned,
  goldEarned,
  loot,
  onNextBattle,
  onFlee,
  wave,
}: {
  xpEarned: number;
  goldEarned: number;
  loot: Array<{ name: string; icon: string; rarity: string }>;
  onNextBattle: () => void;
  onFlee: () => void;
  wave: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 80,
        fontFamily: '"Sora", sans-serif',
        pointerEvents: "all",
        gap: "0.85rem",
        padding: "1rem",
      }}
    >
      <div
        style={{
          fontSize: "clamp(1.8rem, 7vw, 3rem)",
          fontWeight: 900,
          letterSpacing: "0.1em",
          color: "#ffaa00",
          textShadow: "0 0 30px rgba(255,170,0,0.8)",
        }}
      >
        ✨ VICTORY!
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.08em",
        }}
      >
        Wave {wave} cleared!
      </div>

      {/* Rewards */}
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,200,0,0.35)",
          borderRadius: "12px",
          padding: "0.85rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          minWidth: "190px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#ffaa00",
            letterSpacing: "0.1em",
          }}
        >
          REWARDS
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}
        >
          <div>
            <div
              style={{ fontSize: "1rem", fontWeight: 900, color: "#00ff88" }}
            >
              +{xpEarned}
            </div>
            <div
              style={{
                fontSize: "0.52rem",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
              }}
            >
              XP
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "1rem", fontWeight: 900, color: "#ffaa00" }}
            >
              +{goldEarned}
            </div>
            <div
              style={{
                fontSize: "0.52rem",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.08em",
              }}
            >
              GOLD
            </div>
          </div>
        </div>
        {loot.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "0.2rem",
            }}
          >
            {loot.map((item) => (
              <div
                key={item.name}
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: `1px solid ${
                    item.rarity === "legendary"
                      ? "#ff8800"
                      : item.rarity === "epic"
                        ? "#9d00ff"
                        : item.rarity === "rare"
                          ? "#4488ff"
                          : "#555"
                  }55`,
                  borderRadius: "6px",
                  padding: "3px 7px",
                  fontSize: "0.57rem",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {item.icon} {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.6rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          data-ocid="victory.next_battle.button"
          onClick={onNextBattle}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            padding: "0.8rem 1.75rem",
            background: "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 0 22px rgba(255,0,51,0.5)",
            touchAction: "manipulation",
            minHeight: "48px",
          }}
        >
          ⚔️ NEXT BATTLE
        </button>
        <button
          type="button"
          data-ocid="victory.flee.button"
          onClick={onFlee}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            padding: "0.8rem 1.4rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.45)",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "48px",
          }}
        >
          ← RETURN
        </button>
      </div>
    </div>
  );
}

// ─── Defeat Screen ─────────────────────────────────────────────────────────────
export function DefeatScreen({
  onRevive,
  onFlee,
  wave,
}: {
  onRevive: () => void;
  onFlee: () => void;
  wave: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 80,
        fontFamily: '"Sora", sans-serif',
        pointerEvents: "all",
        gap: "0.85rem",
      }}
    >
      <div
        style={{
          fontSize: "clamp(1.8rem, 7vw, 3rem)",
          fontWeight: 900,
          letterSpacing: "0.1em",
          color: "#ff0033",
          textShadow: "0 0 30px rgba(255,0,51,0.8)",
        }}
      >
        💀 DEFEATED
      </div>
      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
        Wave {wave} — You were slain
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.6rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          data-ocid="defeat.revive.button"
          onClick={onRevive}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            padding: "0.8rem 1.75rem",
            background: "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 0 22px rgba(255,0,51,0.5)",
            touchAction: "manipulation",
            minHeight: "48px",
          }}
        >
          ⚡ REVIVE & CONTINUE
        </button>
        <button
          type="button"
          data-ocid="defeat.flee.button"
          onClick={onFlee}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            padding: "0.8rem 1.4rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.45)",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "48px",
          }}
        >
          ← RETREAT
        </button>
      </div>
    </div>
  );
}
