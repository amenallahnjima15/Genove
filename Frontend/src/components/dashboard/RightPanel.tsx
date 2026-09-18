import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  PenTool,
  Layout,
  CheckCircle,
  MoreHorizontal,
  Camera,
  Upload,
  Link as LinkIcon,
  Check,
  X,
  Sparkles,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";

import avatarMale1 from "@/assets/images/avatar_male_1_1785774086976.jpg";
import avatarFemale1 from "@/assets/images/avatar_female_1_1785774099751.jpg";
import avatarMale2 from "@/assets/images/avatar_male_2_1785774111655.jpg";
import avatarFemale2 from "@/assets/images/avatar_female_2_1785774122840.jpg";
import avatarMale3 from "@/assets/images/avatar_male_3_1785774136540.jpg";
import avatarFemale3 from "@/assets/images/avatar_female_3_1785774149668.jpg";

const AVATAR_PRESETS = [
  { url: avatarMale1, name: "3D Garçon 1" },
  { url: avatarMale2, name: "3D Garçon 2" },
  { url: avatarMale3, name: "3D Garçon 3" },
  { url: avatarFemale1, name: "3D Fille 1" },
  { url: avatarFemale2, name: "3D Fille 2" },
  { url: avatarFemale3, name: "3D Fille 3" },
];

