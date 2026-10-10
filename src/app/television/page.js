'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tv, Play } from 'lucide-react';
import { TELEVISION_SHOWS } from '@/lib/data/multimedia';

export default function TelevisionPage() {
  const [selectedVideo, setSelectedVideo] = useState(TELEVISION_SHOWS[0]);

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Main Broadcast Studio Player */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-red-600 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              PI-TV STREAM 1
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline font-semibold">
              Continental Defense & Strategic Television Network
            </span>
          </div>

          <span className="text-xs text-amber-800 font-mono font-bold">
            HD 1080p 60fps Broadcast
          </span>
        </div>

        {/* Video Frame */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-300 shadow-xl group">
          <Image
            src={selectedVideo.thumbnail}
            alt={selectedVideo.title}
            fill
            className="object-cover opacity-90"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => alert(`Starting video broadcast: ${selectedVideo.title}`)}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 pl-1 border-4 border-white"
            >
              <Play className="w-10 h-10 fill-white" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">
                {selectedVideo.category}
              </span>
              <h1 className="text-xl md:text-3xl font-black text-white font-serif leading-tight">
                {selectedVideo.title}
              </h1>
            </div>

            <div className="text-right text-xs font-mono text-slate-200">
              <span className="text-amber-300 block font-bold">{selectedVideo.broadcastTime}</span>
              <span>{selectedVideo.views}</span>
            </div>
          </div>
        </div>

        {/* Video Overview Description */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
            Broadcast Intelligence Overview
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
            {selectedVideo.description}
          </p>
        </div>
      </div>

      {/* Broadcast Programs Catalog */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Tv className="w-5 h-5 text-red-600" />
            <span>Public Intel Television Episodes & Documentaries</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {TELEVISION_SHOWS.length} Bulletins On Demand
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TELEVISION_SHOWS.map((tv) => (
            <div
              key={tv.id}
              onClick={() => {
                setSelectedVideo(tv);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-red-600 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <Image
                    src={tv.thumbnail}
                    alt={tv.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                    {tv.duration}
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-600 text-[10px] font-bold uppercase text-white">
                    {tv.category}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2 font-serif">
                  {tv.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {tv.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="font-mono">{tv.views}</span>
                <span className="text-red-700 font-bold group-hover:translate-x-1 transition-transform">
                  Watch on Player →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
