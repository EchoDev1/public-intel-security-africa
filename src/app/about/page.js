import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Award, Globe, Radio, Tv, Users, CheckCircle } from 'lucide-react';
import { getContent } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Institutional Profile & Mandate | Plugins Media Limited',
  description:
    'Public Intel Security Africa is a leading multi-platform security media production of Plugins Media Limited, dedicated to reshaping public discourse on African security through informed journalism and strategic dialogue.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Public Intel Security Africa | Plugins Media Limited',
    description:
      'Reshaping public discourse on African security through informed journalism, expert analysis, and strategic dialogue.',
    url: '/about',
  },
};

const DEFAULT_EDITORIAL_TEAM = [
  {
    id: 'team-01',
    name: 'Lady Dakore Ekpendu',
    role: 'Executive Director & Editor-in-Chief',
    bureau: 'Abuja Headquarters (West Africa)',
    clearance: 'Super Admin / Top Secret',
    beats: 'Defense Policy, Intelligence Synthesis, High-Level Strategic Summits',
    status: 'Active Command',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'Ekpendudakore@gmail.com'
  },
  {
    id: 'team-02',
    name: 'Capt. (Ret.) Tariq Adeleke',
    role: 'Senior Naval & Littoral Security Analyst',
    bureau: 'Lagos Maritime Operations Desk',
    clearance: 'Level 4 Intelligence Clearance',
    beats: 'Gulf of Guinea Maritime Defense, Autonomous Sensors, Anti-Piracy',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    email: 'tariq.adeleke@publicintelsecurity.africa'
  },
  {
    id: 'team-03',
    name: 'Dr. Raymond Adeyemi',
    role: 'Head of Asymmetric Warfare & Sahel Desk',
    bureau: 'Nairobi Bureau (East & Horn)',
    clearance: 'Level 4 Intelligence Clearance',
    beats: 'UAV Telemetry, Counter-Insurgency, Trans-Border Militias',
    status: 'On Field Assignment',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: 'raymond.adeyemi@publicintelsecurity.africa'
  },
  {
    id: 'team-04',
    name: 'Farida Al-Mansoor',
    role: 'North Africa & Mediterranean Security Fellow',
    bureau: 'Cairo Strategic Hub',
    clearance: 'Level 3 Analyst Clearance',
    beats: 'Critical Infrastructure, Cyber Threats, Geopolitics',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'farida.mansoor@publicintelsecurity.africa'
  }
];

export default async function AboutPage() {
  const editorialTeam = await getContent('editorial_team', DEFAULT_EDITORIAL_TEAM);
  const teamList = Array.isArray(editorialTeam) && editorialTeam.length > 0 ? editorialTeam : DEFAULT_EDITORIAL_TEAM;

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5 text-amber-700" />
          <span>Institutional Profile</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          About Public Intel Security Africa
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          A leading multi-platform security media production of <strong>Plugins Media Limited</strong>.
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-8 md:p-12 shadow-lg space-y-6 text-slate-700 text-sm md:text-base leading-relaxed">
        
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold leading-relaxed">
          Public Intel Security Africa is dedicated to reshaping public discourse on security through informed journalism, expert analysis, strategic dialogue, and solution-driven events.
        </div>

        <p>
          <strong>Public Intel Security Africa</strong> has evolved into a respected media platform recognized for bringing security conversations closer to citizens, institutions, policymakers, security professionals, academics, development partners, and the private sector.
        </p>

        <p>
          The production continues to expand across <strong>radio, television, digital media</strong>, and advancing toward a specialized <strong>print publication</strong>, positioning itself as one of Africa&apos;s emerging voices in strategic security communication.
        </p>

        <h3 className="text-xl font-bold text-slate-900 font-serif pt-4">
          Holistic Security Mandate
        </h3>

        <p>
          The platform explores the broader dimensions of human, national, environmental, economic, technological, health, food, maritime, cyber, energy, climate, community, and developmental security, demonstrating how security intersects with every aspect of society.
        </p>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5 font-serif">
              <Radio className="w-4 h-4 text-amber-700" />
              <span>Public Intel Radio (24/7)</span>
            </h4>
            <p className="text-xs text-slate-600">
              Live continental threat intelligence broadcasts, expert panels, and field telemetry dispatches.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="text-sm font-bold text-red-700 flex items-center gap-1.5 font-serif">
              <Tv className="w-4 h-4 text-red-600" />
              <span>Public Intel Television</span>
            </h4>
            <p className="text-xs text-slate-600">
              High-definition video bulletins, investigative documentaries, and ministerial war room debates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 font-serif">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Security Training Academy</span>
            </h4>
            <p className="text-xs text-slate-600">
              Accredited capacity-building courses in OSINT, HEAT hostile environment awareness, and cyber defense.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-1.5 font-serif">
              <Globe className="w-4 h-4 text-blue-700" />
              <span>Continental Bureau Network</span>
            </h4>
            <p className="text-xs text-slate-600">
              Stationed field correspondents across Abuja, Nairobi, Johannesburg, Cairo, Addis Ababa, and Dakar.
            </p>
          </div>
        </div>

      </div>

      {/* Editorial Board & Fellows */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>Newsroom Leadership</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-serif">
            Editorial Board & Strategic Fellows
          </h2>
          <p className="text-xs text-slate-500">
            Frontline defense correspondents, naval analysts, and investigative researchers guiding Public Intel Security Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamList.map((member) => (
            <div key={member.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                    {member.avatar ? (
                      <Image src={member.avatar} alt={member.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-amber-700 bg-amber-100 text-xl">
                        {member.name?.charAt(0) || 'F'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-serif">{member.name}</h3>
                    <div className="text-xs text-amber-800 font-semibold">{member.role}</div>
                    <div className="text-[11px] text-slate-500">{member.bureau}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Clearance / Credential:</span>
                    <span className="font-mono text-slate-800 font-medium">{member.clearance}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Focus Areas & Beats:</span>
                    <span className="text-slate-700 leading-snug">{member.beats}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {member.status || 'Active Command'}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">{member.email}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA to Partnerships */}
      <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-serif">
            Interested in Collaborating with Our Media Production?
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Explore our institutional co-production, broadcast syndication, and conference hosting options.
          </p>
        </div>
        <Link
          href="/partnership"
          className="px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-transform hover:scale-105 shadow-sm"
        >
          Partnership Portal →
        </Link>
      </div>

    </div>
  );
}
