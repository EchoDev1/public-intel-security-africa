'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  Flame, 
  ShieldCheck, 
  Radio, 
  Play, 
  Pause 
import { ARTICLES } from '@/lib/data/articles';
import { useAuth } from '@/context/AuthContext';

// Consolidated pool of top & trending stories from all features across the platform
// Each with verified authentic photojournalistic news imagery
const ROTATIONAL_TOP_STORIES = [
  {
    id: 'top-rot-001',
    slug: 'sahel-counter-insurgency-drone-warfare-intelligence',
    featureSource: 'Field Telemetry & Defense',
    title: 'Autonomous Drone Surveillance Secures Northern Border Corridors',
    category: 'National Security',
    categorySlug: 'national-security',
    location: 'Northern Nigeria / Sahel',
    threatLevel: 'Critical',
    readTime: '5 min read',
    timeAgo: 'Just now',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    summary: 'Nigerian and regional ground forces now deploy night-vision tactical drones that detect and intercept unauthorized armed movements before they reach rural farming villages.',
    keyInsight: 'Direct satellite-linked alerts sent to frontline command outposts in under 4 minutes.'
  },
  {
    id: 'top-rot-002',
    slug: 'gulf-of-guinea-maritime-defense-architecture-2026',
    featureSource: 'Special Investigative Report',
    title: 'Naval Coalition Deploys Acoustic Sensor Grid in the Gulf of Guinea',
    category: 'Maritime Security',
    categorySlug: 'maritime-security',
    location: 'Lagos / Niger Delta Coast',
    threatLevel: 'Elevated',
    readTime: '6 min read',
    timeAgo: '14 mins ago',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    summary: 'Advanced naval patrol boats and underwater acoustic arrays secure critical offshore hydrocarbon assets, dropping average emergency response times to 28 minutes.',
    keyInsight: 'Continuous satellite and acoustic sensor coverage across 240 nautical miles of high-risk shipping corridors.'
  },
  {
    id: 'top-rot-003',
    slug: 'pan-african-cyber-defense-shield-banking-threats',
    featureSource: 'Cyber Threat Radar',
    title: 'Lagos & Regional Cyber Hubs Neutralize Continental Banking Ransomware',
    category: 'Cybersecurity',
    categorySlug: 'cybersecurity-and-digital-security',
    location: 'Lagos / Pan-African',
    threatLevel: 'Elevated',
    readTime: '8 min read',
    timeAgo: '29 mins ago',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    summary: 'African cyber incident response teams successfully blocked coordinated malware targeting mobile money and interbank payment systems across commercial switches.',
    keyInsight: 'Protected over $4.2 billion in daily retail transactions and banking networks.'
  },
  {
    id: 'top-rot-004',
    slug: 'food-security-grain-resilience-agropastoral-corridors',
    featureSource: 'Community Intelligence',
    title: 'Strategic Grain Corridors & Satellite Crop Monitoring Protect Food Supply',
    category: 'Food Security',
    categorySlug: 'food-security',
    location: 'Kano / Northern Nigeria',
    threatLevel: 'Guarded',
    readTime: '5 min read',
    timeAgo: '48 mins ago',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    summary: 'New joint security teams now accompany farmers and interstate food trucks along key agricultural highways to guarantee uninterrupted food supply across national markets.',
    keyInsight: 'Automated solar-powered irrigation and grain storage depots expanded to stabilize consumer prices.'
  },
  {
    id: 'top-rot-005',
    slug: 'critical-minerals-corridor-defense-drc-zambia',
    featureSource: 'Energy & Infrastructure',
    title: 'Joint Task Forces Guard Trans-African Critical Mineral Rail Corridors',
    category: 'Energy Security',
    categorySlug: 'energy-security',
    location: 'Central & Southern Africa',
    threatLevel: 'Elevated',
    readTime: '6 min read',
    timeAgo: '1 hr ago',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Subterranean vibration sensors and rapid air response units safeguard high-voltage infrastructure and freight rails moving lithium, copper, and cobalt to deepwater ports.',
    keyInsight: 'Underground fiber optic sensors alert security units instantaneously if railway track bolts or ballast are disturbed.'
  },
  {
    id: 'top-rot-006',
    slug: 'election-security-digital-disinformation-countermeasures',
    featureSource: 'Electoral Integrity Unit',
    title: 'Early Warning Systems Neutralize Synthetic Disinformation in Continental Elections',
    category: 'Election Security',
    categorySlug: 'election-security',
    location: 'West Africa / Pan-African',
    threatLevel: 'Guarded',
    readTime: '6 min read',
    timeAgo: '2 hrs ago',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    summary: 'Integrated election security rooms monitor 20 regional languages in real time, detecting and debunking malicious deepfakes and fake communiqués before polling days.',
    keyInsight: 'Biometric voter verification units achieved 99.8% uptime with solar battery backup packs.'
  },
  {
    id: 'top-rot-007',
    slug: 'women-in-security-commanders-leading-peacekeeping',
    featureSource: 'Women in Security Leadership',
    title: 'Female Tactical Commanders Redefine Community Engagement & Peacekeeping',
    category: 'Gender, Women & Security',
    categorySlug: 'gender-women-peace-and-security',
    location: 'East & Central Africa',
    threatLevel: 'Guarded',
    readTime: '7 min read',
    timeAgo: '3 hrs ago',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    summary: 'United Nations and African Union peace missions report a 60% drop in community disputes and enhanced field intelligence reporting under female-led battalion commands.',
    keyInsight: 'Civilian engagement rose 78% as local women elders and traders actively share early warnings.'
  }
];

