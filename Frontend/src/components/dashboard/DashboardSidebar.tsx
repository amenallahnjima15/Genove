import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  Settings,
  HelpCircle,
  Plus,
  X,
  Sparkles,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { GenoveLogo } from "@/components/genove/GenoveLogo";

type NavItem = {
  key: string;
  labelFallback: string;
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  {
    key: "dash.sidebarDashboard",
    labelFallback: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  { key: "dash.sidebarProjects", labelFallback: "Projets R&D", to: "/projets", icon: FolderKanban },
  {
    key: "dash.sidebarCourses",
    labelFallback: "Formations",
    to: "/catalogue",
    icon: GraduationCap,
  },
  { key: "dash.sidebarSettings", labelFallback: "Paramètres", to: "/parametres", icon: Settings },
  { key: "dash.sidebarHelp", labelFallback: "Aide & Support", to: "/aide", icon: HelpCircle },
];

export function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();

  const content = (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 rounded-3xl text-slate-700 dark:text-slate-200 shadow-lg overflow-hidden">
      {/* Top Logo Header */}
      <div
        className={cn(
          "relative flex shrink-0 flex-col items-center justify-center border-b border-purple-100/60 dark:border-slate-800/80 px-4 py-5 w-full text-center transition-all",
          collapsed ? "py-4" : "py-5",
        )}
      >
        <Link
          to="/"
          className="flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.03] group"
        >
          {collapsed ? (
            <GenoveLogo variant="icon" height={36} className="animate-[spin_6s_linear_infinite]" />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              {/* Single centered Genove wordmark logo with spinning 'O' planet */}
              <GenoveLogo
                variant="wordmark"
                height={34}
                textColor="currentColor"
                spinPlanet={true}
                className="text-slate-900 dark:text-amber-50 transition-colors duration-200"
              />

              {/* Animated & Bilingual Tagline */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={t("genove.tagline")}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center justify-center gap-1.5 text-xs font-serif italic"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 fill-amber-400/30 shrink-0" />
                  </motion.div>

                  <span className="font-serif italic text-xs font-medium tracking-wide text-amber-700 dark:text-amber-300/90 whitespace-nowrap">
                    {t("genove.tagline")}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </Link>
        <button
          onClick={onCloseMobile}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Fermer le menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 py-6">
        {navItems.map((item) => {
          const label = t(item.key) || item.labelFallback;
          const isActive = item.to
            ? pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to))
            : false;
          const Icon = item.icon;
          const linkClasses = cn(
            "group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200",
            collapsed && "justify-center px-0",
            isActive
              ? "bg-[#8C52FF] text-white shadow-lg shadow-purple-500/30 font-extrabold"
              : "text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800/80 hover:text-purple-700 dark:hover:text-purple-300",
          );
          const body = (
            <>
              <div
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-xl transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100",
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
              </div>
              {!collapsed && <span className="truncate">{label}</span>}
            </>
          );
          return item.to ? (
            <Link
              key={item.key}
              to={item.to}
              className={linkClasses}
              title={collapsed ? label : undefined}
            >
              {body}
            </Link>
          ) : (
            <button
              key={item.key}
              type="button"
              className={linkClasses}
              title={collapsed ? label : undefined}
            >
              {body}
            </button>
          );
        })}
      </nav>

      {/* Bottom CTA Card "Add New Project" */}
      <div className="p-4 border-t border-purple-50 dark:border-slate-800">
        {!collapsed ? (
          <div className="rounded-2xl bg-purple-50/70 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700/60 p-4 text-center space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 text-left">
                {t("dash.sidebarAddProject")}
              </span>
              <Link
                to="/proposer-projet"
                className="grid h-10 w-10 place-items-center rounded-xl bg-[#8C52FF] text-[#ffffff] shadow-md shadow-purple-500/30 hover:scale-105 transition-transform"
                title={t("dash.sidebarAddProject")}
              >
                <Plus className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ) : (
          <Link
            to="/proposer-projet"
            className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[#8C52FF] text-[#ffffff] shadow-md shadow-purple-500/30 hover:scale-105 transition-transform"
            title={t("dash.sidebarAddProject")}
          >
            <Plus className="h-5 w-5" />
          </Link>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "mt-3 hidden w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:flex",
            collapsed && "px-0",
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>{t("dash.sidebarCollapse")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-20 hidden h-[calc(100vh-5.5rem)] shrink-0 transition-all duration-300 ease-out lg:block z-20 my-2 ml-3 lg:ml-6",
          collapsed ? "w-[5rem]" : "w-64",
        )}
      >
        {content}
      </aside>

      {/* Mobile off-canvas */}
      <div
        className={cn(
          "fixed inset-0 z-[70] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={onCloseMobile}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
