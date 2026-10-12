'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Radio, 
  Tv, 
  Lock, 
  Globe, 
  MapPin, 
  ArrowUpRight,
  Headphones,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import Logo from './Logo';
import SocialIcon from './SocialIcon';
import { INITIAL_SOCIAL_LINKS } from '@/lib/data/socials';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 pt-16 pb-28 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info & Mission Statement */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="dark" size="default" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Public Intel Security Africa is a leading multi-platform security media production of <strong>Plugins Media Limited</strong>, dedicated to reshaping public discourse on security through informed journalism, expert analysis, strategic dialogue, and solution-driven events.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-300 font-semibold">
              <span className="flex items-center gap-1 text-amber-400">
                <Radio className="w-3.5 h-3.5" />
                Radio
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-red-400">
                <Tv className="w-3.5 h-3.5" />
                Television
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Globe className="w-3.5 h-3.5" />
                Digital Media
              </span>
              <span>•</span>
              <span className="text-slate-400">Specialized Print</span>
            </div>
          </div>

          {/* Regional Bureaus & Head Offices */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">
              Continental Bureau Network
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>West Africa Bureau:</strong> Plot 428 Constitution Ave, Central Business District, Abuja / Lagos, Nigeria</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>East & Horn Bureau:</strong> Riverside Square, Nairobi, Kenya</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Southern Africa Bureau:</strong> Sandton City Tower, Johannesburg, South Africa</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>North Africa Bureau:</strong> New Cairo Tech District, Cairo, Egypt</span>
              </div>
            </div>
          </div>

          {/* Encrypted Whistleblower Hotline */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypted Intelligence Tip Line</span>
            </h4>
            <p className="text-xs text-slate-400">
              For high-risk confidential disclosures, investigative tips, and verified leaks:
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="text-amber-400 font-bold">tips@publicintelsecurity.africa</div>
              <div className="text-slate-300">Signal / PGP: +234 800-PUBLIC-INTEL</div>
            </div>
            <Link
              href="/eyewitness-reports"
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold"
            >
              <span>Submit Whistleblower Report</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Official Social Media Community Bar */}
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">
                Official Intelligence Channels & Social Media
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Follow our breaking dispatches, field broadcasts, and executive discussions across verified platforms.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {INITIAL_SOCIAL_LINKS.map((soc) => (
              <Link
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${soc.platform} (${soc.handle}) - ${soc.category}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 transition-all text-xs font-semibold group shadow-2xs hover:scale-105"
              >
                <span className="text-amber-400 group-hover:text-amber-300 transition-colors">
                  <SocialIcon platform={soc.platform} className="w-4 h-4" />
                </span>
                <span className="hidden sm:inline text-[11px]">{soc.platform}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <strong>Public Intel Security Africa</strong>. A Multi-Platform Media Production of <strong>Plugins Media Limited</strong>. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-medium">
            <Link href="/about" className="hover:text-amber-400">About the Production</Link>
            <span>•</span>
            <Link href="/partnership" className="hover:text-amber-400">Partnership Framework</Link>
            <span>•</span>
            <Link href="/contacts" className="hover:text-amber-400">Bureau Directory</Link>
            <span>•</span>
            <Link href="/coverage" className="hover:text-amber-400">Intelligence Wire</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
