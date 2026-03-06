import { AccountSettingsModal } from "@/components/AccountSettingsModal";
import { AuthModals } from "@/components/AuthModals";
import { BodyFocusSection } from "@/components/BodyFocusSection";
import { BodyStatsTracker } from "@/components/BodyStatsTracker";
import { CameraTracker } from "@/components/CameraTracker";
import { ChallengeSection } from "@/components/ChallengeSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { HabitTrackerSection } from "@/components/HabitTrackerSection";
import { HeroSection } from "@/components/HeroSection";
import { LeaderboardSection } from "@/components/LeaderboardSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MartialArtsSection } from "@/components/MartialArtsSection";
import { MentalHealthCheckin } from "@/components/MentalHealthCheckin";
import { MusicToggle } from "@/components/MusicToggle";
import { Navbar } from "@/components/Navbar";
import { NutritionLogger } from "@/components/NutritionLogger";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { PlayerDashboardSection } from "@/components/PlayerDashboard";
import { ProgressPhotosSection } from "@/components/ProgressPhotosSection";
import { QuotesSection } from "@/components/QuotesSection";
import { SkillTreeSection } from "@/components/SkillTreeSection";
import { SleepTracker } from "@/components/SleepTracker";
import { TrailerModal } from "@/components/TrailerModal";
import { TrainerHub } from "@/components/TrainerHub";
import { WeeklyGoalTracker } from "@/components/WeeklyGoalTracker";
import { useAuth } from "@/components/auth/AuthProvider";
import { CharacterCreator } from "@/components/game/CharacterCreator";
import { GateSelectionScreen } from "@/components/game/GateSelectionScreen";
import { PokemonBattle } from "@/components/game/PokemonBattle";
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { usePlayerProfile } from "@/hooks/useBackend";
import { getDateString, getYesterdayString } from "@/utils/gameUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type AppState = "loading" | "app" | "dungeon" | "gate";

const PENALTY_CHECK_KEY = "bmx-last-penalty-check";

