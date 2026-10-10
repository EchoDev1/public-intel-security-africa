'use client';

import React from 'react';
import Link from 'next/link';
import { useRadio } from '@/context/RadioContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Radio as RadioIcon, 
  X, 
  Activity,
  Headphones,
  SignalHigh
} from 'lucide-react';

export default function RadioPlayerBar() {
  const {
    isPlaying,
    isLoading,
    currentTrack,
    volume,
    isMuted,
    isPlayerVisible,
    setIsPlayerVisible,
    togglePlay,
    handleVolumeChange,
    toggleMute,
  } = useRadio();

  if (!isPlayerVisible) {
    return (
      <button
        onClick={() => setIsPlayerVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs uppercase tracking-wider transition-all hover:scale-105"
      >
        <RadioIcon className="w-4 h-4 animate-spin" />
        <span>Open PI Radio</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1.5 sm:py-2.5 px-3 sm:px-6 md:px-8 text-slate-900 dark:text-white transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left: Station Info */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-xs">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500"></span>
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1 shrink-0">
                <SignalHigh className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600 animate-pulse" />
                {currentTrack.isLiveStream ? 'LIVE ON AIR' : 'ON-DEMAND'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">• 320 KBPS HD</span>
            </div>
            <p className="text-xs sm:text-sm font-bold truncate text-slate-900 dark:text-white leading-tight mt-0.5">
              {currentTrack.title || 'The 0600 Hours Continental Intelligence Briefing'}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 truncate block mt-0.5">
              Host: {currentTrack.host ? (currentTrack.host.startsWith('Host:') ? currentTrack.host.replace(/^Host:\s*/, '') : currentTrack.host) : 'Brigadier General (Ret.) Sarah Mwangi & Dr. Amina Touré'}
            </p>
          </div>
        </div>

        {/* Center & Right: Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1 h-6 px-3 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
            <div className={`w-1 bg-amber-600 rounded-full ${isPlaying ? 'wave-bar-1' : 'h-1'}`}></div>
            <div className={`w-1 bg-amber-500 rounded-full ${isPlaying ? 'wave-bar-2' : 'h-1'}`}></div>
            <div className={`w-1 bg-amber-600 rounded-full ${isPlaying ? 'wave-bar-3' : 'h-1'}`}></div>
            <div className={`w-1 bg-amber-500 rounded-full ${isPlaying ? 'wave-bar-4' : 'h-1'}`}></div>
            <div className={`w-1 bg-amber-600 rounded-full ${isPlaying ? 'wave-bar-5' : 'h-1'}`}></div>
          </div>

          <button
            onClick={() => togglePlay()}
            disabled={isLoading}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
            title={isPlaying ? 'Pause Audio' : 'Play Live Broadcast'}
          >
            {isLoading ? (
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
            )}
          </button>

          <Link
            href="/radio"
            className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-200 hover:text-amber-800 dark:hover:text-amber-400 font-semibold inline-flex items-center gap-1 sm:gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 shrink-0"
          >
            <RadioIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Radio Studio</span>
          </Link>

          {/* Volume on desktop */}
          <div className="hidden md:flex items-center gap-2 pl-1">
            <button onClick={toggleMute} className="text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 lg:w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          <button
            onClick={() => setIsPlayerVisible(false)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            title="Minimize"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
