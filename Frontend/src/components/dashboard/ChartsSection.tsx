import { useState } from "react";
import { ChevronDown, Users, Heart, BarChart2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function ChartsSection() {
  const { t } = useLanguage();
  const [filterKey, setFilterKey] = useState<"dash.daily" | "dash.weekly">("dash.daily");

  // SVG Line Path points matching the screenshot activity graph waveform
  const points = [
    { day: "31 Mon", x: 20, y: 80, val: "20" },
    { day: "01 Tue", x: 75, y: 65, val: "35" },
    { day: "02 Wed", x: 130, y: 72, val: "28" },
    { day: "03 Thu", x: 185, y: 60, val: "40" },
    { day: "04 Fri", x: 240, y: 70, val: "30" },
    { day: "05 Sat", x: 295, y: 25, val: "85" }, // peak
    { day: "06 Sun", x: 350, y: 40, val: "65" },
  ];

  // Path generator for smooth SVG cubic bezier
  const svgPath =
    "M 20 80 C 50 70, 60 65, 75 65 C 100 65, 115 72, 130 72 C 150 72, 165 60, 185 60 C 210 60, 225 70, 240 70 C 265 70, 280 25, 295 25 C 320 25, 335 40, 350 40";
  const areaPath = `${svgPath} L 350 110 L 20 110 Z`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* 1. Activity Line Chart Card (Left 6 cols) */}
      <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-extrabold text-slate-900 dark:text-white">
            {t("dash.activity")}
          </h3>
          <div className="relative">
            <button
              onClick={() =>
                setFilterKey(filterKey === "dash.daily" ? "dash.weekly" : "dash.daily")
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>{t(filterKey)}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Custom SVG Line Chart matching screenshot */}
        <div className="relative w-full pt-2">
          <svg viewBox="0 0 370 120" className="w-full h-36 overflow-visible">
            <defs>
              <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8C52FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8C52FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal dashed lines */}
            <line x1="0" y1="30" x2="370" y2="30" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="0" y1="65" x2="370" y2="65" stroke="#F1F5F9" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="370" y2="100" stroke="#F1F5F9" strokeDasharray="4 4" />

            {/* Area fill */}
            <path d={areaPath} fill="url(#purpleArea)" />

            {/* Purple waveform line */}
            <path
              d={svgPath}
              fill="none"
              stroke="#8C52FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Peak indicator vertical highlight line for Sat peak */}
            <line
              x1="295"
              y1="25"
              x2="295"
              y2="110"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="2 2"
            />

            {/* Data point dots */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={i === 5 ? "6" : "4"}
                  className={
                    i === 5
                      ? "fill-amber-400 stroke-white stroke-2 shadow-md"
                      : "fill-[#8C52FF] stroke-white stroke-2"
                  }
                />
              </g>
            ))}
          </svg>

          {/* Day Ticks */}
          <div className="flex justify-between items-center pt-2 text-[11px] font-bold text-slate-400">
            {points.map((p) => (
              <span
                key={p.day}
                className={
                  p.day.includes("Sat") ? "text-purple-600 dark:text-purple-400 font-extrabold" : ""
                }
              >
                {p.day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Progress Donut Ring Card (Middle 3 cols) */}
      <div className="lg:col-span-3 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
        <h3 className="font-heading text-base font-extrabold text-slate-900 dark:text-white w-full text-left">
          {t("dash.progress")}
        </h3>

        {/* Donut Gauge */}
        <div className="relative grid h-32 w-32 place-items-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#F3E8FF" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradientDonut)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 * (1 - 0.7)}
            />
            <defs>
              <linearGradient id="gradientDonut" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C52FF" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-2xl font-black text-slate-900 dark:text-white">
              70%
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4 text-purple-500" /> {t("dash.thisWeek")}
          </span>
          <span className="font-black text-slate-800 dark:text-slate-200">70%</span>
        </div>
      </div>

      {/* 3. Quick Stats Cards Stack (Right 3 cols) */}
      <div className="lg:col-span-3 flex flex-col justify-between gap-4">
        {/* Team Card */}
        <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 border border-amber-200/50">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block">{t("dash.team")}</span>
              <span className="font-heading text-2xl font-black text-slate-900 dark:text-white">
                5
              </span>
            </div>
          </div>
        </div>

        {/* Client / Partenaires Card */}
        <div className="flex-1 rounded-3xl bg-white dark:bg-slate-900 border border-purple-100/80 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 border border-rose-200/50">
              <Heart className="h-6 w-6 fill-rose-500/20" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 block">{t("dash.client")}</span>
              <span className="font-heading text-2xl font-black text-slate-900 dark:text-white">
                10+
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
