'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, ChevronRight, Activity, Globe2, Compass, Radio } from 'lucide-react';
import { CONTINENTAL_THREAT_INDEX } from '@/lib/data/threatRadar';

export default function ThreatRadarWidget() {
  const [activeTab, setActiveTab] = useState(0);
  const [sectors, setSectors] = useState(CONTINENTAL_THREAT_INDEX);
  const [syncSource, setSyncSource] = useState('UN Peace & Security Early Warning Telemetry');
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveMatrix() {
      try {
        const res = await fetch('/api/threat-matrix');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.sectors) && data.sectors.length > 0) {
          setSectors(data.sectors);
          if (data.lastSyncSource) setSyncSource(data.lastSyncSource);
          if (data.lastSyncTimestamp) setLastSyncTime(data.lastSyncTimestamp);
        }
      } catch (_) {}
    }
    loadLiveMatrix();
    return () => { isMounted = false; };
  }, []);

  const currentRegion = sectors[activeTab] || sectors[0];

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-4 max-w-7xl mx-auto bg-white dark:bg-slate-950 transition-colors">
      <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 md:p-8 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <span>Continental Security Threat Matrix</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 text-[9px] font-mono font-bold">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  <span>LIVE RADAR</span>
                </span>
              </h3>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-serif mt-1">
              Real-Time Regional Risk & Stability Index
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline truncate max-w-xs" title={syncSource}>
              Verified Source: {syncSource}
            </span>
            <Link
              href="/threat-matrix"
              className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Full Matrix View</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Region Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6">
          {sectors.map((item, idx) => {
            const isSelected = activeTab === idx;
            const badgeColor =
              item.threatLevel === 'Critical' ? 'text-red-700 dark:text-red-400 font-bold' :
              item.threatLevel === 'Elevated' ? 'text-orange-700 dark:text-orange-400 font-bold' : 'text-amber-700 dark:text-amber-400 font-bold';

            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-amber-600 dark:border-amber-500 shadow-sm ring-1 ring-amber-600 dark:ring-amber-500'
                    : 'bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-500 dark:text-slate-400">INDEX</span>
                  <span className={badgeColor}>{item.threatScore} / 10</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {item.region}
                </h4>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.statusColor}`}></span>
                  <span className={`text-[10px] uppercase font-semibold ${badgeColor}`}>
                    {item.threatLevel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Region Assessment Briefing Box */}
        {currentRegion && (
          <div className="mt-6 p-5 md:p-6 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider text-white ${
                  currentRegion.threatLevel === 'Critical' ? 'bg-red-600' :
                  currentRegion.threatLevel === 'Elevated' ? 'bg-orange-600' : 'bg-amber-600'
                }`}>
                  {currentRegion.threatLevel} Threat
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentRegion.region}
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {currentRegion.lastUpdated}
                </span>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentRegion.details}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Primary Threat Vector: </span>
                  <span className="text-amber-800 dark:text-amber-400 font-bold">{currentRegion.primaryVector}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Trend: </span>
                  <span className="text-slate-900 dark:text-white font-semibold">{currentRegion.trend}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Countries in High Advisory</span>
              </h5>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {currentRegion.countriesAffected}
              </p>
              <Link
                href={`/coverage/national-security`}
                className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold flex items-center gap-1 pt-1 transition-colors"
              >
                <span>View Related Dispatches</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
