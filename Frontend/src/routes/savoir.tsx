import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Send,
  Sparkles,
  Plus,
  Search,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RefreshCw,
  FileText,
  BookOpen,
  Layers,
  ShieldCheck,
  Mic,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Paperclip,
  X,
  History,
  Trash2,
  Bookmark,
  ExternalLink,
  Info,
  CheckCircle2,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  SquarePen,
  Library,
  Briefcase,
  Folder,
  Plug,
  Brain,
  Gift,
  MoreHorizontal,
  MessageSquare,
  Pin,
  Archive,
  Pencil,
  Share2,
  Sliders,
  Settings,
  LogOut,
  HelpCircle,
  User as UserIcon,
  LayoutGrid,
  List,
  File,
  FileImage,
  Camera,
  Mail,
  Phone,
  Building,
  Lock,
  User,
  LayoutDashboard,
  Globe,
  Shield,
} from "lucide-react";

const FranceFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block" viewBox="0 0 3 2">
    <rect width="1" height="2" fill="#002395" />
    <rect x="1" width="1" height="2" fill="#FFFFFF" />
    <rect x="2" width="1" height="2" fill="#ED2939" />
  </svg>
);

const UKFlag = () => (
  <svg className="w-4 h-3 rounded-[2px] overflow-hidden shrink-0 inline-block" viewBox="0 0 60 30">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);
import { useAuth } from "@/lib/auth-context";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useLanguage } from "@/lib/language-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { GenoveLogo } from "@/components/genove/GenoveLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getConversations,
  addMessageToConversation,
  createConversation,
  Conversation,
  saveConversations,
} from "@/lib/chat-storage";

export const Route = createFileRoute("/savoir")({
  head: () => ({
    meta: [
      { title: "Savoir+ — AI Knowledge Base — Genove" },
      {
        name: "description",
        content:
          "Ask your questions to Genove AI: sourced answers, conversation history, and suggestions.",
      },
      { property: "og:title", content: "Savoir+ — AI Knowledge Base — Genove" },
      { property: "og:description", content: "Q&A augmented by a multi-agent RAG pipeline." },
    ],
  }),
  component: Savoir,
});

const SUGGESTIONS = [
  "How does a RAG pipeline work?",
  "Which course path to become a Data Analyst?",
  "What projects for a beginner UX profile?",
  "Difference between a routing and synthesis agent?",
];

const MODELS = ["Genove RAG v2 (Default)", "Claude 3.5 Sonnet", "Gemini 1.5 Flash", "DeepSeek-V3"];

