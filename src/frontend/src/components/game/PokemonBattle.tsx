import { useActorSafe } from "@/hooks/useActorSafe";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimeBattleScene } from "./AnimeBattleScene";
import { BattleHUD, DefeatScreen, VictoryScreen } from "./BattleHUD";
import { CharacterCreator } from "./CharacterCreator";
import { ATTACK_CARDS, useGameStore } from "./GameStore";
import { InventoryModal } from "./InventoryModal";

interface PokemonBattleProps {
  onBack: () => void;
  playerLevel?: number;
}

interface XPFloat {
  id: number;
  value: number;
}
let xpFloatCounter = 0;

// ─── Get best 4 attack cards for current level ─────────────────────────────
function getBestCards(gameLevel: number) {
  // All cards available for this level (or locked), up to 4 slots
  const allCards = [...ATTACK_CARDS];

  // Sort: available cards first by damage desc, locked cards last
  const available = allCards.filter((c) => gameLevel >= c.minLevel);
  const locked = allCards.filter((c) => gameLevel < c.minLevel);

  // Take best 3 available + 1 locked slot (preview)
  const best = available.slice(-4); // last 4 = highest level
  if (best.length < 4 && locked.length > 0) {
    best.push(locked[0]);
  }

  // Ensure we always have 4 items (pad with basics if needed)
  while (best.length < 4) {
    best.unshift(ATTACK_CARDS[0]);
  }

  return best.slice(0, 4);
}

// ─── Splash Screen ─────────────────────────────────────────────────────────────
function SplashScreen({
  onStart,
  onBack,
}: {
  onStart: () => void;
  onBack: () => void;
}) {
  const { gold, kills, gameLevel, sessionXP } = useGameStore();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [characterCreatorOpen, setCharacterCreatorOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background:
          "radial-gradient(ellipse at center, #0a0020 0%, #000000 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: '"Sora", sans-serif',
        padding: "clamp(1rem, 4vw, 2rem)",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* BG glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(157,0,255,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,0,51,0.08) 0%, transparent 50%),
            radial-gradient(circle at 60% 80%, rgba(0,255,255,0.05) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "clamp(0.65rem, 1.8vw, 0.9rem)",
            letterSpacing: "0.3em",
            color: "rgba(157,0,255,0.7)",
            marginBottom: "0.4rem",
          }}
        >
          ⚔️ BEAST MODE LEVEL X ⚔️
        </div>
        <div
          style={{
            fontSize: "clamp(2rem, 7vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            background:
              "linear-gradient(135deg, #ff0033 0%, #9d00ff 50%, #00ffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
          }}
        >
          DUNGEON
          <br />
          FIGHTER
        </div>
        <div
          style={{
            fontSize: "clamp(0.6rem, 1.4vw, 0.8rem)",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.35)",
            marginTop: "0.4rem",
          }}
        >
          TURN-BASED RPG · ANIME STYLE
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          { label: "LEVEL", value: gameLevel, icon: "⚡" },
          { label: "KILLS", value: kills, icon: "💀" },
          { label: "GOLD", value: gold, icon: "💰" },
          { label: "XP", value: sessionXP, icon: "✨" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(157,0,255,0.3)",
              borderRadius: "8px",
              padding: "0.6rem 1rem",
              textAlign: "center",
              minWidth: "70px",
            }}
          >
            <div style={{ fontSize: "1rem" }}>{stat.icon}</div>
            <div
              style={{ fontSize: "1rem", fontWeight: 900, color: "#9d00ff" }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0.6rem",
          maxWidth: "520px",
          width: "100%",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          {
            icon: "🃏",
            title: "CARD BATTLES",
            desc: "Pokemon-style turn-based combat",
          },
          {
            icon: "🏰",
            title: "BOSS DUNGEONS",
            desc: "Epic boss encounters with loot",
          },
          {
            icon: "⬆️",
            title: "LEVEL UP",
            desc: "Unlock powerful attack cards",
          },
          {
            icon: "💎",
            title: "LOOT DROPS",
            desc: "Weapons, potions & rare items",
          },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px",
              padding: "0.65rem",
              display: "flex",
              gap: "0.4rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>
              {card.icon}
            </span>
            <div>
              <div
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: "0.55rem",
                  color: "rgba(255,255,255,0.38)",
                  marginTop: "0.12rem",
                }}
              >
                {card.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          data-ocid="game.start.button"
          onClick={onStart}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 900,
            fontSize: "0.95rem",
            letterSpacing: "0.12em",
            padding: "0.9rem 2.5rem",
            background: "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: "pointer",
            boxShadow:
              "0 0 30px rgba(255,0,51,0.4), 0 0 60px rgba(157,0,255,0.2)",
            touchAction: "manipulation",
            minHeight: "52px",
            transition: "transform 0.1s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ⚔️ ENTER BATTLE
        </button>

        <button
          type="button"
          data-ocid="game.inventory.open_modal_button"
          onClick={() => setInventoryOpen(true)}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            padding: "0.9rem 1.5rem",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,200,0,0.4)",
            borderRadius: "10px",
            color: "#ffaa00",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "52px",
          }}
        >
          🎒 INVENTORY
        </button>

        <button
          type="button"
          data-ocid="game.back_to_app.button"
          onClick={onBack}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            padding: "0.9rem 1.5rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "52px",
          }}
        >
          ← BACK
        </button>
      </div>

      {/* Add Customize Character button */}
      <button
        type="button"
        data-ocid="game.character.open_modal_button"
        onClick={() => setCharacterCreatorOpen(true)}
        style={{
          fontFamily: '"Sora", sans-serif',
          fontWeight: 700,
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          padding: "0.9rem 1.5rem",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(0,170,255,0.4)",
          borderRadius: "10px",
          color: "#00aaff",
          cursor: "pointer",
          touchAction: "manipulation",
          minHeight: "52px",
          width: "100%",
          maxWidth: "320px",
          position: "relative",
          zIndex: 1,
        }}
      >
        🎨 CUSTOMIZE CHARACTER
      </button>

      <InventoryModal
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
      />
      <CharacterCreator
        open={characterCreatorOpen}
        onClose={() => setCharacterCreatorOpen(false)}
      />
    </div>
  );
}

