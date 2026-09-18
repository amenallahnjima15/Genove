import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  History,
  Plus,
  Trash2,
  ChevronRight,
  User,
} from "lucide-react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { GenoveLogo } from "@/components/genove/GenoveLogo";
import {
  getConversations,
  addMessageToConversation,
  createConversation,
  deleteConversation,
} from "@/lib/chat-storage";

export function ChatWidget() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const getPageName = (path: string) => {
    if (path.startsWith("/catalogue") || path.startsWith("/formations")) return "Courses";
    if (path.startsWith("/projets")) return "Projects";
    if (path.startsWith("/savoir")) return "Savoir+";
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/connexion")) return "Login";
    return "Home";
  };

  const pageName = getPageName(pathname);

  // Active conversation ID in this session, defaults to null for new chat
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  // Recent conversations list local state
  const [recentConversations, setRecentConversations] = useState(() => getConversations());
  const [showHistory, setShowHistory] = useState(false);

  // Conversation history state
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: "user" | "ai";
      text: string;
      sources?: { t: string; s: string }[];
    }>
  >([]);

  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset to new conversation when page changes
  useEffect(() => {
    setActiveConvId(null);
    setRecentConversations(getConversations());
  }, [pageName]);

  // Load active conversation messages when activeConvId changes
  useEffect(() => {
    if (activeConvId) {
      const convs = getConversations();
      const currentConv = convs.find((c) => c.id === activeConvId);
      if (currentConv) {
        setMessages(currentConv.messages);
      }
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  // Lock outer background body scroll when ChatWidget is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle storage updates from Savoir+ page in real-time
  useEffect(() => {
    const handleStorageUpdate = () => {
      setRecentConversations(getConversations());
      if (activeConvId) {
        const convs = getConversations();
        const currentConv = convs.find((c) => c.id === activeConvId);
        if (currentConv) {
          setMessages(currentConv.messages);
        }
      }
    };
    window.addEventListener("genove_chats_updated", handleStorageUpdate);
    return () => window.removeEventListener("genove_chats_updated", handleStorageUpdate);
  }, [activeConvId]);

  // Keep scroll focused on the newest messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isThinking, isTyping, showHistory]);

  // Helper to format custom text into styled JSX with high contrast text for user messages
  const renderFormattedText = (text: string, isUser: boolean = false) => {
    const textStyle = isUser
      ? "text-white leading-relaxed font-medium"
      : "text-slate-200 leading-relaxed font-medium";
    const boldStyle = isUser ? "font-bold text-white" : "font-bold text-amber-300";
    const bulletDotColor = isUser ? "text-amber-300" : "text-amber-400";

    return text.split("\n").map((line, i) => {
      let content = line;
      const isBullet = line.startsWith("•") || line.startsWith("-");
      const isNumbered = /^\d+\.\s/.test(line);

      if (isBullet) {
        content = line.substring(1).trim();
      } else if (isNumbered) {
        content = line.replace(/^\d+\.\s/, "");
      }

      // Format bold elements
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
          <div key={i} className="flex items-start gap-1.5 ml-1 my-1">
            <span className={`${bulletDotColor} mt-1 shrink-0`}>•</span>
            <span className={textStyle}>{parsedLine}</span>
          </div>
        );
      }

      if (isNumbered) {
        const num = line.match(/^\d+/)?.at(0) || "1";
        return (
          <div key={i} className="flex items-start gap-2 ml-1 my-1">
            <span className="font-extrabold text-slate-950 bg-amber-400 rounded h-4.5 w-4.5 flex items-center justify-center text-[10px] mt-0.5 shrink-0">
              {num}
            </span>
            <span className={textStyle}>{parsedLine}</span>
          </div>
        );
      }

      return (
        <p key={i} className={`${line.trim() === "" ? "h-2" : "my-1"} ${textStyle}`}>
          {parsedLine}
        </p>
      );
    });
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking || isTyping) return;

    let convId = activeConvId;

    // 1. Create a conversation in localStorage if not exists yet
    if (!convId) {
      const newConv = createConversation(trimmed, pageName);
      convId = newConv.id;
      setActiveConvId(newConv.id);
      setRecentConversations(getConversations());
    }

    // 2. Add User Message to local storage & current view
    addMessageToConversation(convId, "user", trimmed);
    const convs = getConversations();
    const currentConv = convs.find((c) => c.id === convId);
    if (currentConv) {
      setMessages(currentConv.messages);
    }

    setInputValue("");
    setIsThinking(true);
    setShowHistory(false);

    const currentConvId = convId;

    // 3. Appel réel au backend RAG (FastAPI) au lieu de la réponse simulée.
    // L'URL doit pointer vers ton serveur uvicorn (api.py) lancé en local.
    let responseText = "";
    let sources: { t: string; s: string }[] = [];

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`Erreur API : ${res.status}`);
      }

      const data = await res.json();
      responseText = data.reponse;
    } catch (error) {
      responseText =
        language === "fr"
          ? "Désolé, je n'arrive pas à contacter l'assistant pour le moment. Vérifie que le serveur est bien lancé."
          : "Sorry, I can't reach the assistant right now. Make sure the server is running.";
    }

    setIsThinking(false);
    setIsTyping(true);

    // Effet de frappe mot par mot, conservé tel quel : il affiche
    // progressivement la vraie réponse reçue de l'API (au lieu du
    // texte simulé) pour garder le même effet visuel "streaming".
    const words = responseText.split(" ");
    let currentText = "";
    let wordIndex = 0;
    const aiMessageId = `ai-${Date.now()}`;

    setMessages((prev) => [...prev, { id: aiMessageId, sender: "ai", text: "" }]);

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
        setMessages((prev) =>
          prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: currentText } : msg)),
        );
        wordIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);

        // Finalize message with complete content and sources in memory
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: responseText, sources } : msg,
          ),
        );

        // 4. Save AI response to localStorage
        addMessageToConversation(currentConvId, "ai", responseText, sources);
        setRecentConversations(getConversations());
      }
    }, 35); // Fluid typing speed word by word
  };

  const handleNewDiscussion = () => {
    setActiveConvId(null);
    setShowHistory(false);
  };

  // Hide widget on /savoir page after all hooks execute
  if (pathname.startsWith("/savoir")) {
    return null;
  }

  return (
    <>
      {/* Background Overlay Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-[#090414]/75 backdrop-blur-md z-40 transition-all duration-300 animate-in fade-in"
          onClick={() => {
            setOpen(false);
            setIsMaximized(false);
            setShowHistory(false);
          }}
        />
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => {
          setOpen((v) => {
            const next = !v;
            if (!next) {
              setIsMaximized(false);
              setShowHistory(false);
            }
            return next;
          });
        }}
        aria-label="Open assistant"
        className={`fixed bottom-6 right-6 z-40 h-14 w-14 place-items-center rounded-full bg-[#8C52FF] hover:bg-[#793DF2] text-white shadow-[0_8px_30px_rgba(140,82,255,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/20 ${
          open ? "hidden sm:grid" : "grid"
        }`}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-[#180E30] shadow-md shadow-emerald-500/40" />
        </span>
      </button>

      {open && (
        <div
          className={`fixed bg-[#180E30] shadow-[0_25px_60px_rgba(140,82,255,0.4)] backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 overflow-hidden ${
            isMaximized
              ? "inset-0 z-[99999] w-full h-full rounded-none border-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[680px] sm:max-w-[95vw] sm:h-[680px] sm:max-h-[88vh] sm:rounded-[28px] sm:border sm:border-[#8C52FF]/50 animate-in zoom-in-95"
              : "z-50 bottom-3 left-3 right-3 sm:bottom-24 sm:right-6 sm:left-auto sm:translate-x-0 sm:translate-y-0 rounded-[28px] border border-[#8C52FF]/50 w-auto max-w-[420px] h-[520px] max-h-[78vh] sm:w-[380px] sm:max-w-[92vw] sm:h-[520px] animate-in fade-in zoom-in-95 sm:slide-in-from-bottom-4"
          }`}
        >
          {/* Header */}
          <div className="relative flex items-center justify-between bg-gradient-to-r from-[#8C52FF] via-[#7131F0] to-[#180E30] px-5 py-4 border-b border-[#8C52FF]/40 text-white">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-70 pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#180E30] border border-amber-400/40 p-1 shadow-md shrink-0">
                <GenoveLogo variant="icon" height={28} />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-2">
                  <span>Genove Assistant</span>
                </h3>
                <p className="text-[11px] text-emerald-300 mt-0.5 font-medium flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span>En ligne</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-white/85">
              <button
                onClick={() => setShowHistory((h) => !h)}
                className={`hover:text-white hover:bg-white/20 transition-colors cursor-pointer p-1.5 rounded-lg ${showHistory ? "text-white bg-white/20" : ""}`}
                title="Discussions récentes"
                aria-label="Discussions récentes"
              >
                <History className="h-4 w-4" />
              </button>
              {activeConvId && !showHistory && (
                <button
                  onClick={handleNewDiscussion}
                  className="hover:text-white hover:bg-white/20 transition-colors cursor-pointer p-1.5 rounded-lg"
                  title="Nouvelle discussion"
                  aria-label="Nouvelle discussion"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsMaximized((prev) => !prev)}
                className="hover:text-white hover:bg-white/20 transition-colors cursor-pointer p-1.5 rounded-lg"
                title={isMaximized ? "Réduire" : "Agrandir"}
                aria-label={isMaximized ? "Réduire" : "Agrandir"}
              >
                {isMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setIsMaximized(false);
                  setShowHistory(false);
                  setActiveConvId(null);
                }}
                className="hover:text-white hover:bg-white/20 transition-colors cursor-pointer p-1.5 rounded-lg"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* History Panel vs. Chat Conversation Panel */}
          {showHistory ? (
            <div className="flex-1 bg-[#130B29] p-5 flex flex-col overflow-y-auto custom-scrollbar text-white">
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-3 mb-4 shrink-0">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <History className="h-4 w-4 text-amber-400" />
                  Discussions récentes
                </h4>
                <button
                  onClick={handleNewDiscussion}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer bg-amber-400/15 border border-amber-400/30 hover:bg-amber-400/25 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Nouveau
                </button>
              </div>

              {recentConversations.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                  <MessageCircle className="h-8 w-8 text-purple-400/40" />
                  <p className="text-slate-400 text-xs font-medium">
                    Aucune discussion enregistrée.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pr-1">
                  {recentConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        activeConvId === conv.id
                          ? "bg-[#221347] border-purple-400/50 text-white shadow-md"
                          : "bg-[#180E30] border-purple-500/20 hover:bg-[#221347]/60 hover:border-purple-400/30 text-slate-200"
                      }`}
                      onClick={() => {
                        setActiveConvId(conv.id);
                        setShowHistory(false);
                      }}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="font-bold text-xs truncate group-hover:text-amber-300 transition-colors">
                          {conv.title || "Nouvelle discussion"}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          {conv.pageName && (
                            <span className="text-[9px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 rounded px-1.5 py-0.5 leading-none uppercase shrink-0">
                              {conv.pageName}
                            </span>
                          )}
                          <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                            {new Date(conv.createdAt).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                          const updated = getConversations();
                          setRecentConversations(updated);
                          if (activeConvId === conv.id) {
                            setActiveConvId(null);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-all cursor-pointer shrink-0"
                        title="Supprimer la discussion"
                        aria-label="Supprimer la discussion"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Chat Area */
            <div
              ref={scrollRef}
              className="flex-1 bg-[#130B29] flex flex-col overflow-y-auto custom-scrollbar"
            >
              {!activeConvId || messages.length === 0 ? (
                /* Clear professional empty state */
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#180E30] border border-amber-400/40 p-2.5 shadow-xl shrink-0">
                    <GenoveLogo variant="icon" height={36} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-base leading-tight">
                      Genove Assistant
                    </h4>
                    <p className="text-slate-300 text-sm max-w-[280px] sm:max-w-[400px] leading-relaxed font-semibold">
                      {language === "fr"
                        ? "Bonjour, je suis l'Assistant Genove. Comment puis-je vous aider ?"
                        : "Hello, I am Genove Assistant. How can I help you today?"}
                    </p>
                  </div>

                  {/* Suggestion buttons inside empty state */}
                  <div
                    className={`w-full mt-4 transition-all ${
                      isMaximized
                        ? "max-w-[620px] grid grid-cols-1 sm:grid-cols-3 gap-2.5 px-1"
                        : "w-full max-w-[340px] flex flex-col gap-2"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleSend(
                          language === "fr" ? "Découvrir les formations" : "Explore courses",
                        )
                      }
                      className="w-full bg-[#1C103C] hover:bg-[#271752] text-slate-200 hover:text-white text-xs font-semibold px-3.5 py-3 rounded-xl border border-purple-500/35 hover:border-amber-400/50 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-left flex items-center justify-between gap-2.5 group"
                    >
                      <span className="min-w-0 flex-1 leading-snug">
                        {language === "fr" ? "Découvrir les formations" : "Explore courses"}
                      </span>
                      <ChevronRight className="h-4 w-4 text-amber-400/80 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSend(
                          language === "fr" ? "Comment fonctionne l'IA ?" : "How does AI work?",
                        )
                      }
                      className="w-full bg-[#1C103C] hover:bg-[#271752] text-slate-200 hover:text-white text-xs font-semibold px-3.5 py-3 rounded-xl border border-purple-500/35 hover:border-amber-400/50 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-left flex items-center justify-between gap-2.5 group"
                    >
                      <span className="min-w-0 flex-1 leading-snug">
                        {language === "fr" ? "Comment fonctionne l'IA ?" : "How does AI work?"}
                      </span>
                      <ChevronRight className="h-4 w-4 text-amber-400/80 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSend(
                          language === "fr" ? "Contacter un conseiller" : "Contact an advisor",
                        )
                      }
                      className="w-full bg-[#1C103C] hover:bg-[#271752] text-slate-200 hover:text-white text-xs font-semibold px-3.5 py-3 rounded-xl border border-purple-500/35 hover:border-amber-400/50 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-left flex items-center justify-between gap-2.5 group"
                    >
                      <span className="min-w-0 flex-1 leading-snug">
                        {language === "fr" ? "Contacter un conseiller" : "Contact an advisor"}
                      </span>
                      <ChevronRight className="h-4 w-4 text-amber-400/80 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Chat Messages List */
                <div className="p-5 flex flex-col gap-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${
                        msg.sender === "user" ? "flex-row-reverse self-end" : "self-start"
                      } max-w-[88%]`}
                    >
                      {msg.sender === "user" ? (
                        <div className="shrink-0 mt-1">
                          {user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name || "User"}
                              className="h-7 w-7 object-cover rounded-full ring-2 ring-amber-400/80 border border-purple-400/30 shadow-md"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#8C52FF] to-[#5B21B6] text-white font-black text-[11px] flex items-center justify-center ring-2 ring-amber-400/80 border border-purple-400/30 shadow-md">
                              {user?.name ? (
                                user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()
                              ) : (
                                <User className="h-3.5 w-3.5 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="shrink-0 mt-1">
                          <div className="h-7 w-7 rounded-xl bg-[#1C103C] border border-amber-400/50 p-1 flex items-center justify-center shadow-md">
                            <GenoveLogo variant="icon" height={18} />
                          </div>
                        </div>
                      )}
                      <div
                        className={`rounded-[20px] p-4 text-sm leading-relaxed shadow-md ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-[#8C52FF] to-purple-700 text-white rounded-tr-sm border border-purple-400/35 animate-in slide-in-from-right-2 duration-200"
                            : "bg-[#1C103C] text-slate-100 rounded-tl-sm border border-purple-500/35 animate-in slide-in-from-left-2 duration-200"
                        }`}
                      >
                        <div className="space-y-1">
                          {renderFormattedText(msg.text, msg.sender === "user")}
                        </div>

                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-purple-500/30">
                            <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold mb-1.5 flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" /> Sources
                              vérifiées
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {msg.sources.map((s, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between gap-1.5 text-xs text-slate-300 bg-[#120924] py-1.5 px-2.5 rounded-lg border border-purple-500/30"
                                >
                                  <span className="font-bold text-amber-300 truncate max-w-[180px]">
                                    {s.t}
                                  </span>
                                  <span className="text-slate-400 text-[10px] shrink-0 font-semibold">
                                    {s.s}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Simulated Multi-agent Pipeline status step */}
                  {isThinking && (
                    <div className="flex items-center gap-3 self-start py-1 select-none animate-fade-in">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#180E30] border border-[#F4BAA2]/40 p-1 shrink-0 shadow-md">
                        <GenoveLogo
                          variant="icon"
                          height={18}
                          className="animate-[spin_3s_linear_infinite]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
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

                  {isTyping && (
                    <div className="flex items-center gap-2 self-start text-xs text-amber-300 bg-[#1C103C]/80 px-3 py-1.5 rounded-xl border border-purple-500/30 ml-1">
                      <GenoveLogo variant="icon" height={16} />
                      <span className="font-semibold">Genove rédige sa réponse...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="bg-[#180E30] p-4 border-t border-purple-500/35 flex items-center gap-3 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isThinking || isTyping}
              placeholder={
                isThinking
                  ? language === "fr"
                    ? "Réflexion IA..."
                    : "AI Thinking..."
                  : isTyping
                    ? language === "fr"
                      ? "Saisie en cours..."
                      : "Typing response..."
                    : language === "fr"
                      ? "Posez votre question..."
                      : "Ask your question..."
              }
              className="h-11 flex-1 bg-[#120924] border border-purple-500/40 hover:border-purple-400/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-4 text-base sm:text-sm text-white placeholder:text-slate-400 focus:outline-none transition-all disabled:opacity-60 font-semibold"
            />
            <button
              type="submit"
              disabled={isThinking || isTyping || !inputValue.trim()}
              className="h-11 w-11 shrink-0 bg-[#8C52FF] hover:bg-[#793DF2] disabled:opacity-40 text-white font-bold flex items-center justify-center rounded-xl shadow-md shadow-[#8C52FF]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
              aria-label="Envoyer"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}