function Savoir() {
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#120924";
    return () => {
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  const suggestions = useMemo(() => {
    return language === "fr"
      ? [
          "Comment fonctionne un pipeline RAG ?",
          "Quel parcours pour devenir Data Analyst ?",
          "Quels projets pour un profil UX débutant ?",
          "Différence entre un agent de routage et de synthèse ?",
        ]
      : [
          "How does a RAG pipeline work?",
          "Which course path to become a Data Analyst?",
          "What projects for a beginner UX profile?",
          "Difference between a routing and synthesis agent?",
        ];
  }, [language]);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>(() => getConversations());
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConvId);
  }, [conversations, activeConvId]);

  const activeMessages = useMemo(() => {
    return currentConversation ? currentConversation.messages : [];
  }, [currentConversation]);

  const latestUserMsgId = useMemo(() => {
    const lastUserMsgIndex = [...activeMessages].reverse().findIndex((m) => m.sender === "user");
    return lastUserMsgIndex !== -1
      ? activeMessages[activeMessages.length - 1 - lastUserMsgIndex].id
      : null;
  }, [activeMessages]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMessageCount = useRef(0);

  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);
  const autoScrollActive = useRef(true);
  const isAutoScrollingRef = useRef(false);
  const isTypingRef = useRef(false);
  isTypingRef.current = isTyping;

  const handleScroll = () => {
    const el = sectionRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isScrollUp = distance > 150;
    setShowScrollDownBtn(isScrollUp);

    if (isTypingRef.current) {
      if (isAutoScrollingRef.current) {
        // Triggered by our own auto-scroll, do not disable auto-scroll
        isAutoScrollingRef.current = false;
      } else if (isScrollUp) {
        // User manually scrolled up during streaming, pause auto-scroll
        autoScrollActive.current = false;
      }
    }
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToBottom = () => {
    autoScrollActive.current = true;
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // New customized states for high-fidelity interactive elements
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Genove RAG v2 (Default)");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});

  const { user, isAuthenticated, logout, updateProfile, isLoading } = useAuth();
  const requireAuth = useRequireAuth();

  // Direct redirect to login for Savoir+ page as requested by user
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/connexion", search: { mode: "login", redirect: "/savoir" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Same login name principle requested by the user
  const getProfileDisplayName = () => {
    if (!user) return "User";
    return user.name;
  };
  const displayName = getProfileDisplayName();
  const nameParts = displayName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  const welcomeName = displayName.length < 10 ? displayName : firstName;

  const getInitials = () => {
    const parts = displayName.split(" ");
    if (parts.length > 1 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase() || "AN";
  };

  const renderAvatar = (
    sizeClass = "w-8 h-8",
    textClass = "text-xs",
    bgClass = "bg-gradient-to-br from-[#8C52FF] to-[#5B21B6] text-white ring-2 ring-amber-400 border border-purple-400/30",
  ) => {
    return (
      <div
        className={`${sizeClass} rounded-full ${bgClass} font-black flex items-center justify-center shrink-0 shadow-md overflow-hidden relative`}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className={textClass}>{getInitials()}</span>
        )}
      </div>
    );
  };

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileClickMenu, setShowProfileClickMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  // States for updating profile
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  useEffect(() => {
    if (showProfileEditModal && user) {
      setEditDisplayName(user.name);
      setEditUsername(user.username || user.email.split("@")[0]);
      setEditAvatarUrl(user.avatarUrl || "");
    }
  }, [showProfileEditModal, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getEditInitials = () => {
    const parts = editDisplayName.trim().split(" ");
    if (parts.length > 1 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return editDisplayName.trim().slice(0, 2).toUpperCase() || "AN";
  };

  // Custom states requested by the user
  const [viewMode, setViewMode] = useState<"chat" | "library" | "settings">("chat");

  useEffect(() => {
    if (viewMode === "settings") {
      setViewMode("chat");
      navigate({ to: "/parametres" });
    }
  }, [viewMode, navigate]);
  const [recentsOpen, setRecentsOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Profile Settings States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      return localStorage.getItem("genove_user_phone") || "";
    }
    return "";
  });
  const [profileOrg, setProfileOrg] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      return localStorage.getItem("genove_user_org") || "";
    }
    return "";
  });
  const [profileBio, setProfileBio] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      return localStorage.getItem("genove_user_bio") || "";
    }
    return "";
  });
  const [profileSubTab, setProfileSubTab] = useState<"profil" | "securite" | "preferences">(
    "profil",
  );

  const [weeklyDigest, setWeeklyDigest] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("genove_pref_weekly");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });
  const [partnerAlerts, setPartnerAlerts] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("genove_pref_partner");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });
  const [securityAlerts, setSecurityAlerts] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("genove_pref_security");
      return saved !== null ? saved === "true" : false;
    }
    return false;
  });
  const [langPref, setLangPref] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved =
        localStorage.getItem("genove_language") || localStorage.getItem("genove_pref_lang");
      if (saved && ["fr", "en"].includes(saved)) {
        return saved;
      }
    }
    return language || "en";
  });

  useEffect(() => {
    if (language) {
      setLangPref(language);
    }
  }, [language]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string | null>(null);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  // Sync stateful forms with Auth User
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileEmail(user.email || "");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const lowerName = profileName.toLowerCase();
      let finalName = profileName;
      if (
        lowerName === "njimalotfi" ||
        lowerName === "njima lotfi" ||
        lowerName === "lotfi njima" ||
        lowerName === "lotfinjima"
      ) {
        finalName = "Lotfi Njima";
      }
      await updateProfile(finalName, user.username || "", user.avatarUrl);
      localStorage.setItem("genove_user_phone", profilePhone);
      localStorage.setItem("genove_user_org", profileOrg);
      localStorage.setItem("genove_user_bio", profileBio);

      setSettingsSavedMsg("Profile saved successfully!");
      setTimeout(() => setSettingsSavedMsg(null), 3000);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordErrorMsg("Please fill in all fields.");
      setTimeout(() => setPasswordErrorMsg(null), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg("Passwords do not match.");
      setTimeout(() => setPasswordErrorMsg(null), 3000);
      return;
    }
    setPasswordSuccessMsg("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccessMsg(null), 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("genove_pref_weekly", String(weeklyDigest));
      localStorage.setItem("genove_pref_partner", String(partnerAlerts));
      localStorage.setItem("genove_pref_security", String(securityAlerts));
      localStorage.setItem("genove_pref_lang", langPref);
    }

    if (langPref === "fr" || langPref === "en") {
      setLanguage(langPref as "fr" | "en");
    }

    setSettingsSavedMsg("Preferences saved!");
    setTimeout(() => setSettingsSavedMsg(null), 3000);
  };

  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        return JSON.parse(localStorage.getItem("genove_pinned_chats") || "[]");
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [archivedIds, setArchivedIds] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        return JSON.parse(localStorage.getItem("genove_archived_chats") || "[]");
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRecentsDropdown, setShowRecentsDropdown] = useState(false);

  // Bibliothèque files state
  const [libTab, setLibTab] = useState<"tout" | "images" | "fichiers">("tout");
  const [libSearch, setLibSearch] = useState("");
  const [libFiles, setLibFiles] = useState(() => [
    {
      id: "1",
      name: "0949bc47-b235-4f42-8c96-b64503bdc25a.png",
      type: "image",
      date: "Jul 7",
      size: "15.5 KB",
    },
    {
      id: "2",
      name: "7f4163b5-5128-4f42-ad11-6718bf239c7d.png",
      type: "image",
      date: "Jul 7",
      size: "15.3 KB",
    },
    {
      id: "3",
      name: "909ea9dd-477c-472b-b853-942db2771b7e.png",
      type: "image",
      date: "Jul 7",
      size: "6.87 KB",
    },
    {
      id: "4",
      name: "1258d848-c099-44f1-8d3c-bcc8311246e6.png",
      type: "image",
      date: "Jul 7",
      size: "136 KB",
    },
    {
      id: "5",
      name: "b15f0564-9694-4156-a254-a20a9ed863d6.png",
      type: "image",
      date: "Jul 7",
      size: "91.8 KB",
    },
    { id: "6", name: "GENOVE_Architecture.pdf", type: "file", date: "Jul 3", size: "1.82 MB" },
  ]);
  const [selectedLibFiles, setSelectedLibFiles] = useState<string[]>([]);

  const displayedConversations = conversations.filter(
    (c) => c.messages && c.messages.length > 0 && !archivedIds.includes(c.id),
  );

  // Sorting: pinned conversations first, then chronological
  const sortedConversations = [...displayedConversations].sort((a, b) => {
    const aPinned = pinnedIds.includes(a.id);
    const bPinned = pinnedIds.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return b.createdAt - a.createdAt; // newest first
  });

  const filteredConversations = sortedConversations.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = c.title.toLowerCase().includes(q);
    const matchMessages = c.messages?.some((m) => m.text.toLowerCase().includes(q));
    return matchTitle || matchMessages;
  });

  // Set default closed state for sidebar on mount
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  // Close the Récents dropdown on clicking outside
  useEffect(() => {
    if (!showRecentsDropdown) return;
    const handleOutsideClick = () => {
      setShowRecentsDropdown(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showRecentsDropdown]);

  // Close the Profile menu on clicking outside
  useEffect(() => {
    if (!showProfileClickMenu) return;
    const handleOutsideClick = () => {
      setShowProfileClickMenu(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showProfileClickMenu]);

  // Prevent outer body scroll on this page to fit perfectly in viewport
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close the search modal on Escape key press
  useEffect(() => {
    if (!showSearchModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearchModal(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSearchModal]);

  // Smart ChatGPT-style scroll alignment
  useEffect(() => {
    const messageCount = activeMessages.length;
    if (messageCount > prevMessageCount.current) {
      // A new message has been added, reset auto-scroll to active
      autoScrollActive.current = true;
      const lastMessage = activeMessages[messageCount - 1];
      if (lastMessage && lastMessage.sender === "user") {
        // User asked a question: Scroll the user query to the top with a nice offset (scroll-mt)
        const performScroll = () => {
          const latestPromptElem = document.getElementById("latest-user-prompt");
          if (latestPromptElem) {
            latestPromptElem.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else if (scrollRef.current) {
            scrollRef.current.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }
        };
        setTimeout(performScroll, 120);
        setTimeout(performScroll, 350);
      } else {
        // Assistant finished response: Scroll to the end of the streaming area
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }
        }, 50);
      }
    } else if (isThinking) {
      // When thinking, reset auto-scroll to active and scroll thinking indicator into view
      autoScrollActive.current = true;
      setTimeout(() => {
        const thinkingElem = document.getElementById("assistant-thinking");
        if (thinkingElem) {
          thinkingElem.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }, 80);
    } else if (isTyping && streamingText) {
      // While typing, scroll automatically to bottom if user has not manually paused it by scrolling up
      if (autoScrollActive.current) {
        const el = sectionRef.current;
        if (el) {
          isAutoScrollingRef.current = true;
          const typewriterElem = document.getElementById("assistant-typewriter");
          if (typewriterElem) {
            typewriterElem.scrollIntoView({
              behavior: "auto",
              block: "end",
            });
          }
        }
      }
    }
    prevMessageCount.current = messageCount;
  }, [activeMessages, isThinking, isTyping, streamingText]);

  // Handle storage updates in real-time
  useEffect(() => {
    const handleUpdate = () => {
      setConversations(getConversations());
    };
    window.addEventListener("genove_chats_updated", handleUpdate);
    return () => window.removeEventListener("genove_chats_updated", handleUpdate);
  }, []);

  // Click outside handlers to close menus
  useEffect(() => {
    const handleClickOutside = () => {
      setShowModelDropdown(false);
      setShowAttachMenu(false);
      setActiveMenuId(null);
      setShowProfileMenu(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Format Response Utility for elegant dark container typography
  const renderFormattedText = (text: string, isUser: boolean = false) => {
    const textStyle = isUser
      ? "text-white leading-relaxed text-sm font-medium"
      : "text-slate-100 leading-relaxed text-sm";
    const boldStyle = "font-semibold text-accent";
    const bulletDotColor = "text-accent";

    return text.split("\n").map((line, i) => {
      let content = line;
      const isBullet = line.startsWith("•") || line.startsWith("-");
      const isNumbered = /^\d+\.\s/.test(line);

      if (isBullet) {
        content = line.substring(1).trim();
      } else if (isNumbered) {
        content = line.replace(/^\d+\.\s/, "");
      }

      const parts = content.split(/(\*\*[^*]+\*\*)/g);
      const parsedLine = parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} className={boldStyle}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={i} className="flex items-start gap-2.5 ml-1 my-1.5 animate-fade-in">
            <span className={`${bulletDotColor} mt-1.5 shrink-0 text-base`}>•</span>
            <span className={textStyle}>{parsedLine}</span>
          </div>
        );
      }

      if (isNumbered) {
        const num = line.match(/^\d+/)?.at(0) || "1";
        return (
          <div key={i} className="flex items-start gap-2.5 ml-1 my-1.5 animate-fade-in">
            <span className="font-bold text-accent bg-accent/10 rounded h-5 w-5 flex items-center justify-center text-[10px] mt-0.5 shrink-0 border border-accent/20">
              {num}
            </span>
            <span className={textStyle}>{parsedLine}</span>
          </div>
        );
      }

      return (
        <p
          key={i}
          className={`${line.trim() === "" ? "h-3" : "my-1.5"} ${textStyle} animate-fade-in`}
        >
          {parsedLine}
        </p>
      );
    });
  };

  const ask = (text: string) => {
    if (!requireAuth()) return;
    const t = text.trim();
    if (!t || isThinking || isTyping) return;

    let convId = activeConvId;

    if (!convId) {
      const newConv = createConversation(t, "Savoir+");
      convId = newConv.id;
      setActiveConvId(newConv.id);
    }

    addMessageToConversation(convId, "user", t);
    setConversations(getConversations());
    setQ("");
    setAttachedFile(null); // Clear active attachment
    setIsThinking(true);

    let responseText = "";
    let sources: { t: string; s: string }[] = [];
    const lower = t.toLowerCase();

    if (
      lower.includes("training") ||
      lower.includes("course") ||
      lower.includes("catalog") ||
      lower.includes("discover") ||
      lower.includes("learn")
    ) {
      responseText =
        "Genove offers a wide selection of top-tier courses focusing on AI, Data, Design, and Product Development. Our flagship pathways include:\n\n" +
        "• **Data Analyst**: Master end-to-end collection, processing, and data modeling.\n" +
        "• **Product Owner & UX Design**: Design exceptional user-centered digital products.\n" +
        "• **Applied Generative AI**: Learn to integrate LLMs and intelligent agents into professional workflows.\n\n" +
        "All our programs are certified and taught by expert trainers. Would you like to explore our full course catalog?";
      sources = [
        { t: "Genove Course Catalog", s: "2026 Season" },
        { t: "National Certification Standards", s: "Quality Certification" },
      ];
    } else if (
      lower.includes("work") ||
      lower.includes("how") ||
      lower.includes("rag") ||
      lower.includes("ai") ||
      lower.includes("pipeline") ||
      lower.includes("savoir")
    ) {
      responseText =
        "Genove's intelligent assistant relies on a state-of-the-art RAG (Retrieval-Augmented Generation) architecture combined with a coordinated multi-agent pipeline:\n\n" +
        "1. **Targeted Routing**: Analysis of your semantic intent by an initial triage agent.\n" +
        "2. **Document Retrieval**: Extraction of the most relevant excerpts from our secure knowledge base.\n" +
        "3. **High-Fidelity Synthesis**: Drafting a clear, seamless, and fully sourced response.\n\n" +
        "This guarantees reliable answers directly linked to our official documentation.";
      sources = [
        { t: "Genove RAG Architecture", s: "Technical Specifications" },
        { t: "Multi-Agent Whitepaper", s: "Sorbonne, 2025" },
      ];
    } else if (
      lower.includes("contact") ||
      lower.includes("team") ||
      lower.includes("advisor") ||
      lower.includes("phone") ||
      lower.includes("email") ||
      lower.includes("support")
    ) {
      responseText =
        "You can easily reach out to the Genove support team:\n\n" +
        "• 📧 **Email**: contact@genove.fr (response within 24 business hours)\n" +
        "• 📞 **Phone**: +33 (0)1 45 87 90 12 (Monday to Friday, 9 AM – 6 PM CET)\n" +
        "• 🤝 **Consultation**: Schedule a free 15-minute 1-on-1 session with our academic advisors.\n\n" +
        "We would be delighted to guide you through your training or hiring needs!";
      sources = [{ t: "Client Support & Relations", s: "Contact Portal" }];
    } else {
      responseText =
        `Our multi-agent pipeline (${selectedModel}) has analyzed your question:\n\n` +
        `« *${t}* »\n\n` +
        "Genove is an innovative ecosystem combining top-tier professional training, real-world application projects with industry partners, and qualified career matching.\n\n" +
        "To go further, explore our courses via the catalog, submit your own project, or ask specific questions about our certification tracks.";
      sources = [
        { t: "Genove Overview", s: "Integration Charter, p. 3" },
        { t: "Professional Training & AI", s: "Yassine Ben Salah" },
      ];
    }

    const currentConvId = convId;

    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);

      const words = responseText.split(" ");
      let currentText = "";
      let wordIndex = 0;

      setStreamingText("");

      const interval = setInterval(() => {
        if (wordIndex < words.length) {
          currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
          setStreamingText(currentText);
          wordIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setStreamingText("");

          addMessageToConversation(currentConvId, "ai", responseText, sources);
          setConversations(getConversations());
        }
      }, 35);
    }, 3000);
  };

  const handleDeleteAll = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("genove_savoir_chats");
    }
    setConversations([]);
    setActiveConvId(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("genove_chats_updated"));
    }
  };

  // Click handlers for interactive message buttons
  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleRate = (msgId: string, type: "up" | "down") => {
    setFeedback((prev) => {
      const next = { ...prev };
      if (next[msgId] === type) delete next[msgId];
      else next[msgId] = type;
      return next;
    });
  };

  const handleRegenerate = (text: string) => {
    ask(text);
  };

  // Listening mode simulation
  const startListeningSimulation = () => {
    if (isListening || isThinking || isTyping) return;
    setIsListening(true);
    setQ("");

    setTimeout(() => {
      setIsListening(false);
      setQ("How does a RAG pipeline work?");
    }, 2000);
  };

  // Helper simulated attachments action
  const selectAttachment = (fileName: string) => {
    setAttachedFile(fileName);
    setShowAttachMenu(false);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div
        className="h-screen -mt-16 pt-16 flex items-center justify-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-[#FBBF24]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pt-16 text-slate-100 overflow-hidden flex font-sans bg-[#120924]">
      {/* Background Container — Clean, professional tech background matching Genove theme */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {/* Base rich deep purple backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#180E30] via-[#120924] to-[#180E30]" />

        {/* Soft professional ambient glows */}
        <div className="absolute top-[-15%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-purple-600/15 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[25%] w-[42rem] h-[42rem] rounded-full bg-indigo-600/15 blur-[120px]" />

        {/* Micro Tech Grid Overlay matching website theme */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

        {/* Subtle radial light highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_70%)]" />
      </div>

      {/* BACKDROP OVERLAY FOR MOBILE SIDEBAR */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 animate-fade-in"
        />
      )}

      {/* THIN RAIL (COLLAPSED STATE) - DESKTOP ONLY */}
      {!sidebarOpen && !isMobile && (
        <aside className="w-[68px] bg-transparent border-r border-white/5 flex flex-col items-center justify-between py-4 h-full shrink-0 z-20 transition-all duration-300 animate-fade-in">
          <div className="flex flex-col items-center gap-6 w-full px-2">
            {/* Sidebar Toggle Button with Custom Tooltip */}
            <div className="relative group w-full flex justify-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-all duration-200 cursor-pointer shadow-md border border-white/5"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </button>
              {/* Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#180C36] border border-purple-500/30 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl font-medium">
                {language === "fr" ? "Ouvrir le menu" : "Open sidebar"}
              </div>
            </div>

            {/* Other Quick Action Icons */}
            <div className="flex flex-col items-center gap-5 mt-2">
              <div className="relative group">
                <button
                  onClick={() => {
                    setActiveConvId(null);
                    setQ("");
                  }}
                  className="p-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                >
                  <SquarePen className="h-5 w-5" />
                </button>
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#180C36] border border-purple-500/30 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl font-medium">
                  {language === "fr" ? "Nouvelle discussion" : "New chat"}
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={() => {
                    setShowSearchModal(true);
                  }}
                  className="p-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                >
                  <Search className="h-5 w-5" />
                </button>
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#180C36] border border-purple-500/30 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl font-medium">
                  {language === "fr" ? "Rechercher" : "Search"}
                </div>
              </div>

              <div className="relative group">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRecentsDropdown(!showRecentsDropdown);
                  }}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    showRecentsDropdown
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#180C36] border border-purple-500/30 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl font-medium">
                  {language === "fr" ? "Discussions récentes" : "Recent Discussions"}
                </div>

                {/* Discussions dropdown */}
                {showRecentsDropdown && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-16 top-0 bg-[#16213e] border border-white/10 rounded-2xl p-4 shadow-2xl w-64 z-50 text-white animate-fade-in flex flex-col gap-2"
                  >
                    <div className="text-[13px] font-bold text-slate-400 uppercase tracking-wider pb-1 select-none">
                      {language === "fr" ? "RÉCENTS" : "RECENTS"}
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                      {displayedConversations.length === 0 ? (
                        <div className="text-xs text-slate-500 py-3 px-1 italic select-none">
                          {language === "fr" ? "Aucune discussion" : "No discussions"}
                        </div>
                      ) : (
                        sortedConversations.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setActiveConvId(c.id);
                              setViewMode("chat");
                              setShowRecentsDropdown(false);
                            }}
                            className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-all truncate block cursor-pointer border ${
                              c.id === activeConvId
                                ? "bg-white/15 border-white/10 text-white font-semibold"
                                : "hover:bg-white/5 text-white/90 border-transparent"
                            }`}
                          >
                            {c.title ||
                              (language === "fr" ? "Nouvelle discussion" : "New discussion")}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Initials Avatar */}
          <div className="relative group/avatar">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileClickMenu(!showProfileClickMenu);
              }}
              className="cursor-pointer hover:opacity-90 transition-all"
            >
              {renderAvatar("w-10 h-10", "text-sm")}
            </div>

            {/* Hover name tooltip */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#0d1839]/95 backdrop-blur-md border border-white/10 text-white text-xs px-3.5 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl font-semibold flex items-center gap-1.5">
              <span className="text-accent">{firstName}</span>
              <span>{lastName}</span>
            </div>

            {/* CLICK POPUP INTERFACE (Image 2) with matching deep blue site design */}
            {showProfileClickMenu && (
              <div
                className="absolute left-14 bottom-0 bg-[#0d1527] text-white border border-white/10 rounded-2xl p-1.5 shadow-2xl w-64 z-50 flex flex-col select-none animate-in fade-in slide-in-from-bottom-2 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header user info - triggers Hover Interface on Hover */}
                <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer group/header relative">
                  {renderAvatar("w-8 h-8", "text-xs")}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate text-white">{displayName}</div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover/header:translate-x-0.5 transition-transform" />

                  {/* HOVER INTERFACE (Image 3) rendered adjacent to the main click menu - Pure CSS Hover */}
                  <div className="absolute left-full top-0 pl-3 z-[60] opacity-0 translate-x-1 scale-95 pointer-events-none group-hover/header:opacity-100 group-hover/header:translate-x-0 group-hover/header:scale-100 group-hover/header:pointer-events-auto transition-all duration-200 ease-out">
                    <div className="bg-[#0d1527] text-white border border-white/10 rounded-2xl p-3.5 shadow-2xl w-72 flex flex-col select-none">
                      {/* Email row with centered icon container for perfect horizontal alignment */}
                      <div className="flex items-center gap-3 px-1 py-1 text-slate-300 text-xs">
                        <div className="w-7 h-7 flex items-center justify-center shrink-0">
                          <UserIcon className="h-4 w-4 text-[#E5A93C]" />
                        </div>
                        <span className="truncate">{user?.email || "amenallah.njima@esen.tn"}</span>
                      </div>

                      {/* Profile User row with identical layout dimensions */}
                      <div className="flex items-center gap-3 px-1 py-2 text-white">
                        {renderAvatar("w-7 h-7", "text-[10px]")}
                        <span className="text-xs font-semibold flex-1 truncate">
                          {user?.name || displayName}
                        </span>
                        <Check className="h-3.5 w-3.5 text-[#E5A93C] shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10 my-1.5" />

                {/* Menu Items */}
                <div className="space-y-0.5">
                  {/* 1. Profil */}
                  <button
                    onClick={() => {
                      setShowProfileClickMenu(false);
                      navigate({ to: "/parametres", search: { tab: "profile" } });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left cursor-pointer font-semibold"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-[#E5A93C] shrink-0" />
                    <span className="flex-1 truncate">
                      {language === "fr" ? "Profil" : "Profile"}
                    </span>
                  </button>

                  {/* 2. Tableau de bord */}
                  <button
                    onClick={() => {
                      setShowProfileClickMenu(false);
                      navigate({ to: "/dashboard" });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left cursor-pointer font-semibold"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#E5A93C] shrink-0" />
                    <span className="flex-1 truncate">
                      {language === "fr" ? "Tableau de bord" : "Dashboard"}
                    </span>
                  </button>

                  {/* 3. Langue */}
                  <div className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-200 hover:bg-white/5 rounded-lg transition-all">
                    <div className="flex items-center gap-3">
                      <Globe className="h-3.5 w-3.5 text-[#E5A93C] shrink-0" />
                      <span className="font-semibold">
                        {language === "fr" ? "Langue" : "Language"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLanguage("fr");
                        }}
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          language === "fr"
                            ? "bg-[#8C52FF] text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                        title="Français"
                      >
                        <FranceFlag />
                        FR
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLanguage("en");
                        }}
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          language === "en"
                            ? "bg-[#8C52FF] text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                        title="English"
                      >
                        <UKFlag />
                        EN
                      </button>
                    </div>
                  </div>

                  {/* 4. Sécurité */}
                  <button
                    onClick={() => {
                      setShowProfileClickMenu(false);
                      navigate({ to: "/parametres", search: { tab: "security" } });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left cursor-pointer font-semibold"
                  >
                    <Shield className="h-3.5 w-3.5 text-[#E5A93C] shrink-0" />
                    <span className="flex-1 truncate">
                      {language === "fr" ? "Sécurité" : "Security"}
                    </span>
                  </button>
                </div>

                <div className="h-px bg-white/10 my-1.5" />

                <div className="space-y-0.5">
                  {/* 5. Aide */}
                  <button
                    onClick={() => {
                      setShowProfileClickMenu(false);
                      navigate({ to: "/aide" });
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left cursor-pointer font-semibold"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{language === "fr" ? "Aide" : "Help"}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  </button>

                  {/* 6. Déconnexion */}
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(true);
                      setShowProfileClickMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-1.5 text-xs text-[#f87171] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-all text-left cursor-pointer font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5 text-[#f87171] shrink-0" />
                    <span className="flex-1 truncate">
                      {language === "fr" ? "Déconnexion" : "Log out"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* LEFT HISTORY SIDEBAR (OPEN STATE) */}
      {sidebarOpen && (
        <aside
          className={`w-[260px] border-r border-white/5 flex flex-col h-full shrink-0 z-30 transition-all duration-300 ${
            isMobile
              ? "absolute left-0 top-0 bg-[#0d1839]/95 backdrop-blur-md shadow-2xl border-r border-white/10"
              : "relative bg-transparent"
          }`}
        >
          {/* Top Header Row with Collapse button */}
          <div className="p-3 flex items-center justify-end border-b border-white/5 h-[56px]">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
              title="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          {/* Custom Sidebar Menu Items */}
          <div className="px-3 pt-2 pb-2 space-y-1">
            <button
              onClick={() => {
                setActiveConvId(null);
                setQ("");
                setSearchQuery("");
                setShowSearchModal(false);
                setViewMode("chat");
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full h-10 rounded-xl hover:bg-white/5 text-white/90 hover:text-white text-sm font-medium flex items-center gap-3 px-3 transition-all cursor-pointer ${
                activeConvId === null && viewMode === "chat"
                  ? "bg-white/10 text-white font-bold border border-white/5"
                  : ""
              }`}
            >
              <SquarePen className="h-5 w-5 text-[#E5A93C] shrink-0" />
              {language === "fr" ? "Nouvelle discussion" : "New chat"}
            </button>

            <button
              onClick={() => {
                setShowSearchModal(true);
              }}
              className="w-full h-10 rounded-xl hover:bg-white/5 text-white/90 hover:text-white text-sm font-medium flex items-center gap-3 px-3 transition-all cursor-pointer"
            >
              <Search className="h-5 w-5 text-[#E5A93C] shrink-0" />
              {language === "fr" ? "Rechercher" : "Search"}
            </button>

            <button
              onClick={() => {
                setViewMode("library");
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full h-10 rounded-xl hover:bg-white/5 text-white/90 hover:text-white text-sm font-medium flex items-center gap-3 px-3 transition-all cursor-pointer ${
                viewMode === "library"
                  ? "bg-white/10 text-white font-bold border border-white/5"
                  : ""
              }`}
            >
              <Library className="h-5 w-5 text-[#E5A93C] shrink-0" />
              {language === "fr" ? "Bibliothèque" : "Library"}
            </button>

            <button
              onClick={() => {
                navigate({ to: "/projets" });
                if (isMobile) setSidebarOpen(false);
              }}
              className="w-full h-10 rounded-xl hover:bg-white/5 text-white/90 hover:text-white text-sm font-medium flex items-center gap-3 px-3 transition-all cursor-pointer group"
            >
              <Folder className="h-5 w-5 text-[#E5A93C] shrink-0" />
              <span>{language === "fr" ? "Projets" : "Projects"}</span>
              <Plus className="h-4 w-4 ml-auto text-white/40 group-hover:text-white/80 transition-colors" />
            </button>
          </div>

          {/* Récents Title Section (Récents) */}
          <div
            onClick={() => {
              setRecentsOpen(!recentsOpen);
            }}
            className="px-4 pt-4 pb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-bold border-t border-white/5 mt-2 cursor-pointer hover:text-white transition-colors select-none"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              {language === "fr" ? "RÉCENTS" : "RECENTS"}
              {recentsOpen ? (
                <ChevronDown className="h-3 w-3 text-slate-500" />
              ) : (
                <ChevronRight className="h-3 w-3 text-slate-500" />
              )}
            </span>
            {recentsOpen && displayedConversations.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAll();
                }}
                className="hover:text-red-400 font-bold transition-colors text-[9px] uppercase cursor-pointer flex items-center gap-1"
                title={language === "fr" ? "Tout effacer" : "Clear all"}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Conversations scroll section */}
          {recentsOpen ? (
            <div className="flex-1 overflow-y-auto space-y-0.5 px-3 pr-1 custom-scrollbar">
              {filteredConversations.length === 0 && (
                <div className="text-sm text-slate-400 py-16 px-4 text-center font-medium opacity-60">
                  {searchQuery
                    ? language === "fr"
                      ? "Aucun résultat trouvé"
                      : "No results found"
                    : language === "fr"
                      ? "Vos conversations apparaîtront ici."
                      : "Your conversations will appear here."}
                </div>
              )}
              {filteredConversations.map((c) => {
                const isPinned = pinnedIds.includes(c.id);
                const isMenuOpen = activeMenuId === c.id;

                return (
                  <div key={c.id} className="relative group/item">
                    <button
                      onClick={() => {
                        setActiveConvId(c.id);
                        setViewMode("chat");
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`w-full text-left text-xs pl-3 pr-9 py-2.5 rounded-lg transition-all truncate block cursor-pointer border ${
                        c.id === activeConvId
                          ? "bg-white/15 border-white/20 text-white font-semibold"
                          : "hover:bg-white/5 text-white/90 border-transparent"
                      }`}
                    >
                      <div className="truncate font-medium flex items-center gap-1.5">
                        {isPinned && (
                          <Pin className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0 rotate-45" />
                        )}
                        <span className="truncate">
                          {c.title ||
                            (language === "fr" ? "Nouvelle discussion" : "New discussion")}
                        </span>
                      </div>
                    </button>

                    {/* 3 dots ellipsis button with DropdownMenu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer opacity-0 group-hover/item:opacity-100 data-[state=open]:opacity-100 data-[state=open]:bg-white/5`}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={12}
                        alignOffset={-4}
                        className="w-44 rounded-xl border border-white/10 bg-[#0d1839] p-1 shadow-2xl z-50 space-y-0.5 text-white animate-fade-in"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`https://genove.ai/savoir/share/${c.id}`);
                            alert(
                              language === "fr"
                                ? "Lien de partage copié dans le presse-papier !"
                                : "Share link copied to clipboard!",
                            );
                          }}
                          className="w-full px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 rounded-lg text-left transition-colors cursor-pointer outline-none"
                        >
                          <Share2 className="h-4 w-4 text-slate-400 shrink-0" />
                          {language === "fr" ? "Partager" : "Share"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setTimeout(() => {
                              const newTitle = prompt(
                                language === "fr"
                                  ? "Entrez le nouveau titre de la discussion :"
                                  : "Enter the new discussion title:",
                                c.title,
                              );
                              if (newTitle && newTitle.trim()) {
                                const updated = conversations.map((item) =>
                                  item.id === c.id ? { ...item, title: newTitle.trim() } : item,
                                );
                                setConversations(updated);
                                saveConversations(updated);
                              }
                            }, 100);
                          }}
                          className="w-full px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 rounded-lg text-left transition-colors cursor-pointer outline-none"
                        >
                          <Pencil className="h-4 w-4 text-slate-400 shrink-0" />
                          {language === "fr" ? "Renommer" : "Rename"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            let updatedPinned;
                            if (isPinned) {
                              updatedPinned = pinnedIds.filter((id) => id !== c.id);
                            } else {
                              updatedPinned = [...pinnedIds, c.id];
                            }
                            setPinnedIds(updatedPinned);
                            if (typeof localStorage !== "undefined") {
                              localStorage.setItem(
                                "genove_pinned_chats",
                                JSON.stringify(updatedPinned),
                              );
                            }
                          }}
                          className="w-full px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 rounded-lg text-left transition-colors cursor-pointer outline-none"
                        >
                          <Pin
                            className={`h-4 w-4 shrink-0 ${isPinned ? "text-amber-400 fill-amber-400" : "text-slate-400"}`}
                          />
                          {isPinned
                            ? language === "fr"
                              ? "Désépingler"
                              : "Unpin chat"
                            : language === "fr"
                              ? "Épingler"
                              : "Pin chat"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedArchived = [...archivedIds, c.id];
                            setArchivedIds(updatedArchived);
                            if (typeof localStorage !== "undefined") {
                              localStorage.setItem(
                                "genove_archived_chats",
                                JSON.stringify(updatedArchived),
                              );
                            }
                            if (activeConvId === c.id) {
                              setActiveConvId(null);
                            }
                            alert(
                              language === "fr" ? "Discussion archivée !" : "Discussion archived!",
                            );
                          }}
                          className="w-full px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 flex items-center gap-2.5 rounded-lg text-left transition-colors cursor-pointer outline-none"
                        >
                          <Archive className="h-4 w-4 text-slate-400 shrink-0" />
                          {language === "fr" ? "Archiver" : "Archive"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                language === "fr"
                                  ? "Voulez-vous supprimer cette discussion ?"
                                  : "Do you want to delete this discussion?",
                              )
                            ) {
                              const updated = conversations.filter((item) => item.id !== c.id);
                              setConversations(updated);
                              saveConversations(updated);
                              if (activeConvId === c.id) {
                                setActiveConvId(null);
                              }
                            }
                          }}
                          className="w-full px-2.5 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2.5 rounded-lg text-left transition-colors cursor-pointer outline-none"
                        >
                          <Trash2 className="h-4 w-4 text-red-400 shrink-0" />
                          {language === "fr" ? "Supprimer" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Bottom profile area with Settings and User Card */}
          <div className="p-3 border-t border-white/5 space-y-2 relative">
            {/* Direct Settings button - toggles the popup menu */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu((prev) => !prev);
              }}
              className={`w-full h-10 rounded-xl text-sm font-medium flex items-center gap-3 px-3 transition-all cursor-pointer animate-fade-in ${
                showProfileMenu
                  ? "bg-white/10 text-white font-bold"
                  : "hover:bg-white/5 text-white/90 hover:text-white"
              }`}
            >
              <Settings
                className={`h-5 w-5 shrink-0 ${
                  showProfileMenu ? "text-amber-400" : "text-slate-400"
                }`}
              />
              {language === "fr" ? "Paramètres" : "Settings"}
            </button>

            {/* Floating Profile Context Menu */}
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-28 left-3 right-3 rounded-2xl border border-purple-500/30 bg-[#0d1839]/98 backdrop-blur-xl p-2 shadow-2xl z-50 animate-fade-in w-[calc(100%-1.5rem)] space-y-1 select-none"
                >
                  {/* Profile Header Item */}
                  <div
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate({ to: "/parametres", search: { tab: "profile" } });
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      {renderAvatar("w-8 h-8", "text-xs")}
                      <div className="text-left min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {displayName}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {user?.email || "Membre Genove"}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  <div className="h-px bg-white/10 my-1" />

                  {/* 1. Profil */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate({ to: "/parametres", search: { tab: "profile" } });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <UserIcon className="h-4 w-4 text-[#E5A93C] shrink-0" />
                    {language === "fr" ? "Profil" : "Profile"}
                  </button>

                  {/* 2. Tableau de bord */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate({ to: "/dashboard" });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#E5A93C] shrink-0" />
                    {language === "fr" ? "Tableau de bord" : "Dashboard"}
                  </button>

                  {/* 3. Langue */}
                  <div className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-[#E5A93C] shrink-0" />
                      <span>{language === "fr" ? "Langue" : "Language"}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLanguage("fr");
                        }}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          language === "fr"
                            ? "bg-[#8C52FF] text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <FranceFlag />
                        FR
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLanguage("en");
                        }}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer ${
                          language === "en"
                            ? "bg-[#8C52FF] text-white shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <UKFlag />
                        EN
                      </button>
                    </div>
                  </div>

                  {/* 4. Sécurité */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate({ to: "/parametres", search: { tab: "security" } });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <Shield className="h-4 w-4 text-[#E5A93C] shrink-0" />
                    {language === "fr" ? "Sécurité" : "Security"}
                  </button>

                  <div className="h-px bg-white/10 my-1" />

                  {/* 5. Aide */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate({ to: "/aide" });
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-4 w-4 text-slate-300 shrink-0" />
                      <span>{language === "fr" ? "Aide" : "Help"}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>

                  {/* 6. Déconnexion */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-red-400 shrink-0" />
                    {language === "fr" ? "Déconnexion" : "Log out"}
                  </button>
                </div>
              </>
            )}

            {/* Profile Avatar Card (Navigates directly to profile) */}
            <div
              onClick={() => {
                setShowProfileMenu(false);
                navigate({ to: "/parametres", search: { tab: "profile" } });
              }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#132247]/40 border border-white/5 hover:bg-[#132247]/80 hover:border-amber-400/30 transition-all cursor-pointer relative animate-fade-in group"
            >
              {renderAvatar("w-10 h-10", "text-sm")}
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate leading-tight">
                  {displayName}
                </div>
                <div className="text-xs text-slate-400 font-medium leading-tight mt-0.5">
                  {language === "fr" ? "Étudiant" : "Student"}
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* CHAT MAIN INTERFACE PANEL */}
      <main className="flex-1 flex flex-col h-full relative z-10">
        {/* TOP BAR / NAVIGATION TOGGLES */}
        {isMobile && (
          <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-300 transition-colors cursor-pointer"
                title={sidebarOpen ? "Fermer l'historique" : "Ouvrir l'historique"}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </button>
            </div>
          </header>
        )}

        {/* WORKSPACE AREA */}
        <section
          ref={sectionRef}
          className={`flex-1 overflow-y-auto [touch-action:pan-y] p-4 md:p-6 custom-scrollbar flex flex-col relative ${
            viewMode === "library" || viewMode === "settings" || activeMessages.length > 0
              ? "justify-start"
              : "justify-center"
          }`}
        >
          {viewMode === "settings" ? (
            /* CONFIGURATION / PARAMÈTRES WORKSPACE WITH COSMIC BLUE/AMBER THEME */
            <div className="max-w-4xl mx-auto w-full py-6 animate-fade-in space-y-6 text-slate-100 flex-1 flex flex-col relative z-20">
              {/* Header block with Back to Chat trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5 font-sans">
                    <Settings className="h-6 w-6 text-amber-400" />
                    Savoir+ Settings
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage your personal information, security, and assistant preferences.
                  </p>
                </div>

                <button
                  onClick={() => setViewMode("chat")}
                  className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg self-start sm:self-auto"
                >
                  <ArrowUp className="h-4 w-4 -rotate-90 text-slate-400" />
                  Back to Chat
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Navigation: Profile summary and Sub tabs */}
                <div className="md:col-span-4 space-y-4">
                  {/* Public profile mini card */}
                  <div className="rounded-2xl border border-white/10 bg-[#0c1435]/60 p-5 text-center flex flex-col items-center gap-3.5 backdrop-blur-md shadow-2xl">
                    <div className="relative group/avatar-edit cursor-pointer">
                      {renderAvatar("w-20 h-20", "text-2xl")}
                      <div
                        onClick={() => {
                          setShowProfileEditModal(true);
                        }}
                        className="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover/avatar-edit:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-amber-200 uppercase tracking-wider select-none"
                      >
                        Modifier
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{displayName}</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {user?.email || "amenallah.njima@esen.tn"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Log out
                    </button>
                  </div>

                  {/* Tabs menu matching design of Savoir+ card style */}
                  <div className="rounded-2xl border border-white/10 bg-[#0c1435]/40 p-2 space-y-1 backdrop-blur-sm shadow-xl">
                    <button
                      type="button"
                      onClick={() => setProfileSubTab("profil")}
                      className={`w-full h-10 rounded-xl px-3 flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
                        profileSubTab === "profil"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <UserIcon className="h-4 w-4 text-[#E5A93C]" />
                      <span>Public profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfileSubTab("securite")}
                      className={`w-full h-10 rounded-xl px-3 flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
                        profileSubTab === "securite"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Lock className="h-4 w-4 text-[#E5A93C]" />
                      <span>Security & Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfileSubTab("preferences")}
                      className={`w-full h-10 rounded-xl px-3 flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
                        profileSubTab === "preferences"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Sliders className="h-4 w-4 text-[#E5A93C]" />
                      <span>Preferences</span>
                    </button>
                  </div>
                </div>

                {/* Right Form Display Area */}
                <div className="md:col-span-8">
                  {settingsSavedMsg && (
                    <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
                      <Check className="h-4 w-4" />
                      {settingsSavedMsg}
                    </div>
                  )}

                  {profileSubTab === "profil" ? (
                    <form
                      onSubmit={handleSaveProfile}
                      className="rounded-2xl border border-white/10 bg-[#0c1435]/60 p-6 space-y-4 backdrop-blur-md animate-fade-in shadow-2xl"
                    >
                      <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
                        Profile Information
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Full Name
                          </label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                              type="text"
                              value={profileName}
                              onChange={(e) => setProfileName(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-accent/40"
                              placeholder="Your full name"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                              type="email"
                              value={profileEmail}
                              disabled
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-400 focus:outline-none select-none cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                              type="text"
                              value={profilePhone}
                              onChange={(e) => setProfilePhone(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-accent/40"
                              placeholder="+216 98 765 432"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Organization / University
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <input
                              type="text"
                              value={profileOrg}
                              onChange={(e) => setProfileOrg(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-accent/40"
                              placeholder="e.g. University / Company"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase">
                          Short Bio
                        </label>
                        <textarea
                          rows={3}
                          value={profileBio}
                          onChange={(e) => setProfileBio(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-accent/40 resize-none leading-relaxed"
                          placeholder="Tell us briefly about yourself..."
                        />
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-end">
                        <button
                          type="submit"
                          className="h-9 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                        >
                          Save changes
                        </button>
                      </div>
                    </form>
                  ) : profileSubTab === "securite" ? (
                    <form
                      onSubmit={handleUpdatePassword}
                      className="rounded-2xl border border-white/10 bg-[#0c1435]/60 p-6 space-y-4 backdrop-blur-md animate-fade-in shadow-2xl"
                    >
                      <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
                        Security & Password
                      </h2>

                      {passwordSuccessMsg && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
                          <Check className="h-4 w-4" />
                          {passwordSuccessMsg}
                        </div>
                      )}

                      {passwordErrorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
                          <X className="h-4 w-4" />
                          {passwordErrorMsg}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Current password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-semibold text-white focus:outline-none focus:border-accent/40"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">
                              New password
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-semibold text-white focus:outline-none focus:border-accent/40"
                              placeholder="••••••••"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">
                              Confirm new password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-semibold text-white focus:outline-none focus:border-accent/40"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-end">
                        <button
                          type="submit"
                          className="h-9 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                        >
                          Update password
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleSavePreferences}
                      className="rounded-2xl border border-white/10 bg-[#0c1435]/60 p-6 space-y-5 backdrop-blur-md animate-fade-in shadow-2xl"
                    >
                      <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
                        General Preferences
                      </h2>

                      <div className="space-y-4">
                        {/* Language Selection */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">
                            Interface Language
                          </label>
                          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5 w-fit">
                            {[
                              { code: "fr", label: "Français" },
                              { code: "en", label: "English" },
                            ].map((lang) => (
                              <button
                                key={lang.code}
                                type="button"
                                onClick={() => setLangPref(lang.code)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  langPref === lang.code
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                {lang.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="h-px bg-white/10 my-1" />

                        {/* Notifications Toggles */}
                        <div className="space-y-3.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                            Notification System
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer group select-none">
                            <input
                              type="checkbox"
                              checked={weeklyDigest}
                              onChange={(e) => setWeeklyDigest(e.target.checked)}
                              className="mt-0.5 rounded border-white/10 bg-[#121212] text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400"
                            />
                            <div className="text-left">
                              <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                                Weekly Digest
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Receive a weekly report of your progress and learning
                                recommendations.
                              </p>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer group select-none">
                            <input
                              type="checkbox"
                              checked={partnerAlerts}
                              onChange={(e) => setPartnerAlerts(e.target.checked)}
                              className="mt-0.5 rounded border-white/10 bg-[#121212] text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400"
                            />
                            <div className="text-left">
                              <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                                Partner Alerts
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Stay informed about internship opportunities and exclusive
                                graduation projects.
                              </p>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer group select-none">
                            <input
                              type="checkbox"
                              checked={securityAlerts}
                              onChange={(e) => setSecurityAlerts(e.target.checked)}
                              className="mt-0.5 rounded border-white/10 bg-[#121212] text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400"
                            />
                            <div className="text-left">
                              <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                                Enhanced Security
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Get email alerts for every new login to your student account.
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-end">
                        <button
                          type="submit"
                          className="h-9 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                        >
                          Save preferences
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : viewMode === "library" ? (
            /* BIBLIOTHÈQUE DASHBOARD WORKSPACE (MATCHES SCREENSHOT 3 PRECISELY) */
            <div className="max-w-4xl mx-auto w-full py-6 animate-fade-in space-y-6 text-slate-100 flex-1 flex flex-col">
              {/* Header block */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <Library className="h-6 w-6 text-amber-400" />
                    Library
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage your training documents, architecture diagrams, and learning resources.
                  </p>
                </div>

                {/* Nouveau/Upload button */}
                <button
                  onClick={() => {
                    const name = prompt("Enter the name of the new document:");
                    if (name && name.trim()) {
                      const ext = name.includes(".") ? "" : ".pdf";
                      const size = "120 KB";
                      const date = "Today";
                      const newFile = {
                        id: String(Date.now()),
                        name: name.trim() + ext,
                        type: name.endsWith(".png") || name.endsWith(".jpg") ? "image" : "file",
                        date,
                        size,
                      };
                      setLibFiles([newFile, ...libFiles]);
                    }
                  }}
                  className="h-9 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg self-start sm:self-auto shrink-0"
                >
                  <Plus className="h-4 w-4 text-slate-950 stroke-[3px]" />
                  New
                </button>
              </div>

              {/* Tabs and Search row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-3">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 self-start">
                  {[
                    { id: "tout", label: "All" },
                    { id: "images", label: "Images" },
                    { id: "fichiers", label: "Files" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setLibTab(tab.id as "tout" | "images" | "fichiers")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        libTab === tab.id
                          ? "bg-white/10 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search file input */}
                <div className="relative max-w-sm w-full">
                  <input
                    type="text"
                    placeholder="Search in library..."
                    value={libSearch}
                    onChange={(e) => setLibSearch(e.target.value)}
                    className="w-full h-9 rounded-xl bg-[#132247]/50 border border-white/10 text-xs text-white pl-9 pr-8 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 placeholder:text-slate-500 font-medium"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  {libSearch && (
                    <button
                      onClick={() => setLibSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white hover:bg-white/10 rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Multi-selection bar if elements are checked */}
              {selectedLibFiles.length > 0 && (
                <div className="bg-amber-400/10 border border-amber-400/20 px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
                  <span className="text-xs font-bold text-amber-300">
                    {selectedLibFiles.length}{" "}
                    {selectedLibFiles.length > 1 ? "files selected" : "file selected"}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        // Ask / attach these to current chat!
                        const names = libFiles
                          .filter((f) => selectedLibFiles.includes(f.id))
                          .map((f) => f.name);
                        setAttachedFile(names.join(", "));
                        setViewMode("chat");
                        setSelectedLibFiles([]);
                        alert(`Files attached to discussion: ${names.join(", ")}`);
                      }}
                      className="px-3 py-1.5 bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Attach to discussion
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Do you want to delete the ${selectedLibFiles.length} selected files?`,
                          )
                        ) {
                          setLibFiles(libFiles.filter((f) => !selectedLibFiles.includes(f.id)));
                          setSelectedLibFiles([]);
                        }
                      }}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Files Table layout */}
              <div className="bg-[#090909]/60 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/2 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={
                              selectedLibFiles.length === libFiles.length && libFiles.length > 0
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLibFiles(libFiles.map((f) => f.id));
                              } else {
                                setSelectedLibFiles([]);
                              }
                            }}
                            className="rounded border-white/10 bg-[#121212] text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400"
                          />
                        </th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4 w-32">Modified</th>
                        <th className="py-3 px-4 w-32">Size</th>
                        <th className="py-3 px-4 w-16 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {libFiles
                        .filter((file) => {
                          // Filter tab
                          if (libTab === "images" && file.type !== "image") return false;
                          if (libTab === "fichiers" && file.type !== "file") return false;
                          // Filter search
                          if (
                            libSearch &&
                            !file.name.toLowerCase().includes(libSearch.toLowerCase())
                          )
                            return false;
                          return true;
                        })
                        .map((file) => {
                          const isSelected = selectedLibFiles.includes(file.id);
                          return (
                            <tr
                              key={file.id}
                              className={`group hover:bg-white/5 transition-colors ${
                                isSelected ? "bg-white/2" : ""
                              }`}
                            >
                              <td className="py-3.5 px-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    if (isSelected) {
                                      setSelectedLibFiles(
                                        selectedLibFiles.filter((id) => id !== file.id),
                                      );
                                    } else {
                                      setSelectedLibFiles([...selectedLibFiles, file.id]);
                                    }
                                  }}
                                  className="rounded border-white/10 bg-[#121212] text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400"
                                />
                              </td>
                              <td className="py-3.5 px-4 font-medium text-xs text-white">
                                <div className="flex items-center gap-3">
                                  {file.type === "image" ? (
                                    <FileImage className="h-4 w-4 text-amber-400 shrink-0" />
                                  ) : (
                                    <File className="h-4 w-4 text-blue-400 shrink-0" />
                                  )}
                                  <span
                                    className="truncate max-w-md hover:underline cursor-pointer"
                                    onClick={() => {
                                      setAttachedFile(file.name);
                                      setViewMode("chat");
                                      alert(`File "${file.name}" selected.`);
                                    }}
                                  >
                                    {file.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-xs text-slate-400">{file.date}</td>
                              <td className="py-3.5 px-4 text-xs text-slate-400">{file.size}</td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => {
                                    if (confirm(`Do you want to delete "${file.name}"?`)) {
                                      setLibFiles(libFiles.filter((f) => f.id !== file.id));
                                      setSelectedLibFiles(
                                        selectedLibFiles.filter((id) => id !== file.id),
                                      );
                                    }
                                  }}
                                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      {libFiles.filter((file) => {
                        if (libTab === "images" && file.type !== "image") return false;
                        if (libTab === "fichiers" && file.type !== "file") return false;
                        if (libSearch && !file.name.toLowerCase().includes(libSearch.toLowerCase()))
                          return false;
                        return true;
                      }).length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-xs text-slate-500 font-semibold"
                          >
                            No documents found in the library.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeMessages.length === 0 && !isThinking && !isTyping ? (
            /* GORGEOUS WELCOME SCREEN (PERFECTLY CENTERED V-ALIGN AND H-ALIGN) */
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-4 md:py-6 animate-fade-in space-y-4 md:space-y-6">
              {/* MAIN TITLE (Customized display typography with user's name) */}
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-center leading-[1.15]">
                {t("savoir.heroTitle")}{" "}
                <span className="inline-block whitespace-nowrap">
                  <span className="text-accent">{welcomeName}</span>
                  &nbsp;?
                </span>
              </h1>

              {/* THE FLOATING CHATBOX - MATCHING BRAND PURPLE GLASS THEME */}
              <div className="w-full bg-[#180C36]/90 backdrop-blur-xl border border-purple-500/30 rounded-[24px] p-5 shadow-[0_15px_50px_rgba(140,82,255,0.15)] focus-within:border-accent/60 focus-within:shadow-[0_15px_50px_rgba(251,191,36,0.25)] transition-all relative">
                {/* Active Attachment Badge inside Input bar */}
                {attachedFile && (
                  <div className="mb-3 flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-xl self-start text-xs font-bold text-white w-fit animate-fade-in">
                    <FileText className="h-3.5 w-3.5 text-accent" />
                    <span>{attachedFile}</span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="p-0.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <textarea
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={isListening ? "Listening..." : t("savoir.placeholder")}
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(q);
                    }
                  }}
                  className="w-full bg-transparent text-base text-white placeholder-white/65 focus:outline-none resize-none font-semibold leading-relaxed pr-12 min-h-[50px] font-sans"
                />

                {/* BOTTOM TOOLBAR */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                  <div className="flex items-center gap-2">
                    {/* Attachment Toggle Trigger */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAttachMenu(!showAttachMenu);
                        }}
                        type="button"
                        className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Add context"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      {showAttachMenu && (
                        <div className="absolute left-0 bottom-10 w-60 rounded-xl border border-white/10 bg-[#132247] p-1.5 shadow-2xl z-50 animate-fade-in">
                          <button
                            onClick={() => selectAttachment("syllabus_formation_rag.pdf")}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                          >
                            <FileText className="h-3.5 w-3.5 text-accent" />
                            <span>Attach PDF Syllabus</span>
                          </button>
                          <button
                            onClick={() => selectAttachment("dashboard_architecture.png")}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                          >
                            <Layers className="h-3.5 w-3.5 text-blue-400" />
                            <span>Attach Diagram/Image</span>
                          </button>
                          <button
                            onClick={() =>
                              selectAttachment("https://genove.ai/referentiel-qualiopi")
                            }
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-purple-400" />
                            <span>Paste web link</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                      {selectedModel.split(" ")[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Voice simulation button */}
                    <button
                      onClick={startListeningSimulation}
                      type="button"
                      className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isListening
                          ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
                      }`}
                      title="Voice input"
                    >
                      <Mic className="h-3.5 w-3.5" />
                    </button>

                    {/* Clean upward send arrow */}
                    <button
                      onClick={() => ask(q)}
                      disabled={!q.trim() && !attachedFile}
                      className="h-8 w-8 rounded-full bg-white text-[#081229] flex items-center justify-center hover:bg-slate-200 transition-all disabled:opacity-50 disabled:hover:bg-white cursor-pointer shadow-lg shrink-0"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE SUGGESTION CHIPS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-4">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="p-3.5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md hover:border-accent/30 hover:bg-white/10 transition-all cursor-pointer text-left text-xs font-semibold text-slate-300 hover:text-white group flex items-start gap-3 hover:-translate-y-0.5 shadow-sm"
                  >
                    <div className="h-6 w-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/20 transition-all">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <span className="line-clamp-2">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ACTIVE CHAT WORKSPACE (CHATGPT-STYLE LAYOUT WITH PROMPT IMMEDIATELY BELOW MESSAGES) */
            <div className="max-w-4xl w-full flex-1 mx-auto px-2 sm:px-4 flex flex-col justify-between">
              <div className="space-y-6 pt-2 pb-4">
                {activeMessages.map((m) => (
                  <div key={m.id} className="space-y-4">
                    {/* USER MESSAGE */}
                    {m.sender === "user" ? (
                      <div
                        id={m.id === latestUserMsgId ? "latest-user-prompt" : undefined}
                        className="flex flex-row-reverse items-start gap-3 sm:gap-4 animate-fade-in ml-auto max-w-[95%] lg:max-w-[85%] lg:pl-16 scroll-mt-24"
                      >
                        {/* User avatar matching profile avatar design */}
                        <div className="shrink-0 mt-1">
                          {renderAvatar("w-8 h-8 sm:w-9 sm:h-9", "text-xs")}
                        </div>

                        <div className="bg-[#0b132c]/85 border border-white/10 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)] backdrop-blur-md w-fit max-w-full">
                          {/* Text bubble */}
                          <div className="text-slate-100 text-sm leading-relaxed font-semibold break-all sm:break-words [word-break:break-word] [overflow-wrap:anywhere]">
                            {renderFormattedText(m.text, true)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* AI MESSAGE */
                      <div className="flex items-start gap-3 sm:gap-4 animate-fade-in mr-auto max-w-[95%] lg:max-w-[85%] lg:pr-16">
                        {/* Brand sparkly logo avatar */}
                        <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#1C103C] border border-amber-400/50 p-1 shrink-0 shadow-lg mt-1">
                          <GenoveLogo variant="icon" height={22} />
                        </div>

                        <div className="flex-1 bg-[#0b132c]/85 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] space-y-4 backdrop-blur-md">
                          {/* Text bubble */}
                          <div className="text-slate-100 text-sm leading-relaxed font-semibold break-all sm:break-words [word-break:break-word] [overflow-wrap:anywhere]">
                            {renderFormattedText(m.text)}
                          </div>

                          {/* Citation Sources */}
                          {m.sources && m.sources.length > 0 && (
                            <div className="space-y-2 animate-fade-in pt-1">
                              <div className="text-[10px] uppercase tracking-wider text-accent font-extrabold flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-accent animate-pulse" />{" "}
                                Verified sources from Genove catalog
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {m.sources.map((s) => (
                                  <div
                                    key={s.t}
                                    className="rounded-xl border border-white/10 bg-[#132247]/50 p-3 flex items-start gap-3 hover:border-accent/20 transition-colors"
                                  >
                                    <FileText className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-white truncate">
                                        {s.t}
                                      </div>
                                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                        {s.s}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* HIGH-FIDELITY FEEDBACK BAR */}
                          <div className="flex items-center gap-3 text-slate-400 ml-1 border-t border-white/5 pt-2 max-w-xs">
                            {/* Copy button */}
                            <button
                              onClick={() => handleCopy(m.text, m.id)}
                              className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                              title="Copy text"
                            >
                              {copiedMsgId === m.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-accent" />
                                  <span className="text-accent animate-fade-in font-extrabold">
                                    Copied!
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>

                            {/* Regenerate button */}
                            <button
                              onClick={() =>
                                handleRegenerate(
                                  activeMessages[activeMessages.indexOf(m) - 1]?.text || m.text,
                                )
                              }
                              className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                              title="Regenerate"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              <span>Regenerate</span>
                            </button>

                            {/* Thumbs up button */}
                            <button
                              onClick={() => handleRate(m.id, "up")}
                              className={`p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer ${
                                feedback[m.id] === "up"
                                  ? "text-accent bg-accent/10"
                                  : "hover:text-white"
                              }`}
                              title="Helpful"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                            </button>

                            {/* Thumbs down button */}
                            <button
                              onClick={() => handleRate(m.id, "down")}
                              className={`p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer ${
                                feedback[m.id] === "down"
                                  ? "text-red-400 bg-red-400/10"
                                  : "hover:text-white"
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* THINKING MODE ANIMATION */}
                {isThinking && (
                  <div
                    id="assistant-thinking"
                    className="flex gap-3 items-center mr-auto max-w-[95%] lg:max-w-[85%] lg:pr-16 pt-3 animate-fade-in"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#180E30] border border-[#F4BAA2]/40 p-1 shrink-0 shadow-md">
                      <GenoveLogo
                        variant="icon"
                        height={22}
                        className="animate-[spin_3s_linear_infinite]"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-slate-200 select-none">
                      <span className="font-bold text-sm bg-gradient-to-r from-[#F4BAA2] via-[#FDE047] to-[#F59E0B] bg-clip-text text-transparent tracking-wide">
                        Thinking
                      </span>
                      <span className="inline-flex gap-1.5 items-center ml-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F4BAA2] animate-bounce [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FDE047] animate-bounce [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-bounce [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}

                {/* STREAMING TYPEWRITER */}
                {isTyping && streamingText && (
                  <div
                    id="assistant-typewriter"
                    className="flex items-start gap-4 mr-auto max-w-[95%] lg:max-w-[85%] lg:pr-16 pt-4 animate-fade-in"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#1C103C] border border-amber-400/50 p-1 shrink-0 shadow-lg mt-1">
                      <GenoveLogo variant="icon" height={22} />
                    </div>
                    <div className="flex-1 bg-[#0b132c]/85 border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] space-y-4 backdrop-blur-md">
                      <div className="text-slate-100 text-sm leading-relaxed font-semibold break-all sm:break-words [word-break:break-word] [overflow-wrap:anywhere]">
                        {renderFormattedText(streamingText)}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>

              {/* PROMPT INPUT SITUATED RIGHT BELOW MESSAGES / STICKY AT BOTTOM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(q);
                }}
                className="sticky bottom-2 sm:bottom-4 my-2 z-20 w-full"
              >
                <div className="bg-[#180C36]/95 backdrop-blur-xl border border-purple-500/30 rounded-[24px] p-3.5 sm:p-4 shadow-[0_15px_50px_rgba(140,82,255,0.15)] focus-within:border-accent/60 focus-within:shadow-[0_15px_50px_rgba(251,191,36,0.2)] transition-all flex flex-col">
                  {/* Active Attachment Badge inside Input bar */}
                  {attachedFile && (
                    <div className="mb-3 flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-xl self-start text-xs font-bold text-white w-fit animate-fade-in">
                      <FileText className="h-3.5 w-3.5 text-accent" />
                      <span>{attachedFile}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="p-0.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <textarea
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    disabled={isThinking || isTyping}
                    placeholder={
                      isThinking
                        ? language === "fr"
                          ? "Genove formule sa réponse..."
                          : "Genove is formulating its response..."
                        : isTyping
                          ? language === "fr"
                            ? "Genove rédige..."
                            : "Genove is drafting..."
                          : language === "fr"
                            ? "Écrivez votre message..."
                            : "Type your message..."
                    }
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        ask(q);
                      }
                    }}
                    className="w-full bg-transparent text-base sm:text-sm text-white placeholder-white/60 focus:outline-none resize-none font-semibold leading-relaxed min-h-[44px] font-sans"
                  />

                  {/* BOTTOM TOOLBAR */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                    <div className="flex items-center gap-2">
                      {/* Attachment Toggle Trigger */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAttachMenu(!showAttachMenu);
                          }}
                          type="button"
                          className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="Add context"
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                        {showAttachMenu && (
                          <div className="absolute left-0 bottom-10 w-60 rounded-xl border border-white/10 bg-[#132247] p-1.5 shadow-2xl z-50 animate-fade-in">
                            <button
                              type="button"
                              onClick={() => selectAttachment("syllabus_formation_rag.pdf")}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                            >
                              <FileText className="h-3.5 w-3.5 text-accent" />
                              <span>Attach PDF Syllabus</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => selectAttachment("dashboard_architecture.png")}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                            >
                              <Layers className="h-3.5 w-3.5 text-blue-400" />
                              <span>Attach Diagram/Image</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                selectAttachment("https://genove.ai/referentiel-qualiopi")
                              }
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-purple-400" />
                              <span>Paste web link</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <span className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                        {selectedModel.split(" ")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Voice simulation button */}
                      <button
                        onClick={startListeningSimulation}
                        type="button"
                        className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          isListening
                            ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
                        }`}
                        title="Voice input"
                      >
                        <Mic className="h-3.5 w-3.5" />
                      </button>

                      {/* Clean upward send arrow */}
                      <button
                        type="submit"
                        disabled={isThinking || isTyping || (!q.trim() && !attachedFile)}
                        className="h-8 w-8 rounded-full bg-white text-[#081229] flex items-center justify-center hover:bg-slate-200 transition-all disabled:opacity-50 disabled:hover:bg-white cursor-pointer shadow-lg shrink-0"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>

      {/* CHATGPT-LIKE OVERLAY SEARCH MODAL */}
      {showSearchModal && (
        <div
          className="fixed inset-0 bg-[#070b19]/80 backdrop-blur-md z-[100] flex items-start justify-center pt-20 px-4 transition-all duration-300"
          onClick={() => {
            setShowSearchModal(false);
            setSearchQuery("");
          }}
        >
          <div
            className="w-full max-w-2xl bg-[#0d1527] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-[#0f1930]/40">
              <Search className="h-5 w-5 text-[#E5A93C] shrink-0" />
              <input
                type="text"
                placeholder="Search in your conversations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm py-1"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer mr-2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery("");
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center justify-center border border-white/5 bg-[#14213d]/50"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Results / Recents List */}
            <div className="py-2 flex flex-col max-h-[420px] overflow-hidden">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 pt-2 pb-1 select-none">
                {searchQuery ? "Search results" : "Recent discussions"}
              </div>

              <div className="overflow-y-auto px-2 pb-3 space-y-1 custom-scrollbar">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-12 text-sm text-slate-400 select-none">
                    {searchQuery
                      ? "No results found for your search"
                      : "No recent discussions found"}
                  </div>
                ) : (
                  filteredConversations.map((c) => {
                    const isActive = activeConvId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveConvId(c.id);
                          setViewMode("chat");
                          setShowSearchModal(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group relative cursor-pointer ${
                          isActive
                            ? "bg-[#1e2d4a]/50 text-white border border-[#E5A93C]/20"
                            : "hover:bg-white/5 text-slate-200 hover:text-white"
                        }`}
                      >
                        <MessageSquare
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive
                              ? "text-[#E5A93C]"
                              : "text-slate-400 group-hover:text-[#E5A93C]"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {c.title || "New discussion"}
                          </div>
                          {c.messages && c.messages.length > 0 && (
                            <div className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                              {c.messages[c.messages.length - 1].text}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOUHAITEZ-VOUS VRAIMENT VOUS DÉCONNECTER? MODAL OVERLAY (Image 2) */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-[#1e1e1e] border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col select-none animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-center text-white mb-6 leading-snug px-4">
              Do you really want to log out?
            </h3>

            {/* Profile Info card inside dialog */}
            <div className="w-full bg-[#2a2a2a]/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 mb-6">
              {renderAvatar("w-12 h-12", "text-sm")}
              <div className="flex-grow min-w-0">
                <div className="font-semibold text-sm text-white truncate">
                  {user?.name || displayName}
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  {user?.email || "amenallah.njima@esen.tn"}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={async () => {
                  await logout();
                  setShowLogoutConfirm(false);
                  navigate({ to: "/" });
                }}
                className="w-full py-3 bg-white text-black font-semibold text-sm rounded-full shadow-lg hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Log out
              </button>

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3 bg-transparent text-white border border-white/10 font-semibold text-sm rounded-full hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODIFIER LE PROFIL MODAL OVERLAY (Image 1) */}
      {showProfileEditModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowProfileEditModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col select-none animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-left text-white mb-6">Edit Profile</h3>

            {/* Centered Avatar Selection block with camera overlay */}
            <div className="flex justify-center mb-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-32 h-32 rounded-full cursor-pointer group shrink-0"
              >
                {/* Big circular avatar preview */}
                <div className="w-full h-full rounded-full bg-[#E5A93C] text-[#0d1839] font-bold flex items-center justify-center shadow-inner overflow-hidden relative">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl tracking-wide select-none">{getEditInitials()}</span>
                  )}
                  {/* Hover visual cue */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full" />
                </div>

                {/* Little Camera overlay button */}
                <button
                  type="button"
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#27272a] border border-white/10 flex items-center justify-center text-white shadow-lg hover:bg-[#3f3f46] transition-colors"
                >
                  <Camera className="w-4 h-4 text-slate-200" />
                </button>
              </div>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Custom high-fidelity input containers matching the uploaded image */}
            <div className="space-y-4">
              {/* Nom d'affichage Input Box */}
              <div className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl px-4 py-2.5 flex flex-col text-left focus-within:border-white/20 transition-all">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wide select-none">
                  Display Name
                </span>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="Amen Njima"
                  className="w-full bg-transparent border-none text-white text-sm font-semibold outline-none focus:ring-0 p-0 mt-0.5"
                />
              </div>

              {/* Nom d'utilisateur Input Box */}
              <div className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl px-4 py-2.5 flex flex-col text-left focus-within:border-white/20 transition-all">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wide select-none">
                  Username
                </span>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="njimaamenallah"
                  className="w-full bg-transparent border-none text-white text-sm font-semibold outline-none focus:ring-0 p-0 mt-0.5"
                />
              </div>
            </div>

            {/* Informational Help Text */}
            <p className="text-xs text-slate-400 mt-4 text-left leading-normal select-none">
              Your profile helps others recognize you in group discussions.
            </p>

            {/* Action Buttons styled precisely as in the image */}
            <div className="flex justify-end items-center gap-3 w-full mt-6">
              <button
                type="button"
                onClick={() => setShowProfileEditModal(false)}
                className="px-6 py-2.5 rounded-full border border-white/10 bg-transparent hover:bg-white/5 font-semibold text-sm text-white transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (editDisplayName.trim()) {
                    await updateProfile(editDisplayName.trim(), editUsername.trim(), editAvatarUrl);
                    setShowProfileEditModal(false);
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 font-semibold text-sm text-black shadow-lg transition-all cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
