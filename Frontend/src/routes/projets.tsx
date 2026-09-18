import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Cloud,
  Code2,
  Compass,
  Copy,
  Cpu,
  Database,
  Download,
  Eye,
  FileText,
  FolderKanban,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Layers,
  LineChart,
  Mail,
  MapPin,
  MessageSquareQuote,
  MousePointerClick,
  Phone,
  Quote,
  RefreshCw,
  Rocket,
  Search,
  SearchX,
  Send,
  Server,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Users,
  Video,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { Footer } from "@/components/genove/Footer";
import { GenoveLogo, GenoveLogoCard } from "@/components/genove/GenoveLogo";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import partnerProjectsImg from "@/assets/images/partner_projects_collaboration_1784165082137.jpg";
import genoveFrHeroBg from "@/assets/images/genove_fr_hero_girl_first_hud_right_1785972984597.jpg";
import genoveEnHeroBg from "@/assets/images/genove_en_hero_girl_first_hud_right_1785972734876.jpg";

export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title: "Nos réalisations — Genove" },
      {
        name: "description",
        content:
          "Découvrez les projets réalisés par Genove avec ses partenaires : IA, plateformes web, e-learning, data, cloud et automatisation.",
      },
      { property: "og:title", content: "Nos réalisations — Genove" },
      {
        property: "og:description",
        content:
          "Vitrine des projets et études de cas menés par Genove avec ses partenaires — expertise IA, data, web et cloud.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Projets,
});

function useCounter(target: number, active: boolean, duration = 1500, decimals = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Number((target * eased).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, decimals]);
  return n;
}

function AnimatedStatNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.2,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const n = useCounter(value, seen, 1500, decimals);
  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------------- Data --- */

type Domain =
  | "Intelligence Artificielle"
  | "Data & BI"
  | "Développement Web"
  | "Développement Mobile"
  | "E-learning"
  | "Cloud"
  | "DevOps"
  | "Automatisation";

interface Realisation {
  slug: string;
  name: string;
  partner: string;
  domain: Domain;
  date: string;
  summary: string;
  image: string;
  tech: string[];
  context: string;
  objectives: string[];
  solution: string;
  features: string[];
  architecture: string;
  screenshots: { src: string; caption: string }[];
  results: string[];
  benefits: string[];
}

const REALISATIONS: Realisation[] = [
  {
    slug: "assistant-ia-parcours-patient",
    name: "Assistant IA parcours patient",
    partner: "AP-HP",
    domain: "Intelligence Artificielle",
    date: "Mars 2025",
    summary:
      "Agent conversationnel multimodal pour pré-qualifier les demandes et orienter les patients aux urgences non-vitales.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    tech: ["Python", "LangChain", "RAG", "React", "FastAPI", "PostgreSQL"],
    context:
      "Face à l'engorgement des urgences non-vitales, l'AP-HP cherchait un moyen d'améliorer l'accueil, la pré-qualification et l'orientation des patients tout en libérant du temps aux équipes soignantes.",
    objectives: [
      "Réduire le temps d'attente perçu à l'accueil",
      "Automatiser l'orientation vers le bon parcours de soin",
      "Garantir la conformité HDS et la confidentialité des données",
      "Fournir un canal accessible (mobile, tablette, borne)",
    ],
    solution:
      "Nous avons conçu un assistant conversationnel basé sur un pipeline RAG sécurisé, connecté à la base documentaire interne, avec un moteur d'orientation clinique validé par les équipes médicales et une interface mobile-first accessible RGAA.",
    features: [
      "Chat multimodal (texte, voix, images)",
      "Pré-qualification clinique guidée",
      "Recherche documentaire sécurisée (RAG)",
      "Tableau de bord d'analytique pour les soignants",
      "Mode borne d'accueil et mode mobile patient",
    ],
    architecture:
      "Frontend React + Vite, API FastAPI, orchestrateur LangChain, vector store pgvector, LLM hébergé en environnement HDS, observabilité OpenTelemetry.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=1200&q=80",
        caption: "Écran de pré-qualification patient",
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Tableau de bord des orientations",
      },
    ],
    results: [
      "-38 % de temps d'attente sur le pilote",
      "92 % de satisfaction patient",
      "Plus de 12 000 conversations traitées en 3 mois",
    ],
    benefits: [
      "Libération de temps médical pour les cas prioritaires",
      "Traçabilité et auditabilité complètes des échanges",
      "Socle réutilisable pour d'autres services de l'AP-HP",
    ],
  },
  {
    slug: "dashboard-risques-credit",
    name: "Dashboard risques crédit IA",
    partner: "BNP Paribas",
    domain: "Data & BI",
    date: "Janvier 2025",
    summary:
      "Plateforme décisionnelle prédisant les risques de défaut et expliquant chaque décision aux chargés d'affaires.",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    tech: ["Python", "Scikit-learn", "SHAP", "React", "Recharts", "FastAPI"],
    context:
      "Les chargés d'affaires avaient besoin d'un outil unifié pour évaluer rapidement les dossiers de crédit et disposer d'explications claires sur les décisions du modèle.",
    objectives: [
      "Prédire les défauts avec un modèle auditable",
      "Fournir des explications lisibles par métier",
      "Respecter les contraintes RGPD et de conformité",
      "Industrialiser le déploiement du modèle",
    ],
    solution:
      "Un pipeline MLOps complet a été mis en place, avec un modèle de scoring supervisé, une couche d'explicabilité SHAP, et un dashboard React connecté en temps réel à l'API.",
    features: [
      "Scoring de crédit temps réel",
      "Explications SHAP par variable",
      "Simulateur what-if",
      "Alerting sur dérive du modèle",
    ],
    architecture:
      "Ingestion Airflow, entraînement Scikit-learn, API FastAPI, front React + Recharts, monitoring Grafana + Prometheus.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Vue synthétique du portefeuille",
      },
    ],
    results: [
      "AUC 0.91 sur le périmètre pilote",
      "Temps d'analyse d'un dossier divisé par 3",
      "Adoption par 4 agences en 6 semaines",
    ],
    benefits: [
      "Décisions plus rapides et mieux argumentées",
      "Réduction du risque de contentieux",
      "Base solide pour d'autres cas d'usage scoring",
    ],
  },
  {
    slug: "plateforme-exercices-adaptatifs",
    name: "Plateforme d'exercices adaptatifs",
    partner: "Sorbonne Université",
    domain: "E-learning",
    date: "Novembre 2024",
    summary:
      "Plateforme e-learning qui adapte en temps réel les exercices d'algorithmique au niveau de chaque apprenant.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    tech: ["React", "Node.js", "TypeScript", "Docker", "PostgreSQL", "LLM"],
    context:
      "Le département informatique souhaitait individualiser l'apprentissage sur de grandes promotions sans multiplier la charge des enseignants.",
    objectives: [
      "Adapter la difficulté au niveau réel de l'étudiant",
      "Générer des corrections personnalisées",
      "Fournir un suivi pédagogique aux enseignants",
      "Assurer un environnement d'exécution sécurisé",
    ],
    solution:
      "Une plateforme web avec moteur adaptatif, générateur d'exercices via LLM et bac à sable Docker pour exécuter le code des étudiants en toute sécurité.",
    features: [
      "Graphe de compétences par étudiant",
      "Génération dynamique d'exercices",
      "Correction commentée par IA",
      "Console d'exécution sécurisée",
      "Tableau de bord enseignant",
    ],
    architecture:
      "Frontend React, API Node.js, sandbox Docker éphémère, base PostgreSQL, orchestration via API LLM privée.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&w=1200&q=80",
        caption: "Vue étudiant — exercice adaptatif",
      },
    ],
    results: [
      "+27 % de réussite aux évaluations finales",
      "200 étudiants sur le pilote",
      "Note moyenne 4,6/5 côté apprenants",
    ],
    benefits: [
      "Individualisation à grande échelle",
      "Gain de temps pour les enseignants",
      "Socle réutilisable pour d'autres UE",
    ],
  },
  {
    slug: "maintenance-predictive-usines",
    name: "Maintenance prédictive usines",
    partner: "TotalEnergies",
    domain: "Data & BI",
    date: "Septembre 2024",
    summary:
      "Pipeline IoT + ML pour anticiper les défaillances des équipements industriels critiques.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    tech: ["Python", "Kafka", "Spark", "MLflow", "Grafana", "Kubernetes"],
    context:
      "Les arrêts non planifiés généraient des pertes significatives. L'objectif était d'anticiper les pannes à partir des données capteurs.",
    objectives: [
      "Collecter et centraliser les données capteurs",
      "Détecter les signaux faibles de défaillance",
      "Prioriser les interventions de maintenance",
      "Industrialiser le déploiement des modèles",
    ],
    solution:
      "Une plateforme MLOps complète : ingestion temps réel Kafka, feature store, entraînement Spark, déploiement Kubernetes, monitoring Grafana.",
    features: [
      "Ingestion capteurs temps réel",
      "Détection d'anomalies multi-variées",
      "Score de criticité par équipement",
      "Alertes push pour les équipes terrain",
    ],
    architecture:
      "Kafka → Spark Streaming → Feature Store → Modèle ML servi via KServe sur Kubernetes, monitoring Prometheus + Grafana.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        caption: "Dashboard supervision usine",
      },
    ],
    results: [
      "-22 % d'arrêts non planifiés",
      "ROI atteint en 8 mois",
      "3 sites industriels équipés",
    ],
    benefits: [
      "Meilleure disponibilité des équipements",
      "Maintenance ciblée et moins coûteuse",
      "Culture data renforcée dans les équipes",
    ],
  },
  {
    slug: "guide-musee-personnalise",
    name: "Guide musée personnalisé",
    partner: "Musée du Louvre",
    domain: "Développement Mobile",
    date: "Juin 2024",
    summary:
      "Application mobile qui construit un parcours de visite sur mesure selon les goûts et le temps disponible.",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    tech: ["React Native", "Expo", "Node.js", "LLM", "GraphQL"],
    context:
      "Le musée souhaitait proposer une expérience personnalisée aux visiteurs, au-delà de l'audioguide classique.",
    objectives: [
      "Créer des parcours adaptés au profil du visiteur",
      "Enrichir chaque œuvre de contenus multimédias",
      "Fonctionner en mode hors-ligne partiel",
      "Mesurer l'engagement des visiteurs",
    ],
    solution:
      "Une application React Native avec moteur de recommandation, contenus multilingues, mode hors-ligne et backend GraphQL.",
    features: [
      "Parcours personnalisés selon le temps disponible",
      "Fiches œuvres enrichies (audio, vidéo, 3D)",
      "Recommandations en temps réel",
      "Mode hors-ligne partiel",
    ],
    architecture:
      "React Native + Expo, API GraphQL Node.js, CDN images, LLM pour la génération de commentaires personnalisés.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1565060169861-2d4b02cef8a5?auto=format&fit=crop&w=1200&q=80",
        caption: "Écran de parcours personnalisé",
      },
    ],
    results: [
      "45 000 téléchargements sur le pilote",
      "Durée de visite +18 %",
      "Note App Store 4,7/5",
    ],
    benefits: [
      "Expérience visiteur premium et différenciante",
      "Données précieuses sur les parcours réels",
      "Base pour d'autres institutions culturelles",
    ],
  },
  {
    slug: "kyc-automatise-multi-agents",
    name: "KYC automatisé multi-agents",
    partner: "Société Générale",
    domain: "Automatisation",
    date: "Avril 2024",
    summary: "Système multi-agents IA pour automatiser la vérification KYC de bout en bout.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    tech: ["Python", "LangGraph", "OCR", "FastAPI", "PostgreSQL", "Azure"],
    context:
      "Le processus KYC mobilisait beaucoup d'opérateurs pour des tâches répétitives (extraction, vérification, contrôle).",
    objectives: [
      "Automatiser l'extraction des documents",
      "Croiser les données avec des sources tierces",
      "Alerter sur les cas à risque",
      "Garder l'humain dans la boucle sur les cas complexes",
    ],
    solution:
      "Une orchestration multi-agents LangGraph avec OCR, vérification d'identité, contrôle de cohérence et interface de revue humaine.",
    features: [
      "OCR de documents d'identité",
      "Vérification biométrique",
      "Contrôle automatisé de sanctions",
      "Console de revue humaine",
    ],
    architecture:
      "Agents Python orchestrés via LangGraph, API FastAPI, stockage documents chiffré, déploiement Azure.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
        caption: "Console de revue KYC",
      },
    ],
    results: ["Temps de traitement /5", "98 % de précision d'extraction", "Déploiement sur 3 pays"],
    benefits: [
      "Coûts opérationnels drastiquement réduits",
      "Conformité renforcée",
      "Meilleure expérience client à l'onboarding",
    ],
  },
];

interface ExpertiseDomain {
  name: Domain | string;
  icon: typeof Sparkles;
  desc: string;
  tags: string[];
}

const DOMAINS: ExpertiseDomain[] = [
  {
    name: "Intelligence Artificielle",
    icon: Sparkles,
    desc: "LLM, RAG, agents autonomes, vision par ordinateur & traitement du langage naturel (NLP).",
    tags: ["LLM & RAG", "Agents IA", "Vision", "NLP"],
  },
  {
    name: "Data & BI",
    icon: LineChart,
    desc: "Ingénierie de données, pipelines temps réel, dashboards décisionnels & gouvernance.",
    tags: ["Pipelines ETL", "Dashboards", "Snowflake", "PowerBI"],
  },
  {
    name: "Développement Web",
    icon: Code2,
    desc: "Applications SaaS haute performance, portails métier complexes & architectures modernes.",
    tags: ["React / Next", "Node / Python", "SaaS", "APIs REST"],
  },
  {
    name: "Développement Mobile",
    icon: Smartphone,
    desc: "Applications mobiles natives et cross-platform à forte valeur ajoutée UX/UI.",
    tags: ["iOS & Android", "React Native", "Flutter", "Offline-first"],
  },
  {
    name: "E-learning",
    icon: GraduationCap,
    desc: "Plateformes éducatives sur-mesure, parcours adaptatifs et contenus d'apprentissage immersifs.",
    tags: ["LMS sur-mesure", "Gamification", "SCORM", "Analytics"],
  },
  {
    name: "Cloud",
    icon: Cloud,
    desc: "Infrastructures cloud scalables, architectures Serverless & migration multi-cloud sécurisée.",
    tags: ["AWS", "Azure", "GCP", "Kubernetes"],
  },
  {
    name: "DevOps",
    icon: Server,
    desc: "Automation CI/CD, Infrastructure as Code, observabilité applicative & pratique SRE.",
    tags: ["Docker & K8s", "Terraform", "CI/CD", "Observabilité"],
  },
  {
    name: "Automatisation",
    icon: Workflow,
    desc: "Robotic Process Automation (RPA), orchestration de workflows & intégrations d'APIs métier.",
    tags: ["RPA", "Agents IA", "Workflows", "APIs"],
  },
];

interface MethodStep {
  number: string;
  title: string;
  subtitle: string;
  desc: string;
  deliverable: string;
  icon: typeof Sparkles;
}

