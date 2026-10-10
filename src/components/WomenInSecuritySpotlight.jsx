'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Quote, ArrowRight } from 'lucide-react';
import { WOMEN_IN_SECURITY } from '@/lib/data/womenInSecurity';

export default function WomenInSecuritySpotlight() {
  const spotlightLeaders = WOMEN_IN_SECURITY.slice(0, 3);

  return (
    <section className="py-10 sm:py-14 px-3 sm:px-4 max-w-7xl mx-auto bg-white dark:bg-slate-950 transition-colors">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-400">
              Leadership & Peace Architecture
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-serif mt-1">
            Women in Security Leadership Forum
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Spotlighting female defense strategists, cyber directors, forensic scientists, and peace mediators reshaping Africa&apos;s defense landscape.
          </p>
        </div>

        <Link
          href="/women-in-security"
          className="inline-flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold uppercase tracking-wider transition-colors"
        >
          <span>Explore All Profiles & Directory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Leaders */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {spotlightLeaders.map((leader) => (
          <div
            key={leader.id}
            className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              {/* Leader Avatar & Country */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-amber-600 shrink-0">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    {leader.country}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug font-serif">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{leader.organization}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="relative p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 mb-4">
                <Quote className="w-5 h-5 text-amber-600/30 dark:text-amber-400/20 absolute top-2 right-2" />
                <p className="text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed font-medium">
                  &ldquo;{leader.featuredQuote}&rdquo;
                </p>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {leader.bio}
              </p>
            </div>

            {/* Bottom */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-amber-800 dark:text-amber-400 font-mono text-[11px] font-bold truncate max-w-[170px]">
                {leader.specialization}
              </span>
              <Link
                href="/women-in-security"
                className="text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-400 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
