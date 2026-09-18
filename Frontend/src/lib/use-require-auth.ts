import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

/**
 * Returns a function that runs `action` if authenticated,
 * or redirects to /connexion?redirect=<current-url> otherwise.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  return (action?: () => void) => {
    if (isAuthenticated) {
      action?.();
      return true;
    }
    const redirect = location.href;
    navigate({ to: "/connexion", search: { mode: "login", redirect } });
    return false;
  };
}
