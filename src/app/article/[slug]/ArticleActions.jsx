'use client';

import React, { useState } from 'react';
import { Share2, Printer, Bookmark, Check } from 'lucide-react';

export default function ArticleActions({ title, slug }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Actions:
        </span>
        <button
          onClick={handleShare}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-amber-700" />}
          <span>{copied ? 'Link Copied!' : 'Share Dossier'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs font-semibold"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print / PDF Brief</span>
        </button>
      </div>

      <button
        onClick={() => setBookmarked(!bookmarked)}
        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border shadow-xs font-semibold ${
          bookmarked
            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        <Bookmark className="w-3.5 h-3.5" />
        <span>{bookmarked ? 'Saved to Intel Briefcase' : 'Bookmark Report'}</span>
      </button>
    </div>
  );
}
