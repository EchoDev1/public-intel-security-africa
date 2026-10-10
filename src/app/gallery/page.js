'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, MapPin, X, ZoomIn } from 'lucide-react';
import { GALLERY_ITEMS } from '@/lib/data/gallery';

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Maritime Security', 'Energy Security', 'National Security', 'Forensics', 'Gender & Peace', 'Cybersecurity', 'Election Security', 'Climate & Food Security'];

  const filteredPhotos = GALLERY_ITEMS.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.category === activeFilter;
  });

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest">
          <Camera className="w-3.5 h-3.5 text-amber-700" />
          <span>Visual Field Journalism</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          Continental News & Photographic Gallery
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          High-resolution photo essays and authentic lens documentation capturing naval patrols, border checkpoints, forensic labs, peace accords, and community resilience across Africa.
        </p>

        {/* Filter Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === cat
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group cursor-pointer relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-600 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>

              {/* Hover Zoom Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-3 rounded-full bg-white text-slate-900 shadow-xl">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>

              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-wider border border-slate-200 shadow-sm">
                  {item.category}
                </span>
              </div>

              {/* Overlaid Bottom Details */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-mono font-medium">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug group-hover:text-amber-300 transition-colors font-serif">
                  {item.title}
                </h3>

                <p className="text-[11px] text-slate-200 line-clamp-2">
                  {item.fieldNotes}
                </p>

                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-slate-300 font-medium">
                  <span className="truncate max-w-[130px]">{item.photographer}</span>
                  <span className="text-amber-300 font-bold font-mono">{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Image Preview */}
            <div className="relative md:w-3/5 aspect-square md:aspect-auto bg-slate-100">
              <Image
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>

            {/* Metadata & Field Notes */}
            <div className="p-6 md:p-8 md:w-2/5 flex flex-col justify-between space-y-4 bg-white">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider">
                  {selectedPhoto.category}
                </span>

                <h3 className="text-lg md:text-xl font-bold text-slate-900 font-serif">
                  {selectedPhoto.title}
                </h3>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5 text-amber-800 font-mono text-[11px] font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedPhoto.location}</span>
                  </div>
                  <p className="pt-1 text-slate-600 leading-relaxed font-medium">
                    {selectedPhoto.fieldNotes}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1 font-medium">
                <div>Field Lens: <strong className="text-slate-900">{selectedPhoto.photographer}</strong></div>
                <div>Date Recorded: <span className="text-amber-800 font-mono font-bold">{selectedPhoto.date}</span></div>
                <div className="pt-2 text-[10px] text-slate-400">
                  High-resolution photojournalism curated by Public Intel Security Africa.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
