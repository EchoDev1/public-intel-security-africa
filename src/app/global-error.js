'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
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
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              PUBLIC INTEL SECURITY AFRICA • CONTINENTAL WIRE
            </span>
            <h1 className="text-2xl font-black font-serif text-white">
              Strategic Intelligence Hub
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Continue directly to the Public Intel Security Africa live wire or refresh your current view.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                try {
                  reset();
                } catch (_) {
                  if (typeof window !== 'undefined') window.location.reload();
                }
              }}
              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Open Current View
            </button>
            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors block text-center"
            >
              Return to Frontline Home Wire
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
