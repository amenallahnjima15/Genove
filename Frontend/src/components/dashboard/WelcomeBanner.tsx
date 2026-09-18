import { Sparkles, MessageSquare, BarChart3 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { IsometricBooks3D } from "@/components/dashboard/IsometricBooks3D";
import { GenoveLogo } from "@/components/genove/GenoveLogo";

export function WelcomeBanner({ name }: { name: string }) {
  const { t } = useLanguage();

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#9056F7] via-[#8244E8] to-[#6E2FE0] p-6 sm:p-8 text-white shadow-xl shadow-purple-500/20 border border-white/10">
      {/* Background soft lighting glow elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      {/* Floating decorative circular badges positioned cleanly on the right side */}
      <div className="absolute top-6 right-20 hidden lg:flex h-9 w-9 items-center justify-center rounded-full bg-white/15 border border-white/25 backdrop-blur-md shadow-md animate-pulse z-10">
        <BarChart3 className="h-4 w-4 text-cyan-300" />
      </div>
      <div className="absolute bottom-4 right-8 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/15 border border-white/25 backdrop-blur-md shadow-md z-10">
        <MessageSquare className="h-4 w-4 text-purple-200" />
      </div>

      <div className="relative flex flex-col items-center sm:items-start gap-4 z-10">
        {/* Active LED Stadium Board Badge with Crawling Light Beam ("douda LED") */}
        <div className="relative inline-flex items-center overflow-hidden rounded-full p-[1.5px] animate-led-glow shadow-lg shadow-purple-900/40">
          {/* Spinning Conic LED Light Beam orbiting the perimeter border */}
          <div className="absolute inset-[-100%] animate-led-spin bg-[conic-gradient(from_0deg,#38BDF8_0deg,transparent_60deg,#C084FC_120deg,transparent_180deg,#818CF8_240deg,transparent_300deg)]" />

          {/* Inner Pill Container */}
          <div className="relative flex items-center gap-2.5 rounded-full bg-[#180A30]/85 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white z-10 overflow-hidden border border-white/10">
            {/* Crawling LED Light Beam ("douda LED") traveling across the entire bar */}
            <div className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent blur-sm animate-led-crawl" />
            <div className="pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/90 to-transparent animate-led-crawl" />

            {/* Active LED Pulsing Indicator */}
            <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_10px_#38bdf8]"></span>
            </span>

            <GenoveLogo variant="wordmark" height={18} />

            {/* Text Label */}
            <span className="tracking-wider uppercase text-[11px] font-black text-cyan-100 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)] ml-1 border-l border-white/20 pl-2">
              {t("dash.badge")}
            </span>
          </div>
        </div>

        {/* Content area: 3D Isometric Stacked Books & Tablet below the badge */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full">
          {/* 3D Isometric Stacked Books & Tablet (Now placed below the badge) */}
          <div className="shrink-0 -my-2 sm:-my-4">
            <IsometricBooks3D className="w-36 h-36 sm:w-44 sm:h-44" />
          </div>

          {/* Text Area */}
          <div className="flex-1 text-center sm:text-left space-y-2.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t("dash.hello")}, {name}
            </h1>

            <p className="text-sm sm:text-base text-purple-100/90 font-medium leading-relaxed max-w-2xl">
              {t("dash.welcomeSub")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