const METHOD_STEPS: MethodStep[] = [
  {
    number: "01",
    title: "Analyse du besoin",
    subtitle: "Phase d'immersion",
    desc: "Écoute active, étude des enjeux métier, audit technique de l'existant et cadrage stratégique.",
    deliverable: "Cadrage métier & Objectifs",
    icon: Compass,
  },
  {
    number: "02",
    title: "Cadrage & Spécifications",
    subtitle: "Conception UX/UI",
    desc: "Ateliers collaboratifs, création des maquettes, rédaction des User Stories et jalons de livraison.",
    deliverable: "User Stories & Wireframes",
    icon: FileText,
  },
  {
    number: "03",
    title: "Architecture & Stack",
    subtitle: "Design technique",
    desc: "Choix des technologies, modélisation de la base de données, chiffrage détaillé et planning.",
    deliverable: "Dossier d'Architecture",
    icon: Layers,
  },
  {
    number: "04",
    title: "Développement Agile",
    subtitle: "Sprints itératifs",
    desc: "Sprints de 2 semaines, intégration continue, revues de code systématiques & démos régulières.",
    deliverable: "Sprints & Démos livrables",
    icon: Code2,
  },
  {
    number: "05",
    title: "Tests & Recette",
    subtitle: "Assurance Qualité",
    desc: "Tests automatisés E2E, audits de sécurité OWASP, recette utilisateur et stress-tests.",
    deliverable: "PV de Recette & Sécurité",
    icon: ShieldCheck,
  },
  {
    number: "06",
    title: "Déploiement",
    subtitle: "Mise en Production",
    desc: "Déploiement automatisé CI/CD, bascule sans interruption de service (Zero Downtime) & monitoring.",
    deliverable: "Delivery Cloud & Monitoring",
    icon: Rocket,
  },
  {
    number: "07",
    title: "Accompagnement",
    subtitle: "Support & Évolution",
    desc: "Formation des utilisateurs, transfert de compétences, support réactif SLA et maintenance.",
    deliverable: "Support SLA & Maintien",
    icon: RefreshCw,
  },
];

interface PartnerItem {
  id: string;
  name: string;
  category:
    "Finance & Banque" | "Santé & Éducation" | "Énergie & Industrie" | "Culture, Retail & Tech";
  description: string;
  tag: string;
  brandColor: string;
  logo: React.ReactNode;
}

const PARTNER_ITEMS: PartnerItem[] = [
  {
    id: "aphp",
    name: "AP-HP",
    category: "Santé & Éducation",
    description: "Assistance Publique — Hôpitaux de Paris",
    tag: "SANTÉ & IA",
    brandColor: "#00338D",
    logo: (
      <svg
        className="h-10 w-auto"
        viewBox="0 0 170 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="5" width="32" height="32" rx="8" fill="#002B66" />
        <path d="M18 11V29M10 20H26" stroke="#ED1C24" strokeWidth="4" strokeLinecap="round" />
        <text
          x="42"
          y="25"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="20"
          fill="currentColor"
          letterSpacing="-0.5"
        >
          AP-HP
        </text>
        <text
          x="42"
          y="35"
          fontFamily="System-ui, sans-serif"
          fontWeight="700"
          fontSize="7"
          fill="#00338D"
          letterSpacing="0.8"
        >
          ASSISTANCE PUBLIQUE - HÔPITAUX DE PARIS
        </text>
      </svg>
    ),
  },
  {
    id: "bnp",
    name: "BNP Paribas",
    category: "Finance & Banque",
    description: "Banque & Services Financiers Européens",
    tag: "BANQUE & FINANCE",
    brandColor: "#00915A",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 185 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="5" width="32" height="32" rx="7" fill="#00915A" />
        <path
          d="M8 27C13 18 19 12 28 8M12 29C16 21 22 16 28 13M17 31C20 25 24 20 29 18"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <text
          x="42"
          y="22"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="14"
          fill="currentColor"
          letterSpacing="0.2"
        >
          BNP PARIBAS
        </text>
        <text
          x="42"
          y="33"
          fontFamily="System-ui, sans-serif"
          fontWeight="700"
          fontSize="7.5"
          fill="#00915A"
          letterSpacing="0.8"
        >
          LA BANQUE D'UN MONDE QUI CHANGE
        </text>
      </svg>
    ),
  },
  {
    id: "sorbonne",
    name: "Sorbonne Université",
    category: "Santé & Éducation",
    description: "Enseignement Supérieur & Recherche de Rang Mondial",
    tag: "RECHERCHE & ÉDUCATION",
    brandColor: "#D4A83A",
    logo: (
      <svg
        className="h-10 w-auto"
        viewBox="0 0 195 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="21" r="16" fill="#0C2340" />
        <path
          d="M12 25L20 12L28 25M15 21H25"
          stroke="#D4A83A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="44"
          y="21"
          fontFamily="Georgia, serif"
          fontWeight="800"
          fontSize="14"
          fill="currentColor"
          letterSpacing="0.5"
        >
          SORBONNE
        </text>
        <text
          x="44"
          y="32"
          fontFamily="System-ui, sans-serif"
          fontWeight="700"
          fontSize="9"
          fill="#D4A83A"
          letterSpacing="1.5"
        >
          UNIVERSITÉ
        </text>
      </svg>
    ),
  },
  {
    id: "totalenergies",
    name: "TotalEnergies",
    category: "Énergie & Industrie",
    description: "Compagnie Multi-énergies & Transition Énergétique",
    tag: "ÉNERGIE",
    brandColor: "#FF3333",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 175 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(4, 6)">
          <circle
            cx="15"
            cy="15"
            r="13"
            stroke="url(#te_grad_p_v2)"
            strokeWidth="4.5"
            fill="none"
          />
          <path d="M10 15H20M15 10V20" stroke="#ED1C24" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <defs>
          <linearGradient
            id="te_grad_p_v2"
            x1="0"
            y1="0"
            x2="30"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ED1C24" />
            <stop offset="25%" stopColor="#FF9900" />
            <stop offset="50%" stopColor="#33CC33" />
            <stop offset="75%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#9900CC" />
          </linearGradient>
        </defs>
        <text
          x="42"
          y="26"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="17"
          fill="currentColor"
        >
          TotalEnergies
        </text>
      </svg>
    ),
  },
  {
    id: "louvre",
    name: "Musée du Louvre",
    category: "Culture, Retail & Tech",
    description: "Musée National & Institution Culturelle Mondiale",
    tag: "PATRIMOINE & CULTURE",
    brandColor: "#D4A83A",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 175 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="18,6 33,34 3,34" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="18" y1="6" x2="18" y2="34" stroke="currentColor" strokeWidth="1.5" />
        <line x1="11" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="42"
          y="23"
          fontFamily="Times New Roman, serif"
          fontWeight="800"
          fontSize="17"
          fill="currentColor"
          letterSpacing="2"
        >
          LOUVRE
        </text>
        <text
          x="42"
          y="34"
          fontFamily="System-ui, sans-serif"
          fontWeight="700"
          fontSize="8"
          fill="#D4A83A"
          letterSpacing="1.2"
        >
          MUSÉE DU LOUVRE
        </text>
      </svg>
    ),
  },
  {
    id: "socgen",
    name: "Société Générale",
    category: "Finance & Banque",
    description: "Groupe Bancaire & Services Financiers Internationaux",
    tag: "FINANCE",
    brandColor: "#E2001A",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 185 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(2, 6)">
          <rect x="0" y="0" width="30" height="14" fill="#E2001A" />
          <rect x="0" y="15" width="30" height="14" fill="#111827" />
          <rect x="0" y="13.5" width="30" height="2" fill="#FFFFFF" />
        </g>
        <text
          x="40"
          y="20"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="13.5"
          fill="currentColor"
          letterSpacing="0.5"
        >
          SOCIETE
        </text>
        <text
          x="40"
          y="32"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="13.5"
          fill="#E2001A"
          letterSpacing="0.5"
        >
          GENERALE
        </text>
      </svg>
    ),
  },
  {
    id: "orange",
    name: "Orange",
    category: "Culture, Retail & Tech",
    description: "Opérateur Télécom & Leader du Numérique",
    tag: "TÉLÉCOM & CLOUD",
    brandColor: "#FF6600",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 145 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="6" width="30" height="30" rx="5" fill="#FF6600" />
        <text
          x="40"
          y="29"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="22"
          fill="currentColor"
          letterSpacing="-0.5"
        >
          orange
        </text>
      </svg>
    ),
  },
  {
    id: "renault",
    name: "Renault",
    category: "Énergie & Industrie",
    description: "Constructeur Automobile & Mobilité du Futur",
    tag: "INDUSTRIE 4.0",
    brandColor: "#E2B000",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 145 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="16,4 28,21 16,38 4,21" fill="none" stroke="currentColor" strokeWidth="3" />
        <polygon
          points="16,11 22,21 16,31 10,21"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="36"
          y="27"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="18"
          fill="currentColor"
          letterSpacing="1.5"
        >
          RENAULT
        </text>
      </svg>
    ),
  },
  {
    id: "loreal",
    name: "L'Oréal",
    category: "Culture, Retail & Tech",
    description: "Leader Mondial de la Beauté & Beauty Tech",
    tag: "BEAUTÉ & TECH",
    brandColor: "#C5A059",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 155 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="27"
          fontFamily="Georgia, Times New Roman, serif"
          fontWeight="800"
          fontSize="23"
          fill="currentColor"
          letterSpacing="2"
        >
          L'ORÉAL
        </text>
        <text
          x="2"
          y="37"
          fontFamily="System-ui, sans-serif"
          fontWeight="700"
          fontSize="7.5"
          fill="#C5A059"
          letterSpacing="3"
        >
          PARIS
        </text>
      </svg>
    ),
  },
  {
    id: "education",
    name: "Ministère de l'Éducation",
    category: "Santé & Éducation",
    description: "Ministère de l'Éducation Nationale et de la Jeunesse",
    tag: "SECTEUR PUBLIC",
    brandColor: "#002395",
    logo: (
      <svg
        className="h-10 w-auto"
        viewBox="0 0 200 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0, 5)">
          <rect x="0" y="0" width="8" height="32" fill="#002395" />
          <rect
            x="8"
            y="0"
            width="8"
            height="32"
            fill="#FFFFFF"
            stroke="#E5E7EB"
            strokeWidth="0.5"
          />
          <rect x="16" y="0" width="8" height="32" fill="#ED2939" />
        </g>
        <text
          x="32"
          y="16"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="10.5"
          fill="#002395"
          letterSpacing="0.5"
        >
          MINISTÈRE
        </text>
        <text
          x="32"
          y="27"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="10.5"
          fill="#002395"
          letterSpacing="0.5"
        >
          DE L'ÉDUCATION
        </text>
        <text
          x="32"
          y="36"
          fontFamily="System-ui, sans-serif"
          fontWeight="800"
          fontSize="8.5"
          fill="#ED2939"
          letterSpacing="0.5"
        >
          NATIONALE
        </text>
      </svg>
    ),
  },
  {
    id: "airfrance",
    name: "Air France",
    category: "Culture, Retail & Tech",
    description: "Compagnie Aérienne Nationale & Transporteur Mondial",
    tag: "AÉRONAUTIQUE",
    brandColor: "#002157",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 165 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="27"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="19"
          fill="#002157"
          letterSpacing="0.5"
        >
          AIRFRANCE
        </text>
        <path d="M128 10L158 8L138 28L128 10Z" fill="#ED2939" />
      </svg>
    ),
  },
  {
    id: "decathlon",
    name: "Decathlon",
    category: "Culture, Retail & Tech",
    description: "Leader Mondial de la Conception & Distribution de Sport",
    tag: "RETAIL & SPORT",
    brandColor: "#0082C3",
    logo: (
      <svg
        className="h-9 w-auto"
        viewBox="0 0 160 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="6" width="155" height="30" rx="5" fill="#0082C3" />
        <text
          x="12"
          y="27"
          fontFamily="System-ui, sans-serif"
          fontWeight="900"
          fontSize="16"
          fill="#FFFFFF"
          fontStyle="italic"
          letterSpacing="0.5"
        >
          DECATHLON
        </text>
      </svg>
    ),
  },
];

const STATS = [
  { value: 120, prefix: "+", suffix: "", label: "Projets réalisés", icon: Rocket },
  { value: 45, prefix: "+", suffix: "", label: "Partenaires", icon: Building2 },
  { value: 97, prefix: "+", suffix: "%", label: "Clients satisfaits", icon: Star },
  { value: 30, prefix: "+", suffix: "", label: "Technologies maîtrisées", icon: Cpu },
  { value: 25, prefix: "+", suffix: "", label: "Experts impliqués", icon: Users },
];

const TESTIMONIALS = [
  {
    quote:
      "Les équipes de Genove ont livré une plateforme IA robuste et parfaitement intégrée à notre SI. Un partenariat exemplaire.",
    name: "Camille Renard",
    role: "Directrice Innovation, BNP Paribas",
    avatar: "CR",
    company: "BNP Paribas",
  },
  {
    quote:
      "Sérieux, écoute et exécution. Genove a transformé un besoin flou en une solution concrète qui fait gagner du temps à nos équipes.",
    name: "Dr. Julien Marchand",
    role: "Responsable Transformation, AP-HP",
    avatar: "JM",
    company: "AP-HP",
  },
  {
    quote:
      "Une vraie expertise pédagogique et technique. Nos étudiants ont adopté la plateforme dès la première semaine.",
    name: "Pr. Sophie Legrand",
    role: "Doyenne & Enseignante, Sorbonne Université",
    avatar: "SL",
    company: "Sorbonne Université",
  },
];

/* ------------------------------------------------------------- English Data --- */

