import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Award,
  Rocket,
  Briefcase,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/lib/language-context";
import {
  recentActivities,
  coursesProgress,
  badges,
  recommendations,
  deadlines,
  internshipApplications,
} from "./mock-data";

const iconMap: Record<string, LucideIcon> = {
  CheckCircle2,
  Award,
  Rocket,
  Briefcase,
  Sparkles,
};

function PanelCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)] sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-bold text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function RecentActivityPanel() {
  const { t } = useLanguage();
  return (
    <PanelCard title={t("dash.recentActivity")}>
      <ul className="space-y-3">
        {recentActivities.map((a) => {
          const Icon = iconMap[a.icon] ?? Sparkles;
          return (
            <li key={a.id} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
              </div>
              <span className="ml-auto shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">
                {a.time}
              </span>
            </li>
          );
        })}
      </ul>
    </PanelCard>
  );
}

export function MyProjectsPanel() {
  const { t } = useLanguage();
  const projects = [
    {
      id: "p1",
      title: "Baseline Project",
      sub: t("dash.userProjectSub"),
      desc: t("dash.baselineDesc"),
      badgeColor: "bg-rose-500 text-white",
      iconBg: "bg-rose-500",
    },
    {
      id: "p2",
      title: "Paper Industry",
      sub: t("dash.userProjectSub"),
      desc: t("dash.paperIndustryDesc"),
      badgeColor: "bg-emerald-500 text-white",
      iconBg: "bg-emerald-500",
    },
    {
      id: "p3",
      title: "Tool Production",
      sub: t("dash.userProjectSub"),
      desc: t("dash.toolProductionDesc"),
      badgeColor: "bg-sky-500 text-white",
      iconBg: "bg-sky-500",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h3 className="font-heading text-lg font-black text-slate-900 dark:text-white">
          {t("dash.project")}
        </h3>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="text-purple-600 dark:text-purple-400">2 Design</span>
          <span>•</span>
          <span>3 Mockup</span>
          <span>•</span>
          <span>2 Layout</span>
        </div>
      </div>

      {/* 3 Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${p.iconBg} text-white shadow-md`}
              >
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  {p.title}
                </h4>
                <span className="text-[11px] font-bold text-slate-400 block mt-0.5">{p.sub}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoursesProgressPanel() {
  const { t } = useLanguage();
  return (
    <PanelCard
      title={t("dash.coursesProgress")}
      action={
        <Link
          to="/catalogue"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent"
        >
          {t("dash.catalogue")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <ul className="space-y-4">
        {coursesProgress.map((c) => (
          <li key={c.id}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-foreground">{c.title}</span>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                {c.progress}%
              </span>
            </div>
            <Progress value={c.progress} className="h-2" />
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}

export function SkillsBadgesPanel() {
  const { t } = useLanguage();
  return (
    <PanelCard title={t("dash.skillsBadges")}>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{t("dash.obtainedBadges")}</p>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b.id}
            className={
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold " +
              (b.color === "accent"
                ? "bg-accent/15 text-[oklch(0.5_0.1_85)]"
                : "bg-primary/10 text-primary")
            }
          >
            <Award className="h-3.5 w-3.5" /> {b.label}
          </span>
        ))}
      </div>
    </PanelCard>
  );
}

export function RecommendationsPanel() {
  const { t } = useLanguage();
  return (
    <PanelCard title={t("dash.aiRecommendations")}>
      <ul className="space-y-3">
        {recommendations.map((r) => (
          <li
            key={r.id}
            className="flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:border-accent/60"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15 text-[oklch(0.5_0.1_85)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}

export function DeadlinesPanel() {
  const { t } = useLanguage();
  return (
    <PanelCard title={t("dash.deadlines")}>
      <ul className="space-y-2.5">
        {deadlines.map((d) => (
          <li
            key={d.id}
            className="flex items-center justify-between gap-2 rounded-xl border border-border p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{d.title}</p>
              <span className="text-[11px] text-muted-foreground">{d.type}</span>
            </div>
            <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {d.date}
            </span>
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}

export function InternshipApplicationsPanel() {
  const { t } = useLanguage();
  const statusColor: Record<string, string> = {
    Entretien: "bg-accent/15 text-[oklch(0.5_0.1_85)]",
    "En révision": "bg-primary/10 text-primary",
    Envoyée: "bg-muted text-muted-foreground",
  };
  return (
    <PanelCard
      title={t("dash.internshipApps")}
      action={
        <span className="text-xs font-semibold text-muted-foreground">
          {internshipApplications.length} {t("dash.inProgress")}
        </span>
      }
    >
      <ul className="space-y-2.5">
        {internshipApplications.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between gap-2 rounded-xl border border-border p-3"
          >
            <div className="min-w-0 flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{a.role}</p>
                <p className="truncate text-xs text-muted-foreground">{a.company}</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor[a.status]}`}
            >
              {a.status}
            </span>
          </li>
        ))}
      </ul>
    </PanelCard>
  );
}
