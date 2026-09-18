import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { GenoveLogo, GenoveLogoCard } from "@/components/genove/GenoveLogo";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  UserCircle2,
  GraduationCap,
  FolderKanban,
  LayoutDashboard,
  Briefcase,
  Settings,
  MessageSquareText,
  LifeBuoy,
  Mail,
  Phone,
  Clock,
  Send,
  BookOpen,
  FileText,
  PlayCircle,
  Video,
  HelpCircle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Award,
  Bell,
  X,
} from "lucide-react";
import { Footer } from "@/components/genove/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/aide")({
  head: () => ({
    meta: [
      { title: "Centre d'aide — Genove" },
      {
        name: "description",
        content:
          "Trouvez des réponses à vos questions sur votre compte, vos cours, vos projets, vos stages et l'assistant IA Genove. Contactez notre équipe support.",
      },
      { property: "og:title", content: "Centre d'aide — Genove" },
      {
        property: "og:description",
        content:
          "Toute l'assistance Genove réunie : FAQ, guides, ressources et support humain pour apprenants, formateurs et partenaires.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AidePage,
});

/* --------------------------------------------------------------------- */
/*                                  Data                                  */
/* --------------------------------------------------------------------- */

type CategoryId =
  "compte" | "cours" | "projets" | "dashboard" | "stages" | "parametres" | "chat-ia" | "assistance";

function getCategories(isFr: boolean) {
  return [
    {
      id: "compte" as CategoryId,
      title: isFr ? "Compte" : "Account",
      desc: isFr
        ? "Profil, sécurité et connexion à votre espace Genove."
        : "Profile, security and login to your Genove space.",
      icon: UserCircle2,
    },
    {
      id: "cours" as CategoryId,
      title: isFr ? "Cours" : "Courses",
      desc: isFr
        ? "Inscription, progression et suivi de vos formations."
        : "Enrollment, progress and course tracking.",
      icon: GraduationCap,
    },
    {
      id: "projets" as CategoryId,
      title: isFr ? "Projets" : "Projects",
      desc: isFr
        ? "Suivi de vos projets et collaborations partenaires."
        : "Track your projects and partner collaborations.",
      icon: FolderKanban,
    },
    {
      id: "dashboard" as CategoryId,
      title: isFr ? "Dashboard" : "Dashboard",
      desc: isFr
        ? "Statistiques, badges et suivi de votre activité."
        : "Statistics, badges and activity tracking.",
      icon: LayoutDashboard,
    },
    {
      id: "stages" as CategoryId,
      title: isFr ? "Stages" : "Internships",
      desc: isFr
        ? "Candidatures, offres et suivi de vos stages."
        : "Applications, offers and internship tracking.",
      icon: Briefcase,
    },
    {
      id: "parametres" as CategoryId,
      title: isFr ? "Paramètres" : "Settings",
      desc: isFr
        ? "Préférences, notifications et confidentialité."
        : "Preferences, notifications and privacy.",
      icon: Settings,
    },
    {
      id: "chat-ia" as CategoryId,
      title: isFr ? "Chat IA" : "AI Chat",
      desc: isFr
        ? "Utiliser l'assistant Savoir+ pour apprendre plus vite."
        : "Use the Savoir+ assistant to learn faster.",
      icon: MessageSquareText,
    },
    {
      id: "assistance" as CategoryId,
      title: isFr ? "Assistance technique" : "Technical Support",
      desc: isFr
        ? "Bugs, performances et problèmes techniques."
        : "Bugs, performance and technical issues.",
      icon: LifeBuoy,
    },
  ];
}

interface FaqItem {
  id: string;
  category: CategoryId;
  question: string;
  answer: string;
}

function getFaqs(isFr: boolean): FaqItem[] {
  return [
    {
      id: "profil",
      category: "compte",
      question: isFr ? "Comment modifier mon profil ?" : "How do I edit my profile?",
      answer: isFr
        ? "Rendez-vous dans votre Tableau de bord, puis cliquez sur votre avatar en haut à droite et sélectionnez « Paramètres ». Depuis l'onglet « Profil », vous pouvez modifier votre nom, votre photo, votre biographie et vos informations de contact. N'oubliez pas de cliquer sur « Enregistrer » pour appliquer vos changements — une confirmation s'affiche instantanément."
        : "Go to your Dashboard, then click on your avatar at the top right and select 'Settings'. From the 'Profile' tab, you can edit your name, photo, bio, and contact details. Don't forget to click 'Save' to apply changes.",
    },
    {
      id: "mdp",
      category: "compte",
      question: isFr ? "Comment réinitialiser mon mot de passe ?" : "How do I reset my password?",
      answer: isFr
        ? "Sur la page de connexion, cliquez sur « Mot de passe oublié ? ». Saisissez l'adresse email associée à votre compte : un lien de réinitialisation sécurisé, valable 30 minutes, vous sera envoyé. Si vous êtes déjà connecté, vous pouvez aussi changer votre mot de passe directement depuis Paramètres → Sécurité."
        : "On the login page, click 'Forgot password?'. Enter the email associated with your account: a secure reset link valid for 30 minutes will be sent to you. If logged in, go to Settings → Security.",
    },
    {
      id: "notifications",
      category: "parametres",
      question: isFr ? "Comment gérer mes notifications ?" : "How do I manage my notifications?",
      answer: isFr
        ? "Dans Paramètres → Notifications, vous pouvez activer ou désactiver les alertes par email, les rappels de cours, les notifications de nouveaux projets et les messages de l'assistant IA. Les préférences sont sauvegardées automatiquement et s'appliquent immédiatement sur tous vos appareils."
        : "In Settings → Notifications, you can enable or disable email alerts, course reminders, project notifications, and AI assistant messages. Preferences save automatically across devices.",
    },
    {
      id: "cours-suivi",
      category: "cours",
      question: isFr ? "Comment suivre mes cours ?" : "How do I track my courses?",
      answer: isFr
        ? "Depuis votre Tableau de bord, la section « Mes formations » affiche la progression de chaque cours sous forme de barre de complétion. Cliquez sur une formation pour reprendre exactement où vous vous étiez arrêté : leçons, quiz et ressources sont sauvegardés automatiquement au fil de votre avancée."
        : "From your Dashboard, 'My Courses' shows completion progress. Click any course to resume right where you left off. Lessons, quizzes, and resources save automatically.",
    },
    {
      id: "cours-badges",
      category: "cours",
      question: isFr
        ? "Comment obtenir mes badges et certificats ?"
        : "How do I earn badges and certificates?",
      answer: isFr
        ? "Chaque formation terminée à 100 % débloque un badge visible sur votre Dashboard, dans la section « Réussites ». Les certificats Qualiopi sont générés automatiquement au format PDF et téléchargeables depuis la fiche du cours une fois l'évaluation finale validée."
        : "Each completed course unlocks a badge on your Dashboard. Qualiopi certificates are generated in PDF format upon passing final assessments.",
    },
    {
      id: "projets-consult",
      category: "projets",
      question: isFr ? "Comment consulter mes projets ?" : "How do I view my projects?",
      answer: isFr
        ? "La page « Projets » liste toutes les études de cas et collaborations disponibles. Une fois inscrit à un projet, retrouvez son état d'avancement, les livrables et les échanges avec les partenaires directement depuis votre Dashboard, onglet « Mes projets »."
        : "The 'Projects' page lists all case studies and collaborations. Once enrolled, view progress, deliverables, and partner discussions in your Dashboard under 'My Projects'.",
    },
    {
      id: "projets-contact",
      category: "projets",
      question: isFr ? "Comment contacter un partenaire ?" : "How do I contact a partner?",
      answer: isFr
        ? "Sur la fiche d'un projet, la section « Témoignage partenaire » et le bouton « Nous contacter » vous permettent d'envoyer un message directement à l'équipe projet. Vous pouvez aussi passer par le formulaire de contact de cette page d'aide en précisant le sujet « Projets & partenariats »."
        : "On any project detail page, use the 'Contact us' button to message the project team directly, or fill out the help form with subject 'Projects & Partnerships'.",
    },
    {
      id: "stages-candidature",
      category: "stages",
      question: isFr ? "Comment postuler à un stage ?" : "How do I apply for an internship?",
      answer: isFr
        ? "Depuis l'espace « Stages » de votre Dashboard, parcourez les offres proposées par nos partenaires, filtrez par domaine et durée, puis cliquez sur « Postuler ». Votre profil et vos formations complétées sont automatiquement joints à votre candidature pour la mettre en valeur."
        : "Browse partner internship offers in your Dashboard, filter by field or duration, then click 'Apply'. Your profile and completed courses attach automatically.",
    },
    {
      id: "stages-suivi",
      category: "stages",
      question: isFr
        ? "Comment suivre l'avancement de ma candidature de stage ?"
        : "How do I track my internship application status?",
      answer: isFr
        ? "Chaque candidature affiche un statut en temps réel (Envoyée, En cours d'examen, Entretien, Acceptée ou Refusée) visible dans « Mes candidatures ». Vous recevez également une notification email à chaque changement de statut."
        : "Each application displays a real-time status (Submitted, Under Review, Interview, Accepted, Rejected) in 'My Applications', with email notifications on updates.",
    },
    {
      id: "dashboard-stats",
      category: "dashboard",
      question: isFr
        ? "Comment lire les statistiques de mon Dashboard ?"
        : "How do I read my Dashboard statistics?",
      answer: isFr
        ? "Le Dashboard résume votre activité : nombre de cours actifs, temps d'apprentissage cumulé, badges obtenus et projets en cours. Les graphiques de progression se mettent à jour automatiquement après chaque session de formation."
        : "The Dashboard summarizes active courses, learning time, badges earned, and ongoing projects. Progress charts update automatically after training sessions.",
    },
    {
      id: "chatbot",
      category: "chat-ia",
      question: isFr ? "Comment utiliser le chatbot IA ?" : "How do I use the AI chatbot?",
      answer: isFr
        ? "L'assistant Savoir+, accessible via la bulle de chat en bas à droite ou la page dédiée, répond à vos questions sur vos cours, projets et démarches grâce à un pipeline RAG multi-agents. Posez votre question en langage naturel : les réponses citent leurs sources et vous pouvez épingler ou exporter les conversations utiles."
        : "The Savoir+ AI assistant answers questions about courses, projects, and procedures using a multi-agent RAG pipeline. Ask questions in plain language, pin or export conversations.",
    },
    {
      id: "chatbot-limites",
      category: "chat-ia",
      question: isFr
        ? "L'assistant IA peut-il se tromper ?"
        : "Can the AI assistant make mistakes?",
      answer: isFr
        ? "L'assistant s'appuie sur des sources vérifiées mais peut parfois manquer de contexte récent. Chaque réponse peut être notée (pouce levé/baissé) pour améliorer le modèle, et vous pouvez toujours escalader une question complexe vers notre équipe support humaine via le formulaire de contact."
        : "The assistant uses verified sources but may occasionally miss recent context. You can rate answers or escalate complex queries to our human support team via the contact form.",
    },
    {
      id: "technique-bug",
      category: "assistance",
      question: isFr
        ? "Que faire en cas de bug ou de lenteur ?"
        : "What should I do if I encounter a bug or slowdown?",
      answer: isFr
        ? "Commencez par rafraîchir la page et vider le cache de votre navigateur. Si le problème persiste, décrivez-le dans le formulaire de contact ci-dessous en choisissant le sujet « Assistance technique » : indiquez votre navigateur, votre appareil et les étapes pour reproduire le souci afin d'accélérer la résolution."
        : "Try refreshing the page and clearing your browser cache first. If the issue persists, describe it in the contact form below choosing 'Technical Support'. Include browser and device details.",
    },
    {
      id: "technique-navigateurs",
      category: "assistance",
      question: isFr ? "Quels navigateurs sont recommandés ?" : "Which browsers are recommended?",
      answer: isFr
        ? "Genove fonctionne de façon optimale sur les dernières versions de Chrome, Firefox, Edge et Safari, sur ordinateur comme sur mobile. Nous recommandons de garder votre navigateur à jour pour profiter de toutes les fonctionnalités (chat IA, tableaux de bord interactifs, etc.)."
        : "Genove works best on the latest versions of Chrome, Firefox, Edge, and Safari on desktop and mobile. Keep your browser up to date for optimal experience.",
    },
  ];
}

function getResources(isFr: boolean) {
  return [
    {
      id: "documentation",
      icon: FileText,
      title: isFr ? "Documentation" : "Documentation",
      desc: isFr
        ? "La documentation complète de la plateforme : fonctionnalités, espaces et bonnes pratiques."
        : "Full platform documentation: features, spaces, and best practices.",
      content: isFr
        ? "La documentation Genove couvre la prise en main de votre espace apprenant, formateur ou partenaire : navigation, gestion de profil, inscription aux formations, suivi de projets et utilisation de l'assistant IA Savoir+."
        : "Genove documentation covers getting started for learners, instructors, and partners: navigation, profile management, course enrollment, project tracking, and Savoir+ AI.",
    },
    {
      id: "guides",
      icon: BookOpen,
      title: isFr ? "Guides" : "Guides",
      desc: isFr
        ? "Des guides pas-à-pas pour tirer le meilleur parti de vos formations et projets."
        : "Step-by-step guides to get the most out of your courses and projects.",
      content: isFr
        ? "Nos guides détaillés vous accompagnent étape par étape : comment construire un parcours d'apprentissage personnalisé, comment candidater efficacement à un stage, ou comment collaborer avec un partenaire sur un projet concret."
        : "Detailed step-by-step guides: building personalized learning paths, applying effectively for internships, and collaborating on real-world partner projects.",
    },
    {
      id: "tutoriels",
      icon: PlayCircle,
      title: isFr ? "Tutoriels" : "Tutorials",
      desc: isFr
        ? "Des tutoriels interactifs pour découvrir chaque outil de la plateforme."
        : "Interactive tutorials to explore every platform feature.",
      content: isFr
        ? "Les tutoriels interactifs vous guident directement dans l'interface : création de votre profil, première conversation avec l'assistant IA, dépôt d'un livrable de projet et bien plus."
        : "Interactive tutorials guide you directly in the UI: profile setup, first AI assistant prompt, project submission, and contextual tooltips.",
    },
    {
      id: "videos",
      icon: Video,
      title: isFr ? "Vidéos" : "Videos",
      desc: isFr
        ? "Des vidéos de présentation courtes sur les fonctionnalités clés de Genove."
        : "Short walkthrough videos highlighting Genove's key capabilities.",
      content: isFr
        ? "Notre bibliothèque vidéo présente en quelques minutes les fonctionnalités essentielles : navigation dans le catalogue, suivi du Dashboard, utilisation du chat IA multi-agents et gestion de vos candidatures de stage."
        : "Short video tutorials on essential features: course catalogue navigation, Dashboard tracking, multi-agent AI chat, and internship management.",
    },
    {
      id: "centre-aide",
      icon: HelpCircle,
      title: isFr ? "Centre d'aide" : "Help Center",
      desc: isFr
        ? "Toutes nos ressources d'assistance réunies au même endroit — vous y êtes déjà !"
        : "All support resources gathered in one place — you are here!",
      content: isFr
        ? "Vous êtes actuellement sur le centre d'aide Genove : catégories, FAQ, contact et ressources sont réunis sur cette page pour répondre à toutes vos questions rapidement."
        : "You are currently on the Genove Help Center: categories, FAQs, contact form, and resources are available here to assist you quickly.",
    },
  ];
}

function getContactSubjects(isFr: boolean) {
  return [
    { value: "compte", label: isFr ? "Compte & sécurité" : "Account & Security" },
    { value: "cours", label: isFr ? "Cours & formations" : "Courses & Training" },
    { value: "projets", label: isFr ? "Projets & partenariats" : "Projects & Partnerships" },
    { value: "stages", label: isFr ? "Stages" : "Internships" },
    { value: "technique", label: isFr ? "Assistance technique" : "Technical Support" },
    { value: "autre", label: isFr ? "Autre demande" : "Other Inquiry" },
  ];
}

/* --------------------------------------------------------------------- */
/*                              Page component                            */
/* --------------------------------------------------------------------- */

function AidePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const isFr = language === "fr";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/connexion", search: { mode: "login", redirect: "/aide" } });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  const categories = useMemo(() => getCategories(isFr), [isFr]);
  const faqs = useMemo(() => getFaqs(isFr), [isFr]);
  const resources = useMemo(() => getResources(isFr), [isFr]);

  const [openResource, setOpenResource] = useState<(typeof resources)[number] | null>(null);

  const faqSectionRef = useRef<HTMLDivElement | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return categories;
    return categories.filter(
      (c) =>
        c.title.toLowerCase().includes(normalizedSearch) ||
        c.desc.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch, categories]);

  const filteredFaqs = useMemo(() => {
    let list = faqs;
    if (activeCategory) list = list.filter((f) => f.category === activeCategory);
    if (normalizedSearch) {
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(normalizedSearch) ||
          f.answer.toLowerCase().includes(normalizedSearch),
      );
    }
    return list;
  }, [activeCategory, normalizedSearch, faqs]);

  const filteredResources = useMemo(() => {
    if (!normalizedSearch) return resources;
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(normalizedSearch) ||
        r.desc.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch, resources]);

  const handleCategoryClick = (id: CategoryId) => {
    setActiveCategory((prev) => (prev === id ? null : id));
    requestAnimationFrame(() => {
      faqSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F3EEFE] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden -mt-16 min-h-[calc(100vh+4rem)] flex flex-col justify-center items-center pt-20 pb-16 text-white bg-[#160B2C] transition-colors duration-300">
        {/* Radial Ambient Glows matching screenshot */}
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_10%_30%,#3B1578_0%,transparent_50%),radial-gradient(circle_at_90%_60%,rgba(180,83,9,0.35)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center w-full my-auto">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <LifeBuoy className="h-3.5 w-3.5 text-amber-400" />
            <span>{isFr ? "CENTRE D'AIDE GENOVE" : "GENOVE HELP CENTER"}</span>
          </div>

          <h1 className="animate-in fade-in slide-in-from-bottom-3 duration-700 font-heading text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            {isFr ? (
              <>
                Comment pouvons-nous{" "}
                <span className="text-amber-400 font-extrabold">vous aider</span> ?
              </>
            ) : (
              <>
                How can we <span className="text-amber-400 font-extrabold">help you</span>?
              </>
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm sm:text-base md:text-lg text-slate-300/90 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 font-medium">
            {isFr
              ? "Trouvez des réponses instantanées sur votre compte, vos cours, vos projets, vos stages et l'assistant IA Savoir+ — ou échangez directement avec notre équipe."
              : "Find instant answers about your account, courses, projects, internships, and the Savoir+ AI assistant — or talk directly with our team."}
          </p>

          {/* Category Icons Row */}
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 sm:gap-4 animate-in fade-in zoom-in-95 duration-700 delay-150">
            {[GraduationCap, MessageSquareText, Award, Bell].map((Icon, i) => (
              <div
                key={i}
                className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-amber-400/50 hover:bg-white/10 cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="relative text-left">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70 z-10" />
              <label htmlFor="aide-search" className="sr-only">
                {isFr
                  ? "Rechercher une question, une catégorie..."
                  : "Search a question, category..."}
              </label>
              <input
                id="aide-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isFr
                    ? "Rechercher une question, une catégorie, une ressource..."
                    : "Search a question, category, resource..."
                }
                className="h-13 w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pl-12 pr-10 text-left text-sm text-white placeholder:text-white/50 shadow-xl backdrop-blur-md transition-all focus:border-amber-400/80 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label={isFr ? "Effacer la recherche" : "Clear search"}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {normalizedSearch && (
              <p className="mt-3 text-xs text-white/60">
                {filteredCategories.length + filteredFaqs.length + filteredResources.length}{" "}
                {isFr ? "résultat(s) pour" : "result(s) for"} « {search} »
              </p>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Categories */}
      <section ref={categoriesRef} className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {isFr ? "Explorez par catégorie" : "Explore by category"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isFr
              ? "Cliquez sur une catégorie pour filtrer les questions fréquentes correspondantes."
              : "Click a category to filter corresponding FAQs."}
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            {isFr
              ? "Aucune catégorie ne correspond à votre recherche."
              : "No category matches your search."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCategories.map((cat, i) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] cursor-pointer animate-in fade-in slide-in-from-bottom-2 min-h-[44px] ${
                    active
                      ? "border-accent bg-accent/10 shadow-[var(--shadow-gold)]"
                      : "border-border bg-card hover:border-accent/50"
                  }`}
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
                  aria-pressed={active}
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl transition-colors ${
                      active
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-accent group-hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{cat.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{cat.desc}</p>
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    {isFr ? "Voir les questions" : "View questions"}{" "}
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section
        ref={faqSectionRef}
        className="border-y border-border/80 bg-gradient-to-b from-blue-50/40 via-background to-amber-50/20 py-16 dark:from-slate-950 dark:via-background dark:to-slate-950 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {isFr ? "Questions fréquentes" : "Frequently Asked Questions"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {activeCategory
                  ? `${isFr ? "Filtré par :" : "Filtered by:"} ${categories.find((c) => c.id === activeCategory)?.title}`
                  : isFr
                    ? "Les réponses aux questions les plus posées par notre communauté."
                    : "Answers to the most common questions from our community."}
              </p>
            </div>
            {activeCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCategory(null)}
                className="cursor-pointer"
              >
                {isFr ? "Réinitialiser le filtre" : "Reset filter"}
              </Button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              {isFr
                ? "Aucune question ne correspond à votre recherche ou à ce filtre."
                : "No question matches your search or filter."}
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              className="rounded-2xl border border-border bg-card px-2 shadow-sm sm:px-4"
            >
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-foreground sm:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------------- Contact */}
      <ContactSection />

      {/* --------------------------------------------------------- Ressources */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {isFr ? "Ressources utiles" : "Useful Resources"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isFr
              ? "Documentation, guides et supports pour aller plus loin."
              : "Documentation, guides and support materials."}
          </p>
        </div>

        {filteredResources.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            {isFr
              ? "Aucune ressource ne correspond à votre recherche."
              : "No resource matches your search."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {filteredResources.map((res, i) => {
              const Icon = res.icon;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setOpenResource(res)}
                  className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[var(--shadow-md)] cursor-pointer animate-in fade-in slide-in-from-bottom-2 min-h-[44px]"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-foreground">{res.title}</h3>
                  <p className="text-xs text-muted-foreground">{res.desc}</p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <Dialog open={!!openResource} onOpenChange={(v) => !v && setOpenResource(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {openResource && <openResource.icon className="h-5 w-5 text-accent" />}
              {openResource?.title}
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed text-foreground/80">
              {openResource?.content}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------------- Chat IA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-[#0d1839] via-[#162756] to-[#0d1839] p-8 text-white shadow-[var(--shadow-lg)] sm:p-12">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_30%,rgba(212,168,58,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,140,255,0.25),transparent_45%)]" />
          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-[var(--shadow-gold)]">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold sm:text-2xl">
                  {isFr ? "Besoin d'une réponse immédiate ?" : "Need an immediate answer?"}
                </h3>
                <p className="mt-1 max-w-md text-sm text-white/70">
                  {isFr
                    ? "Notre assistant IA Savoir+ répond instantanément à vos questions, avec des sources vérifiées."
                    : "Our Savoir+ AI assistant answers your questions instantly with verified sources."}
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate({ to: "/savoir" })}
              className="h-12 shrink-0 rounded-xl bg-accent px-6 text-sm font-bold text-accent-foreground shadow-[var(--shadow-gold)] hover:bg-accent-hover cursor-pointer"
            >
              {isFr ? "Parler avec l'assistant IA" : "Chat with AI assistant"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* --------------------------------------------------------------------- */
/*                              Contact section                          */
/* --------------------------------------------------------------------- */

function ContactSection() {
  const { language } = useLanguage();
  const isFr = language === "fr";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subjects = useMemo(() => getContactSubjects(isFr), [isFr]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = isFr ? "Votre nom est requis." : "Your name is required.";
    if (!email.trim()) next.email = isFr ? "Votre email est requis." : "Your email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = isFr ? "Adresse email invalide." : "Invalid email address.";
    if (!subject) next.subject = isFr ? "Merci de choisir un sujet." : "Please select a subject.";
    if (!message.trim() || message.trim().length < 10)
      next.message = isFr
        ? "Votre message doit contenir au moins 10 caractères."
        : "Your message must contain at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    toast.success(isFr ? "Message envoyé avec succès !" : "Message sent successfully!", {
      description: isFr
        ? "Notre équipe support vous répondra sous 24 à 48h ouvrées."
        : "Our support team will reply within 24–48 business hours.",
    });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="mb-10 text-center flex flex-col items-center">
        <GenoveLogoCard
          isCircle
          logoHeight={36}
          className="w-16 h-16 sm:w-20 sm:h-20 shadow-2xl border-purple-400/50 mb-3"
        />
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {isFr ? "Contactez notre équipe" : "Contact our team"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isFr
            ? "Une question spécifique ? Écrivez-nous, nous vous répondons rapidement."
            : "Have a specific question? Write to us, we'll respond quickly."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <InfoCard
              icon={Mail}
              title={isFr ? "Email" : "Email"}
              value="support@genove.io"
              note={isFr ? "Réponse sous 24 à 48h" : "Reply within 24–48h"}
            />
            <InfoCard
              icon={Phone}
              title={isFr ? "Téléphone" : "Phone"}
              value="+216 71 000 000"
              note={isFr ? "Lun–Ven, 9h–18h" : "Mon–Fri, 9am–6pm"}
            />
            <InfoCard
              icon={Clock}
              title={isFr ? "Horaires support" : "Support Hours"}
              value="9h – 18h (GMT+1)"
              note={isFr ? "Du lundi au vendredi" : "Monday to Friday"}
            />
          </div>
          <GenoveLogoCard logoOnly logoHeight={68} />
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-name">{isFr ? "Nom complet" : "Full name"}</Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isFr ? "Votre nom" : "Your name"}
                className="mt-1.5"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="contact-email">{isFr ? "Adresse email" : "Email address"}</Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isFr ? "vous@exemple.com" : "you@example.com"}
                className="mt-1.5"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-5">
            <Label htmlFor="contact-subject">{isFr ? "Sujet" : "Subject"}</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger
                id="contact-subject"
                className="mt-1.5"
                aria-invalid={!!errors.subject}
              >
                <SelectValue placeholder={isFr ? "Choisissez un sujet" : "Select a subject"} />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
          </div>

          <div className="mt-5">
            <Label htmlFor="contact-message">{isFr ? "Message" : "Message"}</Label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isFr ? "Décrivez votre demande en détail..." : "Describe your request in detail..."
              }
              rows={5}
              className="mt-1.5 resize-none"
              aria-invalid={!!errors.message}
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>

          <Button
            type="submit"
            className="mt-6 h-11 w-full rounded-xl bg-accent text-sm font-bold text-accent-foreground shadow-[var(--shadow-gold)] hover:bg-accent-hover cursor-pointer sm:w-auto sm:px-8"
          >
            <Send className="mr-2 h-4 w-4" />
            {isFr ? "Envoyer le message" : "Send message"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  note,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-sm font-medium text-foreground/90">{value}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {note}
        </p>
      </div>
    </div>
  );
}
