import { useState } from "react";
import { WEAPONS, useGameStore } from "./GameStore";
import { InventoryModal } from "./InventoryModal";

interface GameHUDProps {
  onAttack: () => void;
  onSpecial: () => void;
  onDodge: () => void;
  onEnterDungeon: () => void;
  onExitDungeon: () => void;
  onBack: () => void;
  xpFloats: Array<{ id: number; value: number; x: number; y: number }>;
}

export function GameHUD({
  onAttack,
  onSpecial,
  onDodge,
  onEnterDungeon,
  onExitDungeon,
  onBack,
  xpFloats,
}: GameHUDProps) {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const {
    playerHP,
    maxPlayerHP,
    playerMana,
    maxPlayerMana,
    gold,
    wave,
    currentZone,
    gameLevel,
    sessionXP,
    kills,
    equippedWeapon,
    gameXP,
    isGameOver,
    resetHP,
  } = useGameStore();

  const hpPercent = (playerHP / maxPlayerHP) * 100;
  const manaPercent = (playerMana / maxPlayerMana) * 100;
  const xpForNextLevel = gameLevel ** 2 * 50;
  const xpForCurrentLevel = (gameLevel - 1) ** 2 * 50;
  const xpProgress =
    ((gameXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  const weaponInfo = WEAPONS[equippedWeapon];

  return (
    <>
      {/* Main HUD overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
          fontFamily: '"Sora", sans-serif',
        }}
      >
        {/* Top-left: HP + Mana + Gold */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            pointerEvents: "none",
          }}
        >
          {/* HP Bar */}
          <div
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,0,51,0.4)",
              borderRadius: "6px",
              padding: "5px 10px",
              minWidth: "160px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,100,100,0.9)",
                  fontWeight: 700,
                }}
              >
                ❤️ HP
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255,150,150,0.9)",
                  fontWeight: 700,
                }}
              >
                {playerHP}/{maxPlayerHP}
              </span>
            </div>
            <div
              style={{
                height: "6px",
                background: "rgba(255,0,0,0.2)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${hpPercent}%`,
                  background:
                    hpPercent > 50
                      ? "linear-gradient(90deg, #ff2200, #ff6600)"
                      : hpPercent > 25
                        ? "linear-gradient(90deg, #ff6600, #ffaa00)"
                        : "#ff0000",
                  borderRadius: "3px",
                  boxShadow: "0 0 6px rgba(255,0,0,0.5)",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(0,100,255,0.4)",
              borderRadius: "6px",
              padding: "5px 10px",
              minWidth: "160px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: "rgba(100,150,255,0.9)",
                  fontWeight: 700,
                }}
              >
                💙 MANA
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(150,200,255,0.9)",
                  fontWeight: 700,
                }}
              >
                {playerMana}/{maxPlayerMana}
              </span>
            </div>
            <div
              style={{
                height: "6px",
                background: "rgba(0,0,255,0.2)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${manaPercent}%`,
                  background: "linear-gradient(90deg, #0044ff, #00aaff)",
                  borderRadius: "3px",
                  boxShadow: "0 0 6px rgba(0,100,255,0.5)",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          </div>

          {/* Gold */}
          <div
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,200,0,0.3)",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "rgba(255,200,0,0.9)",
            }}
          >
            💰 {gold} Gold
          </div>

          {/* Current weapon */}
          {weaponInfo && (
            <div
              style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${weaponInfo.color}44`,
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: weaponInfo.color,
              }}
            >
              {weaponInfo.icon} {weaponInfo.name}
            </div>
          )}
        </div>

        {/* Top-center: Level + XP */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(157,0,255,0.5)",
              borderRadius: "8px",
              padding: "6px 16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "#9d00ff",
                textShadow: "0 0 8px rgba(157,0,255,0.7)",
              }}
            >
              LEVEL {gameLevel}
            </div>
            <div
              style={{
                height: "4px",
                width: "100px",
                background: "rgba(157,0,255,0.2)",
                borderRadius: "2px",
                overflow: "hidden",
                marginTop: "3px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, Math.max(0, xpProgress))}%`,
                  background: "linear-gradient(90deg, #9d00ff, #ff00ff)",
                  borderRadius: "2px",
                  boxShadow: "0 0 6px rgba(157,0,255,0.7)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div
              style={{
                fontSize: "0.58rem",
                color: "rgba(200,150,255,0.7)",
                marginTop: "2px",
              }}
            >
              +{sessionXP} XP · {kills} kills
            </div>
          </div>
        </div>

        {/* Top-right: Wave + Zone */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              background:
                currentZone === "dungeon"
                  ? "rgba(255,0,0,0.15)"
                  : "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              border:
                currentZone === "dungeon"
                  ? "1px solid rgba(255,0,0,0.6)"
                  : "1px solid rgba(0,255,255,0.3)",
              borderRadius: "6px",
              padding: "5px 12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                fontWeight: 700,
                color:
                  currentZone === "dungeon"
                    ? "rgba(255,100,100,0.9)"
                    : "rgba(0,255,255,0.8)",
              }}
            >
              {currentZone === "dungeon" ? "⚔️ DUNGEON" : "🌍 NORMAL"}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 900,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              WAVE {wave}
            </div>
          </div>

          {/* Back button */}
          <button
            type="button"
            data-ocid="game.back.button"
            onClick={onBack}
            style={{
              pointerEvents: "all",
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: "0.62rem",
              letterSpacing: "0.08em",
              padding: "6px 12px",
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              touchAction: "manipulation",
              minHeight: "36px",
            }}
          >
            ← BACK
          </button>
        </div>

        {/* XP floating numbers */}
        {xpFloats.map((xp) => (
          <div
            key={xp.id}
            style={{
              position: "absolute",
              left: `${xp.x}px`,
              top: `${xp.y}px`,
              pointerEvents: "none",
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "1rem",
              color: "#00ff88",
              textShadow: "0 0 8px rgba(0,255,136,0.8)",
              animation: "xpFloat 1.5s ease-out forwards",
              zIndex: 20,
            }}
          >
            +{xp.value} XP
          </div>
        ))}

        {/* Bottom-right: Attack buttons */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "flex-end",
            pointerEvents: "all",
          }}
        >
          {/* Inventory + Zone buttons row */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Inventory */}
            <button
              type="button"
              data-ocid="game.inventory.button"
              onClick={() => setInventoryOpen(true)}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,200,0,0.5)",
                boxShadow: "0 0 10px rgba(255,200,0,0.2)",
                cursor: "pointer",
                fontSize: "1.3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "manipulation",
              }}
            >
              🎒
            </button>

            {/* Dodge */}
            <button
              type="button"
              data-ocid="game.dodge.button"
              onClick={onDodge}
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.7)",
                border: "1px solid rgba(0,255,255,0.5)",
                boxShadow: "0 0 12px rgba(0,255,255,0.2)",
                cursor: "pointer",
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "0.55rem",
                letterSpacing: "0.05em",
                color: "#00ffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                touchAction: "manipulation",
              }}
            >
              ⚡
              <span style={{ fontSize: "0.48rem", marginTop: "2px" }}>
                DODGE
              </span>
            </button>
          </div>

          {/* Special + Attack row */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Special attack */}
            <button
              type="button"
              data-ocid="game.special.button"
              onClick={onSpecial}
              style={{
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 40% 40%, rgba(157,0,255,0.5), rgba(157,0,255,0.15))",
                border: "2px solid rgba(157,0,255,0.7)",
                boxShadow:
                  "0 0 20px rgba(157,0,255,0.5), inset 0 0 10px rgba(157,0,255,0.2)",
                cursor: "pointer",
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "0.6rem",
                letterSpacing: "0.05em",
                color: "#cc77ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                touchAction: "manipulation",
              }}
            >
              💜
              <span style={{ fontSize: "0.5rem", marginTop: "2px" }}>
                SKILL
              </span>
            </button>

            {/* Main attack */}
            <button
              type="button"
              data-ocid="game.attack.button"
              onClick={onAttack}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 40% 40%, rgba(255,0,51,0.6), rgba(255,0,51,0.2))",
                border: "2px solid rgba(255,0,51,0.8)",
                boxShadow:
                  "0 0 25px rgba(255,0,51,0.6), inset 0 0 15px rgba(255,0,51,0.2)",
                cursor: "pointer",
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "0.7rem",
                letterSpacing: "0.05em",
                color: "#ff4466",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                touchAction: "manipulation",
              }}
            >
              ⚔️
              <span style={{ fontSize: "0.55rem", marginTop: "3px" }}>
                ATTACK
              </span>
            </button>
          </div>
        </div>

        {/* Bottom-center: Zone button */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "all",
          }}
        >
          {currentZone === "normal" ? (
            <button
              type="button"
              data-ocid="game.enter_dungeon.button"
              onClick={onEnterDungeon}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                padding: "10px 20px",
                background: "rgba(255,0,51,0.15)",
                border: "1px solid rgba(255,0,51,0.6)",
                borderRadius: "8px",
                color: "rgba(255,80,100,0.9)",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(255,0,51,0.3)",
                touchAction: "manipulation",
                minHeight: "44px",
              }}
            >
              🔴 ENTER DUNGEON
            </button>
          ) : (
            <button
              type="button"
              data-ocid="game.exit_dungeon.button"
              onClick={onExitDungeon}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                padding: "10px 20px",
                background: "rgba(0,255,255,0.1)",
                border: "1px solid rgba(0,255,255,0.5)",
                borderRadius: "8px",
                color: "rgba(0,255,255,0.9)",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(0,255,255,0.2)",
                touchAction: "manipulation",
                minHeight: "44px",
              }}
            >
              ↩ EXIT DUNGEON
            </button>
          )}
        </div>

        {/* Game Over overlay */}
        {isGameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              pointerEvents: "all",
              zIndex: 50,
            }}
          >
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2rem, 8vw, 4rem)",
                color: "#ff0033",
                textShadow: "0 0 30px rgba(255,0,51,0.8)",
                letterSpacing: "0.1em",
              }}
            >
              💀 DEFEATED
            </div>
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: "1rem",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Wave {wave} · {kills} Kills · +{sessionXP} XP
            </div>
            <button
              type="button"
              data-ocid="game.revive.button"
              onClick={resetHP}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                padding: "12px 32px",
                background: "linear-gradient(135deg, #ff0033, #9d00ff)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(255,0,51,0.5)",
                touchAction: "manipulation",
                minHeight: "48px",
              }}
            >
              ⚡ REVIVE & CONTINUE
            </button>
          </div>
        )}
      </div>

      <InventoryModal
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
      />

      <style>{`
        @keyframes xpFloat {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-30px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
        }
      `}</style>
    </>
  );
}
