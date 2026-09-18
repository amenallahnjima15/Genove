import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  Trash2,
  Sparkles,
  FolderGit2,
  GraduationCap,
  Clock,
  Briefcase,
  ChevronRight,
  X,
  Bot,
  Maximize2,
  Minimize2,
  LayoutDashboard,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export interface NotificationItem {
  id: string;
  type: "project" | "course" | "internship" | "ai" | "system";
  titleFr: string;
  titleEn: string;
  messageFr: string;
  messageEn: string;
  timestampFr: string;
  timestampEn: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "project",
    titleFr: "Projet R&D Sélectionné",
    titleEn: "R&D Project Selected",
    messageFr:
      "Votre projet 'Diagnostic Médical Prédictif' a été approuvé par la commission R&D Genove.",
    messageEn: "Your project 'Predictive Medical Diagnosis' was approved by the Genove R&D board.",
    timestampFr: "Il y a 12 min",
    timestampEn: "12 mins ago",
    read: false,
    link: "/projets",
  },
  {
    id: "notif-2",
    type: "course",
    titleFr: "Nouvelle Formation Disponible",
    titleEn: "New Course Available",
    messageFr:
      "Le cours 'IA Générative et LLM pour Chercheurs' est maintenant ouvert dans le catalogue.",
    messageEn: "The 'Generative AI & LLMs for Researchers' course is now available in the catalog.",
    timestampFr: "Il y a 2 h",
    timestampEn: "2 hours ago",
    read: false,
    link: "/catalogue",
  },
  {
    id: "notif-3",
    type: "ai",
    titleFr: "Mise à jour Savoir+",
    titleEn: "Savoir+ AI Updated",
    messageFr:
      "L'assistant IA intégré prend désormais en charge l'analyse automatique des documents PDF.",
    messageEn: "The built-in AI assistant now supports automatic PDF document analysis.",
    timestampFr: "Hier",
    timestampEn: "Yesterday",
    read: false,
    link: "/savoir",
  },
  {
    id: "notif-4",
    type: "internship",
    titleFr: "Statut Candidature Stage",
    titleEn: "Internship Application Status",
    messageFr:
      "Votre dossier pour 'Chercheur en Deep Learning' est en cours de deuxième évaluation.",
    messageEn: "Your application for 'Deep Learning Researcher' is under second review.",
    timestampFr: "Il y a 2 jours",
    timestampEn: "2 days ago",
    read: true,
    link: "/dashboard",
  },
  {
    id: "notif-5",
    type: "system",
    titleFr: "Bienvenue sur Genove",
    titleEn: "Welcome to Genove",
    messageFr: "Votre espace membre est prêt. Profitez de votre tableau de bord et des outils R&D.",
    messageEn: "Your member workspace is ready. Enjoy your dashboard and R&D tools.",
    timestampFr: "Il y a 3 jours",
    timestampEn: "3 days ago",
    read: true,
    link: "/dashboard",
  },
];

