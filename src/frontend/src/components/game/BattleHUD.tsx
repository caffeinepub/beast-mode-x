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
  availableCards: AttackCard[];
  playerManaForCards: number;
  gold: number;
  wave: number;
  currentZone: "normal" | "dungeon";
  gameLevel: number;
}

// ─── HP Bar ───────────────────────────────────────────────────────────────────
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
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${isEnemy ? "rgba(255,0,51,0.5)" : "rgba(0,255,255,0.5)"}`,
        borderRadius: "10px",
        padding: "8px 14px",
        minWidth: "min(160px, 42vw)",
        maxWidth: "200px",
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
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: isEnemy ? "rgba(255,120,120,0.9)" : "rgba(100,220,255,0.9)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: barColor,
          }}
        >
          {Math.max(0, current)}/{max}
        </span>
      </div>
      <div
        style={{
          height: "12px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "6px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            borderRadius: "5px",
            boxShadow: `0 0 8px ${barColor}88`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── Rarity colors ─────────────────────────────────────────────────────────────
const RARITY_COLORS: Record<string, string> = {
  common: "#aaaaaa",
  rare: "#4488ff",
  epic: "#9d00ff",
  legendary: "#ff8800",
};

// ─── Rarity badge dot ─────────────────────────────────────────────────────────
function RarityDot({ rarity }: { rarity: string }) {
  const isLegendary = rarity === "legendary";
  const color =
    rarity === "legendary"
      ? "#ff8800"
      : rarity === "epic"
        ? "#9d00ff"
        : rarity === "rare"
          ? "#4488ff"
          : "#888888";

  return (
    <div
      style={{
        position: "absolute",
        top: 5,
        right: 5,
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 ${isLegendary ? 8 : 4}px ${color}`,
        animation: isLegendary
          ? "legendaryPulse 1.2s ease-in-out infinite"
          : "none",
      }}
    />
  );
}

