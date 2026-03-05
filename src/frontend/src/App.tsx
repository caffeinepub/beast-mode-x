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
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import { usePlayerProfile } from "@/hooks/useBackend";
import { getDateString, getYesterdayString } from "@/utils/gameUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type AppState = "loading" | "app";

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

      {/* Main app */}
      <div
        style={{
          minHeight: "100vh",
          background: "oklch(0.06 0.01 255)",
          opacity: appState === "loading" ? 0 : 1,
          transition: "opacity 0.5s ease 0.1s",
        }}
      >
        <Navbar
          onLoginClick={() => setLoginModalOpen(true)}
          onSignupClick={() => setSignupModalOpen(true)}
          onAccountSettings={
            isLoggedIn ? () => setAccountSettingsOpen(true) : undefined
          }
        />

        <main>
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
      </div>

      {/* Trailer Modal */}
      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} />

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