export function NotificationWidget({
  isMobile = false,
  showLabel = false,
  label,
}: {
  isMobile?: boolean;
  showLabel?: boolean;
  label?: string;
}) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "project" | "course">("all");
  const [notifToDelete, setNotifToDelete] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside clicks to close the popover when not expanded
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        !isExpanded &&
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isExpanded]);

  // Lock body scroll whenever notification widget or modal is open
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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const resetNotifications = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setNotifications(INITIAL_NOTIFICATIONS);
    setFilter("all");
  };

  const handleGoToDashboard = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
    setIsExpanded(false);
    navigate({ to: "/dashboard" });
    if (typeof window !== "undefined" && window.location.pathname !== "/dashboard") {
      window.location.href = "/dashboard";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "project") return n.type === "project";
    if (filter === "course") return n.type === "course";
    return true;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "project":
        return <FolderGit2 className="h-4 w-4 text-emerald-400" />;
      case "course":
        return <GraduationCap className="h-4 w-4 text-amber-400" />;
      case "ai":
        return <Bot className="h-4 w-4 text-purple-300" />;
      case "internship":
        return <Briefcase className="h-4 w-4 text-blue-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-amber-300" />;
    }
  };

  const getIconBg = (type: NotificationItem["type"]) => {
    switch (type) {
      case "project":
        return "bg-emerald-950/80 border-emerald-500/40";
      case "course":
        return "bg-amber-950/80 border-amber-500/40";
      case "ai":
        return "bg-purple-950/80 border-purple-500/40";
      case "internship":
        return "bg-blue-950/80 border-blue-500/40";
      default:
        return "bg-purple-950/80 border-purple-500/40";
    }
  };

  // Content Component rendered inside both Popover and Modal
  const renderNotificationContent = () => (
    <div className="flex flex-col h-full w-full bg-[#180E30] text-slate-100 relative overflow-hidden">
      {/* Top Gold Shimmer Ray */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent pointer-events-none z-20" />

      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-purple-900/50 px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[#1D103B] via-[#180E30] to-[#1D103B] gap-2 relative z-10">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-xs">
            <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-amber-400 fill-amber-400/30" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight shrink-0">
                {language === "fr" ? "Notifications" : "Notifications"}
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                  {unreadCount} {language === "fr" ? "nouvelles" : "new"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-purple-200/70 truncate hidden sm:block mt-0.5">
              {language === "fr"
                ? "Mises à jour R&D, cours et opportunités Genove"
                : "Genove R&D updates, courses, and opportunities"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 h-8.5 px-2.5 sm:px-3 text-xs font-extrabold text-purple-200 transition-all cursor-pointer border border-purple-500/30 shadow-xs whitespace-nowrap active:scale-95 hover:text-white"
              title={language === "fr" ? "Tout marquer comme lu" : "Mark all as read"}
            >
              <CheckCheck className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {language === "fr" ? "Tout marquer lu" : "Mark read"}
              </span>
            </button>
          )}

          {/* Fullscreen / Minimize Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="grid h-8.5 w-8.5 place-items-center rounded-xl text-purple-200 hover:text-white hover:bg-purple-900/50 transition-colors cursor-pointer border border-purple-500/30 active:scale-95"
            title={
              isExpanded
                ? language === "fr"
                  ? "Réduire en popover"
                  : "Minimize view"
                : language === "fr"
                  ? "Agrandir l'interface"
                  : "Fullscreen mode"
            }
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4 text-amber-400" />
            ) : (
              <Maximize2 className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setIsOpen(false);
            }}
            className="grid h-8.5 w-8.5 place-items-center rounded-xl bg-purple-950/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-purple-800/40 transition-colors cursor-pointer active:scale-95"
            title={language === "fr" ? "Fermer" : "Close"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-purple-900/40 bg-[#120924]/80 overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] w-full py-0.5">
          {(
            [
              { id: "all", labelFr: "Toutes", labelEn: "All" },
              { id: "unread", labelFr: "Non lues", labelEn: "Unread" },
              { id: "project", labelFr: "Projets R&D", labelEn: "R&D Projects" },
              { id: "course", labelFr: "Formations", labelEn: "Courses" },
            ] as const
          ).map((tab) => {
            const count =
              tab.id === "unread"
                ? unreadCount
                : tab.id === "project"
                  ? notifications.filter((n) => n.type === "project").length
                  : tab.id === "course"
                    ? notifications.filter((n) => n.type === "course").length
                    : notifications.length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border active:scale-95 ${
                  filter === tab.id
                    ? "bg-gradient-to-r from-[#8C52FF] to-[#7030EF] text-white border-purple-400/50 shadow-md shadow-purple-500/25"
                    : "bg-[#180E30] text-purple-200/80 border-purple-900/50 hover:text-white hover:bg-purple-950/60"
                }`}
              >
                <span className="whitespace-nowrap">
                  {language === "fr" ? tab.labelFr : tab.labelEn}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    filter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-purple-950 text-amber-400 border border-purple-800/40"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-purple-900/30 [-webkit-overflow-scrolling:touch] custom-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[220px]">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-950/60 border border-purple-800/50 text-amber-400 mb-2">
              <Bell className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-white">
              {language === "fr" ? "Aucune notification" : "No notifications"}
            </p>
            <p className="text-[11px] text-purple-300/60 mt-0.5 mb-3">
              {language === "fr" ? "Vous êtes totalement à jour !" : "You are all caught up!"}
            </p>
            {notifications.length < INITIAL_NOTIFICATIONS.length && (
              <button
                type="button"
                onClick={resetNotifications}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-400/40 bg-amber-400/10 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition-all cursor-pointer active:scale-95"
              >
                <span>{language === "fr" ? "Réinitialiser la liste" : "Reset notifications"}</span>
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const title = language === "fr" ? notif.titleFr : notif.titleEn;
            const message = language === "fr" ? notif.messageFr : notif.messageEn;
            const timestamp = language === "fr" ? notif.timestampFr : notif.timestampEn;

            return (
              <div
                key={notif.id}
                onClick={() => {
                  markAsRead(notif.id);
                  if (notif.link) {
                    setIsOpen(false);
                    setIsExpanded(false);
                    navigate({ to: notif.link });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`group relative flex items-start gap-3 p-3.5 sm:p-4 transition-all cursor-pointer w-full ${
                  notif.read
                    ? "bg-[#180E30]/60 hover:bg-[#1F133E]"
                    : "bg-[#221445] hover:bg-[#281852] border-l-4 border-l-amber-400"
                }`}
              >
                {/* Category Icon */}
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${getIconBg(
                    notif.type,
                  )} shadow-xs mt-0.5`}
                >
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <h4
                      className={`text-xs sm:text-sm leading-tight ${
                        notif.read ? "text-slate-200 font-bold" : "text-white font-black"
                      }`}
                    >
                      {title}
                    </h4>
                    {!notif.read && (
                      <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {language === "fr" ? "Nouveau" : "New"}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300/80 leading-relaxed line-clamp-2">
                    {message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-0.5">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-300/70">
                      <Clock className="h-3 w-3 text-amber-400/80 shrink-0" />
                      {timestamp}
                    </span>

                    {notif.link && (
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#8C52FF] group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                        {language === "fr" ? "Voir" : "View"}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Trash/Delete Action */}
                <button
                  type="button"
                  onClick={(e) => deleteNotification(notif.id, e)}
                  className="absolute top-3 right-2 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/20 cursor-pointer active:scale-90"
                  title={language === "fr" ? "Supprimer cette notification" : "Delete notification"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog for Deletion */}
      {notifToDelete && (
        <div
          className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setNotifToDelete(null);
          }}
        >
          <div
            className="bg-[#180E30] rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-purple-500/40 flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-11 w-11 rounded-full bg-red-500/20 border border-red-500/40 grid place-items-center text-red-400 mb-2.5">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-extrabold text-white mb-1">
              {language === "fr" ? "Supprimer le message ?" : "Delete message?"}
            </h3>
            <p className="text-xs text-slate-300/80 mb-4 leading-relaxed">
              {language === "fr"
                ? "Voulez-vous supprimer cette notification de votre liste ?"
                : "Do you want to delete this notification from your list?"}
            </p>
            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setNotifToDelete(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-purple-800/40 bg-purple-950/60 hover:bg-purple-900/60 text-xs font-bold text-slate-200 transition-all cursor-pointer active:scale-95"
              >
                {language === "fr" ? "Annuler" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (notifToDelete) {
                    deleteNotification(notifToDelete);
                    setNotifToDelete(null);
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-md shadow-red-500/25 transition-all cursor-pointer active:scale-95"
              >
                {language === "fr" ? "Supprimer" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="shrink-0 border-t border-purple-900/50 p-3 sm:p-3.5 bg-[#120924] flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-800/40 bg-purple-950/40 text-xs font-extrabold text-slate-200 hover:text-white hover:bg-purple-900/50 transition-colors cursor-pointer active:scale-95"
        >
          {isExpanded ? (
            <Minimize2 className="h-3.5 w-3.5 text-amber-400" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span>
            {isExpanded
              ? language === "fr"
                ? "Réduire"
                : "Minimize"
              : language === "fr"
                ? "Agrandir"
                : "Expand"}
          </span>
        </button>

        <Link
          to="/dashboard"
          onClick={() => {
            setIsOpen(false);
            setIsExpanded(false);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8C52FF] to-[#7030EF] text-xs font-black text-white shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 transition-all cursor-pointer active:scale-95"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-amber-300" />
          <span>{language === "fr" ? "Accéder au Dashboard" : "Go to Dashboard"}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`relative ${showLabel ? "w-full" : ""}`} ref={widgetRef}>
      {showLabel ? (
        /* Row Trigger Button with Bell Icon in front of Label */
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer min-h-[44px] w-full text-left ${
            isOpen
              ? "border-amber-400 bg-amber-400/25 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.35)]"
              : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/20"
          }`}
          aria-label={label || (language === "fr" ? "Notifications" : "Notifications")}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Bell Icon with Badge */}
            <div className="relative grid h-8 w-8 place-items-center rounded-full border border-amber-400/60 bg-amber-400/20 text-amber-300 shrink-0 shadow-xs">
              <Bell
                className={`h-4 w-4 text-amber-300 fill-amber-300/30 ${
                  unreadCount > 0 ? "animate-pulse" : ""
                }`}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-amber-500 px-1 text-[9px] font-black text-white shadow-md shadow-red-500/40 border border-white/40 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-200 truncate">
              {label || (language === "fr" ? "Notifications" : "Notifications")}
            </span>
          </div>

          <ChevronRight
            className={`h-4 w-4 text-amber-400/80 transition-transform shrink-0 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </button>
      ) : (
        /* Trigger Bell Icon Button */
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative grid h-10 w-10 min-h-[40px] min-w-[40px] place-items-center rounded-full border transition-all duration-200 cursor-pointer shrink-0 ${
            isOpen
              ? "border-amber-400 bg-amber-400/30 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.5)] scale-105"
              : "border-amber-400/60 bg-amber-400/15 text-amber-300 hover:text-amber-200 hover:bg-amber-400/25 hover:border-amber-400 shadow-sm shadow-amber-500/20"
          }`}
          aria-label={language === "fr" ? "Notifications" : "Notifications"}
          title={language === "fr" ? "Centre de notifications" : "Notification center"}
        >
          <Bell
            className={`h-5 w-5 text-amber-300 fill-amber-300/20 transition-transform ${
              unreadCount > 0 ? "animate-pulse" : ""
            }`}
          />

          {/* Unread Badge Indicator */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-amber-500 px-1 text-[9px] font-black text-white shadow-md shadow-red-500/40 border border-white/40 animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Single Clean Centered Modal Portal (Eliminates background duplicates & works perfectly on mobile and desktop) */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          >
            <div
              className={`w-full ${
                isExpanded
                  ? "max-w-2xl sm:max-w-3xl h-[88vh] sm:h-[620px]"
                  : "max-w-[420px] sm:max-w-md h-[500px] max-h-[85vh]"
              } rounded-3xl border border-purple-500/40 bg-[#180E30] text-slate-100 shadow-[0_25px_90px_rgba(0,0,0,0.9)] overflow-hidden ring-1 ring-purple-100/20 flex flex-col relative z-10 animate-in zoom-in-95 duration-200`}
              onClick={(e) => e.stopPropagation()}
            >
              {renderNotificationContent()}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
