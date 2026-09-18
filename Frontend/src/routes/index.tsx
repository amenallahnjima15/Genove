import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Play,
  Sparkles,
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  MessageSquareText,
  Award,
  Rocket,
  Star,
  Clock,
  Check,
} from "lucide-react";
import { Footer } from "@/components/genove/Footer";
import { useEffect, useRef, useState } from "react";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useLanguage } from "@/lib/language-context";
import { motion } from "motion/react";
import heroBannerImg from "@/assets/images/genove_hero_banner_1784128228929.jpg";
import smartCatalogueImg from "@/assets/images/smart_catalogue_ai_1784911245253.jpg";
import partnerProjectsImg from "@/assets/images/partner_projects_hub_1784911261694.jpg";
import savoirRagImg from "@/assets/images/savoir_multi_agents_1784911278660.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function useCounter(target: number, active: boolean, duration = 1500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return n;
}

function Stat({
  value,
  prefix = "",
  suffix = "",
  label,
  icon: Icon,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.3,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const n = useCounter(value, seen);
  return (
    <div
      ref={ref}
      className="group relative rounded-3xl bg-[#180E30]/90 border border-purple-500/35 backdrop-blur-xl p-6 sm:p-7 hover:border-amber-400/60 hover:bg-[#180E30] hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl group-hover:bg-amber-400/20 transition-colors pointer-events-none" />

      {Icon && (
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center mb-3.5 group-hover:scale-110 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-300 transition-all duration-300 shadow-md">
          <Icon className="h-6 w-6 stroke-[2.2]" />
        </div>
      )}
      <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 group-hover:text-amber-300 tracking-tight leading-none">
        {prefix}
        {n.toLocaleString("fr-FR")}
        {suffix}
      </div>
      <div className="mt-2.5 text-xs sm:text-sm font-bold text-slate-200/90 group-hover:text-white transition-colors">
        {label}
      </div>
    </div>
  );
}

const RECOMMENDED = [
  {
    tFr: "Data Analyst — Parcours complet",
    tEn: "Data Analyst — Full Track",
    thFr: "Data",
    thEn: "Data",
    lvlFr: "Intermédiaire",
    lvlEn: "Intermediate",
    d: "48h",
    r: 4.9,
    bFr: "Populaire",
    bEn: "Popular",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  {
    tFr: "Architecture RAG & Agents IA",
    tEn: "RAG Architecture & AI Agents",
    thFr: "IA",
    thEn: "AI",
    lvlFr: "Avancé",
    lvlEn: "Advanced",
    d: "24h",
    r: 4.9,
    bFr: "Nouveau",
    bEn: "New",
    img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
  },
  {
    tFr: "UX Research pour produits SaaS",
    tEn: "UX Research for SaaS Products",
    thFr: "Design",
    thEn: "Design",
    lvlFr: "Intermédiaire",
    lvlEn: "Intermediate",
    d: "18h",
    r: 4.7,
    bFr: "Certifiant",
    bEn: "Certified",
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80",
  },
];

const ONGOING_PROJECTS = [
  {
    tFr: "Dashboard risques crédits IA",
    tEn: "AI Credit Risk Dashboard",
    oFr: "Banque Partenaire",
    oEn: "Partner Bank",
    team: 4,
    sFr: "Finance",
    sEn: "Finance",
  },
  {
    tFr: "Assistant IA parcours patient",
    tEn: "AI Patient Journey Assistant",
    oFr: "Centre de Santé",
    oEn: "Healthcare Center",
    team: 6,
    sFr: "Santé",
    sEn: "Healthcare",
  },
  {
    tFr: "Plateforme d'exercices adaptatifs",
    tEn: "Adaptive Practice Platform",
    oFr: "Université Partenaire",
    oEn: "Partner University",
    team: 3,
    sFr: "Éducation",
    sEn: "Education",
  },
];

function Index() {
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const { t, language } = useLanguage();

  const goCatalogue = () => requireAuth(() => navigate({ to: "/catalogue" }));
  const goProjets = () => requireAuth(() => navigate({ to: "/projets" }));
  const goSavoir = () => navigate({ to: "/savoir" });

  return (
    <div className="bg-[#180E30] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 min-h-screen">
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden text-white -mt-16"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <img
            src={heroBannerImg}
            alt="Genove Smart Learning Platform"
            className="w-full h-full object-cover object-center lg:object-[75%_center] opacity-15 md:opacity-95 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Dark overlay ensuring perfect contrast & clean background on mobile while maintaining desktop layout */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#180E30] via-[#180E30]/95 to-[#120924] md:hidden" />
          <div className="hidden md:block absolute inset-y-0 left-0 w-3/5 lg:w-[52%] bg-gradient-to-r from-[#180E30] via-[#180E30]/95 to-transparent" />
          <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#180E30] via-transparent to-[#180E30]/40" />
        </div>

        {/* Ambient radial glowing highlights */}
        <div className="pointer-events-none absolute inset-0 opacity-40 md:opacity-25 [background-image:radial-gradient(circle_at_15%_20%,#8C52FF_0%,transparent_45%),radial-gradient(circle_at_85%_80%,#7030EF_0%,transparent_50%),radial-gradient(circle_at_50%_95%,#FBBF24_0%,transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-32 lg:pt-44 lg:pb-36 grid gap-12 lg:grid-cols-[1.18fr_1fr] items-center min-h-[600px] lg:min-h-[680px] my-auto w-full">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-md shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-400" /> {t("hero.badge")}
              </span>
              <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-[#261543]/90 border border-amber-500/50 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all hover:border-amber-400 hover:scale-[1.02] cursor-default">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping absolute opacity-75" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 relative shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                </span>
                <span className="text-xs sm:text-sm font-black tracking-wide text-amber-300">
                  +248 {t("hero.activeCourses")}
                </span>
              </div>
            </div>
            <h1 className="mt-5 sm:mt-6 font-heading text-3xl sm:text-4xl lg:text-[3.1rem] xl:text-[3.5rem] font-black tracking-tight lg:tracking-tighter leading-[1.1] text-white">
              <span className="block">{t("hero.title1")}</span>
              <span className="block bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                {t("hero.title2")}
              </span>
            </h1>
            <p className="mt-5 sm:mt-6 text-lg sm:text-xl text-slate-200/90 max-w-2xl leading-relaxed font-medium">
              {t("hero.subtitle")}
            </p>
            <div className="mt-9 flex flex-col sm:flex-row flex-wrap gap-4">
              <button
                onClick={goCatalogue}
                className="inline-flex items-center justify-center gap-2.5 h-13 sm:h-14 px-7 rounded-2xl bg-amber-400 text-slate-950 font-black text-base hover:bg-amber-300 hover:-translate-y-0.5 shadow-lg shadow-amber-400/25 transition-all cursor-pointer border border-amber-300/50 min-h-[48px] w-full sm:w-auto"
              >
                {t("hero.ctaExplore")} <ArrowRight className="h-5 w-5 text-slate-950" />
              </button>
              <button
                onClick={goSavoir}
                className="inline-flex items-center justify-center gap-2.5 h-13 sm:h-14 px-7 rounded-2xl border border-white/25 bg-white/10 text-white font-black text-base hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer min-h-[48px] w-full sm:w-auto"
              >
                <Play className="h-4.5 w-4.5" /> {t("hero.ctaDemo")}
              </button>
            </div>
            <div className="mt-9 sm:mt-11 pt-6 sm:pt-7 border-t border-white/15 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 hover:border-white/25 transition-all cursor-default flex-1 sm:flex-initial min-w-[130px] sm:min-w-0">
                <Award className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">
                  {t("hero.trust1")}
                </span>
              </div>
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 hover:border-white/25 transition-all cursor-default flex-1 sm:flex-initial min-w-[130px] sm:min-w-0">
                <Building2 className="h-4 w-4 text-sky-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">
                  {t("hero.trust2")}
                </span>
              </div>
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 hover:border-white/25 transition-all cursor-default flex-1 sm:flex-initial min-w-[130px] sm:min-w-0">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">
                  {t("hero.trust3")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean overlay space for hero banner image */}
          <div className="relative hidden lg:block min-h-[300px]" />
        </div>
      </section>

      {/* Trois écosystèmes */}
      <section className="py-20 relative overflow-hidden bg-[#F3EEFE] dark:bg-slate-950/80 transition-colors duration-300">
        {/* Background Soft Glow Bulbs */}
        <div className="absolute top-10 -left-20 w-[35rem] h-[35rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-20 w-[35rem] h-[35rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Background Micro Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="uppercase tracking-wider">{t("hero.ecosystemTag")}</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t("hero.ecosystemTitle1")}{" "}
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                {t("hero.ecosystemTitle2")}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              {t("hero.ecosystemSubtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: t("hero.learners"),
                desc: t("hero.learnersDesc"),
              },
              {
                icon: Users,
                title: t("hero.trainers"),
                desc: t("hero.trainersDesc"),
              },
              {
                icon: Building2,
                title: t("hero.partners"),
                desc: t("hero.partnersDesc"),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative rounded-3xl border border-purple-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl p-8 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#8C52FF] text-white flex items-center justify-center font-black shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-purple-500/20">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-heading text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="relative overflow-hidden bg-[#180E30] py-16 md:py-20 border-y border-purple-500/30 shadow-2xl">
        {/* Background Soft Glow Bulbs */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_50%,#8C52FF35,transparent_50%),radial-gradient(circle_at_80%_50%,#FBBF2425,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 grid gap-6 grid-cols-2 md:grid-cols-4">
          <Stat value={12500} suffix="+" label={t("hero.statLearners")} icon={Users} />
          <Stat value={248} prefix="+" label={t("hero.statCourses")} icon={BookOpen} />
          <Stat value={92} suffix="%" label={t("hero.statCompletion")} icon={Award} />
          <Stat value={40} suffix="+" label={t("hero.statPartners")} icon={Building2} />
        </div>
      </section>

      {/* Formations recommandées & Projets en cours (Unified Section) */}
      <section className="py-24 relative overflow-hidden bg-[#F3EEFE] dark:bg-slate-950/80 transition-colors duration-300 border-y border-purple-100/80 dark:border-slate-800/80">
        {/* Background Soft Glow Bulbs spanning full height */}
        <div className="absolute top-10 -left-20 w-[40rem] h-[40rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-[40rem] h-[40rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-[35rem] h-[35rem] bg-indigo-500/15 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Background Micro Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10 space-y-20">
          {/* Part 1: Formations recommandées */}
          <div>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="uppercase tracking-wider">{t("home.selectionTag")}</span>
                </div>
                <h2 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {t("home.recTitle1")}{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                    {t("home.recTitle2")}
                  </span>
                </h2>
                <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {t("home.recSubtitle")}
                </p>
              </div>
              <button
                onClick={goCatalogue}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#8C52FF] hover:bg-purple-700 text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-purple-500/20 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t("home.seeAllCatalogue")}</span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </button>
            </div>

            <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {RECOMMENDED.map((c) => {
                const title = language === "en" ? c.tEn : c.tFr;
                const badge = language === "en" ? c.bEn : c.bFr;
                const theme = language === "en" ? c.thEn : c.thFr;
                return (
                  <button
                    key={c.tFr}
                    onClick={() => {
                      requireAuth(() => {
                        navigate({
                          to: "/catalogue",
                          search: { course: c.tFr },
                        });
                      });
                    }}
                    className="group relative rounded-3xl border border-purple-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl overflow-hidden hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left shadow-sm flex flex-col justify-between w-full"
                  >
                    <div className="w-full">
                      <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-900">
                        <img
                          src={c.img}
                          alt={title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#180E30]/80 via-transparent to-black/30" />
                        <span
                          className={
                            "absolute top-3 left-3 text-[11px] font-extrabold px-3 py-1 rounded-full backdrop-blur-md shadow-xs " +
                            (c.bFr === "Nouveau"
                              ? "bg-amber-400 text-slate-900"
                              : c.bFr === "Populaire"
                                ? "bg-white text-slate-900"
                                : "border border-white/60 text-white bg-black/40")
                          }
                        >
                          {badge}
                        </span>
                        <div className="absolute bottom-3 left-3 text-white font-bold text-xs bg-[#180E30]/80 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                          {theme}
                        </div>
                      </div>
                      <div className="p-6 w-full">
                        <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[3.25rem] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-0 w-full">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-4 border-t border-purple-100/60 dark:border-slate-800 font-semibold w-full">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-amber-500" /> {c.d}
                        </span>
                        <span className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-amber-400">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {c.r}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part 2: Projets en cours */}
          <div>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
                  <Rocket className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="uppercase tracking-wider">{t("home.ongoingTag")}</span>
                </div>
                <h2 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {t("home.projTitle1")}{" "}
                  <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                    {t("home.projTitle2")}
                  </span>
                </h2>
                <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {t("home.projSubtitle")}
                </p>
              </div>
              <button
                onClick={goProjets}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#8C52FF] hover:bg-purple-700 text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-purple-500/20 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t("home.allProjects")}</span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </button>
            </div>

            <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {ONGOING_PROJECTS.map((p) => {
                const title = language === "en" ? p.tEn : p.tFr;
                const org = language === "en" ? p.oEn : p.oFr;
                const sector = language === "en" ? p.sEn : p.sFr;
                return (
                  <button
                    key={p.tFr}
                    onClick={goProjets}
                    className="group relative rounded-3xl border border-purple-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl p-7 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left shadow-sm flex flex-col justify-between w-full"
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-2 mb-4 w-full">
                        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-slate-700">
                          {sector}
                        </span>
                        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {t("home.ongoingTag")}
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-xl text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
                        {org}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-purple-100/60 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold w-full">
                      <span className="flex items-center gap-1.5 font-extrabold">
                        <Users className="h-4 w-4 text-purple-600" /> {p.team}{" "}
                        {t("home.collaborators")}
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-extrabold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {t("home.view")} <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features détaillées avec arrière-plan flow & flou */}
      <section className="py-24 relative overflow-hidden bg-[#F3EEFE] dark:bg-slate-950/80 border-y border-purple-100/80 dark:border-slate-800/80 transition-colors duration-300">
        {/* Soft background ambient glows & flowing mesh light */}
        <div className="absolute top-10 -left-20 w-[42rem] h-[42rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[42rem] h-[42rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-[38rem] h-[38rem] bg-indigo-500/15 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Micro Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10 space-y-16 sm:space-y-20">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="uppercase tracking-wider">{t("hero.ecosystemTag")}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t("home.techHeading1")}{" "}
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                {t("home.techHeading2")}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {t("home.techSubtitle")}
            </p>
          </div>

          <div className="space-y-16 sm:space-y-20">
            {[
              {
                badge: t("home.catTitle"),
                icon: BookOpen,
                title: t("home.catTitle"),
                highlight: t("home.catHighlight"),
                desc: t("home.catDesc"),
                cta: { label: t("home.catCta"), action: goCatalogue },
                bullets: [t("home.catB1"), t("home.catB2"), t("home.catB3")],
                img: smartCatalogueImg,
                tag: language === "en" ? "AI & Semantic Match" : "IA & Match Sémantique",
                stat: language === "en" ? "120+ Courses" : "120+ Formations",
              },
              {
                badge: t("home.projTitle"),
                icon: Rocket,
                title: t("home.projTitle"),
                highlight: t("home.projHighlight"),
                desc: t("home.projDesc"),
                cta: { label: t("home.projCta"), action: goProjets },
                bullets: [t("home.projB1"), t("home.projB2"), t("home.projB3")],
                img: partnerProjectsImg,
                tag: language === "en" ? "Enterprise Ecosystem" : "Écosystème Entreprises",
                stat: language === "en" ? "100% Practical Cases" : "100% Cas Pratiques",
              },
              {
                badge: t("home.savoirTitle"),
                icon: MessageSquareText,
                title: t("home.savoirTitle"),
                highlight: t("home.savoirHighlight"),
                desc: t("home.savoirDesc"),
                cta: { label: t("home.savoirCta"), action: goSavoir },
                bullets: [t("home.savoirB1"), t("home.savoirB2"), t("home.savoirB3")],
                img: savoirRagImg,
                tag: language === "en" ? "Multi-Agent RAG Pipeline" : "Pipeline Multi-Agents RAG",
                stat: language === "en" ? "Verified Answers" : "Réponses Vérifiées",
              },
            ].map((f, i) => (
              <motion.div
                key={f.badge}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 backdrop-blur-xl shadow-sm hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div
                  className={
                    "grid gap-10 lg:gap-14 items-center md:grid-cols-2 " +
                    (i % 2 ? "md:[&>*:first-child]:order-2" : "")
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
                      <f.icon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      <span className="uppercase tracking-wider">{f.badge}</span>
                    </div>

                    <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      {f.title}{" "}
                      <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                        {f.highlight}
                      </span>
                    </h3>

                    <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      {f.desc}
                    </p>

                    <ul className="space-y-3 pt-1">
                      {f.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-3 font-semibold text-slate-800 dark:text-slate-100 text-sm sm:text-base"
                        >
                          <div className="h-6 w-6 rounded-lg bg-purple-100 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black shrink-0 shadow-2xs">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <button
                        onClick={f.cta.action}
                        className="inline-flex items-center gap-2.5 h-12 rounded-2xl bg-[#8C52FF] hover:bg-purple-700 text-white px-6 text-sm font-black transition-all shadow-md shadow-purple-500/20 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                      >
                        <span>{f.cta.label}</span>
                        <ArrowRight className="h-4 w-4 text-amber-400" />
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: i % 2 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group/img cursor-pointer"
                    onClick={f.cta.action}
                  >
                    {/* Outer soft ambient glow aura */}
                    <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-purple-500/25 via-indigo-600/20 to-purple-500/25 opacity-60 blur-xl group-hover/img:opacity-100 group-hover/img:blur-2xl transition-all duration-500 pointer-events-none" />

                    {/* Main App Window Container */}
                    <div className="relative rounded-[28px] border border-purple-100/90 dark:border-slate-800/90 bg-[#180E30] overflow-hidden shadow-2xl transition-all duration-500 group-hover/img:border-purple-300 group-hover/img:-translate-y-1.5">
                      {/* Image & Interactive Overlays Area */}
                      <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-slate-950">
                        <img
                          src={f.img}
                          alt={f.badge}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105 opacity-90"
                          referrerPolicy="no-referrer"
                        />

                        {/* Subtle Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#180E30]/90 via-transparent to-black/30 pointer-events-none" />

                        {/* Floating Stat Badge Overlay Top Right */}
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-md border border-white/15 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black shadow-lg flex items-center gap-1.5 sm:gap-2">
                          <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-amber-400" />
                          <span>{f.stat}</span>
                        </div>

                        {/* Bottom Floating Interactive Glass Banner */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-white/10 dark:bg-slate-900/80 border border-white/20 dark:border-white/15 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-2 group-hover/img:bg-white/20 dark:group-hover/img:bg-slate-900/95 transition-all duration-300">
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                              <f.icon className="h-4 sm:h-5 w-4 sm:w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-white font-extrabold text-xs sm:text-sm leading-tight group-hover/img:text-amber-300 transition-colors truncate">
                                {f.title} {f.highlight}
                              </div>
                              <div className="text-slate-300 text-[10px] sm:text-[11px] font-medium flex items-center gap-1 mt-0.5 truncate">
                                <span className="shrink-0">{t("home.preview")}</span>
                                <span>•</span>
                                <span className="text-amber-400 font-bold truncate">
                                  {t("home.clickExplore")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-[#8C52FF] text-white flex items-center justify-center font-black group-hover/img:translate-x-1 transition-transform shrink-0 shadow-sm">
                            <ArrowRight className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe fondatrice tunisienne */}
      <section className="py-24 relative overflow-hidden bg-[#F3EEFE] dark:bg-slate-950/80 transition-colors duration-300">
        {/* Background Soft Glow Bulbs */}
        <div className="absolute top-10 -left-20 w-[35rem] h-[35rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-20 w-[35rem] h-[35rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Background Micro Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
              <Users className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="uppercase tracking-wider">{t("home.teamTag")}</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t("home.teamTitle1")}{" "}
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                {t("home.teamTitle2")}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              {t("home.teamSubtitle")}
            </p>
          </div>

          <motion.div
            className="mt-12 grid gap-6 grid-cols-2 md:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {[
              { n: "Yassine Ben Salah", r: "CEO & Co-fondateur" },
              { n: "Amina Trabelsi", r: "CTO — Architecture IA" },
              { n: "Mohamed Chaabane", r: "Directeur du Design Produit" },
              { n: "Nour Bouazizi", r: "Directeur des Partenariats" },
            ].map((p) => (
              <motion.div
                key={p.n}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 100, damping: 15 },
                  },
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative rounded-3xl border border-purple-100/80 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl p-8 text-center hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer shadow-sm overflow-hidden"
              >
                <div className="mx-auto h-24 w-24 rounded-full bg-[#8C52FF] border-2 border-amber-400 text-white font-heading text-xl font-black flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
                  {p.n
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <h3 className="mt-5 font-heading text-xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {p.n}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">
                  {p.r}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-[#180E30] text-white pt-12 pb-20 border-t border-purple-900/40">
        <div className="mx-auto max-w-7xl px-6">
          <div
            className="rounded-3xl p-10 md:p-14 text-white text-center shadow-2xl border border-purple-500/20"
            style={{ background: "linear-gradient(135deg, #26164A 0%, #180E30 100%)" }}
          >
            <Award className="h-8 w-8 text-amber-400 mx-auto" />
            <h2 className="mt-4 font-heading text-3xl md:text-4xl font-extrabold">
              {t("home.ctaReady")}
            </h2>
            <p className="mt-3 text-white/80 max-w-xl mx-auto font-medium">{t("home.ctaDesc")}</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-md sm:max-w-none mx-auto">
              <Link
                to="/connexion"
                search={{ mode: "signup" }}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-2xl bg-amber-400 text-slate-900 font-extrabold text-sm hover:bg-amber-300 shadow-md shadow-amber-400/25 transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto min-h-[48px]"
              >
                {t("home.ctaFree")}
              </Link>
              <button
                type="button"
                onClick={goSavoir}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-2xl border border-white/30 bg-white/10 hover:bg-white/20 font-bold text-sm text-white transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto min-h-[48px]"
              >
                {t("home.ctaTalk")}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
