import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Lock, 
  Eye
} from 'lucide-react';
import HeroFeatured from '@/components/HeroFeatured';
import ThreatRadarWidget from '@/components/ThreatRadarWidget';
import ArticleCard from '@/components/ArticleCard';
import MultimediaSection from '@/components/MultimediaSection';
import WorldNewsSection from '@/components/WorldNewsSection';
import WomenInSecuritySpotlight from '@/components/WomenInSecuritySpotlight';
import TrainingAcademySection from '@/components/TrainingAcademySection';
import EconomicSecuritySection from '@/components/EconomicSecuritySection';
import NewsletterSection from '@/components/NewsletterSection';
import { ARTICLES, getSpecialReports } from '@/lib/data/articles';

export default function HomePage() {
  const specialReports = getSpecialReports();

  return (
    <div className="space-y-10 sm:space-y-12 pb-16 bg-white dark:bg-slate-950 transition-colors">
      
      {/* 1. Hero Featured Section (Current Hero Page + Trending in All Features side-by-side) */}
      <HeroFeatured />

      {/* 2. Special Reports & Strategic Investigations Grid (Immediately after Hero) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                In-Depth Dossiers
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-serif mt-1">
              Special Investigative Reports
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Longform investigations, data forensics, and policy whitepapers authored by the Public Intel Bureau.
            </p>
          </div>

          <Link
            href="/special-reports"
            className="inline-flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold uppercase tracking-wider transition-colors"
          >
            <span>View All Special Reports</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialReports.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* 3. World News & Global Geopolitics (Clean 3-Card Grid Immediately after Special Reports) */}
      <WorldNewsSection />

      {/* 4. Continental Security Threat Matrix (Situational Awareness Widget) */}
      <ThreatRadarWidget />

      {/* 5. Multimedia Hub: TV, Radio, Podcasts, Webinars */}
      <MultimediaSection />

      {/* 7. Whistleblower & Citizen Intelligence Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                <Eye className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-red-400">
                Confidential Whistleblower & Community Intelligence
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white font-serif">
              Have Firsthand Security Intelligence or Evidence?
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Public Intel Security Africa provides guaranteed zero-knowledge encrypted channels for community monitors, frontline personnel, and citizens to report anomalous movements, maritime incidents, or infrastructure risks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
            <Link
              href="/eyewitness-reports"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <Lock className="w-4 h-4" />
              <span>Submit Secure Field Intel</span>
            </Link>
            <Link
              href="/community-reports"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Community Reports</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Women in Security Leadership Spotlight */}
      <WomenInSecuritySpotlight />

      {/* 9. Security Training Academy */}
      <TrainingAcademySection />

      {/* 10. Economic & Financial Security Sector Desk */}
      <EconomicSecuritySection />

      {/* 11. Daily Intelligence Briefing Newsletter */}
      <NewsletterSection />

    </div>
  );
}
