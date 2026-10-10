'use client';

import React from 'react';
import Link from 'next/link';
import { Globe2, ArrowRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { getWorldNewsArticles } from '@/lib/data/articles';

export default function WorldNewsSection() {
  const worldArticles = getWorldNewsArticles();

  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Header matching Special Investigative Reports style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Globe2 className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">
              World News & Global Geopolitics
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-300 dark:border-blue-800">
              International Desk
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-serif mt-1">
            World News & International Defense
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Global geopolitical shifts, UN Security Council dispatches, international defense pacts, and multilateral security telemetry.
          </p>
        </div>

        <Link
          href="/coverage/world-news"
          className="inline-flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold uppercase tracking-wider transition-colors shrink-0"
        >
          <span>View All World News</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Clean 3-Card Grid (Matching Special Investigative Reports) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {worldArticles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
