import React from "react";
import { motion } from "motion/react";

export function IsometricBooks3D({
  className = "w-32 h-32 sm:w-36 sm:h-36",
}: {
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 group ${className}`}>
      {/* Soft Ambient Radial Glow underneath books */}
      <motion.div
        className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg
        viewBox="0 0 320 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 filter drop-shadow-[0_15px_25px_rgba(15,8,38,0.45)] select-none"
      >
        <defs>
          {/* Book 1 (Blue) Gradients */}
          <linearGradient id="blue-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="blue-spine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="blue-pages" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Book 2 (Pink/Coral) Gradients */}
          <linearGradient id="pink-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
          <linearGradient id="pink-spine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>

          {/* Tablet/Notebook (Lavender) Gradients */}
          <linearGradient id="tablet-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EEF2FF" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
          <linearGradient id="tablet-edge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#A5B4FC" />
          </linearGradient>
        </defs>

        {/* Overall Stack Dynamic Shadow (shrinks/fades as books float up) */}
        <motion.ellipse
          cx="160"
          cy="265"
          rx="110"
          ry="22"
          fill="#000000"
          fillOpacity="0.18"
          filter="blur(8px)"
          animate={{
            scale: [1, 0.78, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 1. BOTTOM BOOK (BLUE) - Floating animation */}
        <motion.g
          animate={{ y: [30, 22, 30] }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path d="M 40 180 L 170 245 L 170 215 L 40 150 Z" fill="url(#blue-spine)" />
          <path d="M 170 245 L 265 198 L 265 168 L 170 215 Z" fill="url(#blue-pages)" />
          <path d="M 175 220 L 260 178" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 175 227 L 260 185" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 175 234 L 260 192" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 40 150 L 135 102 L 265 168 L 170 215 Z" fill="url(#blue-top)" />
          <path d="M 40 150 L 170 215" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>

        {/* 2. MIDDLE BOOK (PINK/CORAL) - Floating animation */}
        <motion.g
          animate={{ y: [-15, -28, -15] }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.25,
          }}
        >
          <path d="M 50 155 L 170 215 L 170 185 L 50 125 Z" fill="url(#pink-spine)" />
          <path d="M 170 215 L 260 170 L 260 140 L 170 185 Z" fill="url(#blue-pages)" />
          <path d="M 175 190 L 255 150" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 175 197 L 255 157" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 175 204 L 255 164" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 50 125 L 140 80 L 260 140 L 170 185 Z" fill="url(#pink-top)" />
          <path d="M 50 125 L 170 185" stroke="#FFE4E6" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>

        {/* 3. TOP TABLET / NOTEBOOK - Floating animation */}
        <motion.g
          animate={{ y: [-55, -73, -55] }}
          transition={{
            duration: 3.0,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <path
            d="M 75 110 L 165 155 L 245 115 L 245 105 L 165 145 L 75 100 Z"
            fill="url(#tablet-edge)"
          />
          <path
            d="M 75 100 L 155 60 L 245 105 L 165 145 Z"
            fill="url(#tablet-top)"
            stroke="#A5B4FC"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M 95 90 L 150 62 L 210 92 L 155 120 Z" fill="#3730A3" fillOpacity="0.12" />

          {/* Dots & lines */}
          <g fill="#3730A3">
            <ellipse cx="120" cy="82" rx="4" ry="2.5" />
            <ellipse cx="135" cy="89" rx="4" ry="2.5" />
            <ellipse cx="150" cy="96" rx="4" ry="2.5" />
            <ellipse cx="165" cy="103" rx="4" ry="2.5" />
          </g>
          <g stroke="#4338CA" strokeWidth="3" strokeLinecap="round" opacity="0.65">
            <line x1="120" y1="98" x2="195" y2="60" strokeWidth="2.5" opacity="0.4" />
            <line x1="110" y1="112" x2="190" y2="72" strokeWidth="3" />
            <line x1="125" y1="120" x2="205" y2="80" strokeWidth="3" />
            <line x1="140" y1="128" x2="215" y2="90" strokeWidth="3" />
          </g>
          <g fill="#4F46E5">
            <ellipse cx="102" cy="116" rx="3.5" ry="2" />
            <ellipse cx="117" cy="124" rx="3.5" ry="2" />
            <ellipse cx="132" cy="132" rx="3.5" ry="2" />
          </g>
        </motion.g>

        {/* Floating Sparkles & Orb */}
        <motion.path
          d="M 270 60 L 273 68 L 281 71 L 273 74 L 270 82 L 267 74 L 259 71 L 267 68 Z"
          fill="#FBBF24"
          animate={{
            y: [0, -14, 0],
            scale: [0.9, 1.25, 0.9],
            rotate: [0, 20, 0],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
        <motion.circle
          cx="50"
          cy="80"
          r="4"
          fill="#60A5FA"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}

export default IsometricBooks3D;
