'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Shield, Radio, Tv, Globe, FileText, ArrowRight } from 'lucide-react';

export default function Error({ error, reset }) {
  const hasAttemptedReset = useRef(false);

  useEffect(() => {
    if (!hasAttemptedReset.current && typeof reset === 'function') {
      hasAttemptedReset.current = true;
      const timer = setTimeout(() => {
        try {
          reset();
        } catch (_) {}
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [error, reset]);

  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-3xl w-full p-8 md:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-sm shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
                PUBLIC INTEL SECURITY AFRICA • CONTINENTAL WIRE
              </span>
              <h1 className="text-xl md:text-2xl font-black font-serif text-slate-900 dark:text-white">
                Strategic Intelligence &amp; Broadcast Hub
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              try {
                reset();
              } catch (_) {
                if (typeof window !== 'undefined') window.location.reload();
              }
            }}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Open Live View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Select an intelligence desk or live broadcast feed below to continue exploring verified security dispatches across West, East, Horn, Southern, and North Africa.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Link
            href="/"
            className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-600 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-700">
                  Frontline Home Wire
                </div>
                <div className="text-[11px] text-slate-500">Breaking dispatches &amp; threat radar</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
          </Link>

          <Link
            href="/coverage"
            className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-600 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-700">
                  25 Intelligence Desks
                </div>
                <div className="text-[11px] text-slate-500">All continental security categories</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
          </Link>

          <Link
            href="/radio"
            className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-600 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-700">
                  Public Intel Radio (24/7)
                </div>
                <div className="text-[11px] text-slate-500">Live 320 KBPS HD audio stream</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
          </Link>

          <Link
            href="/television"
            className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-600 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Tv className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-700">
                  Public Intel Television
                </div>
                <div className="text-[11px] text-slate-500">Live video bulletins &amp; documentaries</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
          </Link>
        </div>
      </div>
    </div>
  );
}
