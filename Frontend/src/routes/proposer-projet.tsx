import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Mail,
  MapPin,
  Sparkles,
  Wrench,
  Building2,
  Tag,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { Footer } from "@/components/genove/Footer";
import { GenoveLogo, GenoveLogoCard } from "@/components/genove/GenoveLogo";

export const Route = createFileRoute("/proposer-projet")({
  head: () => ({
    meta: [
      { title: "Proposer un projet — Genove" },
      {
        name: "description",
        content: "Décrivez votre projet pour recruter les meilleurs talents Genove.",
      },
    ],
  }),
  component: ProposerProjet,
});

const SECTORS_FR = [
  "Finance & Banque",
  "Santé & Pharmacie",
  "Éducation & Formation",
  "Technologies & IT",
  "E-commerce & Retail",
  "Industrie & Aéronautique",
  "Transport & Logistique",
  "Énergie & Environnement",
  "Agroalimentaire",
  "Immobilier & BTP",
  "Télécommunications",
  "Marketing & Médias",
  "Tourisme & Hôtellerie",
  "Conseil & Services",
  "Secteur Public",
  "Art & Culture",
  "Autre",
];

const SECTORS_EN = [
  "Finance & Banking",
  "Healthcare & Pharma",
  "Education & Training",
  "Technologies & IT",
  "E-commerce & Retail",
  "Industry & Aerospace",
  "Transport & Logistics",
  "Energy & Environment",
  "Agri-Food",
  "Real Estate & Construction",
  "Telecommunications",
  "Marketing & Media",
  "Tourism & Hospitality",
  "Consulting & Services",
  "Public Sector",
  "Art & Culture",
  "Other",
];

