'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, Home, ArrowLeft, Wrench, ShieldCheck } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to console for diagnostic monitoring
    console.error('PISA Telemetry Error Boundary caught exception:', error);
  }, [error]);

  const handleSelfHeal = () => {
    try {
      // Clear any temporary corrupted buffers from localStorage while preserving auth
      if (typeof window !== 'undefined') {
        const keysToClean = ['pisa_temp_filter', 'pisa_search_cache', 'next_cached_query'];
        keysToClean.forEach(k => {
          try { localStorage.removeItem(k); } catch (_) {}
        });
        window.location.reload();
      }
    } catch (_) {
      reset();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-xl w-full p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
        
        {/* Shield Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>INTELLIGENCE RADAR • TEMPORARY SIGNAL LATENCY</span>
        </div>

        {/* Heading & Context */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black font-serif text-slate-900 dark:text-white">
            Connection Interruption Detected
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Our automated monitoring desk detected a brief telemetry glitch or data timeout. Your security clearance, session, and platform data remain completely secure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={handleSelfHeal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700"
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>Self-Heal & Reload</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 dark:bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Home Wire</span>
          </Link>
        </div>

        {/* Guarantee Badge */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Public Intel Security Africa Continuous Redundancy Core</span>
        </div>

        {/* Collapsible Error Code (Technical Details) */}
        {error?.message && (
          <details className="text-left text-[11px] text-slate-500 font-mono bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <summary className="font-bold text-slate-700 dark:text-slate-300">Technical Diagnostic Log</summary>
            <p className="mt-2 break-all text-red-500 font-mono text-[10px]">{String(error.message)}</p>
          </details>
        )}

      </div>
    </div>
  );
}
