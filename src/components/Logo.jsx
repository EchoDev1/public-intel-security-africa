'use client';

import React from 'react';
import Link from 'next/link';

export default function Logo({ 
  variant = 'light', // 'light' for white/auto backgrounds, 'dark' for permanently dark backgrounds (footer)
  size = 'default',  // 'compact', 'default', 'large'
  showTagline = true,
  href = '/'
}) {
  const isDark = variant === 'dark';

  // Responsive sizing configurations optimized for mobile screens
  const iconSizes = {
    compact: 'w-9 h-9 sm:w-10 sm:h-10',
    default: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12',
    large: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16'
  };

  const titleSizes = {
    compact: 'text-sm sm:text-base md:text-lg',
    default: 'text-[15px] sm:text-lg md:text-xl lg:text-[22px]',
    large: 'text-xl sm:text-2xl md:text-3xl'
  };

  const Content = (
    <div className="flex items-center gap-2.5 sm:gap-3 group select-none">
      {/* Precision Engineered Defense Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="piGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="piRedGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="60%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#450A0A" />
            </linearGradient>

            <linearGradient id="piDarkShield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="piGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Outer Tactical Radar Ring with Precision Ticks */}
          <circle 
            cx="24" 
            cy="24" 
            r="23" 
            stroke="url(#piGoldGrad)" 
            strokeWidth="0.8" 
            strokeDasharray="2 3" 
            strokeOpacity="0.4"
          />

          {/* 4 Cardinal Radar Ticks */}
          <line x1="24" y1="0.5" x2="24" y2="3.5" stroke="url(#piGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="44.5" x2="24" y2="47.5" stroke="url(#piGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0.5" y1="24" x2="3.5" y2="24" stroke="url(#piGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44.5" y1="24" x2="47.5" y2="24" stroke="url(#piGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Sovereign Shield Outer Bezel */}
          <path
            d="M24 3.5 L40.5 10.5 C40.5 24 24 43 24 43 C24 43 7.5 24 7.5 10.5 Z"
            fill="url(#piDarkShield)"
            stroke="url(#piGoldGrad)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Inner Shield Inset Accent */}
          <path
            d="M24 6.5 L37.5 12.5 C37.5 23 24 38.5 24 38.5 C24 38.5 10.5 23 10.5 12.5 Z"
            fill="url(#piGlow)"
            stroke="url(#piGoldGrad)"
            strokeWidth="0.6"
            strokeOpacity="0.6"
          />

          {/* Defense Crosshairs */}
          <line x1="24" y1="9" x2="24" y2="36" stroke="url(#piGoldGrad)" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="1.5 2" />
          <line x1="13" y1="22.5" x2="35" y2="22.5" stroke="url(#piGoldGrad)" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="1.5 2" />

          {/* Central 8-Point Strategic Intelligence Compass Star */}
          <path
            d="M24 13.5 L26 21.5 L34 22.5 L26 23.5 L24 31.5 L22 23.5 L14 22.5 L22 21.5 Z"
            fill="url(#piGoldGrad)"
          />
          <path
            d="M24 17.5 L25.5 21 L29 22.5 L25.5 24 L24 27.5 L22.5 24 L19 22.5 L22.5 21 Z"
            fill="#FEF3C7"
          />

          {/* Core Telemetry Node */}
          <circle cx="24" cy="22.5" r="2.2" fill="#DC2626" />
          <circle cx="24" cy="22.5" r="1" fill="#FFFFFF" />

          {/* Micro Typography: PI Security Stamp */}
          <rect x="18" y="32" width="12" height="4.5" rx="1.5" fill="#0F172A" stroke="url(#piGoldGrad)" strokeWidth="0.6" />
          <text 
            x="24" 
            y="35.5" 
            textAnchor="middle" 
            fill="#FCD34D" 
            fontSize="3.2" 
            fontWeight="900" 
            fontFamily="monospace"
            letterSpacing="0.5"
          >
            INTEL
          </text>
        </svg>
      </div>

      {/* Brand Typography & Short Detailed Lineage */}
      <div className="flex flex-col justify-center">
        {/* Main Brand Title */}
        <div className="flex items-center gap-1 sm:gap-1.5 leading-none flex-wrap">
          <span className={`font-black uppercase tracking-tight font-serif ${titleSizes[size]} ${isDark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            PUBLIC INTEL
          </span>
          <span className={`font-black uppercase tracking-tight font-serif ${titleSizes[size]} ${isDark ? 'text-amber-400' : 'text-amber-700 dark:text-amber-400'}`}>
            SECURITY AFRICA
          </span>
        </div>

        {/* Shorter, Highly Detailed & Fine Credential Tagline */}
        {showTagline && (
          <div className="mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5 text-[8.5px] sm:text-[9.5px] md:text-[10.5px] uppercase font-mono tracking-wider">
            <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700 dark:text-amber-400'}`}>
              PLUGINS MEDIA
            </span>
            <span className={`text-[8px] ${isDark ? 'text-slate-600' : 'text-slate-400 dark:text-slate-600'}`}>•</span>
            <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
              Security Media Production
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-hidden">
        {Content}
      </Link>
    );
  }

  return Content;
}
