'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Fatal Global Error Boundary caught exception:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl font-black">
            🛡️
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              PAN-AFRICAN SECURITY RADAR • SYSTEM DISPATCH
            </span>
            <h1 className="text-2xl font-black font-serif text-white">
              System Core Interruption
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A temporary application state exception occurred. The Public Intel Security Africa telemetry core is ready to recover.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => reset()}
              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Recover & Reload Page
            </button>
            <a
              href="/"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors block text-center"
            >
              Return to Intelligence Terminal
            </a>
          </div>

          <div className="pt-2 text-[10px] font-mono text-slate-500">
            PUBLIC INTEL SECURITY AFRICA // OPERATIONAL INTEGRITY
          </div>
        </div>
      </body>
    </html>
  );
}