// ─── Main PokemonBattle ────────────────────────────────────────────────────────
export function PokemonBattle({ onBack, playerLevel = 1 }: PokemonBattleProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [xpFloats, setXPFloats] = useState<XPFloat[]>([]);
  const [lastVictoryXP, setLastVictoryXP] = useState(0);
  const [lastVictoryGold, setLastVictoryGold] = useState(0);
  const [showInventory, setShowInventory] = useState(false);
  const prevBattlePhaseRef = useRef<string>("");

  const { actor } = useActorSafe();
  const {
    currentZone,
    wave,
    sessionXP,
    sessionKills,
    markXPSynced,
    lastXPSync,
    setGameLevel,
    enterDungeon,
    exitDungeon,
    nextWave,

    // Player state
    playerHP,
    maxPlayerHP,
    playerMana,
    maxPlayerMana,
    gold,
    gameLevel,

    // Turn-based state
    battlePhase,
    currentEnemy,
    battleLog,
    isPlayerAttacking,
    isEnemyAttacking,
    isPlayerHurt,
    isEnemyHurt,
    lastLoot,

    // Actions
    spawnEnemy,
    playerAttack,
    clearBattle,
    resetHP,
  } = useGameStore();

  // Sync player level from profile
  useEffect(() => {
    if (playerLevel > 1) {
      setGameLevel(playerLevel);
    }
  }, [playerLevel, setGameLevel]);

  // XP auto-sync every 30 kills
  useEffect(() => {
    const unsyncedXP = sessionXP - lastXPSync;
    if (
      actor &&
      unsyncedXP > 0 &&
      sessionKills > 0 &&
      sessionKills % 30 === 0
    ) {
      actor
        .updateMartialArtsXP(BigInt(unsyncedXP))
        .then(() => {
          markXPSynced();
          toast.success(`⚔️ +${unsyncedXP} Martial XP synced!`, {
            duration: 3000,
          });
        })
        .catch(() => {});
    }
  }, [sessionKills, sessionXP, lastXPSync, actor, markXPSynced]);

  // XP float on victory
  useEffect(() => {
    if (
      battlePhase === "victory" &&
      prevBattlePhaseRef.current !== "victory" &&
      currentEnemy
    ) {
      const id = ++xpFloatCounter;
      setLastVictoryXP(currentEnemy.xpReward);
      setLastVictoryGold(currentEnemy.goldReward);
      setXPFloats((prev) => [...prev, { id, value: currentEnemy.xpReward }]);
      setTimeout(
        () => setXPFloats((prev) => prev.filter((f) => f.id !== id)),
        2000,
      );
    }
    prevBattlePhaseRef.current = battlePhase;
  }, [battlePhase, currentEnemy]);

  const handleBack = useCallback(() => {
    // Sync XP before leaving
    if (actor && sessionXP > lastXPSync) {
      const unsyncedXP = sessionXP - lastXPSync;
      actor
        .updateMartialArtsXP(BigInt(unsyncedXP))
        .then(() => markXPSynced())
        .catch(() => {});
    }
    clearBattle();
    onBack();
  }, [actor, sessionXP, lastXPSync, markXPSynced, clearBattle, onBack]);

  // Start first battle on game start
  const handleStartGame = useCallback(() => {
    setGameStarted(true);
    clearBattle();
    // Slight delay to let scene render
    setTimeout(() => {
      spawnEnemy(1, "normal", gameLevel);
    }, 500);
  }, [clearBattle, spawnEnemy, gameLevel]);

  const handleNextBattle = useCallback(() => {
    nextWave();
    setTimeout(() => {
      const s = useGameStore.getState();
      spawnEnemy(s.wave, s.currentZone, s.gameLevel);
    }, 300);
  }, [nextWave, spawnEnemy]);

  const handlePotion = useCallback(() => {
    // Find a potion in inventory and consume it via store
    const storeActions = useGameStore.getState();
    const potionItem = storeActions.inventory.find(
      (i) => i.type === "potion" && i.quantity > 0,
    );
    const potionId = potionItem?.id ?? null;
    const potionName = potionItem?.name ?? "";
    // Use unconditionally (action checks quantity internally)
    // biome-ignore lint/correctness/useHookAtTopLevel: calling zustand store action, not a React hook
    storeActions.usePotion(potionId ?? "none");
    if (potionId) {
      toast.success(`🧪 Used ${potionName}! HP restored.`);
    } else {
      toast.error("No potions in inventory!");
    }
  }, []);

  const handleFlee = useCallback(() => {
    clearBattle();
    setGameStarted(false);
  }, [clearBattle]);

  const handleRevive = useCallback(() => {
    resetHP();
    setTimeout(() => {
      spawnEnemy(wave, currentZone, gameLevel);
    }, 300);
  }, [resetHP, spawnEnemy, wave, currentZone, gameLevel]);

  const handleEnterDungeon = useCallback(() => {
    enterDungeon();
    setTimeout(() => {
      const s = useGameStore.getState();
      spawnEnemy(1, "dungeon", s.gameLevel);
    }, 300);
  }, [enterDungeon, spawnEnemy]);

  const handleExitDungeon = useCallback(() => {
    exitDungeon();
    clearBattle();
    setGameStarted(false);
  }, [exitDungeon, clearBattle]);

  // Get attack cards
  const availableCards = getBestCards(gameLevel);

  const handleAttackCard = useCallback(
    (cardIndex: number) => {
      const card = availableCards[cardIndex];
      if (!card || gameLevel < card.minLevel) return;
      playerAttack(card);
    },
    [availableCards, gameLevel, playerAttack],
  );

  // ─── Splash screen ─────────────────────────────────────────────────────────
  if (!gameStarted) {
    return <SplashScreen onStart={handleStartGame} onBack={onBack} />;
  }

  const enemyData = currentEnemy
    ? {
        type: currentEnemy.type,
        hp: currentEnemy.hp,
        maxHp: currentEnemy.maxHp,
        isBoss: currentEnemy.isBoss,
        color: currentEnemy.color,
      }
    : null;

  const isPlayerTurn = battlePhase === "player_turn";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "#000",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* 3D Scene */}
      <div style={{ width: "100%", height: "100%" }}>
        <AnimeBattleScene
          playerAttacking={isPlayerAttacking}
          enemyAttacking={isEnemyAttacking}
          playerHurt={isPlayerHurt}
          enemyHurt={isEnemyHurt}
          enemyData={enemyData}
          currentZone={currentZone}
          equippedWeapon={useGameStore.getState().equippedWeapon}
        />
      </div>

      {/* HUD overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        {battlePhase !== "victory" && battlePhase !== "defeat" && (
          <BattleHUD
            playerHP={playerHP}
            maxPlayerHP={maxPlayerHP}
            playerMana={playerMana}
            maxPlayerMana={maxPlayerMana}
            enemyHP={currentEnemy?.hp ?? 0}
            maxEnemyHP={currentEnemy?.maxHp ?? 100}
            enemyName={currentEnemy?.label ?? "???"}
            isPlayerTurn={isPlayerTurn}
            battlePhase={battlePhase}
            battleLog={battleLog}
            onAttack={handleAttackCard}
            onPotion={handlePotion}
            onFlee={handleFlee}
            availableCards={availableCards}
            playerManaForCards={playerMana}
            gold={gold}
            wave={wave}
            currentZone={currentZone}
            gameLevel={gameLevel}
          />
        )}

        {/* Victory screen */}
        {battlePhase === "victory" && (
          <VictoryScreen
            xpEarned={lastVictoryXP}
            goldEarned={lastVictoryGold}
            loot={lastLoot}
            onNextBattle={handleNextBattle}
            onFlee={handleFlee}
            wave={wave}
          />
        )}

        {/* Defeat screen */}
        {battlePhase === "defeat" && (
          <DefeatScreen
            onRevive={handleRevive}
            onFlee={handleFlee}
            wave={wave}
          />
        )}

        {/* XP Floating numbers */}
        {xpFloats.map((f) => (
          <div
            key={f.id}
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "1.5rem",
              color: "#00ff88",
              textShadow: "0 0 12px rgba(0,255,136,0.8)",
              animation: "xpFloat 2s ease-out forwards",
              zIndex: 30,
              whiteSpace: "nowrap",
            }}
          >
            +{f.value} XP ✨
          </div>
        ))}
      </div>

      {/* Top navigation bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 25,
          display: "flex",
          gap: "0.5rem",
          padding: "8px",
          pointerEvents: "all",
        }}
      >
        {/* Inventory */}
        <button
          type="button"
          data-ocid="game.inventory.open_modal_button"
          onClick={() => setShowInventory(true)}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.6rem",
            letterSpacing: "0.06em",
            padding: "6px 12px",
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,200,0,0.4)",
            borderRadius: "6px",
            color: "#ffaa00",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "32px",
          }}
        >
          🎒
        </button>

        {/* Dungeon toggle */}
        {currentZone === "normal" ? (
          <button
            type="button"
            data-ocid="game.enter_dungeon.button"
            onClick={handleEnterDungeon}
            disabled={battlePhase !== "victory" && battlePhase !== "idle"}
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: "0.58rem",
              letterSpacing: "0.06em",
              padding: "6px 12px",
              background: "rgba(80,0,0,0.5)",
              border: "1px solid rgba(255,0,51,0.5)",
              borderRadius: "6px",
              color: "rgba(255,80,80,0.9)",
              cursor: "pointer",
              touchAction: "manipulation",
              minHeight: "32px",
              opacity:
                battlePhase !== "victory" && battlePhase !== "idle" ? 0.5 : 1,
            }}
          >
            🔴 DUNGEON
          </button>
        ) : (
          <button
            type="button"
            data-ocid="game.exit_dungeon.button"
            onClick={handleExitDungeon}
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: "0.58rem",
              letterSpacing: "0.06em",
              padding: "6px 12px",
              background: "rgba(0,50,50,0.5)",
              border: "1px solid rgba(0,255,255,0.4)",
              borderRadius: "6px",
              color: "rgba(0,255,255,0.8)",
              cursor: "pointer",
              touchAction: "manipulation",
              minHeight: "32px",
            }}
          >
            ↩ EXIT
          </button>
        )}

        {/* Back button */}
        <button
          type="button"
          data-ocid="game.back.button"
          onClick={handleBack}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.6rem",
            letterSpacing: "0.06em",
            padding: "6px 12px",
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "6px",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "32px",
          }}
        >
          ← BACK
        </button>
      </div>

      {/* Loading / waiting state when idle */}
      {battlePhase === "idle" && gameStarted && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 25,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.12em",
            }}
          >
            Preparing battle...
          </div>
        </div>
      )}

      <InventoryModal
        open={showInventory}
        onClose={() => setShowInventory(false)}
      />

      <style>{`
        @keyframes xpFloat {
          0% { opacity: 0; transform: translateX(-50%) translateY(0) scale(0.8); }
          20% { opacity: 1; transform: translateX(-50%) translateY(-20px) scale(1.1); }
          80% { opacity: 1; transform: translateX(-50%) translateY(-60px) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-90px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
