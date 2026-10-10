'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Radio as RadioIcon, 
  Tv, 
  Headphones, 
  Calendar, 
  Play, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Download
} from 'lucide-react';
import { RADIO_STREAM, PODCAST_EPISODES, TELEVISION_SHOWS, WEBINARS } from '@/lib/data/multimedia';
import { useRadio } from '@/context/RadioContext';

export default function MultimediaSection() {
  const [activeTab, setActiveTab] = useState('television');
  const { isPlaying, togglePlay, playLiveRadio } = useRadio();

  return (
    <section className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-400">
                Multi-Platform Broadcast Network
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-serif mt-1">
              Public Intel Studio & Multimedia Hub
            </h2>
          </div>

          {/* Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              onClick={() => setActiveTab('television')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'television'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>PI Television</span>
            </button>

            <button
              onClick={() => setActiveTab('radio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'radio'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RadioIcon className="w-3.5 h-3.5" />
              <span>Live Radio</span>
            </button>

            <button
              onClick={() => setActiveTab('podcasts')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'podcasts'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Podcasts</span>
            </button>

            <button
              onClick={() => setActiveTab('webinars')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'webinars'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Webinars</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Television */}
        {activeTab === 'television' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            <div className="lg:col-span-8 bg-white dark:bg-slate-850 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md">
              <div className="relative aspect-video w-full bg-slate-900 group">
                <Image
                  src={TELEVISION_SHOWS[0].thumbnail}
                  alt={TELEVISION_SHOWS[0].title}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-red-600 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-md animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    PI-TV LIVE
                  </span>
                  <span className="px-3 py-1 rounded bg-black/70 backdrop-blur-md text-white font-semibold text-xs border border-white/10">
                    HD 1080p Broadcast
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => alert('Starting Public Intel Television feed...')}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 pl-1 border-2 border-white"
                  >
                    <Play className="w-8 h-8 fill-white" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold">{TELEVISION_SHOWS[0].category}</span>
                  <span className="font-mono">{TELEVISION_SHOWS[0].views}</span>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-3 bg-white dark:bg-slate-800/90">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-serif">
                  {TELEVISION_SHOWS[0].title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {TELEVISION_SHOWS[0].description}
                </p>
                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 text-xs">
                  <span className="text-amber-800 dark:text-amber-400 font-bold">{TELEVISION_SHOWS[0].broadcastTime}</span>
                  <Link href="/television" className="text-slate-800 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 font-bold flex items-center gap-1">
                    <span>View All TV Bulletins</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 pb-1">
                Recent Broadcast Investigations
              </h4>

              {TELEVISION_SHOWS.slice(1).map((tv) => (
                <div
                  key={tv.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-red-600 dark:hover:border-red-500 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mb-3">
                    <Image
                      src={tv.thumbnail}
                      alt={tv.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                      {tv.duration}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400 tracking-wider">
                      {tv.category}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 mt-1 font-serif">
                      {tv.title}
                    </h5>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{tv.views}</span>
                    <Link href="/television" className="text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold">
                      Watch Episode →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Radio */}
        {activeTab === 'radio' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
            <div className="lg:col-span-7 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
                    <RadioIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 block">
                      LIVE CONTINENTAL AUDIO STREAM
                    </span>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white font-serif">
                      {RADIO_STREAM.stationName}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => playLiveRadio()}
                  className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-transform hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isPlaying ? 'Audio Playing' : 'Start Live Stream'}</span>
                </button>
              </div>

              <div className="py-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Current Program On-Air:</span>
                    <h4 className="text-base font-bold text-amber-900 dark:text-amber-400 mt-0.5">
                      {RADIO_STREAM.currentShow}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Hosts: {RADIO_STREAM.currentHost}
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold block">{RADIO_STREAM.listenersCount.toLocaleString()}</span>
                    <span>Active Listeners</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
                  <span>Frequency: {RADIO_STREAM.frequency}</span>
                  <span className="text-amber-800 dark:text-amber-400 font-mono font-bold">{RADIO_STREAM.bitrate}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <Link href="/radio" className="text-xs text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold flex items-center gap-1.5">
                  <span>View Full 24-Hour Broadcast Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-xs">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                Today&apos;s Strategic Broadcast Lineup
              </h4>
              <div className="space-y-3">
                {RADIO_STREAM.schedule.slice(0, 4).map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-800 dark:text-amber-400 font-bold mb-1">
                      <span>{item.time}</span>
                      <span className="text-slate-400 dark:text-slate-500 font-normal">PROGRAM</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h5>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Host: {item.host}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Podcasts */}
        {activeTab === 'podcasts' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {PODCAST_EPISODES.map((ep) => (
              <div
                key={ep.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-600 dark:hover:border-amber-500 transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-4">
                    <Image
                      src={ep.coverImage}
                      alt={ep.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400 border border-slate-200 dark:border-slate-700">
                      {ep.episodeNumber}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                      {ep.duration}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {ep.showName}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-2 mt-1 leading-snug font-serif">
                    {ep.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2">
                    {ep.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => togglePlay({
                      title: ep.title,
                      subtitle: ep.showName,
                      host: ep.host,
                      url: ep.audioUrl,
                      fallbackUrl: ep.audioUrl,
                      isLiveStream: false
                    })}
                    className="p-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold transition-transform hover:scale-110 shadow-xs"
                    title="Play Episode"
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </button>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {ep.downloads} listens
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Webinars */}
        {activeTab === 'webinars' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {WEBINARS.map((web) => (
              <div
                key={web.id}
                className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-600 dark:hover:border-amber-500 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                    <span className="px-3 py-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                      {web.status}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono font-medium">{web.date} • {web.time}</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-serif leading-snug">
                    {web.title}
                  </h3>

                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Key Topics Covered:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {web.keyTopics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 text-xs text-slate-600 dark:text-slate-400">
                    <span>Keynote Lead: </span>
                    <span className="text-slate-900 dark:text-white font-bold">{web.leadSpeaker}</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-amber-800 dark:text-amber-400 font-bold">{web.fee}</span>
                  <Link
                    href="/webinars"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xs"
                  >
                    <span>Reserve Seat / Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
