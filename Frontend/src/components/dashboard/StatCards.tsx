import {
  GraduationCap,
  BookOpen,
  Rocket,
  Briefcase,
  Target,
  Clock,
  Award,
  type LucideIcon,
} from "lucide-react";
import { stats } from "./mock-data";
import { useLanguage } from "@/lib/language-context";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  BookOpen,
  Rocket,
  Briefcase,
  Target,
  Clock,
  Award,
};

const labelKeyMap: Record<string, string> = {
  done: "dash.statDone",
  ongoing: "dash.statOngoing",
  projects: "dash.statProjects",
  internships: "dash.statInternships",
  score: "dash.statScore",
  time: "dash.statTime",
  badges: "dash.statBadges",
};

export function StatCards() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-7">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] ?? Target;
        const key = labelKeyMap[stat.key];
        const label = key ? t(key) : stat.label;

        return (
          <div
            key={stat.key}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
              <Icon className="h-4.5 w-4.5" />
            </span>
            <div className="mt-3">
              <p className="font-heading text-xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-[11.5px] leading-tight text-muted-foreground">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
