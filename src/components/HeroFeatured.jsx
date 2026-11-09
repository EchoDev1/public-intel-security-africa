'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getSectionIncomingTitle, getSectionIncomingCompact } from '@/lib/utils/sectionBanners';

// Default pool of seed stories across platform features (phased out as real articles are posted)
const SEED_HERO_STORIES = [
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
    },
    isRealUpload: false
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
    },
    isRealUpload: false
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
    },
    isRealUpload: false
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
    },
    isRealUpload: false
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
    },
    isRealUpload: false
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
    },
    isRealUpload: false
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
    },
    isRealUpload: false
  }
];

function formatTimeAgo(isoString) {
  if (!isoString) return 'Recent';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch (_) {
    return 'Recent';
  }
}

function mapArticleToStory(art, index) {
  const isReal = Boolean(
    art.isRealUpload || 
    (art.id && !art.id.startsWith('hero-rot-') && !art.id.startsWith('art-00'))
  );

  return {
    id: art.id || `story-${art.slug || index}`,
    slug: art.slug,
    featureSource: art.featureSource || (art.isSpecialReport ? 'Special Investigative Dossier' : (art.isBreaking ? 'Breaking Intelligence Alert' : (art.categoryName || 'Strategic Intelligence Dossier'))),
    title: art.title,
    category: art.categoryName || art.category || 'National Security',
    categorySlug: art.categorySlug || 'national-security',
    location: art.location || (art.country && art.region ? `${art.country} / ${art.region}` : (art.country || art.region || 'Continental Africa')),
    country: art.country || 'Continental Africa',
    threatLevel: art.threatLevel || 'Elevated',
    readTime: art.readTime || '5 min read',
    timeAgo: art.timeAgo || formatTimeAgo(art.publishedAt),
    image: art.coverImage || art.image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    summary: art.excerpt || art.summary || '',
    keyInsight: art.keyInsight || (Array.isArray(art.keyTakeaways) && art.keyTakeaways[0]) || art.subtitle || art.excerpt || '',
    author: art.author || {
      name: 'Lady Dakore Ekpendu',
      role: 'Executive Director & Chief Editor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    isRealUpload: isReal
  };
}

function buildHeroStories(articles, isDummyPurged) {
  if (!Array.isArray(articles) || articles.length === 0) {
    return isDummyPurged ? [] : SEED_HERO_STORIES;
  }

  // Separate real uploads vs dummy seed stories
  const realArticles = articles.filter(a => 
    a.isRealUpload || 
    (a.id && !a.id.startsWith('hero-rot-') && !a.id.startsWith('art-00'))
  );

  const realStories = realArticles.map(mapArticleToStory);

  if (isDummyPurged) {
    // Admin permanently removed all dummy news: show strictly real articles
    return realStories.length > 0 ? realStories : SEED_HERO_STORIES.slice(0, 1);
  }

  // Automatic phase-out: for each real article uploaded, 1 dummy story is phased out from the end
  const remainingDummyCount = Math.max(0, SEED_HERO_STORIES.length - realStories.length);
  const remainingDummies = SEED_HERO_STORIES.slice(0, remainingDummyCount);

  // Real news/reports automatically take the top box spaces, pushing dummies to the very last
  const combined = [...realStories, ...remainingDummies];
  return combined.length > 0 ? combined : SEED_HERO_STORIES;
}

export default function HeroFeatured({ initialArticles = [] }) {
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [savedIds, setSavedIds] = useState([]);

  // Live stories list state
  const [stories, setStories] = useState(() => {
    return buildHeroStories(initialArticles, false);
  });

  // Client-side real-time sync with server & broadcast events
  const syncArticles = useCallback((newArticlesList, isPurged) => {
    const updated = buildHeroStories(newArticlesList, isPurged);
    if (updated.length > 0) {
      setStories(updated);
    }
  }, []);

  useEffect(() => {
    // 1. Fetch live articles from API on mount
    let isMounted = true;
    fetch('/api/articles', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (!isMounted || !data?.articles) return;
        const real = data.articles.filter(a => a.isRealUpload);
        try {
          localStorage.setItem('pisa_custom_articles', JSON.stringify(real));
          localStorage.setItem('pisa_articles_meta', JSON.stringify({
            isDummyPurged: Boolean(data.isDummyPurged),
            deletedDummyIds: []
          }));
        } catch (_) {}
        syncArticles(data.articles, Boolean(data.isDummyPurged));
      })
      .catch(() => {});

    // 2. Listen to custom in-window update events
    const handleUpdatedEvent = (e) => {
      if (e?.detail?.articles) {
        syncArticles(e.detail.articles, Boolean(e.detail.isDummyPurged));
      }
    };
    window.addEventListener('pisa_articles_updated', handleUpdatedEvent);

    // 3. Listen to cross-tab BroadcastChannel
    let channel = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('pisa_articles_channel');
        channel.onmessage = (e) => {
          if (e?.data?.articles) {
            syncArticles(e.data.articles, Boolean(e.data.isDummyPurged));
          }
        };
      }
    } catch (_) {}

    return () => {
      isMounted = false;
      window.removeEventListener('pisa_articles_updated', handleUpdatedEvent);
      if (channel) {
        try { channel.close(); } catch (_) {}
      }
    };
  }, [syncArticles]);

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

  // Separate real uploads vs dummy seed stories
  const realStories = useMemo(() => {
    return stories.filter((s) => s.isRealUpload);
  }, [stories]);

  const hasRealStories = realStories.length > 0;

  // The pool of stories for the main featured hero card:
  // - If real stories exist: rotate ONLY between real stories (if > 1).
  //   DUMMY STORIES NEVER DISPLACE OR REPLACE REAL ARTICLES IN THE LEAD FEATURE SPOT.
  // - If no real stories exist yet: rotate through the default seed stories.
  const featuredPool = hasRealStories ? realStories : stories;

  // Auto-rotate stories smoothly unless user hovers
  useEffect(() => {
    if (!isAutoPlaying || featuredPool.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPool.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredPool.length]);

  const nextStory = () => {
    if (featuredPool.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % featuredPool.length);
  };

  const prevStory = () => {
    if (featuredPool.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + featuredPool.length) % featuredPool.length);
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

  const safeIndex = currentIndex >= featuredPool.length ? 0 : currentIndex;
  const activeStory = featuredPool[safeIndex] || stories[0] || SEED_HERO_STORIES[0];
  // Up to 4 other trending stories in side queue
  const sideQueue = stories.filter((s) => s.id !== activeStory.id && s.slug !== activeStory.slug).slice(0, 4);

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
            
            {/* Lead Image & Overlay - Clickable */}
            <Link 
              href={`/article/${activeStory.slug}`}
              className="block relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-950 cursor-pointer"
            >
              {activeStory.isRealUpload ? (
                <>
                  <Image
                    src={activeStory.image}
                    alt={activeStory.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"></div>

                  {/* News Section on Left Corner - Small discrete writing, stays strictly on left corner */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 max-w-[32%] sm:max-w-[160px]">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-slate-900/85 backdrop-blur-md text-white text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-tight border border-white/20 shadow-xs truncate max-w-full">
                      {activeStory.category === 'Cybersecurity' ? 'Digital Security' : activeStory.category}
                    </span>
                  </div>

                  {/* Latest or Breaking at Top Right Corner */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 z-20">
                    {activeStory.isBreaking ? (
                      <span className="px-2 py-0.5 rounded-md bg-red-600/95 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Flame className="w-2.5 h-2.5 text-amber-200" />
                        <span>BREAKING</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/60 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>LATEST</span>
                      </span>
                    )}

                    {/* Bookmark Save Button */}
                    <button
                      onClick={(e) => toggleSave(activeStory, e)}
                      className="p-1.5 rounded-full bg-slate-900/80 hover:bg-amber-600 text-white backdrop-blur-md border border-slate-700 transition-colors shadow-sm"
                      title={savedIds.includes(activeStory.id) || savedIds.includes(activeStory.slug) ? "Saved to Reading List" : "Save Story"}
                      aria-label="Save story"
                    >
                      <Bookmark className={`w-3 h-3 ${savedIds.includes(activeStory.id) || savedIds.includes(activeStory.slug) ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>
                  </div>

                  {/* Meta Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between text-xs sm:text-sm text-white z-10">
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
                </>
              ) : (
                <div className="w-full h-full bg-radial-[at_top_left] from-slate-900 via-slate-950 to-black p-5 sm:p-7 flex flex-col justify-between border-b border-amber-600/30 overflow-hidden select-none">
                  {/* Tactical Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab3080c_1px,transparent_1px),linear-gradient(to_bottom,#eab3080c_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                  {/* Badges Over Card: Category on Left, Breaking/Latest on Right */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-tight border border-slate-700 shadow-xs max-w-[32%] sm:max-w-[160px] truncate">
                      {activeStory.category === 'Cybersecurity' ? 'Digital Security' : activeStory.category}
                    </span>
                    {activeStory.isBreaking ? (
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 text-amber-200" />
                        <span>BREAKING</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-600/90 text-white border border-emerald-400/60 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>LATEST</span>
                      </span>
                    )}
                  </div>

                  {/* Centered Incoming Typography */}
                  <div className="relative z-10 text-center py-6 sm:py-8 my-auto">
                    <div className="text-amber-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-1.5 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      <span>Official Bureau Intelligence Radar</span>
                    </div>
                    <div className="text-base sm:text-xl md:text-2xl font-black tracking-wider uppercase font-mono text-white group-hover:text-amber-400 transition-colors drop-shadow-lg px-2">
                      {getSectionIncomingTitle(activeStory.category || activeStory.categorySlug, activeStory)}
                    </div>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-mono mt-1.5">
                      SEC-DISPATCH // AWAITING REAL-TIME TRANSMISSION
                    </p>
                  </div>

                  {/* Bottom Telemetry Bar */}
                  <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm text-white pt-2 border-t border-slate-800">
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
              )}
            </Link>

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

              {/* Author & Read Dossier CTA with Official Bureau Badge (No dummy photo) */}
              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border-2 border-amber-600/70 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
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
                {safeIndex + 1}/{featuredPool.length}
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
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {story.isRealUpload ? (
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 p-1 flex flex-col items-center justify-center text-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mb-0.5"></span>
                        <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-tight text-amber-300 font-mono leading-tight whitespace-pre-line">
                          {getSectionIncomingCompact(story.category || story.categorySlug, story)}
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider bg-slate-900/90 text-amber-300 z-10">
                      {story.threatLevel}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                        <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider truncate flex items-center gap-1">
                          <span>{story.category}</span>
                          {story.isRealUpload && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                          )}
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
              {stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === safeIndex 
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
