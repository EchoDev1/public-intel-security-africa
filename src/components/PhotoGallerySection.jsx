'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>

              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-xs">
                  {item.category}
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
                <h4 className="text-sm font-bold leading-snug line-clamp-2 font-serif">
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
