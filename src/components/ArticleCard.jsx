'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Globe, ArrowUpRight, Shield, Flame } from 'lucide-react';

export default function ArticleCard({ article, layout = 'standard' }) {
  if (!article) return null;

  const threatColor =
    article.threatLevel === 'Critical' ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/60' :
    article.threatLevel === 'Elevated' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/60' :
    article.threatLevel === 'Guarded' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60' :
    'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';

  if (layout === 'compact') {
    return (
      <Link 
        href={`/article/${article.slug}`}
        className="group flex gap-4 p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 transition-all shadow-xs"
      >
        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 96px, 96px"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              {article.categoryName}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug mt-0.5">
              {article.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <span>{article.readTime}</span>
            <span>•</span>
            <span>{article.region}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
        
        {/* Category & Threat Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-xs">
            {article.categoryName}
          </span>
          {article.isBreaking && (
            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-xs">
              <Flame className="w-2.5 h-2.5" />
              BREAKING
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider backdrop-blur-md bg-white/90 dark:bg-slate-900/90 ${threatColor}`}>
            {article.threatLevel}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              {article.region}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {article.readTime}
            </span>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2 font-serif">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Author / Footer info */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
                sizes="24px"
              />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{article.author.name}</span>
          </div>

          <Link
            href={`/article/${article.slug}`}
            className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <span>Read Dossier</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
