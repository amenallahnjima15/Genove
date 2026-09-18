import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  User,
  Shield,
  Bell,
  Globe,
  Check,
  Save,
  Lock,
  Key,
  Smartphone,
  CheckCircle2,
  Menu,
  Sparkles,
  ArrowLeft,
  Moon,
  Sun,
  Mail,
  Phone,
  AtSign,
  Trash2,
  GraduationCap,
  FolderGit2,
  Info,
  BadgeCheck,
  Zap,
  Upload,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage, Language } from "@/lib/language-context";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { toast } from "sonner";

import avatarMale1 from "@/assets/images/avatar_male_1_1785774086976.jpg";
import avatarFemale1 from "@/assets/images/avatar_female_1_1785774099751.jpg";
import avatarMale2 from "@/assets/images/avatar_male_2_1785774111655.jpg";
import avatarFemale2 from "@/assets/images/avatar_female_2_1785774122840.jpg";
import avatarMale3 from "@/assets/images/avatar_male_3_1785774136540.jpg";
import avatarFemale3 from "@/assets/images/avatar_female_3_1785774149668.jpg";

interface SettingsSearch {
  tab?: string;
}

export const Route = createFileRoute("/parametres")({
  validateSearch: (search: Record<string, unknown>): SettingsSearch => {
    return {
      tab: (search.tab as string) || "profile",
    };
  },
  head: () => ({
    meta: [
      { title: "Paramètres — Genove" },
      {
        name: "description",
        content:
          "Gérez vos informations personnelles, votre sécurité et vos préférences d'affichage.",
      },
    ],
  }),
  component: SettingsPage,
});

const AVATAR_PRESETS = [
  { url: avatarMale1, gender: "male", name: "Garçon 1" },
  { url: avatarMale2, gender: "male", name: "Garçon 2" },
  { url: avatarMale3, gender: "male", name: "Garçon 3" },
  { url: avatarFemale1, gender: "female", name: "Fille 1" },
  { url: avatarFemale2, gender: "female", name: "Fille 2" },
  { url: avatarFemale3, gender: "female", name: "Fille 3" },
];