export function ProfilePanel({
  name,
  email,
  progress = 70,
}: {
  name: string;
  email: string;
  progress?: number;
}) {
  const { user, updateProfile } = useAuth();
  const { t, language } = useLanguage();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || "");
  const [urlInput, setUrlInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lock outer background body scroll when profile edit modal is open
  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showEditModal]);

  const currentAvatar = user?.avatarUrl || selectedAvatar;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string);
        setUrlInput("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    setIsSaving(true);
    const finalAvatar = urlInput.trim() || selectedAvatar;
    await updateProfile(user?.name || name, user?.username || "", finalAvatar);
    setIsSaving(false);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden space-y-3">
        {/* Decorative floating dots around avatar matching screenshot */}
        <div className="absolute top-6 left-8 h-3 w-3 rounded-full bg-amber-400 opacity-80 animate-pulse" />
        <div className="absolute top-12 right-10 h-2.5 w-2.5 rounded-full bg-purple-500 opacity-70" />
        <div className="absolute bottom-16 left-12 h-2 w-2 rounded-full bg-[#8C52FF] opacity-60" />
        <div className="absolute bottom-12 right-12 h-3 w-3 rounded-full bg-orange-400 opacity-80" />

        {/* Avatar with gold ring & brand purple styling + HOVER CAMERA EDIT OVERLAY */}
        <div
          className="relative mx-auto mt-2 group cursor-pointer"
          onClick={() => {
            setSelectedAvatar(user?.avatarUrl || "");
            setUrlInput("");
            setShowEditModal(true);
          }}
        >
          <div className="w-24 h-24 rounded-full border-4 border-amber-400 p-1 bg-gradient-to-br from-[#8C52FF] to-[#180E30] shadow-lg shadow-purple-500/20 flex items-center justify-center overflow-hidden transition-all group-hover:scale-105 group-hover:border-amber-300 group-hover:shadow-purple-500/40">
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#8C52FF] to-[#5B21B6] flex items-center justify-center text-white font-black text-2xl shadow-inner border border-white/20 overflow-hidden">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={name}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "AN"
              )}

              {/* HOVER EDIT OVERLAY - ONLY SHOWS ON HOVER */}
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 select-none pointer-events-none">
                <Camera className="h-6 w-6 text-amber-300 animate-bounce" />
                <span className="text-[10px] font-black tracking-wider uppercase text-amber-200">
                  {t("dash.editAvatar")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg font-black text-slate-900 dark:text-white leading-tight">
            {name}
          </h3>
          <p className="text-xs font-bold text-slate-400 mt-1">{email}</p>
        </div>
      </div>

      {/* EDIT PROFILE PICTURE MODAL */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#130B29] border border-purple-200/80 dark:border-purple-500/30 rounded-3xl p-6 shadow-2xl relative select-none animate-in zoom-in-95 duration-150 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#8C52FF]/20 to-purple-100 dark:from-purple-900/50 dark:to-purple-950/50 text-[#8C52FF] dark:text-amber-400 flex items-center justify-center shadow-xs">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {t("dash.editAvatar")}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {t("dash.editAvatarSub")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="w-24 h-24 rounded-full border-4 border-amber-400 p-1 bg-gradient-to-br from-[#8C52FF] to-[#180E30] shadow-xl flex items-center justify-center overflow-hidden relative group">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8C52FF] to-[#5B21B6] flex items-center justify-center text-white font-black text-2xl shadow-inner border border-white/20 overflow-hidden">
                  {selectedAvatar || urlInput ? (
                    <img
                      src={urlInput.trim() || selectedAvatar}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "US"
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/30">
                  {t("dash.livePreview")}
                </span>
                {(selectedAvatar || urlInput) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAvatar("");
                      setUrlInput("");
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>{language === "fr" ? "Réinitialiser" : "Reset"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Options Tabs / Actions */}
            <div className="space-y-4 pt-1">
              {/* Option 1: File Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/70 dark:hover:bg-purple-900/40 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs group"
              >
                <Upload className="h-4 w-4 text-[#8C52FF] group-hover:scale-110 transition-transform" />
                <span>{t("dash.uploadDevice")}</span>
              </button>

              {/* Option 2: Image URL input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-purple-500" />
                  <span>{t("dash.orPasteUrl")}</span>
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (e.target.value) setSelectedAvatar("");
                  }}
                  placeholder="https://exemple.com/ma-photo.jpg"
                  className="w-full h-11 px-4 rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/30 dark:bg-[#1A0F35] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#8C52FF] focus:ring-2 focus:ring-[#8C52FF]/20 transition-all font-medium"
                />
              </div>

              {/* Option 3: Presets Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>
                      {language === "fr"
                        ? "Avatars 3D professionnels (cliquez pour choisir/annuler) :"
                        : "Professional 3D avatars (click to select/deselect):"}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-3 justify-items-center max-w-[220px] mx-auto">
                  {AVATAR_PRESETS.map((preset, idx) => {
                    const active = selectedAvatar === preset.url && !urlInput;
                    return (
                      <button
                        key={idx}
                        type="button"
                        title={
                          active
                            ? language === "fr"
                              ? "Cliquer pour désélectionner"
                              : "Click to deselect"
                            : preset.name
                        }
                        onClick={() => {
                          if (active) {
                            setSelectedAvatar("");
                          } else {
                            setSelectedAvatar(preset.url);
                            setUrlInput("");
                          }
                        }}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all cursor-pointer overflow-hidden ${
                          active
                            ? "border-[#8C52FF] ring-2 ring-[#8C52FF]/40 scale-110 shadow-lg"
                            : "border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100 hover:scale-105"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                        {active && (
                          <div className="absolute inset-0 bg-[#8C52FF]/40 backdrop-blur-[1px] flex items-center justify-center text-white">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100 dark:border-purple-500/20">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {t("dash.cancel")}
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8C52FF] to-[#7030EF] hover:from-purple-600 hover:to-purple-800 text-white text-xs font-black shadow-md shadow-purple-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSaving ? (
                  <span>{t("dash.saving")}</span>
                ) : (
                  <>
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    <span>{t("dash.savePhoto")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function TodayTasksPanel() {
  const { t } = useLanguage();
  const tasks = [
    {
      id: 1,
      title: t("dash.designSystem"),
      sub: t("dash.designSystemSub"),
      icon: PenTool,
    },
    {
      id: 2,
      title: t("dash.mockupLanding"),
      sub: t("dash.mockupLandingSub"),
      icon: Layout,
    },
    {
      id: 3,
      title: t("dash.layoutTask"),
      sub: t("dash.layoutTaskSub"),
      icon: CheckCircle,
    },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-extrabold text-slate-900 dark:text-white">
          {t("dash.today")}
        </h3>
        <button className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
          {t("dash.viewAll")}
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 dark:bg-slate-800/40 hover:bg-purple-100/60 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#8C52FF] text-white shadow-md shadow-purple-500/20">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-extrabold text-slate-900 dark:text-white">
                    {task.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{task.sub}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TeamPanel() {
  const { t } = useLanguage();
  const members = [
    {
      id: 1,
      name: "Dhea Mufni",
      role: t("dash.graphicDesigner"),
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      statusColor: "bg-emerald-500",
    },
    {
      id: 2,
      name: "Antonion",
      role: t("dash.developer"),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      statusColor: "bg-amber-500",
    },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-extrabold text-slate-900 dark:text-white">
          {t("dash.team")}
        </h3>
        <button className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
          {t("dash.viewAll")}
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="h-10 w-10 rounded-full object-cover border border-purple-100"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-heading text-xs font-extrabold text-slate-900 dark:text-white">
                  {member.name}
                </h4>
                <p className="text-[11px] font-bold text-slate-400">{member.role}</p>
              </div>
            </div>
            <span className={`h-2.5 w-2.5 rounded-full ${member.statusColor} shadow-sm`} />
          </div>
        ))}
      </div>
    </div>
  );
}