function ProposerProjet() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  const sectors = language === "en" ? SECTORS_EN : SECTORS_FR;

  const [form, setForm] = useState({
    org: "",
    title: "",
    sector: "",
    customSector: "",
    budget: "",
    deadline: "",
    duration: "",
    location: "",
    description: "",
    skills: "",
    email: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/connexion", search: { mode: "login", redirect: "/proposer-projet" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (user?.email && !form.email) setForm((f) => ({ ...f, email: user.email }));
  }, [user, form.email]);

  if (!isAuthenticated) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="relative min-h-screen -mt-16 pt-28 sm:pt-32 md:pt-36 pb-12 overflow-hidden bg-[#180E30] transition-colors duration-300">
      {/* Background Soft Radial Glows matching Genove header & footer */}
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_15%_10%,#8C52FF,transparent_45%),radial-gradient(circle_at_85%_80%,#FBBF24,transparent_45%)]" />

      {/* Background Micro Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-8">
        <button
          onClick={() => navigate({ to: "/projets" })}
          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-2 text-xs font-bold text-slate-200 hover:text-white border border-white/15 shadow-md transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4 text-amber-400" />{" "}
          {language === "en" ? "Back to projects" : "Retour aux projets"}
        </button>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Main Form Container */}
          <div className="rounded-3xl bg-[#130B29]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-purple-500/30 overflow-hidden">
            {/* Hero Banner */}
            <div className="relative p-6 sm:p-9 text-white overflow-hidden bg-gradient-to-br from-[#8C52FF] via-[#7030EF] to-[#5B21B6]">
              <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_70%,#FBBF24,transparent_45%)]" />
              <div className="relative z-10 flex flex-col items-start">
                <div className="mb-4 flex items-center gap-3 sm:gap-4 flex-nowrap">
                  <GenoveLogoCard
                    isCircle
                    logoHeight={48}
                    className="w-16 h-16 sm:w-20 sm:h-20 shadow-xl border-purple-400/50 shrink-0"
                  />
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/40 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-amber-300 backdrop-blur-md shadow-xs whitespace-nowrap shrink-0">
                    <Sparkles className="h-3 w-3 text-accent shrink-0" />{" "}
                    {language === "en" ? "Project Portal" : "Portail Projets"}
                  </span>
                </div>
                <h1 className="mt-1 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                  {language === "en"
                    ? "Recruit Top Tech & AI Talents"
                    : "Recrutez l'Élite des Talents IA & Tech"}
                </h1>
                <p className="mt-2 max-w-xl text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                  {language === "en"
                    ? "Submit your project and goals. Our expert team qualifies your requirements and selects the most suitable talents."
                    : "Soumettez votre projet et vos objectifs. Notre équipe qualifie votre besoin et sélectionne les talents les plus adaptés."}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-[#130B29]">
              {sent ? (
                <div className="py-8 text-center space-y-6">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-extrabold text-white">
                      {language === "en"
                        ? "Project successfully submitted!"
                        : "Projet soumis avec succès !"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto">
                      {language === "en"
                        ? "Thank you for your trust. Our engineering team will analyze your requirements and get back to you within 48h."
                        : "Merci pour votre confiance. Notre équipe d'experts va analyser votre cahier des charges et reviendra vers vous sous 48h."}
                    </p>
                  </div>

                  {/* Recap Card */}
                  <div className="mx-auto max-w-lg rounded-2xl border border-purple-500/30 bg-[#180E30] p-6 text-left text-xs space-y-3.5 shadow-md text-slate-200">
                    <div className="font-heading font-bold text-sm text-white border-b border-purple-500/20 pb-3 flex items-center justify-between">
                      <span>
                        {language === "en"
                          ? "Summary of your request"
                          : "Récapitulatif de votre demande"}
                      </span>
                      <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-bold">
                        {language === "en" ? "Pending validation" : "En attente de validation"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          {language === "en" ? "Project" : "Projet"}
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {form.title ||
                            (language === "en" ? "Custom Tech Project" : "Projet Sur-mesure")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          {language === "en" ? "Organization" : "Organisation"}
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {form.org || (language === "en" ? "Not specified" : "Non spécifiée")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          {language === "en" ? "Sector" : "Secteur"}
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {form.sector === "Autre" || form.sector === "Other"
                            ? form.customSector || (language === "en" ? "Other" : "Autre")
                            : form.sector || (language === "en" ? "Not specified" : "Non spécifié")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          {language === "en" ? "Estimated budget" : "Budget prévu"}
                        </span>
                        <span className="font-bold text-amber-400 text-sm">
                          {form.budget
                            ? `${form.budget} ${language === "en" ? "TND" : "DT"}`
                            : language === "en"
                              ? "Not specified"
                              : "Non précisé"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          {language === "en" ? "Desired deadline" : "Deadline souhaitée"}
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {form.deadline || (language === "en" ? "Flexible" : "Flexible")}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          {language === "en" ? "Estimated duration" : "Durée estimée"}
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {form.duration || (language === "en" ? "Not specified" : "Non précisée")}
                        </span>
                      </div>
                      <div className="col-span-2 border-t border-purple-500/20 pt-2.5">
                        <span className="text-slate-400 block text-[11px]">
                          {language === "en" ? "Contact" : "Contact"}
                        </span>
                        <span className="font-semibold text-white truncate block text-sm">
                          {form.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate({ to: "/projets" })}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-xs font-semibold text-accent-foreground hover:bg-accent-hover shadow-[var(--shadow-gold)] transition-colors cursor-pointer"
                    >
                      {language === "en" ? "Back to projects" : "Retour aux projets"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6">
                  {/* Section 1: Organisation & Secteur */}
                  <div className="rounded-2xl border border-purple-500/25 bg-[#180E30]/70 p-5 sm:p-6 shadow-inner space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-400/20 text-amber-300">
                        <Briefcase className="h-3.5 w-3.5" />
                      </span>
                      {language === "en" ? "1. Organization & Sector" : "1. Organisation & Secteur"}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField
                        label={
                          language === "en" ? "Company / Organization" : "Entreprise / Organisation"
                        }
                        icon={<Briefcase className="h-4 w-4" />}
                        value={form.org}
                        onChange={(v) => setForm({ ...form, org: v })}
                        placeholder={
                          language === "en"
                            ? "e.g. Bank of Tunis, Enova..."
                            : "Ex. Banque de Tunisie, Enova..."
                        }
                        required
                      />
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-200">
                          {language === "en" ? "Sector" : "Secteur"}
                        </label>
                        <select
                          value={form.sector}
                          onChange={(e) => setForm({ ...form, sector: e.target.value })}
                          required
                          className="h-12 w-full rounded-xl border border-purple-500/30 bg-[#1D123A] px-3.5 text-sm outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 cursor-pointer text-white font-medium transition-all"
                        >
                          <option value="" disabled className="bg-[#180E30] text-slate-400">
                            {language === "en" ? "Select a sector" : "Sélectionner un secteur"}
                          </option>
                          {sectors.map((s) => (
                            <option key={s} value={s} className="bg-[#180E30] text-white">
                              {s}
                            </option>
                          ))}
                        </select>

                        {(form.sector === "Autre" || form.sector === "Other") && (
                          <input
                            ref={(el) => el?.focus()}
                            autoFocus
                            type="text"
                            value={form.customSector}
                            onChange={(e) => setForm({ ...form, customSector: e.target.value })}
                            placeholder={
                              language === "en"
                                ? "Specify your sector of activity..."
                                : "Précisez votre secteur d'activité..."
                            }
                            required
                            className="mt-2.5 h-11 w-full rounded-xl border border-purple-500/30 bg-[#1D123A] px-3.5 text-sm outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 text-white placeholder:text-slate-400 font-medium transition-all"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Détails du Projet */}
                  <div className="rounded-2xl border border-purple-500/25 bg-[#180E30]/70 p-5 sm:p-6 shadow-inner space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-400/20 text-amber-300">
                        <Building2 className="h-3.5 w-3.5" />
                      </span>
                      {language === "en"
                        ? "2. Project Specifications"
                        : "2. Caractéristiques du Projet"}
                    </h3>

                    <TextField
                      label={language === "en" ? "Project Title" : "Titre du projet"}
                      icon={<Building2 className="h-4 w-4" />}
                      value={form.title}
                      onChange={(v) => setForm({ ...form, title: v })}
                      placeholder={
                        language === "en"
                          ? "e.g. AI Risk Management Platform"
                          : "Ex. Plateforme de gestion des risques IA"
                      }
                      required
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-200 flex items-center justify-between">
                          <span>{language === "en" ? "Estimated budget" : "Budget estimé"}</span>
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-md">
                            {language === "en" ? "in TND" : "en DT"}
                          </span>
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Coins className="h-4 w-4 text-amber-400" />
                          </span>
                          <input
                            type="text"
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                            placeholder={language === "en" ? "e.g. 15,000" : "Ex. 15 000"}
                            className="h-12 w-full rounded-xl border border-purple-500/30 bg-[#1D123A] pl-10 pr-12 text-sm outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 text-white placeholder:text-slate-400 font-medium transition-all"
                          />
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            {language === "en" ? "TND" : "DT"}
                          </span>
                        </div>
                      </div>

                      <TextField
                        label={language === "en" ? "Deadline" : "Date limite"}
                        icon={<Calendar className="h-4 w-4" />}
                        type="date"
                        value={form.deadline}
                        onChange={(v) => setForm({ ...form, deadline: v })}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField
                        label={language === "en" ? "Estimated duration" : "Durée estimée"}
                        icon={<Clock className="h-4 w-4" />}
                        value={form.duration}
                        onChange={(v) => setForm({ ...form, duration: v })}
                        placeholder={language === "en" ? "e.g. 3 months" : "Ex. 3 mois"}
                      />
                      <TextField
                        label={language === "en" ? "Location" : "Lieu"}
                        icon={<MapPin className="h-4 w-4" />}
                        value={form.location}
                        onChange={(v) => setForm({ ...form, location: v })}
                        placeholder={
                          language === "en" ? "e.g. Tunis, Remote..." : "Ex. Tunis, à distance..."
                        }
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-200">
                        {language === "en" ? "Project description" : "Description du projet"}
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        required
                        placeholder={
                          language === "en"
                            ? "Key objectives, expected deliverables, and project scope..."
                            : "Objectifs clés, livrables attendus et périmètre du projet..."
                        }
                        className="w-full rounded-xl border border-purple-500/30 bg-[#1D123A] px-3.5 py-3 text-sm outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 text-white placeholder:text-slate-400 leading-relaxed font-normal transition-all"
                      />
                    </div>
                  </div>

                  {/* Section 3: Compétences & Contact */}
                  <div className="rounded-2xl border border-purple-500/25 bg-[#180E30]/70 p-5 sm:p-6 shadow-inner space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-400/20 text-amber-300">
                        <Wrench className="h-3.5 w-3.5" />
                      </span>
                      {language === "en" ? "3. Skills & Contact" : "3. Compétences & Contact"}
                    </h3>

                    <TextField
                      label={language === "en" ? "Required skills" : "Compétences recherchées"}
                      icon={<Wrench className="h-4 w-4" />}
                      value={form.skills}
                      onChange={(v) => setForm({ ...form, skills: v })}
                      placeholder={
                        language === "en"
                          ? "e.g. Python, React, Data Science, PostgreSQL..."
                          : "Ex. Python, React, Data Science, PostgreSQL..."
                      }
                    />

                    <TextField
                      label={language === "en" ? "Contact email" : "Email de contact"}
                      icon={<Mail className="h-4 w-4" />}
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      placeholder={
                        language === "en" ? "contact@company.com" : "contact@entreprise.tn"
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-6 inline-flex h-12 sm:h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-[0_10px_30px_rgba(251,191,36,0.35)] transition-all hover:from-amber-300 hover:to-amber-400 hover:scale-[1.005] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                  >
                    <Sparkles className="h-4.5 w-4.5 text-slate-950 fill-slate-950/20" />{" "}
                    {language === "en"
                      ? "Submit project proposal"
                      : "Envoyer la proposition de projet"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Sidebar - Logo Presentation Card & Guarantees Card */}
          <div className="space-y-6">
            <GenoveLogoCard logoOnly logoHeight={72} />

            {/* Guarantees Card */}
            <div className="rounded-3xl bg-[#130B29]/90 border border-purple-500/30 p-6 space-y-4 text-slate-200 backdrop-blur-xl shadow-xl">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                {language === "en"
                  ? "Why publish your project with us?"
                  : "Pourquoi publier votre projet ici ?"}
              </h3>
              <ul className="space-y-3 text-xs text-slate-300 font-medium">
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    {language === "en"
                      ? "Pre-verified technical profiles with verified skills"
                      : "Profils qualifiés et compétences vérifiées sur projets réels"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    {language === "en"
                      ? "Fast matching under 48 business hours"
                      : "Mise en relation rapide sous 48 heures ouvrées"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>
                    {language === "en"
                      ? "Dedicated technical advisor support"
                      : "Accompagnement personnalisé par un conseiller technique dédié"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (type === "date" && inputRef.current) {
      if ("showPicker" in inputRef.current && typeof inputRef.current.showPicker === "function") {
        try {
          inputRef.current.showPicker();
          return;
        } catch {
          // fallback
        }
      }
      inputRef.current.focus();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-200">{label}</label>
      <div className="relative">
        {icon && (
          <button
            type="button"
            onClick={handleIconClick}
            tabIndex={-1}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors z-10 cursor-pointer"
            title="Ouvrir le calendrier"
          >
            {icon}
          </button>
        )}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={
            "h-12 w-full rounded-xl border border-purple-500/30 bg-[#1D123A] pr-3.5 text-sm outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 text-white placeholder:text-slate-400 font-medium transition-all " +
            (icon ? "pl-10 " : "pl-3.5 ") +
            (type === "date"
              ? "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-20 "
              : "")
          }
        />
      </div>
    </div>
  );
}
