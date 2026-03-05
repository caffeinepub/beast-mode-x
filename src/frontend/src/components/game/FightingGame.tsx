import { useActorSafe } from "@/hooks/useActorSafe";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BattleArena } from "./BattleArena";
import { GameHUD } from "./GameHUD";
import { useGameStore } from "./GameStore";
import { VirtualJoystick } from "./VirtualJoystick";

interface FightingGameProps {
  onBack: () => void;
  playerLevel?: number;
}

interface XPFloat {
  id: number;
  value: number;
  x: number;
  y: number;
}

let xpFloatCounter = 0;

export function FightingGame({ onBack, playerLevel = 1 }: FightingGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [xpFloats, setXPFloats] = useState<XPFloat[]>([]);
  const [waveCompleteMsg, setWaveCompleteMsg] = useState(false);

  const joystickInput = useRef({ x: 0, y: 0 });
  const attackPressed = useRef(false);
  const specialPressed = useRef(false);
  const dodgePressed = useRef(false);

  const { actor } = useActorSafe();
  const {
    currentZone,
    wave,
    sessionXP,
    sessionKills,
    enterDungeon,
    exitDungeon,
    setGameLevel,
    markXPSynced,
    lastXPSync,
  } = useGameStore();

  // Sync player level from profile
  useEffect(() => {
    if (playerLevel > 1) {
      setGameLevel(playerLevel);
    }
  }, [playerLevel, setGameLevel]);

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted) return;

    const keys: Record<string, boolean> = {};

    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;

      // Attack with space or Z
      if (e.key === " " || e.key === "z" || e.key === "Z") {
        attackPressed.current = true;
      }
      // Special with X
      if (e.key === "x" || e.key === "X") {
        specialPressed.current = true;
      }
      // Dodge with shift
      if (e.key === "Shift") {
        dodgePressed.current = true;
      }

      // WASD movement
      const dx =
        (keys.d || keys.arrowright ? 1 : 0) -
        (keys.a || keys.arrowleft ? 1 : 0);
      const dy =
        (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
      joystickInput.current = { x: dx, y: dy };
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
      const dx =
        (keys.d || keys.arrowright ? 1 : 0) -
        (keys.a || keys.arrowleft ? 1 : 0);
      const dy =
        (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
      joystickInput.current = { x: dx, y: dy };
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameStarted]);

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
          toast.success(`⚔️ +${unsyncedXP} Martial XP synced to profile!`, {
            duration: 3000,
          });
        })
        .catch(() => {
          // silently fail
        });
    }
  }, [sessionKills, sessionXP, lastXPSync, actor, markXPSynced]);

  // Sync XP on zone change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only trigger sync on zone change
  useEffect(() => {
    if (!actor || sessionXP <= lastXPSync) return;
    const unsyncedXP = sessionXP - lastXPSync;
    if (unsyncedXP > 0) {
      actor
        .updateMartialArtsXP(BigInt(unsyncedXP))
        .then(() => markXPSynced())
        .catch(() => {});
    }
  }, [currentZone]);

  const handleXPFloat = useCallback((xp: number, x: number, y: number) => {
    const id = ++xpFloatCounter;
    setXPFloats((prev) => [...prev, { id, value: xp, x, y }]);
    setTimeout(() => {
      setXPFloats((prev) => prev.filter((f) => f.id !== id));
    }, 1500);
  }, []);

  const handleWaveComplete = useCallback(() => {
    setWaveCompleteMsg(true);
    setTimeout(() => setWaveCompleteMsg(false), 2000);
  }, []);

  const handleBack = useCallback(() => {
    // Sync XP before leaving
    if (actor && sessionXP > lastXPSync) {
      const unsyncedXP = sessionXP - lastXPSync;
      actor
        .updateMartialArtsXP(BigInt(unsyncedXP))
        .then(() => markXPSynced())
        .catch(() => {});
    }
    onBack();
  }, [actor, sessionXP, lastXPSync, markXPSynced, onBack]);

  if (!gameStarted) {
    return (
      <SplashScreen onStart={() => setGameStarted(true)} onBack={onBack} />
    );
  }

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
      {/* 3D Arena */}
      <div style={{ width: "100%", height: "100%" }}>
        <BattleArena
          joystickInput={joystickInput}
          attackPressed={attackPressed}
          specialPressed={specialPressed}
          dodgePressed={dodgePressed}
          onXPFloat={handleXPFloat}
          onWaveComplete={handleWaveComplete}
        />
      </div>

      {/* HUD Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <GameHUD
          onAttack={() => {
            attackPressed.current = true;
          }}
          onSpecial={() => {
            specialPressed.current = true;
          }}
          onDodge={() => {
            dodgePressed.current = true;
          }}
          onEnterDungeon={enterDungeon}
          onExitDungeon={exitDungeon}
          onBack={handleBack}
          xpFloats={xpFloats}
        />
      </div>

      {/* Virtual Joystick (bottom-left) */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "24px",
          zIndex: 20,
          touchAction: "none",
        }}
      >
        <VirtualJoystick
          onChange={(dir) => {
            joystickInput.current = dir;
          }}
        />
      </div>

      {/* Wave complete message */}
      {waveCompleteMsg && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            textAlign: "center",
            pointerEvents: "none",
            animation: "fadeInOut 2s ease forwards",
          }}
        >
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
              color: "#ffaa00",
              textShadow: "0 0 20px rgba(255,170,0,0.8)",
              letterSpacing: "0.1em",
            }}
          >
            ✨ WAVE {wave - 1} CLEAR!
          </div>
          <div
            style={{
              fontFamily: '"Sora", sans-serif',
              fontSize: "1rem",
              color: "rgba(255,255,255,0.6)",
              marginTop: "0.5rem",
            }}
          >
            Next wave incoming...
          </div>
        </div>
      )}

      {/* Controls hint (desktop) */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 15,
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.55rem",
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.08em",
          pointerEvents: "none",
        }}
        className="hidden md:block"
      >
        WASD: Move · Space/Z: Attack · X: Special · Shift: Dodge
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -60%); }
          20% { opacity: 1; transform: translate(-50%, -50%); }
          80% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -40%); }
        }
      `}</style>
    </div>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({
  onStart,
  onBack,
}: {
  onStart: () => void;
  onBack: () => void;
}) {
  const { gold, kills, gameLevel, sessionXP } = useGameStore();

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
        justifyContent: "center",
        fontFamily: '"Sora", sans-serif',
        padding: "2rem",
        overflow: "hidden",
      }}
    >
      {/* Background particles */}
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
          marginBottom: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "clamp(0.7rem, 2vw, 1rem)",
            letterSpacing: "0.3em",
            color: "rgba(157,0,255,0.7)",
            marginBottom: "0.5rem",
          }}
        >
          ⚔️ BEAST MODE LEVEL X ⚔️
        </div>
        <div
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            background:
              "linear-gradient(135deg, #ff0033 0%, #9d00ff 50%, #00ffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            lineHeight: 1.1,
          }}
        >
          DUNGEON
          <br />
          FIGHTER
        </div>
        <div
          style={{
            fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.4)",
            marginTop: "0.5rem",
          }}
        >
          3D ACTION RPG
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
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
              padding: "0.75rem 1.25rem",
              textAlign: "center",
              minWidth: "80px",
            }}
          >
            <div style={{ fontSize: "1.2rem" }}>{stat.icon}</div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 900,
                color: "#9d00ff",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Info cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.75rem",
          maxWidth: "600px",
          width: "100%",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          {
            icon: "🗡️",
            title: "FIGHT MONSTERS",
            desc: "Defeat goblins, demons, and dragons",
          },
          {
            icon: "🏰",
            title: "DUNGEON RAIDS",
            desc: "Enter dungeons for epic loot",
          },
          { icon: "⬆️", title: "LEVEL UP", desc: "Unlock powerful new weapons" },
          {
            icon: "💎",
            title: "COLLECT LOOT",
            desc: "Weapons, potions & rare items",
          },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "0.75rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>
              {card.icon}
            </span>
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: "0.15rem",
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
          gap: "1rem",
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
            fontSize: "1rem",
            letterSpacing: "0.12em",
            padding: "1rem 3rem",
            background: "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
            border: "none",
            borderRadius: "8px",
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
            e.currentTarget.style.boxShadow =
              "0 0 40px rgba(255,0,51,0.6), 0 0 80px rgba(157,0,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(255,0,51,0.4), 0 0 60px rgba(157,0,255,0.2)";
          }}
        >
          ⚔️ ENTER ARENA
        </button>

        <button
          type="button"
          data-ocid="game.back_to_app.button"
          onClick={onBack}
          style={{
            fontFamily: '"Sora", sans-serif',
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            padding: "1rem 2rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            touchAction: "manipulation",
            minHeight: "52px",
          }}
        >
          ← BACK TO APP
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          fontFamily: '"Sora", sans-serif',
          fontSize: "0.6rem",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em",
        }}
      >
        WASD / Joystick · Space / Attack Button · X: Special Attack
      </div>
    </div>
  );
}
