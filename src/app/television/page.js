'use client';

import React, { useState, useEffect } from 'react';
import { Tv, Play } from 'lucide-react';
import { TELEVISION_SHOWS } from '@/lib/data/multimedia';

export default function TelevisionPage() {
  const [shows, setShows] = useState(TELEVISION_SHOWS);
  const [selectedVideo, setSelectedVideo] = useState(TELEVISION_SHOWS[0]);

  useEffect(() => {
    let isMounted = true;
    async function loadTv() {
      try {
        const res = await fetch(`/api/broadcast-media?t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.tvChannels) && data.tvChannels.length > 0) {
          setShows(data.tvChannels);
          setSelectedVideo(prev => data.tvChannels.find(x => x.id === prev?.id) || data.tvChannels[0]);
        }
      } catch (_) {}
    }
    loadTv();
    return () => { isMounted = false; };
  }, []);

  const activeVideo = selectedVideo || shows[0] || {};

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
          <div className="w-full h-full bg-radial-[at_top_left] from-slate-900 via-slate-950 to-black p-6 sm:p-10 flex flex-col justify-between select-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab3080c_1px,transparent_1px),linear-gradient(to_bottom,#eab3080c_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded bg-red-600 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                PI-TV LIVE BROADCAST
              </span>
              <span className="text-xs font-mono text-amber-400">OFFICIAL MEDIA CHANNEL</span>
            </div>

            <div className="relative z-10 text-center py-6 sm:py-10 my-auto">
              <div className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-2">
                Public Intel Television Broadcast
              </div>
              <div className="text-xl sm:text-2xl md:text-4xl font-black tracking-wider uppercase font-mono text-white drop-shadow-xl px-2">
                PUBLIC INTEL TELEVISION BROADCAST INCOMING
              </div>
              <p className="text-slate-400 text-xs sm:text-sm font-mono mt-2">
                TRANSMISSION RADAR // STANDBY FOR SATELLITE DISPATCH
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
              <span>STUDIO SEC-01</span>
              <span className="text-amber-400 font-bold">LIVE TELEVISION BROADCAST</span>
            </div>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => alert(`Starting video broadcast: ${activeVideo.title}`)}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 pl-1 border-4 border-white"
            >
              <Play className="w-10 h-10 fill-white" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">
                {activeVideo.category || activeVideo.platform || 'Special Broadcast'}
              </span>
              <h1 className="text-xl md:text-3xl font-black text-white font-serif leading-tight">
                {activeVideo.title}
              </h1>
            </div>

            <div className="text-right text-xs font-mono text-slate-200">
              <span className="text-amber-300 block font-bold">{activeVideo.broadcastTime || activeVideo.scheduledTime}</span>
              <span>{activeVideo.views || activeVideo.duration}</span>
            </div>
          </div>
        </div>

        {/* Video Overview Description */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
            Broadcast Intelligence Overview
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
            {activeVideo.description}
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
            {shows.length} Bulletins On Demand
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shows.map((tv) => (
            <div
              key={tv.id}
              onClick={() => {
                setSelectedVideo(tv);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-red-600 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-radial-[at_top_left] from-slate-900 to-black p-3 mb-3 flex flex-col justify-between border border-slate-800 select-none">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold uppercase text-[9px]">
                      {tv.category || tv.platform || 'Broadcast'}
                    </span>
                    <span className="text-slate-400">{tv.duration}</span>
                  </div>
                  <div className="text-center my-auto py-1">
                    <div className="text-amber-500/80 font-mono text-[9px] uppercase tracking-widest mb-0.5">
                      Public Intel Broadcast
                    </div>
                    <div className="text-[11px] font-black tracking-wider uppercase font-mono text-white line-clamp-1">
                      {tv.title}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono border-t border-slate-900 pt-1">
                    <span>STUDIO TRANSMISSION</span>
                    <span className="text-red-400 font-bold">PI-TV DISPATCH</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>{tv.broadcastTime || tv.scheduledTime}</span>
                    <span className="text-amber-800 font-bold">{tv.views || tv.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-serif leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                    {tv.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {tv.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-700">
                <span>Watch Stream</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
