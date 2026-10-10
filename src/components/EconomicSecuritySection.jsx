'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Landmark } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { getEconomicSecurityArticles } from '@/lib/data/articles';

export default function EconomicSecuritySection() {
  const economicArticles = getEconomicSecurityArticles();

  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Header matching Special Investigative Reports and World News style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Sector Intelligence Desk
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
              Economic & Financial Security
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-serif mt-1">
            Economic & Financial Security
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Illicit financial flows, trade corridor resilience, critical minerals sovereignty, and macroeconomic defense architectures.
          </p>
        </div>

        <Link
          href="/coverage/economic-and-financial-security"
          className="inline-flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold uppercase tracking-wider transition-colors shrink-0"
        >
          <span>View All Economic Intelligence</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Clean 3-Card Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {economicArticles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
