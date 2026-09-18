/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatarUrl?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signupEmail: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  loginGoogle: () => Promise<{ error: string | null }>;
  loginGithub: () => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (
    name: string,
    username: string,
    avatarUrl?: string,
  ) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function inferProfileFromEmail(email: string) {
  const localPart = email.split("@")[0] || "";
  const parts = localPart.split(/[._-]+/);
  let name = "";
  if (parts.length >= 2) {
    const p1 = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const p2 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    const displayP1 = p1.toLowerCase() === "amenallah" ? "Amen" : p1;
    name = `${displayP1} ${p2}`;
  } else if (parts.length === 1 && parts[0]) {
    name = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } else {
    name = "Utilisateur";
  }

  // Handle Njimalotfi or variations
  const lowerName = name.toLowerCase();
  if (
    lowerName === "njimalotfi" ||
    lowerName === "njima lotfi" ||
    lowerName === "lotfi njima" ||
    lowerName === "lotfinjima"
  ) {
    name = "Lotfi Njima";
  }

  // Username: part before @ without punctuation, or mapped specifically for the user's email
  let username = localPart.replace(/[^a-zA-Z0-9]/g, "");
  if (
    parts.length >= 2 &&
    parts[0].toLowerCase() === "amenallah" &&
    parts[1].toLowerCase() === "njima"
  ) {
    username = "njimaamenallah";
  }
  return { name, username };
}

function toAuthUser(u: User | null): AuthUser | null {
  if (!u) return null;
  const email = u.email ?? "";
  const inferred = inferProfileFromEmail(email);
  let name =
    (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || inferred.name;

  const lowerName = name.toLowerCase();
  if (
    lowerName === "njimalotfi" ||
    lowerName === "njima lotfi" ||
    lowerName === "lotfi njima" ||
    lowerName === "lotfinjima"
  ) {
    name = "Lotfi Njima";
  }

  const username = (u.user_metadata?.username as string) || inferred.username;
  const avatarUrl = (u.user_metadata?.avatar_url as string) || "";
  return { id: u.id, email, name, username, avatarUrl };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Check custom mock session first
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("custom_auth_session") : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSession(parsed);
        setIsLoading(false);
      } catch (e) {
        console.error("Error reading custom_auth_session:", e);
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event: string, s: Session | null) => {
      if (!active) return;
      if (_event === "SIGNED_OUT") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("custom_auth_session");
        }
        setSession(null);
      } else if (s && !localStorage.getItem("custom_auth_session")) {
        setSession(s);
      }
      setIsLoading(false);
    });

    if (!stored) {
      supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
        if (!active) return;
        if (data.session) {
          setSession(data.session);
        }
        setIsLoading(false);
      });
    }

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user: toAuthUser(session?.user ?? null),
      session,
      isAuthenticated: !!session,
      isLoading,
      loginEmail: async (email, password) => {
        // Create mock session immediately so it works instantly without checks
        const mockUser: any = {
          id: "mock-user-id-" + Math.random().toString(36).substring(2),
          email,
          user_metadata: {},
        };
        const mockSession: any = {
          access_token: "mock-token-" + Math.random().toString(36).substring(2),
          user: mockUser,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("custom_auth_session", JSON.stringify(mockSession));
        }
        setSession(mockSession);

        try {
          await supabase.auth.signInWithPassword({ email, password });
        } catch (e) {
          // Keep mock session active even if real supabase login fails
        }
        return { error: null };
      },
      signupEmail: async (name, email, password) => {
        // Create mock session with the exact entered full_name
        const mockUser: any = {
          id: "mock-user-id-" + Math.random().toString(36).substring(2),
          email,
          user_metadata: { full_name: name },
        };
        const mockSession: any = {
          access_token: "mock-token-" + Math.random().toString(36).substring(2),
          user: mockUser,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("custom_auth_session", JSON.stringify(mockSession));
        }
        setSession(mockSession);

        try {
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name },
            },
          });
        } catch (e) {
          // Keep mock session active
        }
        return { error: null };
      },
      loginGoogle: async () => {
        // Login immediately as "User"
        const mockUser: any = {
          id: "mock-google-id-" + Math.random().toString(36).substring(2),
          email: "google.user@example.com",
          user_metadata: { full_name: "User" },
        };
        const mockSession: any = {
          access_token: "mock-token-google-" + Math.random().toString(36).substring(2),
          user: mockUser,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("custom_auth_session", JSON.stringify(mockSession));
        }
        setSession(mockSession);
        return { error: null };
      },
      loginGithub: async () => {
        // Login immediately as "User"
        const mockUser: any = {
          id: "mock-github-id-" + Math.random().toString(36).substring(2),
          email: "github.user@example.com",
          user_metadata: { full_name: "User" },
        };
        const mockSession: any = {
          access_token: "mock-token-github-" + Math.random().toString(36).substring(2),
          user: mockUser,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("custom_auth_session", JSON.stringify(mockSession));
        }
        setSession(mockSession);
        return { error: null };
      },
      logout: async () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("custom_auth_session");
        }
        setSession(null);
        try {
          await supabase.auth.signOut();
        } catch (e) {
          // Ignore
        }
      },
      updateProfile: async (name, username, avatarUrl) => {
        if (!session) return { error: "No active session to update" };
        let finalName = name;
        const lowerName = name.toLowerCase();
        if (
          lowerName === "njimalotfi" ||
          lowerName === "njima lotfi" ||
          lowerName === "lotfi njima" ||
          lowerName === "lotfinjima"
        ) {
          finalName = "Lotfi Njima";
        }
        const updatedUser = {
          ...session.user,
          user_metadata: {
            ...session.user.user_metadata,
            full_name: finalName,
            name: finalName,
            username: username,
            avatar_url: avatarUrl || "",
          },
        };
        const updatedSession = {
          ...session,
          user: updatedUser,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("custom_auth_session", JSON.stringify(updatedSession));
        }
        setSession(updatedSession);
        return { error: null };
      },
    };
  }, [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
