import { AuthModals } from "@/components/AuthModals";
import { DashboardSection } from "@/components/DashboardSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { LeaderboardSection } from "@/components/LeaderboardSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MusicToggle } from "@/components/MusicToggle";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Add dark class to html element
    document.documentElement.classList.add("dark");
  }, []);

  const handleStartJourney = () => {
    if (isLoggedIn) {
      document
        .getElementById("dashboard")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      setSignupModalOpen(true);
    }
  };

  return (
    <>
      {/* Loading screen */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {/* Main app */}
      <div
        style={{
          minHeight: "100vh",
          background: "oklch(0.06 0.01 255)",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s ease 0.1s",
        }}
      >
        <Navbar
          onLoginClick={() => setLoginModalOpen(true)}
          onSignupClick={() => setSignupModalOpen(true)}
        />

        <main>
          <HeroSection onStartClick={handleStartJourney} />

          <DashboardSection
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setLoginModalOpen(true)}
          />

          <FeaturesSection />

          <LeaderboardSection />
        </main>

        <Footer />

        <MusicToggle />
      </div>

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