export default function TopIntelStory() {
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [savedIds, setSavedIds] = useState([]);

  // Sync saved bookmarks with per-user localStorage
  useEffect(() => {
    if (!user?.email) {
      setSavedIds([]);
      return;
    }
    const updateSaved = () => {
      try {
        const userKey = `pi_saved_articles_${user.email.toLowerCase()}`;
        const stored = localStorage.getItem(userKey);
        if (stored) {
          const list = JSON.parse(stored);
          setSavedIds(list.map((item) => item.id || item.slug));
        } else {
          setSavedIds([]);
        }
      } catch (_) {
        setSavedIds([]);
      }
    };

    updateSaved();
    window.addEventListener('pi_saved_articles_updated', updateSaved);
    return () => window.removeEventListener('pi_saved_articles_updated', updateSaved);
  }, [user?.email]);

  // Auto-rotate: the newest top stories rotate in, older ones cycle back
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROTATIONAL_TOP_STORIES.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % ROTATIONAL_TOP_STORIES.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + ROTATIONAL_TOP_STORIES.length) % ROTATIONAL_TOP_STORIES.length);
  };

  const toggleSave = (story, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn || !user?.email) {
      openAuthModal('signin');
      return;
    }

    const userKey = `pi_saved_articles_${user.email.toLowerCase()}`;
    try {
      const stored = localStorage.getItem(userKey);
      let currentList = stored ? JSON.parse(stored) : [];
      const storyId = story.id || story.slug;
      const alreadySaved = currentList.some((item) => (item.id === storyId || item.slug === story.slug));

      let updatedList;
      if (alreadySaved) {
        updatedList = currentList.filter((item) => item.id !== storyId && item.slug !== story.slug);
      } else {
        const articleToSave = {
          id: story.id || story.slug,
          slug: story.slug,
          title: story.title,
          categoryName: story.category || story.categorySlug,
          region: story.country || story.location || 'Continental Africa',
          excerpt: story.summary || '',
          coverImage: story.image,
          readTime: story.readTime || '5 min read',
          threatLevel: story.threatLevel || 'Elevated',
          savedAt: new Date().toISOString()
        };
        updatedList = [articleToSave, ...currentList];
      }

      localStorage.setItem(userKey, JSON.stringify(updatedList));
      setSavedIds(updatedList.map((item) => item.id || item.slug));
      window.dispatchEvent(new Event('pi_saved_articles_updated'));
    } catch (_) {}
  };

  const activeStory = ROTATIONAL_TOP_STORIES[currentIndex];

  // The side queue: displays 4 other trending stories in rotation order
  const sideQueue = ROTATIONAL_TOP_STORIES.filter((_, idx) => idx !== currentIndex).slice(0, 4);

  return (
    <section 
      className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Title strictly: "Top Intel Story" with the icon before the words */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-serif">
            Top Intel Story
          </h2>
        </div>

        {/* Rotation Controls & Rotational Feed Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10.5px] font-mono font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            title={isAutoPlaying ? "Pause auto-rotation" : "Resume auto-rotation"}
          >
            <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{isAutoPlaying ? 'LIVE ROTATION' : 'PAUSED'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={prevStory}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              aria-label="Previous Top Story"
              title="Previous Story"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 px-1">
              {currentIndex + 1}/{ROTATIONAL_TOP_STORIES.length}
            </span>

            <button
              onClick={nextStory}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              aria-label="Next Top Story"
              title="Next Story"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Rotational Layout: Lead Story (7 cols) + Side Rotational Queue (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mt-5 sm:mt-6">
        
        {/* Primary Rotational Lead Story (7 Columns on desktop) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col h-full">
            
            {/* Real News Photo from Unsplash */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-900">
              <Image
                src={activeStory.image}
                alt={activeStory.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

              {/* Badges on Real News Photo */}
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-200" />
                  <span>Trending</span>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-slate-700">
                  {activeStory.category}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-950/70 border border-slate-800">
                  {activeStory.featureSource}
                </span>
              </div>

              {/* Bookmark Save Button */}
              <button
                onClick={(e) => toggleSave(activeStory, e)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-amber-600 text-white backdrop-blur-md border border-slate-700 transition-colors shadow-sm"
                title={savedIds.includes(activeStory.id) || savedIds.includes(activeStory.slug) ? "Saved to Reading List" : "Save Story"}
                aria-label="Save story"
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedIds.includes(activeStory.id) || savedIds.includes(activeStory.slug) ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>

              {/* Location & Time Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1 font-semibold truncate max-w-[200px] sm:max-w-none">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{activeStory.location}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-300 shrink-0">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{activeStory.timeAgo}</span>
                </span>
              </div>
            </div>

            {/* Story Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 transition-colors">
              <div className="space-y-2.5">
                <Link href={`/article/${activeStory.slug}`} className="block group/title">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover/title:text-amber-700 dark:group-hover/title:text-amber-400 transition-colors font-serif leading-snug">
                    {activeStory.title}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeStory.summary}
                </p>

                {/* Key Insight Box */}
                <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] sm:text-xs text-amber-950 dark:text-amber-300 font-medium">
                    <strong className="font-bold">Key Insight:</strong> {activeStory.keyInsight}
                  </p>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>{activeStory.readTime}</span>
                  <span>•</span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">{activeStory.threatLevel}</span>
                </div>

                <Link
                  href={`/article/${activeStory.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Side Rotational Queue (5 Columns on desktop) - Rotates as stories update */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-1 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <span>Trending in All Features</span>
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold">
              CLICK TO VIEW
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:gap-2.5 flex-1">
            {sideQueue.map((story) => {
              return (
                <Link
                  key={story.id}
                  href={`/article/${story.slug}`}
                  className="group p-2 sm:p-2.5 lg:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 transition-all flex gap-2.5 sm:gap-3 shadow-xs hover:shadow-md cursor-pointer"
                >
                  {/* Real News Photo Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                    />
                    <span className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider bg-slate-900/90 text-amber-300">
                      {story.threatLevel}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                        <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider truncate">
                          {story.category}
                        </span>
                        <span className="shrink-0 font-mono text-[9px] sm:text-[10px]">{story.timeAgo}</span>
                      </div>

                      <h4 className="text-[11.5px] sm:text-xs lg:text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {story.title}
                      </h4>

                      <p className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 hidden xs:block">
                        {story.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-100 dark:border-slate-800/80 text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[110px] sm:max-w-[130px]">
                        <MapPin className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                        <span className="truncate">{story.location}</span>
                      </span>

                      <span className="text-amber-700 dark:text-amber-400 group-hover:text-amber-800 dark:group-hover:text-amber-300 font-bold flex items-center gap-0.5 shrink-0">
                        <span>Read</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Indicator Dots of All Stories in Rotation */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {ROTATIONAL_TOP_STORIES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'w-6 bg-amber-600' 
                    : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-amber-400'
                }`}
                aria-label={`Go to story ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
