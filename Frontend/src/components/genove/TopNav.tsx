import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Globe,
  ChevronRight,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  Sliders,
  User,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage, type Language } from "@/lib/language-context";
import { NotificationWidget } from "@/components/genove/NotificationWidget";
import { GenoveLogo } from "@/components/genove/GenoveLogo";

const FranceFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block" viewBox="0 0 3 2">
    <rect width="1" height="2" fill="#002395" />
    <rect x="1" width="1" height="2" fill="#FFFFFF" />
    <rect x="2" width="1" height="2" fill="#ED2939" />
  </svg>
);

const UKFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block" viewBox="0 0 60 30">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const links = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Formations" },
  { to: "/projets", label: "Projets" },
  { to: "/savoir", label: "Savoir+" },
] as const;

export function TopNav({ activeTab }: { activeTab?: string } = {}) {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDesktopUserMenu, setShowDesktopUserMenu] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // Reset mobile settings accordion when mobile menu is closed
  useEffect(() => {
    if (!open) {
      setShowMobileSettings(false);
    }
  }, [open]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/catalogue", label: t("nav.courses") },
    { to: "/projets", label: t("nav.projects") },
    { to: "/savoir", label: t("nav.savoir") },
  ] as const;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock outer background body scrolling when mobile menu, user profile menu, settings modal, or confirmation dialogs are open
  useEffect(() => {
    if (open || showLogoutConfirm || showDesktopUserMenu || showMobileSettings) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, showLogoutConfirm, showDesktopUserMenu, showMobileSettings]);

  const getProfileDisplayName = () => {
    if (!user) return "User";
    const lowerName = user.name.toLowerCase();
    if (
      lowerName === "user" ||
      lowerName === "utilisateur" ||
      user.email.includes("google") ||
      user.email.includes("github") ||
      lowerName.includes("google") ||
      lowerName.includes("github")
    ) {
      return "User";
    }
    return user.name;
  };

  const displayName = getProfileDisplayName();

  const isTransparentPage =
    pathname === "/" ||
    pathname === "/savoir" ||
    pathname === "/projets" ||
    pathname === "/proposer-projet" ||
    pathname === "/connexion" ||
    pathname === "/aide";
  const headerContainerClass = scrolled
    ? "bg-[#180E30]/90 border-purple-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
    : isTransparentPage
      ? "bg-[#180E30]/75 border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      : "bg-[#180E30]/90 border-purple-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.4)]";

  return (
    <header className="sticky top-3 z-[9999] w-full px-3 sm:px-6 lg:px-8 transition-all duration-300 ease-out">
      <div
        className={
          "mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 rounded-full border backdrop-blur-xl transition-all duration-300 " +
          headerContainerClass
        }
      >
        <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-95">
          <GenoveLogo
            variant="wordmark"
            height={28}
            className="group-hover:scale-[1.02] transition-transform duration-200"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md p-1 md:flex shadow-inner">
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={(e) => {
                  if (l.to === "/savoir" && !isAuthenticated) {
                    e.preventDefault();
                    navigate({ to: "/connexion", search: { mode: "login", redirect: "/savoir" } });
                  }
                }}
                className={
                  "rounded-full px-4 py-1.5 text-xs font-extrabold transition-all duration-200 ease-out " +
                  (active
                    ? "bg-gradient-to-r from-[#8C52FF] to-[#7030EF] text-white shadow-md shadow-purple-500/30 border border-purple-300/30 scale-[1.02]"
                    : "text-slate-200 hover:text-white hover:bg-white/15")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSelector />
          <Link
            to="/aide"
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                navigate({ to: "/connexion", search: { mode: "login", redirect: "/aide" } });
              }
            }}
            className="grid h-8.5 w-8.5 place-items-center rounded-full border border-white/15 bg-white/10 text-slate-200 hover:text-purple-300 hover:bg-white/20 transition-all cursor-pointer"
            title={language === "fr" ? "Aide & Support" : "Help & Support"}
          >
            <HelpCircle className="h-4 w-4" />
          </Link>
          <Link
            to="/parametres"
            className="grid h-8.5 w-8.5 place-items-center rounded-full border border-white/15 bg-white/10 text-slate-200 hover:text-amber-300 hover:bg-white/20 transition-all cursor-pointer"
            title={language === "fr" ? "Paramètres du Dashboard" : "Dashboard Settings"}
          >
            <Settings className="h-4 w-4" />
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <NotificationWidget />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDesktopUserMenu((v) => !v)}
                  className="group inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-gradient-to-r from-[#8C52FF]/20 via-purple-900/40 to-[#180E30]/60 hover:border-amber-400/70 pl-1 pr-3 py-1 text-xs font-extrabold text-white shadow-md hover:shadow-purple-500/20 transition-all duration-200 cursor-pointer"
                  title={t("nav.dashboard")}
                >
                  <div className="w-6.5 h-6.5 rounded-full border-2 border-amber-400 bg-gradient-to-br from-[#8C52FF] to-[#5B21B6] flex items-center justify-center text-white font-black text-[10px] shadow-sm overflow-hidden shrink-0">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "AN"
                    )}
                  </div>
                  <span className="truncate max-w-[120px] font-bold text-slate-100">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-amber-400 transition-transform duration-200 ${showDesktopUserMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showDesktopUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDesktopUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-purple-500/30 bg-[#180E30]/98 backdrop-blur-xl p-2 shadow-2xl z-[99999] text-slate-100 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 bg-white/5 rounded-xl border border-white/5 mb-1">
                        <p className="text-xs font-bold text-white truncate">{displayName}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {user?.email || "Membre Genove"}
                        </p>
                      </div>

                      {/* 1. Profil */}
                      <Link
                        to="/parametres"
                        search={{ tab: "profile" }}
                        onClick={() => setShowDesktopUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <User className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{language === "fr" ? "Profil" : "Profile"}</span>
                      </Link>

                      {/* 2. Tableau de bord */}
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDesktopUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{language === "fr" ? "Tableau de bord" : "Dashboard"}</span>
                      </Link>

                      {/* 3. Langue */}
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/5 transition-colors">
                        <span className="flex items-center gap-2.5">
                          <Globe className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>{language === "fr" ? "Langue" : "Language"}</span>
                        </span>
                        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLanguage("fr");
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                              language === "fr"
                                ? "bg-[#8C52FF] text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <FranceFlag />
                            FR
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLanguage("en");
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                              language === "en"
                                ? "bg-[#8C52FF] text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <UKFlag />
                            EN
                          </button>
                        </div>
                      </div>

                      {/* 4. Sécurité */}
                      <Link
                        to="/parametres"
                        search={{ tab: "security" }}
                        onClick={() => setShowDesktopUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Shield className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{language === "fr" ? "Sécurité" : "Security"}</span>
                      </Link>

                      {/* 5. Aide */}
                      <Link
                        to="/aide"
                        onClick={() => setShowDesktopUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4 text-slate-300 shrink-0" />
                        <span>{language === "fr" ? "Aide" : "Help"}</span>
                      </Link>

                      <div className="my-1 h-px bg-white/10" />

                      {/* 6. Déconnexion */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowDesktopUserMenu(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-red-400 shrink-0" />
                        <span>{t("nav.logout")}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/connexion"
                search={{ mode: "login" }}
                className="inline-flex h-8.5 items-center rounded-full border border-white/15 bg-white/10 px-3.5 text-xs font-extrabold text-white hover:bg-white/20 transition-all"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/connexion"
                search={{ mode: "signup" }}
                className="inline-flex h-8.5 items-center rounded-full bg-gradient-to-r from-[#8C52FF] to-[#7030EF] px-4 text-xs font-extrabold text-white shadow-md shadow-purple-500/30 hover:from-purple-600 hover:to-purple-800 transition-all"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && <NotificationWidget />}
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 min-h-[44px] min-w-[44px] place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 md:hidden animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-md rounded-3xl border border-purple-500/30 bg-[#180E30]/98 p-4 sm:p-5 shadow-2xl backdrop-blur-2xl max-h-[88vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-200 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <GenoveLogo variant="full" height={32} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {links.map((l) => {
                const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={(e) => {
                      setOpen(false);
                      if (l.to === "/savoir" && !isAuthenticated) {
                        e.preventDefault();
                        navigate({
                          to: "/connexion",
                          search: { mode: "login", redirect: "/savoir" },
                        });
                      }
                    }}
                    className={`flex items-center min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-extrabold transition-all ${
                      active
                        ? "bg-gradient-to-r from-[#8C52FF] to-[#7030EF] text-white shadow-md"
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-white/10" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-1.5">
                  {/* User Profile Card Header - Clicking it navigates to Profile */}
                  <div
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: "/parametres", search: { tab: "profile" } });
                    }}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-purple-500/20 mb-1 cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-[#8C52FF] flex items-center justify-center text-xs font-black text-white overflow-hidden shrink-0 shadow-sm">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "AN"
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors truncate">
                        {displayName}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 truncate">
                        {user?.email || "Membre Genove"}
                      </span>
                    </div>
                  </div>

                  {/* Paramètres Toggle Accordion Button */}
                  <button
                    type="button"
                    onClick={() => setShowMobileSettings((prev) => !prev)}
                    className={`w-full h-11 rounded-xl text-xs font-extrabold flex items-center justify-between px-3.5 transition-all cursor-pointer ${
                      showMobileSettings
                        ? "bg-white/15 text-white border border-white/10 font-bold"
                        : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Settings
                        className={`h-4 w-4 shrink-0 ${
                          showMobileSettings ? "text-amber-400" : "text-slate-400"
                        }`}
                      />
                      <span>{language === "fr" ? "Paramètres" : "Settings"}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        showMobileSettings ? "rotate-180 text-amber-400" : ""
                      }`}
                    />
                  </button>

                  {/* Sub-options - ONLY shown when Paramètres is clicked */}
                  {showMobileSettings && (
                    <div className="flex flex-col gap-1.5 pl-2 pt-1 pb-1 animate-fade-in border-l-2 border-purple-500/30 ml-3">
                      {/* 1. Profil */}
                      <Link
                        to="/parametres"
                        search={{ tab: "profile" }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-200 hover:bg-white/10 hover:text-white transition-all min-h-[40px]"
                      >
                        <User className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{language === "fr" ? "Profil" : "Profile"}</span>
                      </Link>

                      {/* 2. Tableau de bord */}
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-200 hover:bg-white/10 hover:text-white transition-all min-h-[40px]"
                      >
                        <LayoutDashboard className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{language === "fr" ? "Tableau de bord" : "Dashboard"}</span>
                      </Link>

                      {/* 3. Langue */}
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-slate-200 bg-white/5 border border-white/5 min-h-[40px]">
                        <span className="flex items-center gap-2.5">
                          <Globe className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>{language === "fr" ? "Langue" : "Language"}</span>
                        </span>
                        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLanguage("fr");
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                              language === "fr"
                                ? "bg-[#8C52FF] text-white shadow-xs"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <FranceFlag />
                            FR
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLanguage("en");
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                              language === "en"
                                ? "bg-[#8C52FF] text-white shadow-xs"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <UKFlag />
                            EN
                          </button>
                        </div>
                      </div>

                      {/* 4. Sécurité */}
                      <Link
                        to="/parametres"
                        search={{ tab: "security" }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-200 hover:bg-white/10 hover:text-white transition-all min-h-[40px]"
                      >
                        <Shield className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>{language === "fr" ? "Sécurité" : "Security"}</span>
                      </Link>

                      {/* 5. Aide */}
                      <Link
                        to="/aide"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-200 hover:bg-white/10 hover:text-white transition-all min-h-[40px]"
                      >
                        <HelpCircle className="h-4 w-4 text-slate-300 shrink-0" />
                        <span>{language === "fr" ? "Aide" : "Help"}</span>
                      </Link>

                      {/* 6. Déconnexion */}
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-extrabold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 transition-all cursor-pointer w-full text-left min-h-[40px] mt-1"
                      >
                        <LogOut className="h-4 w-4 text-red-400 shrink-0" />
                        <span>{t("nav.logout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/connexion"
                      search={{ mode: "login" }}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center min-h-[44px] rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-center text-xs font-extrabold text-white hover:bg-white/20 transition-all"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      to="/connexion"
                      search={{ mode: "signup" }}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center min-h-[44px] rounded-xl bg-gradient-to-r from-[#8C52FF] to-[#7030EF] px-3 py-2.5 text-center text-xs font-extrabold text-white shadow-md"
                    >
                      {t("nav.signup")}
                    </Link>
                  </div>

                  {/* Language option when unauthenticated */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-200 bg-white/5 border border-white/5 min-h-[44px]">
                    <span className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>{language === "fr" ? "Langue" : "Language"}</span>
                    </span>
                    <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLanguage("fr");
                        }}
                        className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          language === "fr"
                            ? "bg-[#8C52FF] text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <FranceFlag />
                        FR
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLanguage("en");
                        }}
                        className={`px-2 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          language === "en"
                            ? "bg-[#8C52FF] text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <UKFlag />
                        EN
                      </button>
                    </div>
                  </div>

                  {/* Aide link when unauthenticated */}
                  <Link
                    to="/aide"
                    onClick={(e) => {
                      setOpen(false);
                      if (!isAuthenticated) {
                        e.preventDefault();
                        navigate({
                          to: "/connexion",
                          search: { mode: "login", redirect: "/aide" },
                        });
                      }
                    }}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-200 hover:bg-white/10 hover:text-white transition-all min-h-[44px]"
                  >
                    <HelpCircle className="h-4 w-4 text-slate-300 shrink-0" />
                    <span>{language === "fr" ? "Aide & Support" : "Help & Support"}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999999] flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col select-none animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-center text-slate-900 dark:text-white mb-3 leading-snug px-4">
              {t("nav.logoutConfirmTitle")}
            </h3>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-semibold">
              {t("nav.logoutConfirmDesc")}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-10 rounded-2xl border border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold transition-all cursor-pointer"
              >
                {t("nav.cancel")}
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  await logout();
                  navigate({ to: "/" });
                }}
                className="flex-1 h-10 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-red-500/20"
              >
                {t("nav.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const options: { code: Language; label: string; flag: React.ReactNode }[] = [
    { code: "fr", label: "Français", flag: <FranceFlag /> },
    { code: "en", label: "English", flag: <UKFlag /> },
  ];

  const currentOption = options.find((o) => o.code === language) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        className="inline-flex h-9 min-h-[38px] items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/20 transition-colors cursor-pointer shadow-xs"
        aria-label="Changer de langue"
      >
        <span className="flex items-center">{currentOption.flag}</span>
        <span className="uppercase tracking-wider font-extrabold text-amber-300">
          {currentOption.code}
        </span>
        <span className="text-white/50 text-[9px] ml-0.5">▼</span>
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-purple-500/30 bg-[#180E30]/98 backdrop-blur-xl p-1.5 shadow-2xl z-[99999]">
            {options.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setLanguage(opt.code);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold transition-colors cursor-pointer min-h-[38px] ${
                  language === opt.code
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{opt.label}</span>
                <span className="flex items-center">{opt.flag}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