// ─── Attack Card ──────────────────────────────────────────────────────────────
function AttackCardItem({
  card,
  index,
  disabled,
  noMana,
  locked,
  onClick,
}: {
  card: AttackCard;
  index: number;
  disabled: boolean;
  noMana: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  const rarityColor = RARITY_COLORS[card.rarity] || "#aaaaaa";
  const cardColor = card.color;
  const isDisabled = disabled || locked;

  return (
    <button
      type="button"
      data-ocid={`battle.card.button.${index + 1}`}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        fontFamily: '"Sora", sans-serif',
        cursor: isDisabled ? "not-allowed" : "pointer",
        background: isDisabled ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.82)",
        backdropFilter: "blur(8px)",
        border: `2px solid ${isDisabled ? "rgba(100,100,100,0.3)" : `${cardColor}88`}`,
        borderRadius: "10px",
        padding: "8px 6px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        opacity: isDisabled ? 0.45 : 1,
        transition: "all 0.15s ease",
        boxShadow: isDisabled
          ? "none"
          : `0 0 12px ${cardColor}40, inset 0 0 8px ${cardColor}0d`,
        touchAction: "manipulation",
        minHeight: "clamp(64px, 12vw, 80px)",
        minWidth: "clamp(64px, 12vw, 80px)",
        flex: 1,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
          e.currentTarget.style.background = `${cardColor}22`;
          e.currentTarget.style.boxShadow = `0 0 20px ${cardColor}66, inset 0 0 12px ${cardColor}22`;
          e.currentTarget.style.borderColor = cardColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "rgba(0,0,0,0.82)";
          e.currentTarget.style.boxShadow = `0 0 12px ${cardColor}40, inset 0 0 8px ${cardColor}0d`;
          e.currentTarget.style.borderColor = `${cardColor}88`;
        }
      }}
    >
      {locked ? (
        <>
          <span style={{ fontSize: "1.2rem" }}>🔒</span>
          <span
            style={{
              fontSize: "0.5rem",
              color: "#666",
              letterSpacing: "0.05em",
            }}
          >
            LV {card.minLevel}+
          </span>
        </>
      ) : (
        <>
          {/* Rarity glow line at top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)`,
              boxShadow: `0 0 6px ${rarityColor}`,
            }}
          />
          {/* Rarity dot badge */}
          <RarityDot rarity={card.rarity} />

          <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{card.icon}</span>
          <span
            style={{
              fontSize: "0.52rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: noMana ? "#666" : cardColor,
              textShadow: noMana ? "none" : `0 0 6px ${cardColor}88`,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {card.name}
          </span>
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 900,
              color: card.color,
              textShadow: `0 0 6px ${card.color}88`,
            }}
          >
            {card.damage} DMG
          </span>
          <span
            style={{
              fontSize: "0.48rem",
              color: noMana ? "#ff4444" : "rgba(100,200,255,0.8)",
            }}
          >
            {card.manaCost === 0 ? "FREE" : `${card.manaCost} MP`}
            {card.hitCount && card.hitCount > 1 ? ` ×${card.hitCount}` : ""}
          </span>
        </>
      )}
    </button>
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
        top: "35%",
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
          fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
          letterSpacing: "0.12em",
          color,
          textShadow: `0 0 20px ${color}, 0 0 40px ${color}88`,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          border: `2px solid ${color}66`,
          borderRadius: "12px",
          padding: "0.5rem 2rem",
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
        background: "rgba(180,0,0,0.15)",
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
          fontSize: "clamp(2rem, 8vw, 4rem)",
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
  const logRef = useRef<HTMLDivElement>(null);
  const [showBossIntro, setShowBossIntro] = useState(false);
  const prevPhaseRef = useRef<string>("");

  // Auto scroll battle log
  // biome-ignore lint/correctness/useExhaustiveDependencies: ref mutation is intentional
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleLog]);

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

  const isCardDisabled = !isPlayerTurn || battlePhase === "animating";

  return (
    <>
      {/* Main HUD container — pointer-events none on wrapper */}
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
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
          }}
        >
          <div
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(255,120,120,0.8)",
              marginBottom: "4px",
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
            top: "12px",
            right: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
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
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0,100,255,0.4)",
              borderRadius: "8px",
              padding: "5px 10px",
              minWidth: "160px",
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
                  fontSize: "0.58rem",
                  color: "rgba(100,150,255,0.9)",
                  fontWeight: 700,
                }}
              >
                💙 MP
              </span>
              <span
                style={{
                  fontSize: "0.58rem",
                  color: "rgba(150,200,255,0.9)",
                  fontWeight: 700,
                }}
              >
                {playerMana}/{maxPlayerMana}
              </span>
            </div>
            <div
              style={{
                height: "8px",
                background: "rgba(0,0,255,0.15)",
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
                  boxShadow: "0 0 6px rgba(0,100,255,0.5)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Wave + Gold info */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              fontSize: "0.6rem",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(157,0,255,0.4)",
                borderRadius: "6px",
                padding: "3px 8px",
                color: "#9d00ff",
              }}
            >
              LV {gameLevel}
            </span>
            <span
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,200,0,0.3)",
                borderRadius: "6px",
                padding: "3px 8px",
                color: "#ffaa00",
              }}
            >
              💰 {gold}
            </span>
            <span
              style={{
                background:
                  currentZone === "dungeon"
                    ? "rgba(255,0,0,0.15)"
                    : "rgba(0,0,0,0.6)",
                border:
                  currentZone === "dungeon"
                    ? "1px solid rgba(255,0,0,0.5)"
                    : "1px solid rgba(0,255,255,0.3)",
                borderRadius: "6px",
                padding: "3px 8px",
                color: currentZone === "dungeon" ? "#ff6666" : "#00ffff",
              }}
            >
              {currentZone === "dungeon" ? "⚔️" : "🌍"} W{wave}
            </span>
          </div>
        </div>

        {/* ── Center: Turn Banner ── */}
        <TurnBanner battlePhase={battlePhase} />

        {/* ── Bottom Left: Battle Log ── */}
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "12px",
            width: "min(260px, 45vw)",
          }}
        >
          <div
            ref={logRef}
            style={{
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              padding: "8px 10px",
              maxHeight: "80px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {battleLog.length === 0 ? (
              <span
                style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)" }}
              >
                Battle log...
              </span>
            ) : (
              battleLog.slice(-3).map((log) => (
                <div
                  key={log}
                  style={{
                    fontSize: "0.58rem",
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
        </div>

        {/* ── Bottom Right: Attack Cards + Flee + Potion ── */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            pointerEvents: "all",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "flex-end",
          }}
        >
          {/* Cards 2x2 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              width: "min(200px, 44vw)",
            }}
          >
            {availableCards.slice(0, 4).map((card, i) => (
              <AttackCardItem
                key={card.id}
                card={card}
                index={i}
                disabled={isCardDisabled}
                noMana={playerManaForCards < card.manaCost}
                locked={gameLevel < card.minLevel}
                onClick={() => onAttack(i)}
              />
            ))}
          </div>

          {/* Utility row */}
          <div style={{ display: "flex", gap: "6px" }}>
            {/* Potion */}
            <button
              type="button"
              data-ocid="battle.potion.button"
              onClick={onPotion}
              disabled={!isPlayerTurn}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.06em",
                padding: "8px 12px",
                background: "rgba(0,80,0,0.6)",
                border: "1px solid rgba(0,200,100,0.5)",
                borderRadius: "8px",
                color: isPlayerTurn ? "#00ff88" : "#555",
                cursor: isPlayerTurn ? "pointer" : "not-allowed",
                touchAction: "manipulation",
                minHeight: "36px",
                opacity: isPlayerTurn ? 1 : 0.5,
                transition: "all 0.15s",
              }}
            >
              🧪 POTION
            </button>

            {/* Flee */}
            <button
              type="button"
              data-ocid="battle.flee.button"
              onClick={onFlee}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.06em",
                padding: "8px 12px",
                background: "rgba(80,0,0,0.5)",
                border: "1px solid rgba(255,0,51,0.4)",
                borderRadius: "8px",
                color: "rgba(255,100,100,0.8)",
                cursor: "pointer",
                touchAction: "manipulation",
                minHeight: "36px",
                transition: "all 0.15s",
              }}
            >
              🏃 FLEE
            </button>
          </div>
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
        @keyframes legendaryPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #ff8800; transform: scale(1); }
          50% { opacity: 0.6; box-shadow: 0 0 16px #ff8800, 0 0 24px #ff880066; transform: scale(1.3); }
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
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 80,
        fontFamily: '"Sora", sans-serif',
        pointerEvents: "all",
        gap: "1rem",
      }}
    >
      <div
        style={{
          fontSize: "clamp(2rem, 8vw, 3.5rem)",
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
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.08em",
        }}
      >
        Wave {wave} cleared!
      </div>

      {/* Rewards */}
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,200,0,0.4)",
          borderRadius: "12px",
          padding: "1rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          minWidth: "200px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
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
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "1.1rem", fontWeight: 900, color: "#00ff88" }}
            >
              +{xpEarned}
            </div>
            <div
              style={{
                fontSize: "0.55rem",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
              }}
            >
              XP
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "1.1rem", fontWeight: 900, color: "#ffaa00" }}
            >
              +{goldEarned}
            </div>
            <div
              style={{
                fontSize: "0.55rem",
                color: "rgba(255,255,255,0.4)",
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
              gap: "0.5rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "0.25rem",
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
                          : "#666"
                  }66`,
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "0.6rem",
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
          gap: "0.75rem",
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
            fontSize: "0.9rem",
            letterSpacing: "0.1em",
            padding: "0.85rem 2rem",
            background: "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 0 25px rgba(255,0,51,0.5)",
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
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            padding: "0.85rem 1.5rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.5)",
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
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 80,
        fontFamily: '"Sora", sans-serif',
        pointerEvents: "all",
        gap: "1rem",
      }}
    >
      <div
        style={{
          fontSize: "clamp(2rem, 8vw, 3.5rem)",
          fontWeight: 900,
          letterSpacing: "0.1em",
          color: "#ff0033",
          textShadow: "0 0 30px rgba(255,0,51,0.8)",
        }}
      >
        💀 DEFEATED
      </div>
      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
        Wave {wave} — You were slain
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
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
            fontSize: "0.9rem",
            letterSpacing: "0.1em",
            padding: "0.85rem 2rem",
            background: "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 0 25px rgba(255,0,51,0.5)",
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
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            padding: "0.85rem 1.5rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.5)",
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
