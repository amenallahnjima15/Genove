import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Award,
  Users,
  X,
  ChevronRight,
  Play,
  Check,
  Download,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowLeft,
  Home,
  Sparkles,
  GraduationCap,
  BookOpen,
  Target,
  Rocket,
  Building2,
} from "lucide-react";
import { Footer } from "@/components/genove/Footer";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useLanguage } from "@/lib/language-context";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/catalogue")({
  validateSearch: (search: Record<string, unknown>): { course?: string; c?: string } => {
    return {
      course: typeof search.course === "string" ? search.course : undefined,
      c: typeof search.c === "string" ? search.c : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Catalogue de formations — Genove" },
      {
        name: "description",
        content:
          "Explorez les formations certifiantes Genove : IA, data, design, produit, management.",
      },
      { property: "og:title", content: "Catalogue de formations — Genove" },
      {
        property: "og:description",
        content: "Recherche sémantique et filtres avancés pour trouver la formation idéale.",
      },
    ],
  }),
  component: Catalogue,
});

interface Course {
  t: string;
  f: string;
  p: string;
  lvl: string;
  d: string;
  r: number;
  b: string;
  th: string;
  img: string;
}

interface Formateur {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  stats: {
    rating: number;
    students: number;
    courses: number;
  };
}

interface ProgramModule {
  title: string;
  d: string;
  desc: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface Review {
  name: string;
  date: string;
  rating: number;
  comment: string;
}

interface ResourceItem {
  name: string;
  size: string;
}

interface CourseDetails {
  d_weeks: string;
  students: string;
  price: string;
  progression: number;
  updatedAt: string;
  subtitle: string;
  reviewsCount: number;
  formateur: Formateur;
  description: string;
  objectifs: string[];
  prerequis: string[];
  competences: string[];
  technologies: string[];
  programme: ProgramModule[];
  faqs: FaqItem[];
  avis: Review[];
  resources: ResourceItem[];
}

const COURSES: Course[] = [
  {
    t: "Data Analyst — Parcours complet",
    f: "Amina Mansour",
    p: "BNP Paribas",
    lvl: "Intermédiaire",
    d: "48h",
    r: 4.8,
    b: "Populaire",
    th: "Data",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  {
    t: "Architecture RAG & Agents IA",
    f: "Yassine Ben Salah",
    p: "Sorbonne",
    lvl: "Avancé",
    d: "24h",
    r: 4.9,
    b: "Nouveau",
    th: "IA",
    img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
  },
  {
    t: "UX Research pour produits SaaS",
    f: "Mohamed Chaabane",
    p: "Orange",
    lvl: "Intermédiaire",
    d: "18h",
    r: 4.7,
    b: "Certifiant",
    th: "Design",
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=600&q=80",
  },
  {
    t: "Cloud Architect — AWS",
    f: "Nour Bouazizi",
    p: "Capgemini",
    lvl: "Avancé",
    d: "36h",
    r: 4.8,
    b: "Certifiant",
    th: "Data",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
  },
  {
    t: "Product Management B2B",
    f: "Nour Bouazizi",
    p: "L'Oréal",
    lvl: "Intermédiaire",
    d: "22h",
    r: 4.6,
    b: "Populaire",
    th: "Produit",
    img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
  },
  {
    t: "Design Systems avancé",
    f: "Mohamed Chaabane",
    p: "Total",
    lvl: "Avancé",
    d: "16h",
    r: 4.8,
    b: "Nouveau",
    th: "Design",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
  },
  {
    t: "Finance quantitative pour Data Scientists",
    f: "Amina Trabelsi",
    p: "BNP Paribas",
    lvl: "Avancé",
    d: "40h",
    r: 4.7,
    b: "Certifiant",
    th: "Data",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
  },
  {
    t: "Growth Marketing B2B",
    f: "Nour Bouazizi",
    p: "SaaS Academy",
    lvl: "Débutant",
    d: "12h",
    r: 4.5,
    b: "Populaire",
    th: "Management",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  },
  {
    t: "Prompt Engineering pratique",
    f: "Yassine Ben Salah",
    p: "Sorbonne",
    lvl: "Débutant",
    d: "8h",
    r: 4.9,
    b: "Nouveau",
    th: "IA",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
  },
];

const THEMES = ["IA", "Data", "Design", "Produit", "Management"];
const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];

function translateBadge(b: string, lang: string) {
  if (lang !== "en") return b;
  if (b === "Populaire") return "Popular";
  if (b === "Nouveau") return "New";
  if (b === "Certifiant") return "Certified";
  return b;
}

function translateLevel(lvl: string, lang: string) {
  if (lang !== "en") return lvl;
  if (lvl === "Débutant") return "Beginner";
  if (lvl === "Intermédiaire") return "Intermediate";
  if (lvl === "Avancé") return "Advanced";
  return lvl;
}

function translateTheme(th: string, lang: string) {
  if (lang !== "en") return th;
  if (th === "IA") return "AI";
  if (th === "Produit") return "Product";
  return th;
}

function translateCourseTitle(t: string, lang: string) {
  if (lang !== "en") return t;
  const map: Record<string, string> = {
    "Data Analyst — Parcours complet": "Data Analyst — Full Track",
    "Architecture RAG & Agents IA": "RAG Architecture & AI Agents",
    "UX Research pour produits SaaS": "UX Research for SaaS Products",
    "Cloud Architect — AWS": "Cloud Architect — AWS",
    "Product Management B2B": "B2B Product Management",
    "Design Systems avancé": "Advanced Design Systems",
    "Finance quantitative pour Data Scientists": "Quantitative Finance for Data Scientists",
    "Growth Marketing B2B": "B2B Growth Marketing",
    "Prompt Engineering pratique": "Practical Prompt Engineering",
  };
  return map[t] || t;
}

// High-fidelity custom specifications for courses to display on clicking them
const COURSE_DETAILS: Record<string, CourseDetails> = {
  "Data Analyst — Parcours complet": {
    d_weeks: "12 semaines",
    students: "1240",
    price: "2490 €",
    progression: 32,
    updatedAt: "2026-06-01",
    subtitle:
      "De SQL à la modélisation, tout ce qu'il faut pour devenir Data Analyst opérationnel.",
    reviewsCount: 342,
    formateur: {
      name: "Amina Mansour",
      role: "Lead Data Scientist · BNP Paribas",
      avatar: "AM",
      bio: "10 ans d'expérience en IA appliquée à la finance et à l'éducation.",
      stats: { rating: 4.9, students: 3200, courses: 12 },
    },
    description:
      "Ce parcours certifiant vous forme aux fondamentaux et outils avancés de l'analyse de données modernes. Vous apprenez à structurer, interroger, modéliser et visualiser des données pour prendre des décisions éclairées. Chaque module combine cours vidéo, ateliers pratiques et projets réels issus de nos entreprises partenaires.",
    objectifs: [
      "Maîtriser SQL avancé et la modélisation dimensionnelle",
      "Utiliser Python (Pandas, NumPy) pour l'analyse exploratoire",
      "Construire des dashboards professionnels avec Looker & Metabase",
      "Communiquer les insights aux parties prenantes",
    ],
    prerequis: ["Notions de statistiques descriptives", "Bases en tableur (Excel/Google Sheets)"],
    competences: ["SQL", "Python", "Dataviz", "Modélisation", "Storytelling"],
    technologies: ["PostgreSQL", "Python", "Pandas", "Looker", "dbt", "Metabase"],
    programme: [
      {
        title: "Fondamentaux SQL",
        d: "2 sem. · 14 leçons",
        desc: "SELECT, JOIN, agrégations, sous-requêtes, CTE.",
      },
      {
        title: "Modélisation & data warehouse",
        d: "2 sem. · 12 leçons",
        desc: "Star schema, snowflake, dbt et bonnes pratiques.",
      },
      {
        title: "Python pour l'analyse",
        d: "3 sem. · 18 leçons",
        desc: "Pandas, NumPy, notebooks, nettoyage de données.",
      },
      {
        title: "Dataviz & dashboards",
        d: "2 sem. · 10 leçons",
        desc: "Grammaire visuelle, Looker Studio, Metabase.",
      },
      {
        title: "Statistiques appliquées",
        d: "2 sem. · 12 leçons",
        desc: "Tests, corrélations, régression linéaire.",
      },
      {
        title: "Projet capstone",
        d: "1 sem. · 4 leçons",
        desc: "Un cas réel de bout en bout, mentoré.",
      },
    ],
    faqs: [
      {
        q: "Faut-il coder avant de commencer ?",
        a: "Non, le module 1 reprend les bases nécessaires.",
      },
      {
        q: "La certification est-elle reconnue ?",
        a: "Oui, notre certification est reconnue par nos entreprises partenaires et atteste de vos compétences pratiques.",
      },
      {
        q: "Puis-je suivre à mon rythme ?",
        a: "Absolument. Les cours sont accessibles en ligne 24/7 pour s'adapter au mieux à vos contraintes.",
      },
    ],
    avis: [
      {
        name: "Chaima M.",
        date: "2026-05-12",
        rating: 5,
        comment: "Formation dense mais très bien encadrée. Les projets sont concrets.",
      },
      {
        name: "Yassine B.",
        date: "2026-04-30",
        rating: 5,
        comment: "J'ai décroché un poste 3 semaines après la fin.",
      },
      {
        name: "Nesrine T.",
        date: "2026-04-02",
        rating: 4,
        comment: "Excellent contenu, quelques modules à approfondir.",
      },
    ],
    resources: [
      { name: "Programme détaillé.pdf", size: "480 KB" },
      { name: "Syllabus Data Analyst.pdf", size: "1.2 MB" },
      { name: "Étude de cas BNP.pdf", size: "820 KB" },
    ],
  },
  "Architecture RAG & Agents IA": {
    d_weeks: "6 semaines",
    students: "850",
    price: "1890 €",
    progression: 15,
    updatedAt: "2026-06-15",
    subtitle: "Maîtrisez la conception de systèmes RAG avancés et l'orchestration multi-agents.",
    reviewsCount: 120,
    formateur: {
      name: "Yassine Ben Salah",
      role: "Expert IA & CTO · Sorbonne",
      avatar: "YS",
      bio: "Chercheur en traitement automatique du langage naturel et concepteur d'architectures cognitives.",
      stats: { rating: 4.9, students: 1800, courses: 6 },
    },
    description:
      "Ce parcours intensif vous guide dans l'intégration des modèles de langage de dernière génération. Vous apprendrez à concevoir des pipelines RAG performants, de l'indexation vectorielle avancée à l'orchestration d'agents autonomes.",
    objectifs: [
      "Concevoir des pipelines de chunking et vectorisation avancés",
      "Implémenter des mécanismes de ré-ordonnancement (reranking)",
      "Orchestrer des systèmes multi-agents avec LangChain ou Autogen",
      "Évaluer la fidélité et la précision des réponses générées",
    ],
    prerequis: ["Excellente maîtrise de Python", "Bases en Machine Learning et APIs d'IA"],
    competences: ["RAG", "Embeddings", "Multi-agents", "Vecteurs", "Python"],
    technologies: ["Python", "LangChain", "Pinecone", "OpenAI", "LlamaIndex", "HuggingFace"],
    programme: [
      {
        title: "Introduction aux LLMs & API",
        d: "1 sem. · 8 leçons",
        desc: "Principes fondamentaux des transformers, gestion de contextes.",
      },
      {
        title: "Indexation vectorielle",
        d: "1 sem. · 10 leçons",
        desc: "Chunking, bases de données de vecteurs, plongements sémantiques.",
      },
      {
        title: "Retrieval & Reranking",
        d: "1 sem. · 12 leçons",
        desc: "Algorithmes de recherche hybride et filtrage de pertinence.",
      },
      {
        title: "Orchestration multi-agents",
        d: "2 sem. · 14 leçons",
        desc: "Routage d'intentions, agents de synthèse, boucles de rétroaction.",
      },
      {
        title: "Évaluation & Déploiement",
        d: "1 sem. · 6 leçons",
        desc: "RAGAs, monitoring de coûts, latence et garde-fous de sécurité.",
      },
    ],
    faqs: [
      {
        q: "Quel est le niveau requis en Python ?",
        a: "Un niveau intermédiaire/avancé est recommandé pour suivre le code sans difficulté.",
      },
      {
        q: "Quelles clés d'API sont fournies ?",
        a: "Genove fournit des crédits d'accès gratuits aux modèles phares pour vos projets d'ateliers.",
      },
    ],
    avis: [
      {
        name: "Mehdi K.",
        date: "2026-06-20",
        rating: 5,
        comment:
          "Le meilleur cours sur le RAG. Les cas pratiques multi-agents sont d'une utilité folle.",
      },
    ],
    resources: [{ name: "Syllabus RAG & Agents.pdf", size: "950 KB" }],
  },
};

const COURSE_DETAILS_EN: Record<string, CourseDetails> = {
  "Data Analyst — Parcours complet": {
    d_weeks: "12 weeks",
    students: "1,240",
    price: "€2,490",
    progression: 32,
    updatedAt: "2026-06-01",
    subtitle: "From SQL to modeling, everything you need to become an operational Data Analyst.",
    reviewsCount: 342,
    formateur: {
      name: "Amina Mansour",
      role: "Lead Data Scientist · BNP Paribas",
      avatar: "AM",
      bio: "10 years of experience in AI applied to finance and education.",
      stats: { rating: 4.9, students: 3200, courses: 12 },
    },
    description:
      "This certified track trains you in the fundamentals and advanced tools of modern data analysis. You learn to structure, query, model, and visualize data to make informed decisions. Each module combines video lectures, hands-on workshops, and real-world projects from our corporate partners.",
    objectifs: [
      "Master advanced SQL and dimensional modeling",
      "Use Python (Pandas, NumPy) for exploratory data analysis",
      "Build professional dashboards with Looker & Metabase",
      "Communicate insights effectively to business stakeholders",
    ],
    prerequis: [
      "Notions of descriptive statistics",
      "Spreadsheet fundamentals (Excel/Google Sheets)",
    ],
    competences: ["SQL", "Python", "Dataviz", "Modeling", "Storytelling"],
    technologies: ["PostgreSQL", "Python", "Pandas", "Looker", "dbt", "Metabase"],
    programme: [
      {
        title: "SQL Fundamentals",
        d: "2 wks · 14 lessons",
        desc: "SELECT, JOIN, aggregations, subqueries, CTEs.",
      },
      {
        title: "Data Modeling & Data Warehouse",
        d: "2 wks · 12 lessons",
        desc: "Star schema, snowflake, dbt, and modeling best practices.",
      },
      {
        title: "Python for Analysis",
        d: "3 wks · 18 lessons",
        desc: "Pandas, NumPy, notebooks, data cleaning techniques.",
      },
      {
        title: "Dataviz & Dashboards",
        d: "2 wks · 10 lessons",
        desc: "Visual grammar, Looker Studio, Metabase.",
      },
      {
        title: "Applied Statistics",
        d: "2 wks · 12 lessons",
        desc: "Hypothesis tests, correlations, linear regression.",
      },
      {
        title: "Capstone Project",
        d: "1 wk · 4 lessons",
        desc: "End-to-end mentored real-world case study.",
      },
    ],
    faqs: [
      {
        q: "Do I need coding experience before starting?",
        a: "No, Module 1 covers all the necessary foundations.",
      },
      {
        q: "Is the certification recognized?",
        a: "Yes, our certification is recognized by our partner companies and validates your practical skills.",
      },
      {
        q: "Can I follow at my own pace?",
        a: "Absolutely. Courses are available online 24/7 to best suit your schedule.",
      },
    ],
    avis: [
      {
        name: "Chaima M.",
        date: "2026-05-12",
        rating: 5,
        comment: "Dense but very well-guided course. The projects are concrete.",
      },
      {
        name: "Yassine B.",
        date: "2026-04-30",
        rating: 5,
        comment: "I landed a position 3 weeks after completion.",
      },
      {
        name: "Nesrine T.",
        date: "2026-04-02",
        rating: 4,
        comment: "Excellent content, with great mentorship throughout.",
      },
    ],
    resources: [
      { name: "Detailed Curriculum.pdf", size: "480 KB" },
      { name: "Data Analyst Syllabus.pdf", size: "1.2 MB" },
      { name: "BNP Case Study.pdf", size: "820 KB" },
    ],
  },
  "Architecture RAG & Agents IA": {
    d_weeks: "6 weeks",
    students: "850",
    price: "€1,890",
    progression: 15,
    updatedAt: "2026-06-15",
    subtitle: "Master the design of advanced RAG systems and multi-agent orchestration.",
    reviewsCount: 120,
    formateur: {
      name: "Yassine Ben Salah",
      role: "AI Expert & CTO · Sorbonne",
      avatar: "YS",
      bio: "Natural Language Processing researcher and cognitive architecture designer.",
      stats: { rating: 4.9, students: 1800, courses: 6 },
    },
    description:
      "This intensive track guides you through integrating next-generation language models. You will learn to design high-performance RAG pipelines, from advanced vector indexing to orchestrating autonomous agents.",
    objectifs: [
      "Design advanced chunking and vectorization pipelines",
      "Implement reranking mechanisms and semantic filters",
      "Orchestrate multi-agent systems with LangChain or AutoGen",
      "Evaluate accuracy and faithfulness of generated responses",
    ],
    prerequis: ["Strong Python mastery", "Machine Learning & AI APIs basics"],
    competences: ["RAG", "Embeddings", "Multi-Agents", "Vectors", "Python"],
    technologies: ["Python", "LangChain", "Pinecone", "OpenAI", "LlamaIndex", "HuggingFace"],
    programme: [
      {
        title: "Introduction to LLMs & APIs",
        d: "1 wk · 8 lessons",
        desc: "Core transformer principles, context management.",
      },
      {
        title: "Vector Indexing",
        d: "1 wk · 10 lessons",
        desc: "Chunking, vector databases, semantic embeddings.",
      },
      {
        title: "Retrieval & Reranking",
        d: "1 wk · 12 lessons",
        desc: "Hybrid search algorithms and relevance filtering.",
      },
      {
        title: "Multi-Agent Orchestration",
        d: "2 wks · 14 lessons",
        desc: "Intent routing, synthesis agents, feedback loops.",
      },
      {
        title: "Evaluation & Deployment",
        d: "1 wk · 6 lessons",
        desc: "RAGAs, cost monitoring, latency, and security guardrails.",
      },
    ],
    faqs: [
      {
        q: "What Python level is required?",
        a: "An intermediate/advanced level is recommended to comfortably follow the code.",
      },
      {
        q: "Which API keys are provided?",
        a: "Genove provides free access credits to flagship models for your workshop projects.",
      },
    ],
    avis: [
      {
        name: "Mehdi K.",
        date: "2026-06-20",
        rating: 5,
        comment: "The best course on RAG. The multi-agent practical cases are insanely useful.",
      },
    ],
    resources: [{ name: "RAG & Agents Syllabus.pdf", size: "950 KB" }],
  },
  "UX Research pour produits SaaS": {
    d_weeks: "5 weeks",
    students: "920",
    price: "€1,690",
    progression: 20,
    updatedAt: "2026-06-10",
    subtitle: "Conduct user research that transforms product retention and SaaS adoption.",
    reviewsCount: 110,
    formateur: {
      name: "Mohamed Chaabane",
      role: "Lead UX Researcher · Orange",
      avatar: "MC",
      bio: "8 years designing user experiences for international SaaS applications.",
      stats: { rating: 4.8, students: 2100, courses: 8 },
    },
    description:
      "Master qualitative and quantitative user research methods applied to SaaS products. Learn to lead user interviews, run usability tests, and translate insights into concrete product features.",
    objectifs: [
      "Plan and execute structured user interview protocols",
      "Run remote and in-person usability testing sessions",
      "Analyze product analytics to detect conversion friction",
      "Create actionable buyer personas and journey maps",
    ],
    prerequis: ["Basic understanding of product design concepts"],
    competences: ["UX Research", "Usability Testing", "Personas", "Analytics", "Figma"],
    technologies: ["Figma", "Maze", "Hotjar", "Mixpanel", "Notion", "Dovetail"],
    programme: [
      {
        title: "Foundations of UX Research",
        d: "1 wk · 6 lessons",
        desc: "Qualitative vs quantitative methods, research planning.",
      },
      {
        title: "User Interviews & Synthesis",
        d: "1 wk · 8 lessons",
        desc: "Asking unbiased questions, affinity mapping, thematic analysis.",
      },
      {
        title: "Usability Testing Protocols",
        d: "1 wk · 8 lessons",
        desc: "Task design, moderation techniques, reporting findings.",
      },
      {
        title: "Quantitative UX & Product Metrics",
        d: "1 wk · 6 lessons",
        desc: "System Usability Scale (SUS), product telemetry, funnels.",
      },
      {
        title: "Integrating Research into Agile",
        d: "1 wk · 4 lessons",
        desc: "Presenting to product managers and engineers.",
      },
    ],
    faqs: [
      {
        q: "Do I need to know UI design?",
        a: "No, UX Research focuses on user behavior and data rather than visual design.",
      },
    ],
    avis: [
      {
        name: "Aida B.",
        date: "2026-05-02",
        rating: 5,
        comment: "Changed my perspective on building products. Extremely actionable framework!",
      },
    ],
    resources: [{ name: "UX Research Playbook.pdf", size: "1.4 MB" }],
  },
  "Cloud Architect — AWS": {
    d_weeks: "10 weeks",
    students: "1,410",
    price: "€2,990",
    progression: 45,
    updatedAt: "2026-06-01",
    subtitle: "Design scalable, secure, and cost-optimized Cloud architectures on AWS.",
    reviewsCount: 280,
    formateur: {
      name: "Nour Bouazizi",
      role: "Lead Cloud Architect · Capgemini",
      avatar: "NB",
      bio: "AWS Certified Solutions Architect with 12 years of enterprise cloud experience.",
      stats: { rating: 4.9, students: 4100, courses: 15 },
    },
    description:
      "Comprehensive preparation for Cloud Architect roles. Learn to architect fault-tolerant, high-performance systems on AWS using Terraform, Docker, Kubernetes, and serverless architectures.",
    objectifs: [
      "Design high-availability multi-AZ and multi-region architectures",
      "Automate infrastructure provisioning using Terraform",
      "Implement zero-trust security policies and IAM roles",
      "Optimize cloud expenses and manage enterprise migrations",
    ],
    prerequis: ["Linux system administration basics", "Networking fundamentals (TCP/IP, DNS)"],
    competences: ["AWS", "Cloud Architecture", "Terraform", "Security", "DevOps"],
    technologies: ["AWS", "Terraform", "Docker", "Kubernetes", "CloudWatch", "IAM"],
    programme: [
      {
        title: "AWS Core Services & Global Infrastructure",
        d: "2 wks · 10 lessons",
        desc: "EC2, VPC, S3, IAM, and cloud networking.",
      },
      {
        title: "Infrastructure as Code with Terraform",
        d: "2 wks · 12 lessons",
        desc: "Modules, state management, automated CI/CD deployments.",
      },
      {
        title: "Containers & Orchestration",
        d: "2 wks · 10 lessons",
        desc: "ECS, EKS, Dockerized microservices.",
      },
      {
        title: "Serverless Architectures",
        d: "2 wks · 8 lessons",
        desc: "Lambda, API Gateway, DynamoDB, EventBridge.",
      },
      {
        title: "Security, Compliance & Cost Optimization",
        d: "2 wks · 10 lessons",
        desc: "AWS Well-Architected Framework, cost management.",
      },
    ],
    faqs: [
      {
        q: "Does this course prepare for AWS certification?",
        a: "Yes, it covers the exact requirements for the AWS Solutions Architect Associate exam.",
      },
    ],
    avis: [
      {
        name: "Karim H.",
        date: "2026-06-11",
        rating: 5,
        comment: "Passed my AWS certification on the first try thanks to this program!",
      },
    ],
    resources: [{ name: "AWS Architecture Guide.pdf", size: "2.1 MB" }],
  },
  "Product Management B2B": {
    d_weeks: "8 weeks",
    students: "1,050",
    price: "€1,990",
    progression: 25,
    updatedAt: "2026-05-28",
    subtitle: "Drive the roadmap, strategy, and go-to-market of complex B2B products.",
    reviewsCount: 165,
    formateur: {
      name: "Nour Bouazizi",
      role: "Head of Product · L'Oréal",
      avatar: "NB",
      bio: "Product leader specialized in B2B product strategy and Product-Led Growth.",
      stats: { rating: 4.8, students: 2900, courses: 9 },
    },
    description:
      "Learn how to build, position, and scale B2B software products. Master backlog prioritization, pricing models, stakeholder management, and customer discovery in B2B environments.",
    objectifs: [
      "Build strategic product roadmaps aligned with enterprise revenue",
      "Master prioritization frameworks (RICE, MoSCoW, Kano)",
      "Conduct B2B buyer & user discovery calls",
      "Define product metrics (ARR, Churn, NRR, CAC/LTV)",
    ],
    prerequis: ["Interest in digital products and tech business models"],
    competences: ["Product Strategy", "Roadmapping", "B2B SaaS", "Agile", "Product Analytics"],
    technologies: ["Jira", "Productboard", "Mixpanel", "Amplitude", "Figma", "Notion"],
    programme: [
      {
        title: "B2B Product Foundations",
        d: "2 wks · 8 lessons",
        desc: "B2B vs B2C dynamics, enterprise buying personas.",
      },
      {
        title: "Discovery & Opportunity Sizing",
        d: "2 wks · 10 lessons",
        desc: "Customer problem validation, ROI calculators.",
      },
      {
        title: "Roadmap & Feature Prioritization",
        d: "2 wks · 10 lessons",
        desc: "Strategic prioritization models and alignment.",
      },
      {
        title: "Go-To-Market & Pricing",
        d: "2 wks · 8 lessons",
        desc: "Tiered pricing, enterprise licensing, sales enablement.",
      },
    ],
    faqs: [
      {
        q: "Is this suitable for aspiring PMs?",
        a: "Yes, it provides the full portfolio required to transition into Product Management.",
      },
    ],
    avis: [
      {
        name: "Sonia G.",
        date: "2026-05-19",
        rating: 5,
        comment: "Clear, practical, and highly strategic. Highly recommended!",
      },
    ],
    resources: [{ name: "B2B Product Strategy Blueprint.pdf", size: "1.1 MB" }],
  },
  "Design Systems avancé": {
    d_weeks: "6 weeks",
    students: "780",
    price: "€1,790",
    progression: 10,
    updatedAt: "2026-06-12",
    subtitle: "Build, document, and scale multi-platform design systems.",
    reviewsCount: 98,
    formateur: {
      name: "Mohamed Chaabane",
      role: "Design Director · Total",
      avatar: "MC",
      bio: "Design system architect having built multi-brand design systems for Fortune 500s.",
      stats: { rating: 4.9, students: 1600, courses: 5 },
    },
    description:
      "Bridge the gap between design and engineering. Learn how to architect tokenized design systems in Figma and React, establish governance models, and ensure 100% accessibility compliance.",
    objectifs: [
      "Architect design tokens (Color, Typography, Spacing, Shadows)",
      "Build accessible UI components in Figma & React (WCAG 2.1 AA)",
      "Document component APIs in Storybook",
      "Establish cross-team contribution and versioning workflows",
    ],
    prerequis: ["Figma proficiency and basic React/CSS knowledge"],
    competences: [
      "Design Tokens",
      "Figma",
      "React",
      "Storybook",
      "Accessibility",
      "Design Systems",
    ],
    technologies: ["Figma", "React", "Storybook", "Tailwind CSS", "Style Dictionary", "Zeroheight"],
    programme: [
      {
        title: "Design Tokens & Architecture",
        d: "1 wk · 6 lessons",
        desc: "Global, alias, and component tokens design.",
      },
      {
        title: "Figma Component Library",
        d: "1 wk · 8 lessons",
        desc: "Variants, auto-layout, component properties.",
      },
      {
        title: "React & Code Synchronization",
        d: "2 wks · 10 lessons",
        desc: "Building modular component libraries with Tailwind.",
      },
      {
        title: "Storybook & Documentation",
        d: "1 wk · 6 lessons",
        desc: "Interactive documentation and visual regression testing.",
      },
      {
        title: "Governance & Adoption",
        d: "1 wk · 4 lessons",
        desc: "Versioning, changelogs, and team onboarding.",
      },
    ],
    faqs: [
      {
        q: "Is this for designers or developers?",
        a: "Both! It is specifically designed to align UI designers and front-end developers.",
      },
    ],
    avis: [
      {
        name: "Tarek L.",
        date: "2026-04-28",
        rating: 5,
        comment: "Our design-to-code workflow speed doubled after taking this course!",
      },
    ],
    resources: [{ name: "Design System Architecture Spec.pdf", size: "1.8 MB" }],
  },
  "Finance quantitative pour Data Scientists": {
    d_weeks: "10 weeks",
    students: "890",
    price: "€2,490",
    progression: 18,
    updatedAt: "2026-06-03",
    subtitle: "Apply Machine Learning and Python to financial modeling and risk analysis.",
    reviewsCount: 140,
    formateur: {
      name: "Amina Trabelsi",
      role: "Quant Lead · BNP Paribas",
      avatar: "AT",
      bio: "12 years in quantitative trading floors and Data Science at leading investment banks.",
      stats: { rating: 4.8, students: 1950, courses: 7 },
    },
    description:
      "Master quantitative analysis techniques applied to capital markets, risk management, option pricing, and algorithmic portfolio management using Python.",
    objectifs: [
      "Model financial time series and asset volatility",
      "Implement Black-Scholes and Monte Carlo simulation models",
      "Optimize portfolio allocation using Markowitz & ML methods",
      "Calculate Value-at-Risk (VaR) and Expected Shortfall",
    ],
    prerequis: ["Good Python foundation", "Linear algebra & probability basics"],
    competences: ["Quant Finance", "Time Series", "Monte Carlo", "Risk Management", "Python"],
    technologies: ["Python", "NumPy", "SciPy", "Statsmodels", "QuantLib", "Pandas"],
    programme: [
      {
        title: "Financial Time Series Analysis",
        d: "2 wks · 10 lessons",
        desc: "Stationarity, ARIMA, GARCH models.",
      },
      {
        title: "Derivatives & Stochastic Calculus",
        d: "2 wks · 10 lessons",
        desc: "Black-Scholes, Greeks, Monte Carlo simulations.",
      },
      {
        title: "Portfolio Optimization & Asset Pricing",
        d: "3 wks · 12 lessons",
        desc: "CAPM, factor models, machine learning allocation.",
      },
      {
        title: "Risk Management & Regulatory Compliance",
        d: "3 wks · 10 lessons",
        desc: "VaR, stress testing, credit risk modeling.",
      },
    ],
    faqs: [
      {
        q: "Does this require prior banking experience?",
        a: "No, domain-specific finance concepts are introduced step-by-step.",
      },
    ],
    avis: [
      {
        name: "Anis M.",
        date: "2026-06-05",
        rating: 5,
        comment:
          "Top-tier content. The Monte Carlo and portfolio optimization modules are crystal clear.",
      },
    ],
    resources: [{ name: "Quant Finance Python Notebooks.pdf", size: "2.4 MB" }],
  },
  "Growth Marketing B2B": {
    d_weeks: "4 weeks",
    students: "1,120",
    price: "€1,490",
    progression: 40,
    updatedAt: "2026-05-30",
    subtitle: "Acquire, convert, and retain B2B customers with data-driven strategies.",
    reviewsCount: 190,
    formateur: {
      name: "Nour Bouazizi",
      role: "Growth Lead · SaaS Academy",
      avatar: "NB",
      bio: "Growth Hacker who has helped +30 B2B startups scale revenue.",
      stats: { rating: 4.7, students: 3400, courses: 11 },
    },
    description:
      "Learn how to build scalable B2B acquisition engines. Master cold outbound email automation, LinkedIn social selling, performance marketing, and funnel analytics.",
    objectifs: [
      "Design high-converting B2B lead generation funnels",
      "Automate personalized outbound campaigns (Clay, Lemlist)",
      "Optimize LinkedIn content & advertising strategies",
      "Analyze pipeline conversion rates and CAC payback periods",
    ],
    prerequis: ["Basic marketing interest and digital tool familiarity"],
    competences: [
      "Growth Marketing",
      "Outbound Automation",
      "LinkedIn Marketing",
      "Analytics",
      "Lead Gen",
    ],
    technologies: [
      "Lemlist",
      "Clay",
      "LinkedIn Sales Navigator",
      "HubSpot",
      "Google Analytics 4",
      "Zapier",
    ],
    programme: [
      {
        title: "B2B Growth Foundations",
        d: "1 wk · 6 lessons",
        desc: "ICP definition, messaging frameworks, funnel metrics.",
      },
      {
        title: "Cold Outbound & Email Automation",
        d: "1 wk · 8 lessons",
        desc: "Data enrichment, deliverability, automated sequences.",
      },
      {
        title: "LinkedIn Organic & Social Selling",
        d: "1 wk · 6 lessons",
        desc: "Executive branding, engagement loops, lead magnets.",
      },
      {
        title: "Paid Ads & Conversion Rate Optimization",
        d: "1 wk · 6 lessons",
        desc: "Retargeting, landing page optimization, attribution.",
      },
    ],
    faqs: [
      {
        q: "Is this for early-stage founders?",
        a: "Yes! Founders and growth marketers alike can implement these exact tactics.",
      },
    ],
    avis: [
      {
        name: "Myriam F.",
        date: "2026-05-14",
        rating: 5,
        comment: "Generated 15 qualified B2B demos during the second week of training!",
      },
    ],
    resources: [{ name: "B2B Outbound Scripts & Templates.pdf", size: "620 KB" }],
  },
  "Prompt Engineering pratique": {
    d_weeks: "3 weeks",
    students: "1,650",
    price: "€990",
    progression: 60,
    updatedAt: "2026-06-18",
    subtitle: "Master prompt techniques, guardrails, and LLM automation for enterprise workflows.",
    reviewsCount: 230,
    formateur: {
      name: "Yassine Ben Salah",
      role: "AI Researcher · Sorbonne",
      avatar: "YS",
      bio: "Specialist in prompt engineering, LLM fine-tuning, and cognitive task modeling.",
      stats: { rating: 4.9, students: 2700, courses: 7 },
    },
    description:
      "Learn structured prompting techniques to get reliable, deterministic outputs from LLMs. Master Few-Shot prompting, Chain-of-Thought, function calling, and guardrails for production applications.",
    objectifs: [
      "Master Few-Shot, Chain-of-Thought (CoT), and ReAct prompting patterns",
      "Guarantee structured JSON/Schema outputs from AI models",
      "Integrate system prompts into software APIs securely",
      "Implement prompt evaluation benchmark test suites",
    ],
    prerequis: ["No coding background required, though API knowledge is a plus"],
    competences: ["Prompt Engineering", "LLM APIs", "Structured Outputs", "AI Workflows", "GPT-4"],
    technologies: [
      "OpenAI API",
      "Claude API",
      "Gemini API",
      "LangChain",
      "Promptdoo",
      "JSON Schema",
    ],
    programme: [
      {
        title: "Foundations of Prompting",
        d: "1 wk · 6 lessons",
        desc: "System roles, context framing, temperature and top_p parameters.",
      },
      {
        title: "Advanced Prompt Architecture",
        d: "1 wk · 8 lessons",
        desc: "Chain-of-Thought, ReAct, Few-Shot examples, JSON extraction.",
      },
      {
        title: "Production Evaluation & Guardrails",
        d: "1 wk · 6 lessons",
        desc: "Prompt injection prevention, output validation, latency tuning.",
      },
    ],
    faqs: [
      {
        q: "Do I need to be a developer to take this course?",
        a: "No, prompt engineering relies primarily on logic, clarity, and structured domain thinking.",
      },
    ],
    avis: [
      {
        name: "Oussama N.",
        date: "2026-06-25",
        rating: 5,
        comment: "Short, sharp, and hugely valuable for automating daily business tasks with AI.",
      },
    ],
    resources: [{ name: "Enterprise Prompt Templates.pdf", size: "450 KB" }],
  },
};

// Auto-generator for any courses that don't have static custom specifications
function getCourseDetails(course: Course, lang: string): CourseDetails {
  if (lang === "en") {
    const customEn = COURSE_DETAILS_EN[course.t];
    if (customEn) return { ...customEn };

    return {
      d_weeks:
        course.d === "48h"
          ? "12 weeks"
          : course.d === "36h"
            ? "10 weeks"
            : course.d === "24h"
              ? "6 weeks"
              : "8 weeks",
      students: "1,150",
      price: course.t.includes("Architect") ? "€2,990" : "€1,990",
      progression: 20,
      updatedAt: "2026-06-01",
      subtitle: `Become a recognized expert in ${translateTheme(course.th, "en")} through our certified track guided by ${course.f}.`,
      reviewsCount: 142,
      formateur: {
        name: course.f,
        role: `Lead Consultant at ${course.p}`,
        avatar: course.f
          .split(" ")
          .map((n) => n[0])
          .join(""),
        bio: `Over 8 years of experience in ${translateTheme(course.th, "en")} applied in enterprise and higher education.`,
        stats: { rating: course.r, students: 2500, courses: 4 },
      },
      description: `This track of excellence trains you in the essential fundamentals and tools for ${translateCourseTitle(course.t, "en")}. Designed in collaboration with seasoned professionals from ${course.p}, it blends solid theory with real case studies to make you immediately operational.`,
      objectifs: [
        `Master key tools in ${translateTheme(course.th, "en")}`,
        `Design and deploy projects complying with ${course.p} standards`,
        `Adopt agile methodologies and market best practices`,
        `Demonstrate your skills through real-world case studies`,
      ],
      prerequis: ["Solid foundations in digital tools", "Motivation and intellectual curiosity"],
      competences: [
        translateTheme(course.th, "en"),
        "Methodology",
        "Projects",
        "Professional Tools",
      ],
      technologies: [translateTheme(course.th, "en"), "Git", "Cloud", "Agile"],
      programme: [
        {
          title: "Module 1: Foundations & Core Concepts",
          d: "2 wks · 8 lessons",
          desc: "General introduction, vocabulary, key use cases.",
        },
        {
          title: "Module 2: Flagship Methods & Tools",
          d: "2 wks · 10 lessons",
          desc: "Practical application and guided workshops.",
        },
        {
          title: "Module 3: Advanced Deep Dive",
          d: "3 wks · 12 lessons",
          desc: "Complex use cases, performance optimization.",
        },
        {
          title: "Module 4: Final Capstone & Defense",
          d: "1 wk · 4 lessons",
          desc: "Synthesis project evaluated by an expert jury.",
        },
      ],
      faqs: [
        {
          q: "What are the career prospects?",
          a: "This track directly prepares you for key positions sought after by top recruiters in the industry.",
        },
        {
          q: "Is funding available?",
          a: "Yes, most of our certified programs qualify for enterprise training funds and scholarships.",
        },
      ],
      avis: [
        {
          name: "Sami R.",
          date: "2026-05-18",
          rating: 5,
          comment: "Superb training, I recommend without hesitation!",
        },
        {
          name: "Fatma B.",
          date: "2026-04-12",
          rating: 4,
          comment: "High quality content, instructor was very attentive.",
        },
      ],
      resources: [
        { name: `Syllabus_${course.t.replace(/\s+/g, "_")}.pdf`, size: "1.1 MB" },
        { name: "Career_Guide.pdf", size: "540 KB" },
      ],
    };
  }

  const custom = COURSE_DETAILS[course.t];
  if (custom) return { ...custom };

  return {
    d_weeks:
      course.d === "48h"
        ? "12 semaines"
        : course.d === "36h"
          ? "10 semaines"
          : course.d === "24h"
            ? "6 semaines"
            : "8 semaines",
    students: "1150",
    price: course.t.includes("Architect") ? "2990 €" : "1990 €",
    progression: 20,
    updatedAt: "2026-06-01",
    subtitle: `Devenez un expert reconnu en ${course.th} grâce à notre formation certifiante guidée par ${course.f}.`,
    reviewsCount: 142,
    formateur: {
      name: course.f,
      role: `Expert consultant chez ${course.p}`,
      avatar: course.f
        .split(" ")
        .map((n) => n[0])
        .join(""),
      bio: `Plus de 8 ans d'expérience en ${course.th} appliqué en entreprise et enseignement supérieur.`,
      stats: { rating: course.r, students: 2500, courses: 4 },
    },
    description: `Ce parcours d'excellence vous forme aux fondamentaux et outils incontournables en ${course.t}. Conçu en collaboration avec des professionnels chevronnés de ${course.p}, il mêle théorie solide et cas réels pour faire de vous un professionnel directement opérationnel.`,
    objectifs: [
      `Maîtriser les outils clés en ${course.th}`,
      `Concevoir et déployer des projets conformes aux standards de ${course.p}`,
      `Adopter les méthodologies agiles et meilleures pratiques du marché`,
      `Valoriser vos compétences via des études de cas réelles`,
    ],
    prerequis: [
      "Bases solides sur les outils informatiques",
      "Motivation et curiosité intellectuelle",
    ],
    competences: [course.th, "Méthodologie", "Projets", "Outils professionnels"],
    technologies: [course.th, "Git", "Cloud", "Agile"],
    programme: [
      {
        title: "Module 1 : Fondations & concepts de base",
        d: "2 sem. · 8 leçons",
        desc: "Introduction générale, vocabulaire, cas d'usage.",
      },
      {
        title: "Module 2 : Méthodes & outils phares",
        d: "2 sem. · 10 leçons",
        desc: "Mise en pratique, premiers ateliers dirigés.",
      },
      {
        title: "Module 3 : Approfondissement thématique",
        d: "3 sem. · 12 leçons",
        desc: "Cas d'usages complexes, optimisation de performance.",
      },
      {
        title: "Module 4 : Projet final & soutenance",
        d: "1 sem. · 4 leçons",
        desc: "Réalisation d'un projet de synthèse évalué par un jury.",
      },
    ],
    faqs: [
      {
        q: "Quels sont les débouchés ?",
        a: "Ce parcours prépare directement aux postes clés recherchés par les recruteurs du secteur.",
      },
      {
        q: "La formation est-elle finançable ?",
        a: "Oui, la plupart de nos formations sont certifiantes et éligibles au CPF ou financements régionaux.",
      },
    ],
    avis: [
      {
        name: "Sami R.",
        date: "2026-05-18",
        rating: 5,
        comment: "Une superbe formation, je recommande sans hésiter !",
      },
      {
        name: "Fatma B.",
        date: "2026-04-12",
        rating: 4,
        comment: "Contenu de très grande qualité, formateur très à l'écoute.",
      },
    ],
    resources: [
      { name: `Syllabus_${course.t.replace(/\s+/g, "_")}.pdf`, size: "1.1 MB" },
      { name: "Guide_Metier.pdf", size: "540 KB" },
    ],
  };
}

function findCourseByQuery(query: string): Course | null {
  if (!query) return null;
  const q = decodeURIComponent(query).trim().toLowerCase();
  if (!q) return null;

  // 1. Exact match on t
  let found = COURSES.find((c) => c.t.toLowerCase() === q);
  if (found) return found;

  // 2. Match on translated titles
  found = COURSES.find(
    (c) =>
      translateCourseTitle(c.t, "en").toLowerCase() === q ||
      translateCourseTitle(c.t, "fr").toLowerCase() === q,
  );
  if (found) return found;

  // 3. Substring match
  found = COURSES.find(
    (c) =>
      c.t.toLowerCase().includes(q) ||
      q.includes(c.t.toLowerCase()) ||
      translateCourseTitle(c.t, "en").toLowerCase().includes(q) ||
      q.includes(translateCourseTitle(c.t, "en").toLowerCase()),
  );
  if (found) return found;

  // 4. Token matching
  const tokens = q.split(/[\s—–\-_&]+/).filter((tok) => tok.length > 2);
  if (tokens.length > 0) {
    found = COURSES.find((c) => {
      const fullText =
        `${c.t} ${c.th} ${c.f} ${c.p} ${translateCourseTitle(c.t, "en")}`.toLowerCase();
      return tokens.some((tok) => fullText.includes(tok));
    });
    if (found) return found;
  }

  return null;
}

function Catalogue() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState<string[]>([]);
  const [level, setLevel] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const requireAuth = useRequireAuth();
  const { t, language } = useLanguage();

