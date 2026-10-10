'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Shield, ArrowRight, Globe } from 'lucide-react';
import { ARTICLES } from '@/lib/data/articles';
import { CATEGORIES } from '@/lib/data/categories';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredArticles = ARTICLES.filter((item) => {
    const matchesQuery =
      query.trim() === '' ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(query.toLowerCase()) ||
      item.region.toLowerCase().includes(query.toLowerCase()) ||
      (item.country && item.country.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || item.categorySlug === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60">
          <Search className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search intelligence dossiers, maritime, forensics, cyber, food..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-base"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white px-2 py-1 text-xs uppercase font-bold tracking-wider rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1">
            Category:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md transition-colors font-semibold ${
              selectedCategory === 'all'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-2.5 py-1 rounded-md transition-colors font-semibold ${
                selectedCategory === cat.slug
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div 
                key={article.id}
                onClick={() => {
                  router.push(`/article/${article.slug}`);
                  onClose();
                }}
                className="pt-3 first:pt-0 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-2.5 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2 text-[11px] mb-1 font-medium">
                  <span className="text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">
                    {article.categoryName}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {article.region}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {article.threatLevel} Threat
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug font-serif">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                  {article.excerpt}
                </p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <Shield className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No matching intelligence reports found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try searching for &quot;Maritime&quot;, &quot;Sahel&quot;, &quot;Cyber&quot;, or &quot;Forensics&quot;.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
          <span className="font-semibold">{filteredArticles.length} Intelligence Reports Found</span>
          <Link href="/coverage" onClick={onClose} className="hover:text-amber-800 dark:hover:text-amber-400 font-bold flex items-center gap-1">
            <span>Explore All 25 Coverage Verticals</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