const REALISATIONS_EN: Record<string, Partial<Realisation>> = {
  "assistant-ia-parcours-patient": {
    name: "Patient Journey AI Assistant",
    date: "March 2025",
    summary:
      "Multimodal conversational agent to pre-qualify requests and guide patients in non-vital emergency care.",
    context:
      "Facing overcrowding in non-vital emergency rooms, AP-HP sought a solution to improve patient intake, pre-qualification, and guidance while freeing up medical staff time.",
    objectives: [
      "Reduce perceived waiting time at intake",
      "Automate orientation to the right care pathway",
      "Guarantee HDS compliance and data confidentiality",
      "Provide an accessible channel (mobile, tablet, kiosk)",
    ],
    solution:
      "We designed a conversational assistant based on a secure RAG pipeline connected to internal documents, featuring a clinical orientation engine validated by medical teams and a mobile-first accessible interface.",
    features: [
      "Multimodal chat (text, voice, images)",
      "Guided clinical pre-qualification",
      "Secure document search (RAG)",
      "Analytics dashboard for care teams",
      "Reception kiosk mode and patient mobile mode",
    ],
    architecture:
      "React + Vite frontend, FastAPI API, LangChain orchestrator, pgvector store, LLM hosted in HDS environment, OpenTelemetry observability.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=1200&q=80",
        caption: "Patient pre-qualification screen",
      },
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Orientation dashboard",
      },
    ],
    results: [
      "-38% waiting time during pilot",
      "92% patient satisfaction",
      "Over 12,000 conversations handled in 3 months",
    ],
    benefits: [
      "Freed up medical time for priority cases",
      "Full traceability and auditability of interactions",
      "Reusable core framework for other AP-HP services",
    ],
  },
  "dashboard-risques-credit": {
    name: "AI Credit Risk Dashboard",
    date: "January 2025",
    summary:
      "Decision-making platform predicting default risks and explaining each decision to account managers.",
    context:
      "Account managers needed a unified tool to quickly evaluate credit applications with clear explanations of model predictions.",
    objectives: [
      "Predict defaults using an auditable model",
      "Provide readable business explanations",
      "Comply with GDPR and regulatory standards",
      "Industrialize model deployment",
    ],
    solution:
      "A complete MLOps pipeline was established, with a supervised scoring model, a SHAP explainability layer, and a real-time React dashboard connected to the API.",
    features: [
      "Real-time credit scoring",
      "SHAP explanations per variable",
      "What-if simulator",
      "Model drift alerting",
    ],
    architecture:
      "Airflow ingestion, Scikit-learn training, FastAPI API, React + Recharts frontend, Grafana + Prometheus monitoring.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Summary portfolio view",
      },
    ],
    results: [
      "AUC 0.91 on pilot scope",
      "Application evaluation time divided by 3",
      "Adopted by 4 branches in 6 weeks",
    ],
    benefits: [
      "Faster and better-justified decisions",
      "Reduced risk of litigation",
      "Solid foundation for additional scoring use cases",
    ],
  },
  "plateforme-exercices-adaptatifs": {
    name: "Adaptive Exercise Platform",
    date: "November 2024",
    summary:
      "E-learning platform that adapts computer science exercises in real time to each learner's level.",
    context:
      "The computer science department wished to personalize learning across large student cohorts without increasing teacher workload.",
    objectives: [
      "Adapt difficulty to student's actual skill level",
      "Generate personalized corrections",
      "Provide pedagogical tracking for teachers",
      "Ensure a secure execution environment",
    ],
    solution:
      "A web platform with an adaptive engine, LLM exercise generator, and Docker sandbox to execute student code safely.",
    features: [
      "Competency graph per student",
      "Dynamic exercise generation",
      "AI-commented feedback",
      "Secure execution console",
      "Teacher dashboard",
    ],
    architecture:
      "React frontend, Node.js API, ephemeral Docker sandbox, PostgreSQL database, private LLM API orchestration.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&w=1200&q=80",
        caption: "Student view — adaptive exercise",
      },
    ],
    results: [
      "+27% success rate on final exams",
      "200 students in the pilot cohort",
      "Average rating 4.6/5 from learners",
    ],
    benefits: [
      "Large-scale personalization",
      "Time savings for faculty",
      "Reusable core for other course modules",
    ],
  },
  "maintenance-predictive-usines": {
    name: "Predictive Factory Maintenance",
    date: "September 2024",
    summary: "IoT + ML pipeline to anticipate failures in critical industrial equipment.",
    context:
      "Unplanned downtime generated significant losses. The goal was to anticipate breakdowns from sensor data.",
    objectives: [
      "Collect and centralize sensor data",
      "Detect weak signals of failure",
      "Prioritize maintenance interventions",
      "Industrialize model deployment",
    ],
    solution:
      "A comprehensive MLOps platform: real-time Kafka ingestion, feature store, Spark training, Kubernetes deployment, Grafana monitoring.",
    features: [
      "Real-time sensor ingestion",
      "Multivariate anomaly detection",
      "Equipment criticality score",
      "Push alerts for field teams",
    ],
    architecture:
      "Kafka → Spark Streaming → Feature Store → ML Model served via KServe on Kubernetes, Prometheus + Grafana monitoring.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        caption: "Factory supervision dashboard",
      },
    ],
    results: ["-22% unplanned downtime", "ROI achieved in 8 months", "3 industrial sites equipped"],
    benefits: [
      "Higher equipment availability",
      "Targeted and lower-cost maintenance",
      "Strengthened data culture across teams",
    ],
  },
  "guide-musee-personnalise": {
    name: "Personalized Museum Guide",
    date: "June 2024",
    summary:
      "Mobile app building a tailored visit itinerary according to tastes and available time.",
    context:
      "The museum aimed to offer visitors a personalized experience beyond traditional audio guides.",
    objectives: [
      "Create itineraries suited to visitor profiles",
      "Enrich artwork with multimedia content",
      "Operate in partial offline mode",
      "Measure visitor engagement",
    ],
    solution:
      "A React Native application with a recommendation engine, multilingual content, partial offline mode, and GraphQL backend.",
    features: [
      "Tailored tours based on available time",
      "Enriched artwork cards (audio, video, 3D)",
      "Real-time recommendations",
      "Partial offline mode",
    ],
    architecture:
      "React Native + Expo, Node.js GraphQL API, Image CDN, LLM for personalized commentary generation.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1565060169861-2d4b02cef8a5?auto=format&fit=crop&w=1200&q=80",
        caption: "Personalized tour screen",
      },
    ],
    results: ["45,000 downloads in pilot phase", "+18% visit duration", "App Store rating 4.7/5"],
    benefits: [
      "Premium, differentiating visitor experience",
      "Valuable data on real visitor pathways",
      "Foundation for other cultural institutions",
    ],
  },
  "kyc-automatise-multi-agents": {
    name: "Automated Multi-Agent KYC",
    date: "April 2024",
    summary: "Multi-agent AI system automating end-to-end KYC verification.",
    context:
      "The KYC process mobilized significant operator resources for repetitive tasks (extraction, verification, cross-checking).",
    objectives: [
      "Automate document extraction",
      "Cross-reference data with third-party sources",
      "Flag high-risk cases",
      "Keep human-in-the-loop for complex cases",
    ],
    solution:
      "LangGraph multi-agent orchestration with OCR, identity verification, consistency checks, and a human review console.",
    features: [
      "Identity document OCR",
      "Biometric verification",
      "Automated sanctions screening",
      "Human review console",
    ],
    architecture:
      "Python agents orchestrated via LangGraph, FastAPI API, encrypted document storage, Azure deployment.",
    screenshots: [
      {
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
        caption: "KYC review console",
      },
    ],
    results: [
      "Processing time reduced 5x",
      "98% extraction accuracy",
      "Deployed across 3 countries",
    ],
    benefits: [
      "Drastically reduced operational costs",
      "Strengthened compliance",
      "Superior customer onboarding experience",
    ],
  },
};

const DOMAINS_EN: Record<string, { name: string; desc: string; tags: string[] }> = {
  "Intelligence Artificielle": {
    name: "Artificial Intelligence",
    desc: "LLM, RAG, autonomous agents, computer vision & natural language processing (NLP).",
    tags: ["LLM & RAG", "AI Agents", "Vision", "NLP"],
  },
  "Data & BI": {
    name: "Data & BI",
    desc: "Data engineering, real-time pipelines, decision dashboards & governance.",
    tags: ["ETL Pipelines", "Dashboards", "Snowflake", "PowerBI"],
  },
  "Développement Web": {
    name: "Web Development",
    desc: "High-performance SaaS applications, complex business portals & modern architectures.",
    tags: ["React / Next", "Node / Python", "SaaS", "REST APIs"],
  },
  "Développement Mobile": {
    name: "Mobile Development",
    desc: "Native and cross-platform mobile apps with high UX/UI value.",
    tags: ["iOS & Android", "React Native", "Flutter", "Offline-first"],
  },
  "E-learning": {
    name: "E-learning",
    desc: "Custom educational platforms, adaptive learning paths & immersive learning content.",
    tags: ["Custom LMS", "Gamification", "SCORM", "Analytics"],
  },
  Cloud: {
    name: "Cloud",
    desc: "Scalable cloud infrastructure, Serverless architectures & secure multi-cloud migration.",
    tags: ["AWS", "Azure", "GCP", "Kubernetes"],
  },
  DevOps: {
    name: "DevOps",
    desc: "CI/CD automation, Infrastructure as Code, application observability & SRE practices.",
    tags: ["Docker & K8s", "Terraform", "CI/CD", "Observability"],
  },
  Automatisation: {
    name: "Automation",
    desc: "Robotic Process Automation (RPA), workflow orchestration & business API integrations.",
    tags: ["RPA", "AI Agents", "Workflows", "APIs"],
  },
};

const METHOD_STEPS_EN: { title: string; subtitle: string; desc: string; deliverable: string }[] = [
  {
    title: "Needs Analysis",
    subtitle: "Immersion Phase",
    desc: "Active listening, business challenges audit, legacy technical review, and strategic scoping.",
    deliverable: "Business Scoping & Goals",
  },
  {
    title: "Scoping & Specs",
    subtitle: "UX/UI Design",
    desc: "Collaborative workshops, mockup creation, User Stories writing & delivery milestones.",
    deliverable: "User Stories & Wireframes",
  },
  {
    title: "Architecture & Stack",
    subtitle: "Technical Design",
    desc: "Technology choices, database modeling, detailed cost estimation, and planning.",
    deliverable: "Architecture Dossier",
  },
  {
    title: "Agile Development",
    subtitle: "Iterative Sprints",
    desc: "2-week sprints, continuous integration, systematic code reviews & regular demos.",
    deliverable: "Sprints & Deliverable Demos",
  },
  {
    title: "Testing & UAT",
    subtitle: "Quality Assurance",
    desc: "Automated E2E testing, OWASP security audits, user acceptance testing & stress tests.",
    deliverable: "Acceptance & Security Sign-off",
  },
  {
    title: "Deployment",
    subtitle: "Go-Live Production",
    desc: "Automated CI/CD deployment, zero-downtime cutover & continuous monitoring.",
    deliverable: "Cloud Delivery & Monitoring",
  },
  {
    title: "Support & Evolution",
    subtitle: "Training & SLA",
    desc: "User training, skills transfer, reactive SLA support & ongoing maintenance.",
    deliverable: "SLA Support & Maintenance",
  },
];

const PARTNERS_EN: Record<string, { description: string; tag: string }> = {
  aphp: {
    description: "Public Assistance — Hospitals of Paris",
    tag: "HEALTH & AI",
  },
  bnp: {
    description: "European Banking & Financial Services",
    tag: "BANKING & FINANCE",
  },
  sorbonne: {
    description: "World-Class Higher Education & Research",
    tag: "RESEARCH & EDUCATION",
  },
  totalenergies: {
    description: "Multi-energy Company & Energy Transition",
    tag: "ENERGY",
  },
  louvre: {
    description: "National Museum & World Cultural Institution",
    tag: "HERITAGE & CULTURE",
  },
  socgen: {
    description: "International Banking Group & Financial Services",
    tag: "FINANCE",
  },
  orange: {
    description: "Telecom Operator & Digital Leader",
    tag: "TELECOM & CLOUD",
  },
  renault: {
    description: "Automotive Manufacturer & Future Mobility",
    tag: "INDUSTRY 4.0",
  },
  loreal: {
    description: "World Leader in Beauty & Beauty Tech",
    tag: "BEAUTY & TECH",
  },
  education: {
    description: "Ministry of National Education and Youth",
    tag: "PUBLIC SECTOR",
  },
  airfrance: {
    description: "National Airline & Global Carrier",
    tag: "AERONAUTICS",
  },
  decathlon: {
    description: "World Leader in Sports Design & Retail",
    tag: "RETAIL & SPORT",
  },
};

const STATS_EN = [
  { value: 120, prefix: "+", suffix: "", label: "Completed projects", icon: Rocket },
  { value: 45, prefix: "+", suffix: "", label: "Partners", icon: Building2 },
  { value: 97, prefix: "+", suffix: "%", label: "Satisfied clients", icon: Star },
  { value: 30, prefix: "+", suffix: "", label: "Mastered technologies", icon: Cpu },
  { value: 25, prefix: "+", suffix: "", label: "Experts involved", icon: Users },
];

const TESTIMONIALS_EN = [
  {
    quote:
      "The Genove team delivered a robust AI platform perfectly integrated into our IS. An exemplary partnership.",
    name: "Camille Renard",
    role: "Innovation Director, BNP Paribas",
    avatar: "CR",
    company: "BNP Paribas",
  },
  {
    quote:
      "Professionalism, listening, and execution. Genove transformed a vague need into a concrete solution that saves our teams time.",
    name: "Dr. Julien Marchand",
    role: "Head of Transformation, AP-HP",
    avatar: "JM",
    company: "AP-HP",
  },
  {
    quote:
      "Genuine pedagogical and technical expertise. Our students adopted the platform from the very first week.",
    name: "Pr. Sophie Legrand",
    role: "Dean & Professor, Sorbonne University",
    avatar: "SL",
    company: "Sorbonne University",
  },
];

function getLocalizedRealisations(lang: string): Realisation[] {
  if (lang !== "en") return REALISATIONS;
  return REALISATIONS.map((r) => {
    const en = REALISATIONS_EN[r.slug];
    if (!en) return r;
    return {
      ...r,
      name: en.name || r.name,
      date: en.date || r.date,
      summary: en.summary || r.summary,
      context: en.context || r.context,
      objectives: en.objectives || r.objectives,
      solution: en.solution || r.solution,
      features: en.features || r.features,
      architecture: en.architecture || r.architecture,
      screenshots: en.screenshots || r.screenshots,
      results: en.results || r.results,
      benefits: en.benefits || r.benefits,
    };
  });
}

function getLocalizedDomains(lang: string): ExpertiseDomain[] {
  if (lang !== "en") return DOMAINS;
  return DOMAINS.map((d) => {
    const en = DOMAINS_EN[d.name];
    if (!en) return d;
    return {
      ...d,
      name: en.name,
      desc: en.desc,
      tags: en.tags,
    };
  });
}

function getLocalizedMethodSteps(lang: string): MethodStep[] {
  if (lang !== "en") return METHOD_STEPS;
  return METHOD_STEPS.map((s, i) => {
    const en = METHOD_STEPS_EN[i];
    if (!en) return s;
    return {
      ...s,
      title: en.title,
      subtitle: en.subtitle,
      desc: en.desc,
      deliverable: en.deliverable,
    };
  });
}

function getLocalizedPartnerItems(lang: string): PartnerItem[] {
  if (lang !== "en") return PARTNER_ITEMS;
  return PARTNER_ITEMS.map((p) => {
    const en = PARTNERS_EN[p.id];
    if (!en) return p;
    return {
      ...p,
      description: en.description,
      tag: en.tag,
    };
  });
}

function getLocalizedStats(lang: string) {
  if (lang !== "en") return STATS;
  return STATS_EN;
}

function getLocalizedTestimonials(lang: string) {
  if (lang !== "en") return TESTIMONIALS;
  return TESTIMONIALS_EN;
}

const DOMAIN_FILTERS: (Domain | "Tous")[] = [
  "Tous",
  "Intelligence Artificielle",
  "Data & BI",
  "Développement Web",
  "Développement Mobile",
  "E-learning",
  "Cloud",
  "DevOps",
  "Automatisation",
];

function translateDomain(d: string, lang: string) {
  if (lang !== "en") return d;
  if (d === "Tous") return "All";
  if (d === "Intelligence Artificielle") return "Artificial Intelligence";
  if (d === "Data & BI") return "Data & BI";
  if (d === "Développement Web") return "Web Development";
  if (d === "Développement Mobile") return "Mobile Development";
  if (d === "E-learning") return "E-learning";
  if (d === "Cloud") return "Cloud";
  if (d === "DevOps") return "DevOps";
  if (d === "Automatisation") return "Automation";
  return d;
}

const DOMAIN_ICONS: Record<Domain | "Tous", React.ReactNode> = {
  Tous: <Layers className="h-3.5 w-3.5" />,
  "Intelligence Artificielle": <Cpu className="h-3.5 w-3.5" />,
  "Data & BI": <Database className="h-3.5 w-3.5" />,
  "Développement Web": <Code2 className="h-3.5 w-3.5" />,
  "Développement Mobile": <Smartphone className="h-3.5 w-3.5" />,
  "E-learning": <GraduationCap className="h-3.5 w-3.5" />,
  Cloud: <Cloud className="h-3.5 w-3.5" />,
  DevOps: <Server className="h-3.5 w-3.5" />,
  Automatisation: <Workflow className="h-3.5 w-3.5" />,
};

/* --------------------------------------------------------------- Utils --- */

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

/* -------------------------------------------------------------- Component */

