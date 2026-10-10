'use client';

import React from 'react';
import Image from 'next/image';
import { Headphones, Play } from 'lucide-react';
import { PODCAST_EPISODES } from '@/lib/data/multimedia';
import { useRadio } from '@/context/RadioContext';

export default function PodcastsPage() {
  const { togglePlay, currentTrack, isPlaying } = useRadio();

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest">
          <Headphones className="w-3.5 h-3.5 text-amber-700" />
          <span>Strategic Audio Dispatches</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          Public Intel Security Africa Podcast Network
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          Deep-dive investigative audio shows featuring unvarnished discussions with frontline defense correspondents, cybersecurity incident commanders, intelligence officers, and peacebuilders.
        </p>
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PODCAST_EPISODES.map((ep) => {
          const isThisPlaying = isPlaying && currentTrack.title === ep.title;

          return (
            <div
              key={ep.id}
              className="rounded-3xl bg-white border border-slate-200 hover:border-amber-600 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={ep.coverImage}
                      alt={ep.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {ep.showName} • {ep.episodeNumber}
                    </span>
                    <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug font-serif">
                      {ep.title}
                    </h2>
                    <span className="text-xs text-slate-500 font-mono mt-1 block font-medium">
                      {ep.publishDate} • {ep.duration}
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {ep.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div>Host: <strong className="text-slate-900">{ep.host}</strong></div>
                  <div>Special Guest: <strong className="text-amber-900">{ep.guest}</strong></div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => togglePlay({
                    title: ep.title,
                    subtitle: ep.showName,
                    host: ep.host,
                    url: ep.audioUrl,
                    fallbackUrl: ep.audioUrl,
                    isLiveStream: false,
                  })}
                  className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 shadow-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isThisPlaying ? 'Pause Episode' : 'Listen Now'}</span>
                </button>

                <span className="text-xs text-slate-500 font-mono font-medium">
                  {ep.downloads} Total Listens
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