function SettingsPage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "preferences"
  >("profile");

  useEffect(() => {
    if (search.tab === "security" || search.tab === "securite") {
      setActiveTab("security");
    } else if (search.tab === "notifications") {
      setActiveTab("notifications");
    } else if (search.tab === "preferences") {
      setActiveTab("preferences");
    } else if (search.tab === "profile" || search.tab === "profil") {
      setActiveTab("profile");
    }
  }, [search.tab]);

  // Profile Form state
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTriggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error(
        language === "fr"
          ? "L'image est trop volumineuse (max 8 Mo)"
          : "Image is too large (max 8MB)",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        toast.success(
          language === "fr"
            ? "Photo de profil importée avec succès !"
            : "Profile photo imported successfully!",
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(true);

  // Notification State
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCourses, setNotifCourses] = useState(true);
  const [notifProjects, setNotifProjects] = useState(true);
  const [notifAI, setNotifAI] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/connexion", search: { mode: "login" } });
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  if (!isAuthenticated) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(name, username, avatarUrl);
      toast.success(
        language === "fr" ? "Profil mis à jour avec succès !" : "Profile updated successfully!",
      );
    } catch {
      toast.error(language === "fr" ? "Erreur lors de la sauvegarde" : "Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error(
        language === "fr"
          ? "Veuillez saisir votre mot de passe actuel"
          : "Please enter your current password",
      );
      return;
    }
    if (newPassword.length < 6) {
      toast.error(
        language === "fr"
          ? "Le nouveau mot de passe doit contenir au moins 6 caractères"
          : "New password must be at least 6 characters",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(
        language === "fr" ? "Les mots de passe ne correspondent pas" : "Passwords do not match",
      );
      return;
    }
    toast.success(
      language === "fr" ? "Mot de passe modifié avec succès !" : "Password changed successfully!",
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const navTabs = [
    {
      id: "profile",
      label: language === "fr" ? "Mon Profil" : "My Profile",
      desc: language === "fr" ? "Informations personnelles" : "Personal details",
      icon: User,
    },
    {
      id: "security",
      label: language === "fr" ? "Sécurité" : "Security",
      desc: language === "fr" ? "Mot de passe & 2FA" : "Password & 2FA",
      icon: Shield,
    },
    {
      id: "notifications",
      label: "Notifications",
      desc: language === "fr" ? "Alertes & préférences" : "Alerts & preferences",
      icon: Bell,
    },
    {
      id: "preferences",
      label: language === "fr" ? "Langue & Apparence" : "Language & Theme",
      desc: language === "fr" ? "Affichage & langue" : "Display & language",
      icon: Globe,
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F3EEFE] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <DashboardSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {/* Mobile top navbar toggle */}
        <div className="sticky top-20 z-30 mb-4 flex h-14 items-center justify-between rounded-2xl border border-purple-100 bg-white/90 px-4 backdrop-blur-sm lg:hidden shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-purple-100 text-slate-700 hover:bg-purple-50"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <span className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              {t("dash.sidebarSettings")}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-6 relative">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute -top-12 -left-12 w-96 h-96 bg-[#8C52FF]/10 dark:bg-[#8C52FF]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-12 w-80 h-80 bg-amber-400/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer group"
                >
                  <div className="h-7 w-7 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform border border-purple-200/50 dark:border-purple-800/40">
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </div>
                  <span>{t("dash.sidebarDashboard")}</span>
                </button>

                <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" />

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-100/80 dark:bg-purple-900/40 text-[#8C52FF] dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                  <BadgeCheck className="h-3 w-3 text-[#8C52FF]" />
                  {language === "fr" ? "Compte Vérifié" : "Verified Account"}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <span>{t("dash.sidebarSettings")}</span>
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {language === "fr"
                  ? "Gérez votre compte, vos préférences de sécurité et personnalisez votre expérience."
                  : "Manage your account, security preferences, and customize your experience."}
              </p>
            </div>
          </div>

          {/* Main Container Card */}
          <div className="rounded-3xl bg-white/95 dark:bg-[#180E30]/95 backdrop-blur-xl border border-purple-200/80 dark:border-purple-500/35 shadow-2xl shadow-purple-950/10 overflow-hidden grid grid-cols-1 md:grid-cols-[270px_1fr] relative z-10">
            {/* Top Gold Shimmer Ray */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 dark:via-amber-400/80 to-transparent pointer-events-none" />

            {/* Left Tabs Sidebar */}
            <div className="border-b md:border-b-0 md:border-r border-purple-100/80 dark:border-purple-900/40 p-4 sm:p-5 space-y-2 bg-slate-50/60 dark:bg-[#120924]/60">
              <div className="px-3 py-1 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600/80 dark:text-purple-400/80">
                  {language === "fr" ? "Navigation" : "Navigation"}
                </span>
              </div>

              {/* Mobile Horizontal Pill Scroll */}
              <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-2 md:pb-0 scrollbar-none">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          tab.id as "profile" | "security" | "notifications" | "preferences",
                        )
                      }
                      className={`shrink-0 md:w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer relative group text-left ${
                        isActive
                          ? "bg-gradient-to-r from-[#8C52FF] via-[#7F42FF] to-[#6E2FE0] text-white shadow-md shadow-purple-500/30 scale-[1.01]"
                          : "text-slate-600 dark:text-slate-300 hover:bg-purple-100/60 dark:hover:bg-purple-950/50 hover:text-[#8C52FF] dark:hover:text-purple-300"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isActive
                            ? "bg-white/20 text-white shadow-xs"
                            : "bg-purple-100/70 dark:bg-purple-950/60 text-slate-500 dark:text-purple-300 group-hover:text-[#8C52FF] group-hover:bg-purple-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 pr-1">
                        <span className="block truncate font-black leading-snug">{tab.label}</span>
                        <span
                          className={`hidden md:block text-[10px] truncate font-medium ${
                            isActive ? "text-purple-100/80" : "text-slate-400 dark:text-slate-400"
                          }`}
                        >
                          {tab.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Main Content Section */}
            <div className="p-6 sm:p-8 lg:p-10">
              {/* TAB 1: PROFIL */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-purple-100/80 dark:border-purple-900/40 pb-5">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>
                          {language === "fr" ? "Informations Personnelles" : "Personal Details"}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {language === "fr"
                          ? "Ces informations seront visibles sur vos projets et votre profil public."
                          : "These details will be displayed on your projects and public profile."}
                      </p>
                    </div>
                  </div>

                  {/* Hidden File Input for Local Image Upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {/* Avatar Picker Card - Elevated glassmorphism */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30 dark:from-[#130B29]/90 dark:via-[#180E30] dark:to-[#130B29]/90 border border-purple-200/80 dark:border-purple-500/30 space-y-4 shadow-xs relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 dark:via-amber-400/40 to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#8C52FF] dark:bg-amber-400 animate-pulse" />
                        <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                          {language === "fr" ? "Photo de profil" : "Profile Picture"}
                        </label>
                      </div>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrl("");
                            toast.info(
                              language === "fr"
                                ? "Photo de profil réinitialisée"
                                : "Profile photo reset",
                            );
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:underline cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{language === "fr" ? "Supprimer la photo" : "Remove photo"}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-center text-center gap-4 py-2 relative z-10">
                      {/* Profile Avatar Circle */}
                      <div className="w-28 h-28 rounded-full border-2 border-amber-400 p-1 bg-gradient-to-br from-[#8C52FF] to-[#180E30] flex items-center justify-center text-white font-black text-3xl overflow-hidden shadow-xl shadow-purple-500/20 shrink-0 relative mx-auto ring-4 ring-purple-500/10 dark:ring-amber-400/10">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={name}
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          name.slice(0, 2).toUpperCase() || "US"
                        )}
                      </div>

                      <div className="space-y-4 w-full flex flex-col items-center">
                        {/* Explicit Button to Import Local Image */}
                        <button
                          type="button"
                          onClick={handleTriggerFileUpload}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-[#8C52FF] dark:text-purple-300 border border-purple-300/80 dark:border-purple-700/60 text-xs font-black transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm"
                        >
                          <Upload className="h-4 w-4 text-[#8C52FF] dark:text-amber-400" />
                          <span>
                            {language === "fr" ? "Importer une image locale" : "Import local image"}
                          </span>
                        </button>

                        <div className="w-full max-w-xs h-px bg-purple-100 dark:bg-purple-900/30 my-0.5" />

                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block text-center">
                          {language === "fr"
                            ? "Ou choisissez un avatar 3D prédéfini (cliquez à nouveau pour annuler) :"
                            : "Or select a 3D avatar preset (click again to deselect):"}
                        </span>

                        <div className="grid grid-cols-3 gap-3 justify-items-center max-w-[240px] mx-auto p-3 rounded-2xl bg-white/80 dark:bg-[#120924]/80 border border-purple-100 dark:border-purple-900/30">
                          {AVATAR_PRESETS.map((preset, i) => {
                            const isSelected = avatarUrl === preset.url;
                            return (
                              <button
                                key={i}
                                type="button"
                                title={
                                  isSelected
                                    ? language === "fr"
                                      ? "Cliquer pour désélectionner"
                                      : "Click to deselect"
                                    : preset.name
                                }
                                onClick={() => {
                                  if (isSelected) {
                                    setAvatarUrl("");
                                    toast.info(
                                      language === "fr" ? "Photo réinitialisée" : "Photo reset",
                                    );
                                  } else {
                                    setAvatarUrl(preset.url);
                                  }
                                }}
                                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer bg-[#180E30] ${
                                  isSelected
                                    ? "border-[#8C52FF] ring-4 ring-[#8C52FF]/25 scale-110 shadow-lg shadow-purple-500/30"
                                    : "border-slate-200 dark:border-purple-900/50 opacity-80 hover:opacity-100 hover:scale-105 hover:border-purple-400"
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.name}
                                  className="w-full h-full object-cover object-top scale-110"
                                  referrerPolicy="no-referrer"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#8C52FF]/50 backdrop-blur-[1px] flex items-center justify-center text-white">
                                    <Check className="h-4 w-4 stroke-[3]" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form fields with Icons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                        {language === "fr" ? "Nom complet" : "Full Name"}
                      </label>
                      <div className="relative flex items-center group">
                        <User className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#8C52FF] dark:group-focus-within:text-purple-300 transition-colors pointer-events-none" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-purple-200/80 dark:border-purple-500/30 bg-white dark:bg-[#120924]/80 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#8C52FF] dark:focus:border-purple-400 focus:ring-4 focus:ring-[#8C52FF]/15 transition-all shadow-2xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                        {language === "fr" ? "Nom d'utilisateur" : "Username"}
                      </label>
                      <div className="relative flex items-center group">
                        <AtSign className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#8C52FF] dark:group-focus-within:text-purple-300 transition-colors pointer-events-none" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-purple-200/80 dark:border-purple-500/30 bg-white dark:bg-[#120924]/80 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#8C52FF] dark:focus:border-purple-400 focus:ring-4 focus:ring-[#8C52FF]/15 transition-all shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                          {language === "fr" ? "Adresse email" : "Email Address"}
                        </label>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-purple-300/70 bg-slate-100 dark:bg-purple-950/60 px-2 py-0.5 rounded-md flex items-center gap-1 border border-transparent dark:border-purple-800/40">
                          <Lock className="h-2.5 w-2.5" />
                          {language === "fr" ? "Fixe" : "Fixed"}
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/80 dark:border-purple-900/40 bg-slate-100/70 dark:bg-[#120924]/40 text-xs font-bold text-slate-400 dark:text-slate-400 cursor-not-allowed select-none"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                        {language === "fr" ? "Téléphone" : "Phone Number"}
                      </label>
                      <div className="relative flex items-center group">
                        <Phone className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#8C52FF] dark:group-focus-within:text-purple-300 transition-colors pointer-events-none" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+216 -- --- ---"
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-purple-200/80 dark:border-purple-500/30 bg-white dark:bg-[#120924]/80 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400/60 focus:outline-none focus:border-[#8C52FF] dark:focus:border-purple-400 focus:ring-4 focus:ring-[#8C52FF]/15 transition-all shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                      Bio & Spécialité
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={
                        language === "fr"
                          ? "Parlez de vous, de votre domaine d'expertise, de vos recherches ou de vos centres d'intérêt..."
                          : "Tell us about yourself, your field of expertise, research, or interests..."
                      }
                      className="w-full rounded-xl border border-purple-200/80 dark:border-purple-500/30 bg-white dark:bg-[#120924]/80 p-4 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400/60 focus:outline-none focus:border-[#8C52FF] dark:focus:border-purple-400 focus:ring-4 focus:ring-[#8C52FF]/15 transition-all shadow-2xs resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-2.5 h-11 px-7 rounded-2xl bg-gradient-to-r from-[#8C52FF] via-[#7F42FF] to-[#6E2FE0] hover:from-purple-600 hover:to-purple-800 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>
                        {isSaving
                          ? "Enregistrement..."
                          : language === "fr"
                            ? "Enregistrer les modifications"
                            : "Save Changes"}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SECURITE */}
              {activeTab === "security" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-purple-100/80 dark:border-purple-900/40 pb-5">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {language === "fr" ? "Sécurité du Compte" : "Account Security"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {language === "fr"
                        ? "Gérez votre mot de passe et l'authentification renforcée."
                        : "Manage your password and enhanced security options."}
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                        {language === "fr" ? "Mot de passe actuel" : "Current Password"}
                      </label>
                      <div className="relative flex items-center group">
                        <Key className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#8C52FF] dark:group-focus-within:text-purple-300 transition-colors pointer-events-none" />
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-purple-200/80 dark:border-purple-500/30 bg-white dark:bg-[#120924]/80 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#8C52FF] dark:focus:border-purple-400 focus:ring-4 focus:ring-[#8C52FF]/15 transition-all shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                          {language === "fr" ? "Nouveau mot de passe" : "New Password"}
                        </label>
                        <div className="relative flex items-center group">
                          <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#8C52FF] dark:group-focus-within:text-purple-300 transition-colors pointer-events-none" />
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-purple-200/80 dark:border-purple-500/30 bg-white dark:bg-[#120924]/80 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#8C52FF] dark:focus:border-purple-400 focus:ring-4 focus:ring-[#8C52FF]/15 transition-all shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                          {language === "fr" ? "Confirmer le mot de passe" : "Confirm Password"}
                        </label>
                        <div className="relative flex items-center group">
                          <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-[#8C52FF] dark:group-focus-within:text-purple-300 transition-colors pointer-events-none" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-purple-200/80 dark:border-purple-500/30 bg-white dark:bg-[#120924]/80 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#8C52FF] dark:focus:border-purple-400 focus:ring-4 focus:ring-[#8C52FF]/15 transition-all shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2.5 h-11 px-7 rounded-2xl bg-gradient-to-r from-[#8C52FF] via-[#7F42FF] to-[#6E2FE0] hover:from-purple-600 hover:to-purple-800 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <Lock className="h-4 w-4" />
                        <span>
                          {language === "fr" ? "Mettre à jour le mot de passe" : "Update Password"}
                        </span>
                      </button>
                    </div>
                  </form>

                  <div className="border-t border-purple-100/80 dark:border-purple-900/40 pt-6 space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30 dark:from-[#130B29]/90 dark:via-[#180E30] dark:to-[#130B29]/90 border border-purple-200/80 dark:border-purple-500/30">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-2xl bg-[#8C52FF]/10 dark:bg-purple-900/40 text-[#8C52FF] dark:text-amber-400 flex items-center justify-center shrink-0 border border-[#8C52FF]/20 dark:border-purple-500/30 shadow-xs">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">
                              {language === "fr"
                                ? "Authentification à deux facteurs (2FA)"
                                : "Two-Factor Authentication (2FA)"}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                twoFactor
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50"
                                  : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              {twoFactor
                                ? language === "fr"
                                  ? "Actif"
                                  : "Active"
                                : language === "fr"
                                  ? "Inactif"
                                  : "Inactive"}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                            {language === "fr"
                              ? "Sécurisez l'accès à votre compte avec un code d'authentification mobile."
                              : "Secure account access with a mobile authenticator code."}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTwoFactor(!twoFactor);
                          toast.success(
                            !twoFactor
                              ? language === "fr"
                                ? "2FA activé"
                                : "2FA enabled"
                              : language === "fr"
                                ? "2FA désactivé"
                                : "2FA disabled",
                          );
                        }}
                        className={`h-6 w-11 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                          twoFactor ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full bg-white transition-transform ${
                            twoFactor ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-purple-100/80 dark:border-purple-900/40 pb-5">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {language === "fr"
                        ? "Préférences de Notification"
                        : "Notification Preferences"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {language === "fr"
                        ? "Choisissez les alertes et messages que vous souhaitez recevoir."
                        : "Select which alerts and updates you wish to receive."}
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      {
                        title: language === "fr" ? "Alertes par email" : "Email Alerts",
                        desc:
                          language === "fr"
                            ? "Recevoir les comptes-rendus et récapitulatifs hebdomadaires par email."
                            : "Receive weekly summaries and important announcements.",
                        icon: Mail,
                        state: notifEmail,
                        setState: setNotifEmail,
                      },
                      {
                        title:
                          language === "fr"
                            ? "Rappels de cours & formations"
                            : "Course & Training Reminders",
                        desc:
                          language === "fr"
                            ? "Notifications pour les sessions à venir et nouveaux modules débloqués."
                            : "Reminders for upcoming live sessions and unlocked modules.",
                        icon: GraduationCap,
                        state: notifCourses,
                        setState: setNotifCourses,
                      },
                      {
                        title:
                          language === "fr"
                            ? "Projets R&D & Validations"
                            : "R&D Projects & Validations",
                        desc:
                          language === "fr"
                            ? "Alertes lorsqu'un projet change de statut ou est approuvé."
                            : "Alerts when an R&D project status changes or gets approved.",
                        icon: FolderGit2,
                        state: notifProjects,
                        setState: setNotifProjects,
                      },
                      {
                        title:
                          language === "fr" ? "Suggestions IA Genove" : "Genove AI Suggestions",
                        desc:
                          language === "fr"
                            ? "Recommandations automatiques basées sur votre progression."
                            : "Automatic AI recommendations based on your progress.",
                        icon: Sparkles,
                        state: notifAI,
                        setState: setNotifAI,
                      },
                    ].map((item, idx) => {
                      const ItemIcon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50/50 via-white to-purple-50/20 dark:from-[#130B29]/80 dark:via-[#180E30] dark:to-[#130B29]/80 border border-purple-200/80 dark:border-purple-500/30 hover:border-[#8C52FF]/50 dark:hover:border-purple-400/50 transition-all shadow-2xs group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-100/70 dark:bg-purple-900/40 text-[#8C52FF] dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200/60 dark:border-purple-800/40 group-hover:scale-105 transition-transform">
                              <ItemIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                {item.title}
                              </h4>
                              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              item.setState(!item.state);
                              toast.success(
                                language === "fr" ? "Préférence enregistrée" : "Preference saved",
                              );
                            }}
                            className={`h-6 w-11 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                              item.state
                                ? "bg-[#8C52FF]"
                                : "bg-slate-300 dark:bg-purple-950/80 border border-slate-300 dark:border-purple-900/50"
                            }`}
                          >
                            <div
                              className={`h-4 w-4 rounded-full bg-white transition-transform ${
                                item.state ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: LANGUE & APPARENCE */}
              {activeTab === "preferences" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-purple-100/80 dark:border-purple-900/40 pb-5">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {language === "fr" ? "Langue & Apparence" : "Language & Appearance"}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {language === "fr"
                        ? "Configurez la langue de l'interface et le mode d'affichage."
                        : "Configure interface language and visual theme."}
                    </p>
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-3.5">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 block uppercase tracking-wide">
                      {language === "fr" ? "Langue de l'application" : "Application Language"}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                      {[
                        {
                          code: "fr",
                          label: "Français",
                          flag: (
                            <svg
                              className="w-5 h-3.5 rounded-[2px] overflow-hidden shrink-0 inline-block shadow-xs"
                              viewBox="0 0 3 2"
                            >
                              <rect width="1" height="2" fill="#002395" />
                              <rect x="1" width="1" height="2" fill="#FFFFFF" />
                              <rect x="2" width="1" height="2" fill="#ED2939" />
                            </svg>
                          ),
                        },
                        {
                          code: "en",
                          label: "English",
                          flag: (
                            <svg
                              className="w-5 h-3.5 rounded-[2px] overflow-hidden shrink-0 inline-block shadow-xs"
                              viewBox="0 0 60 30"
                            >
                              <rect width="60" height="30" fill="#012169" />
                              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
                            </svg>
                          ),
                        },
                      ].map((opt) => (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => {
                            setLanguage(opt.code as Language);
                            toast.success(
                              opt.code === "fr"
                                ? "Langue changée en Français"
                                : "Language changed to English",
                            );
                          }}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                            language === opt.code
                              ? "border-[#8C52FF] bg-purple-50/90 dark:bg-purple-900/40 text-[#8C52FF] dark:text-purple-300 font-black shadow-sm ring-2 ring-[#8C52FF]/20 scale-[1.02]"
                              : "border-purple-200/80 dark:border-purple-500/30 bg-white dark:bg-[#120924]/80 text-slate-600 dark:text-slate-300 font-bold hover:border-purple-300 dark:hover:border-purple-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex items-center">{opt.flag}</span>
                            <span className="text-xs">{opt.label}</span>
                          </div>
                          {language === opt.code && (
                            <CheckCircle2 className="h-4 w-4 text-[#8C52FF] dark:text-purple-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
