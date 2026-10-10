'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { BREAKING_ALERTS } from '@/lib/data/threatRadar';

export default function BreakingTicker() {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % BREAKING_ALERTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs py-1.5 md:py-2 px-3 sm:px-4 select-none relative overflow-hidden z-20 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Badge */}
        <div className="flex items-center gap-1.5 bg-red-600 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[9.5px] sm:text-[10px] shrink-0 shadow-sm animate-pulse">
          <Flame className="w-3 h-3 text-amber-300" />
          <span className="hidden xs:inline">LIVE INTEL ALERT</span>
          <span className="xs:hidden">INTEL ALERT</span>
        </div>

        {/* Mobile View: Sized To Fit cleanly on screen without sliding marquee */}
        <div 
          onClick={() => setCurrentAlertIndex((prev) => (prev + 1) % BREAKING_ALERTS.length)}
          className="md:hidden flex-1 min-w-0 cursor-pointer py-0.5"
          title="Tap to cycle next alert"
        >
          <div className="text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 font-medium truncate flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
            <span className="truncate">{BREAKING_ALERTS[currentAlertIndex]}</span>
          </div>
        </div>

        {/* Desktop View: Full Continuous Marquee */}
        <div className="hidden md:block overflow-hidden flex-1 relative h-5">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-slate-800 dark:text-slate-200 font-medium text-xs">
            {BREAKING_ALERTS.map((alert, index) => (
              <span key={index} className="inline-flex items-center gap-2 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>
                <span>{alert}</span>
              </span>
            ))}
            {/* Duplicated for smooth loop */}
            {BREAKING_ALERTS.map((alert, index) => (
              <span key={`dup-${index}`} className="inline-flex items-center gap-2 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>
                <span>{alert}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Link to Threat Matrix */}
        <Link 
          href="/threat-matrix" 
          className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold uppercase tracking-wider shrink-0 transition-colors pl-2 border-l border-slate-300 dark:border-slate-700"
        >
          <span className="hidden sm:inline">Threat Matrix</span>
          <span className="sm:hidden">Matrix</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
