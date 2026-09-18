// Mock data for the Genove learner dashboard. Replace with real API data when available.

export const monthlyProgression = [
  { month: "Avr", progression: 22 },
  { month: "Mai", progression: 31 },
  { month: "Juin", progression: 38 },
  { month: "Juil", progression: 47 },
  { month: "Août", progression: 52 },
  { month: "Sept", progression: 61 },
  { month: "Oct", progression: 68 },
  { month: "Nov", progression: 74 },
];

export const weeklyActivity = [
  { day: "Lun", heures: 1.4 },
  { day: "Mar", heures: 2.2 },
  { day: "Mer", heures: 0.9 },
  { day: "Jeu", heures: 2.8 },
  { day: "Ven", heures: 1.7 },
  { day: "Sam", heures: 3.4 },
  { day: "Dim", heures: 1.1 },
];

export const monthlyActivity = [
  { month: "Juin", heures: 18 },
  { month: "Juil", heures: 24 },
  { month: "Août", heures: 21 },
  { month: "Sept", heures: 29 },
  { month: "Oct", heures: 34 },
  { month: "Nov", heures: 31 },
];

export const skillsRadar = [
  { skill: "IA / ML", niveau: 82 },
  { skill: "Data", niveau: 68 },
  { skill: "Dév. Web", niveau: 74 },
  { skill: "Design UX", niveau: 55 },
  { skill: "Cloud", niveau: 60 },
  { skill: "Gestion projet", niveau: 71 },
];

export const stats = [
  { key: "done", label: "Formations terminées", value: "6", icon: "GraduationCap" },
  { key: "ongoing", label: "Formations en cours", value: "3", icon: "BookOpen" },
  { key: "projects", label: "Projets actifs", value: "3", icon: "Rocket" },
  { key: "internships", label: "Stages disponibles", value: "14", icon: "Briefcase" },
  { key: "score", label: "Score de progression", value: "74%", icon: "Target" },
  { key: "time", label: "Temps d'apprentissage", value: "128h", icon: "Clock" },
  { key: "badges", label: "Badges obtenus", value: "9", icon: "Award" },
];

export const recentActivities = [
  {
    id: 1,
    title: "Leçon terminée",
    detail: "Fine-tuning de modèles légers — Architecture RAG & Agents IA",
    time: "Il y a 2 heures",
    icon: "CheckCircle2",
  },
  {
    id: 2,
    title: "Nouveau badge obtenu",
    detail: "Badge « Data Explorer » débloqué",
    time: "Hier, 18:40",
    icon: "Award",
  },
  {
    id: 3,
    title: "Projet mis à jour",
    detail: "RAG Pipeline — Multi-agents : jalon « Indexation » validé",
    time: "Hier, 11:05",
    icon: "Rocket",
  },
  {
    id: 4,
    title: "Candidature envoyée",
    detail: "Stage Data Analyst — TotalEnergies Digital Factory",
    time: "Il y a 2 jours",
    icon: "Briefcase",
  },
  {
    id: 5,
    title: "Quiz réussi",
    detail: "Modélisation dimensionnelle — score 92%",
    time: "Il y a 3 jours",
    icon: "Sparkles",
  },
];

export const myProjects = [
  {
    id: "p1",
    name: "Dashboard risques crédits IA",
    status: "Conception",
    progress: 40,
    team: 4,
    tech: ["Scikit-Learn", "Streamlit", "XGBoost"],
  },
  {
    id: "p2",
    name: "Assistant IA parcours patient",
    status: "Finalisation",
    progress: 85,
    team: 2,
    tech: ["Llama-3", "LangChain", "VectorStore"],
  },
  {
    id: "p3",
    name: "RAG Pipeline — Multi-agents",
    status: "En cours",
    progress: 62,
    team: 3,
    tech: ["LlamaIndex", "ChromaDB", "FastAPI"],
  },
];

export const coursesProgress = [
  { id: "c1", title: "Architecture RAG & Agents IA", progress: 78, category: "IA" },
  { id: "c2", title: "Data Analyst — Parcours complet", progress: 45, category: "Data" },
  { id: "c3", title: "UX Research pour produits SaaS", progress: 100, category: "Design" },
  { id: "c4", title: "MLOps & mise en production", progress: 20, category: "IA" },
];

export const badges = [
  { id: "b1", label: "Data Explorer", color: "accent" },
  { id: "b2", label: "RAG Master", color: "primary" },
  { id: "b3", label: "Série 12 jours", color: "accent" },
  { id: "b4", label: "Top contributeur", color: "primary" },
];

export const recommendations = [
  {
    id: "r1",
    title: "Continuez sur le Fine-tuning LoRA",
    desc: "En lien avec votre formation RAG & Agents IA, ce module complète parfaitement vos acquis.",
  },
  {
    id: "r2",
    title: "Stage recommandé : Data Analyst Junior",
    desc: "Correspond à 92% avec votre profil de compétences Data.",
  },
  {
    id: "r3",
    title: "Rejoindre le projet « Copilot RH »",
    desc: "Une équipe de 2 personnes recherche un profil comme le vôtre.",
  },
];

export const deadlines = [
  { id: "d1", title: "Rendu projet RAG Pipeline", date: "28 Nov", type: "Projet" },
  { id: "d2", title: "Quiz final — Data Analyst", date: "02 Déc", type: "Formation" },
  { id: "d3", title: "Entretien stage TotalEnergies", date: "05 Déc", type: "Stage" },
];

export const notifications = [
  { id: "n1", text: "Votre certificat UX Research est disponible.", time: "1h" },
  { id: "n2", text: "Nouveau message de votre mentor IA.", time: "3h" },
  { id: "n3", text: "3 nouvelles offres de stage correspondent à votre profil.", time: "1j" },
];

export const partners = [
  "TotalEnergies",
  "Capgemini",
  "Sofrecom",
  "Orange Digital",
  "BIAT",
  "InstaDeep",
];

export const internshipApplications = [
  {
    id: "a1",
    role: "Data Analyst Junior",
    company: "TotalEnergies Digital Factory",
    status: "Entretien",
  },
  { id: "a2", role: "Ingénieur IA — Stage PFE", company: "InstaDeep", status: "En révision" },
  { id: "a3", role: "Développeur Full-Stack", company: "Sofrecom", status: "Envoyée" },
];

export const trainingCalendarEvents = [
  {
    id: "e1",
    title: "Atelier RAG avancé",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 18),
  },
  {
    id: "e2",
    title: "Masterclass MLOps",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 24),
  },
  {
    id: "e3",
    title: "Webinar Carrières IA",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 29),
  },
];
