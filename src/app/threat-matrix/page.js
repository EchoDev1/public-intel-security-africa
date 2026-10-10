import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, ArrowLeft, Shield, Compass } from 'lucide-react';
import { CONTINENTAL_THREAT_INDEX } from '@/lib/data/threatRadar';

export default function ThreatMatrixPage() {
  return (
    <div className="py-10 px-4 max-w-7xl mx-auto space-y-10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <Link href="/" className="hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-amber-700 dark:text-amber-400 font-bold">Threat Matrix</span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5 animate-pulse text-red-600 dark:text-red-400" />
          <span>Real-Time Situational Awareness</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white font-serif">
          Continental Security Threat Matrix
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Comprehensive regional stability indices, asymmetric conflict monitoring, maritime choke-point telemetry, and resource security vulnerability assessments across all African geopolitical sectors.
        </p>
      </div>

      {/* Threat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONTINENTAL_THREAT_INDEX.map((sector, idx) => {
          const badgeClass =
            sector.threatLevel === 'Critical' ? 'bg-red-600 text-white' :
            sector.threatLevel === 'Elevated' ? 'bg-orange-600 text-white' : 'bg-amber-600 text-white';

          return (
            <div
              key={idx}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${badgeClass}`}>
                    {sector.threatLevel} ({sector.threatScore} / 10)
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">{sector.lastUpdated}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif leading-tight">
                  {sector.region}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sector.details}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Primary Threat Vector:</span>
                    <span className="text-amber-800 dark:text-amber-400 font-bold">{sector.primaryVector}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-bold">Trend Assessment:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{sector.trend}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Jurisdictions Affected:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold">{sector.countriesAffected}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <Link
                  href="/coverage/national-security"
                  className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Related Intelligence Dossiers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Bar */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>Need specialized sector briefing? Connect with our strategic risk analysis desks.</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/coverage/world-news"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            World News Desk
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>

    </div>
  );
}
