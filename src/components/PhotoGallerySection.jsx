'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, MapPin, ArrowRight } from 'lucide-react';
import { GALLERY_ITEMS } from '@/lib/data/gallery';

export default function PhotoGallerySection() {
  const previewItems = GALLERY_ITEMS.slice(0, 4);

  return (
    <section className="py-10 sm:py-14 px-3 sm:px-4 max-w-7xl mx-auto bg-white dark:bg-slate-950 transition-colors">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-400">
              Visual Field Journalism
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-serif mt-1">
            Continental News & Photographic Gallery
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Unfiltered photographic field essays and lens dispatches from defense correspondents, naval patrols, forensic laboratories, and frontline zones across Africa.
          </p>
        </div>

        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold uppercase tracking-wider transition-colors"
        >
          <span>View Full Photo Archive</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4-Column Photo Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {previewItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-radial-[at_top_left] from-slate-900 via-slate-950 to-black p-4 flex flex-col justify-between border-b border-amber-600/30 select-none">
              {/* Tactical Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab3080c_1px,transparent_1px),linear-gradient(to_bottom,#eab3080c_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

              {/* Category Pill */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-500/40">
                  {item.category}
                </span>
                <Camera className="w-4 h-4 text-amber-500/80" />
              </div>

              {/* Centered Incoming Typography */}
              <div className="relative z-10 text-center py-6 my-auto">
                <div className="text-amber-500/80 font-mono text-[9px] uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>FIELD PHOTO ARCHIVE</span>
                </div>
                <div className="text-xs sm:text-sm font-black tracking-wider uppercase font-mono text-white group-hover:text-amber-400 transition-colors drop-shadow-md px-1">
                  CONTINENTAL PHOTO ARCHIVE & FIELD LENS INCOMING
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1 block">FIELD DISPATCH PENDING</span>
              </div>

              {/* Content overlay */}
              <div className="relative z-10 space-y-1 border-t border-slate-800 pt-2">
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
                <h4 className="text-sm font-bold leading-snug line-clamp-2 font-serif text-white">
                  {item.title}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
