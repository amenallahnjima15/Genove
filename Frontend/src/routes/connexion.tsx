import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { GenoveLogo } from "@/components/genove/GenoveLogo";

type ConnexionSearch = {
  mode?: "login" | "signup";
  redirect?: string;
};

export const Route = createFileRoute("/connexion")({
  validateSearch: (search: Record<string, unknown>): ConnexionSearch => ({
    mode: search.mode === "signup" ? "signup" : "login",
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: ConnexionPage,
});

function safeRedirect(target: string | undefined): string {
  if (!target || typeof target !== "string" || target === "/") return "/dashboard";
  if (!target.startsWith("/")) return "/dashboard";
  if (target.startsWith("//")) return "/dashboard";
  if (target.startsWith("/connexion")) return "/dashboard";
  return target;
}

function ConnexionPage() {
  const search = useSearch({ from: "/connexion" });
  const navigate = useNavigate();
  const { loginEmail, signupEmail, loginGoogle, loginGithub, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<"login" | "signup">(search.mode ?? "login");
  const [showPwd, setShowPwd] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const isLogin = mode === "login";

  const redirectTarget = safeRedirect(search.redirect);

  const highlights = [
    { icon: GraduationCap, text: t("auth.highlight1") },
    { icon: Users, text: t("auth.highlight2") },
    { icon: ShieldCheck, text: t("auth.highlight3") },
  ];

  // Ensure dark background on body while on connexion page so no white strip appears at footer
  useEffect(() => {
    const origBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#180E30";
    return () => {
      document.body.style.backgroundColor = origBg;
    };
  }, []);

  // If already authenticated, bounce to redirect target.
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: redirectTarget });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email.trim() || !password.trim()) {
      setError(t("auth.errEmailPass"));
      return;
    }
    if (!isLogin) {
      if (!firstName.trim() || !lastName.trim()) {
        setError(t("auth.errFirstLast"));
        return;
      }
      if (password.length < 6) {
        setError(t("auth.errPassLength"));
        return;
      }
      if (password !== password2) {
        setError(t("auth.errPassMismatch"));
        return;
      }
    }
    setSubmitting(true);
    if (isLogin) {
      const { error } = await loginEmail(email.trim(), password);
      setSubmitting(false);
      if (error) {
        setError(error);
      } else {
        navigate({ to: redirectTarget });
      }
    } else {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { error } = await signupEmail(fullName, email.trim(), password);
      setSubmitting(false);
      if (error) {
        setError(error);
      } else {
        setInfo(t("auth.successSignup"));
        navigate({ to: redirectTarget });
      }
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await loginGoogle();
    if (error) {
      setError(error);
    } else {
      navigate({ to: redirectTarget });
    }
  };

  const handleGithub = async () => {
    setError(null);
    const { error } = await loginGithub();
    if (error) {
      setError(error);
    } else {
      navigate({ to: redirectTarget });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full py-3 sm:py-6 flex items-center justify-center p-3 sm:p-5 bg-[#180E30]">
      <div className="relative mx-auto flex w-full max-w-4xl lg:max-w-5xl items-center justify-center z-10">
        <div className="grid w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-card shadow-[0_25px_60px_rgba(0,0,0,0.55)] ring-1 ring-purple-500/30 animate-in fade-in zoom-in-95 duration-500 md:grid-cols-[40%_60%] lg:grid-cols-[42%_58%]">
          {/* Left panel */}
          <div
            className={`relative hidden flex-col justify-between text-white md:flex bg-gradient-to-br from-[#8C52FF] via-[#7030EF] to-[#5B21B6] ${
              isLogin ? "p-6 sm:p-8 lg:p-10" : "p-5 sm:p-6 lg:p-7"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8C52FF] via-[#7030EF] to-[#5B21B6]" />
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_70%,#FBBF24,transparent_45%)]" />
            <div className="relative">
              <Link to="/" className="inline-block mb-3 transition-transform hover:scale-105">
                <GenoveLogo variant="full" height={48} />
              </Link>
              <h1
                className={`font-heading font-bold leading-tight ${
                  isLogin ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
                }`}
              >
                {isLogin ? (
                  <>
                    {t("auth.welcomeBack")}
                    <br />
                    <span className="text-accent">Genove.</span>
                  </>
                ) : (
                  <>
                    {t("auth.joinUs")} <span className="text-accent">Genove.</span>
                  </>
                )}
              </h1>
              <p
                className={`mt-2 max-w-sm text-white/80 leading-relaxed ${
                  isLogin ? "text-xs sm:text-sm" : "text-xs"
                }`}
              >
                {isLogin ? t("auth.welcomeSub") : t("auth.joinSub")}
              </p>
            </div>
            <ul
              className={`relative text-white/90 ${
                isLogin ? "my-6 space-y-3 text-xs sm:text-sm" : "my-4 space-y-2.5 text-xs"
              }`}
            >
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </ul>
            <div className="relative text-xs text-white/50">
              © {new Date().getFullYear()} {t("auth.footerPlatform")}
            </div>
          </div>

          {/* Right form */}
          <div
            className={`flex flex-col justify-center bg-[#0c1435]/0 ${
              isLogin ? "p-5 sm:p-8 lg:p-10" : "p-4 sm:p-5 lg:p-6"
            }`}
          >
            <div
              className={`mx-auto w-full ${
                isLogin ? "max-w-[380px] sm:max-w-[420px]" : "max-w-[360px] sm:max-w-[390px]"
              }`}
            >
              <Link
                to="/"
                className="mb-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> {t("auth.backHome")}
              </Link>
              <div className={isLogin ? "mb-3.5" : "mb-2"}>
                <h2
                  className={`font-heading font-bold text-foreground ${
                    isLogin ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                  }`}
                >
                  {isLogin ? t("auth.loginTitle") : t("auth.signupTitle")}
                </h2>
                <p
                  className={`mt-0.5 text-muted-foreground ${
                    isLogin ? "text-xs sm:text-sm" : "text-xs"
                  }`}
                >
                  {isLogin ? t("auth.loginDesc") : t("auth.signupDesc")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogle}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background font-medium transition-colors hover:bg-muted cursor-pointer ${
                    isLogin ? "h-9 sm:h-10 text-xs sm:text-sm" : "h-8.5 sm:h-9 text-xs"
                  }`}
                >
                  <GoogleIcon /> Google
                </button>
                <button
                  type="button"
                  onClick={handleGithub}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background font-medium transition-colors hover:bg-muted cursor-pointer ${
                    isLogin ? "h-9 sm:h-10 text-xs sm:text-sm" : "h-8.5 sm:h-9 text-xs"
                  }`}
                >
                  <GithubIcon /> GitHub
                </button>
              </div>

              <div
                className={`flex items-center gap-2 text-xs text-muted-foreground ${
                  isLogin ? "my-3 sm:my-3.5" : "my-2"
                }`}
              >
                <span className="h-px flex-1 bg-border" />
                {t("auth.orWithEmail")}
                <span className="h-px flex-1 bg-border" />
              </div>

              <form
                onSubmit={handleSubmit}
                className={isLogin ? "space-y-3 sm:space-y-3.5" : "space-y-2 sm:space-y-2.5"}
                noValidate
              >
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      icon={<User className="h-3.5 w-3.5" />}
                      label={t("auth.firstName")}
                      type="text"
                      placeholder="Yassine"
                      value={firstName}
                      onChange={setFirstName}
                      autoComplete="given-name"
                      compact
                    />
                    <Field
                      icon={<User className="h-3.5 w-3.5" />}
                      label={t("auth.lastName")}
                      type="text"
                      placeholder="Ben Salah"
                      value={lastName}
                      onChange={setLastName}
                      autoComplete="family-name"
                      compact
                    />
                  </div>
                )}
                <Field
                  icon={<Mail className={isLogin ? "h-4 w-4" : "h-3.5 w-3.5"} />}
                  label={t("auth.email")}
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                  compact={!isLogin}
                />
                <PasswordField
                  label={t("auth.password")}
                  value={password}
                  onChange={setPassword}
                  show={showPwd}
                  setShow={setShowPwd}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  compact={!isLogin}
                />
                {!isLogin && (
                  <PasswordField
                    label={t("auth.confirmPassword")}
                    value={password2}
                    onChange={setPassword2}
                    show={showPwd}
                    setShow={setShowPwd}
                    autoComplete="new-password"
                    compact
                  />
                )}
                {isLogin ? (
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-input accent-[var(--accent)]"
                      />
                      {t("auth.rememberMe")}
                    </label>
                    <button
                      type="button"
                      className="font-medium text-xs sm:text-sm text-primary hover:text-accent-hover"
                    >
                      {t("auth.forgotPassword")}
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {t("auth.termsLead")}{" "}
                    <span className="text-primary underline underline-offset-2">
                      {t("auth.terms")}
                    </span>{" "}
                    {t("auth.andOur")}{" "}
                    <span className="text-primary underline underline-offset-2">
                      {t("auth.privacy")}
                    </span>
                    .
                  </p>
                )}
                {error && (
                  <p className="rounded-md bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive">
                    {error}
                  </p>
                )}
                {info && (
                  <p className="rounded-md bg-success/10 px-2.5 py-1.5 text-xs font-medium text-success">
                    {info}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-accent-foreground shadow-[var(--shadow-gold)] transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer ${
                    isLogin
                      ? "h-10 sm:h-10.5 text-xs sm:text-sm"
                      : "h-9 sm:h-9.5 text-xs sm:text-sm"
                  }`}
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                      {t("auth.pleaseWait")}
                    </>
                  ) : (
                    <>
                      {isLogin ? t("auth.loginBtn") : t("auth.signupBtn")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              <p
                className={`mt-3 text-center text-muted-foreground ${
                  isLogin ? "text-xs sm:text-sm" : "text-xs"
                }`}
              >
                {isLogin ? t("auth.newUser") : t("auth.alreadyUser")}{" "}
                <button
                  onClick={() => {
                    setError(null);
                    setInfo(null);
                    setMode(isLogin ? "signup" : "login");
                  }}
                  className="font-semibold text-primary hover:text-accent-hover cursor-pointer"
                >
                  {isLogin ? t("auth.createAccount") : t("auth.signIn")}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  compact,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  compact?: boolean;
}) {
  return (
    <div>
      <label
        className={`block font-medium text-foreground ${compact ? "mb-0.5 text-[11px]" : "mb-1 text-xs"}`}
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-input bg-background outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 ${
            compact
              ? "h-8.5 sm:h-9 pl-8.5 pr-3 text-xs"
              : "h-9 sm:h-10 pl-9 pr-3 text-xs sm:text-sm"
          }`}
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  setShow,
  autoComplete,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
  autoComplete?: string;
  compact?: boolean;
}) {
  return (
    <div>
      <label
        className={`block font-medium text-foreground ${compact ? "mb-0.5 text-[11px]" : "mb-1 text-xs"}`}
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Lock className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-input bg-background outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 ${
            compact
              ? "h-8.5 sm:h-9 pl-8.5 pr-9 text-xs"
              : "h-9 sm:h-10 pl-9 pr-10 text-xs sm:text-sm"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className={`absolute right-1.5 top-1/2 grid -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted ${
            compact ? "h-6.5 w-6.5" : "h-7 w-7"
          }`}
        >
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.4 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.5-4.8 9.5-8.5 0-.6-.1-1-.2-1.5H12z"
      />
      <path
        fill="#4285F4"
        d="M21.3 12.1c0-.7-.1-1.3-.2-1.9H12v3.8h5.2c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 2.9-4.2 2.9-7.2z"
      />
      <path
        fill="#FBBC05"
        d="M6 14.3c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V8.3H2.9C2.3 9.5 2 10.7 2 12s.3 2.5.9 3.7L6 14.3z"
      />
      <path
        fill="#34A853"
        d="M12 21.6c2.6 0 4.7-.9 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.4-4L2.9 15.7C4.5 19 8 21.6 12 21.6z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  );
}