  // Active selected course for the detailed view
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const courseTitle = params.get("course") || params.get("c");
      if (courseTitle) {
        return findCourseByQuery(courseTitle);
      }
    }
    return null;
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Sync state with URL parameter for shareability and direct links
  useEffect(() => {
    const checkUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const courseTitle = params.get("course") || params.get("c");
      if (courseTitle) {
        const found = findCourseByQuery(courseTitle);
        if (found) {
          setSelectedCourse(found);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    checkUrl();
    window.addEventListener("popstate", checkUrl);
    return () => window.removeEventListener("popstate", checkUrl);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedCourse) {
      url.searchParams.set("course", selectedCourse.t);
    } else {
      url.searchParams.delete("course");
    }
    window.history.replaceState({}, "", url.toString());
  }, [selectedCourse]);

  const results = useMemo(() => {
    return COURSES.filter((c) => {
      if (q && !`${c.t} ${c.f} ${c.p} ${c.th}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (theme.length && !theme.includes(c.th)) return false;
      if (level && c.lvl !== level) return false;
      return true;
    });
  }, [q, theme, level]);

  const toggleTheme = (t: string) =>
    setTheme((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  // If a course is selected, render the high fidelity details page
  if (selectedCourse) {
    const details = getCourseDetails(selectedCourse, language);

    return (
      <div className="relative min-h-screen overflow-hidden bg-[#F3EEFE]/60 dark:bg-slate-950 transition-colors duration-300 text-slate-800 dark:text-slate-100">
        {/* Background Soft Glow Bulbs on left and right sides spanning the whole page */}
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
          {/* Breadcrumbs Row - Seamless on body background matching other pages */}
          <div className="pt-24 sm:pt-28 pb-4 relative z-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between text-xs font-medium flex-wrap gap-3 text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-1.5 flex-wrap font-medium">
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    navigate({ to: "/" });
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-amber-300 hover:bg-purple-500/10 dark:hover:bg-white/10 transition-all font-semibold cursor-pointer"
                  title={t("catalogue.home")}
                >
                  <Home className="h-3.5 w-3.5 text-purple-600 dark:text-amber-300" />
                  <span>{t("catalogue.home")}</span>
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setTheme([]);
                  }}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-amber-300 hover:bg-purple-500/10 dark:hover:bg-white/10 transition-all font-semibold cursor-pointer"
                  title={t("catalogue.coursesTitle")}
                >
                  {t("catalogue.coursesTitle")}
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <button
                  onClick={() => {
                    setTheme([selectedCourse.th]);
                    setSelectedCourse(null);
                  }}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-amber-300 hover:bg-purple-500/10 dark:hover:bg-white/10 transition-all font-semibold cursor-pointer hidden sm:inline-flex"
                  title={translateTheme(selectedCourse.th, language)}
                >
                  {translateTheme(selectedCourse.th, language)}
                </button>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0 hidden sm:inline-block" />
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-amber-400/15 text-purple-700 dark:text-amber-300 border border-purple-200 dark:border-amber-400/30 font-bold text-xs max-w-full sm:max-w-[440px]"
                  title={translateCourseTitle(selectedCourse.t, language)}
                >
                  {translateCourseTitle(selectedCourse.t, language)}
                </span>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#8C52FF] to-[#7030EF] hover:from-purple-600 hover:to-indigo-600 border border-purple-400/30 px-4 py-2 rounded-full shadow-md shadow-purple-500/20 transition-all duration-200 cursor-pointer group active:scale-95 shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-amber-300 transition-transform group-hover:-translate-x-0.5" />
                <span>{t("catalogue.backToCat")}</span>
              </button>
            </div>
          </div>

          {/* Hero Banner Section Container wrapped in a rounded dark card matching site theme */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8">
            <div className="rounded-3xl bg-gradient-to-br from-[#180E30] via-[#1E113B] to-[#140B28] text-white border border-purple-500/30 shadow-2xl relative overflow-hidden p-6 sm:p-10 md:p-12">
              <div className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(140,82,255,0.35),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(251,191,36,0.2),transparent_45%)]" />

              <div className="grid gap-10 lg:grid-cols-[1fr_420px] items-center relative z-10">
                <div>
                  {/* Category, Level and Gold Certifiant Badge */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/10 text-white border border-white/10">
                      {translateTheme(selectedCourse.th, language)}
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/10 text-white border border-white/10">
                      {translateLevel(selectedCourse.lvl, language)}
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#D4A83A]/20 text-amber-300 border border-[#D4A83A]/30">
                      {translateBadge("Certifiant", language)}
                    </span>
                  </div>

                  {/* Course Title & Subtitle */}
                  <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {translateCourseTitle(selectedCourse.t, language)}
                  </h1>
                  <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
                    {details.subtitle}
                  </p>

                  {/* Statistics Line */}
                  <div className="mt-6 flex flex-wrap gap-6 items-center text-xs text-slate-300 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-white font-bold">{selectedCourse.r}</span>
                      <span className="text-slate-400 font-medium">
                        ({details.reviewsCount} {language === "en" ? "reviews" : "avis"})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-amber-400" />
                      <span>
                        {details.students} {language === "en" ? "learners" : "apprenants"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span>{details.d_weeks}</span>
                    </div>
                  </div>

                  {/* Mini Formateur Card inside Banner */}
                  <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 max-w-md">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#070F24] font-bold flex items-center justify-center text-sm shadow-[var(--shadow-gold)]">
                      {details.formateur.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{details.formateur.name}</div>
                      <div className="text-xs text-slate-400">{details.formateur.role}</div>
                    </div>
                  </div>
                </div>

                {/* Video Placeholder (Play button with Unsplash overlay) */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] aspect-video bg-slate-900 group cursor-pointer">
                  <img
                    src={selectedCourse.img}
                    alt={selectedCourse.t}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/30">
                    <div className="h-14 w-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-[#070F24] group-hover:border-amber-400 transition-all duration-300 shadow-lg">
                      <Play className="h-6 w-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Sections Grid */}
          <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 lg:grid-cols-[1fr_360px] items-start">
            {/* Main Left Column */}
            <div className="space-y-10">
              {/* Description */}
              <section className="space-y-3.5">
                <h2 className="font-heading text-xl font-extrabold text-[#0d1839] dark:text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  {t("catalogue.description")}
                </h2>
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 shadow-xs hover:border-amber-400/40 transition-all">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {details.description}
                  </p>
                </div>
              </section>

              {/* Objectifs Pédagogiques */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-extrabold text-[#0d1839] dark:text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-500" />
                  {t("catalogue.objectives")}
                </h2>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {details.objectifs.map((obj: string, i: number) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 flex items-start gap-3.5 shadow-xs hover:border-amber-400/40 transition-all group"
                    >
                      <div className="h-7 w-7 rounded-xl bg-amber-400/15 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30 group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-[#0d1839] transition-all">
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-snug">
                        {obj}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Prérequis & Compétences */}
              <div className="grid gap-6 sm:grid-cols-2 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                {/* Prérequis Box */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 shadow-xs hover:border-amber-400/30 transition-all">
                  <h3 className="font-heading font-extrabold text-sm text-[#0d1839] dark:text-white mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    {t("catalogue.prereqs")}
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {details.prerequis.map((pr: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{pr}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compétences Box */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 shadow-xs hover:border-amber-400/30 transition-all">
                  <h3 className="font-heading font-extrabold text-sm text-[#0d1839] dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    {t("catalogue.skillsAcquired")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {details.competences.map((comp: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-[11px] font-bold rounded-xl bg-amber-400/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 hover:bg-amber-400/25 transition-all"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-bold text-[#0d1839] dark:text-white">
                  {t("catalogue.tech")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {details.technologies.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-400/50 transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              {/* Programme Détaillé */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-bold text-[#0d1839] dark:text-white">
                  {t("catalogue.prog")}
                </h2>
                <div className="space-y-3">
                  {details.programme.map((prog: ProgramModule, i: number) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 flex items-start gap-4 hover:border-amber-400/40 transition-all shadow-xs group"
                    >
                      <div className="h-8 w-8 rounded-xl bg-amber-400/20 text-amber-800 dark:text-amber-300 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30 group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-[#0d1839] transition-all">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <h3 className="font-heading font-extrabold text-sm text-[#0d1839] dark:text-white group-hover:text-amber-500 transition-colors">
                            {prog.title}
                          </h3>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                            {prog.d}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed">
                          {prog.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Accordion FAQ */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-bold text-[#0d1839] dark:text-white">
                  {t("catalogue.faqs")}
                </h2>
                <div className="space-y-2.5">
                  {details.faqs.map((faq: FaqItem, i: number) => {
                    const isExpanded = expandedFaq === i;
                    return (
                      <div
                        key={i}
                        className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden shadow-xs hover:border-amber-400/40 transition-all"
                      >
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : i)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-semibold text-sm text-[#0d1839] dark:text-white cursor-pointer"
                        >
                          <span className="font-bold">{faq.q}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-amber-500 shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-800">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Reviews Section */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-heading text-xl font-bold text-[#0d1839] dark:text-white">
                    {t("catalogue.reviews")} ({details.reviewsCount})
                  </h2>
                  <div className="flex items-center gap-1.5 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/30">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-heading font-bold text-[#0d1839] dark:text-white text-sm">
                      {selectedCourse.r}{" "}
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                        / 5
                      </span>
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {details.avis.map((av: Review, i: number) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 flex flex-col justify-between shadow-xs hover:border-amber-400/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#0d1839] font-extrabold text-xs flex items-center justify-center shadow-xs">
                              {av.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="font-heading font-bold text-xs text-[#0d1839] dark:text-white">
                                {av.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                                {av.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`h-3.5 w-3.5 ${j < av.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 font-medium leading-relaxed">
                          {av.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Resources Documents */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-bold text-[#0d1839] dark:text-white">
                  {t("catalogue.docs")}
                </h2>
                <div className="space-y-2.5">
                  {details.resources.map((res: ResourceItem, i: number) => (
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
                      <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-[#0d1839] dark:hover:bg-amber-400 dark:hover:text-[#0d1839] text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Certificate Preview Card */}
              <section className="space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                <h2 className="font-heading text-xl font-bold text-[#0d1839] dark:text-white">
                  {t("catalogue.certPreview")}
                </h2>
                <div className="rounded-2xl border-2 border-dashed border-amber-400/40 bg-gradient-to-br from-amber-400/10 via-amber-500/5 to-transparent backdrop-blur-xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-xs hover:border-amber-400 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,168,58,0.18)_0%,transparent_70%)] blur-md pointer-events-none" />
                  <div className="h-12 w-12 rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-400/30 shadow-xs">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-extrabold mt-3">
                    {language === "en" ? "GENOVE CERTIFICATE" : "Certificat Genove"}
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#0d1839] dark:text-white mt-1.5">
                    {translateCourseTitle(selectedCourse.t, language)}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold max-w-md">
                    {language === "en"
                      ? "Issued upon completion of track · Recognized by our partners"
                      : "Délivré à la fin du parcours · Reconnu par nos partenaires"}
                  </p>
                </div>
              </section>
            </div>

            {/* Sticky Right Column Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              {/* Main Price & Progress Card */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 shadow-xs space-y-5">
                {/* Gold Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {t("catalogue.progression")}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                      {details.progression}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${details.progression}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={() => {
                    requireAuth(() => {
                      alert("Inscription enregistrée avec succès !");
                    });
                  }}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#070F24] font-black text-sm hover:from-amber-300 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Rocket className="h-4 w-4" />
                  {t("catalogue.enroll")}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-400/15 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <Heart className="h-4 w-4 text-amber-500" />
                    <span>{t("catalogue.favorites")}</span>
                  </button>
                  <button className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-400/15 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <Share2 className="h-4 w-4 text-amber-500" />
                    <span>{t("catalogue.share")}</span>
                  </button>
                </div>

                {/* Characteristics List */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {language === "en" ? "Duration" : "Durée"}
                    </span>
                    <span className="text-[#0d1839] dark:text-white font-bold">
                      {details.d_weeks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {t("catalogue.level")}
                    </span>
                    <span className="text-[#0d1839] dark:text-white font-bold">
                      {translateLevel(selectedCourse.lvl, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Format</span>
                    <span className="text-[#0d1839] dark:text-white font-bold">
                      {language === "en" ? "Online, self-paced" : "En ligne, à votre rythme"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {language === "en" ? "Language" : "Langue"}
                    </span>
                    <span className="text-[#0d1839] dark:text-white font-bold">
                      {language === "en" ? "French / English" : "Français / English"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Certification
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                      {language === "en" ? "Included" : "Incluse"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {language === "en" ? "Last update" : "Mise à jour"}
                    </span>
                    <span className="text-[#0d1839] dark:text-white font-bold">
                      {details.updatedAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructor Full Card */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 shadow-xs">
                <div className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-extrabold mb-4">
                  {language === "en" ? "Instructor" : "Formateur"}
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0d1839] font-black flex items-center justify-center text-base shrink-0 shadow-xs">
                    {details.formateur.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-extrabold text-[#0d1839] dark:text-white text-sm truncate">
                      {details.formateur.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                      {details.formateur.role.split(" · ")[0]}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {details.formateur.bio}
                </p>
                <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-heading font-extrabold text-[#0d1839] dark:text-white text-sm">
                      {details.formateur.stats.rating}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === "en" ? "Rating" : "Note"}
                    </div>
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-[#0d1839] dark:text-white text-sm">
                      {details.formateur.stats.students}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === "en" ? "Students" : "Élèves"}
                    </div>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-[#0d1839] dark:text-white text-sm">
                      {details.formateur.stats.courses}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === "en" ? "Courses" : "Cours"}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  // Otherwise, render standard catalogue list view
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F3EEFE]/60 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Soft Glow Bulbs across the whole page */}
      <div className="absolute top-10 -left-20 w-[40rem] h-[40rem] bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-10 -right-20 w-[40rem] h-[40rem] bg-amber-300/30 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[35%] -left-20 w-[35rem] h-[35rem] bg-purple-400/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[55%] -right-20 w-[35rem] h-[35rem] bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 -left-20 w-[35rem] h-[35rem] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Background Micro Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Header Title and Search Section matching brand design */}
        <div className="pt-12 pb-8 mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-4 py-1.5 text-xs font-extrabold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 backdrop-blur-md shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="uppercase tracking-wider">{t("catalogue.tag")}</span>
          </div>

          <h1 className="mt-4 font-heading text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t("catalogue.title1")}{" "}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              {t("catalogue.title2")}
            </span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
            {t("catalogue.subtitle")}
          </p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-3xl group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-[#8042F6] to-[#6E2FE0] text-white font-bold shadow-md shadow-purple-500/25 pointer-events-none z-10 transition-transform group-focus-within:scale-105">
              <Search className="h-5 w-5 stroke-[2.5]" />
            </div>
            <label htmlFor="catalogue-search" className="sr-only">
              {t("catalogue.searchPlaceholder")}
            </label>
            <input
              id="catalogue-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                isMobile ? t("catalogue.searchPlaceholderMobile") : t("catalogue.searchPlaceholder")
              }
              className="w-full h-15 rounded-2xl border-2 border-purple-200/80 dark:border-purple-900/40 bg-white dark:bg-slate-900/95 backdrop-blur-xl pl-14 sm:pl-16 pr-8 sm:pr-14 text-xs sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#8042F6] focus:ring-4 focus:ring-[#8042F6]/20 shadow-lg transition-all"
            />
            {q ? (
              <button
                onClick={() => setQ("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Effacer"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 pointer-events-none text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <span>⌘K</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters and List Section */}
        <div className="mx-auto max-w-7xl px-6 pb-16 grid gap-8 lg:grid-cols-[280px_1fr]">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center gap-2 h-12 w-full rounded-2xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-extrabold text-slate-900 dark:text-white shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4 text-purple-600" />
            {filtersOpen ? t("catalogue.hideFilters") : t("catalogue.showFilters")}
          </button>

          <aside className={(filtersOpen ? "block" : "hidden") + " lg:block space-y-6"}>
            <div className="rounded-3xl border border-purple-100/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 shadow-2xs lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                  <SlidersHorizontal className="h-4 w-4 text-purple-600" /> {t("catalogue.filters")}
                </div>
                <button
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Fermer les filtres"
                  className="lg:hidden grid h-8 w-8 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6 text-sm">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
                    {t("catalogue.theme")}
                  </div>
                  <div className="space-y-2.5">
                    {THEMES.map((tItem) => (
                      <label
                        key={tItem}
                        className="flex items-center gap-2.5 cursor-pointer group text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={theme.includes(tItem)}
                          onChange={() => toggleTheme(tItem)}
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 accent-[#8C52FF] cursor-pointer"
                        />
                        <span>{translateTheme(tItem, language)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="font-extrabold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
                    {t("catalogue.level")}
                  </div>
                  <div className="space-y-2.5">
                    {LEVELS.map((l) => (
                      <label
                        key={l}
                        className="flex items-center gap-2.5 cursor-pointer group text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors"
                      >
                        <input
                          type="radio"
                          name="lvl"
                          checked={level === l}
                          onChange={() => setLevel(l)}
                          className="h-4 w-4 accent-[#8C52FF] cursor-pointer"
                        />
                        <span>{translateLevel(l, language)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTheme([]);
                    setLevel(null);
                    setQ("");
                  }}
                  className="w-full h-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-[#8C52FF] hover:text-white hover:border-[#8C52FF] transition-all cursor-pointer"
                >
                  {t("catalogue.reset")}
                </button>
              </div>
            </div>
          </aside>

          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {results.length} {t("catalogue.availableCourses")}
              </div>
            </div>

            {results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center bg-white/50 dark:bg-slate-900/50 w-full">
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {t("catalogue.noResults")}
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t("catalogue.tryModify")}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-full">
                {results.map((c) => {
                  const title = translateCourseTitle(c.t, language);
                  const badge = translateBadge(c.b, language);
                  const theme = translateTheme(c.th, language);
                  const level = translateLevel(c.lvl, language);
                  return (
                    <button
                      key={c.t}
                      onClick={() => {
                        requireAuth(() => {
                          setSelectedCourse(c);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        });
                      }}
                      className="group relative rounded-3xl border border-purple-100/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden hover:border-purple-300 hover:shadow-[0_15px_35px_rgba(140,82,255,0.12)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left shadow-2xs flex flex-col justify-between w-full"
                    >
                      <div className="w-full">
                        <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-900">
                          <img
                            src={c.img}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                          <span
                            className={
                              "absolute top-3 left-3 text-[11px] font-extrabold px-3 py-1 rounded-full backdrop-blur-md shadow-xs " +
                              (c.b === "Nouveau"
                                ? "bg-[#8C52FF] text-white"
                                : c.b === "Populaire"
                                  ? "bg-white text-slate-900"
                                  : "border border-white/60 text-white bg-black/40")
                            }
                          >
                            {badge}
                          </span>
                          <div className="absolute bottom-3 left-3 text-white font-bold text-xs bg-slate-950/80 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                            {theme}
                          </div>
                        </div>

                        <div className="p-6 w-full">
                          <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[3.25rem] group-hover:text-purple-600 transition-colors">
                            {title}
                          </h3>
                          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                            {c.f} · {c.p}
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-0 space-y-3 w-full">
                        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800 font-semibold w-full">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-purple-600" /> {c.d}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-purple-600" /> {level}
                          </span>
                          <span className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-purple-300">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {c.r}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 w-full">
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                            <Users className="h-4 w-4 text-purple-600" /> 1.2k{" "}
                            {t("catalogue.registered")}
                          </span>
                          <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            {t("catalogue.view")} →
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
}
