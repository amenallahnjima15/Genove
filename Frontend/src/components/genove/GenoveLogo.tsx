import React from "react";
import { useLanguage } from "@/lib/language-context";

interface GenoveLogoProps {
  /**
   * "full" = Wordmark + Planet 'o' + Tagline ("Where AI meets purpose" / "Là où l'IA rencontre le sens") & Star
   * "wordmark" = "Genove" wordmark with Planet 'o'
   * "icon" = Planet emblem with golden ring only
   */
  variant?: "full" | "wordmark" | "icon";
  /** Height in pixels or string (e.g. 32, 40, "2rem") */
  height?: number | string;
  className?: string;
  /** Primary text color override (default inherits or uses cream/white) */
  textColor?: string;
  /** Force light theme text color if on light background */
  isLightBg?: boolean;
  /** Whether the planet 'o' inside wordmark should spin continuously */
  spinPlanet?: boolean;
}

export function GenoveLogo({
  variant = "wordmark",
  height,
  className = "",
  textColor,
  isLightBg = false,
  spinPlanet = true,
}: GenoveLogoProps) {
  const { t } = useLanguage();
  const taglineText = t("genove.tagline");

  // Determine primary text color
  const baseTextColor = textColor ? textColor : isLightBg ? "#180E30" : "#EAE0D0";

  if (variant === "icon") {
    const iconSize = typeof height === "number" ? height : 36;
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 overflow-visible ${className}`}
      >
        <defs>
          <linearGradient id="genovePlanetGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1B59C" />
            <stop offset="45%" stopColor="#E29F8E" />
            <stop offset="100%" stopColor="#759688" />
          </linearGradient>
          <linearGradient id="genoveRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Back portion of golden orbital ring */}
        <path
          d="M 22 68 C 10 52 18 32 38 25 C 60 18 82 24 88 36"
          stroke="url(#genoveRingGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Planet Sphere */}
        <circle cx="50" cy="50" r="32" fill="url(#genovePlanetGradIcon)" />

        {/* Front portion of golden orbital ring */}
        <path
          d="M 88 36 C 94 48 84 68 64 77 C 42 86 24 78 22 68"
          stroke="url(#genoveRingGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  // Full or Wordmark layout
  const isFull = variant === "full";
  const defaultHeight = isFull ? 64 : 36;
  const actualHeight = height ?? defaultHeight;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none overflow-visible ${className}`}
      style={{ height: typeof actualHeight === "number" ? `${actualHeight}px` : actualHeight }}
    >
      <svg
        viewBox={isFull ? "0 0 280 120" : "0 0 250 80"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="genovePlanetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4BAA2" />
            <stop offset="40%" stopColor="#E09C8D" />
            <stop offset="100%" stopColor="#6C9181" />
          </linearGradient>
          <linearGradient id="genoveGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <g id="wordmark" transform="translate(0, 0)">
          {/* First part: "Gen" */}
          <text
            x="0"
            y="62"
            fill={baseTextColor}
            fontFamily="'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="800"
            fontSize="62"
            letterSpacing="-1"
          >
            Gen
          </text>

          {/* Planet 'o' emblem inserted seamlessly between "Gen" and "ve" */}
          <g id="planet-o" transform="translate(148, 44)">
            <g
              className={spinPlanet ? "animate-[spin_7s_linear_infinite]" : ""}
              style={spinPlanet ? { transformOrigin: "0px 0px" } : undefined}
            >
              {/* Back portion of the golden ring */}
              <path
                d="M -31 10 C -39 -2 -31 -17 -14 -24 C 4 -31 24 -26 32 -15"
                stroke="url(#genoveGoldRing)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Planet Circle */}
              <circle cx="0" cy="0" r="24" fill="url(#genovePlanetGrad)" />

              {/* Front portion of the golden ring */}
              <path
                d="M 32 -15 C 40 -4 30 12 13 20 C -5 27 -24 21 -31 10"
                stroke="url(#genoveGoldRing)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>

          {/* Second part: "ve" - starts immediately after planet 'o' */}
          <text
            x="182"
            y="62"
            fill={baseTextColor}
            fontFamily="'Plus Jakarta Sans', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="800"
            fontSize="62"
            letterSpacing="-1"
          >
            ve
          </text>
        </g>

        {/* Full Tagline Section */}
        {isFull && (
          <g id="tagline" transform="translate(10, 110)">
            {/* Sparkle Star */}
            <path
              d="M 12 16 C 12 10 7 5 0 5 C 7 5 12 0 12 -5 C 12 0 17 5 24 5 C 17 5 12 10 12 16 Z"
              fill="url(#genoveGoldRing)"
            />
            {/* Tiny accent sparkles */}
            <circle cx="2" cy="16" r="1.5" fill="#FDE047" />
            <circle cx="22" cy="-3" r="1.5" fill="#FDE047" />

            {/* Tagline Text */}
            <text
              x="36"
              y="10"
              fill={baseTextColor}
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontSize="20"
              letterSpacing="0.3"
            >
              {taglineText}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * Rich Visual Card / Image Presentation Banner for Genove Logo
 * Used in Proposal de projet, Contact forms, and Hubs
 */
export function GenoveLogoCard({
  className = "",
  title,
  subtitle,
  logoOnly = false,
  logoHeight = 52,
  isCircle = false,
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  logoOnly?: boolean;
  logoHeight?: number;
  isCircle?: boolean;
}) {
  const isOnlyLogo = logoOnly || (!title && !subtitle);

  if (isCircle) {
    return (
      <div
        className={`relative overflow-hidden rounded-full aspect-square bg-gradient-to-br from-[#180E30] via-[#2A1554] to-[#0F0821] shadow-xl border-2 border-purple-400/40 group flex flex-col items-center justify-center p-3 text-white transition-transform duration-300 hover:scale-105 shrink-0 ${className}`}
      >
        {/* Subtle glow */}
        <div className="pointer-events-none absolute inset-0 bg-purple-600/20 blur-sm" />
        <div className="pointer-events-none absolute -right-2 -top-2 h-14 w-14 rounded-full bg-amber-400/15 blur-sm" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <GenoveLogo variant="full" height={logoHeight || 44} />
        </div>
      </div>
    );
  }

  if (isOnlyLogo) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#180E30] via-[#2A1554] to-[#0F0821] p-4 sm:p-5 text-white shadow-xl border border-purple-500/30 group flex flex-col items-center justify-center ${className}`}
      >
        {/* Background radial glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl transition-all duration-500 group-hover:bg-amber-400/25" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_60%)]" />

        {/* Decorative orbital ring in background */}
        <svg
          className="pointer-events-none absolute -right-4 -bottom-4 h-40 w-40 opacity-25 text-amber-400"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="48"
            ry="18"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(-25 50 50)"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full my-auto">
          <GenoveLogo variant="full" height={logoHeight} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#180E30] via-[#2A1554] to-[#0F0821] p-6 sm:p-8 text-white shadow-2xl border border-purple-500/30 group ${className}`}
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl transition-all duration-500 group-hover:bg-amber-400/25" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_60%)]" />

      {/* Decorative orbital ring in background */}
      <svg
        className="pointer-events-none absolute -right-8 -bottom-8 h-48 w-48 opacity-20 text-amber-400"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="48"
          ry="18"
          stroke="currentColor"
          strokeWidth="1.5"
          transform="rotate(-25 50 50)"
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
        {/* Full Logo Badge */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner inline-block">
          <GenoveLogo variant="full" height={60} />
        </div>

        {title && (
          <div className="space-y-1 mt-1">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