function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [subject, setSubject] = useState<"projet" | "partenariat" | "formation" | "autre">(
    "projet",
  );
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [preferredContact, setPreferredContact] = useState<"email" | "phone" | "visio">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || "");
      if (!email) setEmail(user.email || "");
    }
  }, [user, name, email]);

  // Lock outer background body scroll when ContactModal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@genove.tn");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0618]/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#130B29] border border-purple-500/35 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[90vh] my-auto text-slate-100">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#8C52FF] via-[#7030EF] to-[#5B21B6] p-5 sm:p-7 text-white overflow-hidden">
          {/* Header Ambient Glows */}
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_70%,#FBBF24,transparent_45%)]" />

          {/* Close button - absolute top right */}
          <button
            onClick={resetAndClose}
            className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer border border-white/20 hover:scale-105"
            title={language === "en" ? "Close" : "Fermer"}
          >
            <X className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          </button>

          <div className="relative z-10 space-y-2 pr-10 sm:pr-14">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              <GenoveLogoCard
                isCircle
                logoHeight={40}
                className="w-12 h-12 sm:w-16 sm:h-16 shadow-xl border-purple-400/50 shrink-0"
              />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/35 text-[10px] sm:text-xs font-semibold tracking-wide backdrop-blur-md shadow-xs whitespace-nowrap shrink-0">
                <Sparkles className="h-3 w-3 text-amber-300 animate-pulse shrink-0" />
                <span>
                  {language === "en" ? "Contact & Partnerships" : "Contact & Partenariats"}
                </span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-white tracking-tight leading-tight">
              {language === "en"
                ? "Let's build your next AI project together"
                : "Concevons ensemble votre projet IA & EdTech"}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
              {language === "en"
                ? "Our experts & technical team analyze your request and reply within 24 hours."
                : "Nos experts et ingénieurs analysent votre demande et vous répondent sous 24h."}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 bg-[#130B29] text-slate-200">
          {isSuccess ? (
            <div className="py-12 text-center space-y-6 max-w-lg mx-auto">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-heading font-black text-white">
                  {language === "en"
                    ? "Message sent successfully!"
                    : "Message transmis avec succès !"}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {language === "en" ? "Thank you " : "Merci "}
                  <span className="font-bold text-amber-300">
                    {name || (language === "en" ? "dear partner" : "cher partenaire")}
                  </span>
                  .
                  {language === "en"
                    ? " Your request has been assigned to a Genove specialist. We will contact you very quickly."
                    : " Votre demande a été transmise au spécialiste Genove dédié. Nous vous contacterons très rapidement."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#180E30] border border-purple-500/30 text-xs text-slate-200 text-left space-y-2 shadow-md">
                <div className="font-bold text-white flex items-center gap-2 border-b border-purple-500/20 pb-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>
                    {language === "en" ? "Request details:" : "Détails de votre demande :"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-400">
                    {language === "en" ? "Subject:" : "Objet :"}
                  </span>
                  <span className="font-bold text-white">
                    {subject === "projet"
                      ? language === "en"
                        ? "AI / Web Project"
                        : "Projet IA / Web"
                      : subject === "partenariat"
                        ? language === "en"
                          ? "Partnership"
                          : "Partenariat"
                        : subject === "formation"
                          ? language === "en"
                            ? "Custom Training"
                            : "Formation Sur-mesure"
                          : language === "en"
                            ? "Other Request"
                            : "Autre Demande"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-400">Email :</span>
                  <span className="font-mono font-medium text-white">{email}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-400">
                    {language === "en" ? "Preferred channel:" : "Canal préféré :"}
                  </span>
                  <span className="font-bold text-white">
                    {preferredContact === "email"
                      ? "Email"
                      : preferredContact === "phone"
                        ? language === "en"
                          ? "Phone Call"
                          : "Appel Téléphonique"
                        : language === "en"
                          ? "Video Call"
                          : "Visioconférence"}
                  </span>
                </div>
              </div>

              <button
                onClick={resetAndClose}
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm hover:from-amber-300 hover:to-amber-400 shadow-[0_10px_25px_rgba(251,191,36,0.35)] transition-all cursor-pointer hover:scale-105"
              >
                {language === "en" ? "Back to site" : "Retour au site"}
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-[1fr_1.4fr] gap-8">
              {/* Left Column: Direct Info & Presentation Banner */}
              <div className="space-y-6 border-b md:border-b-0 md:border-r border-purple-500/25 pb-6 md:pb-0 md:pr-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-3 border border-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>
                      {language === "en" ? "Team online & ready" : "Équipe disponible & réactive"}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-black text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-amber-400" />
                    <span>
                      {language === "en"
                        ? "Innovation & Support Center"
                        : "Centre d'Innovation & Support"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {language === "en"
                      ? "Academic & industrial EdTech platform. Contact our executive team directly for custom AI developments or strategic partnerships."
                      : "Plateforme d'excellence EdTech & IA. Contactez directement nos consultants pour vos besoins stratégiques ou partenariats."}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="group p-4 rounded-2xl border border-purple-500/25 bg-[#180E30] hover:border-purple-500/50 shadow-inner transition-all">
                    <div className="font-bold text-white flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                        </div>
                        {language === "en" ? "Direct Email" : "E-mail direct"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="text-[11px] text-amber-300 font-bold hover:bg-amber-400/20 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-amber-400/20"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        {copied
                          ? language === "en"
                            ? "Copied!"
                            : "Copié !"
                          : language === "en"
                            ? "Copy"
                            : "Copier"}
                      </button>
                    </div>
                    <div className="text-slate-200 font-mono text-xs mt-2 pl-10 font-medium">
                      contact@genove.tn
                    </div>
                  </div>

                  <div className="group p-4 rounded-2xl border border-purple-500/25 bg-[#180E30] hover:border-purple-500/50 shadow-inner transition-all">
                    <div className="font-bold text-white flex items-center gap-2.5 text-xs">
                      <div className="h-8 w-8 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span>
                        {language === "en" ? "Phone / Secretariat" : "Téléphone / Secrétariat"}
                      </span>
                    </div>
                    <div className="text-slate-200 font-mono text-xs mt-2 pl-10 font-medium">
                      +216 71 123 456
                    </div>
                  </div>

                  <div className="group p-4 rounded-2xl border border-purple-500/25 bg-[#180E30] hover:border-purple-500/50 shadow-inner transition-all">
                    <div className="font-bold text-white flex items-center gap-2.5 text-xs">
                      <div className="h-8 w-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span>
                        {language === "en" ? "Headquarters Address" : "Siège & Innovation Hub"}
                      </span>
                    </div>
                    <div className="text-slate-300 text-xs mt-2 pl-10 leading-relaxed font-medium">
                      Technopôle El Ghazala / ESEN, Manouba, Tunis
                    </div>
                  </div>

                  <div className="group p-4 rounded-2xl border border-purple-500/25 bg-[#180E30] hover:border-purple-500/50 shadow-inner transition-all">
                    <div className="font-bold text-white flex items-center gap-2.5 text-xs">
                      <div className="h-8 w-8 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span>
                        {language === "en" ? "SLA Response Guarantee" : "Engagement de réponse"}
                      </span>
                    </div>
                    <div className="text-slate-300 text-xs mt-2 pl-10 font-medium">
                      {language === "en"
                        ? "Guaranteed reply within 24 business hours"
                        : "Réponse garantie sous 24h ouvrées"}
                    </div>
                  </div>
                </div>

                {/* Genove Brand Card placed at the bottom */}
                <div className="pt-2">
                  <GenoveLogoCard logoOnly logoHeight={64} />
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Subject Tabs */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-2">
                    {language === "en"
                      ? "Select the subject of your message *"
                      : "Sélectionnez l'objet de votre message *"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        id: "projet",
                        label: language === "en" ? "AI / Web Project" : "Projet IA / Web",
                        icon: Rocket,
                      },
                      {
                        id: "partenariat",
                        label: language === "en" ? "Partnership" : "Partenariat",
                        icon: Handshake,
                      },
                      {
                        id: "formation",
                        label: language === "en" ? "Pro Training" : "Formation Pro",
                        icon: GraduationCap,
                      },
                      {
                        id: "autre",
                        label: language === "en" ? "Other Request" : "Autre Demande",
                        icon: Mail,
                      },
                    ].map((item) => {
                      const IconComp = item.icon;
                      const active = subject === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setSubject(item.id as "projet" | "partenariat" | "formation" | "autre")
                          }
                          className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2.5 justify-center cursor-pointer ${
                            active
                              ? "bg-[#8C52FF]/20 border-[#8C52FF] text-white shadow-md ring-1 ring-[#8C52FF]/40"
                              : "bg-[#180E30] border-purple-500/30 text-slate-300 hover:border-purple-400/50 hover:bg-[#1D123A]"
                          }`}
                        >
                          <IconComp
                            className={`h-4 w-4 ${active ? "text-amber-400" : "text-slate-400"}`}
                          />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email inputs */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      {language === "en" ? "Full Name *" : "Nom & Prénom *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === "en" ? "Ex: Sarah Trabelsi" : "Ex: Mohamed Ben Ali"}
                      className="w-full h-11 rounded-xl border border-purple-500/30 bg-[#1D123A] px-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      {language === "en" ? "Email Address *" : "Adresse Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === "en" ? "name@company.com" : "nom@entreprise.com"}
                      className="w-full h-11 rounded-xl border border-purple-500/30 bg-[#1D123A] px-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Company & Phone */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      {language === "en" ? "Organization / Company" : "Organisation / Entreprise"}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={
                        language === "en"
                          ? "Ex: TechCorp, Startup..."
                          : "Ex: Banque, Startup, ESEN..."
                      }
                      className="w-full h-11 rounded-xl border border-purple-500/30 bg-[#1D123A] px-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      {language === "en" ? "Phone / WhatsApp" : "Téléphone / WhatsApp"}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+216 98 000 000"
                      className="w-full h-11 rounded-xl border border-purple-500/30 bg-[#1D123A] px-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    {language === "en"
                      ? "Your message or project scope *"
                      : "Votre message ou description du besoin *"}
                  </label>
                  <textarea
                    required
                    rows={3.5 as unknown as number}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      language === "en"
                        ? "Briefly describe your objectives, timeframe or questions..."
                        : "Décrivez brièvement vos objectifs, vos contraintes ou vos questions..."
                    }
                    className="w-full rounded-xl border border-purple-500/30 bg-[#1D123A] p-3.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/30 transition-all resize-none font-medium"
                  />
                </div>

                {/* Preferred Channel */}
                <div>
                  <label className="text-xs font-semibold text-slate-200 block mb-2">
                    {language === "en" ? "Preferred contact channel" : "Canal de réponse préféré"}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {[
                      { id: "email", label: language === "en" ? "Email" : "E-mail", icon: Mail },
                      {
                        id: "phone",
                        label: language === "en" ? "Phone" : "Téléphone",
                        icon: Phone,
                      },
                      {
                        id: "visio",
                        label: language === "en" ? "Video Call" : "Vidéo",
                        icon: Video,
                      },
                    ].map((c) => {
                      const IconC = c.icon;
                      const active = preferredContact === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setPreferredContact(c.id as "email" | "phone" | "visio")}
                          className={`py-2.5 px-1 sm:px-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-w-0 ${
                            active
                              ? "bg-amber-400 text-slate-950 border-transparent shadow-md font-bold"
                              : "bg-[#180E30] border-purple-500/30 text-slate-300 hover:border-purple-400/50"
                          }`}
                        >
                          <IconC
                            className={`h-3.5 w-3.5 shrink-0 ${active ? "text-slate-950" : "text-amber-400"}`}
                          />
                          <span className="truncate">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer flex items-center justify-center gap-2.5 mt-2 hover:scale-[1.005] active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>
                        {language === "en" ? "Transmitting request..." : "Transmission en cours..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-slate-950" />
                      <span>{language === "en" ? "Send request now" : "Envoyer la demande"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Projets() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<(typeof DOMAIN_FILTERS)[number]>("Tous");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selected, setSelected] = useState<Realisation | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const projectsSectionRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();

  // Reset showAllProjects when filter or search changes
  useEffect(() => {
    setShowAllProjects(false);
  }, [filter, searchQuery]);

  const realisations = getLocalizedRealisations(language);

  // Sync selected project with URL query parameter on mount / language change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get("project");
    if (slugParam) {
      const list = getLocalizedRealisations(language);
      const found = list.find(
        (r) => r.slug === slugParam || r.name.toLowerCase() === slugParam.toLowerCase(),
      );
      if (found) setSelected(found);
    }
  }, [language]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selected) {
      url.searchParams.set("project", selected.slug);
    } else {
      url.searchParams.delete("project");
    }
    window.history.replaceState({}, "", url.toString());
  }, [selected]);

  const getDomainCount = (domain: Domain | "Tous") => {
    if (domain === "Tous") return realisations.length;
    return realisations.filter((r) => r.domain === domain).length;
  };

  const filteredList = realisations.filter((r) => {
    const matchesDomain = filter === "Tous" || r.domain === filter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesDomain;
    return (
      matchesDomain &&
      (r.name.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.partner.toLowerCase().includes(q) ||
        r.tech.some((t) => t.toLowerCase().includes(q)) ||
        r.domain.toLowerCase().includes(q) ||
        translateDomain(r.domain, language).toLowerCase().includes(q))
    );
  });

  const proposeProject = () => requireAuth(() => navigate({ to: "/proposer-projet" }));

  /* -------------------------------------------------- Detail page view -- */
  if (selected) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#F3EEFE]/60 dark:bg-slate-950 transition-colors duration-300 text-slate-800 dark:text-slate-100">
        {/* Background Soft Glow Bulbs on left and right sides spanning full page length */}
        <div className="absolute top-24 -left-20 w-[45rem] h-[45rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-24 -right-20 w-[45rem] h-[45rem] bg-amber-300/30 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="absolute top-[25%] -left-20 w-[40rem] h-[40rem] bg-purple-400/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-[45%] -right-20 w-[40rem] h-[40rem] bg-amber-300/20 dark:bg-amber-600/12 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="absolute top-[65%] -left-20 w-[40rem] h-[40rem] bg-purple-400/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-[80%] -right-20 w-[40rem] h-[40rem] bg-amber-300/20 dark:bg-amber-600/12 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-10 -left-20 w-[40rem] h-[40rem] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Background Micro Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none z-0" />

        <div className="relative z-10">
          {/* Breadcrumbs Row - Seamless on body background matching catalogue.tsx */}
          <div className="pt-24 sm:pt-28 pb-4 relative z-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between text-xs font-medium flex-wrap gap-3 text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-1.5 flex-wrap font-medium">
                <button
                  onClick={() => {
                    setSelected(null);
                    navigate({ to: "/" });
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-amber-300 hover:bg-purple-500/10 dark:hover:bg-white/10 transition-all font-semibold cursor-pointer"
                  title={language === "en" ? "Home" : "Accueil"}
                >
                  <Home className="h-3.5 w-3.5 text-purple-600 dark:text-amber-300" />
                  <span>{language === "en" ? "Home" : "Accueil"}</span>
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-amber-300 hover:bg-purple-500/10 dark:hover:bg-white/10 transition-all font-semibold cursor-pointer"
                  title={language === "en" ? "Our Projects" : "Nos réalisations"}
                >
                  {language === "en" ? "Our Projects" : "Nos réalisations"}
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <button
                  onClick={() => {
                    setFilter(selected.domain);
                    setSelected(null);
                  }}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-amber-300 hover:bg-purple-500/10 dark:hover:bg-white/10 transition-all font-semibold cursor-pointer hidden sm:inline-flex"
                  title={translateDomain(selected.domain, language)}
                >
                  {translateDomain(selected.domain, language)}
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0 hidden sm:inline-block" />
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-amber-400/15 text-purple-700 dark:text-amber-300 border border-purple-200 dark:border-amber-400/30 font-bold text-xs truncate max-w-[200px] sm:max-w-[320px] md:max-w-[440px]"
                  title={selected.name}
                >
                  {selected.name}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#8C52FF] to-[#7030EF] hover:from-purple-600 hover:to-indigo-600 border border-purple-400/30 px-4 py-2 rounded-full shadow-md shadow-purple-500/20 transition-all duration-200 cursor-pointer group active:scale-95 shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-amber-300 transition-transform group-hover:-translate-x-0.5" />
                <span>{language === "en" ? "Back to projects" : "Retour aux réalisations"}</span>
              </button>
            </div>
          </div>

          {/* Hero Banner Section Container matching catalogue.tsx */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8">
            <div className="rounded-3xl bg-gradient-to-br from-[#180E30] via-[#1E113B] to-[#140B28] text-white border border-purple-500/30 shadow-2xl relative overflow-hidden p-6 sm:p-10 md:p-12">
              <div className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(140,82,255,0.35),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(251,191,36,0.2),transparent_45%)]" />

              <div className="grid gap-10 lg:grid-cols-[1fr_420px] items-center relative z-10">
                <div>
                  {/* Category, Date and Gold Badge */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/10 text-white border border-white/10">
                      {translateDomain(selected.domain, language)}
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/10 text-white border border-white/10">
                      {selected.date}
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#D4A83A]/20 text-amber-300 border border-[#D4A83A]/30 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-amber-300" />
                      {language === "en" ? "Genove Certified Project" : "Projet Certifié Genove"}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {selected.name}
                  </h1>
                  <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed font-semibold">
                    {language === "en" ? "Delivered by Genove for " : "Réalisé par Genove pour "}
                    <strong className="text-amber-300 font-bold">{selected.partner}</strong>.{" "}
                    {selected.summary}
                  </p>

                  {/* Statistics Line matching catalogue.tsx */}
                  <div className="mt-6 flex flex-wrap gap-6 items-center text-xs text-slate-300 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-white font-bold">4.9 / 5</span>
                      <span className="text-slate-400 font-medium">
                        ({language === "en" ? "100% Operational" : "100% Opérationnel"})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-amber-400" />
                      <span>{selected.partner}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-amber-400" />
                      <span>{selected.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Code2 className="h-4 w-4 text-amber-400" />
                      <span>{selected.tech.length} Technologies</span>
                    </div>
                  </div>

                  {/* Mini Partner / Author Card inside Banner matching catalogue.tsx */}
                  <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 max-w-md">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#070F24] font-extrabold flex items-center justify-center text-sm shadow-[var(--shadow-gold)] shrink-0">
                      {selected.partner.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{selected.partner}</div>
                      <div className="text-xs text-slate-400">
                        {language === "en"
                          ? "Industrial Partner & Organization"
                          : "Partenaire Référent & Organisation"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video/Image Placeholder aspect-video box matching catalogue.tsx */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] aspect-video bg-slate-900 group cursor-pointer">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                    <span className="text-xs font-extrabold text-amber-300 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-400/30">
                      {selected.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Sections Grid matching catalogue.tsx layout (1fr_360px) */}
          <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 lg:grid-cols-[1fr_360px] items-start">
            {/* Main Left Column */}
            <div className="space-y-10">
              {/* Contexte & Objectifs */}
              <section className="space-y-4">
                <h2 className="font-heading text-xl font-extrabold text-[#0d1839] dark:text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-500" />
                  {language === "en" ? "Context & Objectives" : "Contexte & objectifs"}
                </h2>
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 shadow-xs hover:border-amber-400/40 transition-all space-y-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selected.context}
                  </p>
                  <div className="grid gap-3.5 sm:grid-cols-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {selected.objectives.map((o, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-4 flex items-start gap-3.5 shadow-xs hover:border-amber-400/40 transition-all group"
                      >
                        <div className="h-7 w-7 rounded-xl bg-amber-400/15 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30 group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-[#0d1839] transition-all">
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        </div>
                        <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-snug">
                          {o}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Solution Développée */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-extrabold text-[#0d1839] dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  {language === "en"
                    ? "Developed Solution & Technologies"
                    : "Solution développée & Technologies"}
                </h2>
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 shadow-xs hover:border-amber-400/40 transition-all space-y-5">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selected.solution}
                  </p>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      {language === "en"
                        ? "Technologies & Frameworks used"
                        : "Technologies & Frameworks mobilisés"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selected.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-400/50 transition-all"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Fonctionnalités Clés */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-extrabold text-[#0d1839] dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  {language === "en" ? "Key Features" : "Fonctionnalités clés"}
                </h2>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {selected.features.map((f, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 flex items-start gap-3.5 shadow-xs hover:border-amber-400/40 transition-all group"
                    >
                      <div className="h-8 w-8 rounded-xl bg-amber-400/15 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30 group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-[#0d1839] transition-all">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-snug">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Architecture */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-extrabold text-[#0d1839] dark:text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-amber-500" />
                  {language === "en"
                    ? "Architecture & Technical Design"
                    : "Architecture & Conception Technique"}
                </h2>
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 shadow-xs hover:border-amber-400/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-amber-400/15 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                      <Layers className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {selected.architecture}
                    </p>
                  </div>
                </div>
              </section>

              {/* Screenshots if any */}
              {selected.screenshots.length > 0 && (
                <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                  <h2 className="font-heading text-xl font-extrabold text-[#0d1839] dark:text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-amber-500" />
                    {language === "en" ? "Project Previews" : "Aperçus du Projet"}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selected.screenshots.map((s, i) => (
                      <figure
                        key={i}
                        className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xs hover:border-amber-400/40 transition-all group"
                      >
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={s.src}
                            alt={s.caption}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <figcaption className="p-3.5 text-xs text-slate-700 dark:text-slate-300 font-bold border-t border-slate-100 dark:border-slate-800">
                          {s.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {/* Résultats & Bénéfices */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-extrabold text-[#0d1839] dark:text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  {language === "en"
                    ? "Results & Operational Benefits"
                    : "Résultats & Bénéfices Opérationnels"}
                </h2>
                <div className="grid gap-3.5 sm:grid-cols-3">
                  {selected.results.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 via-amber-500/5 to-transparent backdrop-blur-xl p-5 text-center shadow-xs hover:border-amber-400 transition-all"
                    >
                      <div className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                        {language === "en" ? "Result KPI" : "Métrique Impact"}
                      </div>
                      <div className="mt-2 font-heading text-xl font-black text-[#0d1839] dark:text-white">
                        {r}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2 pt-2">
                  {selected.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400/30 transition-all"
                    >
                      <div className="h-8 w-8 rounded-xl bg-amber-400/15 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                        <Award className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Resources / Deliverables */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-bold text-[#0d1839] dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  {language === "en"
                    ? "Downloadable Deliverables & Docs"
                    : "Livrables & Documents du Projet"}
                </h2>
                <div className="space-y-2.5">
                  {[
                    {
                      name:
                        language === "en"
                          ? "Project Specifications & Architecture (PDF)"
                          : "Spécifications & Architecture Technique (PDF)",
                      size: "3.2 MB",
                    },
                    {
                      name:
                        language === "en"
                          ? "Case Study & Impact Report (PDF)"
                          : "Étude de Cas & Rapport d'Impact (PDF)",
                      size: "1.8 MB",
                    },
                    {
                      name:
                        language === "en"
                          ? "Dataset & Model Performance Benchmarks (ZIP)"
                          : "Benchmarks & Performance du Modèle (ZIP)",
                      size: "4.5 MB",
                    },
                  ].map((res, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 flex items-center justify-between gap-4 hover:border-amber-400/40 transition-all shadow-xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30 group-hover:scale-105 transition-transform">
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#0d1839] dark:text-white truncate">
                            {res.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                            {res.size}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            language === "en"
                              ? "Document download initiated"
                              : "Téléchargement du document initié",
                          )
                        }
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-[#0d1839] dark:hover:bg-amber-400 dark:hover:text-[#0d1839] text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Genove Quality Certificate Badge */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-bold text-[#0d1839] dark:text-white">
                  {language === "en" ? "Certification & Label" : "Label de Qualité Genove"}
                </h2>
                <div className="rounded-2xl border-2 border-dashed border-amber-400/40 bg-gradient-to-br from-amber-400/10 via-amber-500/5 to-transparent backdrop-blur-xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-xs hover:border-amber-400 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,168,58,0.18)_0%,transparent_70%)] blur-md pointer-events-none" />
                  <div className="h-12 w-12 rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-400/30 shadow-xs">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-extrabold mt-3">
                    {language === "en"
                      ? "GENOVE PROJECT CERTIFICATION"
                      : "LABEL DE RÉALISATION CERTIFIÉE GENOVE"}
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0d1839] dark:text-white mt-1.5">
                    {selected.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold max-w-md">
                    {language === "en"
                      ? `Successfully deployed with partner ${selected.partner} · Verified and audited by Genove experts`
                      : `Déployé avec succès avec le partenaire ${selected.partner} · Vérifié et audité sous les normes de qualité Genove`}
                  </p>
                </div>
              </section>
            </div>

            {/* Sticky Right Column Sidebar matching catalogue.tsx */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              {/* Main Price & Progress Card */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 shadow-xs space-y-5">
                {/* Gold Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {language === "en" ? "Deployment Status" : "Statut du Déploiement"}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                      100% {language === "en" ? "Operational" : "Opérationnel"}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
                    <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full w-full transition-all duration-500 shadow-xs" />
                  </div>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={proposeProject}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#070F24] font-black text-sm hover:from-amber-300 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Rocket className="h-4 w-4" />
                  {language === "en" ? "Propose a similar project" : "Proposer un projet similaire"}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsFavorited((prev) => !prev)}
                    className={`h-10 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isFavorited
                        ? "bg-amber-400/20 border-amber-400 text-amber-600 dark:text-amber-300"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-400/15 hover:border-amber-400/40"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorited ? "fill-amber-500 text-amber-500" : "text-amber-500"}`}
                    />
                    <span>
                      {isFavorited
                        ? language === "en"
                          ? "Favorited"
                          : "En favoris"
                        : language === "en"
                          ? "Favorite"
                          : "Favoris"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setIsShared(true);
                      setTimeout(() => setIsShared(false), 2000);
                    }}
                    className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-400/15 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="h-4 w-4 text-amber-500" />
                    <span>
                      {isShared
                        ? language === "en"
                          ? "Copied!"
                          : "Copié !"
                        : language === "en"
                          ? "Share"
                          : "Partager"}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-full h-11 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-400/15 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4 text-amber-500" />
                  <span>
                    {language === "en" ? "Contact an advisor" : "Contacter un conseiller"}
                  </span>
                </button>

                {/* Characteristics List */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {language === "en" ? "Partner" : "Partenaire"}
                    </span>
                    <span className="text-[#0d1839] dark:text-white font-bold">
                      {selected.partner}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {language === "en" ? "Domain" : "Domaine"}
                    </span>
                    <span className="text-[#0d1839] dark:text-white font-bold">
                      {translateDomain(selected.domain, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {language === "en" ? "Delivery Date" : "Date de livraison"}
                    </span>
                    <span className="text-[#0d1839] dark:text-white font-bold">
                      {selected.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {language === "en" ? "Tech Stack" : "Stack Technique"}
                    </span>
                    <span className="text-[#0d1839] dark:text-white font-bold truncate max-w-[150px]">
                      {selected.tech.slice(0, 2).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Certification
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                      {language === "en" ? "Verified Genove" : "Certifié Genove"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Partner Card */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 shadow-xs">
                <div className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-extrabold mb-4">
                  {language === "en" ? "Partner Organization" : "Partenaire Industriel"}
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0d1839] font-black flex items-center justify-center text-base shrink-0 shadow-xs">
                    {selected.partner.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-extrabold text-[#0d1839] dark:text-white text-sm truncate">
                      {selected.partner}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      {translateDomain(selected.domain, language)}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {language === "en"
                    ? `Collaboration between ${selected.partner} and Genove expert teams to design, train, and deploy custom AI solutions.`
                    : `Collaboration entre ${selected.partner} et les équipes d'experts Genove pour concevoir, entraîner et déployer des solutions IA sur mesure.`}
                </p>
              </div>
            </aside>
          </div>

          <Footer />
          <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------- Main portfolio -- */
  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section
        className="relative min-h-screen -mt-16 flex flex-col justify-center overflow-hidden text-white bg-[#180E30]"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <img
            src={language === "en" ? genoveEnHeroBg : genoveFrHeroBg}
            alt="Projets et partenariats Genove"
            className="w-full h-full object-cover object-[92%_center] sm:object-[95%_center] lg:object-right opacity-15 md:opacity-95 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Dark overlay ensuring perfect contrast & clean background on mobile while maintaining desktop layout */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#180E30] via-[#180E30]/95 to-[#120924] md:hidden" />
          <div className="hidden md:block absolute inset-y-0 left-0 w-full md:w-[48%] lg:w-[40%] bg-gradient-to-r from-[#180E30] via-[#180E30]/90 to-transparent" />
          <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#180E30] via-transparent to-[#180E30]/40" />
        </div>

        {/* Ambient radial glowing highlights */}
        <div className="pointer-events-none absolute inset-0 opacity-40 md:opacity-25 [background-image:radial-gradient(circle_at_15%_20%,#8C52FF_0%,transparent_45%),radial-gradient(circle_at_85%_80%,#7030EF_0%,transparent_50%),radial-gradient(circle_at_50%_95%,#FBBF24_0%,transparent_35%)]" />

        <div className="mx-auto max-w-7xl px-6 pt-36 pb-24 relative z-10 my-auto w-full">
          <div className="max-w-xl lg:max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/15 backdrop-blur-md shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#D4A83A]" /> {t("projets.heroTag")}
            </span>
            <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
              {t("projets.heroTitle1")}{" "}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                {t("projets.heroTitle2")}
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-200/90 max-w-xl leading-relaxed font-medium">
              {t("projets.heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <button
                onClick={proposeProject}
                className="inline-flex items-center gap-2.5 h-12 px-6 rounded-xl bg-accent text-accent-foreground font-black text-sm hover:bg-accent-hover hover:-translate-y-0.5 shadow-[var(--shadow-gold)] transition-all cursor-pointer"
              >
                <Rocket className="h-4 w-4" /> {t("projets.proposeBtn")}
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className="inline-flex items-center gap-2.5 h-12 px-6 rounded-xl border border-white/25 bg-white/5 text-white font-bold text-sm hover:bg-white/15 backdrop-blur-md transition-all cursor-pointer"
              >
                <Mail className="h-4 w-4" /> {t("projets.contactBtn")}
              </button>
            </div>

            {/* Compact Glass Metrics Bar under buttons - 3-column single row layout */}
            <div className="mt-8 sm:mt-10 p-3 sm:p-5 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-md shadow-2xl grid grid-cols-3 gap-1.5 sm:gap-4 items-center w-full">
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                <div className="h-8 w-8 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-black shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <Building2 className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-2xl font-black font-heading text-amber-400 leading-none drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)] whitespace-nowrap">
                    <AnimatedStatNumber value={45} prefix="+" />
                  </div>
                  <div className="text-[9px] sm:text-xs text-slate-200 font-medium sm:font-bold mt-0.5 sm:mt-1 leading-tight">
                    {t("projets.partnersCount")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 border-l border-white/15 pl-1.5 sm:pl-4 min-w-0">
                <div className="h-8 w-8 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-black shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <Rocket className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-2xl font-black font-heading text-amber-400 leading-none drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)] whitespace-nowrap">
                    <AnimatedStatNumber value={90} prefix="+" />
                  </div>
                  <div className="text-[9px] sm:text-xs text-slate-200 font-medium sm:font-bold mt-0.5 sm:mt-1 leading-tight">
                    {t("projets.deployedCount")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 border-l border-white/15 pl-1.5 sm:pl-4 min-w-0">
                <div className="h-8 w-8 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-black shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <Star className="h-4 w-4 sm:h-5.5 sm:w-5.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-2xl font-black font-heading text-amber-400 leading-none drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)] whitespace-nowrap">
                    <AnimatedStatNumber value={99.4} suffix="%" decimals={1} />
                  </div>
                  <div className="text-[9px] sm:text-xs text-slate-200 font-medium sm:font-bold mt-0.5 sm:mt-1 leading-tight">
                    {t("projets.satisfactionRate")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REALISATIONS */}
      <section
        ref={projectsSectionRef}
        id="projets-realises"
        className="bg-[#F3EEFE] dark:bg-slate-950 border-y border-purple-200/50 dark:border-slate-800 py-20 md:py-24 relative overflow-hidden transition-colors duration-300"
      >
        {/* Background Soft Glow Bulbs */}
        <div className="absolute top-10 -left-20 w-[35rem] h-[35rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-20 w-[35rem] h-[35rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Background Decorative Icons */}
        <div className="hidden lg:flex absolute top-20 left-10 items-center justify-center h-20 w-20 rounded-full bg-white/90 dark:bg-slate-900/90 border border-purple-200/70 dark:border-purple-900/50 shadow-xl backdrop-blur-md pointer-events-none z-0">
          <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#8C52FF] flex items-center justify-center">
            <FolderKanban className="h-6 w-6 text-[#8C52FF]" />
          </div>
        </div>

        <div className="hidden lg:flex absolute top-20 right-10 items-center justify-center h-20 w-20 rounded-full bg-white/90 dark:bg-slate-900/90 border border-amber-200/70 dark:border-amber-900/50 shadow-xl backdrop-blur-md pointer-events-none z-0">
          <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-amber-500" />
          </div>
        </div>

        {/* Background Micro Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="uppercase tracking-wider">{t("projets.caseStudiesTag")}</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t("projets.ourRealizations")}{" "}
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
                {t("projets.realized")}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              {t("projets.selectionDesc")}
            </p>

            {/* Impact Metric Floating Widget Bar */}
            <div className="pt-3 max-w-3xl mx-auto w-full">
              <div className="relative p-3 sm:p-5 rounded-3xl bg-white/90 dark:bg-[#130B29] border border-purple-200/80 dark:border-purple-500/40 backdrop-blur-xl shadow-xl shadow-purple-500/10 dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)] grid grid-cols-3 gap-2 sm:gap-4 items-stretch overflow-hidden w-full">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 dark:via-amber-400/80 to-transparent opacity-80 pointer-events-none" />

                {/* Item 1 */}
                <div className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 px-1 sm:px-3 py-1 min-w-0 h-full">
                  <div className="h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-400/40 text-purple-700 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                    <Rocket className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0 w-full">
                    <span className="font-heading text-xs sm:text-2xl font-black text-purple-900 dark:text-amber-400 leading-tight">
                      <AnimatedStatNumber value={REALISATIONS.length} prefix="+" />
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight mt-0.5 text-center">
                      {t("projets.certifiedProjects")}
                    </span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 px-1 sm:px-3 py-1 border-l border-purple-200 dark:border-purple-500/30 min-w-0 h-full">
                  <div className="h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-400/40 text-purple-700 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0 w-full">
                    <span className="font-heading text-xs sm:text-2xl font-black text-purple-900 dark:text-amber-400 leading-tight">
                      <AnimatedStatNumber value={100} suffix="%" />
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight mt-0.5 text-center">
                      {t("projets.tailoredDelivered")}
                    </span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 px-1 sm:px-3 py-1 border-l border-purple-200 dark:border-purple-500/30 min-w-0 h-full">
                  <div className="h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-400/40 text-purple-700 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                    <Layers className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-0 w-full">
                    <span className="font-heading text-xs sm:text-2xl font-black text-purple-900 dark:text-amber-400 leading-tight">
                      Multi-Stack
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight mt-0.5 text-center">
                      {t("projets.multiStack")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Header Control Panel - High density & responsive layout */}
          <div className="rounded-3xl border border-purple-200/80 dark:border-purple-500/35 bg-white/95 dark:bg-[#180E30] backdrop-blur-xl p-4 sm:p-6 shadow-xl shadow-purple-500/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden mb-10">
            {/* Top Gold Shimmer Ray */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 dark:via-amber-400/80 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Top Row: Search input + Actions bar */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 w-full">
                {/* Search Input */}
                <div className="relative flex-1 group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#8042F6] to-[#6E2FE0] text-white font-bold shadow-md shadow-purple-500/25 pointer-events-none z-10 transition-transform group-focus-within:scale-105">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      language === "en"
                        ? "Search a project by keyword, tech, or partner..."
                        : "Rechercher un projet par mot-clé, techno ou partenaire..."
                    }
                    className="w-full h-11 sm:h-13 rounded-2xl border border-purple-200 dark:border-purple-500/35 bg-purple-50/40 dark:bg-[#120924] pl-13 sm:pl-16 pr-12 sm:pr-14 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:border-[#8042F6] dark:focus:border-purple-400 focus:ring-4 focus:ring-[#8042F6]/20 focus:bg-white dark:focus:bg-[#120924] shadow-2xs transition-all text-left"
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title={language === "en" ? "Clear search" : "Effacer la recherche"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 pointer-events-none text-[11px] font-bold text-slate-500 dark:text-slate-300 bg-slate-200/80 dark:bg-purple-900/50 px-2 py-0.5 rounded-md border border-slate-300/60 dark:border-purple-500/30">
                      <span>⌘K</span>
                    </div>
                  )}
                </div>

                {/* Right side controls: Result counter, filter toggle & reset */}
                <div className="grid grid-cols-2 sm:flex items-center justify-between lg:justify-end gap-2.5 shrink-0 w-full lg:w-auto">
                  {/* Results badge */}
                  <span className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2.5 rounded-2xl bg-purple-50/90 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-500/30 shadow-2xs text-xs font-bold text-slate-700 dark:text-slate-200 w-full sm:w-auto">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {language === "en" ? "Showing:" : "Affichage :"}
                    </span>
                    <strong className="text-[#8042F6] dark:text-amber-400 font-black text-sm">
                      {filteredList.length}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      {language === "en"
                        ? filteredList.length > 1
                          ? "projects"
                          : "project"
                        : filteredList.length > 1
                          ? "projets"
                          : "projet"}
                    </span>
                  </span>

                  {/* Filter toggle button */}
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl border border-purple-200/80 dark:border-purple-500/35 bg-white dark:bg-[#160D2E] text-xs font-extrabold text-slate-800 dark:text-slate-100 shadow-2xs hover:border-[#8042F6] dark:hover:border-purple-400 transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#8042F6] dark:text-purple-400 shrink-0" />
                    <span className="truncate">
                      {filtersOpen
                        ? language === "en"
                          ? "Hide filters"
                          : "Masquer les filtres"
                        : language === "en"
                          ? "Filter domain"
                          : "Filtrer domaine"}
                    </span>
                    {filter !== "Tous" && (
                      <span className="ml-0.5 text-[10px] font-bold text-white bg-[#8042F6] px-1.5 py-0.5 rounded-full truncate max-w-[60px]">
                        {translateDomain(filter, language)}
                      </span>
                    )}
                  </button>

                  {/* Reset button if active filters or query */}
                  {(filter !== "Tous" || searchQuery) && (
                    <button
                      onClick={() => {
                        setFilter("Tous");
                        setSearchQuery("");
                      }}
                      className="col-span-2 sm:col-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-100/80 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800/60 transition-all cursor-pointer text-xs font-bold border border-purple-300/80 dark:border-purple-500/40 shadow-2xs w-full sm:w-auto"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>{language === "en" ? "Reset" : "Réinitialiser"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row: Category Filter Pills Bar */}
              {filtersOpen && (
                <div className="pt-3 border-t border-purple-100 dark:border-purple-900/40 animate-in fade-in duration-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#8042F6] dark:text-purple-400 uppercase tracking-wider px-1">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-[#8042F6] dark:text-purple-400" />
                      <span>
                        {language === "en"
                          ? "Filter by area of expertise:"
                          : "Filtrer par domaine d'expertise :"}
                      </span>
                    </div>
                    {filter !== "Tous" && (
                      <span className="text-[11px] font-bold text-white bg-[#8042F6] px-2.5 py-0.5 rounded-full border border-purple-400/30">
                        {language === "en" ? "Active:" : "Actif :"}{" "}
                        {translateDomain(filter, language)}
                      </span>
                    )}
                  </div>

                  {/* Domain pills grid/wrap */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 p-2 rounded-2xl bg-purple-50/50 dark:bg-[#120924]/80 border border-purple-100 dark:border-purple-500/20">
                    {DOMAIN_FILTERS.map((d) => {
                      const active = filter === d;
                      const count = getDomainCount(d);
                      return (
                        <button
                          key={d}
                          onClick={() => setFilter(d)}
                          className={
                            "group h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 border select-none whitespace-nowrap shrink-0 " +
                            (active
                              ? "bg-[#8C52FF] text-white border-transparent shadow-[0_4px_15px_rgba(140,82,255,0.35)] scale-[1.02]"
                              : "bg-white dark:bg-[#160D2E] text-slate-700 dark:text-slate-200 border-purple-200/80 dark:border-purple-500/30 hover:border-[#8C52FF] dark:hover:border-purple-400 hover:text-[#8C52FF] dark:hover:text-purple-300 hover:shadow-2xs")
                          }
                        >
                          <span
                            className={
                              active
                                ? "text-white shrink-0"
                                : "text-[#8C52FF] dark:text-purple-400 group-hover:text-[#8C52FF] dark:group-hover:text-purple-300 transition-colors shrink-0"
                            }
                          >
                            {DOMAIN_ICONS[d]}
                          </span>
                          <span>{translateDomain(d, language)}</span>
                          <span
                            className={
                              "min-w-[20px] h-[20px] px-1.5 inline-flex items-center justify-center rounded-md text-[10px] font-extrabold transition-all shrink-0 " +
                              (active
                                ? "bg-white/25 text-white border border-white/20"
                                : "bg-slate-100 dark:bg-purple-900/50 text-slate-600 dark:text-purple-200 border border-slate-200 dark:border-purple-800/40")
                            }
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects Cards Grid */}
          {filteredList.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-purple-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-sm">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-purple-100 dark:bg-amber-400/10 border border-purple-200 dark:border-amber-400/20 flex items-center justify-center text-[#8C52FF] dark:text-amber-500 mb-4 shadow-sm">
                <SearchX className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                {language === "en"
                  ? "No projects match your search"
                  : "Aucun projet ne correspond à votre recherche"}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto">
                {language === "en"
                  ? "Try modifying your keywords or selecting another area of expertise."
                  : "Essayez de modifier vos mots-clés de recherche ou de sélectionner un autre domaine d'expertise."}
              </p>
              <button
                onClick={() => {
                  setFilter("Tous");
                  setSearchQuery("");
                }}
                className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#8C52FF] text-white font-extrabold text-xs shadow-md shadow-purple-500/25 hover:bg-purple-700 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <RefreshCw className="h-4 w-4" />
                {language === "en" ? "View all projects" : "Voir tous les projets"}
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {(showAllProjects ? filteredList : filteredList.slice(0, 3)).map((p) => (
                  <article
                    key={p.slug}
                    onClick={() => {
                      requireAuth(() => {
                        setSelected(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      });
                    }}
                    className="group relative rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between animate-in fade-in duration-300"
                  >
                    <div>
                      {/* Image header with domain badge */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 sm:gap-2 z-10">
                          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tight rounded-full bg-white/95 dark:bg-slate-900/95 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80 backdrop-blur-md shadow-xs inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0">
                            <span className="shrink-0">{DOMAIN_ICONS[p.domain]}</span>
                            <span className="whitespace-nowrap">
                              {translateDomain(p.domain, language)}
                            </span>
                          </span>
                          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black rounded-full bg-amber-400 text-slate-950 shadow-xs inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                            {language === "en" ? "Genove Certified" : "Certifié Genove"}
                          </span>
                        </div>

                        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-bold text-white z-10">
                          <span className="inline-flex items-center gap-1.5 bg-slate-950/80 px-3 py-1 rounded-xl border border-white/15 backdrop-blur-md shadow-xs">
                            <Building2 className="h-3.5 w-3.5 text-amber-400" /> {p.partner}
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-slate-950/80 px-3 py-1 rounded-xl border border-white/15 backdrop-blur-md text-slate-200 shadow-xs">
                            <Calendar className="h-3.5 w-3.5 text-amber-400/80" /> {p.date}
                          </span>
                        </div>
                      </div>

                      {/* Body content */}
                      <div className="p-6">
                        <h3 className="font-heading text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-[#8C52FF] dark:group-hover:text-amber-400 transition-colors leading-snug">
                          {p.name}
                        </h3>
                        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-3">
                          {p.summary}
                        </p>

                        {/* Key Impact Benefit */}
                        {p.benefits && p.benefits.length > 0 && (
                          <div className="mt-4 p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <div className="h-6 w-6 rounded-lg bg-[#8C52FF]/10 text-[#8C52FF] dark:bg-amber-400/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <span className="truncate text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                              <strong className="text-slate-900 dark:text-white font-bold">
                                {language === "en" ? "Impact:" : "Impact :"}
                              </strong>{" "}
                              {p.benefits[0]}
                            </span>
                          </div>
                        )}

                        {/* Tech stack tags */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {p.tech.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border border-slate-200/80 dark:border-slate-700"
                            >
                              {t}
                            </span>
                          ))}
                          {p.tech.length > 4 && (
                            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border border-slate-200/80 dark:border-slate-700">
                              +{p.tech.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer action */}
                    <div className="px-6 pb-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-[#8C52FF] dark:text-amber-400 group-hover:text-purple-700 dark:group-hover:text-amber-300 transition-colors">
                      <span className="inline-flex items-center gap-1.5">
                        <span>
                          {language === "en" ? "View case study" : "Consulter l'étude de cas"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-[#8C52FF] dark:group-hover:text-amber-400">
                        {language === "en" ? "Details →" : "Détails →"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Toggle reveal button for projects */}
              {filteredList.length > 3 && (
                <div className="mt-10 flex flex-col items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (showAllProjects) {
                        setShowAllProjects(false);
                        projectsSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      } else {
                        setShowAllProjects(true);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl border border-purple-200 dark:border-purple-500/35 bg-white dark:bg-[#160D2E] text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 shadow-md hover:border-[#8C52FF] dark:hover:border-purple-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group select-none"
                  >
                    <Sparkles className="h-4.5 w-4.5 text-[#8C52FF] dark:text-purple-400 group-hover:rotate-12 transition-transform" />
                    <span>{showAllProjects ? "Voir moins" : "Voir plus"}</span>
                    <ChevronDown
                      className={
                        "h-4.5 w-4.5 text-[#8C52FF] dark:text-purple-400 transition-transform duration-300 " +
                        (showAllProjects ? "rotate-180" : "")
                      }
                    />
                  </button>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {showAllProjects
                      ? language === "en"
                        ? `All ${filteredList.length} projects displayed`
                        : `Tous les ${filteredList.length} projets affichés`
                      : language === "en"
                        ? `Click to view all other projects (${filteredList.length} total)`
                        : `Voir les autres projets (${filteredList.length} projets au total)`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* PARTNERS */}
      <PartnersShowcase />

      {/* STATS */}
      <section
        id="stats-section"
        className="relative overflow-hidden bg-[#180E30] py-16 md:py-24 border-y border-purple-500/30 shadow-2xl"
      >
        {/* Background Soft Glow Bulbs */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_50%,#8C52FF35,transparent_50%),radial-gradient(circle_at_80%_50%,#FBBF2425,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400 backdrop-blur-md shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{language === "en" ? "Key Figures" : "Quelques chiffres"}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {language === "en"
                ? "The Genove impact at a glance"
                : "L'impact Genove en un coup d'œil"}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {getLocalizedStats(language).map((s, idx) => (
              <div key={s.label} className={idx === 4 ? "col-span-2 sm:col-span-1" : ""}>
                <StatCard
                  target={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  label={s.label}
                  icon={s.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS EXPERTISE */}
      <DomainesExpertiseSection
        onSelectDomain={(d) => {
          setFilter(d as Domain);
          const el = document.getElementById("projets-realises");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* METHOD */}
      <NotreMethodeSection />

      {/* TESTIMONIALS */}
      <TemoignagesSection />

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#070F24] text-white py-20 md:py-24 border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(212,168,58,0.25),transparent_50%)]" />
        <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/10">
            <Send className="h-3 w-3 text-[#D4A83A]" />{" "}
            {language === "en" ? "Let's build together" : "Construisons ensemble"}
          </span>
          <h2 className="mt-5 font-heading text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {language === "en" ? (
              <>
                Have an <span className="whitespace-nowrap">ambitious project?</span>
                <br className="hidden md:block" />
                <span className="text-[#D4A83A]">Let's talk.</span>
              </>
            ) : (
              <>
                Vous avez un <span className="whitespace-nowrap">projet ambitieux&nbsp;?</span>
                <br className="hidden md:block" />
                <span className="text-[#D4A83A]">Parlons-en.</span>
              </>
            )}
          </h2>
          <p className="mt-5 text-base text-slate-300 font-medium max-w-2xl mx-auto">
            {language === "en"
              ? "Entrust us with your needs. Our teams will get back to you within 48h with an initial reading and scoping proposal."
              : "Confiez-nous votre besoin. Nos équipes reviennent vers vous sous 48h avec une première lecture et une proposition de cadrage."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={proposeProject}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent-hover hover:-translate-y-0.5 shadow-[var(--shadow-gold)] transition-all cursor-pointer"
            >
              <Rocket className="h-4 w-4" />{" "}
              {language === "en" ? "Propose a project" : "Proposer un projet"}
            </button>
            <button
              onClick={() => setIsContactOpen(true)}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-all cursor-pointer"
            >
              <Mail className="h-4 w-4" /> {language === "en" ? "Contact us" : "Nous contacter"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}

/* --------------------------------------------------------------- Bits --- */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground font-semibold">{label}</span>
      <span className="text-foreground text-right truncate">{value}</span>
    </div>
  );
}

function StatCard({
  target,
  prefix = "+",
  suffix = "",
  label,
  icon: Icon,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.2 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const n = useCounter(target, seen);

  return (
    <div
      ref={ref}
      className="group relative rounded-3xl bg-[#180E30]/90 border border-purple-500/35 backdrop-blur-xl p-5 sm:p-6 hover:border-amber-400/60 hover:bg-[#180E30] hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center overflow-hidden h-full min-h-[160px]"
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl group-hover:bg-amber-400/20 transition-colors pointer-events-none" />

      {Icon && (
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 group-hover:text-amber-300 transition-all duration-300 shadow-md shrink-0">
          <Icon className="h-5.5 w-5.5 stroke-[2.2]" />
        </div>
      )}
      <div className="font-heading text-3xl sm:text-4xl lg:text-4xl font-black text-amber-400 group-hover:text-amber-300 tracking-tight leading-none whitespace-nowrap flex items-center justify-center">
        <span>{prefix}</span>
        <span>{n.toLocaleString("fr-FR")}</span>
        {suffix && <span>{suffix}</span>}
      </div>
      <div className="mt-2.5 text-xs font-bold text-slate-200/90 group-hover:text-white transition-colors uppercase tracking-wider leading-tight">
        {label}
      </div>
    </div>
  );
}

function PartnersShowcase() {
  const { language } = useLanguage();
  const [partnerCategory, setPartnerCategory] = useState<string>("Tous");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoriesRaw = [
    { key: "Tous", fr: "Tous", en: "All" },
    { key: "Finance & Banque", fr: "Finance & Banque", en: "Finance & Banking" },
    { key: "Santé & Éducation", fr: "Santé & Éducation", en: "Health & Education" },
    { key: "Énergie & Industrie", fr: "Énergie & Industrie", en: "Energy & Industry" },
    { key: "Culture, Retail & Tech", fr: "Culture, Retail & Tech", en: "Culture, Retail & Tech" },
  ];

  const partnerItems = getLocalizedPartnerItems(language);

  const filtered = partnerItems.filter(
    (p) => partnerCategory === "Tous" || p.category === partnerCategory,
  );

  return (
    <section className="bg-[#F3EEFE] dark:bg-slate-950 border-y border-purple-200/50 dark:border-slate-800 py-20 md:py-24 relative overflow-hidden transition-colors duration-300">
      {/* Background Soft Glow Bulbs */}
      <div className="absolute top-10 -left-20 w-[35rem] h-[35rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 -right-20 w-[35rem] h-[35rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Background Icons */}
      <div className="hidden lg:flex absolute top-20 left-10 items-center justify-center h-20 w-20 rounded-full bg-white/90 dark:bg-slate-900/90 border border-purple-200/70 dark:border-purple-900/50 shadow-xl backdrop-blur-md pointer-events-none z-0">
        <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#8C52FF] flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-[#8C52FF]" />
        </div>
      </div>

      <div className="hidden lg:flex absolute top-20 right-10 items-center justify-center h-20 w-20 rounded-full bg-white/90 dark:bg-slate-900/90 border border-amber-200/70 dark:border-amber-900/50 shadow-xl backdrop-blur-md pointer-events-none z-0">
        <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
          <Handshake className="h-6 w-6 text-amber-500" />
        </div>
      </div>

      {/* Background Micro Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="uppercase tracking-wider">
              {language === "en"
                ? "ECOSYSTEM & STRATEGIC ALLIANCE"
                : "Écosystème & Alliance Stratégique"}
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {language === "en" ? "Our Partners " : "Nos Partenaires "}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
              {language === "en" ? "of Excellence" : "d'Excellence"}
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
            <strong className="text-[#8C52FF] dark:text-purple-400 font-black">Genove</strong>{" "}
            {language === "en"
              ? "collaborates with leading institutions, industrial groups, and tech leaders to co-build the "
              : "collabore avec les plus grandes institutions, groupes industriels et acteurs technologiques pour co-construire l'"}
            <strong className="text-purple-700 dark:text-purple-300 font-extrabold">
              {language === "en" ? "future" : "avenir"}
            </strong>{" "}
            {language === "en" ? "and lead high-impact " : "et piloter des projets d'"}
            <strong className="text-purple-700 dark:text-purple-300 font-extrabold">
              {language === "en" ? "innovation" : "innovation"}
            </strong>{" "}
            {language === "en" ? "projects." : "à fort impact."}
          </p>

          {/* Impact Metric Floating Widget Bar */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="relative p-3.5 sm:p-4 rounded-3xl bg-[#180E30] border border-purple-500/35 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-2 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-60 pointer-events-none" />

              {/* Item 1 */}
              <div className="flex items-center gap-3 px-4 py-1">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 block leading-none">
                    +50
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                    {language === "en" ? "Partner Organizations" : "Organisations Partenaires"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-8 w-[1px] bg-purple-500/30" />

              {/* Item 2 */}
              <div className="flex items-center gap-3 px-4 py-1">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 block leading-none">
                    100%
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                    {language === "en" ? "Supported Projects" : "Projets Accompagnés"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-8 w-[1px] bg-purple-500/30" />

              {/* Item 3 */}
              <div className="flex items-center gap-3 px-4 py-1">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="font-heading text-lg sm:text-xl font-black text-amber-400 block leading-none">
                    {language === "en" ? "Multi-sector" : "Multi-sectoriel"}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                    {language === "en" ? "Activities & Expertise" : "Activités & Expertises"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-2xl border border-purple-200/80 dark:border-purple-500/35 bg-white dark:bg-[#160D2E] text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 shadow-xs hover:border-[#8042F6] dark:hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#8042F6] dark:text-purple-400" />
            <span>
              {filtersOpen
                ? language === "en"
                  ? "Hide filters"
                  : "Masquer les filtres"
                : language === "en"
                  ? "Show filters"
                  : "Afficher les filtres"}
            </span>
            {partnerCategory !== "Tous" && !filtersOpen && (
              <span className="ml-1 text-xs font-bold text-white bg-[#8042F6] px-2.5 py-0.5 rounded-full">
                {categoriesRaw.find((c) => c.key === partnerCategory)?.[
                  language === "en" ? "en" : "fr"
                ] || partnerCategory}
              </span>
            )}
          </button>
        </div>

        {/* Category Filter Pills */}
        {filtersOpen && (
          <div className="mt-6 animate-in fade-in duration-200 max-w-4xl mx-auto p-4 rounded-2xl bg-purple-50/50 dark:bg-[#120924]/90 border border-purple-200/80 dark:border-purple-500/30 backdrop-blur-md flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 shadow-xs">
            {categoriesRaw.map((catObj) => {
              const catKey = catObj.key;
              const catLabel = language === "en" ? catObj.en : catObj.fr;
              const count =
                catKey === "Tous"
                  ? partnerItems.length
                  : partnerItems.filter((p) => p.category === catKey).length;
              const active = partnerCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setPartnerCategory(catKey)}
                  className={
                    "h-11 px-5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 border whitespace-nowrap shrink-0 select-none " +
                    (active
                      ? "bg-[#8C52FF] text-white border-purple-600 shadow-[0_6px_20px_rgba(140,82,255,0.35)] ring-2 ring-purple-500/30 scale-105"
                      : "bg-white dark:bg-[#160D2E] text-slate-700 dark:text-slate-200 border-purple-200/90 dark:border-purple-500/30 hover:border-[#8C52FF] dark:hover:border-purple-400 hover:text-[#8C52FF] dark:hover:text-white dark:hover:bg-purple-900/40 shadow-xs")
                  }
                >
                  <span className="whitespace-nowrap">{catLabel}</span>
                  <span
                    className={
                      "px-2.5 py-0.5 rounded-full text-xs font-black transition-colors shrink-0 whitespace-nowrap " +
                      (active
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 dark:bg-purple-900/40 text-slate-600 dark:text-purple-200")
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Partners Logo Cards Grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl p-4 sm:p-5 h-44 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden shadow-xs"
            >
              {/* Subtle brand color glow background on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-3xl"
                style={{ backgroundColor: p.brandColor }}
              />

              {/* Tag / Category Badge & Color Indicator Dot */}
              <div className="w-full flex items-center justify-between gap-2 z-10">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-slate-300 border border-purple-100 dark:border-slate-700 truncate max-w-[85%]">
                  {p.tag}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: p.brandColor }}
                />
              </div>

              {/* Brand Logo Container */}
              <div className="flex-1 flex items-center justify-center w-full px-1 py-2 transition-all duration-300 group-hover:scale-105 z-10">
                <div className="text-slate-900 dark:text-white transition-colors duration-300 flex items-center justify-center">
                  {p.logo}
                </div>
              </div>

              {/* Partner Name Subtitle */}
              <div className="w-full text-center z-10">
                <span className="text-xs font-black text-slate-700 dark:text-slate-200 group-hover:text-[#8C52FF] dark:group-hover:text-amber-400 transition-colors truncate block">
                  {p.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DomainesExpertiseSection({
  onSelectDomain,
}: {
  onSelectDomain?: (domain: string) => void;
}) {
  const { language } = useLanguage();
  const domains = getLocalizedDomains(language);
  const [showAllDomains, setShowAllDomains] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F3EEFE] dark:bg-slate-950 border-y border-purple-200/50 dark:border-slate-800 py-16 md:py-20 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background Soft Glow Bulbs */}
      <div className="absolute top-10 -left-20 w-[35rem] h-[35rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 -right-20 w-[35rem] h-[35rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Background Micro Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
            <Cpu className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="uppercase tracking-wider">
              {language === "en" ? "TECHNICAL CORE & EXPERTISE" : "Socle Technique & Expertises"}
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {language === "en" ? "What We " : "Ce que nous "}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
              {language === "en" ? "Master" : "maîtrisons"}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl mx-auto line-clamp-2">
            {language === "en"
              ? "A broad, high-level software engineering stack to design, build, and propel your projects from concept to production."
              : "Un socle large et de haut niveau d'ingénierie logicielle pour concevoir, développer et propulser vos projets de l'idée à la production."}
          </p>

          {/* Impact Metric Floating Widget Bar */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="relative p-3 sm:p-4 rounded-3xl bg-[#130B29] border border-purple-500/40 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-2 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-60 pointer-events-none" />

              {/* Item 1 */}
              <div className="flex items-center gap-3.5 px-3 py-1">
                <div className="h-11 w-11 rounded-full bg-purple-900/50 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <Cpu className="h-5.5 w-5.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 leading-tight">
                    8
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-300 leading-tight mt-0.5 whitespace-nowrap">
                    {language === "en" ? "Domains of Expertise" : "Domaines d'Expertise"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-9 w-[1px] bg-purple-500/30" />

              {/* Item 2 */}
              <div className="flex items-center gap-3.5 px-3 py-1">
                <div className="h-11 w-11 rounded-full bg-purple-900/50 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <Code2 className="h-5.5 w-5.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 leading-tight">
                    +30
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-300 leading-tight mt-0.5 whitespace-nowrap">
                    {language === "en" ? "Modern Techs & Cloud" : "Stack Moderne & Cloud"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-9 w-[1px] bg-purple-500/30" />

              {/* Item 3 */}
              <div className="flex items-center gap-3.5 px-3 py-1">
                <div className="h-11 w-11 rounded-full bg-purple-900/50 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="h-5.5 w-5.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 leading-tight">
                    100%
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-300 leading-tight mt-0.5 whitespace-nowrap">
                    {language === "en" ? "Tailored & Production" : "Sur-Mesure & Production"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Cards Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(showAllDomains ? domains : domains.slice(0, 4)).map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.name}
                onClick={() => onSelectDomain?.(d.name)}
                className="group relative rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden shadow-xs animate-in fade-in duration-300"
              >
                {/* Gold/Purple Ray Header Shimmer */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8C52FF] dark:via-amber-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Top row: Icon & Action pill */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[#8C52FF] dark:text-purple-300 flex items-center justify-center group-hover:bg-[#8C52FF] group-hover:text-white group-hover:border-[#8C52FF] group-hover:scale-110 shadow-xs transition-all duration-300">
                      <Icon className="h-6 w-6 stroke-[2.25]" />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[#8C52FF] dark:text-amber-400 font-extrabold text-xs inline-flex items-center gap-1">
                      {language === "en" ? "Explore" : "Explorer"}{" "}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#8C52FF] dark:group-hover:text-amber-400 transition-colors">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {d.desc}
                  </p>
                </div>

                {/* Tech Tags Pills */}
                <div className="mt-6 pt-4 border-t border-purple-100/70 dark:border-slate-800 flex flex-wrap gap-1.5">
                  {d.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 dark:bg-slate-800 text-purple-900 dark:text-slate-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 group-hover:text-[#8C52FF] dark:group-hover:text-amber-300 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle reveal button for domains */}
        {domains.length > 4 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (showAllDomains) {
                  setShowAllDomains(false);
                  sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  setShowAllDomains(true);
                }
              }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-2xl border border-purple-200 dark:border-purple-500/35 bg-white dark:bg-[#160D2E] text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 shadow-md hover:border-[#8C52FF] dark:hover:border-purple-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group select-none"
            >
              <Sparkles className="h-4 w-4 text-[#8C52FF] dark:text-purple-400 group-hover:rotate-12 transition-transform" />
              <span>{showAllDomains ? "Voir moins" : "Voir plus"}</span>
              <ChevronDown
                className={
                  "h-4 w-4 text-[#8C52FF] dark:text-purple-400 transition-transform duration-300 " +
                  (showAllDomains ? "rotate-180" : "")
                }
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function NotreMethodeSection() {
  const { language } = useLanguage();
  const methodSteps = getLocalizedMethodSteps(language);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F3EEFE] dark:bg-slate-950 border-y border-purple-200/50 dark:border-slate-800 py-16 md:py-20 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background Soft Glow Bulbs */}
      <div className="absolute top-10 -left-20 w-[35rem] h-[35rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 -right-20 w-[35rem] h-[35rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Background Micro Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
            <Workflow className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="uppercase tracking-wider">
              {language === "en" ? "AGILE & CERTIFIED PROCESS" : "Processus Agile & Certifié"}
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {language === "en" ? "A clear journey, " : "Un parcours clair, "}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
              {language === "en" ? "from concept to production" : "du concept à la production"}
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl mx-auto line-clamp-2">
            {language === "en"
              ? "A structured 7-step methodology ensuring complete transparency, constant agility, software quality, and strict milestone adherence."
              : "Une méthodologie structurée en 7 étapes garantissant transparence totale, agilité constante, qualité logicielle et respect rigoureux des jalons."}
          </p>

          {/* Toggle Reveal Button for Notre Methode */}
          <div className="pt-2 flex flex-col items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (isExpanded) {
                  setIsExpanded(false);
                  sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  setIsExpanded(true);
                }
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl border border-purple-200 dark:border-purple-500/35 bg-white dark:bg-[#160D2E] text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 shadow-md hover:border-[#8C52FF] dark:hover:border-purple-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group select-none"
            >
              <Sparkles className="h-4 w-4 text-[#8C52FF] dark:text-purple-400 group-hover:rotate-12 transition-transform" />
              <span>{isExpanded ? "Voir moins" : "Voir plus"}</span>
              <ChevronDown
                className={
                  "h-4 w-4 text-[#8C52FF] dark:text-purple-400 transition-transform duration-300 " +
                  (isExpanded ? "rotate-180" : "")
                }
              />
            </button>
          </div>
        </div>

        {/* Collapsed State: Sleek Summary Ribbon of 7 Steps */}
        {!isExpanded && (
          <div className="mt-8 max-w-5xl mx-auto p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#160D2E]/90 border border-purple-200/80 dark:border-purple-500/30 backdrop-blur-xl shadow-lg animate-in fade-in duration-300">
            <div className="text-center mb-3.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8C52FF] dark:text-purple-300">
                {language === "en"
                  ? "7-Step Methodology · Click step to explore"
                  : "Méthodologie en 7 Étapes · Cliquez pour explorer"}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {methodSteps.map((s, idx) => (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => {
                    setActiveStep(idx);
                    setIsExpanded(true);
                  }}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-50/80 dark:bg-purple-950/50 hover:bg-[#8C52FF] dark:hover:bg-[#8C52FF] border border-purple-200/80 dark:border-purple-800/60 hover:border-[#8C52FF] text-slate-800 dark:text-slate-100 hover:text-white transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5 select-none"
                >
                  <span className="w-6 h-6 rounded-xl bg-[#8C52FF] group-hover:bg-amber-400 text-white group-hover:text-slate-950 flex items-center justify-center text-xs font-black shrink-0 transition-colors">
                    {s.number}
                  </span>
                  <span className="text-xs sm:text-sm font-bold whitespace-nowrap">{s.title}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#8C52FF] group-hover:text-white shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expanded State: Full Timeline, Step Cards Grid & Guarantees */}
        {isExpanded && (
          <div className="mt-10 animate-in fade-in duration-300 space-y-12">
            {/* Impact Metric Floating Widget Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative p-3.5 sm:p-4 rounded-3xl bg-[#180E30] border border-purple-500/35 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-2 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-60 pointer-events-none" />

                {/* Item 1 */}
                <div className="flex items-center gap-3 px-4 py-1">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                    <Workflow className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 block leading-none">
                      {language === "en" ? "7 Phases" : "7 Phases"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                      {language === "en" ? "Full Structured Cycle" : "Cycle Complet & Structuré"}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block h-8 w-[1px] bg-purple-500/30" />

                {/* Item 2 */}
                <div className="flex items-center gap-3 px-4 py-1">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 block leading-none">
                      100%
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                      {language === "en" ? "Agility & Transparency" : "Agilité & Transparence"}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block h-8 w-[1px] bg-purple-500/30" />

                {/* Item 3 */}
                <div className="flex items-center gap-3 px-4 py-1">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-heading text-lg sm:text-xl font-black text-amber-400 block leading-none">
                      {language === "en" ? "Production" : "Production"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                      {language === "en"
                        ? "Quality & Continuous Support"
                        : "Qualité & Suivi Continu"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Connector Ribbon (Desktop) */}
            <div className="hidden lg:block relative max-w-6xl mx-auto px-6">
              <div className="absolute top-7 left-12 right-12 h-2.5 -translate-y-1/2 bg-gradient-to-r from-purple-600 via-amber-400 to-purple-700 rounded-full z-0 shadow-xs" />

              <div className="relative z-10 flex items-start justify-between">
                {methodSteps.map((s, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={s.number}
                      onClick={() => setActiveStep(activeStep === idx ? null : idx)}
                      onMouseEnter={() => setActiveStep(idx)}
                      className="group flex flex-col items-center cursor-pointer focus:outline-hidden relative z-10 py-1"
                    >
                      <div
                        className={
                          "h-14 w-14 rounded-full flex items-center justify-center font-heading font-black text-lg transition-all duration-300 ease-out shadow-lg " +
                          (isActive
                            ? "bg-[#8C52FF] text-white border-2 border-amber-300 scale-125 shadow-[0_0_25px_rgba(140,82,255,0.6)] ring-8 ring-purple-400/35"
                            : "bg-[#180E30] text-amber-300 border-2 border-purple-500/40 group-hover:bg-[#8C52FF] group-hover:text-white group-hover:border-amber-300 group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(140,82,255,0.6)] group-hover:ring-8 group-hover:ring-purple-400/35")
                        }
                      >
                        {s.number}
                      </div>

                      <div className="mt-3.5 transition-transform duration-300 origin-top group-hover:scale-110">
                        <span
                          className={
                            "text-xs sm:text-sm transition-all duration-300 block max-w-[130px] text-center leading-snug tracking-tight hyphens-none whitespace-normal " +
                            (isActive
                              ? "text-[#8C52FF] dark:text-amber-400 font-black scale-105"
                              : "text-slate-700 dark:text-slate-200 font-extrabold group-hover:text-[#8C52FF] dark:group-hover:text-amber-400 group-hover:font-black")
                          }
                        >
                          {s.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {methodSteps.map((s, i) => {
                const Icon = s.icon;
                const isActive = activeStep === i;
                return (
                  <div
                    key={s.number}
                    onClick={() => setActiveStep(activeStep === i ? null : i)}
                    onMouseEnter={() => setActiveStep(i)}
                    className={
                      "group relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur min-w-0 " +
                      (isActive
                        ? "border-[#8C52FF] bg-white dark:bg-purple-950/40 shadow-xl ring-2 ring-purple-500/40 -translate-y-2 scale-[1.02]"
                        : "border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg hover:-translate-y-1")
                    }
                  >
                    <div
                      className={
                        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-amber-400 to-indigo-600 transition-opacity duration-300 " +
                        (isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                      }
                    />

                    <div>
                      <div className="flex items-center justify-between gap-1.5">
                        <span
                          className={
                            "px-3 py-1 rounded-lg font-heading font-black text-xs sm:text-sm transition-all duration-300 " +
                            (isActive
                              ? "bg-[#8C52FF] text-white shadow-xs scale-105"
                              : "bg-purple-50 dark:bg-slate-800 text-purple-900 dark:text-slate-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 group-hover:text-[#8C52FF]")
                          }
                        >
                          {s.number}
                        </span>
                        <div
                          className={
                            "h-8.5 w-8.5 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 " +
                            (isActive
                              ? "bg-[#8C52FF] text-white shadow-md scale-110"
                              : "bg-purple-50 dark:bg-slate-800 text-[#8C52FF] dark:text-purple-300 group-hover:bg-[#8C52FF] group-hover:text-white")
                          }
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                      </div>

                      <div className="mt-3.5">
                        <span className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#8C52FF] dark:text-amber-400 block truncate">
                          {s.subtitle}
                        </span>
                        <h3 className="font-heading font-extrabold text-sm sm:text-base lg:text-[13.5px] xl:text-sm 2xl:text-base text-slate-900 dark:text-white mt-0.5 group-hover:text-[#8C52FF] dark:group-hover:text-amber-400 transition-colors leading-snug hyphens-none">
                          {s.title}
                        </h3>
                      </div>

                      <p className="mt-2.5 text-xs sm:text-[12.5px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {s.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-purple-100/70 dark:border-slate-800">
                      <span
                        className={
                          "inline-flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold w-full transition-colors leading-snug whitespace-normal break-normal " +
                          (isActive
                            ? "bg-[#8C52FF] text-white font-extrabold shadow-xs"
                            : "bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60")
                        }
                      >
                        <CheckCircle2
                          className={
                            "h-3.5 w-3.5 shrink-0 mt-0.5 " +
                            (isActive ? "text-white" : "text-emerald-500")
                          }
                        />
                        <span className="leading-snug">{s.deliverable}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Guarantees Footer Bar */}
            <div className="rounded-3xl bg-[#180E30] border border-purple-500/35 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Subtle top ambient glow line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-80" />

              <div className="grid gap-6 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-purple-500/30">
                {/* Guarantee Item 1 */}
                <div className="flex items-center gap-4 group transition-all duration-300 md:pr-6">
                  <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:bg-[#8C52FF] group-hover:text-white transition-all duration-300">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-black text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors">
                        {language === "en" ? "Responsive Scoping" : "Cadrage Réactif"}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
                        48-72h
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      {language === "en"
                        ? "Alignment workshops and estimation in 48-72h"
                        : "Ateliers d'alignement et chiffrage en 48-72h"}
                    </p>
                  </div>
                </div>

                {/* Guarantee Item 2 */}
                <div className="pt-6 md:pt-0 flex items-center gap-4 group transition-all duration-300 md:px-6">
                  <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:bg-[#8C52FF] group-hover:text-white transition-all duration-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-black text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors">
                        {language === "en" ? "14-Day Sprints" : "Sprints de 14 Jours"}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-500/25 text-purple-300 border border-purple-400/30">
                        Agile
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      {language === "en"
                        ? "Iterative deliverables & weekly live demos"
                        : "Livrables itératifs et démos hebdomadaires"}
                    </p>
                  </div>
                </div>

                {/* Guarantee Item 3 */}
                <div className="pt-6 md:pt-0 flex items-center gap-4 group transition-all duration-300 md:pl-6">
                  <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:bg-[#8C52FF] group-hover:text-white transition-all duration-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-black text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors">
                        {language === "en" ? "Zero Downtime" : "Zéro Interruption"}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        SLA 99.9%
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      {language === "en"
                        ? "Automated CI/CD deployment & SLA support"
                        : "Déploiement CI/CD automatisé & support SLA"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom collapse button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-white dark:bg-[#160D2E] text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:text-[#8C52FF] shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <span>Voir moins</span>
                <ChevronDown className="h-4 w-4 rotate-180 text-[#8C52FF]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TemoignagesSection() {
  const { language } = useLanguage();
  const testimonials = getLocalizedTestimonials(language);

  return (
    <section className="bg-[#F3EEFE] dark:bg-slate-950 border-y border-purple-200/50 dark:border-slate-800 py-20 md:py-24 relative overflow-hidden transition-colors duration-300">
      {/* Background Soft Glow Bulbs */}
      <div className="absolute top-10 -left-20 w-[35rem] h-[35rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 -right-20 w-[35rem] h-[35rem] bg-amber-400/20 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Background Icons */}
      <div className="hidden lg:flex absolute top-20 left-10 items-center justify-center h-20 w-20 rounded-full bg-white/90 dark:bg-slate-900/90 border border-purple-200/70 dark:border-purple-900/50 shadow-xl backdrop-blur-md pointer-events-none z-0">
        <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#8C52FF] flex items-center justify-center">
          <Quote className="h-6 w-6 text-[#8C52FF]" />
        </div>
      </div>

      <div className="hidden lg:flex absolute top-20 right-10 items-center justify-center h-20 w-20 rounded-full bg-white/90 dark:bg-slate-900/90 border border-amber-200/70 dark:border-amber-900/50 shadow-xl backdrop-blur-md pointer-events-none z-0">
        <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
          <Star className="h-6 w-6 text-amber-500 fill-amber-500/20" />
        </div>
      </div>

      {/* Background Micro Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
            <Quote className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="uppercase tracking-wider">
              {language === "en" ? "TESTIMONIALS & CLIENT IMPACT" : "Témoignages & Impact Client"}
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {language === "en" ? "What our " : "Ce que disent "}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
              {language === "en" ? "partners say" : "nos partenaires"}
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
            {language === "en"
              ? "Discover feedback from decision-makers and tech leaders who trust "
              : "Découvrez les retours d'expérience des décideurs et leaders technologiques qui font confiance à "}
            <strong className="text-purple-700 dark:text-purple-400 font-black">Genove</strong>{" "}
            {language === "en" ? "every day." : "au quotidien."}
          </p>

          {/* Impact Metric Floating Widget Bar */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="relative p-3.5 sm:p-4 rounded-3xl bg-[#180E30] border border-purple-500/35 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-2 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-60 pointer-events-none" />

              {/* Item 1 */}
              <div className="flex items-center gap-3 px-4 py-1">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 block leading-none">
                    100%
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                    {language === "en" ? "Client Satisfaction" : "Satisfaction Client"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-8 w-[1px] bg-purple-500/30" />

              {/* Item 2 */}
              <div className="flex items-center gap-3 px-4 py-1">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 block leading-none">
                    4.9 / 5
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                    {language === "en" ? "Certified Average Rating" : "Note Moyenne Certifiée"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-8 w-[1px] bg-purple-500/30" />

              {/* Item 3 */}
              <div className="flex items-center gap-3 px-4 py-1">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 border border-purple-400/40 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <Building2 className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="font-heading text-lg sm:text-xl font-black text-amber-400 block leading-none">
                    +50 Leaders
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 mt-1 block">
                    {language === "en" ? "Institutions & Groups" : "Institutions & Groupes"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="group relative rounded-3xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl p-7 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Gold/Purple Ray Header Shimmer */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8C52FF] dark:via-amber-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Quote Icon & Star Rating */}
                <div className="flex items-center justify-between gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[#8C52FF] dark:text-amber-300 flex items-center justify-center group-hover:bg-[#8C52FF] group-hover:text-white transition-all duration-300">
                    <Quote className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <blockquote className="mt-5 text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed italic">
                  « {t.quote} »
                </blockquote>
              </div>

              {/* Author & Organization Footer */}
              <div className="mt-6 pt-5 border-t border-purple-100/70 dark:border-slate-800 flex items-center gap-3">
                {/* Author Avatar / Badge */}
                <div className="h-11 w-11 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[#8C52FF] dark:text-amber-300 font-heading font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {t.avatar}
                </div>

                <figcaption className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-black text-sm text-slate-900 dark:text-white truncate">
                      {t.name}
                    </span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                    {t.role}
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
