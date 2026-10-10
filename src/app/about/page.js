import React from 'react';
import Link from 'next/link';
import { Shield, Award, Globe, Radio, Tv } from 'lucide-react';

export default function AboutPage() {
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