function AppContent() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [prevLevel, setPrevLevel] = useState<number | null>(null);
  const [levelUpFlash, setLevelUpFlash] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [characterCreatorOpen, setCharacterCreatorOpen] = useState(false);

  const { isLoggedIn } = useAuth();
  const { actor } = useActor();
  const { data: profile, isLoading: profileLoading } = usePlayerProfile();
  const queryClient = useQueryClient();
  const onboardingCheckedRef = useRef(false);
  const penaltyCheckedRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // After login + profile load, check if onboarding needed
  useEffect(() => {
    if (!isLoggedIn || profileLoading || !actor) {
      onboardingCheckedRef.current = false;
      return;
    }
    if (onboardingCheckedRef.current) return;
    onboardingCheckedRef.current = true;

    if (profile === null || profile === undefined) {
      // New user, show onboarding
      setShowOnboarding(true);
    }
  }, [isLoggedIn, profile, profileLoading, actor]);

  // Penalty check (Solo Leveling style)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - penalty runs once per session per day
  useEffect(() => {
    if (!isLoggedIn || !actor || !profile || penaltyCheckedRef.current) return;
    penaltyCheckedRef.current = true;

    const today = getDateString();
    const yesterday = getYesterdayString();
    const lastCheck = localStorage.getItem(PENALTY_CHECK_KEY);

    if (lastCheck === yesterday) return; // already checked today for yesterday

    // Count missions completed yesterday
    const completedMissions = profile.completedMissions ?? [];
    const yesterdayCount = completedMissions.filter((id: string) =>
      id.includes(yesterday),
    ).length;

    if (yesterdayCount < 2 && lastCheck !== today) {
      actor
        .applySelfPenalty(BigInt(50))
        .then(() => {
          void queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
          toast.error(
            "⚠️ PENALTY! You failed to complete missions yesterday. -50 XP deducted!",
            {
              description:
                "Complete at least 2 missions daily to avoid penalties.",
              duration: 6000,
              style: {
                background: "oklch(0.12 0.04 22)",
                border: "1px solid oklch(0.62 0.25 22 / 0.6)",
                color: "oklch(0.9 0.05 22)",
              },
            },
          );
        })
        .catch(() => {
          // silently fail if penalty call fails
        });
      localStorage.setItem(PENALTY_CHECK_KEY, yesterday);
    } else if (yesterdayCount >= 2) {
      localStorage.setItem(PENALTY_CHECK_KEY, yesterday);
    }
  }, [isLoggedIn, actor, profile]);

  // Level up detection
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only track level changes
  useEffect(() => {
    if (!profile) return;
    const currentLevel = Number(profile.level);
    if (prevLevel !== null && currentLevel > prevLevel) {
      setLevelUpFlash(true);
      setTimeout(() => setLevelUpFlash(false), 2000);
      toast.success(`⚡ LEVEL UP! You are now Level ${currentLevel}!`, {
        description: "Keep going, warrior. Greatness awaits.",
        duration: 4000,
      });
    }
    setPrevLevel(currentLevel);
  }, [profile]);

  // Get completed missions
  const completedMissions = profile?.completedMissions ?? [];

  const handleStartJourney = () => {
    if (isLoggedIn) {
      document
        .getElementById("trainers")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      setSignupModalOpen(true);
    }
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    await queryClient.invalidateQueries({ queryKey: ["playerProfile"] });
    toast.success("Welcome to Beast Mode X! Your journey begins now!", {
      description: "Choose a trainer and complete your first mission.",
      duration: 5000,
    });
    setTimeout(() => {
      document
        .getElementById("trainers")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <>
      {/* Level up flash overlay */}
      {levelUpFlash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            pointerEvents: "none",
            animation: "levelUpFlash 2s ease-in-out forwards",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "oklch(0.82 0.18 85 / 0.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            <div
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(3rem, 10vw, 6rem)",
                letterSpacing: "0.08em",
                color: "oklch(0.82 0.18 85)",
                textShadow:
                  "0 0 30px oklch(0.82 0.18 85), 0 0 60px oklch(0.82 0.18 85 / 0.5)",
                animation: "neonPulse 0.5s ease-in-out infinite",
              }}
            >
              LEVEL UP!
            </div>
          </div>
        </div>
      )}

      {/* Loading screen */}
      {appState === "loading" && (
        <LoadingScreen onComplete={() => setAppState("app")} />
      )}

      {/* Onboarding */}
      {showOnboarding && isLoggedIn && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {/* Gate Selection (fullscreen standalone) */}
      {appState === "gate" && (
        <GateSelectionScreen
          playerLevel={profile ? Number(profile.level) : 1}
          onGateSelected={() => setAppState("dungeon")}
          onBack={() => setAppState("app")}
        />
      )}

      {/* Dungeon / Fighting Game (fullscreen) */}
      {appState === "dungeon" && (
        <PokemonBattle
          onBack={() => setAppState("app")}
          playerLevel={profile ? Number(profile.level) : 1}
        />
      )}

      {/* Main app */}
      <div
        style={{
          minHeight: "100vh",
          background: "oklch(0.06 0.01 255)",
          opacity: appState === "loading" ? 0 : 1,
          transition: "opacity 0.5s ease 0.1s",
          display:
            appState === "dungeon" || appState === "gate" ? "none" : "block",
        }}
      >
        <Navbar
          onLoginClick={() => setLoginModalOpen(true)}
          onSignupClick={() => setSignupModalOpen(true)}
          onAccountSettings={
            isLoggedIn ? () => setAccountSettingsOpen(true) : undefined
          }
          onDungeonClick={() => setAppState("dungeon")}
          onGateClick={() => setAppState("gate")}
          onCharacterClick={() => setCharacterCreatorOpen(true)}
        />

        <main
          style={{ paddingBottom: "clamp(80px, 18vw, 100px)" }}
          className="md:pb-0"
        >
          <HeroSection
            onStartClick={handleStartJourney}
            onTrailerClick={() => setTrailerOpen(true)}
          />

          <TrainerHub
            completedMissions={completedMissions}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setLoginModalOpen(true)}
            playerLevel={profile ? Number(profile.level) : 1}
          />

          <ChallengeSection />

          <BodyFocusSection />

          <MartialArtsSection
            profile={profile}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setLoginModalOpen(true)}
          />

          {/* Dungeon Section Card — visible and prominent on mobile */}
          <section
            id="dungeon"
            style={{
              padding: "clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,0,10,0.95) 0%, rgba(10,0,20,0.98) 100%)",
                border: "1px solid rgba(255,0,51,0.3)",
                borderRadius: "20px",
                padding: "clamp(1.5rem, 5vw, 3rem)",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                  "0 0 40px rgba(255,0,51,0.1), 0 0 80px rgba(157,0,255,0.08)",
              }}
            >
              {/* Background glow */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(circle at 30% 50%, rgba(157,0,255,0.08) 0%, transparent 50%),
                    radial-gradient(circle at 70% 50%, rgba(255,0,51,0.08) 0%, transparent 50%)
                  `,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(2rem, 6vw, 3rem)",
                    filter: "drop-shadow(0 0 12px rgba(255,0,51,0.8))",
                  }}
                >
                  ⚔️
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 900,
                    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                    letterSpacing: "0.08em",
                    background:
                      "linear-gradient(135deg, #ff0033 0%, #9d00ff 50%, #00ffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  DUNGEON FIGHTER
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
                    color: "rgba(255,255,255,0.5)",
                    maxWidth: "480px",
                    lineHeight: 1.6,
                  }}
                >
                  Turn-based card battle RPG. Choose your class. Enter the
                  dungeon. Defeat bosses and collect legendary loot.
                </div>

                {/* Class badges */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    justifyContent: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  {[
                    { icon: "👑", name: "Shadow", color: "#9d00ff" },
                    { icon: "⚡", name: "Thunder", color: "#ffdd00" },
                    { icon: "🔥", name: "Inferno", color: "#ff4400" },
                    { icon: "❄️", name: "Frost", color: "#00ffff" },
                    { icon: "⚔️", name: "Berserker", color: "#cc0000" },
                    { icon: "🌀", name: "Archmage", color: "#cc00ff" },
                  ].map((cls) => (
                    <div
                      key={cls.name}
                      style={{
                        padding: "0.3rem 0.65rem",
                        background: `${cls.color}15`,
                        border: `1px solid ${cls.color}44`,
                        borderRadius: "20px",
                        fontSize: "0.62rem",
                        fontFamily: '"Sora", sans-serif',
                        fontWeight: 700,
                        color: cls.color,
                        letterSpacing: "0.06em",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      {cls.icon} {cls.name}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  data-ocid="dungeon.enter.primary_button"
                  onClick={() => setAppState("dungeon")}
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 900,
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                    letterSpacing: "0.15em",
                    padding: "1rem 3rem",
                    background:
                      "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    cursor: "pointer",
                    boxShadow:
                      "0 0 30px rgba(255,0,51,0.4), 0 0 60px rgba(157,0,255,0.2)",
                    touchAction: "manipulation",
                    minHeight: "56px",
                    animation: "dungeonPulse 2s ease-in-out infinite alternate",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1)";
                  }}
                >
                  ⚔️ ENTER DUNGEON
                </button>
              </div>
            </div>
          </section>

          {/* Gate System Section Card */}
          <section
            id="gates"
            style={{
              padding: "0 clamp(1rem, 4vw, 2rem) clamp(2rem, 6vw, 4rem)",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(10,0,20,0.95) 0%, rgba(5,0,15,0.98) 100%)",
                border: "1px solid rgba(157,0,255,0.35)",
                borderRadius: "20px",
                padding: "clamp(1.5rem, 5vw, 3rem)",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                  "0 0 40px rgba(157,0,255,0.12), 0 0 80px rgba(157,0,255,0.06)",
              }}
            >
              {/* Background glow */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(circle at 30% 50%, rgba(157,0,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 50%, rgba(100,0,200,0.08) 0%, transparent 50%)
                  `,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(2rem, 6vw, 3rem)",
                    filter: "drop-shadow(0 0 14px rgba(157,0,255,0.9))",
                  }}
                >
                  🌀
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 900,
                    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                    letterSpacing: "0.08em",
                    background:
                      "linear-gradient(135deg, #9d00ff 0%, #cc66ff 50%, #ff0033 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  GATE SYSTEM
                </div>
                <div
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
                    color: "rgba(255,255,255,0.5)",
                    maxWidth: "480px",
                    lineHeight: 1.6,
                  }}
                >
                  Solo Leveling style dungeon gates. Choose your rank — E to S
                  to the feared Red Gate. Higher rank means greater danger and
                  greater rewards.
                </div>
                {/* Gate rank badges */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    justifyContent: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  {[
                    { rank: "E", color: "#888" },
                    { rank: "D", color: "#00cc66" },
                    { rank: "C", color: "#0088ff" },
                    { rank: "B", color: "#8800cc" },
                    { rank: "A", color: "#ff6600" },
                    { rank: "S", color: "#ffdd00" },
                    { rank: "🔴", color: "#ff0011" },
                  ].map((g) => (
                    <div
                      key={g.rank}
                      style={{
                        padding: "0.3rem 0.65rem",
                        background: `${g.color}18`,
                        border: `1px solid ${g.color}55`,
                        borderRadius: "20px",
                        fontSize: "0.65rem",
                        fontFamily: '"Sora", sans-serif',
                        fontWeight: 900,
                        color: g.color,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {g.rank}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  data-ocid="gate.select.primary_button"
                  onClick={() => setAppState("gate")}
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 900,
                    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                    letterSpacing: "0.15em",
                    padding: "1rem 3rem",
                    background:
                      "linear-gradient(135deg, #9d00ff 0%, #6600cc 100%)",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    cursor: "pointer",
                    boxShadow:
                      "0 0 30px rgba(157,0,255,0.45), 0 0 60px rgba(157,0,255,0.2)",
                    touchAction: "manipulation",
                    minHeight: "56px",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1.04)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 40px rgba(157,0,255,0.6), 0 0 80px rgba(157,0,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 30px rgba(157,0,255,0.45), 0 0 60px rgba(157,0,255,0.2)";
                  }}
                >
                  🌀 SELECT GATE
                </button>
              </div>
            </div>
          </section>

          <CameraTracker />

          <PlayerDashboardSection
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setLoginModalOpen(true)}
          />

          <WeeklyGoalTracker />

          <HabitTrackerSection />

          <SkillTreeSection />

          <QuotesSection />

          <SleepTracker />

          <NutritionLogger />

          <MentalHealthCheckin />

          <BodyStatsTracker />

          <ProgressPhotosSection />

          <FeaturesSection />

          <LeaderboardSection />
        </main>

        <Footer />

        <MusicToggle />

        {/* Fixed mobile bottom bar — two buttons: DUNGEON + GATE */}
        {appState === "app" && (
          <div
            className="md:hidden"
            style={{
              position: "fixed",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 90,
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              maxWidth: "calc(100vw - 20px)",
              overflow: "hidden",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <button
              type="button"
              data-ocid="app.enter_dungeon.button"
              onClick={() => setAppState("dungeon")}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                height: "52px",
                width: "clamp(130px, 42vw, 160px)",
                background: "linear-gradient(135deg, #ff0033 0%, #9d00ff 100%)",
                border: "none",
                borderRadius: "14px",
                color: "white",
                cursor: "pointer",
                boxShadow:
                  "0 0 20px rgba(255,0,51,0.5), 0 0 40px rgba(157,0,255,0.3), 0 4px 16px rgba(0,0,0,0.5)",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                animation: "dungeonPulse 2s ease-in-out infinite alternate",
                flexShrink: 0,
              }}
            >
              ⚔️ DUNGEON
            </button>
            <button
              type="button"
              data-ocid="app.gate.button"
              onClick={() => setAppState("gate")}
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 900,
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                height: "52px",
                width: "clamp(130px, 42vw, 160px)",
                background: "linear-gradient(135deg, #9d00ff 0%, #6600cc 100%)",
                border: "none",
                borderRadius: "14px",
                color: "white",
                cursor: "pointer",
                boxShadow:
                  "0 0 20px rgba(157,0,255,0.5), 0 0 40px rgba(157,0,255,0.25), 0 4px 16px rgba(0,0,0,0.5)",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                animation: "gatePulse 2s ease-in-out infinite alternate",
                flexShrink: 0,
              }}
            >
              🌀 GATES
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dungeonPulse {
          0% { box-shadow: 0 0 20px rgba(255,0,51,0.5), 0 0 40px rgba(157,0,255,0.3), 0 4px 16px rgba(0,0,0,0.5); }
          100% { box-shadow: 0 0 35px rgba(255,0,51,0.7), 0 0 70px rgba(157,0,255,0.5), 0 4px 20px rgba(0,0,0,0.6); }
        }
        @keyframes gatePulse {
          0% { box-shadow: 0 0 20px rgba(157,0,255,0.5), 0 0 40px rgba(157,0,255,0.25), 0 4px 16px rgba(0,0,0,0.5); }
          100% { box-shadow: 0 0 35px rgba(157,0,255,0.7), 0 0 70px rgba(157,0,255,0.45), 0 4px 20px rgba(0,0,0,0.6); }
        }
      `}</style>

      {/* Trailer Modal */}
      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} />

      {/* Character Creator */}
      <CharacterCreator
        open={characterCreatorOpen}
        onClose={() => setCharacterCreatorOpen(false)}
      />

      {/* Account Settings Modal */}
      {isLoggedIn && (
        <AccountSettingsModal
          open={accountSettingsOpen}
          onClose={() => setAccountSettingsOpen(false)}
        />
      )}

      {/* Auth modals */}
      <AuthModals
        loginOpen={loginModalOpen}
        signupOpen={signupModalOpen}
        onCloseLogin={() => setLoginModalOpen(false)}
        onCloseSignup={() => setSignupModalOpen(false)}
      />

      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.02 260)",
            border: "1px solid oklch(0.62 0.25 22 / 0.4)",
            color: "oklch(0.9 0.02 260)",
            fontFamily: '"Sora", sans-serif',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return <AppContent />;
}
