'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { ARTICLES } from '@/lib/data/articles';
import { useAuth } from '@/context/AuthContext';

// Consolidated pool of top & trending stories across all platform features
const TRENDING_HERO_STORIES = [
  {
    id: 'hero-rot-001',
    slug: 'gulf-of-guinea-maritime-defense-architecture-2026',
    featureSource: 'Special Investigative Dossier',
    title: 'Naval Coalition Deploys Autonomous Acoustic Sensor Grid to Secure Gulf of Guinea Hydrocarbon Corridors',
    category: 'Maritime Security',
    categorySlug: 'maritime-security',
    location: 'Lagos / Gulf of Guinea',
    country: 'Nigeria / Gulf of Guinea',
    threatLevel: 'Elevated',
    readTime: '6 min read',
    timeAgo: 'Just now',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
    summary: 'Multinational maritime task forces integrate satellite telemetry, coastal sonar arrays, and autonomous surface vessels across 240 nautical miles to counter armed tanker boardings.',
    keyInsight: 'Naval response interdiction times dropped from 114 to 28 minutes within Zone E and F perimeters.',
    author: {
      name: 'Capt. (Ret.) Tariq Adeleke',
      role: 'Senior Naval & Littoral Security Analyst',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'hero-rot-002',
    slug: 'sahel-counter-insurgency-drone-warfare-intelligence',
    featureSource: 'Field Telemetry & Defense',
    title: 'Autonomous Aerial Reconnaissance Shifts Counter-Terrorism Dynamics in the Liptako-Gourma Tri-Border',
    category: 'National Security',
    categorySlug: 'national-security',
    location: 'Northern Nigeria / Sahel',
    country: 'Nigeria / Niger / Chad',
    threatLevel: 'Critical',
    readTime: '5 min read',
    timeAgo: '14 mins ago',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    summary: 'Nigerian and regional ground forces deploy night-vision tactical drones that detect and intercept unauthorized armed vehicle convoys before they reach civilian population centers.',
    keyInsight: 'Decentralized forward tactical cells authorize defensive support in under 6 minutes.',
    author: {
      name: 'Dr. Amina Touré',
      role: 'Director of Sahelian Security & Conflict Studies',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'hero-rot-003',
    slug: 'pan-african-cyber-defense-shield-banking-threats',
    featureSource: 'Cyber Threat Radar',
    title: 'Financial Cyber Shield: African CERTs Neutralize Sophisticated Ransomware Targeting Central Payment Switches',
    category: 'Cybersecurity',
    categorySlug: 'cybersecurity-and-digital-security',
    location: 'Lagos / Pan-African',
    country: 'Kenya / Nigeria / South Africa',
    threatLevel: 'Elevated',
    readTime: '8 min read',
    timeAgo: '29 mins ago',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    summary: 'Coordinated cyber defense operations block advanced persistent threat groups attempting to infiltrate mobile money and interbank settlement systems across commercial switches.',
    keyInsight: 'Safeguarded over $4.2 billion in daily retail transactions and banking networks.',
    author: {
      name: 'Farida Al-Mansoor',
      role: 'Chief Cyber Threat Intelligence Analyst',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'hero-rot-004',
    slug: 'food-security-grain-resilience-agropastoral-corridors',
    featureSource: 'Community Intelligence',
    title: 'Strategic Grain Reserves & Satellite Agro-Forecasting: Building Africa\'s Food Sovereignty Fortress',
    category: 'Food Security',
    categorySlug: 'food-security',
    location: 'Kano / East & Horn of Africa',
    country: 'Nigeria / Ethiopia / Kenya',
    threatLevel: 'Guarded',
    readTime: '5 min read',
    timeAgo: '48 mins ago',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    summary: 'Emergency buffer stocking and drone-guided pest surveillance shield Eastern and Horn of Africa food supplies from global supply disruptions.',
    keyInsight: 'Over 4.5 million metric tonnes of regional grain capacity secured with automated sensors.',
    author: {
      name: 'Tsegaye Gebreselassie',
      role: 'Food & Agricultural Security Analyst',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'hero-rot-005',
    slug: 'critical-minerals-corridor-defense-drc-zambia',
    featureSource: 'Energy & Infrastructure',
    title: 'The Great Copperbelt Shield: Protecting the Lobito Strategic Mineral Rail Corridor',
    category: 'Energy Security',
    categorySlug: 'energy-security',
    location: 'Central & Southern Africa',
    country: 'DRC / Zambia / Angola',
    threatLevel: 'Elevated',
    readTime: '6 min read',
    timeAgo: '1 hr ago',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    summary: 'Cross-border joint security task forces deploy fiber-optic track sensors and rapid air response to secure 1,300 km of critical battery mineral exports.',
    keyInsight: 'Subterranean vibration sensors alert command rooms if track bolts are disturbed.',
    author: {
      name: 'Jerome Mukendi',
      role: 'Critical Resources Security Correspondent',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'hero-rot-006',
    slug: 'election-security-digital-disinformation-countermeasures',
    featureSource: 'Electoral Integrity Unit',
    title: 'Fortifying the Ballot: Early Warning Systems Counter Algorithmic Disinformation in Continental Elections',
    category: 'Election Security',
    categorySlug: 'election-security',
    location: 'West & Southern Africa',
    country: 'Ghana / South Africa / Senegal',
    threatLevel: 'Elevated',
    readTime: '6 min read',
    timeAgo: '2 hrs ago',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    summary: 'Independent election security rooms leverage open-source intelligence and real-time verification across 20 languages to counter malicious deepfakes.',
    keyInsight: 'Pre-election risk mapping identified 85% of potential hotspot precincts for preventative policing.',
    author: {
      name: 'Dr. Kwesi Appiah',
      role: 'Electoral Integrity Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'hero-rot-007',
    slug: 'women-in-security-commanders-leading-peacekeeping',
    featureSource: 'Women in Security Leadership',
    title: 'Women at the Vanguard: How Female Tactical Commanders Are Redefining Peacekeeping in South Sudan',
    category: 'Gender, Women & Security',
    categorySlug: 'gender-women-peace-and-security',
    location: 'East & Central Africa',
    country: 'South Sudan / Kenya / Rwanda',
    threatLevel: 'Guarded',
    readTime: '7 min read',
    timeAgo: '3 hrs ago',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    summary: 'UN and AU peace operations report a 60% drop in community disputes and enhanced field intelligence reporting under female-led battalion commands.',
    keyInsight: 'Civilian early warning reporting rose 78% as local women elders actively collaborate.',
    author: {
      name: 'Brig. Gen. (Ret.) Sarah Mwangi',
      role: 'Senior Advisor on Women, Peace & Security',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    }
  }
];

export default function HeroFeatured() {
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

  // Auto-rotate stories smoothly unless user hovers
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TRENDING_HERO_STORIES.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % TRENDING_HERO_STORIES.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + TRENDING_HERO_STORIES.length) % TRENDING_HERO_STORIES.length);
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

  const activeStory = TRENDING_HERO_STORIES[currentIndex];
  // 4 other trending stories in side queue
  const sideQueue = TRENDING_HERO_STORIES.filter((_, idx) => idx !== currentIndex).slice(0, 4);

  return (
    <section 
      className="relative pt-3 sm:pt-5 pb-4 sm:pb-6 px-3 sm:px-4 max-w-7xl mx-auto bg-white dark:bg-slate-950 transition-colors"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 2-Column Hero Grid: Current Hero Lead Page (Left 7 Cols) + Trending in All Features (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* Left: The Current Hero Page / Lead Investigative Dossier */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
            
            {/* Lead Image & Overlay */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={activeStory.image}
                alt={activeStory.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"></div>

              {/* Badges Over Image */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-amber-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-200" />
                  <span>Lead Investigative Dossier</span>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-sm">
                  {activeStory.category}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-950/80 border border-slate-800">
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

              {/* Meta Overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between text-xs sm:text-sm text-white">
                <div className="flex items-center gap-2 sm:gap-4 truncate">
                  <span className="flex items-center gap-1.5 font-semibold truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{activeStory.location}</span>
                  </span>
                  <span className="text-slate-400 shrink-0">•</span>
                  <span className="flex items-center gap-1.5 text-slate-300 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span>{activeStory.readTime}</span>
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-amber-900/90 text-amber-200 border border-amber-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0 ml-2">
                  {activeStory.threatLevel}
                </span>
              </div>
            </div>

            {/* Lead Story Body */}
            <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 transition-colors">
              <div className="space-y-3">
                <Link href={`/article/${activeStory.slug}`} className="group/title block">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white group-hover/title:text-amber-700 dark:group-hover/title:text-amber-400 transition-colors font-serif leading-snug sm:leading-tight">
                    {activeStory.title}
                  </h1>
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeStory.summary}
                </p>

                {/* Key Insight Box */}
                {activeStory.keyInsight && (
                  <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] sm:text-xs text-amber-950 dark:text-amber-300 font-medium">
                      <strong className="font-bold">Key Insight:</strong> {activeStory.keyInsight}
                    </p>
                  </div>
                )}
              </div>

              {/* Author & Read Dossier CTA */}
              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-amber-600/50 shrink-0">
                    <Image
                      src={activeStory.author.avatar}
                      alt={activeStory.author.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {activeStory.author.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                      {activeStory.author.role}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/article/${activeStory.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 shrink-0"
                >
                  <span>Read Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Right: Trending in All Features Section (By the side of the current hero page) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              </span>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white font-serif">
                Trending in All Features
              </h2>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevStory}
                className="p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                aria-label="Previous Trending Story"
                title="Previous Story"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1">
                {currentIndex + 1}/{TRENDING_HERO_STORIES.length}
              </span>

              <button
                onClick={nextStory}
                className="p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                aria-label="Next Trending Story"
                title="Next Story"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 gap-2 sm:gap-2.5 flex-1">
            {sideQueue.map((story) => {
              return (
                <Link
                  key={story.id}
                  href={`/article/${story.slug}`}
                  className="group p-2 sm:p-2.5 lg:p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 transition-all flex gap-2.5 sm:gap-3 shadow-xs hover:shadow-md cursor-pointer"
                >
                  {/* Photo Thumbnail */}
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

                      <h3 className="text-[11.5px] sm:text-xs lg:text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {story.title}
                      </h3>

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

          {/* Indicators */}
          <div className="flex items-center justify-between pt-1 px-1 text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400">
            <span className="font-mono">Auto-rotates • Click story to read</span>
            <div className="flex items-center gap-1.5">
              {TRENDING_HERO_STORIES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-5 bg-amber-600' 
                      : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-amber-400'
                  }`}
                  aria-label={`Go to story ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
