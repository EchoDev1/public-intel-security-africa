'use client';

import React from 'react';
import { Volume2, Play, Pause } from 'lucide-react';
import { useRadio } from '@/context/RadioContext';

export default function AudioArticlePlayer({ title, readTime }) {
  const { togglePlay, isPlaying, currentTrack } = useRadio();
  const isThisPlaying = isPlaying && currentTrack.title === title;

  const handleAudioBrief = () => {
    togglePlay({
      title: title,
      subtitle: 'Executive Audio Narration',
      host: 'Public Intel Automated Briefing Voice',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      isLiveStream: false,
    });
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-amber-100 text-amber-900 font-bold">
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-800 block">
            AUDIO INTELLIGENCE BRIEFING
          </span>
          <h4 className="text-xs md:text-sm font-bold text-slate-900 font-serif">
            Listen to the Executive Audio Briefing ({readTime})
          </h4>
        </div>
      </div>

      <button
        onClick={handleAudioBrief}
        className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-sm"
      >
        {isThisPlaying ? (
          <>
            <Pause className="w-4 h-4 fill-white" />
            <span>Pause Briefing</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-white ml-0.5" />
            <span>Play Audio Brief</span>
          </>
        )}
      </button>
    </div>
  );
}
