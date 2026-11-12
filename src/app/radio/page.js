'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Radio as RadioIcon, 
  Play, 
  Clock, 
  Headphones, 
  Mic2,
  ExternalLink
} from 'lucide-react';
import { RADIO_STREAM, PODCAST_EPISODES } from '@/lib/data/multimedia';
import { useRadio } from '@/context/RadioContext';

export default function RadioStationPage() {
  const { isPlaying, playLiveRadio, togglePlay } = useRadio();
  const [radioChannels, setRadioChannels] = useState([]);
  const [podcasts, setPodcasts] = useState(PODCAST_EPISODES);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/broadcast-media');
      const data = await res.json();
      if (data?.success) {
        if (Array.isArray(data.radioChannels) && data.radioChannels.length > 0) {
          setRadioChannels(data.radioChannels);
        }
        if (Array.isArray(data.podcastShows) && data.podcastShows.length > 0) {
          setPodcasts(data.podcastShows);
        }
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchMedia();
    const handleUpdate = () => fetchMedia();
    window.addEventListener('pisa_broadcast_media_updated', handleUpdate);
    return () => window.removeEventListener('pisa_broadcast_media_updated', handleUpdate);
  }, []);

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Radio Live Studio Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 p-8 md:p-14 shadow-sm">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-red-600 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                ON AIR NOW
              </span>
              <span className="text-xs text-amber-800 font-mono font-bold">
                {radioChannels[0]?.frequency || RADIO_STREAM.frequency}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
              {radioChannels[0]?.title || RADIO_STREAM.stationName}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed font-medium">
              {radioChannels[0]?.schedule || RADIO_STREAM.tagline}
            </p>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 max-w-xl shadow-xs">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                Current Program On Air:
              </span>
              <h3 className="text-lg font-bold text-amber-900">
                {radioChannels[0]?.title || RADIO_STREAM.currentShow}
              </h3>
              <p className="text-xs text-slate-600">
                Hosted by: <strong>{radioChannels[0]?.host || RADIO_STREAM.currentHost}</strong>
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (radioChannels[0]?.audioUrl) {
                    togglePlay({
                      title: radioChannels[0].title,
                      subtitle: radioChannels[0].frequency,
                      host: radioChannels[0].host,
                      url: radioChannels[0].audioUrl,
                      isLiveStream: true
                    });
                  } else {
                    playLiveRadio();
                  }
                }}
                className="px-8 py-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm uppercase tracking-wider flex items-center gap-3 shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{isPlaying ? 'Streaming Audio Active' : 'Start Live Broadcast'}</span>
              </button>

              <span className="text-xs text-slate-500 font-mono font-semibold">
                {RADIO_STREAM.bitrate} • Worldwide Relay
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-56 h-56 rounded-3xl bg-white border border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-md">
              <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <Mic2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="font-mono text-xs text-slate-600">
                <span className="text-emerald-700 font-bold text-base block">
                  {RADIO_STREAM.listenersCount.toLocaleString()}
                </span>
                <span>Active Global Listeners</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Regional Channels & Satellite Frequencies */}
      {radioChannels.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
              <RadioIcon className="w-5 h-5 text-amber-700" />
              <span>Continental Radio Frequencies & Audio Relays ({radioChannels.length})</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono font-medium">Digital Shortwave & IP Streams</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {radioChannels.map((ch) => (
              <div
                key={ch.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-600 transition-all space-y-3 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-amber-800">{ch.frequency}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">{ch.status || 'Active'}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">{ch.title}</h3>
                  <p className="text-xs text-slate-500">Host: <strong>{ch.host}</strong> • {ch.schedule}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => togglePlay({
                      title: ch.title,
                      subtitle: ch.frequency,
                      host: ch.host,
                      url: ch.audioUrl || RADIO_STREAM.streamUrl,
                      isLiveStream: true
                    })}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Tune In Live</span>
                  </button>
                  {ch.joinLink && ch.joinLink !== '/radio' && (
                    <Link href={ch.joinLink} target="_blank" className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 24-Hour Broadcast Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            <span>24-Hour Program Schedule</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono font-medium">All Times UTC</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RADIO_STREAM.schedule.map((slot, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-600 transition-all space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-mono text-amber-800 font-bold">
                <span>{slot.time}</span>
                <span className="text-slate-400 text-[10px] uppercase font-normal">PROGRAM #{i + 1}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif">{slot.title}</h3>
              <p className="text-xs text-slate-500">{slot.host}</p>
            </div>
          ))}
        </div>
      </section>

      {/* On-Demand Recaps */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-700" />
            <span>On-Demand Radio Archives & Podcasts</span>
          </h2>
          <Link href="/podcasts" className="text-xs text-amber-800 hover:text-amber-900 font-bold uppercase tracking-wider">
            View All Shows →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {podcasts.slice(0, 4).map((pod) => (
            <div
              key={pod.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  {pod.showName || 'Strategic Podcast'} • {pod.episodeNumber || pod.publishDate}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-serif mt-1">{pod.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{pod.description || pod.summary}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
                <span>Duration: {pod.duration}</span>
                <span>Guest: {pod.guest}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
