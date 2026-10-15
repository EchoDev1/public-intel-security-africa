import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { WOMEN_IN_SECURITY } from '@/lib/data/womenInSecurity';

export const metadata = {
  title: 'Women in Security & Peacebuilding Network',
  description:
    'Championing female military commanders, cyber forensics experts, and strategic negotiators advancing peace and security architectures across Africa.',
  alternates: {
    canonical: '/women-in-security',
  },
  openGraph: {
    title: 'Women in Security & Peacebuilding Network | Public Intel Africa',
    description:
      'Spotlighting female defense leaders, forensic specialists, and policy architects in Africa.',
    url: '/women-in-security',
  },
};

export default function WomenInSecurityPage() {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 p-8 md:p-14 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>UNSCR 1325 & Strategic Leadership</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif leading-tight">
            Women in Security & Peacebuilding Network
          </h1>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
            Honoring and empowering female defense commanders, intelligence analysts, maritime directors, forensic scientists, and grassroots peace negotiators transforming African security.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 font-semibold">
            <span>Leadership Profiles</span>
            <span>•</span>
            <span>Executive Mentorship</span>
            <span>•</span>
            <span className="text-amber-800">Annual Summit 2026</span>
          </div>
        </div>
      </div>

      {/* Directory of Women Leaders */}
      <section className="space-y-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            Distinguished Security Pioneers & Strategists
          </h2>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {WOMEN_IN_SECURITY.length} Leaders Profiled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WOMEN_IN_SECURITY.map((leader) => (
            <div
              key={leader.id}
              className="rounded-3xl bg-white border border-slate-200 hover:border-amber-600 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-amber-600 shrink-0 flex items-center justify-center">
                    {(() => {
                      const rawImg = leader.image || leader.imageUrl;
                      const leaderImg = (typeof rawImg === 'string' && rawImg.trim().length > 0) ? rawImg.trim() : null;
                      return leaderImg ? (
                        <Image
                          src={leaderImg}
                          alt={leader.name || 'Leader'}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-amber-700 bg-amber-50 text-xl font-serif">
                          {leader.name ? leader.name.charAt(0) : 'W'}
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {leader.country} • {leader.specialization}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 font-serif mt-0.5">
                      {leader.name}
                    </h3>
                    <p className="text-xs text-slate-600">{leader.title}</p>
                    <p className="text-xs text-slate-500 font-semibold">{leader.organization}</p>
                  </div>
                </div>

                {leader.featuredQuote && (
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-800 italic font-medium">
                    &ldquo;{leader.featuredQuote}&rdquo;
                  </div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">
                  {leader.bio}
                </p>

                {leader.achievements && (
                  <div className="space-y-1.5 pt-2">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                      Key Career Breakthroughs:
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-700 font-medium">
                      {leader.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Specialist Fellow</span>
                <Link
                  href="/contacts"
                  className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
                >
                  <span>Request Keynote / Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
