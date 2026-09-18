import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { MyProjectsPanel } from "@/components/dashboard/MainPanels";
import { ProfilePanel, TodayTasksPanel, TeamPanel } from "@/components/dashboard/RightPanel";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const locale = language === "fr" ? "fr-FR" : "en-US";
      const formatted = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(now);
      const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      setCurrentDateStr(capitalized);
    };

    updateDate();
    const interval = setInterval(updateDate, 30000);
    return () => clearInterval(interval);
  }, [language]);

  const displayName = user?.name || "Lotfi Njima";
  const email = user?.email || "lotfinjima06@gmail.com";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F3EEFE] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      {/* Left Sidebar */}
      <DashboardSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {/* Mobile menu bar */}
        <div className="sticky top-20 z-30 mb-4 flex h-14 items-center gap-3 rounded-2xl border border-purple-100 bg-white/90 px-4 backdrop-blur-sm lg:hidden shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-purple-100 text-slate-700 hover:bg-purple-50"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
          <span className="font-heading text-sm font-bold text-slate-900">{t("dash.title")}</span>
        </div>

        {/* Dashboard Outer Container with rounded border matching screenshot */}
        <div className="mx-auto max-w-[1550px]">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left/Center Main Column */}
            <div className="min-w-0 space-y-6">
              {/* Header Bar matching screenshot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div className="flex flex-col items-start justify-center text-left m-0 p-0">
                  <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight m-0 p-0">
                    {t("dash.title")}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 m-0 p-0 tracking-normal leading-normal">
                    {currentDateStr}
                  </p>
                </div>

                {/* Orange/Coral Date selector pill */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#FF7043] text-white px-4 py-2 text-xs font-black shadow-md shadow-orange-500/20">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>{t("dash.dateRange")}</span>
                  </div>
                </div>
              </div>

              {/* 1. Hero Welcome Banner */}
              <WelcomeBanner name={displayName} />

              {/* 2. Middle Row: Activity Chart + Progress Donut + Quick Stats */}
              <ChartsSection />

              {/* 3. Bottom Row: Projects Grid */}
              <MyProjectsPanel />
            </div>

            {/* Right Column Panel */}
            <div className="space-y-6">
              {/* Top Profile Header */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="font-heading text-base font-extrabold text-slate-900 dark:text-white">
                    {t("dash.myProfile")}
                  </h2>
                  <p className="text-xs font-bold text-slate-400">{t("dash.yourProgress")}</p>
                </div>
                <button className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-purple-100/50 transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Profile Card */}
              <ProfilePanel name={displayName} email={email} progress={70} />

              {/* Today Section */}
              <TodayTasksPanel />

              {/* Team Section */}
              <TeamPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
