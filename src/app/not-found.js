import React from 'react';
import Link from 'next/link';
import { Shield, Home, ArrowLeft, Search, Compass, BookOpen, Activity } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-xl w-full p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        
        {/* Shield Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-sm">
          <Shield className="w-10 h-10" />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-mono uppercase tracking-widest text-slate-700 dark:text-slate-300 font-bold">
          <span>CLASSIFICATION: 404 // DISPATCH ARCHIVED OR UNLOCATED</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 dark:text-white">
            Intelligence Dossier Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            The security intelligence briefing or report you are looking for may have been repositioned, declassified under a new slug, or permanently archived.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home Wire</span>
          </Link>

          <Link
            href="/threat-matrix"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 dark:bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Threat Matrix</span>
          </Link>
        </div>

        {/* Quick Intelligence Desks */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Available Regional Security Desks:
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link href="/special-reports" className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:text-amber-700 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 font-semibold transition-colors">
              Special Dossiers
            </Link>
            <Link href="/world-news" className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:text-amber-700 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 font-semibold transition-colors">
              World Security
            </Link>
            <Link href="/coverage/national-security" className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:text-amber-700 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 font-semibold transition-colors">
              National Security
            </Link>
            <Link href="/coverage/counter-terrorism" className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:text-amber-700 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 font-semibold transition-colors">
              Counter-Terrorism
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
