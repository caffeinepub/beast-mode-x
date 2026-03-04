import { useInternetIdentity } from "@/hooks/useInternetIdentity";

// Re-export auth hook with a cleaner name for app use
export function useAuth() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
    loginError,
  } = useInternetIdentity();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  return {
    identity,
    isLoggedIn,
    login,
    logout: clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
    loginError,
    username: identity?.getPrincipal().toString().slice(0, 8) ?? null,
  };
}
