import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  showText = true,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: "w-8 h-8", text: "text-lg", sub: "text-[9px]" },
    md: { icon: "w-10 h-10", text: "text-xl", sub: "text-[11px]" },
    lg: { icon: "w-14 h-14", text: "text-2xl", sub: "text-xs" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Mark */}
      <div
        className={`${currentSize.icon} relative shrink-0 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-0.5 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/30 overflow-hidden flex items-center justify-center transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoInnerGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="logoInnerEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Octagram Rub el Hizb subtle background */}
          <g transform="translate(50 50)" opacity="0.28">
            <rect x="-24" y="-24" width="48" height="48" rx="4" stroke="#6ee7b7" strokeWidth="1.2" />
            <rect x="-24" y="-24" width="48" height="48" rx="4" stroke="#6ee7b7" strokeWidth="1.2" transform="rotate(45)" />
          </g>

          {/* Mihrab / Dome contour */}
          <path
            d="M 37 78 L 37 56 C 37 44 43 35 50 30 C 57 35 63 44 63 56 L 63 78"
            stroke="url(#logoInnerEmerald)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Crescent Moon */}
          <path
            d="M 53 34 A 19 19 0 1 0 71 66 A 16.5 16.5 0 1 1 53 34 Z"
            fill="url(#logoInnerGold)"
          />

          {/* 8-Point Star */}
          <g transform="translate(62 44) scale(0.3)">
            <path
              d="M 0 -22 L 5 -7 L 20 -5 L 8 4 L 12 19 L 0 10 L -12 19 L -8 4 L -20 -5 L -5 -7 Z"
              fill="#ffffff"
            />
          </g>

          {/* Bottom arc accent */}
          <path
            d="M 43 78 C 47 75 53 75 57 78"
            stroke="url(#logoInnerGold)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Typography Brand */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight text-emerald-950 dark:text-emerald-50 ${currentSize.text}`}
            >
              Uswah<span className="text-amber-500 font-extrabold">.id</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-200/50 dark:border-emerald-700/50">
              Kemenag
            </span>
          </div>
          <span
            className={`text-slate-500 dark:text-emerald-400/80 font-medium tracking-tight mt-0.5 ${currentSize.sub}`}
          >
            Teladan Ibadah &amp; Sunnah
          </span>
        </div>
      )}
    </div>
  );
}
